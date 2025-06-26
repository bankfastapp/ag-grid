import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 bg-background">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Pipeline Page...</p>
      </div>
    </div>
  )
}
