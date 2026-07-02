"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const riskScores = [
  { score: "1.0", label: "Excellent", descriptor: "Top-tier credit, low risk, strong financials" },
  { score: "2.0", label: "Good", descriptor: "Solid credit, minor weakness, strong repayment history" },
  { score: "2.1 - 3.4", label: "Satisfactory", descriptor: "Acceptable credit with average risk" },
  { score: "4.0", label: "Monitored", descriptor: "Some weakness present, higher oversight warranted" },
  {
    score: "5.0",
    label: "Other Assets Especially Mentioned (OAEM)",
    descriptor: "Not yet substandard but potential weakness",
  },
  { score: "6.0", label: "Substandard", descriptor: "Clear weaknesses, potential for loss if not corrected" },
  { score: "7.0", label: "Doubtful", descriptor: "Loss is highly probable, not yet fully confirmed" },
  { score: "8.0", label: "Loss", descriptor: "Uncollectible, must be charged off" },
]

const auditComment =
  "Current model (v2.1) provided by Risk Department, validated on 2024-03-15. Next review scheduled for 2025-03-15. Model emphasizes cash flow and liquidity for businesses, and overall debt burden for individuals."

export function RiskScoreDefinitions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Score Definitions</CardTitle>
        <CardDescription>Internal risk rating definitions based on the institution's loan policy.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Risk Score</TableHead>
                <TableHead className="w-[250px]">Rating Label</TableHead>
                <TableHead>Descriptor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskScores.map((item) => (
                <TableRow key={item.score} className={item.label === "Satisfactory" ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{item.score}</TableCell>
                  <TableCell className={item.label === "Satisfactory" ? "font-bold" : ""}>{item.label}</TableCell>
                  <TableCell>{item.descriptor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground mt-4 border-t pt-4">{auditComment}</p>
      </CardContent>
    </Card>
  )
}
