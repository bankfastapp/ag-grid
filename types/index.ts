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
