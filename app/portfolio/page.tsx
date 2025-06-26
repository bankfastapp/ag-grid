"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Search,
  GripVertical,
  CheckCircle2,
  HelpCircle,
  ArrowUpDown,
  LayoutGrid,
} from "lucide-react"
import type { PortfolioAnalysisItem, AnalysisStatus } from "@/types"

const kpiData = [
  { title: "Total Analyses", value: "248" },
  { title: "New Debt Processed", value: "$510,260,200" },
  { title: "Time Saved (Est.)", value: "3,963.87 hours" },
  { title: "Cost Savings (Total)", value: "$8,131,667.08" },
]

const initialPortfolioItems: PortfolioAnalysisItem[] = [
  {
    id: "1",
    fullName: "InRoads",
    isFolder: true,
    docs: 0,
    date: "2001",
    banker: "2024",
    risk: 0.0,
    current: "N/A",
    newAmount: "$5,495,064",
    industry: 4500000,
    status: "completed",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "2",
    fullName: "InRoads",
    isFolder: true,
    docs: 0,
    date: "N/A",
    banker: "2024",
    risk: 0.0,
    current: "N/A",
    newAmount: "$5,495,064",
    industry: 4500000,
    status: "completed",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "3",
    fullName: "Robert J. Bauer",
    isFolder: true,
    docs: 3,
    date: "2023",
    banker: "R J",
    risk: 0.0,
    current: "$0",
    newAmount: "$0",
    industry: 531210,
    status: "pending",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "4",
    fullName: "Robert J. Bauer",
    isFolder: true,
    docs: 0,
    date: "2023",
    banker: "R J",
    risk: 0.0,
    current: "$0",
    newAmount: "$0",
    industry: 531210,
    status: "pending",
    eval: "N/A",
    analyzed: "06/24",
    children: [],
  },
  {
    id: "5",
    fullName: "Robert J. Bauer",
    isFolder: true,
    docs: 0,
    date: "2022",
    banker: "R J",
    risk: 0.0,
    current: "$0",
    newAmount: "$0",
    industry: "N/A",
    status: "pending",
    eval: "N/A",
    analyzed: "06/24",
    children: [],
  },
  {
    id: "6",
    fullName: "Robert J Bauer Tyler J Bauer",
    isFolder: true,
    docs: 0,
    date: "2021",
    banker: "R J",
    risk: 0.0,
    current: "$0",
    newAmount: "$0",
    industry: "N/A",
    status: "pending",
    eval: "N/A",
    analyzed: "06/24",
    children: [],
  },
  {
    id: "7",
    fullName: "InRoads",
    isFolder: true,
    docs: 0,
    date: "2001",
    banker: "2023",
    risk: 0.0,
    current: "N/A",
    newAmount: "$0",
    industry: 0,
    status: "completed",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "8",
    fullName: "InRoads",
    isFolder: true,
    docs: 0,
    date: "N/A",
    banker: "2023",
    risk: 0.0,
    current: "N/A",
    newAmount: "$0",
    industry: 0,
    status: "completed",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "9",
    fullName: "InRoads",
    isFolder: true,
    docs: 0,
    date: "2001",
    banker: "2022",
    risk: 0.0,
    current: "N/A",
    newAmount: "$0",
    industry: 0,
    status: "completed",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "10",
    fullName: "InRoads",
    isFolder: true,
    docs: 0,
    date: "N/A",
    banker: "2022",
    risk: 0.0,
    current: "N/A",
    newAmount: "$0",
    industry: 0,
    status: "completed",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "11",
    fullName: "T & T Holdings",
    isFolder: true,
    docs: 7,
    date: "2024",
    banker: "R J",
    risk: 0.0,
    current: "$1,000,000",
    newAmount: "$0",
    industry: 531190,
    status: "pending",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "12",
    fullName: "T & T Holdings",
    isFolder: true,
    docs: 0,
    date: "N/A",
    banker: "2024",
    risk: 0.0,
    current: "N/A",
    newAmount: "$1,000,000",
    industry: 0,
    status: "completed",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "13",
    fullName: "T & T Holdings",
    isFolder: true,
    docs: 0,
    date: "N/A",
    banker: "2023",
    risk: 0.0,
    current: "N/A",
    newAmount: "$1,000,000",
    industry: 0,
    status: "completed",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
  {
    id: "14",
    fullName: "Timothy J. Seubert",
    isFolder: true,
    docs: 0,
    date: "2024",
    banker: "R J",
    risk: 0.0,
    current: "$1,000,000",
    newAmount: "$0",
    industry: "N/A",
    status: "pending",
    eval: "N/A",
    analyzed: "05/27",
    children: [],
  },
  {
    id: "15",
    fullName: "Timothy J. Seubert",
    isFolder: true,
    docs: 0,
    date: "2023",
    banker: "R J",
    risk: 0.0,
    current: "$1,000,000",
    newAmount: "$0",
    industry: 311110,
    status: "pending",
    eval: "N/A",
    analyzed: "05/27",
    children: [],
  },
  {
    id: "16",
    fullName: "Clearair",
    isFolder: true,
    docs: 0,
    date: "2001",
    banker: "2023",
    risk: 0.0,
    current: "N/A",
    newAmount: "$355,491",
    industry: 0,
    status: "completed",
    eval: "N/A",
    analyzed: "N/A",
    children: [],
  },
]

const StatusIcon = ({ status }: { status: AnalysisStatus }) => {
  if (status === "completed") {
    return <CheckCircle2 className="h-5 w-5 text-green-500" />
  }
  if (status === "pending" || status === "in_progress") {
    return <HelpCircle className="h-5 w-5 text-gray-400" />
  }
  // Add other statuses like error if needed
  return <HelpCircle className="h-5 w-5 text-gray-400" />
}

const PortfolioTableRow: React.FC<{
  item: PortfolioAnalysisItem
  level: number
  isSelected: boolean
  onSelect: (id: string, checked: boolean) => void
  expandedItems: Set<string>
  onToggleExpand: (id: string) => void
}> = ({ item, level, isSelected, onSelect, expandedItems, onToggleExpand }) => {
  const isExpanded = expandedItems.has(item.id)

  return (
    <>
      <TableRow className={level > 0 ? "bg-gray-50/50" : ""}>
        <TableCell style={{ paddingLeft: `${level * 20 + 12}px` }} className="w-[300px]">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
            {item.isFolder && item.children && item.children.length > 0 ? (
              <Button variant="ghost" size="icon" onClick={() => onToggleExpand(item.id)} className="h-6 w-6">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            ) : (
              <div className="w-6"></div> // Placeholder for alignment
            )}
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(item.id, Boolean(checked))}
              aria-label={`Select ${item.fullName}`}
            />
            {item.isFolder && <Folder className="h-4 w-4 text-yellow-500 mr-1" />}
            <span className="font-medium truncate" title={item.fullName}>
              {item.fullName}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-center">{item.docs}</TableCell>
        <TableCell className="text-center">{item.date}</TableCell>
        <TableCell className="text-center">{item.banker}</TableCell>
        <TableCell className="text-center">{item.risk.toFixed(1)}</TableCell>
        <TableCell className="text-right">{item.current}</TableCell>
        <TableCell className="text-right">{item.newAmount}</TableCell>
        <TableCell className="text-center">{item.industry}</TableCell>
        <TableCell className="text-center">
          <StatusIcon status={item.status} />
        </TableCell>
        <TableCell className="text-center">{item.eval}</TableCell>
        <TableCell className="text-center">{item.analyzed}</TableCell>
      </TableRow>
      {isExpanded &&
        item.children?.map((child) => (
          <PortfolioTableRow
            key={child.id}
            item={child}
            level={level + 1}
            isSelected={isSelected} // Child selection might need to be independent
            onSelect={onSelect}
            expandedItems={expandedItems}
            onToggleExpand={onToggleExpand}
          />
        ))}
    </>
  )
}

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [timePeriod, setTimePeriod] = useState("Last week")

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (checked) newSet.add(id)
      else newSet.delete(id)
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(flattenedItems.map((item) => item.id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleToggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  // Flatten items for select all and filtering (if needed)
  const flattenItems = (items: PortfolioAnalysisItem[], parentId: string | null = null): PortfolioAnalysisItem[] => {
    let flat: PortfolioAnalysisItem[] = []
    items.forEach((item) => {
      flat.push({ ...item, parentId })
      if (item.children) {
        flat = flat.concat(flattenItems(item.children, item.id))
      }
    })
    return flat
  }
  const flattenedItems = useMemo(() => flattenItems(initialPortfolioItems), [initialPortfolioItems])

  const isAllSelected = selectedItems.size === flattenedItems.length && flattenedItems.length > 0

  const renderPortfolioRows = (items: PortfolioAnalysisItem[], level: number) => {
    return items.map((item) => (
      <PortfolioTableRow
        key={item.id}
        item={item}
        level={level}
        isSelected={selectedItems.has(item.id)}
        onSelect={handleSelect}
        expandedItems={expandedItems}
        onToggleExpand={handleToggleExpand}
      />
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">7th inning stretch, Mark!</h1>
      <p className="text-gray-600 mb-6 text-lg">Overview</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white">
              {timePeriod} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setTimePeriod("Last week")}>Last week</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTimePeriod("Last month")}>Last month</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTimePeriod("Last quarter")}>Last quarter</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTimePeriod("Last year")}>Last year</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/portfolio/kanban" passHref>
          <Button variant="outline" className="bg-white">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Kanban View
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-1 border border-gray-200 rounded-md p-0.5 bg-white">
          {["All", "Tax", "Audit", "Interim"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "secondary" : "ghost"}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 h-auto text-sm ${
                activeFilter === filter ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64 bg-white border-gray-300"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[300px] text-gray-600 font-semibold">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                    aria-label="Select all items"
                  />
                  FULL NAME
                </div>
              </TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">DOCS</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">DATE</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">BANKER</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">RISK</TableHead>
              <TableHead className="text-right text-gray-600 font-semibold">CURRENT</TableHead>
              <TableHead className="text-right text-gray-600 font-semibold">NEW</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">INDUSTRY</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">STATUS</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">EVAL</TableHead>
              <TableHead className="text-center text-gray-600 font-semibold">
                <div className="flex items-center justify-center gap-1">
                  ANALYZED
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderPortfolioRows(initialPortfolioItems, 0)}</TableBody>
        </Table>
      </div>
    </div>
  )
}
