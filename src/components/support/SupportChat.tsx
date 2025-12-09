import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SupportTicket, TicketMessage } from "@/types";
import { SupportTicketList } from "./SupportTicketList";
import { ChatWindow } from "./ChatWindow";
import { NewTicketModal } from "./NewTicketModal";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface SupportChatProps {
  isAdmin?: boolean;
}

export function SupportChat({ isAdmin = false }: SupportChatProps) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tickets
  const fetchTickets = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from("support_tickets")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!isAdmin) {
        query = query.eq("farmer_id", user.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch profiles for admin view
      if (isAdmin && data && data.length > 0) {
        const farmerIds = [...new Set(data.map((t) => t.farmer_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .in("id", farmerIds);

        const ticketsWithProfiles = data.map((ticket) => ({
          ...ticket,
          profiles: profiles?.find((p) => p.id === ticket.farmer_id),
        }));
        setTickets(ticketsWithProfiles as SupportTicket[]);
      } else {
        setTickets((data as SupportTicket[]) || []);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for selected ticket
  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch sender profiles
      if (data && data.length > 0) {
        const senderIds = [...new Set(data.map((m) => m.sender_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .in("id", senderIds);

        const messagesWithProfiles = data.map((msg) => ({
          ...msg,
          profiles: profiles?.find((p) => p.id === msg.sender_id),
        }));
        setMessages(messagesWithProfiles as TicketMessage[]);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user, isAdmin]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!selectedTicket) return;

    const channel = supabase
      .channel(`ticket-${selectedTicket.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ticket_messages",
          filter: `ticket_id=eq.${selectedTicket.id}`,
        },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", payload.new.sender_id)
            .maybeSingle();

          const newMessage = {
            ...payload.new,
            profiles: profile,
          } as TicketMessage;

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTicket]);

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleNewTicket = async (subject: string, message: string) => {
    if (!user) return;

    try {
      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from("support_tickets")
        .insert({
          farmer_id: user.id,
          subject,
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Add initial message
      const { error: messageError } = await supabase
        .from("ticket_messages")
        .insert({
          ticket_id: ticket.id,
          sender_id: user.id,
          message,
        });

      if (messageError) throw messageError;

      toast.success("Request submitted successfully");
      fetchTickets();
      setSelectedTicket(ticket as SupportTicket);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to submit request");
      throw error;
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!user || !selectedTicket) return;

    const { error } = await supabase.from("ticket_messages").insert({
      ticket_id: selectedTicket.id,
      sender_id: user.id,
      message,
    });

    if (error) throw error;

    // Update ticket status if admin is responding
    if (isAdmin && selectedTicket.status === "open") {
      await supabase
        .from("support_tickets")
        .update({ status: "pending" })
        .eq("id", selectedTicket.id);
      
      setSelectedTicket({ ...selectedTicket, status: "pending" });
      fetchTickets();
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket) return;

    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: "resolved" })
        .eq("id", selectedTicket.id);

      if (error) throw error;

      setSelectedTicket({ ...selectedTicket, status: "resolved" });
      toast.success("Ticket marked as resolved");
      fetchTickets();
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast.error("Failed to resolve ticket");
    }
  };

  return (
    <Card className="h-[500px] flex overflow-hidden">
      <div className="w-80 border-r flex-shrink-0">
        <SupportTicketList
          tickets={tickets}
          selectedTicketId={selectedTicket?.id || null}
          onSelectTicket={handleSelectTicket}
          onNewTicket={() => setNewTicketModalOpen(true)}
          isAdmin={isAdmin}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatWindow
          ticket={selectedTicket}
          messages={messages}
          onSendMessage={handleSendMessage}
          onResolveTicket={isAdmin ? handleResolveTicket : undefined}
          isAdmin={isAdmin}
        />
      </div>

      <NewTicketModal
        open={newTicketModalOpen}
        onClose={() => setNewTicketModalOpen(false)}
        onSubmit={handleNewTicket}
      />
    </Card>
  );
}
