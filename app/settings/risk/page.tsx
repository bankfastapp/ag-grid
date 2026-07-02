"use client"

import { RiskAnalysisSettings } from "@/components/settings/risk-analysis-settings"
import FinancialStandardsSettings from "@/components/settings/financial-standards-settings"
import { Separator } from "@/components/ui/separator"
import { RiskScoreDefinitions } from "@/components/settings/risk/risk-score-definitions" // Add this import

export default function RiskSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Risk Configuration</h1>
        <p className="text-muted-foreground">
          Manage financial standards, risk analysis models, and high-risk entities.
        </p>
      </div>
      <FinancialStandardsSettings />
      <Separator />
      <RiskAnalysisSettings />
      <Separator />
      <RiskScoreDefinitions /> {/* Add this component */}
    </div>
  )
}
