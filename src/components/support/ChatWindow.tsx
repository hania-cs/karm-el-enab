import { useEffect, useRef, useState } from "react";
import { SupportTicket, TicketMessage, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Send, CheckCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface ChatWindowProps {
  ticket: SupportTicket | null;
  messages: TicketMessage[];
  onSendMessage: (message: string) => Promise<void>;
  onResolveTicket?: () => Promise<void>;
  isAdmin?: boolean;
}

export function ChatWindow({
  ticket,
  messages,
  onSendMessage,
  onResolveTicket,
  isAdmin = false,
}: ChatWindowProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Select a ticket to view the conversation</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold">{ticket.subject}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Created {format(new Date(ticket.created_at), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
        </div>
        {isAdmin && ticket.status !== "resolved" && onResolveTicket && (
          <Button size="sm" variant="outline" onClick={onResolveTicket} className="gap-1">
            <CheckCircle className="h-4 w-4" />
            Mark Resolved
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isOwnMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {!isOwnMessage && msg.profiles && (
                    <p className="text-xs font-medium mb-1 opacity-70">
                      {msg.profiles.name}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {format(new Date(msg.created_at), "h:mm a")}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {ticket.status !== "resolved" && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
            />
            <Button onClick={handleSend} disabled={!newMessage.trim() || isSending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
