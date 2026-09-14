export interface Profile {
  id: string;
  name: string;
  tagline: string;
  short_description: string;
  status: string; // e.g., "Terbuka untuk Kolaborasi"
  avatar_url: string;
  resume_url: string | null; // URL Google Drive, optional (if empty/null, resume button is not rendered)
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category?: string; // e.g. "Brand Identity", "Campaign", "Audio Production"
  image_url: string;
  external_url: string | null; // e.g. for Google Drive video/music/animation
  project_link: string; // e.g. "Lihat Detail" link
  sort_order: number;
}

export interface Experience {
  id: string;
  institution_name: string;
  year_range: string; // e.g., "2022 — Sekarang" or "2020 — 2022"
  location: string;
  description: string;
  sort_order: number;
}

export interface Course {
  id: string;
  course_name: string;
  organizer: string;
  year: string;
  location: string;
  description: string;
  sort_order: number;
}

export interface Language {
  id: string;
  language_name: string;
  proficiency_level: string; // Free text, e.g., "Native", "Intermediate"
  sort_order: number;
}

export type ContactType = 'whatsapp' | 'email' | 'instagram' | 'linkedin';

export interface Contact {
  id: string;
  type: ContactType;
  value: string; // phone number (wa.me/...), email, username or full link
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  courses: Course[];
  languages: Language[];
  contacts: Contact[];
}

export type AdminTab =
  | 'profile'
  | 'projects'
  | 'skills'
  | 'experiences'
  | 'courses'
  | 'languages'
  | 'contacts'
  | 'system';
