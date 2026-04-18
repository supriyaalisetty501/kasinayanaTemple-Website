
-- App roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated-at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Settings (timings, map, donation numbers, about content - all bilingual)
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admins can write settings" ON public.settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Events (bilingual)
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_te TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_te TEXT,
  description_en TEXT,
  event_date DATE,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published events" ON public.events FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Gallery
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption_te TEXT,
  caption_en TEXT,
  category TEXT NOT NULL DEFAULT 'temple',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery" ON public.gallery FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for gallery uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public can view gallery files" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admins can upload gallery files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update gallery files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gallery files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

-- Seed default settings
INSERT INTO public.settings (key, value) VALUES
('timings', '{"morning_open":"5:30 AM","morning_close":"12:00 PM","evening_open":"4:00 PM","evening_close":"8:30 PM","pooja_morning":"6:00 AM","pooja_evening":"6:30 PM"}'::jsonb),
('map', '{"embed_url":"https://www.google.com/maps?q=Chowduru+Andhra+Pradesh&output=embed","address_te":"కాశినాయన ఆశ్రమం, చౌడూరు గ్రామం","address_en":"Kasinayana Ashramam, Chowduru Village"}'::jsonb),
('donation', '{"phone1":"9160603071","phone2":"9000946770"}'::jsonb),
('about', '{"birthplace_te":"","birthplace_en":"","story_te":"పూజ్య శ్రీ కాశినాయన స్వామి వారు భక్తి, సేవ మరియు ఆధ్యాత్మికతకు ప్రతీకగా నిలిచారు. ఆయన జీవితం పేదలకు అన్నదానం, ఆధ్యాత్మిక మార్గదర్శనం మరియు సమాజ సేవలో గడిపారు. ఆయన బోధనలు సత్యం, ధర్మం, దయ అనే మూల సూత్రాలపై ఆధారపడి ఉన్నాయి.","story_en":"Sri Kasinayana Swamy lived a life dedicated to devotion, service, and spiritual upliftment. Through Annadhanam (food donation), spiritual guidance, and care for the poor, the Swamy became a guiding light for the people of Chowduru and surrounding villages. The Swamy''s teachings emphasize truth, righteousness, and compassion."}'::jsonb)
ON CONFLICT (key) DO NOTHING;
