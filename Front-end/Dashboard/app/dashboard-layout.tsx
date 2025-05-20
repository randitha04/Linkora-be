"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Bell, Cog, Flag, LayoutDashboard, Menu, MessageSquare, PanelLeft, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = useCallback(
    (path: string) => {
      setOpen(false)
      router.push(path)
    },
    [router],
  )

  const isActive = useCallback(
    (path: string) => {
      return pathname === path
    },
    [pathname],
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <nav className="grid gap-2 p-4 text-lg font-medium">
              <Link
                href="/"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  isActive("/") ? "text-primary bg-muted" : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
                onClick={() => handleNavigation("/")}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/manage-users"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  isActive("/manage-users")
                    ? "text-primary bg-muted"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
                onClick={() => handleNavigation("/manage-users")}
              >
                <Users className="h-5 w-5" />
                Manage Users
              </Link>
              <Link
                href="/manage-posts"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  isActive("/manage-posts")
                    ? "text-primary bg-muted"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
                onClick={() => handleNavigation("/manage-posts")}
              >
                <MessageSquare className="h-5 w-5" />
                Manage Posts
              </Link>
              <Link
                href="/collaboration-board"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  isActive("/collaboration-board")
                    ? "text-primary bg-muted"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
                onClick={() => handleNavigation("/collaboration-board")}
              >
                <BarChart3 className="h-5 w-5" />
                Collaboration Board
              </Link>
              <Link
                href="/reports"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  isActive("/reports")
                    ? "text-primary bg-muted"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
                onClick={() => handleNavigation("/reports")}
              >
                <Flag className="h-5 w-5" />
                Reports
              </Link>
              <Link
                href="/notifications"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  isActive("/notifications")
                    ? "text-primary bg-muted"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
                onClick={() => handleNavigation("/notifications")}
              >
                <Bell className="h-5 w-5" />
                Notifications
              </Link>
              <Link
                href="/settings"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  isActive("/settings")
                    ? "text-primary bg-muted"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
                onClick={() => handleNavigation("/settings")}
              >
                <Cog className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M6.5 6.5h11v11h-11z" />
              <path d="M3 10h18" />
              <path d="M10 3v18" />
            </svg>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Linkora
            </span>
          </Link>
        </div>
      </header>
      <div className="flex flex-1">
        <SidebarProvider defaultOpen>
          <Sidebar className="hidden border-r md:flex">
            <SidebarHeader className="border-b p-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M6.5 6.5h11v11h-11z" />
                  <path d="M3 10h18" />
                  <path d="M10 3v18" />
                </svg>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Linkora
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/")}>
                        <Link href="/">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/manage-users")}>
                        <Link href="/manage-users">
                          <Users className="h-5 w-5" />
                          <span>Manage Users</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/manage-posts")}>
                        <Link href="/manage-posts">
                          <MessageSquare className="h-5 w-5" />
                          <span>Manage Posts</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/collaboration-board")}>
                        <Link href="/collaboration-board">
                          <BarChart3 className="h-5 w-5" />
                          <span>Collaboration Board</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/reports")}>
                        <Link href="/reports">
                          <Flag className="h-5 w-5" />
                          <span>Reports</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/notifications")}>
                        <Link href="/notifications">
                          <Bell className="h-5 w-5" />
                          <span>Notifications</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/settings")}>
                        <Link href="/settings">
                          <Cog className="h-5 w-5" />
                          <span>Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <PanelLeft className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Admin Panel</p>
                  <p className="text-xs text-muted-foreground">v1.0.0</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
          <div className="flex-1">{children}</div>
        </SidebarProvider>
      </div>
    </div>
  )
}
