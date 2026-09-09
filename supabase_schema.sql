-- ==============================================================================
-- PackSURE AI — Complete Supabase Database Schema & Storage Setup
-- Project: Autonomous Legal Metrology & FSSAI Food Safety Compliance System
-- ==============================================================================

-- 1. INSPECTIONS TABLE (All Packaged Commodity Inspections & Scans)
CREATE TABLE IF NOT EXISTS public.inspections (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  timestamp TEXT,
  inspector_name TEXT,
  inspector_designation TEXT,
  inspector_zone TEXT,
  product_name TEXT,
  brand TEXT,
  category TEXT,
  barcode TEXT,
  batch_number TEXT,
  label_image TEXT,
  fields JSONB DEFAULT '[]'::jsonb,
  rule_results JSONB DEFAULT '[]'::jsonb,
  compliance_score INTEGER DEFAULT 0,
  overall_status TEXT,
  officer_notes TEXT,
  is_verified BOOLEAN DEFAULT false,
  verified_at TEXT,
  identity_evidence JSONB,
  online_verification JSONB,
  fssai_results JSONB,
  data_conflicts JSONB
);

-- 2. CONSUMER COMPLAINTS TABLE (Grievance Tracking & Enforcement)
CREATE TABLE IF NOT EXISTS public.complaints (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  timestamp TEXT,
  complainant_name TEXT,
  complainant_contact TEXT,
  product_name TEXT,
  brand TEXT,
  category TEXT,
  store_or_platform TEXT,
  location TEXT,
  violation_type TEXT,
  description TEXT,
  evidence_image TEXT,
  status TEXT DEFAULT 'Pending Investigation',
  priority TEXT DEFAULT 'Medium',
  assigned_officer TEXT,
  action_notes TEXT
);

-- 3. COMMUNITY POSTS & ADVISORIES TABLE (Citizen Vigilance & Alerts)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'Citizen',
  is_verified_citizen BOOLEAN DEFAULT false,
  is_official_post BOOLEAN DEFAULT false,
  location TEXT,
  category TEXT,
  timestamp TEXT,
  content TEXT NOT NULL,
  product_name TEXT,
  brand TEXT,
  evidence_image TEXT,
  upvotes INTEGER DEFAULT 0,
  comments JSONB DEFAULT '[]'::jsonb,
  status_badge TEXT DEFAULT 'Public Discussion'
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allows reading, inserting, and updating data seamlessly from the prototype
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Permissive policies for prototype demonstration (Anon access)
DROP POLICY IF EXISTS "Allow anon read inspections" ON public.inspections;
CREATE POLICY "Allow anon read inspections" ON public.inspections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert inspections" ON public.inspections;
CREATE POLICY "Allow anon insert inspections" ON public.inspections FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update inspections" ON public.inspections;
CREATE POLICY "Allow anon update inspections" ON public.inspections FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon read complaints" ON public.complaints;
CREATE POLICY "Allow anon read complaints" ON public.complaints FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert complaints" ON public.complaints;
CREATE POLICY "Allow anon insert complaints" ON public.complaints FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update complaints" ON public.complaints;
CREATE POLICY "Allow anon update complaints" ON public.complaints FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon read community_posts" ON public.community_posts;
CREATE POLICY "Allow anon read community_posts" ON public.community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert community_posts" ON public.community_posts;
CREATE POLICY "Allow anon insert community_posts" ON public.community_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update community_posts" ON public.community_posts;
CREATE POLICY "Allow anon update community_posts" ON public.community_posts FOR UPDATE USING (true);

-- Enable Realtime publication for instant updates across officers
ALTER PUBLICATION supabase_realtime ADD TABLE public.inspections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;

-- ==============================================================================
-- STORAGE BUCKET CREATION (For Scanned Labels & Grievance Evidence Photos)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence-images', 'evidence-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public access policy
DROP POLICY IF EXISTS "Public Access for Evidence Images" ON storage.objects;
CREATE POLICY "Public Access for Evidence Images" ON storage.objects 
FOR SELECT USING (bucket_id = 'evidence-images');

DROP POLICY IF EXISTS "Allow Upload Evidence Images" ON storage.objects;
CREATE POLICY "Allow Upload Evidence Images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'evidence-images');
