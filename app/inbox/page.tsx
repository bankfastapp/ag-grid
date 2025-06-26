import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Edit } from "lucide-react"

const messages = [
  {
    id: "msg1",
    sender: "Automated System",
    avatar: "/placeholder.svg?width=40&height=40",
    subject: "Alert: Loan Application #1023 Requires Review",
    snippet: "A new loan application from 'Global Corp Inc.' has a calculated risk score of 7.5...",
    time: "10:30 AM",
    unread: true,
    tags: ["Urgent", "Loan Review"],
  },
  {
    id: "msg2",
    sender: "Jane Doe (Compliance)",
    avatar: "/placeholder.svg?width=40&height=40",
    subject: "RE: Quarterly Compliance Report Q2",
    snippet: "Thanks for sending that over! I've reviewed the draft and have a few minor suggestions...",
    time: "Yesterday",
    unread: false,
    tags: ["Compliance"],
  },
  {
    id: "msg3",
    sender: "Platform Update",
    avatar: "/placeholder.svg?width=40&height=40",
    subject: "New Feature: Enhanced Reporting Tools",
    snippet: "We're excited to announce the rollout of our new advanced reporting features...",
    time: "Mon",
    unread: false,
    tags: ["Announcement"],
  },
  {
    id: "msg4",
    sender: "John Smith (Risk Analyst)",
    avatar: "/placeholder.svg?width=40&height=40",
    subject: "Risk Model Calibration Data",
    snippet: "Hi team, please find attached the latest data for our quarterly risk model calibration...",
    time: "Fri",
    unread: true,
    tags: ["Risk Model"],
  },
]

export default function InboxPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8 w-full md:w-64" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" /> Compose
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                  message.unread ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-semibold ${message.unread ? "text-foreground" : "text-muted-foreground"}`}>
                        {message.sender}
                      </span>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <h3 className={`text-sm font-medium mb-1 ${message.unread ? "text-primary" : "text-foreground"}`}>
                      {message.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate max-w-md md:max-w-lg">{message.snippet}</p>
                    <div className="mt-2 flex gap-2">
                      {message.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {message.unread && <div className="h-2.5 w-2.5 bg-primary rounded-full self-center ml-auto"></div>}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
