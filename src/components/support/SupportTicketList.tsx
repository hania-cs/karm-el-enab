import { useState } from "react";
import { SupportTicket } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus } from "lucide-react";
import { format } from "date-fns";

interface SupportTicketListProps {
  tickets: SupportTicket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticket: SupportTicket) => void;
  onNewTicket: () => void;
  isAdmin?: boolean;
}

export function SupportTicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onNewTicket,
  isAdmin = false,
}: SupportTicketListProps) {
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
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-heading font-semibold">Support Tickets</h3>
        {!isAdmin && (
          <Button size="sm" onClick={onNewTicket} className="gap-1">
            <Plus className="h-4 w-4" />
            New
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tickets yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                  selectedTicketId === ticket.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{ticket.subject}</p>
                    {isAdmin && ticket.profiles && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        From: {ticket.profiles.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(ticket.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
