"use client"
import { useState } from "react"
import type { AdvanceRateSetting } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, AlertTriangle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const initialAdvanceRates: AdvanceRateSetting[] = [
  {
    id: "ar1",
    collateralType: "Commercial Real Estate (Office)",
    advanceRate: 75,
    methodDescribed: true,
    sourceDescription: "Loan Policy Manual v4.1, Section 3.2.1",
    comments: "Max LTV for stabilized office properties.",
    isInconclusive: false,
  },
  {
    id: "ar2",
    collateralType: "Accounts Receivable (Eligible)",
    advanceRate: 85,
    methodDescribed: true,
    sourceDescription: "ABL Guidelines Appendix A",
    comments: "Subject to 90-day aging limit.",
    isInconclusive: false,
  },
  {
    id: "ar3",
    collateralType: "Raw Land",
    advanceRate: 0, // Inconclusive due to 0 rate
    methodDescribed: false,
    sourceDescription: "", // Inconclusive due to empty source
    comments: "Policy for raw land advance rates needs to be defined.",
    isInconclusive: true,
  },
  {
    id: "ar4",
    collateralType: "Machinery & Equipment (New)",
    advanceRate: 80,
    methodDescribed: true,
    sourceDescription: "Equipment Financing Policy Addendum B",
    comments: "Based on Net Orderly Liquidation Value (NOLV).",
    isInconclusive: false,
  },
  {
    id: "ar5",
    collateralType: "Inventory (Finished Goods)",
    advanceRate: 50,
    methodDescribed: false, // Potentially inconclusive if method not described is critical
    sourceDescription: "Loan Policy Manual v4.1, Section 3.2.5",
    comments: "Requires regular inventory audits.",
    isInconclusive: false, // Assuming 0 rate or empty source are primary drivers for now
  },
]

export function AdvanceRatesSettings() {
  const [rates, setRates] = useState<AdvanceRateSetting[]>(initialAdvanceRates)
  const { toast } = useToast()

  const handleAddRate = () => {
    setRates([
      ...rates,
      {
        id: `ar${Date.now()}`,
        collateralType: "",
        advanceRate: 0,
        methodDescribed: false,
        sourceDescription: "",
        comments: "",
        isInconclusive: true, // New items start as inconclusive
      },
    ])
  }

  const handleRemoveRate = (id: string) => {
    setRates(rates.filter((rate) => rate.id !== id))
    toast({ title: "Advance Rate Removed" })
  }

  const handleChange = (id: string, field: keyof AdvanceRateSetting, value: any) => {
    const updatedRates = rates.map((rate) => {
      if (rate.id === id) {
        const newRate = { ...rate, [field]: value }
        // Update inconclusive flag: true if advanceRate is 0 OR sourceDescription is empty
        newRate.isInconclusive = newRate.advanceRate === 0 || !newRate.sourceDescription?.trim()
        return newRate
      }
      return rate
    })
    setRates(updatedRates)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Advance Rates</CardTitle>
        <CardDescription>
          Manage LTV/advance rate limits per collateral type. Items marked
          <AlertTriangle className="inline h-4 w-4 mx-1 text-yellow-600" />
          are considered inconclusive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Collateral Type</TableHead>
                <TableHead className="w-[100px]">Rate (%)</TableHead>
                <TableHead className="w-[100px] text-center">Method Described</TableHead>
                <TableHead className="w-[250px]">Source Description</TableHead>
                <TableHead className="min-w-[200px]">Comments</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    <Input
                      value={rate.collateralType}
                      onChange={(e) => handleChange(rate.id, "collateralType", e.target.value)}
                      placeholder="e.g., Equipment"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={rate.advanceRate}
                      onChange={(e) => handleChange(rate.id, "advanceRate", Number.parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 70"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={rate.methodDescribed}
                      onCheckedChange={(checked) => handleChange(rate.id, "methodDescribed", !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={rate.sourceDescription}
                      onChange={(e) => handleChange(rate.id, "sourceDescription", e.target.value)}
                      placeholder="Policy Doc X, Sec Y"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={rate.comments}
                      onChange={(e) => handleChange(rate.id, "comments", e.target.value)}
                      placeholder="Additional notes..."
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {rate.isInconclusive ? (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        Inconclusive
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        <Info className="h-3.5 w-3.5 mr-1" />
                        Defined
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRate(rate.id)} title="Remove Rate">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button onClick={handleAddRate} variant="outline" size="sm" className="bg-background text-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Advance Rate
        </Button>
      </CardContent>
    </Card>
  )
}
