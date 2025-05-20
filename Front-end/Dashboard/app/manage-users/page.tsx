"use client"

import { useState, useCallback } from "react"
import { Check, ChevronDown, Download, Filter, MoreHorizontal, Search, UserPlus, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "../dashboard-layout"

// Sample user data
const initialUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    university: "Stanford University",
    role: "Student",
    status: "active",
    skills: ["Programming", "Design"],
    joinDate: "2023-09-15",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Maya Patel",
    email: "maya.patel@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    university: "MIT",
    role: "Student",
    status: "active",
    skills: ["Music", "Writing"],
    joinDate: "2023-10-02",
    lastActive: "5 minutes ago",
  },
  {
    id: 3,
    name: "Jordan Lee",
    email: "jordan.lee@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    university: "Harvard University",
    role: "Student",
    status: "inactive",
    skills: ["Photography", "Design"],
    joinDate: "2023-08-20",
    lastActive: "2 days ago",
  },
  {
    id: 4,
    name: "Taylor Smith",
    email: "taylor.smith@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    university: "UCLA",
    role: "Student",
    status: "active",
    skills: ["Programming", "Writing"],
    joinDate: "2023-11-05",
    lastActive: "1 hour ago",
  },
  {
    id: 5,
    name: "Sam Rodriguez",
    email: "sam.rodriguez@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    university: "UC Berkeley",
    role: "Student",
    status: "banned",
    skills: ["Music", "Photography"],
    joinDate: "2023-07-12",
    lastActive: "30 days ago",
  },
  {
    id: 6,
    name: "Jamie Wilson",
    email: "jamie.wilson@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    university: "NYU",
    role: "Student",
    status: "active",
    skills: ["Design", "Writing"],
    joinDate: "2023-10-18",
    lastActive: "3 hours ago",
  },
  {
    id: 7,
    name: "Casey Brown",
    email: "casey.brown@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    university: "Columbia University",
    role: "Student",
    status: "active",
    skills: ["Programming", "Music"],
    joinDate: "2023-09-30",
    lastActive: "45 minutes ago",
  },
]

export default function ManageUsers() {
  const [users, setUsers] = useState(initialUsers)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserSheetOpen, setIsAddUserSheetOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    university: "",
    role: "student",
    skills: [] as string[],
  })
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>({
    Programming: false,
    Design: false,
    Music: false,
    Writing: false,
    Photography: false,
  })
  const [viewingUser, setViewingUser] = useState<(typeof users)[0] | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    // Filter by tab
    if (selectedTab === "active" && user.status !== "active") return false
    if (selectedTab === "inactive" && user.status !== "inactive") return false
    if (selectedTab === "banned" && user.status !== "banned") return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.university.toLowerCase().includes(query) ||
        user.skills.some((skill) => skill.toLowerCase().includes(query))
      )
    }

    return true
  })

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const handleAddUser = useCallback(() => {
    toast({
      title: "User Added",
      description: "New user has been added successfully",
    })
  }, [])

  const handleExport = useCallback((format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting users as ${format}`,
    })
  }, [])

  const handleFilterChange = useCallback((filter: string) => {
    toast({
      title: "Filter Applied",
      description: `Filtering users by ${filter}`,
    })
  }, [])

  const handleUserAction = useCallback((action: string, userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    toast({
      title: `${action} User`,
      description: `${action} action performed on ${user.name}`,
    })
  }, [])

  const handleBulkAction = useCallback(
    (action: string) => {
      toast({
        title: "Bulk Action",
        description: `${action} performed on ${selectedUsers.length} users`,
      })
    },
    [selectedUsers],
  )

  const handleAddUserOld = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.university) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Create new user
    const selectedSkillsArray = Object.entries(selectedSkills)
      .filter(([_, isSelected]) => isSelected)
      .map(([skill]) => skill)

    const newUserData = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      avatar: "/placeholder.svg?height=40&width=40",
      university: newUser.university,
      role: newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1),
      status: "active",
      skills: selectedSkillsArray,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
    }

    setUsers([...users, newUserData])

    // Reset form
    setNewUser({
      name: "",
      email: "",
      university: "",
      role: "student",
      skills: [],
    })
    setSelectedSkills({
      Programming: false,
      Design: false,
      Music: false,
      Writing: false,
      Photography: false,
    })
    setIsAddUserSheetOpen(false)

    toast({
      title: "User added",
      description: `${newUserData.name} has been added successfully.`,
    })
  }

  const handleViewUser = (user: (typeof users)[0]) => {
    setViewingUser(user)
    setIsUserDialogOpen(true)
  }

  const handleBanUserOld = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "banned" ? "active" : "banned" } : user,
      ),
    )

    const user = users.find((u) => u.id === userId)
    if (user) {
      toast({
        title: user.status === "banned" ? "User unbanned" : "User banned",
        description: `${user.name} has been ${user.status === "banned" ? "unbanned" : "banned"}.`,
      })
    }

    setIsUserDialogOpen(false)
  }

  const handleDeleteUserOld = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))

    const user = users.find((u) => u.id === userId)
    if (user) {
      toast({
        title: "User deleted",
        description: `${user.name}'s account has been deleted.`,
      })
    }

    setIsUserDialogOpen(false)
  }

  const handleBulkActionOld = (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to perform this action.",
        variant: "destructive",
      })
      return
    }

    switch (action) {
      case "activate":
        setUsers(users.map((user) => (selectedUsers.includes(user.id) ? { ...user, status: "active" } : user)))
        toast({
          title: "Users activated",
          description: `${selectedUsers.length} users have been activated.`,
        })
        break
      case "deactivate":
        setUsers(users.map((user) => (selectedUsers.includes(user.id) ? { ...user, status: "inactive" } : user)))
        toast({
          title: "Users deactivated",
          description: `${selectedUsers.length} users have been deactivated.`,
        })
        break
      case "ban":
        setUsers(users.map((user) => (selectedUsers.includes(user.id) ? { ...user, status: "banned" } : user)))
        toast({
          title: "Users banned",
          description: `${selectedUsers.length} users have been banned.`,
        })
        break
      case "delete":
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)))
        toast({
          title: "Users deleted",
          description: `${selectedUsers.length} users have been deleted.`,
        })
        break
    }

    setSelectedUsers([])
  }

  const handleExportOld = (format: string) => {
    toast({
      title: `Export as ${format.toUpperCase()}`,
      description: `User data has been exported in ${format.toUpperCase()} format.`,
    })
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
              <p className="text-muted-foreground">View and manage all users on the Linkora platform</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Sheet open={isAddUserSheetOpen} onOpenChange={setIsAddUserSheetOpen}>
                <SheetTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add New User</SheetTitle>
                    <SheetDescription>Add a new user to the Linkora platform.</SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="university" className="text-sm font-medium">
                        University
                      </label>
                      <Input
                        id="university"
                        placeholder="Enter university name"
                        value={newUser.university}
                        onChange={(e) => setNewUser({ ...newUser, university: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="role" className="text-sm font-medium">
                        Role
                      </label>
                      <Select
                        defaultValue="student"
                        value={newUser.role}
                        onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(selectedSkills).map((skill) => (
                          <div key={skill} className="flex items-center gap-1.5">
                            <Checkbox
                              id={`skill-${skill}`}
                              checked={selectedSkills[skill]}
                              onCheckedChange={(checked) => {
                                setSelectedSkills({
                                  ...selectedSkills,
                                  [skill]: checked === true,
                                })
                              }}
                            />
                            <label htmlFor={`skill-${skill}`} className="text-sm">
                              {skill}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                      variant="outline"
                      onClick={() => toast({ title: "Cancelled", description: "User creation cancelled" })}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>Add User</Button>
                  </div>
                </SheetContent>
              </Sheet>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("CSV")}>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("Excel")}>Export as Excel</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("PDF")}>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Card>
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="w-full pl-8 md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                        <span className="sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleFilterChange("University")}>University</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterChange("Skills")}>Skills</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterChange("Join Date")}>Join Date</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterChange("Last Active")}>Last Active</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    <TabsTrigger value="banned">Banned</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="p-4">
                        <Checkbox
                          checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all users"
                        />
                      </th>
                      <th scope="col" className="px-6 py-3">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 hidden md:table-cell">
                        University
                      </th>
                      <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                        Skills
                      </th>
                      <th scope="col" className="px-6 py-3 hidden md:table-cell">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                        Last Active
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => toggleSelectUser(user.id)}
                            aria-label={`Select ${user.name}`}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">{user.university}</td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {user.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "inactive"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">{user.lastActive}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                              View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUserAction("Edit", user.id)}>
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction("Reset Password", user.id)}>
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status !== "banned" ? (
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleUserAction("Ban", user.id)}
                                  >
                                    Ban User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleUserAction("Unban", user.id)}>
                                    Unban User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleUserAction("Delete", user.id)}
                                >
                                  Delete Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedUsers.length > 0 && (
                <div className="flex items-center justify-between bg-muted/50 p-4">
                  <p className="text-sm">
                    {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                      <X className="mr-2 h-4 w-4" />
                      Clear Selection
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm">
                          Bulk Actions
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleBulkAction("Activate")}>
                          <Check className="mr-2 h-4 w-4" />
                          Activate Users
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction("Deactivate")}>
                          <X className="mr-2 h-4 w-4" />
                          Deactivate Users
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleBulkAction("Ban")}>
                          Ban Selected Users
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleBulkAction("Delete")}>
                          Delete Selected Users
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>

      {/* User Profile Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>User details and account information</DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={viewingUser.avatar || "/placeholder.svg"} alt={viewingUser.name} />
                  <AvatarFallback>{viewingUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{viewingUser.name}</h3>
                <p className="text-sm text-muted-foreground">{viewingUser.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">University</p>
                  <p className="text-sm">{viewingUser.university}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm">{viewingUser.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Join Date</p>
                  <p className="text-sm">{viewingUser.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      viewingUser.status === "active"
                        ? "default"
                        : viewingUser.status === "inactive"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {viewingUser.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Skills</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {viewingUser.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {viewingUser && (
              <Button variant="outline" onClick={() => handleUserAction("Edit", viewingUser.id)}>
                Edit Profile
              </Button>
            )}
            {viewingUser?.status !== "banned"
              ? viewingUser && (
                  <Button variant="destructive" onClick={() => handleUserAction("Ban", viewingUser.id)}>
                    Ban User
                  </Button>
                )
              : viewingUser && (
                  <Button variant="default" onClick={() => handleUserAction("Unban", viewingUser.id)}>
                    Unban User
                  </Button>
                )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
