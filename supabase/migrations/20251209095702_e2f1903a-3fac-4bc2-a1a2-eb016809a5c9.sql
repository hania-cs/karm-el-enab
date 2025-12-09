-- Create chat/support tickets table for farmer-admin communication
CREATE TABLE public.support_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'pending')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create messages table for ticket conversations
CREATE TABLE public.ticket_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for support_tickets
CREATE POLICY "Farmers can view their own tickets"
ON public.support_tickets FOR SELECT
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can create tickets"
ON public.support_tickets FOR INSERT
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own tickets"
ON public.support_tickets FOR UPDATE
USING (auth.uid() = farmer_id);

CREATE POLICY "Admins can view all tickets"
ON public.support_tickets FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all tickets"
ON public.support_tickets FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for ticket_messages
CREATE POLICY "Users can view messages in their tickets"
ON public.ticket_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE id = ticket_id
    AND (farmer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Users can send messages to their tickets"
ON public.ticket_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE id = ticket_id
    AND (farmer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Users can update their own messages"
ON public.ticket_messages FOR UPDATE
USING (auth.uid() = sender_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;

-- Add trigger for updated_at on support_tickets
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();