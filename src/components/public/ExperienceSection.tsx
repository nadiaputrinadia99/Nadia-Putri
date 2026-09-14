import React from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { Experience } from '../../types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const sortedExperiences = [...experiences].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <section id="pengalaman" className="py-14 md:py-20 border-t border-zinc-100 bg-zinc-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3 border border-blue-100">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Karier & Pengalaman</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mb-2">
            Pengalaman Kerja
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl">
            Rekam jejak profesional, tanggung jawab kepemimpinan, dan kontribusi nyata pada berbagai organisasi.
          </p>
        </div>

        {/* Timeline / Card List Layout */}
        <div className="space-y-6">
          {sortedExperiences.map((exp, idx) => (
            <div
              key={exp.id}
              className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-2xs hover:border-zinc-300 hover:shadow-xs transition-all relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-1">
                    {exp.institution_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-zinc-600">
                    <span className="inline-flex items-center gap-1 font-medium text-blue-700 bg-blue-50/80 px-2.5 py-0.5 rounded-md">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.year_range}
                    </span>
                    <span className="inline-flex items-center gap-1 text-zinc-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-zinc-400 self-start">
                  #{idx + 1}
                </div>
              </div>

              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}

          {sortedExperiences.length === 0 && (
            <p className="text-sm text-zinc-500 italic">Belum ada riwayat pengalaman yang ditambahkan.</p>
          )}
        </div>
      </div>
    </section>
  );
};
