CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  category TEXT NOT NULL CHECK (category IN ('Maintenance','Electrical','Plumbing','Mess','Cleaning','Internet','Furniture','Other')),
  location TEXT NOT NULL CHECK (length(btrim(location)) > 0),
  description TEXT NOT NULL CHECK (length(btrim(description)) > 0),
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','In Progress','Resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.complaints TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Complaints are publicly readable" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Anyone can submit a complaint" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update a complaint" ON public.complaints FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete a complaint" ON public.complaints FOR DELETE USING (true);

CREATE INDEX complaints_created_at_idx ON public.complaints (created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER complaints_set_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.complaints (title, category, location, description, priority, status, created_at, updated_at) VALUES
('Ceiling fan not working', 'Electrical', 'Block A - Room 204', 'The ceiling fan stopped working two days ago. It makes a humming noise but the blades do not rotate. Room gets very hot in the afternoon.', 'High', 'Open', now() - interval '2 days', now() - interval '2 days'),
('Water leakage near washroom', 'Plumbing', 'Block B - First Floor', 'There is continuous water leakage from the pipe outside the common washroom. The corridor floor stays wet and is slippery.', 'High', 'In Progress', now() - interval '5 days', now() - interval '1 day'),
('Mess food quality issue', 'Mess', 'Main Hostel Mess', 'Dinner has been served cold for the past week and the dal is watery. Requesting the mess committee to review the evening menu and serving times.', 'Medium', 'Resolved', now() - interval '12 days', now() - interval '6 days'),
('Wi-Fi disconnects frequently at night', 'Internet', 'Block C - Second Floor', 'The Wi-Fi drops every few minutes after 10 PM. Difficult to attend online classes and submit assignments.', 'Medium', 'Open', now() - interval '1 day', now() - interval '1 day'),
('Broken study chair', 'Furniture', 'Block A - Room 118', 'One leg of the study chair is cracked and it wobbles badly. Needs repair or replacement.', 'Low', 'In Progress', now() - interval '4 days', now() - interval '2 days'),
('Corridor not cleaned regularly', 'Cleaning', 'Block B - Ground Floor', 'The corridor and staircase have not been swept for several days. Dust and wrappers are collecting near the entrance.', 'Low', 'Open', now() - interval '3 days', now() - interval '3 days');