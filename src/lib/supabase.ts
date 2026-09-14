import { createClient } from '@supabase/supabase-js';

// Read env variables (supporting both Vite and Next.js style env naming)
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};

const supabaseUrl =
  metaEnv?.VITE_SUPABASE_URL ||
  metaEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  metaEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim().length > 0 &&
  supabaseAnonKey.trim().length > 0
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
