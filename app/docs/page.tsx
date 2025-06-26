"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { List, LayoutGrid, CheckCircle, AlertCircle, Clock, XCircle, Circle } from "lucide-react"

// --- DATA & TYPES ---

type EntityType = "Individual" | "Business (Corp)" | "Business (LLC)" | "Trust" | "Non-Profit"
type ProductType = "Loan" | "Card" | "Deposit"
type DocumentStatus = "New" | "Pending" | "Received" | "Waived" | "Past Due"

interface Borrower {
  id: string
  name: string
  entityType: EntityType
  products: ProductType[]
  avatarUrl: string
}

interface DocumentDefinition {
  id: string
  name: string
  product: ProductType
  entities: EntityType[]
}

interface BorrowerDocumentStatus {
  borrowerId: string
  documentId: string
  status: DocumentStatus
}

const borrowers: Borrower[] = [
  {
    id: "b1",
    name: "Innovate Inc.",
    entityType: "Business (Corp)",
    products: ["Loan", "Deposit"],
    avatarUrl: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "b2",
    name: "John & Jane Smith",
    entityType: "Individual",
    products: ["Loan", "Card"],
    avatarUrl: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "b3",
    name: "The Harrison Trust",
    entityType: "Trust",
    products: ["Deposit", "Loan"],
    avatarUrl: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "b4",
    name: "Global Exports LLC",
    entityType: "Business (LLC)",
    products: ["Loan"],
    avatarUrl: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "b5",
    name: "Community Charity",
    entityType: "Non-Profit",
    products: ["Deposit"],
    avatarUrl: "/placeholder.svg?width=40&height=40",
  },
]

const documentDefinitions: DocumentDefinition[] = [
  {
    id: "d1",
    name: "Loan Card Agreement",
    product: "Card",
    entities: ["Individual", "Trust", "Business (Corp)", "Business (LLC)", "Non-Profit"],
  },
  {
    id: "d2",
    name: "Promissory Note",
    product: "Loan",
    entities: ["Individual", "Trust", "Business (Corp)", "Business (LLC)"],
  },
  {
    id: "d3",
    name: "Security Agreement",
    product: "Loan",
    entities: ["Individual", "Trust", "Business (Corp)", "Business (LLC)"],
  },
  { id: "d4", name: "Guaranty", product: "Loan", entities: ["Individual", "Business (Corp)", "Business (LLC)"] },
  { id: "d5", name: "UCC Filing", product: "Loan", entities: ["Business (Corp)", "Business (LLC)"] },
  {
    id: "d6",
    name: "Appraisal",
    product: "Loan",
    entities: ["Individual", "Trust", "Business (Corp)", "Business (LLC)"],
  },
  {
    id: "d7",
    name: "Title Insurance",
    product: "Loan",
    entities: ["Individual", "Trust", "Business (Corp)", "Business (LLC)"],
  },
  {
    id: "d8",
    name: "Account Application Form",
    product: "Deposit",
    entities: ["Individual", "Trust", "Business (Corp)", "Business (LLC)", "Non-Profit"],
  },
  {
    id: "d9",
    name: "Signature Card",
    product: "Deposit",
    entities: ["Individual", "Trust", "Business (Corp)", "Business (LLC)", "Non-Profit"],
  },
  { id: "d10", name: "Articles of Incorporation", product: "Loan", entities: ["Business (Corp)"] },
  { id: "d11", name: "Operating Agreement", product: "Loan", entities: ["Business (LLC)"] },
  {
    id: "d12",
    name: "Borrowing Resolution",
    product: "Loan",
    entities: ["Business (Corp)", "Business (LLC)", "Non-Profit"],
  },
  { id: "d13", name: "Certificate of Good Standing", product: "Loan", entities: ["Business (Corp)", "Business (LLC)"] },
]

const statuses: BorrowerDocumentStatus[] = [
  { borrowerId: "b1", documentId: "d2", status: "Received" },
  { borrowerId: "b1", documentId: "d3", status: "Received" },
  { borrowerId: "b1", documentId: "d5", status: "Pending" },
  { borrowerId: "b1", documentId: "d8", status: "Received" },
  { borrowerId: "b1", documentId: "d9", status: "Received" },
  { borrowerId: "b1", documentId: "d10", status: "Past Due" },
  { borrowerId: "b1", documentId: "d12", status: "Pending" },
  { borrowerId: "b1", documentId: "d13", status: "New" },
  { borrowerId: "b2", documentId: "d1", status: "Pending" },
  { borrowerId: "b2", documentId: "d2", status: "Received" },
  { borrowerId: "b2", documentId: "d3", status: "New" },
  { borrowerId: "b2", documentId: "d4", status: "Waived" },
  { borrowerId: "b2", documentId: "d6", status: "Past Due" },
  { borrowerId: "b3", documentId: "d2", status: "Received" },
  { borrowerId: "b3", documentId: "d3", status: "Pending" },
  { borrowerId: "b3", documentId: "d8", status: "Received" },
  { borrowerId: "b3", documentId: "d9", status: "New" },
  { borrowerId: "b4", documentId: "d2", status: "Pending" },
  { borrowerId: "b4", documentId: "d3", status: "Pending" },
  { borrowerId: "b4", documentId: "d5", status: "Received" },
  { borrowerId: "b4", documentId: "d11", status: "Received" },
  { borrowerId: "b4", documentId: "d12", status: "Past Due" },
  { borrowerId: "b5", documentId: "d8", status: "Received" },
  { borrowerId: "b5", documentId: "d9", status: "Received" },
  { borrowerId: "b5", documentId: "d12", status: "Waived" },
]

const statusConfig: Record<DocumentStatus, { icon: React.ElementType; color: string; title: string }> = {
  New: { icon: Circle, color: "text-gray-500", title: "New" },
  Pending: { icon: Clock, color: "text-blue-500", title: "Pending" },
  Received: { icon: CheckCircle, color: "text-green-500", title: "Received" },
  Waived: { icon: XCircle, color: "text-orange-500", title: "Waived" },
  "Past Due": { icon: AlertCircle, color: "text-red-500", title: "Past Due" },
}

// --- COMPONENTS ---

const DocumentStatusIcon = ({ status }: { status: DocumentStatus }) => {
  const { icon: Icon, color } = statusConfig[status]
  return <Icon className={cn("h-5 w-5", color)} />
}

const DocumentListView = ({ documents }: { documents: (DocumentDefinition & { status: DocumentStatus })[] }) => (
  <div className="border rounded-lg">
    <div className="grid grid-cols-[1fr,120px,200px,120px] p-4 border-b bg-gray-50 dark:bg-gray-800/50 font-medium text-sm">
      <h3>Document Name</h3>
      <h3>Product</h3>
      <h3>Applicable To</h3>
      <h3>Status</h3>
    </div>
    <div className="divide-y">
      {documents.map((doc) => (
        <div key={doc.id} className="grid grid-cols-[1fr,120px,200px,120px] p-4 items-center">
          <span className="font-medium">{doc.name}</span>
          <span className="text-sm text-muted-foreground">{doc.product}</span>
          <span className="text-sm text-muted-foreground">{doc.entities.join(", ")}</span>
          <div className="flex items-center gap-2">
            <DocumentStatusIcon status={doc.status} />
            <span className="text-sm">{doc.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const DocumentBoardView = ({ documents }: { documents: (DocumentDefinition & { status: DocumentStatus })[] }) => {
  const columns = Object.keys(statusConfig) as DocumentStatus[]

  const documentsByStatus = useMemo(() => {
    const grouped: Record<DocumentStatus, (DocumentDefinition & { status: DocumentStatus })[]> = {
      New: [],
      Pending: [],
      Received: [],
      Waived: [],
      "Past Due": [],
    }
    documents.forEach((doc) => {
      grouped[doc.status].push(doc)
    })
    return grouped
  }, [documents])

  return (
    <div className="grid grid-cols-5 gap-4 items-start">
      {columns.map((status) => (
        <div key={status} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg w-full">
          <div className="p-3 border-b flex items-center gap-2">
            {React.createElement(statusConfig[status].icon, { className: cn("h-4 w-4", statusConfig[status].color) })}
            <h3 className="font-semibold text-sm">{statusConfig[status].title}</h3>
            <span className="text-xs text-muted-foreground bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 ml-auto">
              {documentsByStatus[status].length}
            </span>
          </div>
          <div className="p-2 space-y-2">
            {documentsByStatus[status].map((doc) => (
              <Card key={doc.id} className="p-3">
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {doc.product} / {doc.entities.slice(0, 2).join(", ")}
                  {doc.entities.length > 2 ? "..." : ""}
                </p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DocsPage() {
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string>(borrowers[0].id)
  const [viewMode, setViewMode] = useState<"list" | "board">("list")

  const selectedBorrower = useMemo(() => borrowers.find((b) => b.id === selectedBorrowerId)!, [selectedBorrowerId])

  const requiredDocuments = useMemo(() => {
    if (!selectedBorrower) return []

    return documentDefinitions
      .filter(
        (doc) => selectedBorrower.products.includes(doc.product) && doc.entities.includes(selectedBorrower.entityType),
      )
      .map((doc) => {
        const status =
          statuses.find((s) => s.borrowerId === selectedBorrowerId && s.documentId === doc.id)?.status || "New"
        return { ...doc, status }
      })
  }, [selectedBorrower])

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Left Panel: Borrower List */}
      <div className="w-72 border-r overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Borrowers</h2>
        </div>
        <Separator />
        <div className="p-2">
          {borrowers.map((borrower) => (
            <button
              key={borrower.id}
              onClick={() => setSelectedBorrowerId(borrower.id)}
              className={cn(
                "w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-muted",
                selectedBorrowerId === borrower.id && "bg-muted font-semibold",
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={borrower.avatarUrl || "/placeholder.svg"} alt={borrower.name} />
                <AvatarFallback>{borrower.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">{borrower.name}</p>
                <p className="text-xs text-muted-foreground">{borrower.entityType}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Document Viewer */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div>
            <h1 className="text-2xl font-bold">Document Requirements</h1>
            <p className="text-muted-foreground">Tracking for: {selectedBorrower?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              aria-label="List View"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "board" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("board")}
              aria-label="Board View"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4 flex-1">
          {viewMode === "list" ? (
            <DocumentListView documents={requiredDocuments} />
          ) : (
            <DocumentBoardView documents={requiredDocuments} />
          )}
        </div>
      </div>
    </div>
  )
}
