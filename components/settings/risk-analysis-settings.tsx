"use client"
import { useState } from "react"
import type { RiskAnalysisSetting, RiskAnalysisMetric } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialRiskAnalysis: RiskAnalysisSetting = {
  id: "ra1",
  metrics: [
    { id: "m1", borrowerType: "Business", metricName: "Debt Service Coverage Ratio (DSCR)", weighting: 35 },
    { id: "m2", borrowerType: "Business", metricName: "Leverage (Debt/Equity)", weighting: 25 },
    { id: "m3", borrowerType: "Business", metricName: "Liquidity (Current Ratio)", weighting: 20 },
    { id: "m4", borrowerType: "Individual", metricName: "Debt-to-Income Ratio (DTI)", weighting: 40 },
    { id: "m5", borrowerType: "Individual", metricName: "Credit Score (FICO)", weighting: 30 },
    { id: "m6", borrowerType: "Individual", metricName: "Liquid Assets", weighting: 15 },
  ],
  source: "Provided",
  auditComments:
    "Current model (v2.1) provided by Risk Department, validated on 2024-03-15. Next review scheduled for 2025-03-15. Model emphasizes cash flow and liquidity for businesses, and overall debt burden for individuals.",
  referenceRatios: ["DSCR", "DTI", "LTV", "Current Ratio", "Global DSCR"],
}

const allRatios = ["DSCR", "DTI", "LTV", "Current Ratio", "Quick Ratio", "Global DSCR", "Interest Coverage Ratio"]

export function RiskAnalysisSettings() {
  const [settings, setSettings] = useState<RiskAnalysisSetting>(initialRiskAnalysis)
  const { toast } = useToast()

  const handleMetricChange = (metricId: string, field: keyof RiskAnalysisMetric, value: any) => {
    setSettings((prev) => ({
      ...prev,
      metrics: prev.metrics.map((m) => (m.id === metricId ? { ...m, [field]: value } : m)),
    }))
  }

  const handleAddMetric = () => {
    setSettings((prev) => ({
      ...prev,
      metrics: [...prev.metrics, { id: `m${Date.now()}`, borrowerType: "Business", metricName: "", weighting: 0 }],
    }))
  }

  const handleRemoveMetric = (metricId: string) => {
    setSettings((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((m) => m.id !== metricId),
    }))
    toast({ title: "Metric Removed" })
  }

  const handleReferenceRatioChange = (ratio: string, checked: boolean) => {
    setSettings((prev) => {
      const currentRatios = prev.referenceRatios || []
      if (checked) {
        return { ...prev, referenceRatios: [...currentRatios, ratio] }
      } else {
        return { ...prev, referenceRatios: currentRatios.filter((r) => r !== ratio) }
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>4. Risk Analysis (Entity-Based)</CardTitle>
        <CardDescription>Integrate and audit existing business/individual risk models.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Metric Weighting per Borrower Type</h4>
          {settings.metrics.map((metric) => (
            <div
              key={metric.id}
              className="grid grid-cols-[150px_1fr_100px_auto] gap-2 items-center mb-2 p-2 border rounded-md"
            >
              <Select
                value={metric.borrowerType}
                onValueChange={(val: "Business" | "Individual") => handleMetricChange(metric.id, "borrowerType", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Metric Name (e.g., DSCR)"
                value={metric.metricName}
                onChange={(e) => handleMetricChange(metric.id, "metricName", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Weight (%)"
                value={metric.weighting}
                onChange={(e) => handleMetricChange(metric.id, "weighting", Number.parseFloat(e.target.value))}
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveMetric(metric.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddMetric} variant="outline" size="sm" className="mt-2 bg-background text-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Metric
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium">Source</label>
          <Select
            value={settings.source}
            onValueChange={(val: "Provided" | "Default") => setSettings((prev) => ({ ...prev, source: val }))}
          >
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
            value={settings.auditComments}
            onChange={(e) => setSettings((prev) => ({ ...prev, auditComments: e.target.value }))}
            placeholder="Enter audit comments..."
            rows={4}
          />
        </div>

        <div>
          <h4 className="font-medium mb-2">Reference Ratios Included</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allRatios.map((ratio) => (
              <div key={ratio} className="flex items-center space-x-2">
                <Checkbox
                  id={`ratio-${ratio}`}
                  checked={(settings.referenceRatios || []).includes(ratio)}
                  onCheckedChange={(checked) => handleReferenceRatioChange(ratio, !!checked)}
                />
                <label htmlFor={`ratio-${ratio}`} className="text-sm">
                  {ratio}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
