"use client"
import { useState } from "react"
import type { ComplianceChecklistItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialChecklist: ComplianceChecklistItem[] = [
  {
    id: "c1",
    requirement: "Quarterly BSA/AML Staff Training Completion",
    frequency: "Quarterly",
    owner: "Compliance Department",
    status: "✅ Met",
  },
  {
    id: "c2",
    requirement: "Annual Independent AML Audit",
    frequency: "Annually",
    owner: "Internal Audit / Third-Party Auditor",
    status: "❗ Pending",
  },
  {
    id: "c3",
    requirement: "Daily OFAC Sanctions List Screening",
    frequency: "Daily",
    owner: "Operations Team",
    status: "✅ Met",
  },
  {
    id: "c4",
    requirement: "Monthly Fair Lending Self-Assessment",
    frequency: "Monthly",
    owner: "Lending Compliance Officer",
    status: "❌ Overdue",
  },
]

export function ComplianceChecklistsSettings() {
  const [items, setItems] = useState<ComplianceChecklistItem[]>(initialChecklist)
  const { toast } = useToast()

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: `c${Date.now()}`, requirement: "", frequency: "Monthly", owner: "", status: "❗ Pending" },
    ])
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    toast({ title: "Checklist Item Removed" })
  }

  const handleChange = (id: string, field: keyof ComplianceChecklistItem, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>5. Compliance Checklists</CardTitle>
        <CardDescription>Define operational controls and compliance expectations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-3 border rounded-md space-y-2">
            <Input
              placeholder="Requirement"
              value={item.requirement}
              onChange={(e) => handleChange(item.id, "requirement", e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Select
                value={item.frequency}
                onValueChange={(val: ComplianceChecklistItem["frequency"]) => handleChange(item.id, "frequency", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  {["Daily", "Weekly", "Monthly", "Quarterly", "Annually", "Ad-hoc"].map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Owner (e.g., John Doe)"
                value={item.owner}
                onChange={(e) => handleChange(item.id, "owner", e.target.value)}
              />
              <Select
                value={item.status}
                onValueChange={(val: ComplianceChecklistItem["status"]) => handleChange(item.id, "status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="✅ Met">✅ Met</SelectItem>
                  <SelectItem value="❗ Pending">❗ Pending</SelectItem>
                  <SelectItem value="❌ Overdue">❌ Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveItem(item.id)}
              className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Remove
            </Button>
          </div>
        ))}
        <Button onClick={handleAddItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Checklist Item
        </Button>
      </CardContent>
    </Card>
  )
}
