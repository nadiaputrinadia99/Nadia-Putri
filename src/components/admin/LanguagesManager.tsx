import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { Language } from '../../types';

interface LanguagesManagerProps {
  languages: Language[];
  onSave: (languages: Language[]) => void;
}

export const LanguagesManager: React.FC<LanguagesManagerProps> = ({ languages, onSave }) => {
  const [items, setItems] = useState<Language[]>(languages);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formLevel, setFormLevel] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormName('');
    setFormLevel('Native');
    setFormOrder(items.length + 1);
  };

  const startEdit = (lang: Language) => {
    setEditingId(lang.id);
    setIsAdding(false);
    setFormName(lang.language_name);
    setFormLevel(lang.proficiency_level);
    setFormOrder(lang.sort_order || 1);
  };

  const cancelAction = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormName('');
    setFormLevel('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLevel.trim()) return;

    let updated: Language[];
    if (isAdding) {
      const newLang: Language = {
        id: `lang-${Date.now()}`,
        language_name: formName.trim(),
        proficiency_level: formLevel.trim(),
        sort_order: Number(formOrder) || items.length + 1,
      };
      updated = [...items, newLang];
    } else if (editingId) {
      updated = items.map((l) =>
        l.id === editingId
          ? { ...l, language_name: formName.trim(), proficiency_level: formLevel.trim(), sort_order: Number(formOrder) || 1 }
          : l
      );
    } else {
      return;
    }

    setItems(updated);
    onSave(updated);
    cancelAction();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus bahasa ini?')) {
      const updated = items.filter((l) => l.id !== id);
      setItems(updated);
      onSave(updated);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-2xs">
      <div className="border-b border-zinc-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Manajemen Bahasa (Languages)</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Kelola bahasa dan tingkat kemahiran (disimpan dan ditampilkan sebagai teks murni tanpa bar).
          </p>
        </div>

        <button
          type="button"
          onClick={startAdd}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 shadow-xs flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Bahasa</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSave}
          className="mb-6 p-4 sm:p-5 bg-blue-50/50 border border-blue-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
        >
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
              Nama Bahasa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contoh: Bahasa Indonesia, English"
              className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
              Tingkat Kemahiran (Teks) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formLevel}
              onChange={(e) => setFormLevel(e.target.value)}
              placeholder="Contoh: Native, Professional Working, Intermediate"
              className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
              Urutan
            </label>
            <input
              type="number"
              value={formOrder}
              onChange={(e) => setFormOrder(parseInt(e.target.value) || 1)}
              className="w-full px-2 py-2.5 min-h-[44px] border border-zinc-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2 flex gap-2">
            <button
              type="submit"
              className="min-h-[44px] px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex-1 flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" />
              <span>Simpan</span>
            </button>
            <button
              type="button"
              onClick={cancelAction}
              className="min-h-[44px] px-3.5 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-left text-sm border-collapse min-w-[500px]">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-xs">
            <tr>
              <th className="py-3 px-4 w-16">Urutan</th>
              <th className="py-3 px-4">Nama Bahasa</th>
              <th className="py-3 px-4">Kemahiran (Format Teks Sesuai PRD)</th>
              <th className="py-3 px-4 text-right w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {items
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((lang) => (
                <tr key={lang.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-500">{lang.sort_order}</td>
                  <td className="py-3 px-4 font-semibold text-zinc-900">{lang.language_name}</td>
                  <td className="py-3 px-4 text-zinc-700 font-medium">
                    <span className="text-zinc-900">{lang.language_name}</span>
                    <span className="text-zinc-400 mx-2">—</span>
                    <span className="text-blue-700">{lang.proficiency_level}</span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => startEdit(lang)}
                      className="p-2 min-h-[44px] min-w-[44px] text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(lang.id)}
                      className="p-2 min-h-[44px] min-w-[44px] text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-zinc-500">
                  Belum ada bahasa yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
