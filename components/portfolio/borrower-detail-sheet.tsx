"use client"

import type { Borrower } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  Copy,
  Link,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  ThumbsUp,
  User,
  Users,
} from "lucide-react"

interface Subtask {
  id: string
  text: string
  completed: boolean
}

interface Activity {
  id: string
  user: {
    name: string
    avatarUrl: string
    avatarFallback: string
  }
  action: string
  timestamp: string
}

const mockSubtasks: Subtask[] = [
  { id: "st1", text: "Verify Tax Returns (2 years)", completed: true },
  { id: "st2", text: "Complete UCC Search", completed: true },
  { id: "st3", text: "Obtain Certificate of Good Standing", completed: false },
  { id: "st4", text: "Review Final Title Opinion", completed: false },
]

const mockActivities: Activity[] = [
  {
    id: "a1",
    user: {
      name: "Manato Kuroda",
      avatarUrl: "/placeholder.svg?width=32&height=32",
      avatarFallback: "MK",
    },
    action: "created this task.",
    timestamp: "6 hours ago",
  },
  {
    id: "a2",
    user: {
      name: "Alicia Garcia",
      avatarUrl: "/placeholder.svg?width=32&height=32",
      avatarFallback: "AG",
    },
    action: "moved this from Qualified to Meeting.",
    timestamp: "4 hours ago",
  },
]

interface BorrowerDetailSheetProps {
  borrower: Borrower | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BorrowerDetailSheet({ borrower, open, onOpenChange }: BorrowerDetailSheetProps) {
  if (!borrower) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl p-0 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-start justify-between">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Mark as Approved
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <p>This loan is visible to its collaborators and members of the Underwriting workspace.</p>
          </div>

          <SheetHeader className="text-left">
            <SheetTitle className="text-3xl font-bold">{borrower.name}</SheetTitle>
            <p className="text-muted-foreground">{borrower.company}</p>
          </SheetHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-4">
              <p className="w-24 text-muted-foreground">Loan Officer</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={borrower.loanOfficer.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback>{borrower.loanOfficer.avatarFallback}</AvatarFallback>
                </Avatar>
                <span>{borrower.loanOfficer.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="w-24 text-muted-foreground">Next Action</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{borrower.date}</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <p className="w-24 text-muted-foreground pt-1.5">Product</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{borrower.loanProduct}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {borrower.stage} <ChevronDown className="h-3 w-3" />
                </Badge>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <Textarea
              placeholder="Add more detail to this loan..."
              defaultValue={borrower.description}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Subtasks</h3>
            <div className="space-y-2">
              {mockSubtasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <CheckCircle className={`h-4 w-4 ${task.completed ? "text-green-500" : "text-muted-foreground"}`} />
                  </Button>
                  <p className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.text}
                  </p>
                </div>
              ))}
              <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground">
                <Plus className="h-4 w-4" />
                Add subtask
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback>{activity.user.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p>
                    <span className="font-semibold">{activity.user.name}</span> {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="p-4 border-t bg-background">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?width=32&height=32" alt="Current User" />
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>
            <Input placeholder="Ask a question or post an update..." />
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Collaborators</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Leave task
            </Button>
          </div>
        </footer>
      </SheetContent>
    </Sheet>
  )
}
