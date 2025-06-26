"use client"

import React from "react"

import Link from "next/link"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Search, Plus, ListFilter, CheckCircle } from "lucide-react"
import type { PipelineSection } from "@/types"

const pipelineData: PipelineSection[] = [
  {
    title: "Past Due",
    tasks: [
      {
        id: "t1",
        name: "Finalize DSCR calculation for Robert J. Bauer",
        borrower: "Robert J. Bauer",
        dueDate: "Jun 20",
        loanType: "Term",
        status: "Past Due",
        tags: [{ text: "High Priority", color: "text-red-800", bgColor: "bg-red-100" }],
      },
      {
        id: "t2",
        name: "Receive signed Loan Agreement from T & T Holdings",
        borrower: "T & T Holdings",
        dueDate: "Jun 22",
        loanType: "Revolving",
        status: "Past Due",
        tags: [{ text: "Documentation", color: "text-yellow-800", bgColor: "bg-yellow-100" }],
      },
    ],
  },
  {
    title: "Due This Week",
    tasks: [
      {
        id: "t3",
        name: "Verify collateral coverage for InRoads",
        borrower: "InRoads",
        dueDate: "Jun 28",
        loanType: "Term",
        status: "In Progress",
        tags: [{ text: "Collateral Review", color: "text-blue-800", bgColor: "bg-blue-100" }],
      },
      {
        id: "t4",
        name: "Update CPLTD for Timothy J. Seubert",
        borrower: "Timothy J. Seubert",
        dueDate: "Jun 29",
        loanType: "Hybrid",
        status: "Pending",
        tags: [{ text: "Financials", color: "text-green-800", bgColor: "bg-green-100" }],
      },
    ],
  },
  {
    title: "Due in Next 30 Days",
    tasks: [
      {
        id: "t5",
        name: "Schedule appraisal for Clearair property",
        borrower: "Clearair",
        dueDate: "Jul 15",
        loanType: "Term",
        status: "Pending",
        tags: [{ text: "Appraisal", color: "text-purple-800", bgColor: "bg-purple-100" }],
      },
      {
        id: "t6",
        name: "Review primary repayment sources for Skyward Tech",
        borrower: "Skyward Tech Solutions",
        dueDate: "Jul 20",
        loanType: "Revolving",
        status: "Pending",
        tags: [{ text: "Repayment", color: "text-green-800", bgColor: "bg-green-100" }],
      },
      {
        id: "t7",
        name: "Complete UCC search for Luminous Analytics",
        borrower: "Luminous Analytics",
        dueDate: "Jul 25",
        loanType: "Term",
        status: "In Progress",
        tags: [{ text: "Documentation", color: "text-yellow-800", bgColor: "bg-yellow-100" }],
      },
    ],
  },
]

const TaskRow = ({ task }) => (
  <TableRow>
    <TableCell className="w-[50%]">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-gray-300 hover:text-green-500 cursor-pointer" />
        <span className="font-medium">{task.name}</span>
      </div>
    </TableCell>
    <TableCell className="text-center">{task.dueDate}</TableCell>
    <TableCell className="text-center">
      <Badge variant="secondary">{task.loanType}</Badge>
    </TableCell>
    <TableCell>
      <div className="flex items-center justify-center gap-2">
        {task.tags.map((tag) => (
          <Badge key={tag.text} className={`${tag.bgColor} ${tag.color} hover:${tag.bgColor}`}>
            {tag.text}
          </Badge>
        ))}
      </div>
    </TableCell>
  </TableRow>
)

export default function PortfolioPipelinePage() {
  return (
    <div className="flex-1 bg-white p-6 lg:p-8">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Portfolio Pipeline</h1>
          <p className="text-gray-500">Tasks and deadlines for loans in the next 30 days.</p>
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search tasks..." className="pl-10" />
          </div>
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" />
            Customize
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </header>

      <div className="flex border-b mb-4">
        <Button variant="ghost" className="border-b-2 border-blue-600 text-blue-600 rounded-none">
          List
        </Button>
        <Link href="/portfolio/kanban" passHref>
          <Button variant="ghost" className="text-gray-500 rounded-none">
            Board View
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[50%] text-gray-600 font-semibold">TASK NAME</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">DUE DATE</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">LOAN TYPE</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">TAGS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pipelineData.map((section) => (
              <React.Fragment key={section.title}>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableCell colSpan={4}>
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4" />
                      <h3 className="font-semibold text-sm text-gray-700">{section.title}</h3>
                    </div>
                  </TableCell>
                </TableRow>
                {section.tasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="py-2 pl-12">
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Add task
                    </Button>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
