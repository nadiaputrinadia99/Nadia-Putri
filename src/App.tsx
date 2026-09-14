import React, { useState, useEffect } from 'react';
import { PortfolioData } from './types';
import { getPortfolioData, savePortfolioData, getAdminSession } from './lib/storage';

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

// Helper to determine route across pathname, hash, and search query params
function getAppPath(): string {
  if (typeof window === 'undefined') return '/';

  // 1. Pathname check (e.g. /login, /admin, /admin/login, /admin/dashboard)
  const pathname = (window.location.pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
  if (
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname.startsWith('/login/')
  ) {
    return pathname;
  }

  // 2. Hash routing check (e.g. #/login, #login, #/admin, #admin)
  const hash = (window.location.hash || '').toLowerCase().replace(/^#\/?/, '').replace(/\/+$/, '');
  if (
    hash === 'login' ||
    hash.startsWith('login/') ||
    hash === 'admin' ||
    hash.startsWith('admin/')
  ) {
    return '/' + hash;
  }

  // 3. Search query check (e.g. ?login, ?admin, ?page=login, ?route=admin)
  try {
    const search = new URLSearchParams(window.location.search);
    const pageParam = search.get('page') || search.get('route') || search.get('p');
    if (pageParam) {
      const clean = pageParam.toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');
      if (clean.startsWith('admin') || clean.startsWith('login')) {
        return '/' + clean;
      }
    }
    if (search.has('login')) return '/login';
    if (search.has('admin')) return '/admin';
  } catch {
    // URLSearchParams fallback safe
  }

  return pathname;
}

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(getPortfolioData());
  const [currentPath, setCurrentPath] = useState<string>(() => getAppPath());
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

    const handleLocationChange = () => {
      setCurrentPath(getAppPath());
    };

    window.addEventListener('portfolio_updated', handlePortfolioUpdate);
    window.addEventListener('admin_session_changed', handleSessionChange);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Keyboard shortcut for testing/reviewing: Ctrl+Shift+A or Alt+A to toggle admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') ||
        (e.altKey && e.key.toLowerCase() === 'a')
      ) {
        e.preventDefault();
        navigateTo(isAuthenticated ? '/admin/dashboard' : '/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('portfolio_updated', handlePortfolioUpdate);
      window.removeEventListener('admin_session_changed', handleSessionChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated]);

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
      // In sandboxed iframes pushState might be restricted, fallback to hash
      try {
        window.location.hash = path;
      } catch {
        // Safe fallback
      }
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
          {/* Navbar Publik */}
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

          {/* Footer dengan link Admin Portal tersembunyi/rapi */}
          <Footer
            profile={portfolioData.profile}
            onNavigateAdmin={() => navigateTo(isAuthenticated ? '/admin/dashboard' : '/login')}
          />
        </div>
      )}
    </div>
  );
}
