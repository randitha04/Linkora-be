"use client"

import { useState } from "react"
import { AlertCircle, ChevronDown, Filter, MoreHorizontal, Search, Shield, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "../dashboard-layout"

// Sample report data
const reports = [
  {
    id: 1,
    type: "post",
    reason: "Inappropriate content",
    description: "This post contains offensive language and inappropriate images.",
    reporter: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reported: {
      name: "Anonymous User",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "This is the reported content with offensive language and inappropriate references.",
    },
    status: "pending",
    priority: "high",
    date: "2023-11-15T10:30:00Z",
  },
  {
    id: 2,
    type: "user",
    reason: "Harassment",
    description: "This user has been sending threatening messages to multiple students.",
    reporter: {
      name: "Maya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reported: {
      name: "Problem User",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "User profile and message history showing pattern of harassment.",
    },
    status: "pending",
    priority: "high",
    date: "2023-11-14T14:45:00Z",
  },
  {
    id: 3,
    type: "post",
    reason: "Spam",
    description: "This post contains multiple spam links to external websites.",
    reporter: {
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reported: {
      name: "Spam Account",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Check out these amazing deals! [Multiple suspicious links]",
    },
    status: "pending",
    priority: "medium",
    date: "2023-11-13T09:15:00Z",
  },
  {
    id: 4,
    type: "comment",
    reason: "Hate speech",
    description: "This comment contains hate speech targeting a specific group.",
    reporter: {
      name: "Taylor Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reported: {
      name: "Problematic Commenter",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Comment with hateful language targeting a specific ethnic group.",
    },
    status: "pending",
    priority: "high",
    date: "2023-11-12T16:20:00Z",
  },
  {
    id: 5,
    type: "post",
    reason: "Misinformation",
    description: "This post contains false information about university policies.",
    reporter: {
      name: "Casey Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reported: {
      name: "Misinformed User",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "The university is planning to cancel all scholarships next semester! Spread the word!",
    },
    status: "resolved",
    priority: "medium",
    date: "2023-11-11T11:50:00Z",
    resolution: {
      action: "removed",
      note: "Post removed for containing false information. User warned.",
      date: "2023-11-11T14:30:00Z",
    },
  },
  {
    id: 6,
    type: "user",
    reason: "Impersonation",
    description: "This user is impersonating a faculty member.",
    reporter: {
      name: "Riley Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reported: {
      name: "Fake Professor",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "User profile claiming to be Dr. Smith from the Physics department.",
    },
    status: "resolved",
    priority: "high",
    date: "2023-11-10T08:30:00Z",
    resolution: {
      action: "banned",
      note: "Account banned for impersonation. Reported to university IT.",
      date: "2023-11-10T10:15:00Z",
    },
  },
]

export default function Reports() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredReports = reports.filter((report) => {
    // Filter by tab
    if (selectedTab === "pending" && report.status !== "pending") return false
    if (selectedTab === "resolved" && report.status !== "resolved") return false

    // Filter by priority
    if (priorityFilter !== "all" && report.priority !== priorityFilter) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        report.reason.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.reporter.name.toLowerCase().includes(query) ||
        report.reported.name.toLowerCase().includes(query) ||
        report.reported.content.toLowerCase().includes(query)
      )
    }

    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
              <p className="text-muted-foreground">Review and manage reported content and users</p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Priority
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter By Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="w-full pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Reports</CardTitle>
                  <CardDescription>View and manage all reported content and users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredReports.map((report) => (
                      <div
                        key={report.id}
                        className={`border rounded-lg p-4 ${
                          report.priority === "high" ? "border-red-200 dark:border-red-800" : "border-border"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2 rounded-full ${
                                report.priority === "high"
                                  ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                  : report.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                              }`}
                            >
                              <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{report.type}</Badge>
                                <h3 className="font-semibold">{report.reason}</h3>
                                <Badge variant={report.status === "pending" ? "destructive" : "outline"}>
                                  {report.status}
                                </Badge>
                              </div>
                              <p className="text-sm mt-1">{report.description}</p>
                              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <span>Reported on {formatDate(report.date)}</span>
                                <span>•</span>
                                <span>
                                  Priority:{" "}
                                  <span
                                    className={
                                      report.priority === "high"
                                        ? "text-red-500 dark:text-red-400"
                                        : report.priority === "medium"
                                          ? "text-yellow-500 dark:text-yellow-400"
                                          : "text-blue-500 dark:text-blue-400"
                                    }
                                  >
                                    {report.priority}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Report Details</DialogTitle>
                                  <DialogDescription>Review report and take action</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="text-sm font-medium">Report Type</h3>
                                      <p className="text-sm">{report.type}</p>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-medium">Reason</h3>
                                      <p className="text-sm">{report.reason}</p>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-medium">Status</h3>
                                      <Badge variant={report.status === "pending" ? "destructive" : "outline"}>
                                        {report.status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-medium">Priority</h3>
                                      <Badge
                                        variant="outline"
                                        className={
                                          report.priority === "high"
                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                            : report.priority === "medium"
                                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                        }
                                      >
                                        {report.priority}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Description</h3>
                                    <p className="text-sm mt-1">{report.description}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="text-sm font-medium">Reported By</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={report.reporter.avatar || "/placeholder.svg"}
                                            alt={report.reporter.name}
                                          />
                                          <AvatarFallback>{report.reporter.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{report.reporter.name}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-medium">Reported Content/User</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={report.reported.avatar || "/placeholder.svg"}
                                            alt={report.reported.name}
                                          />
                                          <AvatarFallback>{report.reported.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{report.reported.name}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Reported Content</h3>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                      {report.reported.content}
                                    </div>
                                  </div>
                                  {report.status === "resolved" && report.resolution && (
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-800">
                                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                                        Resolution
                                      </h3>
                                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                        Action taken: {report.resolution.action}
                                      </p>
                                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                        {report.resolution.note}
                                      </p>
                                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                        Resolved on: {formatDate(report.resolution.date)}
                                      </p>
                                    </div>
                                  )}
                                  {report.status === "pending" && (
                                    <div>
                                      <h3 className="text-sm font-medium">Take Action</h3>
                                      <div className="grid gap-2 mt-2">
                                        <Textarea placeholder="Add notes about your decision..." />
                                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                                          <Button variant="outline" className="sm:flex-1">
                                            <X className="mr-2 h-4 w-4" />
                                            Dismiss Report
                                          </Button>
                                          <Button variant="outline" className="sm:flex-1">
                                            <Shield className="mr-2 h-4 w-4" />
                                            Warn User
                                          </Button>
                                          <Button variant="destructive" className="sm:flex-1">
                                            <Shield className="mr-2 h-4 w-4" />
                                            Remove Content
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Close</Button>
                                  {report.status === "pending" && <Button>Save Resolution</Button>}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {report.status === "pending" ? (
                                  <>
                                    <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                                    <DropdownMenuItem>Change Priority</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Contact Reporter</DropdownMenuItem>
                                    <DropdownMenuItem>Contact Reported User</DropdownMenuItem>
                                  </>
                                ) : (
                                  <>
                                    <DropdownMenuItem>View Resolution</DropdownMenuItem>
                                    <DropdownMenuItem>Reopen Report</DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Reports</CardTitle>
                  <CardDescription>Reports that require your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredReports
                      .filter((report) => report.status === "pending")
                      .map((report) => (
                        <div
                          key={report.id}
                          className={`border rounded-lg p-4 ${
                            report.priority === "high" ? "border-red-200 dark:border-red-800" : "border-border"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  report.priority === "high"
                                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                    : report.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                }`}
                              >
                                <AlertCircle className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{report.type}</Badge>
                                  <h3 className="font-semibold">{report.reason}</h3>
                                </div>
                                <p className="text-sm mt-1">{report.description}</p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <span>Reported on {formatDate(report.date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              <Button variant="destructive" size="sm">
                                Take Action
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resolved" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resolved Reports</CardTitle>
                  <CardDescription>Reports that have been addressed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredReports
                      .filter((report) => report.status === "resolved")
                      .map((report) => (
                        <div key={report.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                                <Shield className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{report.type}</Badge>
                                  <h3 className="font-semibold">{report.reason}</h3>
                                  <Badge variant="outline">resolved</Badge>
                                </div>
                                <p className="text-sm mt-1">{report.description}</p>
                                {report.resolution && (
                                  <p className="text-sm mt-1 text-green-600 dark:text-green-400">
                                    Action: {report.resolution.action}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <span>Resolved on {formatDate(report.resolution?.date || report.date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  )
}
