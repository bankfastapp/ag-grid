"use client"

import { AdvanceRatesSettings } from "@/components/settings/advance-rates-settings"
import { HighRiskIndustriesSettings } from "@/components/settings/high-risk-industries-settings"
import { ProductSettings } from "@/components/settings/product-settings"
import { ComplianceChecklistsSettings } from "@/components/settings/compliance-checklists-settings"
import { DocumentRequirementsSettings } from "@/components/settings/document-requirements-settings"
import { SupplementaryRequirementsSettings } from "@/components/settings/supplementary-requirements-settings"
import { Separator } from "@/components/ui/separator"

export default function LendingConfigurationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Lending Configuration</h1>
        <p className="text-muted-foreground">
          Manage lending products, rates, compliance, documentation, and related policies.
        </p>
      </div>

      <AdvanceRatesSettings />
      <Separator />
      <HighRiskIndustriesSettings />
      <Separator />
      <ProductSettings />
      <Separator />
      <ComplianceChecklistsSettings />
      <Separator />
      <DocumentRequirementsSettings />
      <Separator />
      <SupplementaryRequirementsSettings />
      {/* Add other lending-specific settings components here if needed */}
    </div>
  )
}
