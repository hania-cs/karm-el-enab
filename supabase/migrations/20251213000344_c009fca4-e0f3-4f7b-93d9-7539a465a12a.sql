-- Create plot_requests table for farmers to request new plots
CREATE TABLE public.plot_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_plot_name TEXT NOT NULL,
  requested_area DECIMAL(10,2) NOT NULL,
  notes TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plot_requests ENABLE ROW LEVEL SECURITY;

-- Add update trigger
CREATE TRIGGER update_plot_requests_updated_at 
  BEFORE UPDATE ON public.plot_requests 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
CREATE POLICY "Farmers can view their own plot requests" 
  ON public.plot_requests FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Farmers can create plot requests" 
  ON public.plot_requests FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all plot requests" 
  ON public.plot_requests FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all plot requests" 
  ON public.plot_requests FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));