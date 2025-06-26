export interface User {
  id: string
  email: string // This will be the work email, non-editable in personal profile
  cellPhone?: string
  firstName: string
  middleInitial?: string
  lastName: string
  type: "Internal" | "External" | "Auditor" | "" // From previous user table
  title: string // Job Title
  department: string // From previous user table, will be adapted for multi-select in profile
  officeBranch: string // From previous user table
  status: "Active" | "Blocked" | "Deactivated" | "No Activity" | "" // From previous user table

  // New fields for personal profile
  departments?: string[] // For multi-department selection
  workStartTime?: string
  workEndTime?: string
  timeZone?: string
  workDays?: string[]
}

export interface DomainRule {
  id: string
  domain: string
  role: "admin" | "analyst" | "viewer" | "custom"
  autoEnroll: boolean
}

export interface Product {
  id: string
  name: string // Collateral Type
  term: number // months
  amortization: number // months
  baseRate: number // Discount Rate (%)
  collateralRequirement: boolean // True if required
  revolvingLogic: string
  isPartiallyConfigured?: boolean
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
  referenceRatios: string[] // e.g., ["DSCR", "DTI"]
}

export interface ComplianceChecklistItem {
  id: string
  requirement: string
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annually" | "Ad-hoc"
  owner: string // Could be user ID or name
  status: "✅ Met" | "❗ Pending" | "❌ Overdue"
}

export interface DocumentRequirement {
  id: string
  documentName: string
  party: "Borrower" | "Bank"
  loanCondition: string
  collateralCondition: string
  status: "Met" | "Pending" | "Waived" | "Exception"
  isException?: boolean // For the flag
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
  keyFinancialMetrics: { name: string; value: string }[] // e.g., [{name: "ROA", value: "1.5%"}, {name: "Tier 1", value: "10%"}]
  marketDefinitions: string // "in vs. out"
  contextValidated: boolean
}

export interface RecommendedRiskModel {
  id: string
  fitModelName: string
  justification: string
}

// Main settings state
export interface FinancialSettings {
  advanceRates: AdvanceRateSetting[]
  highRiskIndustries: HighRiskIndustry[]
  productSettings: ProductSetting[]
  riskAnalysis: RiskAnalysisSetting
  complianceChecklist: ComplianceChecklistItem[]
  documentRequirements: DocumentRequirement[]
  supplementaryRequirements: SupplementaryRequirement[]
  advancedContextualization: AdvancedContextualization
  recommendedRiskModel: RecommendedRiskModel
}

// Dashboard specific types
export type AnalysisStatus = "completed" | "pending" | "error" | "in_progress"

export interface PortfolioAnalysisItem {
  id: string
  fullName: string
  isFolder: boolean
  docs: number
  date: string // Could be YYYY or MM/DD/YYYY
  banker: string
  risk: number // Assuming 0.0 format
  current: string | number // N/A or currency
  newAmount: string | number // N/A or currency
  industry: string | number // NAICS code or similar
  status: AnalysisStatus
  eval: string // N/A or other
  analyzed: string // N/A or date like MM/DD
  parentId?: string | null
  children?: PortfolioAnalysisItem[]
  // For AI processing simulation
  fileName?: string
  fileSize?: string
}
