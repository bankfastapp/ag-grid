"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Banknote,
  Users,
  UserCheck,
  UserCog,
  GitBranch,
  BarChartHorizontalBig,
  Lock,
  Mail,
  Phone,
  Clock,
  Laptop,
} from "lucide-react"

// --- Data from Markdown (Institution Tab) ---
const financialSummary2023_2022 = [
  { metric: "Total Assets", value2023: "$3.4 billion (down 10.0%)", value2022: "~$3.78 billion" },
  { metric: "Net Interest Income", value2023: "$155 million (up 37.7%)", value2022: "$113 million" },
  { metric: "Net Interest Margin", value2023: "3.69% (up 82 bps)", value2022: "2.87%" },
  { metric: "Net Interest Spread", value2023: "3.01%", value2022: "2.69%" },
  { metric: "Total Interest Expense", value2023: "$31.3 million (up 256%)", value2022: "~$8.8 million" },
]

const financialSummaryJan2024 = [
  { metric: "Total Assets", value: "$2,167,453,000" },
  { metric: "Total Liabilities", value: "$1,967,556,000" },
  { metric: "Total Equity Capital", value: "$199,897,000" },
  { metric: "Total Deposits", value: "$1,836,731,000" },
  { metric: "Net Loans and Leases", value: "$1,886,599,000" },
  { metric: "Return on Assets", value: "0.44%" },
  { metric: "Return on Equity", value: "4.75%" },
  { metric: "Tier 1 Risk-Based Capital Ratio", value: "9.57%" },
  { metric: "Net Interest Margin", value: "2.86%" },
  { metric: "Efficiency Ratio", value: "82.73%" },
]

const loanPortfolioSept2024 = [
  { type: "Loans secured by real estate", amount: "$1,493,322,000", percentage: "77.7%" },
  { type: "Commercial and industrial loans", amount: "$326,545,000", percentage: "17.0%" },
  { type: "Loans to individuals - Credit Cards", amount: "$2,902,000", percentage: "0.2%" },
  { type: "Loans to individuals - Other", amount: "$17,684,000", percentage: "0.9%" },
  { type: "Other loans (calculated)", amount: "$82,667,000", percentage: "4.3%" },
  { type: "Total Net Loans & Leases", amount: "$1,902,487,000", percentage: "100%" },
]

const branchLocations = [
  { name: "Storm Lake Main Office", address: "600 Lake Avenue", city: "Storm Lake", state: "IA", zip: "50588" },
  { name: "Storm Lake North Branch", address: "811 North Lake Avenue", city: "Storm Lake", state: "IA", zip: "50588" },
  {
    name: "Storm Lake Insurance Office",
    address: "811 North Lake Avenue",
    city: "Storm Lake",
    state: "IA",
    zip: "50588",
  },
  { name: "Drive-In Branch", address: "1237 Lake Avenue", city: "Storm Lake", state: "IA", zip: "50588" },
  { name: "Cherokee Central Trust Branch", address: "201 W Main Street", city: "Cherokee", state: "IA", zip: "51012" },
  { name: "Spirit Lake Main Office", address: "1400 18th Street", city: "Spirit Lake", state: "IA", zip: "51360" },
  { name: "Spirit Lake Insurance Office", address: "1400 18th Street", city: "Spirit Lake", state: "IA", zip: "51360" },
  { name: "Sioux City Branch", address: "504 4th Street", city: "Sioux City", state: "IA", zip: "51101" },
  { name: "Hamilton Branch", address: "2906 Hamilton Blvd", city: "Sioux City", state: "IA", zip: "51104" },
  { name: "Morningside Branch", address: "4201 S Lakeport St", city: "Sioux City", state: "IA", zip: "51106" },
  { name: "86th Street Branch", address: "4848 86th Street", city: "Urbandale", state: "IA", zip: "50322" },
  { name: "6th Avenue Branch", address: "3624 6th Ave", city: "Des Moines", state: "IA", zip: "50313" },
  { name: "University Branch", address: "4018 University Ave", city: "Des Moines", state: "IA", zip: "50311" },
  { name: "Mills Civic Branch", address: "5070 Mills Civic Pkwy", city: "West Des Moines", state: "IA", zip: "50265" },
  { name: "Waukee Main Office", address: "300 Hickman Road", city: "Waukee", state: "IA", zip: "50263" },
  {
    name: "Sioux Falls 12th Street Branch",
    address: "2104 West 12th Street",
    city: "Sioux Falls",
    state: "SD",
    zip: "57104",
  },
  {
    name: "Sioux Falls Minnesota Branch",
    address: "2500 South Minnesota Avenue",
    city: "Sioux Falls",
    state: "SD",
    zip: "57105",
  },
  {
    name: "Sioux Falls Mortgage Lending Office",
    address: "6300 South Connie Avenue",
    city: "Sioux Falls",
    state: "SD",
    zip: "57108",
  },
]
const regulatorInfo = {
  primaryRegulator: "Office of the Comptroller of the Currency (OCC)",
  fdicCertNumber: "12345",
  lastExaminationDate: "2024-03-15",
  nextExaminationDate: "2025-03-15 (Anticipated)",
}
const securityPrivacySettings = [
  { id: "mfa", label: "Require Multi-Factor Authentication for all staff", enabled: true, type: "toggle" as const },
  {
    id: "dataEncryption",
    label: "Enable End-to-End Encryption for internal communications",
    enabled: true,
    type: "toggle" as const,
  },
  { id: "vpnAccess", label: "Restrict database access to VPN only", enabled: true, type: "toggle" as const },
  {
    id: "sessionTimeout",
    label: "Automatic session timeout (minutes)",
    value: 30,
    type: "slider" as const,
    min: 5,
    max: 60,
  },
  { id: "auditLogs", label: "Retain audit logs for (days)", value: 365, type: "slider" as const, min: 90, max: 730 },
  { id: "phiAccess", label: "Strict Access Controls for PHI/PII", enabled: true, type: "checkbox" as const },
]
const privilegeData = [
  {
    role: "Employee (Teller)",
    privileges: ["View customer balances", "Process transactions", "Access internal KB"],
    id: "p1",
  },
  {
    role: "Employee (Loan Officer)",
    privileges: ["View customer profiles", "Originate loans", "Access credit reports"],
    id: "p2",
  },
  {
    role: "Executive",
    privileges: ["Full system access", "Approve large transactions", "Modify system settings"],
    id: "p3",
  },
  {
    role: "External Appraiser",
    privileges: ["View property details for assigned deals", "Upload appraisal reports"],
    id: "p4",
  },
  { role: "External Title Company", privileges: ["View relevant closing documents", "Upload title reports"], id: "p5" },
  { role: "Auditor", privileges: ["Read-only access to financial records", "View audit logs"], id: "p6" },
]
const clientPortfolioData = [
  {
    clientName: "Acme Corp",
    type: "Customer",
    primaryContact: "John Doe",
    cpa: "Smith & Co CPAs",
    attorney: "Davis Legal Group",
    id: "c1",
  },
  {
    clientName: "Beta Solutions",
    type: "Prospect",
    primaryContact: "Jane Smith",
    cpa: "N/A",
    attorney: "N/A",
    id: "c2",
  },
  {
    clientName: "Gamma Industries",
    type: "Customer",
    primaryContact: "Robert Brown",
    cpa: "Jones Accounting",
    attorney: "Miller Law Firm",
    id: "c3",
  },
]
const examinerData = [
  {
    agency: "OCC",
    examinerName: "Sarah Williams",
    contactEmail: "swilliams@occ.gov",
    lastVisit: "2024-03-10",
    id: "e1",
  },
  { agency: "FDIC", examinerName: "Michael Chen", contactEmail: "mchen@fdic.gov", lastVisit: "2023-09-20", id: "e2" },
]
// --- End Data from Markdown (Institution Tab) ---

// --- Mock Data for Personal Tab ---
const allDepartments = [
  "Executive",
  "Lending",
  "Mortgage",
  "Operations",
  "Risk Management",
  "Retail Banking",
  "Human Resources",
  "Marketing",
  "IT",
  "Compliance",
  "Finance",
]
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  // 30-min intervals
  const hours = Math.floor(i / 2)
  const minutes = (i % 2) * 30
  const period = hours < 12 || hours === 24 ? "AM" : "PM"
  const displayHours = hours === 0 || hours === 12 ? 12 : hours % 12
  return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`
})
const timeZones = [
  "(GMT-10:00) Hawaii Time",
  "(GMT-09:00) Alaska Time",
  "(GMT-08:00) Pacific Time",
  "(GMT-07:00) Mountain Time",
  "(GMT-06:00) Central Time (CT)",
  "(GMT-05:00) Eastern Time",
  "(GMT-04:00) Atlantic Time",
]
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const mockLoginHistory = Array.from({ length: 10 }, (_, i) => {
  const loginTime = new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000 - Math.random() * 1000 * 60 * 60 * 5) // Random time in last 10 days
  const durationMinutes = Math.floor(Math.random() * 120) + 15 // 15 to 135 minutes
  const logoutTime = new Date(loginTime.getTime() + durationMinutes * 60 * 1000)
  return {
    id: `lh${i}`,
    date: loginTime.toLocaleDateString(),
    loginTime: loginTime.toLocaleTimeString(),
    logoutTime: logoutTime.toLocaleTimeString(),
    duration: `${durationMinutes} min`,
    device: Math.random() > 0.5 ? "Desktop" : "Mobile App",
    ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    location: "Des Moines, IA, USA",
  }
})

const mockActiveSessions = [
  {
    id: "as1",
    deviceId: "Desktop-ABC123",
    deviceType: "Windows 11 Chrome",
    city: "Storm Lake",
    state: "IA",
    country: "USA",
    loginTime: "2025-06-25 09:15 AM",
  },
  {
    id: "as2",
    deviceId: "iPhone-XYZ789",
    deviceType: "iOS Mobile App",
    city: "Des Moines",
    state: "IA",
    country: "USA",
    loginTime: "2025-06-25 11:30 AM",
  },
]
// --- End Mock Data for Personal Tab ---

// --- Sub-Components for Institution Tab (unchanged from previous) ---
function InstitutionDetailsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4">
        <Image
          src="/images/institution-logo.png"
          alt="Institution Logo"
          width={80}
          height={80}
          className="rounded-md border bg-gray-800 p-1"
        />
        <div>
          <CardTitle className="text-2xl">Central Bank</CardTitle>
          <CardDescription>
            FDIC Cert #: {regulatorInfo.fdicCertNumber} | Primary Regulator: {regulatorInfo.primaryRegulator}
          </CardDescription>
          <p className="text-sm text-muted-foreground mt-1">Last Examination: {regulatorInfo.lastExaminationDate}</p>
        </div>
      </CardHeader>
    </Card>
  )
}
function FinancialsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Banknote className="mr-2 h-5 w-5 text-primary" />
          Financial Summary
        </CardTitle>
        <CardDescription>Key financial metrics for the institution.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-md font-semibold mb-2">January 2024 Snapshot</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialSummaryJan2024.map((item) => (
                <TableRow key={item.metric}>
                  <TableCell>{item.metric}</TableCell>
                  <TableCell>{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-2">2023 vs 2022 Comparison</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>2023</TableHead>
                <TableHead>2022</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialSummary2023_2022.map((item) => (
                <TableRow key={item.metric}>
                  <TableCell>{item.metric}</TableCell>
                  <TableCell>{item.value2023}</TableCell>
                  <TableCell>{item.value2022}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
function BranchLocationsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GitBranch className="mr-2 h-5 w-5 text-primary" />
          Branch Locations
        </CardTitle>
        <CardDescription>List of physical branch locations. Total: {branchLocations.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Zip</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branchLocations.map((branch) => (
                <TableRow key={branch.name + branch.address}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.city}</TableCell>
                  <TableCell>{branch.state}</TableCell>
                  <TableCell>{branch.zip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
function LoanPortfolioSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChartHorizontalBig className="mr-2 h-5 w-5 text-primary" />
          Loan Portfolio Concentrations
        </CardTitle>
        <CardDescription>Breakdown of loan portfolio by type (as of September 30, 2024).</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loanPortfolioSept2024.map((item) => (
              <TableRow key={item.type} className={item.type.includes("Total") ? "font-semibold" : ""}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.percentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
function SecurityPrivacySection() {
  const [settings, setSettings] = useState(securityPrivacySettings)
  const handleToggle = (id: string, checked: boolean) => {
    setSettings((prev) => prev.map((s) => (s.id === id && s.type !== "slider" ? { ...s, enabled: checked } : s)))
  }
  const handleSliderChange = (id: string, value: number) => {
    setSettings((prev) => prev.map((s) => (s.id === id && s.type === "slider" ? { ...s, value: value } : s)))
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2 h-5 w-5 text-primary" />
          Security & Privacy Settings
        </CardTitle>
        <CardDescription>Configure institution-wide security and data privacy parameters.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor={setting.id} className="font-medium">
                {setting.label}
              </Label>
            </div>
            {setting.type === "toggle" && (
              <Switch
                id={setting.id}
                checked={setting.enabled}
                onCheckedChange={(checked) => handleToggle(setting.id, checked)}
              />
            )}
            {setting.type === "checkbox" && (
              <Checkbox
                id={setting.id}
                checked={setting.enabled}
                onCheckedChange={(checked) => handleToggle(setting.id, !!checked)}
              />
            )}
            {setting.type === "slider" && (
              <div className="flex items-center gap-2 w-1/2">
                <Input
                  type="range"
                  id={setting.id}
                  min={setting.min}
                  max={setting.max}
                  value={setting.value}
                  onChange={(e) => handleSliderChange(setting.id, Number.parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm w-12 text-right">{setting.value}</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
function PrivilegesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCog className="mr-2 h-5 w-5 text-primary" />
          Role Privileges
        </CardTitle>
        <CardDescription>Manage access privileges for different user roles.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Key Privileges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {privilegeData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.role}</TableCell>
                <TableCell>{item.privileges.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
function ClientPortfolioSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          Client Portfolio & Professionals
        </CardTitle>
        <CardDescription>Overview of key customers, prospects, and their associated professionals.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>CPA</TableHead>
              <TableHead>Attorney</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientPortfolioData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.clientName}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.primaryContact}</TableCell>
                <TableCell>{item.cpa}</TableCell>
                <TableCell>{item.attorney}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
function ExaminersSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="mr-2 h-5 w-5 text-primary" />
          Examiner Contacts
        </CardTitle>
        <CardDescription>Information for regulatory examiners.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agency</TableHead>
              <TableHead>Examiner Name</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Last Visit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {examinerData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.agency}</TableCell>
                <TableCell>{item.examinerName}</TableCell>
                <TableCell>{item.contactEmail}</TableCell>
                <TableCell>{item.lastVisit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
// --- End Sub-Components for Institution Tab ---

// --- Sub-Components for Personal Tab ---
function PersonalInformationCard({
  personalInfo,
  onPersonalInfoChange,
  onSave,
}: {
  personalInfo: any
  onPersonalInfoChange: (field: string, value: any) => void
  onSave: (e: React.FormEvent) => void
}) {
  const handleDepartmentChange = (department: string, checked: boolean) => {
    const currentDepartments = personalInfo.departments || []
    if (checked) {
      onPersonalInfoChange("departments", [...currentDepartments, department])
    } else {
      onPersonalInfoChange(
        "departments",
        currentDepartments.filter((d: string) => d !== department),
      )
    }
  }

  const handleWorkDayChange = (day: string, checked: boolean) => {
    const currentWorkDays = personalInfo.workDays || []
    if (checked) {
      onPersonalInfoChange("workDays", [...currentWorkDays, day])
    } else {
      onPersonalInfoChange(
        "workDays",
        currentWorkDays.filter((d: string) => d !== day),
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Manage your contact details, work schedule, and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSave} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?width=80&height=80" alt={personalInfo.firstName} />
              <AvatarFallback>{personalInfo.firstName?.charAt(0).toUpperCase()} </AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground text-sm">Profile picture managed by HR system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => onPersonalInfoChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleInitial">Middle Initial</Label>
              <Input
                id="middleInitial"
                value={personalInfo.middleInitial}
                onChange={(e) => onPersonalInfoChange("middleInitial", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => onPersonalInfoChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={personalInfo.jobTitle}
              onChange={(e) => onPersonalInfoChange("jobTitle", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workEmail">Work Email</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <Input
                id="workEmail"
                type="email"
                value={personalInfo.workEmail}
                readOnly
                className="bg-muted/50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cellPhone">Cell Phone</Label>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <Input
                id="cellPhone"
                type="tel"
                value={personalInfo.cellPhone}
                onChange={(e) => onPersonalInfoChange("cellPhone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Department(s)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3 border rounded-md">
              {allDepartments.map((dept) => (
                <div key={dept} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${dept}`}
                    checked={personalInfo.departments?.includes(dept)}
                    onCheckedChange={(checked) => handleDepartmentChange(dept, !!checked)}
                  />
                  <Label htmlFor={`dept-${dept}`} className="font-normal text-sm">
                    {dept}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch (Location)</Label>
            <Select value={personalInfo.branch} onValueChange={(value) => onPersonalInfoChange("branch", value)}>
              <SelectTrigger id="branch">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branchLocations.map((branch) => (
                  <SelectItem key={branch.name + branch.address} value={branch.name}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workStartTime">Work Start Time</Label>
              <Select
                value={personalInfo.workStartTime}
                onValueChange={(value) => onPersonalInfoChange("workStartTime", value)}
              >
                <SelectTrigger id="workStartTime">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`start-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workEndTime">Work End Time</Label>
              <Select
                value={personalInfo.workEndTime}
                onValueChange={(value) => onPersonalInfoChange("workEndTime", value)}
              >
                <SelectTrigger id="workEndTime">
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`end-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
function LoginHistorySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          Login History
        </CardTitle>
        <CardDescription>Recent login activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Login Time</TableHead>
              <TableHead>Logout Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLoginHistory.map((login) => (
              <TableRow key={login.id}>
                <TableCell>{login.date}</TableCell>
                <TableCell>{login.loginTime}</TableCell>
                <TableCell>{login.logoutTime}</TableCell>
                <TableCell>{login.duration}</TableCell>
                <TableCell>{login.device}</TableCell>
                <TableCell>{login.ipAddress}</TableCell>
                <TableCell>{login.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
function ActiveSessionsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Laptop className="mr-2 h-5 w-5 text-primary" />
          Active Sessions
        </CardTitle>
        <CardDescription>Currently active sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>Device Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Login Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActiveSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.deviceId}</TableCell>
                <TableCell>{session.deviceType}</TableCell>
                <TableCell>{session.city}</TableCell>
                <TableCell>{session.state}</TableCell>
                <TableCell>{session.country}</TableCell>
                <TableCell>{session.loginTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
// --- End Sub-Components for Personal Tab ---

// --- Main Component ---
export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="institution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="institution">Institution</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>
        <TabsContent value="institution">
          <InstitutionDetailsCard />
          <Separator />
          <FinancialsSection />
          <Separator />
          <BranchLocationsSection />
          <Separator />
          <LoanPortfolioSection />
          <Separator />
          <SecurityPrivacySection />
          <Separator />
          <PrivilegesSection />
          <Separator />
          <ClientPortfolioSection />
          <Separator />
          <ExaminersSection />
        </TabsContent>
        <TabsContent value="personal">
          <PersonalInformationCard personalInfo={{}} onPersonalInfoChange={() => {}} onSave={() => {}} />
          <Separator />
          <LoginHistorySection />
          <Separator />
          <ActiveSessionsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
