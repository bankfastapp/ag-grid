"use client"
import { useState } from "react"
import type { DocumentRequirement } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialDocs: DocumentRequirement[] = [
  {
    id: "doc1",
    documentName: "Business Financial Statements (Last 3 Years)",
    party: "Borrower",
    loanCondition: "Pre-Underwriting",
    collateralCondition: "N/A",
    status: "Met",
    isException: false,
  },
  {
    id: "doc2",
    documentName: "Personal Financial Statement (Guarantors)",
    party: "Borrower",
    loanCondition: "Pre-Underwriting",
    collateralCondition: "N/A",
    status: "Pending",
    isException: false,
  },
  {
    id: "doc3",
    documentName: "Real Estate Appraisal (Commercial)",
    party: "Bank", // Or could be third-party ordered by bank
    loanCondition: "Pre-Closing",
    collateralCondition: "Commercial Real Estate",
    status: "Exception", // Example of an exception
    isException: true,
  },
  {
    id: "doc4",
    documentName: "Environmental Site Assessment (Phase I)",
    party: "Borrower",
    loanCondition: "Due Diligence",
    collateralCondition: "Commercial Real Estate (Industrial)",
    status: "Waived",
    isException: false, // Waived is not an exception in this context
  },
]

export function DocumentRequirementsSettings() {
  const [docs, setDocs] = useState<DocumentRequirement[]>(initialDocs)
  const { toast } = useToast()

  const handleAddDoc = () => {
    setDocs([
      ...docs,
      {
        id: `doc${Date.now()}`,
        documentName: "",
        party: "Borrower",
        loanCondition: "",
        collateralCondition: "",
        status: "Pending",
        isException: false,
      },
    ])
  }

  const handleRemoveDoc = (id: string) => {
    setDocs(docs.filter((doc) => doc.id !== id))
    toast({ title: "Document Requirement Removed" })
  }

  const handleChange = (id: string, field: keyof DocumentRequirement, value: any) => {
    setDocs(
      docs.map((doc) => {
        if (doc.id === id) {
          const updatedDoc = { ...doc, [field]: value }
          if (field === "status") {
            updatedDoc.isException = value === "Exception"
          }
          return updatedDoc
        }
        return doc
      }),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>6. Document Requirements</CardTitle>
        <CardDescription>
          Standardize required documents by entity, loan, and collateral type. Items marked
          <AlertTriangle className="inline h-4 w-4 mx-1 text-red-600" />
          are exceptions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {docs.map((doc) => (
          <div key={doc.id} className="p-3 border rounded-md space-y-2 relative">
            {doc.isException && (
              <div className="absolute top-2 right-2 flex items-center text-red-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="text-xs font-semibold">EXCEPTION</span>
              </div>
            )}
            <Input
              placeholder="Document Name"
              value={doc.documentName}
              onChange={(e) => handleChange(doc.id, "documentName", e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Select
                value={doc.party}
                onValueChange={(val: DocumentRequirement["party"]) => handleChange(doc.id, "party", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Party" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Borrower">Borrower</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={doc.status}
                onValueChange={(val: DocumentRequirement["status"]) => handleChange(doc.id, "status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {["Met", "Pending", "Waived", "Exception"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Loan Condition (e.g., Pre-funding)"
              value={doc.loanCondition}
              onChange={(e) => handleChange(doc.id, "loanCondition", e.target.value)}
            />
            <Input
              placeholder="Collateral Condition (e.g., For Real Estate)"
              value={doc.collateralCondition}
              onChange={(e) => handleChange(doc.id, "collateralCondition", e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveDoc(doc.id)}
              className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Remove
            </Button>
          </div>
        ))}
        <Button onClick={handleAddDoc}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Document Requirement
        </Button>
      </CardContent>
    </Card>
  )
}
