import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, MessageSquare, Mail, Instagram, Linkedin, Send } from 'lucide-react';
import { Contact, ContactType } from '../../types';

interface ContactsManagerProps {
  contacts: Contact[];
  onSave: (contacts: Contact[]) => void;
}

export const ContactsManager: React.FC<ContactsManagerProps> = ({ contacts, onSave }) => {
  const [items, setItems] = useState<Contact[]>(contacts);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formType, setFormType] = useState<ContactType>('whatsapp');
  const [formValue, setFormValue] = useState('');

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormType('whatsapp');
    setFormValue('');
  };

  const startEdit = (c: Contact) => {
    setEditingId(c.id);
    setIsAdding(false);
    setFormType(c.type);
    setFormValue(c.value);
  };

  const cancelAction = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormValue('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue.trim()) return;

    let updated: Contact[];
    if (isAdding) {
      const newContact: Contact = {
        id: `cont-${Date.now()}`,
        type: formType,
        value: formValue.trim(),
      };
      updated = [...items, newContact];
    } else if (editingId) {
      updated = items.map((c) =>
        c.id === editingId ? { ...c, type: formType, value: formValue.trim() } : c
      );
    } else {
      return;
    }

    setItems(updated);
    onSave(updated);
    cancelAction();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus kontak ini?')) {
      const updated = items.filter((c) => c.id !== id);
      setItems(updated);
      onSave(updated);
    }
  };

  const getTypeIcon = (type: ContactType) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-rose-600" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-sky-600" />;
      default:
        return <Send className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-2xs">
      <div className="border-b border-zinc-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Manajemen Kanal Kontak</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Kelola tautan WhatsApp, Email, Instagram, dan LinkedIn sesuai PRD 4.7.
          </p>
        </div>

        <button
          type="button"
          onClick={startAdd}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 shadow-xs flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kanal Kontak</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSave}
          className="mb-6 p-4 sm:p-5 bg-blue-50/50 border border-blue-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
        >
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
              Tipe Kanal Kontak <span className="text-red-500">*</span>
            </label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as ContactType)}
              className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
              Nilai / Link / Username / Nomor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder={
                formType === 'whatsapp'
                  ? 'Contoh: 6281234567890'
                  : formType === 'email'
                  ? 'Contoh: nama@domain.com'
                  : formType === 'instagram'
                  ? 'Contoh: @username atau https://instagram.com/username'
                  : 'Contoh: https://linkedin.com/in/username'
              }
              className="w-full px-3.5 py-2.5 min-h-[44px] border border-zinc-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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
              <th className="py-3 px-4 w-36">Tipe Kanal</th>
              <th className="py-3 px-4">Nilai / Alamat Tautan</th>
              <th className="py-3 px-4 text-right w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {items.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50/70 transition-colors">
                <td className="py-3 px-4 font-semibold capitalize text-zinc-900">
                  <div className="inline-flex items-center gap-2">
                    {getTypeIcon(c.type)}
                    <span>{c.type}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-xs sm:text-sm text-zinc-700 truncate max-w-xs">
                  {c.value}
                </td>
                <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => startEdit(c)}
                    className="p-2 min-h-[44px] min-w-[44px] text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center justify-center"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
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
                  Belum ada kanal kontak yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
