import React, { useState } from 'react';
import { ExternalLink, Folder, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const sortedProjects = [...projects].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Extract unique categories
  const categories = ['Semua', ...Array.from(new Set(sortedProjects.map((p) => p.category).filter(Boolean) as string[]))];

  const filteredProjects =
    selectedCategory === 'Semua'
      ? sortedProjects
      : sortedProjects.filter((p) => p.category === selectedCategory);

  return (
    <section id="project" className="py-14 md:py-20 border-t border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3 border border-blue-100">
              <Folder className="w-3.5 h-3.5" />
              <span>Karya & Portofolio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mb-2">
              Project & Portofolio Terpilih
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base max-w-2xl">
              Kumpulan inisiatif, desain, kampanye, dan karya kreatif yang telah diselesaikan.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 min-h-[36px] rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => {
            const activeLink = project.external_url || project.project_link;

            return (
              <article
                key={project.id}
                className="group flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-md transition-all duration-300"
              >
                {/* Gambar Thumbnail with click to open preview modal */}
                <div
                  onClick={() => setSelectedProject(project)}
                  className="relative aspect-16/10 w-full bg-zinc-100 overflow-hidden cursor-pointer"
                >
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-50">
                      <Folder className="w-12 h-12" />
                    </div>
                  )}

                  {/* Category Pill on Image */}
                  {project.category && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold text-zinc-800 border border-zinc-200 shadow-xs">
                      {project.category}
                    </div>
                  )}
                </div>

                {/* Konten Card */}
                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="text-lg sm:text-xl font-bold text-zinc-900 mb-2.5 group-hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>

                  <p className="text-sm text-zinc-600 leading-relaxed mb-6 flex-1 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tombol Aksi */}
                  <div className="pt-3 mt-auto border-t border-zinc-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 min-h-[44px] py-2 transition-colors"
                    >
                      <span>Lihat Detail</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    {activeLink && (
                      <a
                        href={activeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 min-h-[44px] px-2"
                        title="Buka Tautan Luar"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-zinc-200">
            <p className="text-zinc-500 text-sm">Belum ada project yang sesuai dengan kategori ini.</p>
          </div>
        )}
      </div>

      {/* Modal / Lightbox Detail Project */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative aspect-16/9 w-full bg-zinc-100 overflow-hidden">
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              {selectedProject.category && (
                <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg text-xs font-bold text-blue-700 shadow-sm border border-zinc-200">
                  {selectedProject.category}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900">
                {selectedProject.title}
              </h3>

              <div className="prose prose-zinc text-sm sm:text-base text-zinc-600 leading-relaxed">
                <p>{selectedProject.description}</p>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-zinc-200 flex flex-wrap gap-3">
                {selectedProject.project_link && (
                  <a
                    href={selectedProject.project_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 inline-flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Kunjungi Tautan Project</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {selectedProject.external_url && (
                  <a
                    href={selectedProject.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-800 font-semibold text-sm hover:bg-zinc-200 inline-flex items-center gap-2 transition-colors"
                  >
                    <span>Google Drive / Sumber Media</span>
                    <ExternalLink className="w-4 h-4 text-zinc-500" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-sm hover:bg-zinc-50 ml-auto"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
