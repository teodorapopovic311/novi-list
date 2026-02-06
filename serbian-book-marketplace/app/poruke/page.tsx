"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import { mockConversations, mockUsers } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, ArrowLeft, Book } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
  const { user } = useApp()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockConversations)

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-serif text-2xl text-foreground mb-2">Prijavite se za poruke</h1>
        <p className="text-muted-foreground mb-6">
          Morate biti prijavljeni da biste pristupili porukama.
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/prijava">Prijavi se</Link>
        </Button>
      </div>
    )
  }

  const userConversations = messages.filter(
    (c) => c.buyerId === user.id || c.sellerId === user.id
  )

  const selectedChat = userConversations.find((c) => c.id === selectedConversation)
  const otherUserId = selectedChat
    ? selectedChat.buyerId === user.id
      ? selectedChat.sellerId
      : selectedChat.buyerId
    : null
  const otherUser = otherUserId ? mockUsers.find((u) => u.id === otherUserId) : null

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    setMessages((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderId: user.id,
                  content: newMessage,
                  timestamp: new Date().toISOString(),
                  read: false,
                },
              ],
            }
          : conv
      )
    )
    setNewMessage("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-foreground mb-6">Poruke</h1>

      <div className="grid md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className={cn("md:col-span-1 bg-card border-border", selectedConversation && "hidden md:block")}>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {userConversations.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nemate poruka</p>
                </div>
              ) : (
                userConversations.map((conversation) => {
                  const isOtherBuyer = conversation.buyerId !== user.id
                  const otherId = isOtherBuyer ? conversation.buyerId : conversation.sellerId
                  const other = mockUsers.find((u) => u.id === otherId)
                  const lastMessage = conversation.messages[conversation.messages.length - 1]
                  const unreadCount = conversation.messages.filter(
                    (m) => m.senderId !== user.id && !m.read
                  ).length

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={cn(
                        "w-full p-4 text-left border-b border-border hover:bg-secondary/50 transition-colors",
                        selectedConversation === conversation.id && "bg-secondary"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={other?.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {other?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground truncate">
                              {other?.name}
                            </span>
                            {unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                            <Book className="w-3 h-3" />
                            {conversation.bookTitle}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {lastMessage?.content}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className={cn("md:col-span-2 bg-card border-border flex flex-col", !selectedConversation && "hidden md:flex")}>
          {selectedChat && otherUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={otherUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {otherUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{otherUser.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Book className="w-3 h-3" />
                    {selectedChat.bookTitle}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedChat.messages.map((message) => {
                    const isMe = message.senderId === user.id
                    return (
                      <div
                        key={message.id}
                        className={cn("flex", isMe ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-4 py-2",
                            isMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          )}
                        >
                          <p>{message.content}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}
                          >
                            {new Date(message.timestamp).toLocaleTimeString("sr-Latn", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Napišite poruku..."
                    className="flex-1 bg-background border-border"
                  />
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Izaberite konverzaciju</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
