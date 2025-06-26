import type React from "react"
// This is a simplified root layout.
// Ensure you have ThemeProvider and Toaster if used by other components.
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { MainHeader } from "@/components/main-header" // New global header
import { Toaster } from "@/components/ui/toaster" // Keep if useToast is used

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Financial Settings App",
  description: "Manage your financial institution's settings.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <MainHeader />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
