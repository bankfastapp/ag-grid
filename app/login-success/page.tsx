"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoginSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/settings/institution") // Updated redirect path
    }, 3000) // 3-second delay

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-foreground">Login Successful!</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Welcome back! You will be redirected to your institution settings shortly.
      </p>
      <Button variant="link" onClick={() => router.replace("/settings/institution")}>
        Go to Settings Now <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
