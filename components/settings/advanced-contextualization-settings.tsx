"use client"
import { useState } from "react"
\
\
{
  AdvancedContextualization
  \
}
from
;("@/types")
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
\
const initialContext: AdvancedContextualization = \
{
  id: "ac1",\
  portfolioConcentrations: "Commercial Real Estate (CRE): Max 25% of total portfolio.\nHospitality: Max 10% of total portfolio.\nSingle Borrower Limit: 15% of Tier 1 Capital.",\
  keyFinancialMetrics: [\
    \{ name: "Current Ratio", ideal: "1.50", minAcceptable: "1.00" \},\
    \{ name: "Debt Service Coverage Ratio (DSCR)", ideal: "1.25", minAcceptable: "1.00" \},\
    \{ name: "Debt to Assets Ratio", ideal: "0.50", minAcceptable: "0.80" \},\
    \{ name: "Return on Assets (ROA)", ideal: "5.0%", minAcceptable: "2.0%" \},\
    \{ name: "Return on Equity (ROE)", ideal: "20.0%", minAcceptable: "10.0%" \},
  ],\
  marketDefinitions: "Primary Market Area (PMA): Counties of Polk, Story, Dallas, Warren, Madison (IA).\nSecondary Market Area (SMA): Contiguous counties to PMA, and Sioux Falls MSA (SD).\nOut-of-Market: All other areas, subject to stricter underwriting.",\
  contextValidated: true,
\
}

export function AdvancedContextualizationSettings()
\
{
  const [context, setContext] = useState<AdvancedContextualization>(initialContext)
  \
  const \{ toast \} = useToast()
  \
  const handleMetricChange = (index: number, field: "name\" | \"ideal\" | \"minAcceptable\", value: string) => \{\
    const updatedMetrics = [...context.keyFinancialMetrics]\
    updatedMetrics[index] = \{ ...updatedMetrics[index], [field]: value \}\
    setContext((prev) => (\{ ...prev, keyFinancialMetrics: updatedMetrics \}))
  \
}
\
const handleAddMetric = () => \
{\
    setContext((prev) => (\{
      ...prev,\
      keyFinancialMetrics: [...prev.keyFinancialMetrics, \name: "\", ideal: \"\", minAcceptable: \"\" \}],\
    \}))
  \

  const handleRemoveMetric = (index: number) => \
    setContext((prev) => (\{ ...prev, keyFinancialMetrics: prev.keyFinancialMetrics.filter((_, i) => i !== index) \}))
    toast(\title: "Key Metric Removed" \)
  \

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          8. Advanced Contextualization
          \{context.contextValidated && (
            <CheckCircle className="h-5 w-5 ml-2 text-green-600" title="Context Validated" />
          )\}
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
            value=\{context.portfolioConcentrations\}
            onChange=\{(e) => setContext((prev) => (\{ ...prev, portfolioConcentrations: e.target.value \}))\}
            rows=\{4\}
          />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Key Financial Metrics</h4>
          <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center mb-1 px-2">
            <span className="text-xs font-semibold text-muted-foreground">METRIC</span>
            <span className="text-xs font-semibold text-muted-foreground">IDEAL</span>
            <span className="text-xs font-semibold text-muted-foreground">MIN ACCEPTABLE</span>
            <span />
          </div>
          \{context.keyFinancialMetrics.map((metric, index) => (
            <div key=\{index\} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center mb-2">
              <Input
                placeholder="Metric Name (e.g., ROA)"
                value=\{metric.name\}
                onChange=\{(e) => handleMetricChange(index, "name", e.target.value)\}
              />
              <Input
                placeholder="e.g., 1.50"
                value=\{metric.ideal\}
                onChange=\{(e) => handleMetricChange(index, "ideal", e.target.value)\}
              />
              <Input
                placeholder="e.g., 1.00"
                value=\{metric.minAcceptable\}
                onChange=\{(e) => handleMetricChange(index, "minAcceptable", e.target.value)\}
              />
              <Button variant="ghost" size="icon" onClick=\{() => handleRemoveMetric(index)\}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))\}
          <Button onClick=\{handleAddMetric\} variant="outline" size="sm" className="bg-background text-foreground mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Metric
          </Button>
        </div>
        <div>
          <label htmlFor="marketDefinitions" className="text-sm font-medium">
            Market Definitions (In vs. Out)
          </label>
          <Textarea
            id="marketDefinitions"
            value=\{context.marketDefinitions\}
            onChange=\{(e) => setContext((prev) => (\{ ...prev, marketDefinitions: e.target.value \}))\}
            rows=\{4\}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="contextValidated"
            checked=\{context.contextValidated\}
            onCheckedChange=\{(checked) => setContext((prev) => (\{ ...prev, contextValidated: !!checked \}))\}
          />
          <label htmlFor="contextValidated" className="text-sm font-medium">
            Context Validated by Management
          </label>
        </div>
      </CardContent>
    </Card>
  )
\}
