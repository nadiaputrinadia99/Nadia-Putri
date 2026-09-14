import { PortfolioData, Profile, Project, Skill, Experience, Course, Language, Contact } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'portfolio_prd_data_v1';
const AUTH_KEY = 'portfolio_admin_session_v1';

export const initialPortfolioData: PortfolioData = {
  profile: {
    id: 'profile-1',
    name: 'Rania Pratama',
    tagline: 'Brand Strategist & Creative Director',
    short_description:
      'Berpengalaman lebih dari 5 tahun dalam merancang identitas merek, visual storytelling, dan strategi komunikasi kreatif untuk berbagai brand dan organisasi lintas sektor.',
    status: 'Terbuka untuk Kolaborasi',
    avatar_url:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    resume_url: 'https://drive.google.com/file/d/1example-portfolio-resume/view',
    updated_at: new Date().toISOString(),
  },
  skills: [
    { id: 'sk-1', name: 'Brand Strategy', sort_order: 1 },
    { id: 'sk-2', name: 'Creative Direction', sort_order: 2 },
    { id: 'sk-3', name: 'Canva Pro', sort_order: 3 },
    { id: 'sk-4', name: 'Adobe Illustrator', sort_order: 4 },
    { id: 'sk-5', name: 'Figma', sort_order: 5 },
    { id: 'sk-6', name: 'Public Speaking', sort_order: 6 },
    { id: 'sk-7', name: 'Manajemen Event', sort_order: 7 },
    { id: 'sk-8', name: 'Copywriting & Editorial', sort_order: 8 },
    { id: 'sk-9', name: 'Media Relations', sort_order: 9 },
    { id: 'sk-10', name: 'Microsoft Office & Workspace', sort_order: 10 },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Rebranding Visual Identitas Lestari Co.',
      category: 'Brand Identity & Packaging',
      description:
        'Pengembangan brand identity komprehensif mencakup panduan tipografi, palet warna, packaging ramah lingkungan, dan aset promosi digital.',
      image_url:
        'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1000&q=80',
      external_url: null,
      project_link: 'https://behance.net',
      sort_order: 1,
    },
    {
      id: 'proj-2',
      title: 'Kampanye Edukasi Publik Literasi Digital 2024',
      category: 'Digital Campaign & Strategy',
      description:
        'Perancangan materi infografis, video campaign, serta strategi distribusi media sosial yang menjangkau lebih dari 150.000 audiens nasional.',
      image_url:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
      external_url: null,
      project_link: 'https://example.com/kampanye-literasi',
      sort_order: 2,
    },
    {
      id: 'proj-3',
      title: 'Audio Dokumenter "Kisah Pengrajin Nusantara"',
      category: 'Audio Storytelling & Dokumenter',
      description:
        'Penyutradaraan narasi dan audio storytelling mendokumentasikan kearifan lokal penenun tradisional di berbagai pelosok Indonesia.',
      image_url:
        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
      external_url: 'https://drive.google.com/drive/folders/audio-dokumenter-sample',
      project_link: 'https://drive.google.com/drive/folders/audio-dokumenter-sample',
      sort_order: 3,
    },
    {
      id: 'proj-4',
      title: 'Buku Panduan & Desain Laporan CSR Berdaya',
      category: 'Editorial & Publikasi CSR',
      description:
        'Tata letak editorial, kurasi data infografis, dan desain cetak laporan tahunan program tanggung jawab sosial perusahaan.',
      image_url:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
      external_url: null,
      project_link: 'https://issuu.com',
      sort_order: 4,
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      institution_name: 'Creative Studio Nusantara',
      year_range: '2022 — Sekarang',
      location: 'Jakarta, Indonesia',
      description:
        'Memimpin strategi visual dan tata kelola kreatif untuk lebih dari 20 klien enterprise lintas industri; mengkoordinasikan desainer, videografer, dan tim copywriter.',
      sort_order: 1,
    },
    {
      id: 'exp-2',
      institution_name: 'PT Sinar Cipta Media',
      year_range: '2020 — 2022',
      location: 'Bandung, Indonesia',
      description:
        'Mengelola konten publikasi, koordinasi press release, pelaksanaan aktivasi brand, dan perencanaan acara peluncuran produk tahunan.',
      sort_order: 2,
    },
    {
      id: 'exp-3',
      institution_name: 'Agensi Selaras Kreatif',
      year_range: '2018 — 2020',
      location: 'Yogyakarta, Indonesia',
      description:
        'Menyusun materi presentasi klien, perancangan ilustrasi digital, serta riset tren pasar untuk mendukung strategi pitch tender.',
      sort_order: 3,
    },
  ],
  courses: [
    {
      id: 'course-1',
      course_name: 'Strategic Brand Management & Visual Systems',
      organizer: 'Institut Desain & Komunikasi Kreatif',
      year: '2023',
      location: 'Daring (Online)',
      description:
        'Pelatihan komprehensif mengenai arsitektur brand, riset pasar kualitatif, dan standarisasi visual guideline perusahaan.',
      sort_order: 1,
    },
    {
      id: 'course-2',
      course_name: 'Public Speaking & Executive Media Presentation',
      organizer: 'Akademi Wicara Indonesia',
      year: '2022',
      location: 'Jakarta',
      description:
        'Pendalaman teknik retorika, modulasi vokal, fasilitasi seminar publik, dan komunikasi krisis di hadapan media.',
      sort_order: 2,
    },
    {
      id: 'course-3',
      course_name: 'Project Management & Agile Workflows for Creative Teams',
      organizer: 'Creative Hub Asia',
      year: '2021',
      location: 'Daring (Online)',
      description:
        'Penerapan metodologi agile, manajemen alokasi beban kerja, dan integrasi perangkat kolaborasi digital.',
      sort_order: 3,
    },
  ],
  languages: [
    {
      id: 'lang-1',
      language_name: 'Bahasa Indonesia',
      proficiency_level: 'Native',
      sort_order: 1,
    },
    {
      id: 'lang-2',
      language_name: 'Bahasa Inggris',
      proficiency_level: 'Professional Working',
      sort_order: 2,
    },
    {
      id: 'lang-3',
      language_name: 'Bahasa Jepang',
      proficiency_level: 'Elementary',
      sort_order: 3,
    },
  ],
  contacts: [
    {
      id: 'cont-1',
      type: 'whatsapp',
      value: '6281234567890',
    },
    {
      id: 'cont-2',
      type: 'email',
      value: 'rania.pratama.work@gmail.com',
    },
    {
      id: 'cont-3',
      type: 'instagram',
      value: 'https://instagram.com/rania.pratama',
    },
    {
      id: 'cont-4',
      type: 'linkedin',
      value: 'https://linkedin.com/in/rania-pratama',
    },
  ],
};

// Retrieve data synchronously from local cache or default
export function getPortfolioData(): PortfolioData {
  if (typeof window === 'undefined') {
    return initialPortfolioData;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validate schema minimally
      if (parsed && parsed.profile && parsed.skills && parsed.projects) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse portfolio from localStorage:', err);
  }

  // Save default data initially
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPortfolioData));
  } catch {
    // Ignore storage quota errors
  }
  return initialPortfolioData;
}

// Save portfolio data to localStorage and trigger updates
export function savePortfolioData(data: PortfolioData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('portfolio_updated', { detail: data }));
  } catch (err) {
    console.error('Failed to save portfolio to localStorage:', err);
  }

  // Optional background sync to server cache
  try {
    fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    }).catch(() => {});
  } catch {
    // Non-blocking
  }

  // Optional Supabase sync if credentials are configured
  if (isSupabaseConfigured && supabase) {
    syncToSupabase(data).catch((err) => {
      console.warn('Supabase cloud sync error:', err);
    });
  }
}

async function syncToSupabase(data: PortfolioData) {
  if (!supabase) return;
  try {
    // Upsert profile
    await supabase.from('profile').upsert({
      id: data.profile.id,
      name: data.profile.name,
      tagline: data.profile.tagline,
      short_description: data.profile.short_description,
      status: data.profile.status,
      avatar_url: data.profile.avatar_url,
      resume_url: data.profile.resume_url,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Supabase profile sync warning:', err);
  }
}

// Convert image file to base64 Data URL or upload to Supabase Storage if configured
export async function uploadImageFile(
  file: File,
  bucket: 'avatars' | 'projects'
): Promise<string> {
  // If Supabase is configured and user wants to store in bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bucket}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to Data URL:', err);
    }
  }

  // Local data URL fallback (instantly renders, previews, and saves in browser storage)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Admin session management
export function getAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'authenticated';
}

export function setAdminSession(authenticated: boolean): void {
  if (typeof window === 'undefined') return;
  if (authenticated) {
    localStorage.setItem(AUTH_KEY, 'authenticated');
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
  window.dispatchEvent(new CustomEvent('admin_session_changed'));
}
