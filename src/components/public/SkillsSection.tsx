import React from 'react';
import { Skill } from '../../types';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const sortedSkills = [...skills].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <section id="keahlian" className="py-12 md:py-16 border-t border-zinc-100 bg-zinc-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mb-2">
            Keahlian & Kompetensi
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base">
            Beragam keahlian profesional dan alat bantu kerja yang dikuasai.
          </p>
        </div>

        {/* Flex-wrap badges berisi nama keahlian saja, TANPA indikator level sesuai PRD 4.2 */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {sortedSkills.map((skill) => (
            <div
              key={skill.id}
              className="px-4 py-2.5 min-h-[44px] flex items-center bg-white border border-zinc-200 text-zinc-800 font-medium text-sm sm:text-base rounded-xl shadow-2xs hover:border-blue-300 hover:text-blue-700 hover:shadow-xs transition-all select-none"
            >
              {skill.name}
            </div>
          ))}

          {sortedSkills.length === 0 && (
            <p className="text-sm text-zinc-500 italic">Belum ada data keahlian yang ditambahkan.</p>
          )}
        </div>
      </div>
    </section>
  );
};
