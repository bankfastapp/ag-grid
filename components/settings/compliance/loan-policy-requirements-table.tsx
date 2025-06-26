"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RequirementRowData, RequirementStatus, EntityKey } from "./requirements-table-common"
import { RequirementRowDisplay } from "./requirements-table-common"

const initialLoanPolicyRequirements: RequirementRowData[] = [
  {
    id: "lpr1",
    requirementName: "Risk Rating Assignment",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "lpr2",
    requirementName: "Debt Service Coverage Ratio",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "lpr3",
    requirementName: "Loan-to-Value Compliance",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "lpr4",
    requirementName: "Collateral Coverage",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "lpr5",
    requirementName: "Personal Guarantee Requirements",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "lpr6",
    requirementName: "Financial Statement Currency",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "lpr7",
    requirementName: "In-House Lending Limit",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "lpr8",
    requirementName: "High-Risk Industry Restrictions",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "lpr9",
    requirementName: "Annual Review Requirements",
    isEnabled: false,
    statuses: { entity1: "N/A", entity2: "N/A", principal1: "N/A", principal2: "N/A" },
  }, // Example: Not required
  {
    id: "lpr10",
    requirementName: "Global Cash Flow Analysis",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "lpr11",
    requirementName: "Historical Asset Seizure",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "lpr12",
    requirementName: "Liens/Judgments",
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

export function LoanPolicyRequirementsTable() {
  const [requirements, setRequirements] = useState<RequirementRowData[]>(initialLoanPolicyRequirements)

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
        <CardTitle>Loan Policy Requirements</CardTitle>
        <CardDescription>Define and track status for key loan policy requirements.</CardDescription>
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
