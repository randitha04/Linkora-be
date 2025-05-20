"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CollaborationModal } from "@/components/collaboration-modal"
import { PostCollaborationModal } from "@/components/post-collaboration-modal"

export default function CollabPage() {
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false)
  const [isCollabModalOpen, setIsCollabModalOpen] = React.useState(false)
  const [selectedCollab, setSelectedCollab] = React.useState<any>(null)

  // Sample collaboration data
  const collabs = [
    {
      id: 1,
      title: "Mobile App for Campus Events",
      description:
        "Looking for a UI/UX designer to collaborate on a mobile app that helps students discover campus events. Backend development is already in progress.",
      tags: ["Mobile App", "UI/UX", "Design"],
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "Stanford University",
      },
      timeframe: "2-3 months",
      applicants: 4,
      status: "Open",
    },
    {
      id: 2,
      title: "Short Film Sound Design",
      description:
        "Need someone who can help with sound design and possibly original score composition for my final project short film. The film is already shot and in editing.",
      tags: ["Film", "Sound Design", "Music"],
      author: {
        name: "Taylor Reed",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "NYU",
      },
      timeframe: "1 month",
      applicants: 2,
      status: "Open",
    },
    {
      id: 3,
      title: "Indie Game Development",
      description:
        "Building a 2D platformer game and looking for artists, programmers, and sound designers to join the team. We have a working prototype and concept art.",
      tags: ["Game Dev", "Art", "Programming"],
      author: {
        name: "Jordan Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "UC Berkeley",
      },
      timeframe: "6 months",
      applicants: 7,
      status: "Open",
    },
    {
      id: 4,
      title: "Podcast About Student Life",
      description:
        "Starting a podcast about student life and academic experiences. Looking for co-hosts and guests. I have the equipment and editing skills.",
      tags: ["Podcast", "Audio", "Content Creation"],
      author: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "MIT",
      },
      timeframe: "Ongoing",
      applicants: 3,
      status: "Open",
    },
  ]

  const handleApplyClick = (collab: any) => {
    setSelectedCollab({
      id: collab.id,
      user: collab.author,
      content: collab.description,
      tags: collab.tags,
    })
    setIsCollabModalOpen(true)
  }

  return (
    <>
      <div className="container py-6 md:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Collaboration Board</h1>
            <p className="text-muted-foreground">Find projects to collaborate on or post your own</p>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
            onClick={() => setIsPostModalOpen(true)}
          >
            Post Collaboration
          </Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="md:col-span-3">
            <div className="relative">
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
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <Input placeholder="Search collaborations..." className="w-full pl-10" />
            </div>
          </div>
          <div>
            <Button variant="outline" className="w-full justify-between">
              <span>Filter</span>
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
                className="h-4 w-4"
              >
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
              </svg>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collabs.map((collab) => (
                <Card key={collab.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-500">
                        {collab.status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
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
                          className="h-3 w-3"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>{collab.applicants} applicants</span>
                      </div>
                    </div>
                    <CardTitle className="mt-2 line-clamp-1">{collab.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={collab.author.avatar || "/placeholder.svg"} alt={collab.author.name} />
                        <AvatarFallback>{collab.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-xs text-muted-foreground">
                        {collab.author.name} • {collab.author.university}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="line-clamp-3 mb-3 min-h-[4.5rem]">{collab.description}</CardDescription>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {collab.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
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
                        className="mr-1 h-3 w-3"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Timeframe: {collab.timeframe}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                      onClick={() => handleApplyClick(collab)}
                    >
                      Apply to Collaborate
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tech">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collabs
                .filter((collab) => collab.tags.some((tag) => ["Mobile App", "Programming", "Game Dev"].includes(tag)))
                .map((collab) => (
                  <Card key={collab.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-500">
                          {collab.status}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
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
                            className="h-3 w-3"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <span>{collab.applicants} applicants</span>
                        </div>
                      </div>
                      <CardTitle className="mt-2 line-clamp-1">{collab.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={collab.author.avatar || "/placeholder.svg"} alt={collab.author.name} />
                          <AvatarFallback>{collab.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-xs text-muted-foreground">
                          {collab.author.name} • {collab.author.university}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="line-clamp-3 mb-3 min-h-[4.5rem]">
                        {collab.description}
                      </CardDescription>
                      <div className="mb-3 flex flex-wrap gap-1">
                        {collab.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
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
                          className="mr-1 h-3 w-3"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Timeframe: {collab.timeframe}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                        onClick={() => handleApplyClick(collab)}
                      >
                        Apply to Collaborate
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="creative">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collabs
                .filter((collab) =>
                  collab.tags.some((tag) =>
                    ["Film", "Sound Design", "Music", "Art", "Design", "Content Creation"].includes(tag),
                  ),
                )
                .map((collab) => (
                  <Card key={collab.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-500">
                          {collab.status}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
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
                            className="h-3 w-3"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <span>{collab.applicants} applicants</span>
                        </div>
                      </div>
                      <CardTitle className="mt-2 line-clamp-1">{collab.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={collab.author.avatar || "/placeholder.svg"} alt={collab.author.name} />
                          <AvatarFallback>{collab.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-xs text-muted-foreground">
                          {collab.author.name} • {collab.author.university}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="line-clamp-3 mb-3 min-h-[4.5rem]">
                        {collab.description}
                      </CardDescription>
                      <div className="mb-3 flex flex-wrap gap-1">
                        {collab.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
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
                          className="mr-1 h-3 w-3"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Timeframe: {collab.timeframe}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                        onClick={() => handleApplyClick(collab)}
                      >
                        Apply to Collaborate
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="business">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="mb-2 text-muted-foreground">No business collaborations available at the moment</p>
              <Button variant="outline" size="sm" onClick={() => setIsPostModalOpen(true)}>
                Create a Business Collaboration
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="research">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="mb-2 text-muted-foreground">No research collaborations available at the moment</p>
              <Button variant="outline" size="sm" onClick={() => setIsPostModalOpen(true)}>
                Create a Research Collaboration
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CollaborationModal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        post={selectedCollab}
      />

      <PostCollaborationModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
    </>
  )
}
