"use client"
import { useState } from "react"
import type { AdvancedContextualization } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialContext: AdvancedContextualization = {
  id: "ac1",
  portfolioConcentrations:
    "Commercial Real Estate (CRE): Max 25% of total portfolio.\nHospitality: Max 10% of total portfolio.\nSingle Borrower Limit: 15% of Tier 1 Capital.",
  keyFinancialMetrics: [
    { name: "Return on Assets (ROA)", value: "Target > 0.75%" },
    { name: "Tier 1 Capital Ratio", value: "Minimum 9.0%, Target > 10.0%" },
    { name: "Efficiency Ratio", value: "Target < 65%" },
    { name: "Net Interest Margin (NIM)", value: "Target > 3.25%" },
  ],
  marketDefinitions:
    "Primary Market Area (PMA): Counties of Polk, Story, Dallas, Warren, Madison (IA).\nSecondary Market Area (SMA): Contiguous counties to PMA, and Sioux Falls MSA (SD).\nOut-of-Market: All other areas, subject to stricter underwriting.",
  contextValidated: true,
}

export function AdvancedContextualizationSettings() {
  const [context, setContext] = useState<AdvancedContextualization>(initialContext)
  const { toast } = useToast()

  const handleMetricChange = (index: number, field: "name" | "value", value: string) => {
    const updatedMetrics = [...context.keyFinancialMetrics]
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value }
    setContext((prev) => ({ ...prev, keyFinancialMetrics: updatedMetrics }))
  }

  const handleAddMetric = () => {
    setContext((prev) => ({ ...prev, keyFinancialMetrics: [...prev.keyFinancialMetrics, { name: "", value: "" }] }))
  }

  const handleRemoveMetric = (index: number) => {
    setContext((prev) => ({ ...prev, keyFinancialMetrics: prev.keyFinancialMetrics.filter((_, i) => i !== index) }))
    toast({ title: "Key Metric Removed" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          8. Advanced Contextualization
          {context.contextValidated && (
            <CheckCircle className="h-5 w-5 ml-2 text-green-600" title="Context Validated" />
          )}
        </CardTitle>
        <CardDescription>Understand the institution’s macro risk posture.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="portfolioConcentrations" className="text-sm font-medium">
            Portfolio Concentrations
          </label>
          <Textarea
            id="portfolioConcentrations"
            value={context.portfolioConcentrations}
            onChange={(e) => setContext((prev) => ({ ...prev, portfolioConcentrations: e.target.value }))}
            rows={4}
          />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Key Financial Metrics</h4>
          {context.keyFinancialMetrics.map((metric, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <Input
                placeholder="Metric Name (e.g., ROA)"
                value={metric.name}
                onChange={(e) => handleMetricChange(index, "name", e.target.value)}
              />
              <Input
                placeholder="Value/Target (e.g., > 1.0%)"
                value={metric.value}
                onChange={(e) => handleMetricChange(index, "value", e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveMetric(index)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddMetric} variant="outline" size="sm" className="bg-background text-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Metric
          </Button>
        </div>
        <div>
          <label htmlFor="marketDefinitions" className="text-sm font-medium">
            Market Definitions (In vs. Out)
          </label>
          <Textarea
            id="marketDefinitions"
            value={context.marketDefinitions}
            onChange={(e) => setContext((prev) => ({ ...prev, marketDefinitions: e.target.value }))}
            rows={4}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="contextValidated"
            checked={context.contextValidated}
            onCheckedChange={(checked) => setContext((prev) => ({ ...prev, contextValidated: !!checked }))}
          />
          <label htmlFor="contextValidated" className="text-sm font-medium">
            Context Validated by Management
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
