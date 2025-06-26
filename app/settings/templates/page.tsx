"use client"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, FileWarning, Briefcase, FileUp, FileClock, FileBarChart } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type DocumentStatus = "New" | "Due in 30 days" | "Due this week" | "Past Due" | "Delinquent"

interface DocumentCategory {
  name: string
  icon: LucideIcon
  documents: string[]
}

const documentCategories: DocumentCategory[] = [
  {
    name: "Entity",
    icon: Briefcase,
    documents: [
      "Government ID",
      "SSN verified",
      "Loan Report",
      "Tax Return",
      "Financial Stmt",
      "UCC Search",
      "EIN on file",
      "SOS Filings",
      "Articles of Incorporation",
      "Operating Agreement",
      "Borrowing Resolution",
      "Certificate of Good Standing",
      "By-Laws",
      "Non-Profit Status",
      "Board Action to Borrow",
      "Percentage of Ownership",
    ],
  },
  {
    name: "Product",
    icon: FileText,
    documents: [
      "Loan Agreement",
      "Promissory Note",
      "Security Agreement",
      "Guaranty",
      "Right to Cancel or Rescission Notice",
      "Initial UCC Search",
      "UCC Filing",
      "State Matches",
      "Name is Exact Match",
      "Final Search",
      "Collateral Matches Approval",
      "Pricing Sheet",
      "Note Matches Approval",
      "NADA Valuation",
      "Bill of Sale / Purchase Agreement",
      "VIN Matches",
      "TItle on FIle",
      "Lien on FIle",
      "Statement of Account",
      "Control Agreement",
      "Acknowledgement",
      "Insurance Policy",
      "Questionnarie",
      "Assignment",
      "Stock Certificate",
      "Names Match",
      "Not Retricted or UTMA",
      "Stock Power",
      "Vesting Correct",
      "Filed Copy - Bank",
      "Appraisal",
      "Appraisal Reviewed",
      "Preliminary Title Opinon",
      "Final TItle Opinoin",
      "TItle Committment",
      "TItle Insurance",
      "Title Work Reviewed",
      "Flood Certification",
      "Flood Insurance",
      "Zones Match",
      "Collateral Inspection",
      "Environmental Risk Assessment",
      "Phase 1 Report",
      "Phase 2 Report",
      "Copy of Lease",
      "Landlord Lien Waiver",
      "Tenant Estoppel",
      "Pre-Construction Site Inspection",
      "Soil Tests",
      "Plans / Specs Reviewed",
      "Detailed Budget",
      "Copy of Contract",
      "Assignment of Contract",
      "Assignment of Arch. Con.",
      "Market Feasibility",
      "List of Major Subs",
      "Zoning OK",
      "Building Permit",
      "Builder’s Risk Insurance",
      "Liability / Work Comp. Ins.",
      "Pre-Construction Affidavit",
      "Lot Release Agreement",
      "Commitment for Permanent Financing",
    ],
  },
  {
    name: "Disclosures",
    icon: FileWarning,
    documents: [
      "Disclosure Statements",
      "Loan Card Features",
      "Interest Rates",
      "Fees and Charges",
      "Billing and Payment Terms",
      "Loan Limit",
      "Rewards Program",
      "Balance Transfers",
      "Fraud Protection and Security",
      "Loan Card Use",
      "Changes to Terms and Conditions",
      "Dispute Resolution",
      "Loan Reporting",
      "Governing Law",
      "Account information",
      "Eligibility Requirements",
      "Minimum Balance Requirements",
      "Transaction Limits",
      "Account Closure",
      "Liability and Security",
      "Deposit Account Agreement",
      "Privacy Policy",
      "Overdraft Protection Agreement",
      "Loan Card Agreement",
      "Cardholder Agreement or Cardholder Terms",
      "Cardholder Disclosures",
      "Balance Transfer Agreement",
      "Rewards Program Agreement",
      "Additional Cardholder Agreement",
    ],
  },
  {
    name: "Applications",
    icon: FileUp,
    documents: ["Loan Application", "Deposit Application", "Card Application", "Referral Letter"],
  },
  {
    name: "Internal",
    icon: FileClock,
    documents: ["Loan Memo Form", "Loan Presentation", "Executive Loan Presentation", "Commitment Letter"],
  },
  {
    name: "Appraisal Worksheets",
    icon: FileBarChart,
    documents: [
      "Ag Equipment",
      "Residential. RE",
      "Commercial RE",
      "Farm Ground",
      "Construction Development",
      "Bareground",
      "Automobile",
      "Fleet Vehicles",
      "Semi Truck",
      "Business Valuation/Stock",
      "Goodwill",
      "Other",
    ],
  },
]

const mockBorrowers = [
  { id: "b1", name: "InRoads" },
  { id: "b2", name: "Robert J. Bauer" },
  { id: "b3", name: "T & T Holdings" },
  { id: "b4", name: "Timothy J. Seubert" },
  { id: "b5", name: "Clearair" },
]

const documentStatuses: DocumentStatus[] = ["New", "Due in 30 days", "Due this week", "Past Due", "Delinquent"]

// Generate random statuses for demonstration
const mockBorrowerDocStatuses = mockBorrowers.reduce(
  (acc, borrower) => {
    acc[borrower.id] = documentCategories
      .flatMap((cat) => cat.documents)
      .reduce(
        (docAcc, docName) => {
          docAcc[docName] = documentStatuses[Math.floor(Math.random() * documentStatuses.length)]
          return docAcc
        },
        {} as Record<string, DocumentStatus>,
      )
    return acc
  },
  {} as Record<string, Record<string, DocumentStatus>>,
)

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>(documentCategories[0])
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)

  const borrowerStatusForSelectedDoc = useMemo(() => {
    if (!selectedDocument) return []
    return mockBorrowers.map((borrower) => ({
      borrowerId: borrower.id,
      borrowerName: borrower.name,
      status: mockBorrowerDocStatuses[borrower.id]?.[selectedDocument] || "New",
    }))
  }, [selectedDocument])

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case "Delinquent":
        return "bg-red-100 text-red-800"
      case "Past Due":
        return "bg-yellow-100 text-yellow-800"
      case "Due this week":
        return "bg-blue-100 text-blue-800"
      case "Due in 30 days":
        return "bg-green-100 text-green-800"
      case "New":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Document Requirements & Tracking</h1>
        <p className="text-muted-foreground">
          Select a category to view required documents, then select a document to track borrower status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="flex space-x-3 pb-4">
              {documentCategories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory.name === category.name ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category)
                    setSelectedDocument(null) // Reset document selection on category change
                  }}
                  className="flex-shrink-0"
                >
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Required Documents: {selectedCategory.name}</CardTitle>
            <CardDescription>Select a document to see individual borrower statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCategory.documents.map((docName) => (
                    <TableRow
                      key={docName}
                      onClick={() => setSelectedDocument(docName)}
                      className={`cursor-pointer ${selectedDocument === docName ? "bg-primary/10" : "hover:bg-muted/50"}`}
                    >
                      <TableCell className="font-medium">{docName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrower Status</CardTitle>
            <CardDescription>
              {selectedDocument ? `Status for: ${selectedDocument}` : "Select a document to view statuses."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {selectedDocument ? (
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowerStatusForSelectedDoc.map((item) => (
                      <TableRow key={item.borrowerId}>
                        <TableCell className="font-medium">{item.borrowerName}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No document selected.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
