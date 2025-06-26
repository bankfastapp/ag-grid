"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface FinancialStandard {
  id: string
  ratioName: string
  threshold: string
  comment: string
}

const initialStandards: FinancialStandard[] = [
  {
    id: "fs1",
    ratioName: "Debt Service Coverage Ratio (DSCR)",
    threshold: ">= 1.25x",
    comment: "Primary covenant for CRE and C&I loans.",
  },
  {
    id: "fs2",
    ratioName: "Debt-to-Income Ratio (DTI)",
    threshold: "<= 43%",
    comment: "For individual borrowers and guarantors.",
  },
  {
    id: "fs3",
    ratioName: "Loan-to-Value (LTV)",
    threshold: "<= 80%",
    comment: "Standard for most real estate collateral.",
  },
  {
    id: "fs4",
    ratioName: "Current Ratio",
    threshold: ">= 1.20",
    comment: "Assesses short-term liquidity for businesses.",
  },
  {
    id: "fs5",
    ratioName: "Global DSCR",
    threshold: ">= 1.15x",
    comment: "Considers all sources of income for guarantors.",
  },
]

export default function FinancialStandardsSettings() {
  const [standards, setStandards] = useState<FinancialStandard[]>(initialStandards)
  const { toast } = useToast()

  const handleStandardChange = (id: string, field: keyof FinancialStandard, value: string) => {
    setStandards(standards.map((standard) => (standard.id === id ? { ...standard, [field]: value } : standard)))
  }

  const handleAddStandard = () => {
    setStandards([...standards, { id: `fs${Date.now()}`, ratioName: "", threshold: "", comment: "" }])
    toast({ title: "New Standard Added" })
  }

  const handleRemoveStandard = (id: string) => {
    setStandards(standards.filter((standard) => standard.id !== id))
    toast({ title: "Standard Removed", variant: "destructive" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Standards</CardTitle>
        <CardDescription>Define and manage key financial ratios and their thresholds used in analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Ratio Name</TableHead>
                <TableHead className="w-[20%]">Threshold</TableHead>
                <TableHead>Comment / Use Case</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standards.map((standard) => (
                <TableRow key={standard.id}>
                  <TableCell>
                    <Input
                      value={standard.ratioName}
                      onChange={(e) => handleStandardChange(standard.id, "ratioName", e.target.value)}
                      placeholder="e.g., Leverage (Debt/Equity)"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={standard.threshold}
                      onChange={(e) => handleStandardChange(standard.id, "threshold", e.target.value)}
                      placeholder="e.g., <= 3.0x"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={standard.comment}
                      onChange={(e) => handleStandardChange(standard.id, "comment", e.target.value)}
                      placeholder="Notes on application"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveStandard(standard.id)}
                      title="Remove Standard"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button onClick={handleAddStandard} variant="outline" size="sm" className="mt-4 bg-background text-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Standard
        </Button>
      </CardContent>
    </Card>
  )
}
