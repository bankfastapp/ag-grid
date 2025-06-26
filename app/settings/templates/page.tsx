"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sheet,
  FileText,
  FileDigit,
  FilePenLineIcon as Signature,
  FileWarning,
  PlusSquare,
  Search,
  FileSpreadsheet,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface TemplateTypeCardProps {
  icon: LucideIcon
  title: string
  count?: number
  onClick?: () => void
}

const TemplateTypeCard: React.FC<TemplateTypeCardProps> = ({ icon: Icon, title, count, onClick }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center group" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="p-4 bg-muted rounded-md w-24 h-24 mx-auto flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Icon className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm font-medium text-foreground">{title}</p>
      </CardContent>
      {count !== undefined && (
        <CardFooter className="pt-0 pb-3">
          <p className="text-xs text-muted-foreground">{count} templates</p>
        </CardFooter>
      )}
    </Card>
  )
}

interface TemplateListItem {
  id: string
  icon: LucideIcon
  iconColor: string
  name: string
  folder?: string
  subFolders?: string
  origin: string
  updated: string
  uses?: string
  avgTime?: string
}

const initialTemplates: TemplateListItem[] = [
  {
    id: "tpl1",
    icon: FileDigit, // PDF icon
    iconColor: "text-red-500",
    name: "Promissory%20Note_...",
    origin: "01/04/2025",
    updated: "01/04/2025",
  },
  {
    id: "tpl2",
    icon: FileSpreadsheet, // XLS icon
    iconColor: "text-green-500",
    name: "Banking-Industry-Co...",
    origin: "01/03/2025",
    updated: "01/03/2025",
  },
  {
    id: "tpl3",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "KCFSIDataSources20...",
    origin: "12/18/2024",
    updated: "12/18/2024",
  },
  {
    id: "tpl4",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "Checking.Savings_Acc...",
    origin: "10/31/2024",
    updated: "11/03/2024",
  },
  {
    id: "tpl5",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "2011_customer_centri...",
    origin: "11/01/2024",
    updated: "11/01/2024",
  },
  {
    id: "tpl6",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "Electronic_Funds_Tran...",
    origin: "10/31/2024",
    updated: "10/31/2024",
  },
  {
    id: "tpl7",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "Terms_&_Conditions.pdf",
    origin: "10/31/2024",
    updated: "10/31/2024",
  },
  {
    id: "tpl8",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "Truth_in_Savings_Int_B...",
    origin: "10/31/2024",
    updated: "10/31/2024",
  },
  {
    id: "tpl9",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "Funds_Availability.pdf",
    origin: "10/31/2024",
    updated: "10/31/2024",
  },
  {
    id: "tpl10",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "Promissory Note_Secu...",
    origin: "10/31/2024",
    updated: "10/31/2024",
  },
  {
    id: "tpl11",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "bb7ed3be-a574-46ed-...",
    origin: "10/29/2024",
    updated: "10/29/2024",
  },
  {
    id: "tpl12",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "AutoTagOutput-tagge...",
    origin: "10/25/2024",
    updated: "10/25/2024",
  },
  {
    id: "tpl13",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "AutoTagOutput-tagge...",
    origin: "10/25/2024",
    updated: "10/25/2024",
  },
  {
    id: "tpl14",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "commercial loan applic...",
    origin: "10/25/2024",
    updated: "10/25/2024",
  },
  {
    id: "tpl15",
    icon: FileDigit,
    iconColor: "text-red-500",
    name: "commercial loan applic...",
    origin: "08/09/2024",
    updated: "08/09/2024",
  },
]

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [templates, setTemplates] = useState<TemplateListItem[]>(initialTemplates)

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const templateTypes = [
    { icon: Sheet, title: "Sheets", count: 5 },
    { icon: FileText, title: "Docs", count: 12 },
    { icon: FileDigit, title: "PDF", count: 28 },
    { icon: Signature, title: "Esign", count: 3 },
    { icon: FileWarning, title: "Disclosure", count: 7 },
    { icon: PlusSquare, title: "New" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 bg-background">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Choose by type</h1>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-10">
        {templateTypes.map((type) => (
          <TemplateTypeCard key={type.title} icon={type.icon} title={type.title} count={type.count} />
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Template</TableHead>
              <TableHead>Folder</TableHead>
              <TableHead>Sub-Folders</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Avg Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <template.icon className={`h-5 w-5 ${template.iconColor}`} />
                    <span className="font-medium truncate" title={template.name}>
                      {template.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{template.folder || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{template.subFolders || "—"}</TableCell>
                <TableCell>{template.origin}</TableCell>
                <TableCell>{template.updated}</TableCell>
                <TableCell className="text-muted-foreground">{template.uses || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{template.avgTime || "—"}</TableCell>
              </TableRow>
            ))}
            {filteredTemplates.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No templates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
