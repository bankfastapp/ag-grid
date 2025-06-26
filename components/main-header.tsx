"use client"
import Link from "next/link"
// Image component removed, Landmark icon will be used
import { Button } from "@/components/ui/button"
import { Bell, Landmark } from "lucide-react" // Imported Landmark
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/compliance", text: "Compliance" },
  { href: "/pipeline", text: "Pipeline" },
  { href: "/analyst", text: "Analyst" },
  { href: "/docs", text: "Docs" },
  { href: "/vault", text: "Vault" },
  { href: "/portfolio", text: "Portfolio" },
]

export function MainHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-gray-900 text-white border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-[var(--header-height)] flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            {/* Replaced Image with Landmark icon */}
            <Landmark className="h-7 w-7 text-sky-500" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-gray-300 hover:text-white transition-colors",
                  (pathname === link.href || (link.href === "/portfolio" && pathname.startsWith("/portfolio"))) &&
                    "text-white underline underline-offset-4 decoration-sky-500",
                )}
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-700">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="sr-only">View notifications</span>
          </Button>
          {/* User avatar/menu can be added here */}
        </div>
      </div>
    </header>
  )
}
