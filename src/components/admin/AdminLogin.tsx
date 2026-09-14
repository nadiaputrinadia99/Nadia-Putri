import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { setAdminSession } from '../../lib/storage';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLocalBypass, setShowLocalBypass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Email dan password wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      let loginSuccess = false;

      // 1. Try client-side Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (!error && data?.session) {
            loginSuccess = true;
          } else if (error) {
            // If it's explicitly invalid credentials, throw with clear message
            if (error.message.toLowerCase().includes('invalid login credentials')) {
              throw new Error('Email atau password salah. Pastikan akun user telah dibuat di Supabase (menu Authentication > Users).');
            }
            // For other client errors (like Failed to fetch/CORS), proceed to backend proxy fallback
            console.warn('Client Supabase auth failed, trying server proxy:', error.message);
          }
        } catch (clientErr: any) {
          console.warn('Client supabase sign-in error:', clientErr?.message);
        }
      }

      // 2. If client-side failed or wasn't decisive, try the server-side proxy
      if (!loginSuccess) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), password }),
          });

          const resData = await res.json();

          if (res.ok && resData.success) {
            loginSuccess = true;
          } else {
            // Show meaningful error from server
            const errMsg = resData.error || 'Gagal masuk. Periksa email dan password.';
            setErrorMessage(errMsg);
            setShowLocalBypass(true);
            setIsLoading(false);
            return;
          }
        } catch (proxyErr: any) {
          console.warn('Server proxy auth error:', proxyErr);
          // If network is completely unreachable, give clear feedback and allow bypass
          setErrorMessage(
            'Koneksi ke Supabase terhambat oleh jaringan atau browser. Anda dapat masuk langsung menggunakan Mode Admin Lokal di bawah ini.'
          );
          setShowLocalBypass(true);
          setIsLoading(false);
          return;
        }
      }

      if (loginSuccess) {
        setAdminSession(true);
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Gagal masuk. Periksa kembali email dan password yang Anda masukkan.'
      );
      setShowLocalBypass(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalBypassLogin = () => {
    setAdminSession(true);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Login Admin Portofolio
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Akses dashboard terproteksi untuk mengelola seluruh konten website
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-zinc-200 sm:rounded-2xl sm:px-10">
          
          {/* Status info */}
          <div className="mb-6 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-800">
                {isSupabaseConfigured
                  ? 'Supabase Terhubung'
                  : 'Mode Manajemen Portofolio'}
              </p>
              <p className="mt-0.5 leading-normal">
                {isSupabaseConfigured
                  ? 'Kredensial Supabase aktif. Masuk dengan akun yang telah dibuat di Supabase Auth.'
                  : 'Masukkan email dan password untuk mengelola portofolio.'}
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portofolio.id"
                  className="w-full pl-10 pr-4 py-2.5 min-h-[44px] text-sm border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 min-h-[44px] text-sm border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Opsi Darurat / Bypass Masuk Mode Lokal jika belum ada user di Supabase */}
          {showLocalBypass && (
            <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2.5">
              <div className="flex items-center gap-2 font-semibold">
                <KeyRound className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Belum membuat akun di Supabase Auth?</span>
              </div>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                Jika Anda belum menambahkan akun di menu <b>Authentication &gt; Users</b> pada Supabase Dashboard, Anda tetap dapat mengelola portofolio dengan Mode Lokal:
              </p>
              <button
                type="button"
                onClick={handleLocalBypassLogin}
                className="w-full min-h-[44px] py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Masuk Sekarang (Mode Admin Langsung)</span>
              </button>
            </div>
          )}

          {/* Tombol kembali ke halaman publik */}
          <div className="mt-6 pt-5 border-t border-zinc-200 text-center">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-600 hover:text-blue-600 min-h-[44px] px-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Publik</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
