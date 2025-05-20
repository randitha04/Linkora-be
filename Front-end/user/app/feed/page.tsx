import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreatePost } from "@/components/create-post"

export default function FeedPage() {
  // Sample post data
  const posts = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "Stanford University",
      },
      content:
        "Looking for a UI/UX designer to collaborate on a mobile app for campus events. I'm handling the backend development but need someone with a good eye for design!",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Mobile App", "UI/UX", "Design"],
      status: "Find",
      likes: 24,
      comments: 8,
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "MIT",
      },
      content:
        "Just finished my latest music production project! Looking for vocalists and lyricists for future collaborations. Check out my portfolio in bio.",
      tags: ["Music", "Production", "Vocals"],
      status: "Have",
      likes: 42,
      comments: 15,
      timeAgo: "5 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Taylor Reed",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "NYU",
      },
      content:
        "Working on a short film for my final project. Need someone who can help with sound design and possibly original score composition.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Film", "Sound Design", "Music"],
      status: "Find",
      likes: 18,
      comments: 7,
      timeAgo: "1 day ago",
    },
    {
      id: 4,
      user: {
        name: "Jordan Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "UC Berkeley",
      },
      content:
        "I'm a 3D artist looking to join a game development team. Experienced with Blender and Unity. Would love to work on an indie game project!",
      tags: ["Game Dev", "3D Art", "Unity"],
      status: "Have",
      likes: 31,
      comments: 12,
      timeAgo: "2 days ago",
    },
  ]

  return (
    <div className="container py-6 md:py-8">
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Feed</h1>
          </div>
          <CreatePost />
          <div className="mb-6">
            <Tabs defaultValue="all">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="find">Looking For</TabsTrigger>
                <TabsTrigger value="have">Offering</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4 space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
              <TabsContent value="find" className="mt-4 space-y-4">
                {posts
                  .filter((post) => post.status === "Find")
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </TabsContent>
              <TabsContent value="have" className="mt-4 space-y-4">
                {posts
                  .filter((post) => post.status === "Have")
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </TabsContent>
              <TabsContent value="following" className="mt-4 space-y-4">
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <p className="mb-2 text-muted-foreground">You're not following anyone yet</p>
                  <Button variant="outline" size="sm">
                    Discover People
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="mb-4 font-medium">Discover</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
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
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
                Popular
              </Button>
              <Button variant="outline" className="w-full justify-start">
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
                  <path d="M12 2v20"></path>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Trending
              </Button>
              <Button variant="outline" className="w-full justify-start">
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
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                  <path d="M7 2v20"></path>
                  <path d="M21 15V2"></path>
                  <path d="M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"></path>
                </svg>
                Music
              </Button>
              <Button variant="outline" className="w-full justify-start">
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
                  <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
                  <circle cx="17" cy="7" r="5"></circle>
                </svg>
                Design
              </Button>
              <Button variant="outline" className="w-full justify-start">
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
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                </svg>
                Programming
              </Button>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="mb-4 font-medium">Suggested Collaborators</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Riley Kim</p>
                    <p className="text-xs text-muted-foreground">UI/UX Designer</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Follow
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Casey Morgan</p>
                    <p className="text-xs text-muted-foreground">Game Developer</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Follow
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Jordan Lee</p>
                    <p className="text-xs text-muted-foreground">Music Producer</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Follow
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
