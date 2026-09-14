import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { Experience } from '../../types';

interface ExperiencesManagerProps {
  experiences: Experience[];
  onSave: (experiences: Experience[]) => void;
}

export const ExperiencesManager: React.FC<ExperiencesManagerProps> = ({ experiences, onSave }) => {
  const [items, setItems] = useState<Experience[]>(experiences);
  const [isEditing, setIsEditing] = useState(false);
  const [activeItem, setActiveItem] = useState<Experience | null>(null);

  const handleAddNew = () => {
    const newItem: Experience = {
      id: `exp-${Date.now()}`,
      institution_name: '',
      year_range: '2023 — Sekarang',
      location: 'Jakarta, Indonesia',
      description: '',
      sort_order: items.length + 1,
    };
    setActiveItem(newItem);
    setIsEditing(true);
  };

  const handleEdit = (exp: Experience) => {
    setActiveItem({ ...exp });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus riwayat pengalaman ini?')) {
      const updated = items.filter((x) => x.id !== id);
      setItems(updated);
      onSave(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    let updated: Experience[];
    const exists = items.some((x) => x.id === activeItem.id);
    if (exists) {
      updated = items.map((x) => (x.id === activeItem.id ? activeItem : x));
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
          <h2 className="text-xl font-bold text-zinc-900">Manajemen Pengalaman Kerja</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Kelola riwayat institusi/perusahaan, rentang tahun, lokasi, dan deskripsi tugas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 shadow-xs flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengalaman</span>
        </button>
      </div>

      {isEditing && activeItem && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-300 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <h3 className="font-bold text-zinc-900">
              {items.some((x) => x.id === activeItem.id) ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
                Nama Instansi / Perusahaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={activeItem.institution_name}
                onChange={(e) => setActiveItem({ ...activeItem, institution_name: e.target.value })}
                placeholder="Contoh: PT Sinar Media Nusantara"
                className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
                Urutan (Sort Order)
              </label>
              <input
                type="number"
                value={activeItem.sort_order}
                onChange={(e) =>
                  setActiveItem({ ...activeItem, sort_order: parseInt(e.target.value) || 1 })
                }
                className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
                Rentang Tahun <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={activeItem.year_range}
                onChange={(e) => setActiveItem({ ...activeItem, year_range: e.target.value })}
                placeholder="Contoh: 2021 — Sekarang atau 2019 — 2021"
                className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={activeItem.location}
                onChange={(e) => setActiveItem({ ...activeItem, location: e.target.value })}
                placeholder="Contoh: Jakarta, Indonesia atau Remote"
                className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
              Deskripsi Singkat Tugas / Pencapaian <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={activeItem.description}
              onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
              placeholder="Jelaskan peran kepemimpinan, lingkup pekerjaan, dan pencapaian utama..."
              className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setActiveItem(null);
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm"
            >
              Simpan Pengalaman
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-left text-sm border-collapse min-w-[620px]">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-xs">
            <tr>
              <th className="py-3 px-4 w-16">Urutan</th>
              <th className="py-3 px-4">Instansi & Tahun</th>
              <th className="py-3 px-4">Lokasi</th>
              <th className="py-3 px-4">Deskripsi</th>
              <th className="py-3 px-4 text-right w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {items
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((exp) => (
                <tr key={exp.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-500">{exp.sort_order}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-900">{exp.institution_name}</div>
                    <div className="text-xs text-blue-700 font-medium">{exp.year_range}</div>
                  </td>
                  <td className="py-3 px-4 text-zinc-600">{exp.location}</td>
                  <td className="py-3 px-4 text-xs text-zinc-600 line-clamp-2 max-w-sm">
                    {exp.description}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleEdit(exp)}
                      className="p-2 min-h-[44px] min-w-[44px] text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 min-h-[44px] min-w-[44px] text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-zinc-500">
                  Belum ada pengalaman kerja yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
