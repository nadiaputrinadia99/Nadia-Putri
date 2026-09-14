import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
import { uploadImageFile } from '../../lib/storage';

interface ImageUploaderProps {
  currentImageUrl: string;
  bucket: 'avatars' | 'projects';
  label: string;
  onImageUploaded: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  bucket,
  label,
  onImageUploaded,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [externalUrlInput, setExternalUrlInput] = useState('');
  const [showExternalInput, setShowExternalInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('File yang dipilih harus berupa gambar (PNG, JPG, WebP, dll).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Ukuran file maksimal adalah 8MB.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Generate immediate local preview and upload
      const uploadedUrl = await uploadImageFile(file, bucket);
      setPreviewUrl(uploadedUrl);
      onImageUploaded(uploadedUrl);
    } catch (err: any) {
      setError('Gagal memproses gambar: ' + (err?.message || 'Terjadi kesalahan'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const applyExternalUrl = () => {
    if (externalUrlInput.trim()) {
      setPreviewUrl(externalUrlInput.trim());
      onImageUploaded(externalUrlInput.trim());
      setShowExternalInput(false);
      setExternalUrlInput('');
      setError(null);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-zinc-900">{label}</label>

      {/* Preview area before saving as demanded by PRD 6.2 */}
      {previewUrl && (
        <div className="relative inline-block border-2 border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 p-1 mb-2 shadow-2xs">
          <img
            src={previewUrl}
            alt="Preview"
            className={`object-cover bg-white ${
              bucket === 'avatars' ? 'w-28 h-28 rounded-lg' : 'w-full max-w-sm h-40 rounded-lg'
            }`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-sm">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Drag & Drop or Click Area (Touch Friendly min 44px tap target) */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[120px] ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-zinc-300 hover:border-blue-400 bg-zinc-50/60 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
        <p className="text-sm font-medium text-zinc-700">
          {isUploading ? (
            <span className="text-blue-600 animate-pulse">Mengunggah gambar...</span>
          ) : (
            <>
              <span className="text-blue-600 font-semibold">Klik untuk pilih gambar</span> atau seret
              file ke sini
            </>
          )}
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Format PNG, JPG, GIF, WebP (Maks. 8MB) — Bucket: <code className="font-mono text-zinc-700 font-bold">{bucket}</code>
        </p>
      </div>

      {/* Toggle direct URL input */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
        <button
          type="button"
          onClick={() => setShowExternalInput(!showExternalInput)}
          className="text-blue-600 hover:underline min-h-[44px] flex items-center font-medium"
        >
          {showExternalInput ? 'Tutup input URL' : 'Atau gunakan URL gambar langsung'}
        </button>
      </div>

      {showExternalInput && (
        <div className="flex gap-2 mt-1">
          <input
            type="url"
            value={externalUrlInput}
            onChange={(e) => setExternalUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
          <button
            type="button"
            onClick={applyExternalUrl}
            className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 min-h-[44px]"
          >
            Terapkan
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};
