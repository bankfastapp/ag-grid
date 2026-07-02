"use client"
// Removed UserManagementSettings and other lending-related imports
import { AdvancedContextualizationSettings } from "@/components/settings/advanced-contextualization-settings"
import { RecommendedRiskModelSettings } from "@/components/settings/recommended-risk-model-settings"
// Import other institution-specific settings components here if any

export default function InstitutionConfigurationPage() {
  // Renamed from GeneralConfigurationPage for clarity
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Institution</h1>
        <p className="text-muted-foreground">Manage institution-wide settings and parameters.</p>
      </div>
      <AdvancedContextualizationSettings />
      <RecommendedRiskModelSettings />
      {/* Render other institution-specific settings components here */}
    </div>
  )
}
