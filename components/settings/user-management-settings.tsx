"use client"

import { useState, useMemo } from "react"
import type { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlusCircle, Trash2, Search, Download, ChevronDown, Edit3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Data parsed from org chart and screenshots
const initialUsers: User[] = [
  {
    id: "u1",
    email: "timothy.brown@mycentral.bank",
    cellPhone: "",
    firstName: "Timothy",
    middleInitial: "",
    lastName: "Brown",
    type: "Internal",
    title: "CEO & Chairman of the Board",
    department: "Executive",
    officeBranch: "Storm Lake Main Office",
    status: "Active",
  },
  {
    id: "u2",
    email: "john.brown@mycentral.bank",
    cellPhone: "",
    firstName: "John",
    middleInitial: "",
    lastName: "Brown",
    type: "Internal",
    title: "CFO, President, & Secretary",
    department: "Executive",
    officeBranch: "Storm Lake Main Office",
    status: "Active",
  },
  {
    id: "u3",
    email: "jeff.lapke@mycentral.bank",
    cellPhone: "",
    firstName: "Jeff",
    middleInitial: "",
    lastName: "Lapke",
    type: "Internal",
    title: "EVP, Chief Lending Officer & Market President",
    department: "Lending",
    officeBranch: "Storm Lake Main Office",
    status: "Active",
  },
  {
    id: "u4",
    email: "randy.johnson@mycentral.bank",
    cellPhone: "",
    firstName: "Randy",
    middleInitial: "",
    lastName: "Johnson",
    type: "Internal",
    title: "EVP, Cashier & Chief Operating Officer",
    department: "Operations",
    officeBranch: "Storm Lake Main Office",
    status: "Active",
  },
  {
    id: "u5",
    email: "jeff.richter@mycentral.bank",
    cellPhone: "",
    firstName: "Jeff",
    middleInitial: "",
    lastName: "Richter",
    type: "Internal",
    title: "EVP, Chief Mortgage Officer",
    department: "Mortgage",
    officeBranch: "Sioux Falls Mortgage Lending Office",
    status: "Active",
  },
  {
    id: "u6",
    email: "scott.wilson@mycentral.bank",
    cellPhone: "",
    firstName: "Scott",
    middleInitial: "",
    lastName: "Wilson",
    type: "Internal",
    title: "SVP, Senior Commercial Loan Officer",
    department: "Lending",
    officeBranch: "Storm Lake Main Office",
    status: "Active",
  },
  {
    id: "u7",
    email: "william.bray@mycentral.bank",
    cellPhone: "",
    firstName: "William",
    middleInitial: "C",
    lastName: "Bray",
    type: "Internal",
    title: "SVP, Risk & Insurance",
    department: "Risk Management",
    officeBranch: "Storm Lake Insurance Office",
    status: "Active",
  },
  {
    id: "u8",
    email: "judy.ploeger@mycentral.bank",
    cellPhone: "",
    firstName: "Judy",
    middleInitial: "",
    lastName: "Ploeger",
    type: "Internal",
    title: "SVP, Retail Banking & Branch Operations",
    department: "Retail Banking",
    officeBranch: "Storm Lake Main Office",
    status: "Active",
  },
  {
    id: "u9",
    email: "jessie.kies@mycentral.bank",
    cellPhone: "",
    firstName: "Jessie",
    middleInitial: "",
    lastName: "Kies",
    type: "Internal",
    title: "VP, Human Resources",
    department: "Human Resources",
    officeBranch: "Storm Lake Main Office",
    status: "Active",
  },
  {
    id: "u10",
    email: "janelle.holter@mycentral.bank",
    cellPhone: "",
    firstName: "Janelle",
    middleInitial: "",
    lastName: "Holter",
    type: "Internal",
    title: "VP, Marketing",
    department: "Marketing",
    officeBranch: "Storm Lake Main Office",
    status: "Active",
  },
]

const branchLocations = [
  { name: "Storm Lake Main Office" },
  { name: "Storm Lake North Branch" },
  { name: "Storm Lake Insurance Office" },
  { name: "Drive-In Branch" },
  { name: "Cherokee Central Trust Branch" },
  { name: "Spirit Lake Main Office" },
  { name: "Spirit Lake Insurance Office" },
  { name: "Sioux City Branch" },
  { name: "Hamilton Branch" },
  { name: "Morningside Branch" },
  { name: "86th Street Branch" },
  { name: "6th Avenue Branch" },
  { name: "University Branch" },
  { name: "Mills Civic Pkwy" },
  { name: "Waukee Main Office" },
  { name: "Sioux Falls 12th Street Branch" },
  { name: "Sioux Falls Minnesota Branch" },
  { name: "Sioux Falls Mortgage Lending Office" },
]

const userTypes: User["type"][] = ["Internal", "External", "Auditor"]
const userStatuses: User["status"][] = ["Active", "Blocked", "Deactivated", "No Activity"]
const MIN_BLANK_ROWS = 5

export function UserManagementSettings() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [users, searchTerm])

  const usersToDisplay = useMemo(() => {
    const existingUsers = filteredUsers
    const blankRowsToAdd = Math.max(
      0,
      MIN_BLANK_ROWS - existingUsers.filter((u) => !u.email && !u.firstName && !u.lastName).length,
    )

    const blankUsers: User[] = Array(blankRowsToAdd)
      .fill(null)
      .map((_, index) => ({
        id: `blank-${Date.now()}-${index}`,
        email: "",
        cellPhone: "",
        firstName: "",
        middleInitial: "",
        lastName: "",
        type: "",
        title: "",
        department: "",
        officeBranch: "",
        status: "Active",
      }))
    return [...existingUsers, ...blankUsers]
  }, [filteredUsers])

  const handleUserChange = (userId: string, field: keyof User, value: string) => {
    setUsers((currentUsers) => {
      const userExists = currentUsers.some((u) => u.id === userId)
      if (userExists) {
        return currentUsers.map((user) => (user.id === userId ? { ...user, [field]: value } : user))
      } else {
        // This handles changes in blank rows, effectively "activating" them
        const newBlankUser: User = {
          id: userId,
          email: "",
          cellPhone: "",
          firstName: "",
          middleInitial: "",
          lastName: "",
          type: "",
          title: "",
          department: "",
          officeBranch: "",
          status: "Active",
          [field]: value,
        }
        return [...currentUsers, newBlankUser]
      }
    })
  }

  const handleAddUser = () => {
    const newUser: User = {
      id: `u${Date.now()}`,
      email: "",
      cellPhone: "",
      firstName: "",
      middleInitial: "",
      lastName: "",
      type: "",
      title: "",
      department: "",
      officeBranch: "",
      status: "Active",
    }
    setUsers((currentUsers) => [...currentUsers, newUser])
    toast({ title: "New User Row Added", description: "Fill in the details for the new user." })
  }

  const handleRemoveUser = (userId: string) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId))
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(userId)
      return newSet
    })
    toast({ title: "User Removed", variant: "destructive" })
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(userId)
      } else {
        newSet.delete(userId)
      }
      return newSet
    })
  }

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(
        new Set(usersToDisplay.filter((u) => u.email || u.firstName || u.lastName).map((user) => user.id)),
      ) // Only select actual users
    } else {
      setSelectedUserIds(new Set())
    }
  }

  const handleBulkStatusChange = (newStatus: User["status"]) => {
    if (selectedUserIds.size === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to update their status.",
        variant: "destructive",
      })
      return
    }
    setUsers((currentUsers) =>
      currentUsers.map((user) => (selectedUserIds.has(user.id) ? { ...user, status: newStatus } : user)),
    )
    toast({ title: "Bulk Status Update", description: `${selectedUserIds.size} users updated to ${newStatus}.` })
    setSelectedUserIds(new Set()) // Clear selection
  }

  const exportUsersToCSV = () => {
    // Filter out blank rows before exporting
    const usersToExport = users.filter((u) => u.email || u.firstName || u.lastName)
    if (usersToExport.length === 0) {
      toast({ title: "No Data to Export", variant: "destructive" })
      return
    }
    const headers = Object.keys(usersToExport[0]).filter((key) => key !== "id")
    const csvRows = [
      headers.join(","),
      ...usersToExport.map((user) =>
        headers
          .map((header) => {
            const key = header as keyof Omit<User, "id">
            return `"${user[key]}"`
          })
          .join(","),
      ),
    ]
    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.setAttribute("href", URL.createObjectURL(blob))
    link.setAttribute("download", "users.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({ title: "Export Successful" })
  }

  const isAllSelected =
    usersToDisplay.filter((u) => u.email || u.firstName || u.lastName).length > 0 &&
    selectedUserIds.size === usersToDisplay.filter((u) => u.email || u.firstName || u.lastName).length
  const isIndeterminate = selectedUserIds.size > 0 && !isAllSelected

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user accounts, roles, and permissions in an editable, spreadsheet-like view.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            {selectedUserIds.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-background text-foreground">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Update Status ({selectedUserIds.size})
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userStatuses.map((status) => (
                    <DropdownMenuItem key={status} onClick={() => handleBulkStatusChange(status)}>
                      Set to {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button onClick={exportUsersToCSV} variant="outline" className="bg-background text-foreground">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={handleAddUser}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-md">
          <Table className="min-w-[1700px]">
            {/* Increased min-width for checkbox column */}
            <TableHeader className="bg-gray-900 text-gray-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-gray-50 w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => handleSelectAllUsers(Boolean(checked))}
                    aria-label="Select all users"
                    className="border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    data-state={isIndeterminate ? "indeterminate" : isAllSelected ? "checked" : "unchecked"}
                  />
                </TableHead>
                <TableHead className="text-gray-50">Email Address</TableHead>
                <TableHead className="text-gray-50">Cell Phone</TableHead>
                <TableHead className="text-gray-50">First Name</TableHead>
                <TableHead className="text-gray-50 w-[80px]">M.I.</TableHead>
                <TableHead className="text-gray-50">Last Name</TableHead>
                <TableHead className="text-gray-50 w-[150px]">Type</TableHead>
                <TableHead className="text-gray-50">Title</TableHead>
                <TableHead className="text-gray-50">Department</TableHead>
                <TableHead className="text-gray-50 w-[250px]">Office/Branch</TableHead>
                <TableHead className="text-gray-50 w-[150px]">Status</TableHead>
                <TableHead className="text-gray-50 w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersToDisplay.map((user) => {
                const isActualUser = !!(user.email || user.firstName || user.lastName) // Check if it's not a purely blank row
                return (
                  <TableRow
                    key={user.id}
                    className={`hover:bg-secondary/50 ${selectedUserIds.has(user.id) ? "bg-blue-500/10" : ""}`}
                  >
                    <TableCell>
                      {isActualUser && (
                        <Checkbox
                          checked={selectedUserIds.has(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, Boolean(checked))}
                          aria-label={`Select user ${user.firstName} ${user.lastName}`}
                          className="border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={user.email}
                        onChange={(e) => handleUserChange(user.id, "email", e.target.value)}
                        className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent"
                        placeholder="user@example.com"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={user.cellPhone}
                        onChange={(e) => handleUserChange(user.id, "cellPhone", e.target.value)}
                        className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent"
                        placeholder="555-123-4567"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={user.firstName}
                        onChange={(e) => handleUserChange(user.id, "firstName", e.target.value)}
                        className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent"
                        placeholder="First Name"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={user.middleInitial}
                        onChange={(e) => handleUserChange(user.id, "middleInitial", e.target.value)}
                        className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent"
                        placeholder="M"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={user.lastName}
                        onChange={(e) => handleUserChange(user.id, "lastName", e.target.value)}
                        className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent"
                        placeholder="Last Name"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.type}
                        onValueChange={(value: User["type"]) => handleUserChange(user.id, "type", value)}
                      >
                        <SelectTrigger className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {userTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={user.title}
                        onChange={(e) => handleUserChange(user.id, "title", e.target.value)}
                        className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent"
                        placeholder="Job Title"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={user.department}
                        onChange={(e) => handleUserChange(user.id, "department", e.target.value)}
                        className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent"
                        placeholder="Department"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.officeBranch}
                        onValueChange={(value) => handleUserChange(user.id, "officeBranch", value)}
                      >
                        <SelectTrigger className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent">
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branchLocations.map((branch) => (
                            <SelectItem key={branch.name} value={branch.name}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.status}
                        onValueChange={(value: User["status"]) => handleUserChange(user.id, "status", value)}
                      >
                        <SelectTrigger className="h-8 border-transparent hover:border-border focus:border-primary bg-transparent">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {userStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      {isActualUser && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUser(user.id)}
                          title="Remove User"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserManagementSettings
