"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Briefcase, FileBarChart, FileClock, FileText, FileUp, FileWarning } from "lucide-react"
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
  { id: "b6", name: "Skyward Tech" },
  { id: "b7", name: "Echo Dynamics" },
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

const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case "Delinquent":
      return "bg-red-100 text-red-800 border-red-200"
    case "Past Due":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Due this week":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Due in 30 days":
      return "bg-green-100 text-green-800 border-green-200"
    case "New":
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Document Requirements Status</h1>
        <p className="text-muted-foreground">
          At-a-glance overview of document statuses for all borrowers across different categories.
        </p>
      </div>

      {documentCategories.map((category) => (
        <Card key={category.name}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <category.icon className="mr-3 h-6 w-6 text-primary" />
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <Table className="min-w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-card z-10 w-64 min-w-64 font-semibold">Document</TableHead>
                    {mockBorrowers.map((borrower) => (
                      <TableHead key={borrower.id} className="text-center">
                        {borrower.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.documents.map((docName) => (
                    <TableRow key={docName}>
                      <TableCell className="sticky left-0 bg-card z-10 font-medium w-64 min-w-64">{docName}</TableCell>
                      {mockBorrowers.map((borrower) => (
                        <TableCell key={borrower.id} className="text-center">
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                              mockBorrowerDocStatuses[borrower.id]?.[docName] || "New",
                            )}`}
                          >
                            {mockBorrowerDocStatuses[borrower.id]?.[docName] || "New"}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
