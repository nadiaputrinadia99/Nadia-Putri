-- ==============================================================================
-- SUPABASE SCHEMA & DATABASE SETUP UNTUK WEBSITE PORTOFOLIO PRIBADI
-- Sesuai Dokumen Kebutuhan PRD (Bab 6, 7, 9, dan 10)
-- ==============================================================================
-- Cara Menggunakan:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Masuk ke menu "SQL Editor"
-- 3. Buat "New Query", paste seluruh isi skrip SQL ini, lalu klik "RUN"
-- ==============================================================================

-- 1. AKTIFKAN EXTENSION UUID (jika belum aktif)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. PEMBUATAN TABEL-TABEL UTAMA
-- ==============================================================================

-- A. TABEL PROFILE (Data Profil Pemilik Portofolio)
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  short_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Terbuka untuk Kolaborasi',
  avatar_url TEXT NOT NULL,
  resume_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- B. TABEL SKILLS (Daftar Keahlian / Kompetensi)
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- C. TABEL PROJECTS (Project & Karya Portofolio)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  external_url TEXT,
  project_link TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- D. TABEL EXPERIENCES (Pengalaman Kerja / Pengabdian)
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  institution_name TEXT NOT NULL,
  year_range TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- E. TABEL COURSES (Course & Training - Bagian Terpisah)
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_name TEXT NOT NULL,
  organizer TEXT NOT NULL,
  year TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- F. TABEL LANGUAGES (Kemahiran Bahasa - Format Teks)
CREATE TABLE IF NOT EXISTS public.languages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  language_name TEXT NOT NULL,
  proficiency_level TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- G. TABEL CONTACTS (Kanal Komunikasi WhatsApp, Email, Instagram, LinkedIn)
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT NOT NULL CHECK (type IN ('whatsapp', 'email', 'instagram', 'linkedin', 'other')),
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. KONFIGURASI ROW LEVEL SECURITY (RLS)
-- Publik dapat membaca seluruh data (SELECT) tanpa login
-- Admin (authenticated) memiliki akses penuh (INSERT, UPDATE, DELETE)
-- ==============================================================================

-- Aktifkan RLS di setiap tabel
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Kebijakan SELECT (Halaman Publik Tanpa Login)
DROP POLICY IF EXISTS "Public Read Profile" ON public.profile;
CREATE POLICY "Public Read Profile" ON public.profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
CREATE POLICY "Public Read Experiences" ON public.experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Courses" ON public.courses;
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Languages" ON public.languages;
CREATE POLICY "Public Read Languages" ON public.languages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Contacts" ON public.contacts;
CREATE POLICY "Public Read Contacts" ON public.contacts FOR SELECT USING (true);

-- Kebijakan CRUD Admin (User Terautentikasi / Logged In)
DROP POLICY IF EXISTS "Admin Full Access Profile" ON public.profile;
CREATE POLICY "Admin Full Access Profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Skills" ON public.skills;
CREATE POLICY "Admin Full Access Skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Projects" ON public.projects;
CREATE POLICY "Admin Full Access Projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Experiences" ON public.experiences;
CREATE POLICY "Admin Full Access Experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Courses" ON public.courses;
CREATE POLICY "Admin Full Access Courses" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Languages" ON public.languages;
CREATE POLICY "Admin Full Access Languages" ON public.languages FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Contacts" ON public.contacts;
CREATE POLICY "Admin Full Access Contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 4. KONFIGURASI SUPABASE STORAGE BUCKETS (avatars & projects)
-- Sesuai PRD Bab 8: Bucket dibuat publik untuk gambar, upload dibatasi untuk admin
-- ==============================================================================

-- Buat bucket penyimpanan (jika belum ada)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('projects', 'projects', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Kebijakan Akses Storage Objects
DROP POLICY IF EXISTS "Public Read Avatars & Projects" ON storage.objects;
CREATE POLICY "Public Read Avatars & Projects" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'projects'));

DROP POLICY IF EXISTS "Admin Manage Storage Objects" ON storage.objects;
CREATE POLICY "Admin Manage Storage Objects" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id IN ('avatars', 'projects'))
  WITH CHECK (bucket_id IN ('avatars', 'projects'));

-- ==============================================================================
-- 5. SEED DATA AWAL (Data Awal Sesuai PRD)
-- ==============================================================================

-- Profil
INSERT INTO public.profile (id, name, tagline, short_description, status, avatar_url, resume_url)
VALUES (
  'default',
  'Rania Salsabila',
  'Creative Lead & Visual Storyteller',
  'Berpengalaman lebih dari 5 tahun dalam mengelola strategi visual, kampanye digital terintegrasi, dan perancangan brand identity yang berdampak luas bagi komunitas dan industri.',
  'Terbuka untuk Kolaborasi',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://drive.google.com'
)
ON CONFLICT (id) DO NOTHING;

-- Keahlian (Skills)
INSERT INTO public.skills (name, sort_order) VALUES
  ('Brand Identity Strategy', 1),
  ('Creative Direction', 2),
  ('Digital Campaign Strategy', 3),
  ('UI/UX & Web Design', 4),
  ('Content Production & Storytelling', 5),
  ('Figma & Prototyping', 6),
  ('Adobe Creative Cloud', 7),
  ('Editorial & Layout Design', 8),
  ('Public Speaking & Workshop', 9),
  ('Project Management', 10)
ON CONFLICT DO NOTHING;

-- Project & Portofolio
INSERT INTO public.projects (title, category, description, image_url, external_url, project_link, sort_order) VALUES
  (
    'Rebranding Visual Identitas Lestari Co.',
    'Brand Identity & Packaging',
    'Pengembangan brand identity komprehensif mencakup panduan tipografi, palet warna, packaging ramah lingkungan, dan aset promosi digital.',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1000&q=80',
    NULL,
    'https://behance.net',
    1
  ),
  (
    'Kampanye Edukasi Publik Literasi Digital 2024',
    'Digital Campaign & Strategy',
    'Perancangan materi infografis, video campaign, serta strategi distribusi media sosial yang menjangkau lebih dari 150.000 audiens nasional.',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    NULL,
    'https://example.com/kampanye-literasi',
    2
  ),
  (
    'Audio Dokumenter "Kisah Pengrajin Nusantara"',
    'Audio Storytelling & Dokumenter',
    'Penyutradaraan narasi dan audio storytelling mendokumentasikan kearifan lokal penenun tradisional di berbagai pelosok Indonesia.',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
    'https://drive.google.com',
    'https://drive.google.com',
    3
  ),
  (
    'Buku Panduan & Desain Laporan CSR Berdaya',
    'Editorial & Publikasi CSR',
    'Tata letak editorial, kurasi data infografis, dan desain cetak laporan tahunan program tanggung jawab sosial perusahaan.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    NULL,
    'https://issuu.com',
    4
  )
ON CONFLICT DO NOTHING;

-- Pengalaman Kerja (Experiences)
INSERT INTO public.experiences (institution_name, year_range, location, description, sort_order) VALUES
  (
    'Creative Studio Nusantara',
    '2022 — Sekarang',
    'Jakarta, Indonesia',
    'Memimpin strategi visual dan tata kelola kreatif untuk lebih dari 20 klien enterprise lintas industri; mengkoordinasikan desainer, videografer, dan tim copywriter.',
    1
  ),
  (
    'Inisiatif Kolektif Kreasi',
    '2020 — 2022',
    'Bandung, Indonesia',
    'Mengelola perancangan brand, media sosial terpadu, dan eksekusi event pameran seni kolaboratif dengan keterlibatan lebih dari 5.000 partisipan.',
    2
  ),
  (
    'Yayasan Inovasi Muda Indonesia',
    '2018 — 2020',
    'Yogyakarta, Indonesia',
    'Menyusun identitas visual yayasan, infografis advokasi kebijakan publik, dan panduan komunikasi program sosial berkelanjutan.',
    3
  )
ON CONFLICT DO NOTHING;

-- Course & Training (Pelatihan Terpisah)
INSERT INTO public.courses (course_name, organizer, year, location, description, sort_order) VALUES
  (
    'Advanced Brand Identity & Systems',
    'International Design Institute',
    '2023',
    'Daring (Online)',
    'Studi intensif tentang perancangan modular design tokens, typography scale, dan sistem identitas merek skala global.',
    1
  ),
  (
    'Strategic Communications & Storytelling',
    'Creative Leadership Academy',
    '2022',
    'Jakarta, Indonesia',
    'Pendalaman metodologi riset audiens, narasi advokasi sosial, dan strategi komunikasi berbasis empati untuk kampanye publik.',
    2
  )
ON CONFLICT DO NOTHING;

-- Bahasa (Languages - Format Teks)
INSERT INTO public.languages (language_name, proficiency_level, sort_order) VALUES
  ('Bahasa Indonesia', 'Native', 1),
  ('English', 'Professional Working', 2),
  ('Japanese', 'Intermediate (Conversational)', 3)
ON CONFLICT DO NOTHING;

-- Kontak (Contacts)
INSERT INTO public.contacts (type, value) VALUES
  ('whatsapp', '6281234567890'),
  ('email', 'rania.salsabila@example.com'),
  ('instagram', '@raniasalsa'),
  ('linkedin', 'https://linkedin.com/in/raniasalsabila')
ON CONFLICT DO NOTHING;
