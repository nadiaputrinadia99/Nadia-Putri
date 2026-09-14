import React, { useState } from 'react';
import { FileText, ArrowRight, Mail, Share2, Check } from 'lucide-react';
import { Profile } from '../../types';

interface HeroSectionProps {
  profile: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyPortfolioLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Helper to highlight first word/name in blue or accent as requested in PRD 4.1
  const renderStyledName = (fullName: string) => {
    const words = fullName.trim().split(' ');
    if (words.length <= 1) {
      return <span className="text-blue-600">{fullName}</span>;
    }
    const firstName = words[0];
    const restOfName = words.slice(1).join(' ');
    return (
      <>
        <span className="text-blue-600">{firstName}</span> {restOfName}
      </>
    );
  };

  return (
    <section id="tentang" className="pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop 2-column grid, Mobile single-column stack */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Kolom Kiri: Foto Profil (1:1 ratio, rounded-2xl) + Status Label */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start order-1">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 shadow-md border-4 border-white rounded-2xl overflow-hidden bg-zinc-100">
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image link fails
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            {/* Label Status di bawah foto: dot indikator + teks */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs sm:text-sm font-medium text-zinc-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{profile.status || 'Terbuka untuk Kolaborasi'}</span>
            </div>
          </div>

          {/* Kolom Kanan: Konten Teks & Tombol Aksi */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left order-2">
            
            {/* 1. Badge kecil "Portofolio Profesional" */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-100 mb-4">
              Portofolio Profesional
            </div>

            {/* 2. Nama — text-4xl s.d. text-6xl responsif, nama utama berwarna biru */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.15] mb-3">
              {renderStyledName(profile.name)}
            </h1>

            {/* 3. Tagline / jabatan */}
            <p className="text-lg sm:text-xl font-medium text-zinc-700 mb-4">
              {profile.tagline}
            </p>

            {/* 4. Deskripsi singkat (2–3 kalimat) */}
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mb-8">
              {profile.short_description}
            </p>

            {/* 5. Tombol Aksi: Touch-friendly (min 44px tap targets) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              
              {/* Primary: Hubungi Saya (Biru solid) */}
              <button
                type="button"
                onClick={() => scrollToSection('#kontak')}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Hubungi Saya</span>
              </button>

              {/* Secondary/Outline: Lihat Project (Scroll ke section project) */}
              <button
                type="button"
                onClick={() => scrollToSection('#project')}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-800 font-medium border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400 active:bg-zinc-100 transition-all"
              >
                <span>Lihat Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Third: Resume — Conditional Rendering! HANYA muncul jika resume_url terisi */}
              {profile.resume_url && profile.resume_url.trim() !== '' ? (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 active:bg-zinc-300 transition-all"
                >
                  <FileText className="w-4 h-4 text-zinc-500" />
                  <span>Resume</span>
                </a>
              ) : null}

              {/* Share / Copy link button */}
              <button
                type="button"
                onClick={copyPortfolioLink}
                title="Salin tautan portofolio untuk dibagikan"
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-zinc-600 hover:text-blue-600 hover:bg-blue-50/70 border border-transparent hover:border-blue-200 transition-all text-sm font-medium"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Tautan Disalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-zinc-500" />
                    <span>Bagikan</span>
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
