"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RequirementRowData, RequirementStatus, EntityKey } from "./requirements-table-common"
import { RequirementRowDisplay } from "./requirements-table-common"

const initialComplianceRequirements: RequirementRowData[] = [
  {
    id: "cr1",
    requirementName: "KYC Documentation Completeness",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr2",
    requirementName: "KYB Verification Status",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "cr3",
    requirementName: "Beneficial Ownership Identification",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr4",
    requirementName: "Customer Due Diligence (CDD)",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr5",
    requirementName: "Enhanced Due Diligence (EDD)",
    isEnabled: true,
    statuses: { entity1: "PENDING", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "cr6",
    requirementName: "Asset Classification Compliance",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "cr7",
    requirementName: "Documentation Completeness",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr8",
    requirementName: "Identity Verification",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr9",
    requirementName: "Source of Funds Documentation",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr10",
    requirementName: "Authorized Signers Verification",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "cr11",
    requirementName: "AML (Sanctions/Watchlist)",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr12",
    requirementName: "SARs (Suspicious Activity)",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr13",
    requirementName: "BSA (Bank Secrecy Act)",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr14",
    requirementName: "PEP (Politically Exposed Person)",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr15",
    requirementName: "Bad Actors Database",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr16",
    requirementName: "Sex Offender Registry",
    isEnabled: false,
    statuses: { entity1: "N/A", entity2: "N/A", principal1: "N/A", principal2: "N/A" },
  }, // Example of a de-selected/not required
  {
    id: "cr17",
    requirementName: "Criminal History",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr18",
    requirementName: "Court Hearings/Bankruptcy",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr19",
    requirementName: "Fines/Penalties",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "cr20",
    requirementName: "Adverse Media",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
]

const entityNames: Record<EntityKey, string> = {
  entity1: "Entity1",
  entity2: "Entity2",
  principal1: "Principal1",
  principal2: "Principal2",
}

export function ComplianceRequirementsTable() {
  const [requirements, setRequirements] = useState<RequirementRowData[]>(initialComplianceRequirements)

  const handleStatusChange = (itemId: string, entityKey: EntityKey, newStatus: RequirementStatus) => {
    setRequirements((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, statuses: { ...item.statuses, [entityKey]: newStatus } } : item,
      ),
    )
  }

  const handleEnabledChange = (itemId: string, isEnabled: boolean) => {
    setRequirements((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isEnabled,
              statuses: isEnabled
                ? item.statuses
                : { entity1: "N/A", entity2: "N/A", principal1: "N/A", principal2: "N/A" },
            }
          : item,
      ),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Requirements</CardTitle>
        <CardDescription>
          Define and track status for key compliance requirements across entities and principals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[300px]">Requirement</TableHead>
                {Object.values(entityNames).map((name) => (
                  <TableHead key={name} className="w-[120px]">
                    {name}
                  </TableHead>
                ))}
                <TableHead className="min-w-[200px]">Summary Results</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements.map((item) => (
                <RequirementRowDisplay
                  key={item.id}
                  item={item}
                  handleStatusChange={handleStatusChange}
                  handleEnabledChange={handleEnabledChange}
                  entityNames={entityNames}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
