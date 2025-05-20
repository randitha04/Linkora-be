import Link from "next/link"
import { MessageSquare, Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DesktopNav() {
  return (
    <div className="hidden w-full items-center justify-between md:flex">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
            Linkora
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/feed" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Feed
          </Link>
          <Link
            href="/collab"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Collabs
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Discover
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/search">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/messages">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Link>
        </Button>
        <NotificationDropdown />

        {/* Replace the profile button with a dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth" className="flex items-center text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />
      </div>
    </div>
  )
}
