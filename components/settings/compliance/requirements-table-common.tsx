"use client"
// This file will contain common types and helper functions for the requirements tables.
import { TableCell } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

// For now, it's mostly types, but could be expanded.

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export type RequirementStatus = "PASS" | "FAIL" | "PENDING" | "N/A"
export const requirementStatuses: RequirementStatus[] = ["PASS", "FAIL", "PENDING", "N/A"]

export const entityKeys = ["entity1", "entity2", "principal1", "principal2"] as const
export type EntityKey = (typeof entityKeys)[number]

export interface EntityRequirementStatus {
  entity1: RequirementStatus
  entity2: RequirementStatus
  principal1: RequirementStatus
  principal2: RequirementStatus
}

export interface RequirementRowData {
  id: string
  requirementName: string
  isEnabled: boolean
  statuses: EntityRequirementStatus
}

interface StatusCellProps {
  status: RequirementStatus
  onChange: (newStatus: RequirementStatus) => void
  disabled?: boolean
}

export const StatusCell: React.FC<StatusCellProps> = ({ status, onChange, disabled }) => {
  return (
    <Select value={status} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="h-8 w-[100px] text-xs data-[state=disabled]:opacity-70 data-[state=disabled]:cursor-not-allowed">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {requirementStatuses.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface RequirementRowDisplayProps {
  item: RequirementRowData
  handleStatusChange: (itemId: string, entityKey: EntityKey, newStatus: RequirementStatus) => void
  handleEnabledChange: (itemId: string, isEnabled: boolean) => void
  entityNames: Record<EntityKey, string>
}

export const RequirementRowDisplay: React.FC<RequirementRowDisplayProps> = ({
  item,
  handleStatusChange,
  handleEnabledChange,
  entityNames,
}) => {
  const calculateSummary = (rowData: RequirementRowData): string => {
    if (!rowData.isEnabled) {
      return "Disabled"
    }
    let passCount = 0
    let failCount = 0
    let pendingCount = 0
    let naCount = 0

    entityKeys.forEach((key) => {
      if (rowData.statuses[key] === "PASS") passCount++
      else if (rowData.statuses[key] === "FAIL") failCount++
      else if (rowData.statuses[key] === "PENDING") pendingCount++
      else if (rowData.statuses[key] === "N/A") naCount++
    })

    const parts: string[] = []
    if (passCount > 0) parts.push(`${passCount} Pass`)
    if (failCount > 0) parts.push(`${failCount} Fail`)
    if (pendingCount > 0) parts.push(`${pendingCount} Pending`)
    if (naCount > 0 && passCount + failCount + pendingCount === 0)
      parts.push(`${naCount} N/A`) // Show N/A if it's the only status type
    else if (naCount === entityKeys.length) return "All N/A"

    return parts.length > 0 ? parts.join(", ") : "No Statuses"
  }

  return (
    <TableRow key={item.id} className={!item.isEnabled ? "opacity-60" : ""}>
      <TableCell className="min-w-[300px]">
        <div className="flex items-center">
          <Checkbox
            checked={item.isEnabled}
            onCheckedChange={(checked) => handleEnabledChange(item.id, !!checked)}
            className="mr-3"
            aria-label={`Enable ${item.requirementName}`}
          />
          {item.requirementName}
        </div>
      </TableCell>
      {entityKeys.map((key) => (
        <TableCell key={key}>
          <StatusCell
            status={item.statuses[key]}
            onChange={(newStatus) => handleStatusChange(item.id, key, newStatus)}
            disabled={!item.isEnabled}
          />
        </TableCell>
      ))}
      <TableCell className="text-xs text-muted-foreground min-w-[200px]">{calculateSummary(item)}</TableCell>
    </TableRow>
  )
}
