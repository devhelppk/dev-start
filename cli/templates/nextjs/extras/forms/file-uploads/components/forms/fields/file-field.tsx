"use client";

import { FileUpload, type UploadResult } from "@/components/file-upload";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import type { FieldProps } from "@/lib/forms/types";

function FileField({
  field,
  fieldDef,
  error,
}: FieldProps): React.ReactElement {
  const accept =
    fieldDef.config && "accept" in fieldDef.config
      ? fieldDef.config.accept
      : undefined;
  const maxSizeMB =
    fieldDef.config && "maxSizeMB" in fieldDef.config
      ? fieldDef.config.maxSizeMB
      : undefined;

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={fieldDef.id}>{fieldDef.label}</FieldLabel>
      <FileUpload
        accept={accept}
        maxSizeMB={maxSizeMB}
        onUploadComplete={(results: readonly UploadResult[]) => {
          const first = results[0];
          field.onChange(first ? first.key : "");
        }}
      />
      {field.value ? (
        <p className="text-sm text-muted-foreground">
          Uploaded: {String(field.value)}
        </p>
      ) : null}
      {fieldDef.helperText && !error ? (
        <FieldDescription>{fieldDef.helperText}</FieldDescription>
      ) : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

export { FileField };
