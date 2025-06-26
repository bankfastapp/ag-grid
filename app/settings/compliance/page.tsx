"use client"

import { ViolationSummaryTable } from "@/components/settings/compliance/violation-summary-table"
import { ComplianceRequirementsTable } from "@/components/settings/compliance/compliance-requirements-table"
import { RegulatoryRequirementsTable } from "@/components/settings/compliance/regulatory-requirements-table"
import { LoanPolicyRequirementsTable } from "@/components/settings/compliance/loan-policy-requirements-table"
import { Separator } from "@/components/ui/separator"

export default function ComplianceSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Compliance Settings</h1>
        <p className="text-muted-foreground">
          Manage compliance violations, and configure requirements for compliance, regulatory, and loan policies.
        </p>
      </div>
      <ViolationSummaryTable />
      <Separator />
      <ComplianceRequirementsTable />
      <Separator />
      <RegulatoryRequirementsTable />
      <Separator />
      <LoanPolicyRequirementsTable />
    </div>
  )
}
