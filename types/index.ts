// ─────────────────────────────────────────────────────────
// Advanced Contextualization Types
// ─────────────────────────────────────────────────────────
export interface KeyFinancialMetric {
  id: string
  name: string
  ideal: string
  minAcceptable: string
}

export interface AdvancedContextualization {
  id: string
  portfolioConcentrations: string
  keyFinancialMetrics: KeyFinancialMetric[]
  marketDefinitions: string
  contextValidated: boolean
}
