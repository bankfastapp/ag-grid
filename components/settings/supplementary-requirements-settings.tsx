"use client"
import { useState } from "react"
import type { SupplementaryRequirement } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const initialSuppReqs: SupplementaryRequirement[] = [
  {
    id: "sr1",
    name: "Field Exams",
    isEnabled: true,
    commentary: "Required annually for ABL facilities over $5M, or if risk rating deteriorates to Substandard.",
  },
  {
    id: "sr2",
    name: "Blocked Accounts",
    isEnabled: true,
    commentary: "Required for ABL facilities where dominion over cash is critical. DACA to be executed.",
  },
  {
    id: "sr3",
    name: "Intercreditor Agreements",
    isEnabled: true,
    commentary:
      "Standard bank template to be used for all syndicated deals or participations. Legal review required for non-standard agreements.",
  },
  {
    id: "sr4",
    name: "Seasonality Models",
    isEnabled: false,
    commentary:
      "Consider for businesses with highly seasonal revenue cycles (e.g., agriculture, retail holiday season).",
  },
  {
    id: "sr5",
    name: "Commodity Hedging",
    isEnabled: false,
    commentary:
      "Evaluate for borrowers significantly exposed to commodity price volatility. Require evidence of hedging strategy if applicable.",
  },
]

export function SupplementaryRequirementsSettings() {
  const [requirements, setRequirements] = useState<SupplementaryRequirement[]>(initialSuppReqs)

  const handleChange = (id: string, field: keyof SupplementaryRequirement, value: any) => {
    setRequirements(requirements.map((req) => (req.id === id ? { ...req, [field]: value } : req)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>7. Supplementary Requirements</CardTitle>
        <CardDescription>
          Capture complex or special analysis (field exams, seasonality, hedging, etc.).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirements.map((req) => (
          <div key={req.id} className="p-3 border rounded-md space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`suppReq-${req.id}`}
                checked={req.isEnabled}
                onCheckedChange={(checked) => handleChange(req.id, "isEnabled", !!checked)}
                className="mt-1"
              />
              <label
                htmlFor={`suppReq-${req.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable {req.name}
              </label>
            </div>
            {req.isEnabled && (
              <Textarea
                placeholder={`Commentary for ${req.name}...`}
                value={req.commentary}
                onChange={(e) => handleChange(req.id, "commentary", e.target.value)}
                rows={3}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
