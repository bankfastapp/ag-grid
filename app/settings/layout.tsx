import type React from "react"
import { Settings, User2, Users, Landmark, FileText, Shield, Briefcase, Edit, ShieldCheck } from "lucide-react" // Added ShieldCheck
import SidebarLink from "@/components/sidebar-link"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-var(--header-height))] bg-background">
      <aside className="w-64 border-r p-4 flex flex-col space-y-4 overflow-y-auto flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-1 px-3">GENERAL</h2>
          <nav className="flex flex-col space-y-1">
            <SidebarLink href="/portfolio" icon={Briefcase} text="Portfolio" />
            <SidebarLink href="/settings/profile" icon={User2} text="My Profile" />
          </nav>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-1 px-3">ADMINISTRATION</h2>
          <nav className="flex flex-col space-y-1">
            <SidebarLink href="/settings/institution" icon={Settings} text="Institution" />
            <SidebarLink href="/settings/users" icon={Users} text="User Management" />
            <SidebarLink href="/settings/lending" icon={Landmark} text="Lending" />
            <SidebarLink href="/settings/risk" icon={Shield} text="Risk" />
            <SidebarLink href="/settings/compliance" icon={ShieldCheck} text="Compliance" /> {/* New Link */}
            <SidebarLink href="/settings/templates" icon={FileText} text="Templates" />
            <SidebarLink href="/settings/policy-editor" icon={Edit} text="Policy Editor" />
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  )
}
