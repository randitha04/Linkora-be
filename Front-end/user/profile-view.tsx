"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditProfileDialog } from "./edit-profile-dialog"
import { Heart, Briefcase, GraduationCap, User, Users } from "lucide-react"

// Sample user data
const userData = {
  nickname: "Alex_J",
  fullName: "Alex Johnson",
  profilePicture: "/placeholder.svg?height=128&width=128",
  relationshipStatus: "Looking for a relationship",
  university: {
    name: "Stanford University",
    faculty: "Computer Science",
    degree: "Bachelor of Science",
    positions: "Student Council Representative, Coding Club President",
  },
  professional: {
    currentJobs: "Part-time Web Developer at TechStart, Campus Barista",
    societyPositions: "Treasurer of Debate Society, Volunteer at Local Shelter",
    workWithPeople: "Creative thinkers, problem solvers, and those who bring diverse perspectives",
    beAroundPeople: "Energetic, positive, and intellectually curious individuals who enjoy deep conversations",
  },
  personality: {
    hobbies: ["Photography", "Hiking", "Chess", "Coding", "Reading"],
    talents: ["Web Development", "Public Speaking", "Creative Writing", "UI/UX Design"],
    achievements: "Dean's List 2022-2023, 1st Place Hackathon 2022, Published Research Paper on AI Ethics",
  },
}

export default function ProfileView() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [user, setUser] = useState(userData)

  const handleProfileUpdate = (updatedData: typeof userData) => {
    setUser(updatedData)
    setIsEditDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <Button
          onClick={() => setIsEditDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
        >
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-purple-600/20 to-blue-500/20"></div>
            <div className="p-6 -mt-16 flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.fullName} />
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-2xl font-bold">{user.fullName}</h2>
              <p className="text-muted-foreground">@{user.nickname}</p>

              <div className="mt-4 w-full">
                <Badge className="w-full justify-center py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 text-pink-500 border-pink-200 dark:border-pink-800">
                  <Heart className="h-3.5 w-3.5 mr-1" />
                  {user.relationshipStatus}
                </Badge>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                University
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">{user.university.name}</p>
                <p className="text-sm text-muted-foreground">{user.university.faculty}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Degree</p>
                <p className="text-sm text-muted-foreground">{user.university.degree}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Positions Held at University</p>
                <p className="text-sm text-muted-foreground">{user.university.positions}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Professional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">What Jobs Do You Have</p>
                <p className="text-muted-foreground">{user.professional.currentJobs}</p>
              </div>
              <div>
                <p className="text-sm font-medium">What Positions Do You Hold in Society</p>
                <p className="text-muted-foreground">{user.professional.societyPositions}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Social Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">What Kind of People Do You Like to Work With</p>
                <p className="text-muted-foreground">{user.professional.workWithPeople}</p>
              </div>
              <div>
                <p className="text-sm font-medium">What Kind of People Do You Like to Be Around</p>
                <p className="text-muted-foreground">{user.professional.beAroundPeople}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personality & Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Hobbies</p>
                <div className="flex flex-wrap gap-2">
                  {user.personality.hobbies.map((hobby, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full">
                      {hobby}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Talents</p>
                <div className="flex flex-wrap gap-2">
                  {user.personality.talents.map((talent, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-500 border-purple-200 dark:border-purple-800"
                    >
                      {talent}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Achievements</p>
                <p className="text-muted-foreground">{user.personality.achievements}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        userData={user}
        onSave={handleProfileUpdate}
      />
    </div>
  )
}
