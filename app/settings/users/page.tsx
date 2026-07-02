"use client"

import { UserManagementSettings } from "@/components/settings/user-management-settings"
import { FinancialSettingsChat } from "@/components/financial-settings-chat"
import type { ComponentProps } from "react"
import { UserPlus, UserCog, TrashIcon as UserTrash, UserSearch } from "lucide-react" // Icons for user management

// Define suggested prompts for User Management
const userManagementSuggestedPrompts: ComponentProps<typeof FinancialSettingsChat>["customSuggestedPrompts"] = [
  {
    id: "um_sp1",
    text: "How to add a new user?",
    icon: UserPlus,
    // sectionId could point to a specific part of UserManagementSettings if it had sub-sections
  },
  {
    id: "um_sp2",
    text: "Edit user permissions", // General query, AI will guide
    icon: UserCog,
  },
  {
    id: "um_sp3",
    text: "How to remove a user?",
    icon: UserTrash,
  },
  {
    id: "um_sp4",
    text: "Search for a specific user",
    icon: UserSearch,
  },
]

export default function UserManagementPage() {
  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-gray-200 h-full flex-shrink-0">
        <FinancialSettingsChat
          title="Settings Assistant"
          customSuggestedPrompts={userManagementSuggestedPrompts}
          // scrollToSection can be omitted if not applicable here or UserManagementSettings doesn't have scrollable sub-sections
        />
      </div>
      <div className="flex-1 p-0 overflow-y-auto">
        <UserManagementSettings />
      </div>
    </div>
  )
}
