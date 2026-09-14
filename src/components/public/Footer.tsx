import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Profile } from '../../types';

interface FooterProps {
  profile: Profile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-200 bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-800">
            © {new Date().getFullYear()} {profile.name}. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Website Portofolio Pribadi — Dirancang secara profesional, minimalis, dan elegan.
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="min-h-[44px] min-w-[44px] px-3.5 py-2 inline-flex items-center gap-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-blue-600 hover:bg-zinc-100 transition-colors border border-zinc-200"
          aria-label="Kembali ke atas"
        >
          <span>Kembali ke atas</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
