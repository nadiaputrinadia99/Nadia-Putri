import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Skill } from '../../types';

interface SkillsManagerProps {
  skills: Skill[];
  onSave: (skills: Skill[]) => void;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, onSave }) => {
  const [items, setItems] = useState<Skill[]>(skills);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormName('');
    setFormOrder(items.length + 1);
  };

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setIsAdding(false);
    setFormName(skill.name);
    setFormOrder(skill.sort_order || 1);
  };

  const cancelAction = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormName('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let updated: Skill[];
    if (isAdding) {
      const newSkill: Skill = {
        id: `sk-${Date.now()}`,
        name: formName.trim(),
        sort_order: Number(formOrder) || items.length + 1,
      };
      updated = [...items, newSkill];
    } else if (editingId) {
      updated = items.map((s) =>
        s.id === editingId ? { ...s, name: formName.trim(), sort_order: Number(formOrder) || 1 } : s
      );
    } else {
      return;
    }

    setItems(updated);
    onSave(updated);
    cancelAction();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus keahlian ini?')) {
      const updated = items.filter((s) => s.id !== id);
      setItems(updated);
      onSave(updated);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-2xs">
      <div className="border-b border-zinc-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Manajemen Keahlian (Skills)</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Kelola daftar keahlian tanpa indikator level sesuai PRD 4.2.
          </p>
        </div>

        <button
          type="button"
          onClick={startAdd}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 shadow-xs flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Keahlian</span>
        </button>
      </div>

      {/* Form Tambah/Edit */}
      {(isAdding || editingId) && (
        <form
          onSubmit={handleSave}
          className="mb-6 p-4 sm:p-5 bg-blue-50/50 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-end gap-3"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
              Nama Keahlian
            </label>
            <input
              type="text"
              required
              autoFocus
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contoh: Figma, Public Speaking, Canva"
              className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="w-full sm:w-28">
            <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
              Urutan
            </label>
            <input
              type="number"
              value={formOrder}
              onChange={(e) => setFormOrder(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="min-h-[44px] px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex-1 sm:flex-none flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan</span>
            </button>
            <button
              type="button"
              onClick={cancelAction}
              className="min-h-[44px] px-3.5 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100 flex-1 sm:flex-none flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-left text-sm border-collapse min-w-[480px]">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-xs">
            <tr>
              <th className="py-3 px-4 w-16">Urutan</th>
              <th className="py-3 px-4">Nama Keahlian</th>
              <th className="py-3 px-4 text-right w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {items
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-500">{s.sort_order}</td>
                  <td className="py-3 px-4 font-medium text-zinc-900">{s.name}</td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      className="p-2 min-h-[44px] min-w-[44px] text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="p-2 min-h-[44px] min-w-[44px] text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-zinc-500">
                  Belum ada keahlian yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
