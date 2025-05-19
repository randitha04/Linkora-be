"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PaperclipIcon, SendIcon, SmileIcon } from "lucide-react"

export default function MessagesPage() {
  const [activeChat, setActiveChat] = React.useState(1)
  const [message, setMessage] = React.useState("")

  // Sample chat data
  const chats = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        lastSeen: "Now",
      },
      messages: [
        {
          id: 1,
          content:
            "Hey! I saw your post about the mobile app project. I'm interested in helping with the UI/UX design.",
          sender: "them",
          time: "10:30 AM",
        },
        {
          id: 2,
          content:
            "That's great! I've been looking for someone with design skills. Do you have any examples of your previous work?",
          sender: "me",
          time: "10:32 AM",
        },
        {
          id: 3,
          content:
            "Yes, I can share my portfolio with you. I've worked on several mobile apps before, including a campus events app for my previous university.",
          sender: "them",
          time: "10:35 AM",
        },
        {
          id: 4,
          content:
            "That sounds perfect! I'd love to see your portfolio. When would you be available to discuss the project in more detail?",
          sender: "me",
          time: "10:38 AM",
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Taylor Reed",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "offline",
        lastSeen: "2 hours ago",
      },
      messages: [
        {
          id: 1,
          content: "Hi there! I'm interested in your short film sound design project.",
          sender: "them",
          time: "Yesterday",
        },
        {
          id: 2,
          content: "Hello! Thanks for reaching out. Do you have experience with sound design for films?",
          sender: "me",
          time: "Yesterday",
        },
      ],
    },
    {
      id: 3,
      user: {
        name: "Jordan Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        lastSeen: "Now",
      },
      messages: [
        {
          id: 1,
          content:
            "Hey, I saw your profile and noticed you're into game development. I'm working on a 2D platformer and looking for collaborators.",
          sender: "them",
          time: "2 days ago",
        },
      ],
    },
  ]

  const activeConversation = chats.find((chat) => chat.id === activeChat)

  const handleSendMessage = () => {
    if (message.trim() === "") return
    // In a real app, you would send the message to the server here
    setMessage("")
  }

  return (
    <div className="container grid h-[calc(100vh-4rem)] py-6 md:py-8">
      <div className="grid h-full overflow-hidden rounded-lg border md:grid-cols-[300px_1fr]">
        {/* Chat list */}
        <div className="border-r">
          <div className="p-4">
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <Separator />
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {chats.map((chat) => (
              <div key={chat.id}>
                <button
                  className={`flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/50 ${
                    activeChat === chat.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={chat.user.avatar || "/placeholder.svg"} alt={chat.user.name} />
                      <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {chat.user.status === "online" && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{chat.user.name}</p>
                      <p className="text-xs text-muted-foreground">{chat.messages[chat.messages.length - 1].time}</p>
                    </div>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {chat.messages[chat.messages.length - 1].content}
                    </p>
                  </div>
                </button>
                <Separator />
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat area */}
        {activeConversation ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={activeConversation.user.avatar || "/placeholder.svg"}
                      alt={activeConversation.user.name}
                    />
                    <AvatarFallback>{activeConversation.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {activeConversation.user.status === "online" && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{activeConversation.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation.user.status === "online"
                      ? "Online"
                      : `Last seen ${activeConversation.user.lastSeen}`}
                  </p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeConversation.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "me" ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white" : "bg-muted"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`text-right text-xs ${msg.sender === "me" ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button variant="outline" size="icon">
                  <SmileIcon className="h-4 w-4" />
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                  size="icon"
                  onClick={handleSendMessage}
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
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
                className="h-10 w-10 text-muted-foreground"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium">Your Messages</h3>
            <p className="mt-2 text-sm text-muted-foreground">Select a conversation or start a new one</p>
            <Button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white">New Message</Button>
          </div>
        )}
      </div>
    </div>
  )
}
