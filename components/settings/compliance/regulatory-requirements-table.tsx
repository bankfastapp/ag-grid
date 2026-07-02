"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RequirementRowData, RequirementStatus, EntityKey } from "./requirements-table-common"
import { RequirementRowDisplay } from "./requirements-table-common"

const initialRegulatoryRequirements: RequirementRowData[] = [
  {
    id: "rr1",
    requirementName: "OFAC Sanctions Screening",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "rr2",
    requirementName: "BSA Compliance (Part 21)",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "rr3",
    requirementName: "AML Program Implementation",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "rr4",
    requirementName: "SAR Filing History/Requirements",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "rr5",
    requirementName: "PEP Screening",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "rr6",
    requirementName: "Lending Limit Compliance",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "rr7",
    requirementName: "Combined Borrower Rules",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "rr8",
    requirementName: "Truth in Lending Compliance",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "rr9",
    requirementName: "Flood Insurance Compliance",
    isEnabled: false,
    statuses: { entity1: "N/A", entity2: "N/A", principal1: "N/A", principal2: "N/A" },
  }, // Example: Not required
  {
    id: "rr10",
    requirementName: "State Licensing/Registration",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "N/A", principal2: "N/A" },
  },
  {
    id: "rr11",
    requirementName: "Regulatory Fines/Penalties",
    isEnabled: true,
    statuses: { entity1: "PASS", entity2: "PASS", principal1: "PASS", principal2: "N/A" },
  },
  {
    id: "rr12",
    requirementName: "Enforcement Actions",
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

export function RegulatoryRequirementsTable() {
  const [requirements, setRequirements] = useState<RequirementRowData[]>(initialRegulatoryRequirements)

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
        <CardTitle>Regulatory Requirements</CardTitle>
        <CardDescription>Define and track status for key regulatory requirements.</CardDescription>
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
