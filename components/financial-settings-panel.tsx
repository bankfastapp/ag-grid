"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { UserManagementSettings } from "./settings/user-management-settings"
import { AdvanceRatesSettings } from "./settings/advance-rates-settings"
import { HighRiskIndustriesSettings } from "./settings/high-risk-industries-settings"
import { ProductSettings } from "./settings/product-settings"
import { RiskAnalysisSettings } from "./settings/risk-analysis-settings"
import { ComplianceChecklistsSettings } from "./settings/compliance-checklists-settings"
import { DocumentRequirementsSettings } from "./settings/document-requirements-settings"
import { SupplementaryRequirementsSettings } from "./settings/supplementary-requirements-settings"
import { AdvancedContextualizationSettings } from "./settings/advanced-contextualization-settings"
import { RecommendedRiskModelSettings } from "./settings/recommended-risk-model-settings"

// You might want a way to navigate these sections, e.g., a sub-nav or tabs
// For now, it's a scrollable list of cards.

export function FinancialSettingsPanel() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* User Management is often a key part of settings, placing it prominently */}
        <UserManagementSettings />

        {/* AI Service Integration Settings */}
        <AdvanceRatesSettings />
        <HighRiskIndustriesSettings />
        <ProductSettings />
        <RiskAnalysisSettings />
        <ComplianceChecklistsSettings />
        <DocumentRequirementsSettings />
        <SupplementaryRequirementsSettings />
        <AdvancedContextualizationSettings />
        <RecommendedRiskModelSettings />
      </div>
    </ScrollArea>
  )
}
