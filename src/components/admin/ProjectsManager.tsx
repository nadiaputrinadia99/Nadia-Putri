import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Image as ImageIcon, Check, X } from 'lucide-react';
import { Project } from '../../types';
import { ImageUploader } from './ImageUploader';

interface ProjectsManagerProps {
  projects: Project[];
  onSave: (projects: Project[]) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({ projects, onSave }) => {
  const [items, setItems] = useState<Project[]>(projects);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<Project | null>(null);

  const handleAddNew = () => {
    const newItem: Project = {
      id: `proj-${Date.now()}`,
      title: '',
      category: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      external_url: null,
      project_link: '',
      sort_order: items.length + 1,
    };
    setActiveItem(newItem);
    setIsEditing(true);
  };

  const handleEdit = (item: Project) => {
    setActiveItem({ ...item });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus project ini?')) {
      const updated = items.filter((p) => p.id !== id);
      setItems(updated);
      onSave(updated);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    let updated: Project[];
    const exists = items.some((p) => p.id === activeItem.id);
    if (exists) {
      updated = items.map((p) => (p.id === activeItem.id ? activeItem : p));
    } else {
      updated = [...items, activeItem];
    }

    setItems(updated);
    onSave(updated);
    setIsEditing(false);
    setActiveItem(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-2xs">
      <div className="border-b border-zinc-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Manajemen Project & Portofolio</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Tambah, ubah, dan atur urutan karya atau project yang ditampilkan di halaman publik.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 shadow-xs flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Project Baru</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {isEditing && activeItem && (
        <div className="mb-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-300">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200">
            <h3 className="font-bold text-lg text-zinc-900">
              {items.some((p) => p.id === activeItem.id) ? 'Edit Project' : 'Tambah Project Baru'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setActiveItem(null);
              }}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-500 hover:text-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <ImageUploader
              currentImageUrl={activeItem.image_url}
              bucket="projects"
              label="Thumbnail Project (Bucket: projects)"
              onImageUploaded={(url) => setActiveItem({ ...activeItem, image_url: url })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="block text-sm font-semibold text-zinc-900 mb-1">
                  Judul Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={activeItem.title}
                  onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                  placeholder="Contoh: Rebranding Brand Lestari Co."
                  className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-sm font-semibold text-zinc-900 mb-1">
                  Kategori / Jenis Karya
                </label>
                <input
                  type="text"
                  value={activeItem.category || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, category: e.target.value })}
                  placeholder="Contoh: Brand Identity, Campaign, Audio"
                  className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-zinc-900 mb-1">
                  Urutan
                </label>
                <input
                  type="number"
                  value={activeItem.sort_order}
                  onChange={(e) =>
                    setActiveItem({ ...activeItem, sort_order: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1">
                Deskripsi Singkat <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={activeItem.description}
                onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
                placeholder="Jelaskan ruang lingkup, tantangan, dan hasil dari project ini..."
                className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1">
                  Link Detail Project
                </label>
                <input
                  type="url"
                  value={activeItem.project_link}
                  onChange={(e) => setActiveItem({ ...activeItem, project_link: e.target.value })}
                  placeholder="https://behance.net/gallery/..."
                  className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1">
                  Link Eksternal (Google Drive / Video / Audio)
                </label>
                <input
                  type="url"
                  value={activeItem.external_url || ''}
                  onChange={(e) =>
                    setActiveItem({
                      ...activeItem,
                      external_url: e.target.value.trim() ? e.target.value : null,
                    })
                  }
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setActiveItem(null);
                }}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm"
              >
                Simpan Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Responsive Table with overflow-x-auto according to PRD 3.3 & 6.2 */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-left text-sm border-collapse min-w-[650px]">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-xs">
            <tr>
              <th className="py-3.5 px-4 w-16">Urutan</th>
              <th className="py-3.5 px-4 w-20">Gambar</th>
              <th className="py-3.5 px-4">Judul & Deskripsi</th>
              <th className="py-3.5 px-4">Tautan</th>
              <th className="py-3.5 px-4 text-right w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {items
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-500">{p.sort_order}</td>
                  <td className="py-3 px-4">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-14 h-10 object-cover rounded-lg border border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-900">{p.title}</div>
                    <div className="text-xs text-zinc-500 line-clamp-1 max-w-md">
                      {p.description}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {p.project_link || p.external_url ? (
                      <a
                        href={p.external_url || p.project_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline min-h-[44px]"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="p-2 min-h-[44px] min-w-[44px] text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center justify-center transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-2 min-h-[44px] min-w-[44px] text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center justify-center transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  Belum ada project yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
