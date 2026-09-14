import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Database,
  FileJson,
  Check,
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getPortfolioData, savePortfolioData } from '../../lib/storage';
import { PortfolioData } from '../../types';

export const KeepaliveMonitor: React.FC = () => {
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [cronSecretInput, setCronSecretInput] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const supabaseSqlSchema = `-- 1. EXTENSION
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABEL-TABEL UTAMA
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

CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

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

CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  institution_name TEXT NOT NULL,
  year_range TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

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

CREATE TABLE IF NOT EXISTS public.languages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  language_name TEXT NOT NULL,
  proficiency_level TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT NOT NULL CHECK (type IN ('whatsapp', 'email', 'instagram', 'linkedin', 'other')),
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Public Read
CREATE POLICY "Public Read Profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public Read Languages" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Public Read Contacts" ON public.contacts FOR SELECT USING (true);

-- Admin Write (Authenticated)
CREATE POLICY "Admin Full Access Profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Courses" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Languages" ON public.languages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. STORAGE BUCKETS (avatars & projects)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true), ('projects', 'projects', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Read Avatars & Projects" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'projects'));
CREATE POLICY "Admin Manage Storage Objects" ON storage.objects FOR ALL TO authenticated USING (bucket_id IN ('avatars', 'projects')) WITH CHECK (bucket_id IN ('avatars', 'projects'));`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const testKeepalive = async () => {
    setTestingEndpoint(true);
    setTestResult(null);

    try {
      const headers: Record<string, string> = {};
      if (cronSecretInput.trim()) {
        headers['Authorization'] = `Bearer ${cronSecretInput.trim()}`;
      }

      const res = await fetch('/api/cron/keepalive', { headers });
      const data = await res.json();
      setTestResult({
        status: res.status,
        ok: res.ok,
        data,
      });
    } catch (err: any) {
      setTestResult({
        status: 500,
        ok: false,
        error: err?.message || 'Gagal menghubungi endpoint',
      });
    } finally {
      setTestingEndpoint(false);
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const data = getPortfolioData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupSuccess('File backup JSON berhasil diunduh!');
    setTimeout(() => setBackupSuccess(null), 3500);
  };

  // Import JSON Backup
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as PortfolioData;
        if (!parsed.profile || !parsed.projects || !parsed.skills) {
          throw new Error('Format file JSON tidak sesuai dengan skema portofolio.');
        }

        savePortfolioData(parsed);
        setBackupSuccess('Data portofolio berhasil dipulihkan dari cadangan!');
        setTimeout(() => setBackupSuccess(null), 3500);
      } catch (err: any) {
        setImportError(err.message || 'Gagal membaca file backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* 1. Status Supabase & Keepalive */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-2xs">
        <div className="border-b border-zinc-200 pb-5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-2 border border-blue-100">
            <Activity className="w-3.5 h-3.5" />
            <span>PRD Bagian 9 & 10</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900">
            Keep-Alive Cron & Status Sistem (Vercel + Supabase)
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Pantau mekanisme keep-alive pencegah pause otomatis Supabase Free Tier melalui endpoint{' '}
            <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm font-mono text-zinc-800">
              /api/cron/keepalive
            </code>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Koneksi Supabase */}
          <div className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/50">
            <h3 className="font-semibold text-zinc-900 text-sm mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Status Koneksi Supabase</span>
            </h3>

            {isSupabaseConfigured ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Kredensial Supabase Terkonfigurasi</span>
                </div>
                <p className="text-xs text-zinc-600">
                  Data profil dan media tersinkronisasi dengan database PostgreSQL dan Storage Supabase.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-800 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>Mode Penyimpanan Lokal & Server Aktif</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Aplikasi berfungsi penuh dengan penyimpanan persistent browser + Express API cache. Untuk
                  menghubungkan project Supabase produksi, cantumkan{' '}
                  <code className="font-mono text-zinc-800">VITE_SUPABASE_URL</code> dan{' '}
                  <code className="font-mono text-zinc-800">VITE_SUPABASE_ANON_KEY</code> di Environment Secrets.
                </p>
              </div>
            )}
          </div>

          {/* Konfigurasi Keepalive Cron */}
          <div className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/50">
            <h3 className="font-semibold text-zinc-900 text-sm mb-2">Jadwal Vercel Cron (PRD 9.2)</h3>
            <div className="bg-white border border-zinc-200 rounded-xl p-3 font-mono text-xs text-zinc-800 space-y-1 mb-2">
              <div className="text-zinc-500">// vercel.json</div>
              <div>
                <span className="text-blue-600">"path"</span>: "/api/cron/keepalive",
              </div>
              <div>
                <span className="text-blue-600">"schedule"</span>: "0 1 * * *" // 01:00 UTC (08:00 WIB)
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Endpoint menjalankan query SELECT ringan tanpa modifikasi data untuk menjaga project Supabase tetap aktif.
            </p>
          </div>
        </div>

        {/* Live Test Endpoint Keep-Alive */}
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <h3 className="font-semibold text-sm text-zinc-900 mb-2">
            Uji Coba Manual Endpoint Keepalive (/api/cron/keepalive)
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Masukkan <code className="font-mono text-zinc-800">CRON_SECRET</code> jika Anda telah mengaturnya di environment, lalu klik "Jalankan Uji Coba".
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={cronSecretInput}
              onChange={(e) => setCronSecretInput(e.target.value)}
              placeholder="Authorization Secret (Opsional jika belum diset)"
              className="flex-1 px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="button"
              disabled={testingEndpoint}
              onClick={testKeepalive}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testingEndpoint ? 'animate-spin' : ''}`} />
              <span>{testingEndpoint ? 'Menguji...' : 'Jalankan Uji Coba'}</span>
            </button>
          </div>

          {testResult && (
            <div className="mt-4 p-4 rounded-xl border border-zinc-300 bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-zinc-400">
                <span>Response Status: {testResult.status}</span>
                <span className={testResult.ok ? 'text-emerald-400' : 'text-red-400'}>
                  {testResult.ok ? 'SUCCESS (200 OK)' : 'ERROR / UNAUTHORIZED'}
                </span>
              </div>
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      {/* 2. Schema Supabase & Panduan Setup SQL */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-2xs">
        <div className="border-b border-zinc-200 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Skema Database Supabase (SQL Schema)</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Tabel <code className="font-mono text-zinc-800">profile</code>, <code className="font-mono text-zinc-800">skills</code>, <code className="font-mono text-zinc-800">projects</code>, <code className="font-mono text-zinc-800">experiences</code>, <code className="font-mono text-zinc-800">courses</code>, <code className="font-mono text-zinc-800">languages</code>, <code className="font-mono text-zinc-800">contacts</code> & Storage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copySqlToClipboard}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm inline-flex items-center gap-2 shadow-2xs transition-colors"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Database className="w-4 h-4" />}
              <span>{copiedSql ? 'Skrip SQL Disalin!' : 'Salin Skrip SQL Lengkap'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSqlViewer(!showSqlViewer)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-medium text-xs sm:text-sm transition-colors"
            >
              {showSqlViewer ? 'Sembunyikan SQL' : 'Lihat Skrip SQL'}
            </button>
          </div>
        </div>

        {/* Petunjuk Langkah Demi Langkah */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs text-zinc-600">
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="font-bold text-blue-600 block mb-1">1. Jalankan di SQL Editor</span>
            Buka Supabase Dashboard &gt; SQL Editor &gt; New Query &gt; Tempel skrip ini &gt; Klik "RUN".
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="font-bold text-blue-600 block mb-1">2. Buat Akun Admin</span>
            Masuk ke menu Authentication &gt; Users &gt; "Add User" untuk membuat email &amp; password login Anda.
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="font-bold text-blue-600 block mb-1">3. Salin API Keys</span>
            Buka Project Settings &gt; API, salin URL dan anon key ke file <code className="font-mono text-zinc-800">.env</code> Anda.
          </div>
        </div>

        {showSqlViewer && (
          <div className="relative mt-3 rounded-xl border border-zinc-300 bg-zinc-950 text-zinc-200 font-mono text-xs overflow-hidden">
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400">supabase-schema.sql</span>
              <button
                type="button"
                onClick={copySqlToClipboard}
                className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
              >
                {copiedSql ? '✓ Disalin' : 'Salin Semua'}
              </button>
            </div>
            <pre className="p-4 max-h-72 overflow-y-auto overflow-x-auto text-[11px] leading-relaxed">
              {supabaseSqlSchema}
            </pre>
          </div>
        )}
      </div>

      {/* 3. Fitur Baru: Backup & Restore Data Portofolio (JSON) */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-2xs">
        <div className="border-b border-zinc-200 pb-4 mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
              <FileJson className="w-5 h-5 text-blue-600" />
              <span>Cadangan Data Portofolio (Backup & Restore)</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Ekspor seluruh data profil, karya, keahlian, dan riwayat ke dalam file JSON atau pulihkan data dari cadangan sebelumnya.
            </p>
          </div>
        </div>

        {backupSuccess && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{backupSuccess}</span>
          </div>
        )}

        {importError && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleExportBackup}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm inline-flex items-center justify-center gap-2 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan Data (JSON)</span>
          </button>

          <label className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 font-medium text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs">
            <Upload className="w-4 h-4 text-zinc-500" />
            <span>Pulihkan Cadangan (Unggah JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
