export type AnalysisStatus = "completed" | "pending" | "in_progress" | "error"

export interface PortfolioAnalysisItem {
  id: string
  fullName: string
  isFolder: boolean
  docs: number
  date: string
  banker: string
  risk: number
  current: string
  newAmount: string
  industry: number | string
  status: AnalysisStatus
  eval: string
  analyzed: string
  children?: PortfolioAnalysisItem[]
  parentId?: string | null
}

export interface User {
  id: string
  name: string
  role: string
  email: string
  avatar: string
  status: "Active" | "Inactive"
  lastLogin: string
}

export interface Requirement {
  id: string
  description: string
  status: "Compliant" | "Non-Compliant" | "In Progress" | "N/A"
  enabled: boolean
}

export interface Violation {
  id: string
  date: string
  description: string
  severity: "Low" | "Medium" | "High"
  status: "Open" | "Resolved"
}

export interface Borrower {
  id: string
  name: string
  company: string
  avatarUrl: string
  avatarFallback: string
  date: string
  amount: string
  stage: "New" | "Qualified" | "Meeting" | "Underwriting" | "Approved"
  dateColorClass: string
  loanOfficer: {
    name: string
    avatarUrl: string
    avatarFallback: string
  }
  loanProduct: string
  description: string
}

export type DocumentStatus = "New" | "Due in 30 days" | "Due this week" | "Past Due" | "Delinquent" | "Received"

export interface DocumentRequirement {
  id: string
  name: string
  borrower: string
  status: DocumentStatus
}

export interface DocumentCategory {
  name: string
  documents: {
    name: string
    requirements: DocumentRequirement[]
  }[]
}

export type PipelineTaskStatus = "Pending" | "In Progress" | "Completed" | "Needs Review" | "Past Due"

export interface PipelineTask {
  id: string
  name: string
  borrower: string
  dueDate: string
  loanType: "Revolving" | "Term" | "Hybrid"
  tags: { text: string; color: string; bgColor: string }[]
  status: PipelineTaskStatus
}

export interface PipelineSection {
  title: string
  tasks: PipelineTask[]
}

// Define types for each settings section based on your instructions
export interface AdvanceRateSetting {
  id: string
  collateralType: string
  advanceRate: number
  methodDescribed: boolean
  sourceDescription: string
  comments: string
  isInconclusive?: boolean // For the flag
}

export interface HighRiskIndustry {
  id: string
  naicsSicLabel: string
}

export interface ProductSetting {
  id: string
  loanType: string
  term: string // e.g., "30 years", "5 years"
  amortization: string // e.g., "25 years"
  baseRate: string // e.g., "SOFR + 2%"
  collateralRequirement: string // e.g., "Real Estate"
  isPartiallyComplete?: boolean // For the flag
}

export interface RiskAnalysisMetric {
  id: string
  borrowerType: "Business" | "Individual"
  metricName: string
  weighting: number // Percentage
}

export interface RiskAnalysisSetting {
  id: string
  metrics: RiskAnalysisMetric[]
  source: "Provided" | "Default"
  auditComments: string
}

export interface ComplianceChecklistItem {
  id: string
  requirement: string
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annually" | "Ad-hoc"
  owner: string // Could be user ID or name
  status: "✅ Met" | "❗ Pending" | "❌ Overdue"
}

export interface SupplementaryRequirement {
  id: string
  name: "Field Exams" | "Blocked Accounts" | "Intercreditor Agreements" | "Seasonality Models" | "Commodity Hedging"
  isEnabled: boolean
  commentary: string
}

export interface AdvancedContextualization {
  id: string
  portfolioConcentrations: string
  keyFinancialMetrics: { name: string; ideal: string; minAcceptable: string }[]
  marketDefinitions: string // "in vs. out"
  contextValidated: boolean
}

export interface RecommendedRiskModel {
  id: string
  fitModelName: string
  justification: string
}
