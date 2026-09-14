import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';
import { Profile } from '../../types';

interface FooterProps {
  profile: Profile;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onNavigateAdmin }) => {
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
          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
            <span>Website Portofolio Pribadi</span>
            {onNavigateAdmin && (
              <>
                <span className="text-zinc-300">•</span>
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateAdmin();
                  }}
                  className="inline-flex items-center gap-1 text-zinc-400 hover:text-blue-600 transition-colors"
                  title="Akses Login Admin"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </a>
              </>
            )}
          </div>
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
