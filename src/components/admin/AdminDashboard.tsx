import React, { useState } from 'react';
import {
  User,
  FolderKanban,
  Sparkles,
  Briefcase,
  Award,
  Globe,
  Send,
  Activity,
  LogOut,
  Eye,
  Menu,
  X,
} from 'lucide-react';
import { PortfolioData, AdminTab } from '../../types';
import { setAdminSession } from '../../lib/storage';
import { ProfileEditor } from './ProfileEditor';
import { ProjectsManager } from './ProjectsManager';
import { SkillsManager } from './SkillsManager';
import { ExperiencesManager } from './ExperiencesManager';
import { CoursesManager } from './CoursesManager';
import { LanguagesManager } from './LanguagesManager';
import { ContactsManager } from './ContactsManager';
import { KeepaliveMonitor } from './KeepaliveMonitor';

interface AdminDashboardProps {
  portfolioData: PortfolioData;
  onUpdatePortfolio: (data: PortfolioData) => void;
  onViewPublicSite: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  portfolioData,
  onUpdatePortfolio,
  onViewPublicSite,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'projects', label: 'Project & Karya', icon: FolderKanban },
    { id: 'skills', label: 'Keahlian (Skills)', icon: Sparkles },
    { id: 'experiences', label: 'Pengalaman Kerja', icon: Briefcase },
    { id: 'courses', label: 'Course & Pelatihan', icon: Award },
    { id: 'languages', label: 'Bahasa (Languages)', icon: Globe },
    { id: 'contacts', label: 'Kanal Kontak', icon: Send },
    { id: 'system', label: 'Keep-Alive & Sistem', icon: Activity },
  ];

  const handleLogout = () => {
    if (window.confirm('Apakah Anda ingin keluar dari dashboard admin?')) {
      setAdminSession(false);
      onLogout();
    }
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileEditor
            profile={portfolioData.profile}
            onSave={(updatedProfile) => {
              onUpdatePortfolio({ ...portfolioData, profile: updatedProfile });
            }}
          />
        );
      case 'projects':
        return (
          <ProjectsManager
            projects={portfolioData.projects}
            onSave={(updatedProjects) => {
              onUpdatePortfolio({ ...portfolioData, projects: updatedProjects });
            }}
          />
        );
      case 'skills':
        return (
          <SkillsManager
            skills={portfolioData.skills}
            onSave={(updatedSkills) => {
              onUpdatePortfolio({ ...portfolioData, skills: updatedSkills });
            }}
          />
        );
      case 'experiences':
        return (
          <ExperiencesManager
            experiences={portfolioData.experiences}
            onSave={(updatedExperiences) => {
              onUpdatePortfolio({ ...portfolioData, experiences: updatedExperiences });
            }}
          />
        );
      case 'courses':
        return (
          <CoursesManager
            courses={portfolioData.courses}
            onSave={(updatedCourses) => {
              onUpdatePortfolio({ ...portfolioData, courses: updatedCourses });
            }}
          />
        );
      case 'languages':
        return (
          <LanguagesManager
            languages={portfolioData.languages}
            onSave={(updatedLanguages) => {
              onUpdatePortfolio({ ...portfolioData, languages: updatedLanguages });
            }}
          />
        );
      case 'contacts':
        return (
          <ContactsManager
            contacts={portfolioData.contacts}
            onSave={(updatedContacts) => {
              onUpdatePortfolio({ ...portfolioData, contacts: updatedContacts });
            }}
          />
        );
      case 'system':
        return <KeepaliveMonitor />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-zinc-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-600 hover:text-zinc-900 rounded-lg"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span className="font-extrabold text-zinc-900 tracking-tight text-base sm:text-lg">
              Admin Panel
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Portofolio Pribadi
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onViewPublicSite}
            className="min-h-[44px] px-3.5 py-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-blue-600 transition-colors shadow-2xs"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Lihat Website Publik</span>
            <span className="sm:hidden">Web</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="min-h-[44px] px-3.5 py-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium rounded-xl border border-zinc-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-zinc-200 p-3 shadow-2xs space-y-1">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              Menu Dashboard
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full min-h-[44px] px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white rounded-2xl border border-zinc-200 p-3 shadow-md mb-2 space-y-1">
            <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
              Pilih Modul
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Panel */}
        <main className="flex-1 min-w-0">{renderActiveModule()}</main>
      </div>
    </div>
  );
};
