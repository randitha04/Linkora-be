"use client"

import { useState } from "react"
import { Bell, ChevronDown, Search, Users } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ThemeProvider, ThemeToggle } from "@/components/theme-provider"
import { DashboardLayout } from "./dashboard-layout"
import { useRouter } from "next/navigation"

// Sample data for charts
const skillsData = [
  {
    name: "Programming",
    total: 580,
  },
  {
    name: "Design",
    total: 420,
  },
  {
    name: "Music",
    total: 350,
  },
  {
    name: "Writing",
    total: 280,
  },
  {
    name: "Photography",
    total: 220,
  },
]

// Sample notifications
const initialNotifications = [
  {
    id: 1,
    title: "New Collaboration Request",
    description: "Alex Wang wants to collaborate on a coding project",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Report Submitted",
    description: "A post has been reported for inappropriate content",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: 3,
    title: "New User Signup",
    description: "5 new users joined Linkora in the last hour",
    time: "1 hour ago",
    read: false,
  },
]

// Sample collaboration requests
const initialCollaborationRequests = [
  {
    id: 1,
    name: "Maya Johnson",
    role: "Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    project: "Mobile App Development",
    status: "pending",
  },
  {
    id: 2,
    name: "Ethan Williams",
    role: "Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    project: "UI/UX Redesign",
    status: "pending",
  },
  {
    id: 3,
    name: "Sophia Chen",
    role: "Writer",
    avatar: "/placeholder.svg?height=40&width=40",
    project: "Content Creation",
    status: "approved",
  },
]

// Sample reports
const initialReports = [
  {
    id: 1,
    reporter: "Jamie Smith",
    reported: "Anonymous User",
    reason: "Inappropriate content",
    status: "pending",
    time: "10 minutes ago",
  },
  {
    id: 2,
    reporter: "Taylor Reed",
    reported: "User123",
    reason: "Harassment",
    status: "pending",
    time: "2 hours ago",
  },
  {
    id: 3,
    reporter: "Jordan Lee",
    reported: "CoolStudent22",
    reason: "Spam",
    status: "resolved",
    time: "1 day ago",
  },
]

export default function Dashboard() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [collaborationRequests, setCollaborationRequests] = useState(initialCollaborationRequests)
  const [reports, setReports] = useState(initialReports)
  const [searchQuery, setSearchQuery] = useState("")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [newRegistrations, setNewRegistrations] = useState(true)
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementMessage, setAnnouncementMessage] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)
  const [isAnnouncementSheetOpen, setIsAnnouncementSheetOpen] = useState(false)

  // Notification actions
  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "Your notifications have been updated.",
    })
  }

  // Collaboration request actions
  const approveRequest = (id: number) => {
    setCollaborationRequests(
      collaborationRequests.map((request) => (request.id === id ? { ...request, status: "approved" } : request)),
    )
    toast({
      title: "Request approved",
      description: "The collaboration request has been approved.",
    })
  }

  const rejectRequest = (id: number) => {
    setCollaborationRequests(collaborationRequests.filter((request) => request.id !== id))
    toast({
      title: "Request rejected",
      description: "The collaboration request has been rejected.",
    })
  }

  // Report actions
  const resolveReport = (id: number) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, status: "resolved" } : report)))
    toast({
      title: "Report resolved",
      description: "The report has been marked as resolved.",
    })
  }

  // Quick actions
  const toggleMaintenanceMode = () => {
    setMaintenanceMode(!maintenanceMode)
    toast({
      title: `Maintenance mode ${!maintenanceMode ? "enabled" : "disabled"}`,
      description: !maintenanceMode
        ? "The platform is now in maintenance mode."
        : "The platform is now accessible to all users.",
    })
  }

  const toggleNewRegistrations = () => {
    setNewRegistrations(!newRegistrations)
    toast({
      title: `New registrations ${!newRegistrations ? "enabled" : "disabled"}`,
      description: !newRegistrations
        ? "Users can now register on the platform."
        : "New user registrations are now disabled.",
    })
  }

  const publishAnnouncement = () => {
    if (!announcementTitle || !announcementMessage) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and message for your announcement.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Announcement published",
      description: `"${announcementTitle}" has been sent to all users.`,
    })

    // Reset form
    setAnnouncementTitle("")
    setAnnouncementMessage("")
    setIsUrgent(false)
    setIsAnnouncementSheetOpen(false)
  }

  // Navigation actions
  const navigateToAllRequests = () => {
    router.push("/collaboration-board")
  }

  const navigateToAllReports = () => {
    router.push("/reports")
  }

  const navigateToAllNotifications = () => {
    router.push("/notifications")
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back to your Linkora admin panel!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-full bg-background pl-8 md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-semibold">Notifications</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  </div>
                  <div className="space-y-4 pt-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex gap-4">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            notification.read ? "bg-muted" : "bg-primary/10"
                          }`}
                        >
                          <Bell className={`h-4 w-4 ${notification.read ? "text-muted-foreground" : "text-primary"}`} />
                        </div>
                        <div className="space-y-1">
                          <p className={`text-sm ${notification.read ? "font-normal" : "font-medium"}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full" onClick={navigateToAllNotifications}>
                    View all notifications
                  </Button>
                </PopoverContent>
              </Popover>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 flex items-center gap-2 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-flex">Admin</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/settings")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      toast({
                        title: "Logged out",
                        description: "You have been logged out of your account.",
                      })
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,853</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,459</div>
                <p className="text-xs text-muted-foreground">+5% from last week</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">New Signups</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">+18% from yesterday</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.filter((r) => r.status === "pending").length}</div>
                <p className="text-xs text-muted-foreground">+2 in the last hour</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Trending Skills</CardTitle>
                <CardDescription>Top 5 skills students are interested in this month</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={skillsData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Collaboration Requests</CardTitle>
                <CardDescription>Recent collaboration requests from students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborationRequests.map((request) => (
                    <div key={request.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">{request.name}</p>
                          <Badge variant="outline" className="ml-auto">
                            {request.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.project}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => approveRequest(request.id)}
                          disabled={request.status === "approved"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4"
                          >
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => rejectRequest(request.id)}
                          disabled={request.status === "approved"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4"
                          >
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                          </svg>
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={navigateToAllRequests}>
                  View all requests
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2 transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-1">
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Moderation alerts that need your attention</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>All Reports</DropdownMenuItem>
                    <DropdownMenuItem>Pending</DropdownMenuItem>
                    <DropdownMenuItem>Resolved</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Inappropriate Content</DropdownMenuItem>
                    <DropdownMenuItem>Harassment</DropdownMenuItem>
                    <DropdownMenuItem>Spam</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{report.reporter}</div>
                        <div className="text-sm text-muted-foreground">reported</div>
                        <div className="font-medium">{report.reported}</div>
                        <Badge variant={report.status === "pending" ? "destructive" : "outline"} className="ml-auto">
                          {report.status}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        Reason: <span className="font-medium">{report.reason}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div>{report.time}</div>
                        <div className="flex gap-2">
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => router.push("/reports")}
                          >
                            View Details
                          </Button>
                          {report.status === "pending" && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => resolveReport(report.id)}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={navigateToAllReports}>
                  View all reports
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common moderation tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Sheet open={isAnnouncementSheetOpen} onOpenChange={setIsAnnouncementSheetOpen}>
                  <SheetTrigger asChild>
                    <Button className="w-full">Create Announcement</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>New Announcement</SheetTitle>
                      <SheetDescription>Create a new announcement for all Linkora users.</SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Title
                        </label>
                        <Input
                          id="title"
                          placeholder="Enter announcement title"
                          value={announcementTitle}
                          onChange={(e) => setAnnouncementTitle(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <textarea
                          id="message"
                          placeholder="Enter your announcement message"
                          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={announcementMessage}
                          onChange={(e) => setAnnouncementMessage(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="urgent"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={isUrgent}
                          onChange={(e) => setIsUrgent(e.target.checked)}
                        />
                        <label htmlFor="urgent" className="text-sm font-medium">
                          Mark as urgent
                        </label>
                      </div>
                    </div>
                    <SheetFooter>
                      <Button variant="outline" onClick={() => setIsAnnouncementSheetOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={publishAnnouncement}>Publish Announcement</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/manage-users")
                    toast({
                      title: "Message Users",
                      description: "Redirecting to user management to send messages.",
                    })
                  }}
                >
                  Message Users
                </Button>
                <Tabs defaultValue="active">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">Maintenance</TabsTrigger>
                    <TabsTrigger value="inactive">User Bans</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">Maintenance Mode</h3>
                        <p className="text-xs text-muted-foreground">
                          Temporarily disable the platform for maintenance
                        </p>
                      </div>
                      <Button
                        variant={maintenanceMode ? "default" : "outline"}
                        size="sm"
                        onClick={toggleMaintenanceMode}
                      >
                        {maintenanceMode ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">New Registrations</h3>
                        <p className="text-xs text-muted-foreground">Allow new users to register</p>
                      </div>
                      <Button
                        variant={newRegistrations ? "default" : "outline"}
                        size="sm"
                        onClick={toggleNewRegistrations}
                      >
                        {newRegistrations ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="inactive" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">Temporary Bans</h3>
                        <p className="text-xs text-muted-foreground">View and manage temporary user bans</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => router.push("/manage-users")}>
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">Permanent Bans</h3>
                        <p className="text-xs text-muted-foreground">View and manage permanent user bans</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => router.push("/manage-users")}>
                        View
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  )
}
