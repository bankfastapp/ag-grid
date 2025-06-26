export interface Borrower {
  id: string
  name: string
  company: string
  avatarUrl: string
  avatarFallback: string
  date: string
  amount: string
  stage: Stage
  dateColorClass: string
  loanOfficer: {
    name: string
    avatarUrl: string
    avatarFallback: string
  }
  loanProduct: string
  description: string
}
