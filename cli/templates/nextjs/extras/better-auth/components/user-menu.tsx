"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { LogOutIcon, UserIcon } from "lucide-react"
import { useTransition } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"

export interface SidebarUser {
  name: string
  email: string
  image: string | null
}

interface UserMenuProps {
  user: SidebarUser
  compact?: boolean
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/u)
  const first = parts[0]?.[0] ?? ""
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""
  return (first + second).toUpperCase() || "U"
}

export function UserMenu({ user, compact = false }: UserMenuProps): React.ReactElement {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSignOut(): void {
    startTransition(async () => {
      await authClient.signOut()
      router.push("/sign-in")
      router.refresh()
    })
  }

  const avatar = (
    <Avatar className="size-7">
      {user.image ? (
        <Image
          alt={user.name}
          src={user.image}
          width={28}
          height={28}
          unoptimized
          className="aspect-square size-full rounded-full object-cover"
        />
      ) : null}
      <AvatarFallback>{initials(user.name)}</AvatarFallback>
    </Avatar>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-md p-1 text-left text-sm outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:opacity-60"
        disabled={isPending}
      >
        {avatar}
        {compact ? null : (
          <div className="flex flex-1 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/dashboard/settings")}>
          <UserIcon />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut} disabled={isPending}>
          <LogOutIcon />
          {isPending ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
