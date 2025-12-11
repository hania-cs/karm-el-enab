-- Drop the restrictive farmer insert policy
DROP POLICY IF EXISTS "Farmers can create tickets" ON public.support_tickets;

-- Create a permissive farmer insert policy
CREATE POLICY "Farmers can create tickets" 
ON public.support_tickets 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = farmer_id);

-- Also fix ticket_messages insert policy
DROP POLICY IF EXISTS "Users can send messages to their tickets" ON public.ticket_messages;

CREATE POLICY "Users can send messages to their tickets" 
ON public.ticket_messages 
FOR INSERT 
TO authenticated
WITH CHECK (
  (auth.uid() = sender_id) AND 
  (EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = ticket_messages.ticket_id 
    AND (support_tickets.farmer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  ))
);