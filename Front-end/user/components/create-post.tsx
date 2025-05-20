"use client"

import * as React from "react"
import { ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function CreatePost() {
  const [content, setContent] = React.useState("")
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [image, setImage] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<"Find" | "Have">("Find")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const availableTags = [
    "UI/UX",
    "Design",
    "Mobile App",
    "Web Dev",
    "Game Dev",
    "Music",
    "Film",
    "Art",
    "Writing",
    "Photography",
  ]

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    }
  }

  const removeImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    // In a real app, you would submit the post to a server
    console.log({ content, selectedTags, image, status })
    // Reset form
    setContent("")
    setSelectedTags([])
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">Create a post</p>
            <p className="text-xs text-muted-foreground">Share your skills or find collaborators</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Textarea
          placeholder="What are you working on? What skills are you looking for?"
          className="mb-3 min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {image && (
          <div className="relative mb-3 overflow-hidden rounded-lg">
            <img
              src={image || "/placeholder.svg"}
              alt="Uploaded preview"
              className="h-auto max-h-[300px] w-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6 rounded-full"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="mb-3">
          <p className="mb-2 text-sm font-medium">Add tags</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer rounded-full ${
                  selectedTags.includes(tag) ? "bg-gradient-to-r from-purple-600 to-blue-500" : ""
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Post type</p>
          <div className="flex gap-2">
            <Badge
              variant={status === "Find" ? "default" : "outline"}
              className={`cursor-pointer rounded-full ${
                status === "Find" ? "border-purple-500 bg-purple-500/10 text-purple-500" : ""
              }`}
              onClick={() => setStatus("Find")}
            >
              Looking For
            </Badge>
            <Badge
              variant={status === "Have" ? "default" : "outline"}
              className={`cursor-pointer rounded-full ${
                status === "Have" ? "border-blue-500 bg-blue-500/10 text-blue-500" : ""
              }`}
              onClick={() => setStatus("Have")}
            >
              Offering
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} ref={fileInputRef} />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Add Image</span>
          </Button>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  )
}
