"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"

interface EditProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  userData: any
  onSave: (updatedData: any) => void
}

export function EditProfileDialog({ isOpen, onClose, userData, onSave }: EditProfileDialogProps) {
  const [formData, setFormData] = useState({ ...userData })
  const [newHobby, setNewHobby] = useState("")
  const [newTalent, setNewTalent] = useState("")
  const [avatarPreview, setAvatarPreview] = useState(userData.profilePicture)

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    })
  }

  const handleBasicInfoChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleAddHobby = () => {
    if (newHobby.trim() && !formData.personality.hobbies.includes(newHobby.trim())) {
      setFormData({
        ...formData,
        personality: {
          ...formData.personality,
          hobbies: [...formData.personality.hobbies, newHobby.trim()],
        },
      })
      setNewHobby("")
    }
  }

  const handleRemoveHobby = (hobby: string) => {
    setFormData({
      ...formData,
      personality: {
        ...formData.personality,
        hobbies: formData.personality.hobbies.filter((h: string) => h !== hobby),
      },
    })
  }

  const handleAddTalent = () => {
    if (newTalent.trim() && !formData.personality.talents.includes(newTalent.trim())) {
      setFormData({
        ...formData,
        personality: {
          ...formData.personality,
          talents: [...formData.personality.talents, newTalent.trim()],
        },
      })
      setNewTalent("")
    }
  }

  const handleRemoveTalent = (talent: string) => {
    setFormData({
      ...formData,
      personality: {
        ...formData.personality,
        talents: formData.personality.talents.filter((t: string) => t !== talent),
      },
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to a server
      const imageUrl = URL.createObjectURL(file)
      setAvatarPreview(imageUrl)
      handleBasicInfoChange("profilePicture", imageUrl)
    }
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information to help others get to know you better.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="university">University</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} alt={formData.fullName} />
                  <AvatarFallback>{formData.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1 cursor-pointer">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => handleBasicInfoChange("nickname", e.target.value)}
                  placeholder="E.g., Alex_J"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleBasicInfoChange("fullName", e.target.value)}
                  placeholder="E.g., Alex Johnson"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationshipStatus">Relationship Status</Label>
                <Select
                  value={formData.relationshipStatus}
                  onValueChange={(value) => handleBasicInfoChange("relationshipStatus", value)}
                >
                  <SelectTrigger id="relationshipStatus">
                    <SelectValue placeholder="Select relationship status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In a relationship">In a relationship</SelectItem>
                    <SelectItem value="Looking for a relationship">Looking for a relationship</SelectItem>
                    <SelectItem value="Not looking for a relationship">Not looking for a relationship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* University Tab */}
          <TabsContent value="university" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="universityName">University Name</Label>
                <Input
                  id="universityName"
                  value={formData.university.name}
                  onChange={(e) => handleInputChange("university", "name", e.target.value)}
                  placeholder="E.g., Stanford University"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Input
                  id="faculty"
                  value={formData.university.faculty}
                  onChange={(e) => handleInputChange("university", "faculty", e.target.value)}
                  placeholder="E.g., Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={formData.university.degree}
                  onChange={(e) => handleInputChange("university", "degree", e.target.value)}
                  placeholder="E.g., Bachelor of Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="positions">Positions Held at University</Label>
                <Textarea
                  id="positions"
                  value={formData.university.positions}
                  onChange={(e) => handleInputChange("university", "positions", e.target.value)}
                  placeholder="E.g., Student Council Representative, Club President"
                />
              </div>
            </div>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentJobs">What Jobs Do You Have</Label>
                <Textarea
                  id="currentJobs"
                  value={formData.professional.currentJobs}
                  onChange={(e) => handleInputChange("professional", "currentJobs", e.target.value)}
                  placeholder="E.g., Part-time Web Developer, Campus Barista"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="societyPositions">What Positions Do You Hold in Society</Label>
                <Textarea
                  id="societyPositions"
                  value={formData.professional.societyPositions}
                  onChange={(e) => handleInputChange("professional", "societyPositions", e.target.value)}
                  placeholder="E.g., Treasurer of Debate Society, Volunteer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workWithPeople">What Kind of People Do You Like to Work With</Label>
                <Textarea
                  id="workWithPeople"
                  value={formData.professional.workWithPeople}
                  onChange={(e) => handleInputChange("professional", "workWithPeople", e.target.value)}
                  placeholder="Describe your ideal collaborators"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beAroundPeople">What Kind of People Do You Like to Be Around</Label>
                <Textarea
                  id="beAroundPeople"
                  value={formData.professional.beAroundPeople}
                  onChange={(e) => handleInputChange("professional", "beAroundPeople", e.target.value)}
                  placeholder="Describe your ideal social circle"
                />
              </div>
            </div>
          </TabsContent>

          {/* Personality Tab */}
          <TabsContent value="personality" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Hobbies</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.personality.hobbies.map((hobby: string, index: number) => (
                    <Badge key={index} variant="secondary" className="rounded-full flex items-center gap-1">
                      {hobby}
                      <button onClick={() => handleRemoveHobby(hobby)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a hobby"
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddHobby()
                      }
                    }}
                  />
                  <Button variant="outline" size="icon" onClick={handleAddHobby} disabled={!newHobby.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Talents</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.personality.talents.map((talent: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full flex items-center gap-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-500 border-purple-200 dark:border-purple-800"
                    >
                      {talent}
                      <button onClick={() => handleRemoveTalent(talent)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a talent"
                    value={newTalent}
                    onChange={(e) => setNewTalent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTalent()
                      }
                    }}
                  />
                  <Button variant="outline" size="icon" onClick={handleAddTalent} disabled={!newTalent.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements</Label>
                <Textarea
                  id="achievements"
                  value={formData.personality.achievements}
                  onChange={(e) => handleInputChange("personality", "achievements", e.target.value)}
                  placeholder="List your notable achievements"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
