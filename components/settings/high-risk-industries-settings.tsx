"use client"
import { useState } from "react"
import type { HighRiskIndustry } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const initialIndustries: HighRiskIndustry[] = [
  { id: "hr1", naicsSicLabel: "Gambling Operations (NAICS 7132)" },
  { id: "hr2", naicsSicLabel: "Cannabis-Related Businesses (NAICS 111998, 453998)" },
  { id: "hr3", naicsSicLabel: "Adult Entertainment (NAICS 713120)" },
  { id: "hr4", naicsSicLabel: "Money Service Businesses (MSBs) (NAICS 522390)" },
  // Example: If no industries are defined, it would be an empty array:
  // const initialIndustries: HighRiskIndustry[] = [];
]

export function HighRiskIndustriesSettings() {
  const [industries, setIndustries] = useState<HighRiskIndustry[]>(initialIndustries)
  const [newIndustryLabel, setNewIndustryLabel] = useState("")
  const { toast } = useToast()

  const handleAddIndustry = () => {
    if (!newIndustryLabel.trim()) {
      toast({ title: "Cannot add empty label", variant: "destructive", description: "Please enter an industry label." })
      return
    }
    setIndustries([...industries, { id: `hr${Date.now()}`, naicsSicLabel: newIndustryLabel }])
    setNewIndustryLabel("")
    toast({ title: "High-Risk Industry Added" })
  }

  const handleRemoveIndustry = (id: string) => {
    setIndustries(industries.filter((ind) => ind.id !== id))
    toast({ title: "High-Risk Industry Removed" })
  }

  const handleLabelChange = (id: string, value: string) => {
    setIndustries(industries.map((ind) => (ind.id === id ? { ...ind, naicsSicLabel: value } : ind)))
  }

  const isEmpty = industries.length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">2. High-Risk Industries</CardTitle>
        <CardDescription>
          Identify prohibited or elevated-risk industries.
          {isEmpty && (
            <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-600">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Not Defined
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAICS/SIC Industry Label</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {industries.map((industry) => (
                <TableRow key={industry.id}>
                  <TableCell>
                    <Input
                      value={industry.naicsSicLabel}
                      onChange={(e) => handleLabelChange(industry.id, e.target.value)}
                      placeholder="e.g., Arms Manufacturing (SIC 348)"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveIndustry(industry.id)}
                      title="Remove Industry"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {isEmpty && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                    No high-risk industries defined. Add one below.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex gap-2 items-center pt-2">
          <Input
            value={newIndustryLabel}
            onChange={(e) => setNewIndustryLabel(e.target.value)}
            placeholder="Enter new industry label to add"
            className="h-9 flex-grow"
          />
          <Button onClick={handleAddIndustry} variant="outline" size="sm" className="bg-background text-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Industry
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
