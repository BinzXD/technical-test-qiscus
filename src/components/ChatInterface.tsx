import React, { useState, useEffect } from "react";
import {
  Search,
  Phone,
  Video,
  Info,
  Send,
  Paperclip,
  Mic,
  Smile,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export default function ChatInterface() {
  const [allResults, setAllResults] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/BinzXD/447ceee5f229e93ec71582cc048a2e2b/raw/2914c3c537c07bcae3fc941cd0c3dbeaf5dcfe20/gistfile1.txt"
    )
      .then((res) => res.json())
      .then((data) => {
        setAllResults(data.results);

        const chatList = data.results.map((item: any) => ({
          id: item.room.id,
          name: item.room.name,
          avatar: item.room.image_url,
          lastMessage: item.comments[item.comments.length - 1],
          memberCount: item.room.participant.length,
          participants: item.room.participant,
        }));

        setChats(chatList);

        if (data.results.length > 0) {
          setSelectedChat(data.results[0].room.id);
          setMessages(data.results[0].comments);
          setGroupMembers(data.results[0].room.participant);
        }
      });
  }, []);

  const handleSelectChat = (chatId: number) => {
    setSelectedChat(chatId);
    const chatRoom = allResults.find((r) => r.room.id === chatId);
    if (chatRoom) {
      setMessages(chatRoom.comments);
      setGroupMembers(chatRoom.room.participant);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg = {
      id: Date.now(),
      sender: "You",
      message: newMessage,
      type: "text",
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  const currentChat = chats.find((c) => c.id === selectedChat);

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b">Semua Pesan</div>
        <ScrollArea className="flex-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`p-4 cursor-pointer hover:bg-accent ${
                selectedChat === chat.id ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate">{chat.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage?.message || chat.lastMessage?.filename}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat && (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentChat.avatar} />
                  <AvatarFallback>{currentChat.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3>{currentChat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {groupMembers.length} Anggota
                  </p>
                </div>
              </div>

              {/* Icon buttons */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 ${
                      msg.sender === "You" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Sender bubble */}
                    {msg.sender !== "You" && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                        {msg.sender[0].toUpperCase()}
                      </div>
                    )}

                    <div>
                      {msg.sender !== "You" && (
                        <div className="text-xs text-gray-500 mb-1">
                          {msg.sender}
                        </div>
                      )}

                      <div
                        className={`rounded-lg p-3 max-w-xs ${
                          msg.sender === "You"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-gray-100 text-black"
                        }`}
                      >
                        {msg.type === "text" && <p>{msg.message}</p>}
                        {msg.type === "image" && (
                          <div>
                            <img
                              src={msg.url}
                              alt={msg.caption}
                              className="rounded-lg mb-1"
                            />
                            {msg.caption && (
                              <p className="text-xs text-gray-600">
                                {msg.caption}
                              </p>
                            )}
                          </div>
                        )}
                        {msg.type === "pdf" && (
                          <a
                            href={msg.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-600"
                          >
                            <FileText className="w-4 h-4" />
                            <span>{msg.filename}</span>
                          </a>
                        )}
                        {msg.type === "video" && (
                          <video
                            src={msg.url}
                            controls
                            className="rounded-lg max-w-full"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Ketik Pesan"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button variant="ghost" size="sm">
                <Smile className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Mic className="w-4 h-4" />
              </Button>
              <Button onClick={handleSendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
