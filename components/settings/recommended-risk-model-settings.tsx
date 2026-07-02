"use client"
import { useState } from "react"
import type { RecommendedRiskModel } from "@/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const initialModel: RecommendedRiskModel = {
  id: "rrm1",
  fitModelName: "Hybrid Scorecard Model (C&I Focus) - v1.2",
  justification:
    "This model is recommended based on the bank's current asset mix (significant C&I loan portfolio) and typical borrower profile (SMEs with $1M-$50M annual revenue). It combines traditional financial ratio analysis with qualitative overlays for management quality and industry outlook. The model prioritizes cash flow analysis (DSCR) and collateral coverage (LTV), aligning with the bank's conservative underwriting approach. It has been back-tested against the bank's historical loan performance data (2018-2023) and demonstrated strong predictive power for default and risk rating migration.",
}

export function RecommendedRiskModelSettings() {
  const [model, setModel] = useState<RecommendedRiskModel>(initialModel)

  return (
    <Card>
      <CardHeader>
        <CardTitle>9. Recommended Risk Model Fit</CardTitle>
        <CardDescription>Suggest best-fit risk model approach for institution profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="fitModelName" className="text-sm font-medium">
            Fit Model Name
          </label>
          <Input
            id="fitModelName"
            value={model.fitModelName}
            onChange={(e) => setModel((prev) => ({ ...prev, fitModelName: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="justification" className="text-sm font-medium">
            Justification
          </label>
          <Textarea
            id="justification"
            value={model.justification}
            onChange={(e) => setModel((prev) => ({ ...prev, justification: e.target.value }))}
            rows={7}
          />
        </div>
      </CardContent>
    </Card>
  )
}
