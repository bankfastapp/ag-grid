"use client"

import type React from "react"

import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface SidebarLinkProps extends React.ComponentProps<typeof Link> {
  icon: LucideIcon
  text: string
}

export default function SidebarLink({ icon: Icon, text, className, ...props }: SidebarLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{text}</span>
    </Link>
  )
}
