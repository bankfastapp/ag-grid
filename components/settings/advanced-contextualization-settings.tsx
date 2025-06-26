"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus } from "lucide-react"
import type { AdvancedContextualization } from "@/types"

const initialContextData: AdvancedContextualization = {
  id: "adv-ctx-1",
  portfolioConcentrations:
    "High concentration in commercial real estate (45% of portfolio), specifically multi-family units in the Midwest region. Significant exposure to the agricultural sector (20%), primarily corn and soybean producers.",
  keyFinancialMetrics: [
    { id: "1", name: "Current Ratio", ideal: "1.50", minAcceptable: "1.00" },
    { id: "2", name: "Debt Service Coverage Ratio (DSCR)", ideal: "1.25", minAcceptable: "1.00" },
    { id: "3", name: "Debt to Equity Ratio", ideal: "1.00", minAcceptable: "2.00" },
    { id: "4", name: "Return on Assets (ROA)", ideal: "5%", minAcceptable: "2%" },
    { id: "5", name: "Net Debt to EBITDA Ratio", ideal: "2.00", minAcceptable: "4.00" },
  ],
  marketDefinitions:
    "Primary market defined as a 100-mile radius from the main branch. Out-of-market lending is restricted to participations and loans exceeding $5M with established clients.",
  contextValidated: true,
}

export default function AdvancedContextualizationSettings() {
  const [context, setContext] = useState<AdvancedContextualization>(initialContextData)

  const handleMetricChange = (index: number, field: "name" | "ideal" | "minAcceptable", value: string) => {
    const newMetrics = [...context.keyFinancialMetrics]
    newMetrics[index] = { ...newMetrics[index], [field]: value }
    setContext({ ...context, keyFinancialMetrics: newMetrics })
  }

  const handleAddMetric = () => {
    const newMetrics = [
      ...context.keyFinancialMetrics,
      { id: `metric-${Date.now()}`, name: "", ideal: "", minAcceptable: "" },
    ]
    setContext({ ...context, keyFinancialMetrics: newMetrics })
  }

  const handleRemoveMetric = (index: number) => {
    const newMetrics = context.keyFinancialMetrics.filter((_, i) => i !== index)
    setContext({ ...context, keyFinancialMetrics: newMetrics })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>8. Advanced Contextualization</CardTitle>
        <CardDescription>
          Define portfolio concentrations, key metrics, and market definitions for AI analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="portfolio-concentrations">Portfolio Concentrations</Label>
          <Textarea
            id="portfolio-concentrations"
            placeholder="Describe significant portfolio concentrations..."
            value={context.portfolioConcentrations}
            onChange={(e) => setContext({ ...context, portfolioConcentrations: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <Label>Key Financial Metrics</Label>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_120px_120px_40px] gap-x-4 px-2 pb-2 border-b">
              <p className="text-sm font-medium text-muted-foreground">Metric Name</p>
              <p className="text-sm font-medium text-muted-foreground">Ideal</p>
              <p className="text-sm font-medium text-muted-foreground">Min Acceptable</p>
              <span className="sr-only">Actions</span>
            </div>
            {context.keyFinancialMetrics.map((metric, index) => (
              <div key={metric.id} className="grid grid-cols-[1fr_120px_120px_40px] gap-x-4 items-center">
                <Input
                  value={metric.name}
                  onChange={(e) => handleMetricChange(index, "name", e.target.value)}
                  placeholder="e.g., Current Ratio"
                />
                <Input
                  value={metric.ideal}
                  onChange={(e) => handleMetricChange(index, "ideal", e.target.value)}
                  placeholder="e.g., 1.50"
                />
                <Input
                  value={metric.minAcceptable}
                  onChange={(e) => handleMetricChange(index, "minAcceptable", e.target.value)}
                  placeholder="e.g., 1.00"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMetric(index)}
                  aria-label="Remove metric"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleAddMetric}>
            <Plus className="h-4 w-4 mr-2" />
            Add Metric
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="market-definitions">Market Definitions (In vs. Out)</Label>
          <Textarea
            id="market-definitions"
            placeholder="Define what constitutes 'in-market' vs 'out-of-market'..."
            value={context.marketDefinitions}
            onChange={(e) => setContext({ ...context, marketDefinitions: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="context-validated" className="text-base">
              Context Validated
            </Label>
            <p className="text-sm text-muted-foreground">
              Confirm that these contextual settings have been reviewed and are accurate.
            </p>
          </div>
          <Switch
            id="context-validated"
            checked={context.contextValidated}
            onCheckedChange={(checked) => setContext({ ...context, contextValidated: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
