import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read env variables (supporting both Vite and Next.js style env naming)
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};

const rawUrl =
  metaEnv?.VITE_SUPABASE_URL ||
  metaEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const rawKey =
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  metaEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

let client: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    client = null;
  }
}

export const supabase = client;
