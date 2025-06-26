"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

type Stage = "New" | "Qualified" | "Meeting" | "Underwriting" | "Approved"

interface Borrower {
  id: string
  name: string
  company: string
  avatarUrl: string
  avatarFallback: string
  date: string
  amount: string
  stage: Stage
  dateColorClass: string // For badge background
}

const initialBorrowers: Borrower[] = [
  {
    id: "b1",
    name: "Carter Lexington",
    company: "Skyward Tech Solutions",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "CL",
    date: "Apr 4",
    amount: "$50,000",
    stage: "New",
    dateColorClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "b2",
    name: "Natalie Vaughn",
    company: "Echo Dynamics",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "NV",
    date: "Apr 3",
    amount: "$10,000",
    stage: "New",
    dateColorClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "b3",
    name: "Jackson Pearce",
    company: "Luminous Analytics",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "JP",
    date: "Mar 23",
    amount: "$15,000",
    stage: "New",
    dateColorClass: "bg-green-100 text-green-700",
  },
  {
    id: "b4",
    name: "Marcus Reynolds",
    company: "Quantum Innovations",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "MR",
    date: "May 12",
    amount: "$75,000",
    stage: "Qualified",
    dateColorClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "b5",
    name: "Elena Rodriguez",
    company: "Nexus Technologies",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "ER",
    date: "May 9",
    amount: "$45,000",
    stage: "Qualified",
    dateColorClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "b6",
    name: "Tyler Harrison",
    company: "Zenith Enterprises",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "TH",
    date: "May 5",
    amount: "$30,000",
    stage: "Qualified",
    dateColorClass: "bg-green-100 text-green-700",
  },
  {
    id: "b7",
    name: "Ethan Kingsley",
    company: "Frontier Dynamics",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "EK",
    date: "Jun 15",
    amount: "$90,000",
    stage: "Meeting",
    dateColorClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "b8",
    name: "Sophia Ramirez",
    company: "Horizon Innovations",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "SR",
    date: "Jun 10",
    amount: "$65,000",
    stage: "Meeting",
    dateColorClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "b9",
    name: "Liam Chen",
    company: "Apex Solutions",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "LC",
    date: "Jul 1",
    amount: "$120,000",
    stage: "Underwriting",
    dateColorClass: "bg-purple-100 text-purple-700",
  },
  {
    id: "b10",
    name: "Olivia Patel",
    company: "Stellar Corp",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    avatarFallback: "OP",
    date: "Jul 5",
    amount: "$200,000",
    stage: "Approved",
    dateColorClass: "bg-teal-100 text-teal-700",
  },
]

const stages: Stage[] = ["New", "Qualified", "Meeting", "Underwriting", "Approved"]

export default function PortfolioKanbanPage() {
  // In a real app, you'd fetch and manage borrowers, possibly with drag and drop.
  // For this example, we'll just filter the initialBorrowers by stage.

  return (
    <div className="flex-1 bg-white p-6">
      {" "}
      {/* Changed background to white to match screenshot */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Loan Underwriting Pipeline</h1>
        <p className="text-sm text-gray-500">Track borrowers through the underwriting process.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stages.map((stage) => (
          <div key={stage} className="bg-gray-100 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">{stage}</h2>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              {initialBorrowers
                .filter((borrower) => borrower.stage === stage)
                .map((borrower) => (
                  <Card key={borrower.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={borrower.avatarUrl || "/placeholder.svg"} alt={borrower.name} />
                          <AvatarFallback>{borrower.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-800">{borrower.name}</p>
                          <p className="text-xs text-gray-500">{borrower.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${borrower.dateColorClass}`}>
                          {borrower.date}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                          {borrower.amount}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
