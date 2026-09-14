import React, { useState, useEffect } from 'react';
import { PortfolioData } from './types';
import { getPortfolioData } from './lib/storage';

// Public Components
import { Navbar } from './components/public/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { SkillsSection } from './components/public/SkillsSection';
import { ProjectsSection } from './components/public/ProjectsSection';
import { ExperienceSection } from './components/public/ExperienceSection';
import { CoursesSection } from './components/public/CoursesSection';
import { LanguagesSection } from './components/public/LanguagesSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => getPortfolioData());

  useEffect(() => {
    const handlePortfolioUpdate = (e: any) => {
      if (e?.detail) {
        setPortfolioData(e.detail);
      } else {
        setPortfolioData(getPortfolioData());
      }
    };
    window.addEventListener('portfolio_updated', handlePortfolioUpdate);

    // Keyboard shortcut for quick admin access: Alt+A or Ctrl+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') ||
        (e.altKey && e.key.toLowerCase() === 'a')
      ) {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('portfolio_updated', handlePortfolioUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Dynamic Document Title format "{nama} | Personal Portfolio Website"
  useEffect(() => {
    if (portfolioData?.profile?.name) {
      const dynamicTitle = `${portfolioData.profile.name} | Personal Portfolio Website`;
      document.title = dynamicTitle;

      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta) {
        ogTitleMeta.setAttribute('content', dynamicTitle);
      }
    }
  }, [portfolioData?.profile?.name]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-zinc-900">
      {/* Navbar Publik */}
      <Navbar profile={portfolioData.profile} />

      {/* Hero Section (PRD 4.1) */}
      <HeroSection profile={portfolioData.profile} />

      {/* Skills (PRD 4.2) */}
      <SkillsSection skills={portfolioData.skills} />

      {/* Portfolio / Projects (PRD 4.3) */}
      <ProjectsSection projects={portfolioData.projects} />

      {/* Experience (PRD 4.4) */}
      <ExperienceSection experiences={portfolioData.experiences} />

      {/* Course & Training (PRD 4.5) */}
      <CoursesSection courses={portfolioData.courses} />

      {/* Languages (PRD 4.6) */}
      <LanguagesSection languages={portfolioData.languages} />

      {/* Kontak (PRD 4.7) */}
      <ContactSection contacts={portfolioData.contacts} />

      {/* Footer dengan link langsung ke /login */}
      <Footer
        profile={portfolioData.profile}
        onNavigateAdmin={() => {
          window.location.href = '/admin';
        }}
      />
    </div>
  );
}
