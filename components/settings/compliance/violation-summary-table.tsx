"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export type ViolationSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface Violation {
  id: string
  entityPrincipal: string
  category: string
  type: string
  severity: ViolationSeverity
  date: string
  description: string
  actionRequired: string
}

const initialViolations: Violation[] = [
  // Example:
  // {
  //   id: "v1",
  //   entityPrincipal: "Entity1",
  //   category: "Compliance",
  //   type: "Missing KYC Documentation",
  //   severity: "MEDIUM",
  //   date: "2023-12-01",
  //   description: "KYC file incomplete per internal checklist",
  //   actionRequired: "Obtain updated KYC documents",
  // },
  // {
  //   id: "v2",
  //   entityPrincipal: "Principal1",
  //   category: "Regulatory",
  //   type: "OFAC Sanctions Match",
  //   severity: "CRITICAL",
  //   date: "2024-01-15",
  //   description: "Name match on OFAC SDN list per Perplexity search 01/15/2024",
  //   actionRequired: "Escalate to compliance, halt processing",
  // },
]

export function ViolationSummaryTable() {
  const [violations, setViolations] = useState<Violation[]>(initialViolations)
  const { toast } = useToast()

  const handleAddViolation = () => {
    // This would typically open a modal or a new row for editing
    toast({ title: "Add Violation Clicked", description: "Functionality to add a new violation will be here." })
    // Example of adding a blank violation for inline editing (if implemented):
    // setViolations(prev => [...prev, { id: `v${Date.now()}`, entityPrincipal: "", category: "", type: "", severity: "MEDIUM", date: "", description: "", actionRequired: "" }]);
  }

  const handleRemoveViolation = (id: string) => {
    setViolations((prev) => prev.filter((v) => v.id !== id))
    toast({ title: "Violation Removed", variant: "destructive" })
  }

  const getSeverityBadgeVariant = (severity: ViolationSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return "destructive"
      case "HIGH":
        return "destructive" // Or a custom orange/yellow
      case "MEDIUM":
        return "secondary" // Or a custom yellow
      case "LOW":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Violation Summary</CardTitle>
            <CardDescription>Overview of identified compliance, regulatory, or policy violations.</CardDescription>
          </div>
          <Button onClick={handleAddViolation} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Violation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {violations.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No violations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity/Principal</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Violation Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Action Required</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {violations.map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell>{violation.entityPrincipal}</TableCell>
                    <TableCell>{violation.category}</TableCell>
                    <TableCell>{violation.type}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityBadgeVariant(violation.severity)}>{violation.severity}</Badge>
                    </TableCell>
                    <TableCell>{violation.date}</TableCell>
                    <TableCell className="max-w-xs truncate" title={violation.description}>
                      {violation.description}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={violation.actionRequired}>
                      {violation.actionRequired}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveViolation(violation.id)}
                        title="Remove Violation"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
