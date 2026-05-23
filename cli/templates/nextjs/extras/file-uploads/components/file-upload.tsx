"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FileStatus = "queued" | "uploading" | "complete" | "error"

interface FileEntry {
  id: string
  file: File
  status: FileStatus
  progress: number
  key: string | null
  error: string | null
  previewUrl: string | null
}

export interface UploadResult {
  file: File
  key: string
}

interface FileUploadProps {
  multiple?: boolean
  accept?: string
  maxSizeMB?: number
  onUploadComplete?: (results: readonly UploadResult[]) => void
  onError?: (error: Error) => void
  className?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImageType(type: string): boolean {
  return type.startsWith("image/")
}

function createFileEntry(file: File): FileEntry {
  return {
    id: crypto.randomUUID(),
    file,
    status: "queued",
    progress: 0,
    key: null,
    error: null,
    previewUrl: isImageType(file.type) ? URL.createObjectURL(file) : null,
  }
}

interface PresignResponse {
  url: string
  key: string
}

interface ErrorResponse {
  error: string
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (typeof value !== "object" || value === null || !("error" in value)) {
    return false
  }
  return typeof value.error === "string"
}

async function presignFile(
  file: File,
): Promise<PresignResponse> {
  const response = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    }),
  })

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const message = isErrorResponse(body)
      ? body.error
      : "Failed to get upload URL"
    throw new Error(message)
  }

  const data: PresignResponse = await response.json()
  return data
}

function uploadToS3(
  url: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type)

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    })

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener("error", () => reject(new Error("Upload failed")))
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")))

    xhr.send(file)
  })
}

export function FileUpload({
  multiple = false,
  accept,
  maxSizeMB = 10,
  onUploadComplete,
  onError,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const updateFile = useCallback(
    (id: string, updates: Partial<FileEntry>) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      )
    },
    [],
  )

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSizeBytes) {
        return `File too large (${formatFileSize(file.size)}). Maximum is ${maxSizeMB}MB.`
      }
      if (accept) {
        const acceptedTypes = accept.split(",").map((t) => t.trim())
        const matches = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase())
          }
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.slice(0, -1))
          }
          return file.type === type
        })
        if (!matches) {
          return `File type not accepted: ${file.type || "unknown"}`
        }
      }
      return null
    },
    [accept, maxSizeBytes, maxSizeMB],
  )

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles)
      const toAdd = multiple ? fileArray : fileArray.slice(0, 1)

      const entries = toAdd.map((file) => {
        const entry = createFileEntry(file)
        const validationError = validateFile(file)
        if (validationError) {
          entry.status = "error"
          entry.error = validationError
        }
        return entry
      })

      setFiles((prev) => (multiple ? [...prev, ...entries] : entries))
    },
    [multiple, validateFile],
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const entry = prev.find((f) => f.id === id)
      if (entry?.previewUrl) {
        URL.revokeObjectURL(entry.previewUrl)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const uploadFile = useCallback(
    async (entry: FileEntry): Promise<UploadResult | null> => {
      updateFile(entry.id, { status: "uploading", progress: 0, error: null })

      try {
        const { url, key } = await presignFile(entry.file)
        await uploadToS3(url, entry.file, (progress) => {
          updateFile(entry.id, { progress })
        })
        updateFile(entry.id, {
          status: "complete",
          progress: 100,
          key,
        })
        return { file: entry.file, key }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed"
        updateFile(entry.id, { status: "error", error: message })
        return null
      }
    },
    [updateFile],
  )

  const handleUpload = useCallback(async () => {
    const pending = files.filter(
      (f) => f.status === "queued" || f.status === "error",
    )
    if (pending.length === 0) return

    setIsUploading(true)

    try {
      const results = await Promise.all(pending.map(uploadFile))
      const successful = results.filter(
        (r): r is UploadResult => r !== null,
      )

      if (successful.length > 0) {
        onUploadComplete?.(successful)
      }

      const failed = results.filter((r) => r === null)
      if (failed.length > 0) {
        onError?.(
          new Error(`${failed.length} file(s) failed to upload`),
        )
      }
    } finally {
      setIsUploading(false)
    }
  }, [files, uploadFile, onUploadComplete, onError])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files)
        e.target.value = ""
      }
    },
    [addFiles],
  )

  const hasFiles = files.length > 0
  const hasPending = files.some(
    (f) => f.status === "queued" || f.status === "error",
  )

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground/50"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Click to browse
          </span>{" "}
          or drag and drop
        </div>
        <div className="text-xs text-muted-foreground/70">
          {accept ? `Accepted: ${accept}` : "All file types"} &middot;
          Max {maxSizeMB}MB
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      {hasFiles && (
        <div className="flex flex-col gap-2">
          {files.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 ring-1 ring-foreground/10"
            >
              {entry.previewUrl ? (
                <Image
                  src={entry.previewUrl}
                  alt={entry.file.name}
                  width={40}
                  height={40}
                  unoptimized
                  className="size-10 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  </svg>
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">
                    {entry.file.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatFileSize(entry.file.size)}
                  </span>
                </div>

                {entry.status === "uploading" && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-200"
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                )}

                {entry.status === "complete" && (
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Uploaded
                  </span>
                )}

                {entry.status === "error" && (
                  <span className="text-xs text-destructive">
                    {entry.error}
                  </span>
                )}
              </div>

              {entry.status !== "uploading" && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(entry.id)
                  }}
                  aria-label={`Remove ${entry.file.name}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                  </svg>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {hasFiles && hasPending && (
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className="self-end"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      )}
    </div>
  )
}
