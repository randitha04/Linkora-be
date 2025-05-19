"use client"

import * as React from "react"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShareModal } from "@/components/share-modal"
import { CollaborationModal } from "@/components/collaboration-modal"

interface PostCardProps {
  post: {
    id: number
    user: {
      name: string
      avatar: string
      university: string
    }
    content: string
    image?: string
    tags: string[]
    status: string
    likes: number
    comments: number
    timeAgo: string
  }
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = React.useState(false)
  const [likeCount, setLikeCount] = React.useState(post.likes)
  const [showComments, setShowComments] = React.useState(false)
  const [commentText, setCommentText] = React.useState("")
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const [isCollabModalOpen, setIsCollabModalOpen] = React.useState(false)

  // Sample comments data
  const [comments, setComments] = React.useState([
    {
      id: 1,
      user: {
        name: "Riley Kim",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: "This sounds really interesting! I'd love to collaborate on this project.",
      timeAgo: "30 minutes ago",
    },
    {
      id: 2,
      user: {
        name: "Casey Morgan",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: "I have some experience with this. Let's connect and discuss more!",
      timeAgo: "1 hour ago",
    },
  ])

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const handleAddComment = () => {
    if (commentText.trim() === "") return

    const newComment = {
      id: comments.length + 1,
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: commentText,
      timeAgo: "Just now",
    }

    setComments([...comments, newComment])
    setCommentText("")
  }

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  const handleCollab = () => {
    setIsCollabModalOpen(true)
  }

  // Generate a mock URL for the post
  const postUrl = `https://linkora.com/post/${post.id}`

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium leading-none">{post.user.name}</p>
                <p className="text-xs text-muted-foreground">{post.user.university}</p>
              </div>
              <Badge
                variant="outline"
                className={`${
                  post.status === "Find"
                    ? "border-purple-500 bg-purple-500/10 text-purple-500"
                    : "border-blue-500 bg-blue-500/10 text-blue-500"
                }`}
              >
                {post.status === "Find" ? "Looking For" : "Offering"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="mb-3">{post.content}</p>

          {post.image && (
            <div className="mb-3 overflow-hidden rounded-lg">
              <img
                src={post.image || "/placeholder.svg"}
                alt="Post image"
                className="h-auto w-full object-cover transition-transform hover:scale-105"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="rounded-full">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <button className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`} onClick={handleLike}>
              <Heart className={`h-4 w-4 ${liked ? "fill-current text-red-500" : ""}`} />
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center gap-1" onClick={toggleComments}>
              <MessageCircle className="h-4 w-4" />
              <span>{comments.length}</span>
            </button>
            <button className="flex items-center gap-1" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
            <Button
              size="sm"
              className="ml-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white"
              onClick={handleCollab}
            >
              Collab
            </Button>
          </div>
        </CardFooter>

        {showComments && (
          <div className="border-t px-4 py-3">
            <div className="mb-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 rounded-lg bg-muted p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{comment.user.name}</p>
                      <p className="text-xs text-muted-foreground">{comment.timeAgo}</p>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment()
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`${post.user.name}'s post`}
        url={postUrl}
        type="post"
      />

      <CollaborationModal isOpen={isCollabModalOpen} onClose={() => setIsCollabModalOpen(false)} post={post} />
    </>
  )
}
