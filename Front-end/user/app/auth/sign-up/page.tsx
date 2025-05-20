import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SignUpPage() {
  return (
    <div className="container flex h-screen max-w-md flex-col items-center justify-center space-y-6 py-12">
      <div className="flex w-full flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your details below to create your account and get started</p>
      </div>
      <div className="w-full">
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            Create Account
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between">
          <Separator className="w-[30%]" />
          <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
          <Separator className="w-[30%]" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="4"></circle>
              <line x1="21.17" x2="12" y1="8" y2="8"></line>
              <line x1="3.95" x2="8.54" y1="6.06" y2="14"></line>
              <line x1="10.88" x2="15.46" y1="21.94" y2="14"></line>
            </svg>
            Google
          </Button>
          <Button variant="outline" className="w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
              <path d="M10 2c1 .5 2 2 2 5"></path>
            </svg>
            Apple
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
