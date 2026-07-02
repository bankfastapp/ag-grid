"use client"
import { useState } from "react"
import type React from "react"

import type { RiskAnalysisMetric } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialBusinessMetrics: RiskAnalysisMetric[] = [
  { id: "m1", borrowerType: "Business", metricName: "Debt Service Coverage Ratio (DSCR)", weighting: 35 },
  { id: "m2", borrowerType: "Business", metricName: "Leverage (Debt/Equity)", weighting: 25 },
  { id: "m3", borrowerType: "Business", metricName: "Liquidity (Current Ratio)", weighting: 20 },
  { id: "m7", borrowerType: "Business", metricName: "Profitability (Net Profit Margin)", weighting: 10 },
  { id: "m8", borrowerType: "Business", metricName: "Management Experience", weighting: 10 },
]

const initialIndividualMetrics: RiskAnalysisMetric[] = [
  { id: "m4", borrowerType: "Individual", metricName: "Debt-to-Income Ratio (DTI)", weighting: 40 },
  { id: "m5", borrowerType: "Individual", metricName: "Credit Score (FICO)", weighting: 30 },
  { id: "m6", borrowerType: "Individual", metricName: "Liquid Assets", weighting: 15 },
  { id: "m9", borrowerType: "Individual", metricName: "Employment Stability", weighting: 10 },
  { id: "m10", borrowerType: "Individual", metricName: "Net Worth", weighting: 5 },
]

const initialAuditComments =
  "Current model (v2.1) provided by Risk Department, validated on 2024-03-15. Next review scheduled for 2025-03-15. Model emphasizes cash flow and liquidity for businesses, and overall debt burden for individuals."

interface MetricTableProps {
  metrics: RiskAnalysisMetric[]
  onMetricChange: (metricId: string, field: keyof RiskAnalysisMetric, value: any) => void
  onAddMetric: () => void
  onRemoveMetric: (metricId: string) => void
}

const MetricTable: React.FC<MetricTableProps> = ({ metrics, onMetricChange, onAddMetric, onRemoveMetric }) => {
  const totalWeighting = metrics.reduce((acc, metric) => acc + (metric.weighting || 0), 0)

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric Name</TableHead>
            <TableHead className="w-[150px]">Weighting (%)</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.id}>
              <TableCell>
                <Input
                  placeholder="Metric Name (e.g., DSCR)"
                  value={metric.metricName}
                  onChange={(e) => onMetricChange(metric.id, "metricName", e.target.value)}
                  className="h-9"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Weight (%)"
                  value={metric.weighting}
                  onChange={(e) => onMetricChange(metric.id, "weighting", Number.parseFloat(e.target.value) || 0)}
                  className="h-9"
                />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onRemoveMetric(metric.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center pt-2">
        <Button onClick={onAddMetric} variant="outline" size="sm" className="bg-background text-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Metric
        </Button>
        <div className={`text-sm font-medium ${totalWeighting !== 100 ? "text-destructive" : "text-foreground"}`}>
          Total Weighting: {totalWeighting}%
        </div>
      </div>
    </div>
  )
}

export function RiskAnalysisSettings() {
  const [businessMetrics, setBusinessMetrics] = useState<RiskAnalysisMetric[]>(initialBusinessMetrics)
  const [individualMetrics, setIndividualMetrics] = useState<RiskAnalysisMetric[]>(initialIndividualMetrics)
  const [source, setSource] = useState<"Provided" | "Default">("Provided")
  const [auditComments, setAuditComments] = useState(initialAuditComments)
  const { toast } = useToast()

  const createMetricHandler =
    (
      metrics: RiskAnalysisMetric[],
      setMetrics: React.Dispatch<React.SetStateAction<RiskAnalysisMetric[]>>,
      borrowerType: "Business" | "Individual",
    ) =>
    (metricId: string, field: keyof RiskAnalysisMetric, value: any) => {
      setMetrics((prev) => prev.map((m) => (m.id === metricId ? { ...m, [field]: value } : m)))
    }

  const createAddHandler =
    (setMetrics: React.Dispatch<React.SetStateAction<RiskAnalysisMetric[]>>, borrowerType: "Business" | "Individual") =>
    () => {
      setMetrics((prev) => [...prev, { id: `m${Date.now()}`, borrowerType, metricName: "", weighting: 0 }])
    }

  const createRemoveHandler =
    (setMetrics: React.Dispatch<React.SetStateAction<RiskAnalysisMetric[]>>) => (metricId: string) => {
      setMetrics((prev) => prev.filter((m) => m.id !== metricId))
      toast({ title: "Metric Removed" })
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Analysis (Entity-Based)</CardTitle>
        <CardDescription>Integrate and audit existing business/individual risk models.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="business">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="business">Business Entity</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
          </TabsList>
          <TabsContent value="business" className="pt-4">
            <MetricTable
              metrics={businessMetrics}
              onMetricChange={createMetricHandler(businessMetrics, setBusinessMetrics, "Business")}
              onAddMetric={createAddHandler(setBusinessMetrics, "Business")}
              onRemoveMetric={createRemoveHandler(setBusinessMetrics)}
            />
          </TabsContent>
          <TabsContent value="individual" className="pt-4">
            <MetricTable
              metrics={individualMetrics}
              onMetricChange={createMetricHandler(individualMetrics, setIndividualMetrics, "Individual")}
              onAddMetric={createAddHandler(setIndividualMetrics, "Individual")}
              onRemoveMetric={createRemoveHandler(setIndividualMetrics)}
            />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div>
            <label className="text-sm font-medium">Source</label>
            <Select value={source} onValueChange={(val: "Provided" | "Default") => setSource(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Provided">Provided by Institution</SelectItem>
                <SelectItem value="Default">Default Model</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="auditComments" className="text-sm font-medium">
              Audit Comments
            </label>
            <Textarea
              id="auditComments"
              value={auditComments}
              onChange={(e) => setAuditComments(e.target.value)}
              placeholder="Enter audit comments..."
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
