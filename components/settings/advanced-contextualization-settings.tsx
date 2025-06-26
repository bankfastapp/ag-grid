"use client"

import { useState } from "react"
import type { AdvancedContextualization } from "@/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// ---------------------------------------------------------------------------
// INITIAL DATA --------------------------------------------------------------
// ---------------------------------------------------------------------------
const initialContext: AdvancedContextualization = {
  id: "ac1",
  portfolioConcentrations: `Commercial Real Estate (CRE): Max 25% of total portfolio.
Hospitality: Max 10% of total portfolio.
Single Borrower Limit: 15% of Tier 1 Capital.`,
  keyFinancialMetrics: [
    { name: "Current Ratio", ideal: "1.50", minAcceptable: "1.00" },
    { name: "Debt Service Coverage Ratio (DSCR)", ideal: "1.25", minAcceptable: "1.00" },
    { name: "Debt to Assets Ratio", ideal: "0.50", minAcceptable: "0.80" },
    { name: "Return on Assets (ROA)", ideal: "5.0 %", minAcceptable: "2.0 %" },
    { name: "Return on Equity (ROE)", ideal: "20.0 %", minAcceptable: "10.0 %" },
  ],
  marketDefinitions: `Primary Market Area (PMA): Counties of Polk, Story, Dallas, Warren, Madison (IA).
Secondary Market Area (SMA): Contiguous counties to PMA, and Sioux Falls MSA (SD).
Out-of-Market: All other areas, subject to stricter underwriting.`,
  contextValidated: true,
}

// ---------------------------------------------------------------------------
// COMPONENT -----------------------------------------------------------------
// ---------------------------------------------------------------------------
export function AdvancedContextualizationSettings() {
  const [context, setContext] = useState<AdvancedContextualization>(initialContext)
  const { toast } = useToast()

  // helpers ------------------------------------------------------
  const updateMetric = (index: number, field: keyof (typeof context)["keyFinancialMetrics"][number], value: string) => {
    setContext((prev) => {
      const metrics = [...prev.keyFinancialMetrics]
      metrics[index] = { ...metrics[index], [field]: value }
      return { ...prev, keyFinancialMetrics: metrics }
    })
  }

  const addMetric = () =>
    setContext((prev) => ({
      ...prev,
      keyFinancialMetrics: [...prev.keyFinancialMetrics, { name: "", ideal: "", minAcceptable: "" }],
    }))

  const removeMetric = (index: number) => {
    setContext((prev) => ({
      ...prev,
      keyFinancialMetrics: prev.keyFinancialMetrics.filter((_, i) => i !== index),
    }))
    toast({ title: "Key Metric Removed" })
  }

  // -------------------------------------------------------------------------
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          8.&nbsp;Advanced Contextualization
          {context.contextValidated && <CheckCircle className="h-5 w-5 text-green-600" title="Context Validated" />}
        </CardTitle>
        <CardDescription>Understand the institution’s macro risk posture.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Portfolio Concentrations --------------------------------------- */}
        <div>
          <label htmlFor="portfolioConcentrations" className="text-sm font-medium">
            Portfolio Concentrations
          </label>
          <Textarea
            id="portfolioConcentrations"
            rows={4}
            value={context.portfolioConcentrations}
            onChange={(e) => setContext({ ...context, portfolioConcentrations: e.target.value })}
          />
        </div>

        {/* Key Financial Metrics table ------------------------------------ */}
        <div>
          <h4 className="text-sm font-medium mb-2">Key Financial Metrics</h4>

          {/* table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center px-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground">METRIC</span>
            <span className="text-xs font-semibold text-muted-foreground">IDEAL</span>
            <span className="text-xs font-semibold text-muted-foreground">MIN ACCEPTABLE</span>
            <span />
          </div>

          {/* rows */}
          {context.keyFinancialMetrics.map((m, idx) => (
            <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 mb-2 items-center">
              <Input
                value={m.name}
                placeholder="Metric name"
                onChange={(e) => updateMetric(idx, "name", e.target.value)}
              />
              <Input value={m.ideal} placeholder="Ideal" onChange={(e) => updateMetric(idx, "ideal", e.target.value)} />
              <Input
                value={m.minAcceptable}
                placeholder="Min"
                onChange={(e) => updateMetric(idx, "minAcceptable", e.target.value)}
              />
              <Button size="icon" variant="ghost" onClick={() => removeMetric(idx)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={addMetric} className="bg-background mt-1">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Metric
          </Button>
        </div>

        {/* Market Definitions -------------------------------------------- */}
        <div>
          <label htmlFor="marketDefinitions" className="text-sm font-medium">
            Market Definitions (In vs Out)
          </label>
          <Textarea
            id="marketDefinitions"
            rows={4}
            value={context.marketDefinitions}
            onChange={(e) => setContext({ ...context, marketDefinitions: e.target.value })}
          />
        </div>

        {/* Validation checkbox ------------------------------------------- */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="contextValidated"
            checked={context.contextValidated}
            onCheckedChange={(c) => setContext({ ...context, contextValidated: !!c })}
          />
          <label htmlFor="contextValidated" className="text-sm font-medium">
            Context Validated by Management
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
