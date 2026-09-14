import React, { useState } from 'react';
import { Save, CheckCircle, Info } from 'lucide-react';
import { Profile } from '../../types';
import { ImageUploader } from './ImageUploader';

interface ProfileEditorProps {
  profile: Profile;
  onSave: (updatedProfile: Profile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updated_at: new Date().toISOString(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-2xs">
      <div className="border-b border-zinc-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Manajemen Profil</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Kelola data diri, status ketersediaan, foto profil, dan dokumen resume.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-semibold border border-emerald-200">
            <CheckCircle className="w-4 h-4" />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Foto Profil & Uploader */}
        <div className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-200">
          <ImageUploader
            currentImageUrl={formData.avatar_url}
            bucket="avatars"
            label="Foto Profil (Avatar)"
            onImageUploaded={(url) => setFormData((prev) => ({ ...prev, avatar_url: url }))}
          />
        </div>

        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Rania Pratama"
            className="w-full px-4 py-3 min-h-[44px] text-base border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Kata pertama nama akan dijadikan aksen biru di Hero Section sesuai ketentuan desain PRD.
          </p>
        </div>

        {/* Tagline / Jabatan */}
        <div>
          <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
            Tagline / Jabatan Profesional <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Contoh: UI/UX Designer & Content Specialist"
            className="w-full px-4 py-3 min-h-[44px] text-base border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
            Status Ketersediaan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            placeholder="Contoh: Terbuka untuk Kolaborasi"
            className="w-full px-4 py-3 min-h-[44px] text-base border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Ditampilkan di bawah foto profil dengan indikator dot aktif.
          </p>
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
            Deskripsi Singkat (2–3 Kalimat) <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="Deskripsikan latar belakang, keahlian utama, dan nilai yang Anda bawa..."
            className="w-full px-4 py-3 text-base border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white leading-relaxed"
          />
        </div>

        {/* Link Resume (Opsional) */}
        <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100">
          <label className="block text-sm font-semibold text-zinc-900 mb-1.5 flex items-center gap-1.5">
            <span>Link Resume (Google Drive URL)</span>
            <span className="text-xs font-normal text-zinc-500">(Opsional)</span>
          </label>
          <input
            type="url"
            value={formData.resume_url || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                resume_url: e.target.value.trim() ? e.target.value : null,
              })
            }
            placeholder="https://drive.google.com/file/d/..."
            className="w-full px-4 py-3 min-h-[44px] text-base border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
          <div className="flex items-start gap-2 mt-2 text-xs text-zinc-600">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Ketentuan PRD 4.1 & 6.3:</strong> Jika field ini dikosongkan, tombol "Resume" pada
              halaman publik tidak akan dirender sama sekali.
            </span>
          </div>
        </div>

        {/* Tombol Simpan (Min 44px tap target) */}
        <div className="pt-4 border-t border-zinc-200 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
};
