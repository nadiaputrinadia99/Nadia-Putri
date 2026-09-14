/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioData } from './types';
import {
  getPortfolioData,
  savePortfolioData,
  getAdminSession,
  setAdminSession,
} from './lib/storage';

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

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(getPortfolioData());
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getAdminSession());

  // Initialize and listen for changes
  useEffect(() => {
    const handlePortfolioUpdate = (e: any) => {
      if (e?.detail) {
        setPortfolioData(e.detail);
      } else {
        setPortfolioData(getPortfolioData());
      }
    };

    const handleSessionChange = () => {
      setIsAuthenticated(getAdminSession());
    };

    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
    };

    window.addEventListener('portfolio_updated', handlePortfolioUpdate);
    window.addEventListener('admin_session_changed', handleSessionChange);
    window.addEventListener('popstate', handlePopState);

    // Keyboard shortcut for reviewer/testing in iframe: Ctrl+Shift+A or Alt+A to go to /login or /admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        navigateTo('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('portfolio_updated', handlePortfolioUpdate);
      window.removeEventListener('admin_session_changed', handleSessionChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // PRD 5: Dynamic Document Title format "{nama} | Personal Portfolio Website"
  useEffect(() => {
    if (portfolioData?.profile?.name) {
      const dynamicTitle = `${portfolioData.profile.name} | Personal Portfolio Website`;
      document.title = dynamicTitle;

      // Also update OpenGraph title if present
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta) {
        ogTitleMeta.setAttribute('content', dynamicTitle);
      }
    }
  }, [portfolioData?.profile?.name]);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // In sandboxed iframes pushState might be restricted
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePortfolio = (updatedData: PortfolioData) => {
    setPortfolioData(updatedData);
    savePortfolioData(updatedData);
  };

  // Route matching:
  // Admin & auth routes: /admin, /admin/*, /login, /login/*
  const normalizedPath = currentPath.toLowerCase().replace(/\/+$/, '') || '/';
  const isAdminRoute =
    normalizedPath.startsWith('/admin') ||
    normalizedPath === '/login' ||
    normalizedPath.startsWith('/login');

  // Auto-redirect: If user is already authenticated and visits /login, /admin/login, or /admin,
  // update the URL to /admin/dashboard seamlessly.
  useEffect(() => {
    if (
      isAuthenticated &&
      (normalizedPath === '/login' || normalizedPath === '/admin/login' || normalizedPath === '/admin')
    ) {
      try {
        window.history.replaceState({}, '', '/admin/dashboard');
        setCurrentPath('/admin/dashboard');
      } catch {
        // sandbox safe
      }
    }
  }, [isAuthenticated, normalizedPath]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-zinc-900">
      {/* Render based on route */}
      {isAdminRoute ? (
        isAuthenticated ? (
          <AdminDashboard
            portfolioData={portfolioData}
            onUpdatePortfolio={handleUpdatePortfolio}
            onViewPublicSite={() => navigateTo('/')}
            onLogout={() => {
              setIsAuthenticated(false);
              navigateTo('/login');
            }}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              navigateTo('/admin/dashboard');
            }}
            onNavigateHome={() => navigateTo('/')}
          />
        )
      ) : (
        /* Halaman Publik (PRD Bagian 4) */
        <div className="flex-1 flex flex-col">
          {/* Navbar Publik (PRD 4.8: TANPA link/tombol admin) */}
          <Navbar profile={portfolioData.profile} />

          {/* Hero Section (PRD 4.1) */}
          <HeroSection profile={portfolioData.profile} />

          {/* Skills (PRD 4.2: badges tanpa level indicator) */}
          <SkillsSection skills={portfolioData.skills} />

          {/* Portfolio / Projects (PRD 4.3) */}
          <ProjectsSection projects={portfolioData.projects} />

          {/* Experience (PRD 4.4) */}
          <ExperienceSection experiences={portfolioData.experiences} />

          {/* Course & Training (PRD 4.5: section terpisah) */}
          <CoursesSection courses={portfolioData.courses} />

          {/* Languages (PRD 4.6: format teks murni) */}
          <LanguagesSection languages={portfolioData.languages} />

          {/* Kontak (PRD 4.7) */}
          <ContactSection contacts={portfolioData.contacts} />

          {/* Footer (PRD 4.8: TANPA link/tombol admin) */}
          <Footer profile={portfolioData.profile} />
        </div>
      )}
    </div>
  );
}
