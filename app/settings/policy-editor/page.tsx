"use client"

import { useState, useRef } from "react"
import { FinancialSettingsChat } from "@/components/financial-settings-chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AdvanceRatesSettings } from "@/components/settings/advance-rates-settings"
import { HighRiskIndustriesSettings } from "@/components/settings/high-risk-industries-settings"
import { ProductSettings } from "@/components/settings/product-settings"
import { RiskAnalysisSettings } from "@/components/settings/risk-analysis-settings"
import { ComplianceChecklistsSettings } from "@/components/settings/compliance-checklists-settings"
import { DocumentRequirementsSettings } from "@/components/settings/document-requirements-settings"
import { SupplementaryRequirementsSettings } from "@/components/settings/supplementary-requirements-settings"
import { AdvancedContextualizationSettings } from "@/components/settings/advanced-contextualization-settings"
import { RecommendedRiskModelSettings } from "@/components/settings/recommended-risk-model-settings"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, ChevronRight, UserCircle, FileUp, Edit3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface SmartPolicyOption {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface PolicyActivityLogEntry {
  id: string
  name: string
  actor: string
  actorAvatar?: string
  status: "Uploaded" | "Modified" | "Viewed" | "Version Updated"
  date: Date
  documentType:
    | "application/pdf"
    | "application/msword"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "text/plain"
    | "system_change"
  size?: number
  filePath?: string
}

const initialSmartOptions: SmartPolicyOption[] = [
  {
    id: "autoUnderwriting",
    label: "Enable Automated Underwriting (Loans < $50k)",
    description: "Automatically process and decision loan applications below $50,000 based on predefined criteria.",
    enabled: true,
  },
  {
    id: "requireCosignerDTI",
    label: "Require Co-signer for DTI > 45%",
    description: "Mandate a co-signer for applicants whose Debt-to-Income ratio exceeds 45%.",
    enabled: false,
  },
]

// Helper function to create refs for each settings section
const createSectionRefs = () => ({
  smartPolicy: useRef<HTMLDivElement>(null),
  policyDocs: useRef<HTMLDivElement>(null),
  advanceRates: useRef<HTMLDivElement>(null),
  highRiskIndustries: useRef<HTMLDivElement>(null),
  productSettings: useRef<HTMLDivElement>(null),
  riskAnalysis: useRef<HTMLDivElement>(null),
  complianceChecklists: useRef<HTMLDivElement>(null),
  documentRequirements: useRef<HTMLDivElement>(null),
  supplementaryRequirements: useRef<HTMLDivElement>(null),
  advancedContextualization: useRef<HTMLDivElement>(null),
  recommendedRiskModel: useRef<HTMLDivElement>(null),
})

export default function PolicyEditorPage() {
  const [smartOptions, setSmartOptions] = useState<SmartPolicyOption[]>(initialSmartOptions)
  const [policyActivityLog, setPolicyActivityLog] = useState<PolicyActivityLogEntry[]>([
    {
      id: "doc-example-1",
      name: "Existing_Loan_Policy_v3.2.pdf",
      actor: "System",
      status: "Uploaded",
      date: new Date(Date.now() - 86400000 * 5),
      documentType: "application/pdf",
      size: 2097152,
      filePath: "/placeholder.svg?width=200&height=200",
    },
    {
      id: "doc-central-bank-policy",
      name: "Loan Policy - Central Bank.txt",
      actor: "System",
      status: "Uploaded",
      date: new Date(Date.now() - 86400000 * 2),
      documentType: "text/plain",
      size: 102400,
      filePath: "/documents/loan-policy-central-bank.txt",
    },
  ])
  const [viewingPolicyContent, setViewingPolicyContent] = useState<string | null>(null)
  const [viewingPolicyTitle, setViewingPolicyTitle] = useState<string>("")
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false)
  const { toast } = useToast()

  const sectionRefs = createSectionRefs()

  const scrollToSection = (sectionId: keyof typeof sectionRefs) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleSmartOptionToggle = (id: string, checked: boolean) => {
    setSmartOptions((prevOptions) =>
      prevOptions.map((option) => (option.id === id ? { ...option, enabled: checked } : option)),
    )
    const optionLabel = smartOptions.find((opt) => opt.id === id)?.label
    setPolicyActivityLog((prevLog) => [
      {
        id: `log-${Date.now()}`,
        name: `Smart Policy: "${optionLabel}" ${checked ? "Enabled" : "Disabled"}`,
        actor: "Current User",
        status: "Modified",
        date: new Date(),
        documentType: "system_change",
      },
      ...prevLog,
    ])
    toast({
      title: "Policy Option Updated",
      description: `"${optionLabel}" has been ${checked ? "enabled" : "disabled"}.`,
    })
  }

  const handleFilesUploaded = (newFiles: File[]) => {
    const newLogEntries: PolicyActivityLogEntry[] = newFiles.map((file) => ({
      id: `log-${file.name}-${Date.now()}`,
      name: file.name,
      actor: "Current User",
      status: "Uploaded",
      date: new Date(),
      documentType: file.type as PolicyActivityLogEntry["documentType"],
      size: file.size,
      filePath: file.type === "application/pdf" ? URL.createObjectURL(file) : `/documents/${file.name}`,
    }))
    setPolicyActivityLog((prevLog) => [...newLogEntries, ...prevLog])
    toast({
      title: "Policies Uploaded",
      description: `${newFiles.length} new policy document(s) have been processed.`,
    })
  }

  const handleDeletePolicyActivity = (id: string) => {
    const entryToDelete = policyActivityLog.find((p) => p.id === id)
    setPolicyActivityLog((prevLog) => prevLog.filter((entry) => entry.id !== id))
    if (entryToDelete?.filePath?.startsWith("blob:")) {
      URL.revokeObjectURL(entryToDelete.filePath)
    }
    toast({
      title: "Policy Activity Removed",
      description: `Activity "${entryToDelete?.name}" has been removed.`,
      variant: "destructive",
    })
  }

  const handleViewPolicyContent = async (entry: PolicyActivityLogEntry) => {
    if (entry.filePath && entry.documentType === "text/plain") {
      try {
        const response = await fetch(entry.filePath)
        if (!response.ok) throw new Error("Failed to fetch policy content")
        const textContent = await response.text()
        setViewingPolicyContent(textContent)
        setViewingPolicyTitle(entry.name)
        setIsViewModalOpen(true)
      } catch (error) {
        console.error("Error fetching policy content:", error)
        toast({ title: "Error", description: "Could not load policy content.", variant: "destructive" })
      }
    } else if (entry.filePath && entry.filePath.startsWith("blob:")) {
      window.open(entry.filePath, "_blank")
    } else if (entry.filePath) {
      window.open(entry.filePath, "_blank")
    } else {
      toast({
        title: "Cannot View Content",
        description: "No viewable content available for this entry or type not supported for inline view.",
      })
    }
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-gray-200 h-full">
        <FinancialSettingsChat scrollToSection={scrollToSection} />
      </div>
      <div className="w-2/3 h-full overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-8">
            <div ref={sectionRefs.smartPolicy}>
              <h1 className="text-2xl font-bold text-foreground mb-1">Loan Policy Editor</h1>
              <p className="text-muted-foreground">
                Configure smart policy options, upload policy documents, and manage related settings.
              </p>
            </div>

            <Card ref={sectionRefs.smartPolicy}>
              <CardHeader>
                <CardTitle>Smart Policy Options</CardTitle>
                <CardDescription>Quickly enable or disable common loan policy clauses and settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {smartOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-secondary/30"
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor={option.id} className="text-base font-medium">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <Switch
                      id={option.id}
                      checked={option.enabled}
                      onCheckedChange={(checked) => handleSmartOptionToggle(option.id, checked)}
                      className="ml-4"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Separator />

            <Card ref={sectionRefs.policyDocs}>
              <CardHeader>
                <CardTitle>Loan Policy Documents & Activity</CardTitle>
                <CardDescription>Upload official loan policy documents and view activity log.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUploader onFilesUploaded={handleFilesUploaded} acceptedFileTypes=".pdf,.doc,.docx,.txt" />
                {policyActivityLog.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-3">Activity Log</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Name / Description</TableHead>
                          <TableHead>Actor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {policyActivityLog.map((entry) => (
                          <TableRow key={entry.id} className="hover:bg-secondary/30">
                            <TableCell>
                              {entry.documentType === "system_change" ? (
                                <Edit3 className="h-5 w-5 text-muted-foreground" />
                              ) : entry.documentType === "text/plain" ? (
                                <FileText className="h-5 w-5 text-primary" />
                              ) : (
                                <FileUp className="h-5 w-5 text-blue-500" />
                              )}
                            </TableCell>
                            <TableCell>
                              <p className="font-medium truncate" title={entry.name}>
                                {entry.name}
                              </p>
                              {entry.size && (
                                <p className="text-xs text-muted-foreground">{(entry.size / 1024).toFixed(2)} KB</p>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <UserCircle className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">{entry.actor}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  entry.status === "Uploaded"
                                    ? "default"
                                    : entry.status === "Modified"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {entry.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {entry.date.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewPolicyContent(entry)}
                                title="View Details / Content"
                                disabled={!entry.filePath && entry.documentType !== "system_change"}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePolicyActivity(entry.id)}
                                title="Delete Entry"
                                className="ml-1"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>{viewingPolicyTitle}</DialogTitle>
                  <DialogDescription>Content of the selected policy document.</DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-auto border rounded-md p-4 bg-muted/20">
                  <pre className="text-sm whitespace-pre-wrap break-words">{viewingPolicyContent}</pre>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div ref={sectionRefs.advanceRates}>
              <Separator className="my-8" />
              <AdvanceRatesSettings />
            </div>
            <div ref={sectionRefs.highRiskIndustries}>
              <Separator className="my-8" />
              <HighRiskIndustriesSettings />
            </div>
            <div ref={sectionRefs.productSettings}>
              <Separator className="my-8" />
              <ProductSettings />
            </div>
            <div ref={sectionRefs.riskAnalysis}>
              <Separator className="my-8" />
              <RiskAnalysisSettings />
            </div>
            <div ref={sectionRefs.complianceChecklists}>
              <Separator className="my-8" />
              <ComplianceChecklistsSettings />
            </div>
            <div ref={sectionRefs.documentRequirements}>
              <Separator className="my-8" />
              <DocumentRequirementsSettings />
            </div>
            <div ref={sectionRefs.supplementaryRequirements}>
              <Separator className="my-8" />
              <SupplementaryRequirementsSettings />
            </div>
            <div ref={sectionRefs.advancedContextualization}>
              <Separator className="my-8" />
              <AdvancedContextualizationSettings />
            </div>
            <div ref={sectionRefs.recommendedRiskModel}>
              <Separator className="my-8" />
              <RecommendedRiskModelSettings />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
