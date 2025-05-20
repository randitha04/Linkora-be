"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { Separator } from "@/components/ui/separator"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full items-center justify-between md:hidden">
      <Link href="/" className="flex items-center space-x-2">
        <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
          Linkora
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <ModeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 py-4">
              <Link
                href="/feed"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setOpen(false)}
              >
                Feed
              </Link>
              <Link
                href="/collab"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setOpen(false)}
              >
                Collabs
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setOpen(false)}
              >
                Discover
              </Link>
              <Link
                href="/messages"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setOpen(false)}
              >
                Messages
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setOpen(false)}
              >
                Settings
              </Link>
              <Separator />
              <Link
                href="/auth"
                className="flex items-center text-sm font-medium text-red-500"
                onClick={() => setOpen(false)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
