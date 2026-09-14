import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../../types';

interface LanguagesSectionProps {
  languages: Language[];
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  const sortedLanguages = [...languages].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <section id="bahasa" className="py-12 md:py-16 border-t border-zinc-100 bg-zinc-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3 border border-blue-100">
            <Globe className="w-3.5 h-3.5" />
            <span>Komunikasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mb-2">
            Bahasa (Languages)
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base">
            Tingkat kemahiran komunikasi lisan dan tulisan.
          </p>
        </div>

        {/* PRD 4.6 Mandate: Ditampilkan sebagai teks murni: 'Nama Bahasa — Level'. TANPA progress bar, TANPA rating bintang. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLanguages.map((lang) => (
            <div
              key={lang.id}
              className="px-5 py-4 min-h-[52px] bg-white border border-zinc-200 rounded-xl shadow-2xs flex items-center hover:border-zinc-300 transition-colors"
            >
              <p className="text-base text-zinc-900 font-medium">
                <span className="font-semibold text-zinc-950">{lang.language_name}</span>
                <span className="text-zinc-400 mx-2">—</span>
                <span className="text-blue-700 font-medium">{lang.proficiency_level}</span>
              </p>
            </div>
          ))}

          {sortedLanguages.length === 0 && (
            <p className="text-sm text-zinc-500 italic col-span-full">Belum ada data bahasa yang ditambahkan.</p>
          )}
        </div>
      </div>
    </section>
  );
};
