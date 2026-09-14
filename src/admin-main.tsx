import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PortfolioData } from './types';
import { getPortfolioData, savePortfolioData, getAdminSession, setAdminSession } from './lib/storage';
import './index.css';

function AdminPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => getPortfolioData());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getAdminSession());

  useEffect(() => {
    // If not authenticated, redirect to login page immediately
    if (!getAdminSession()) {
      window.location.replace('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUpdate = (updated: PortfolioData) => {
    setPortfolioData(updated);
    savePortfolioData(updated);
  };

  const handleLogout = () => {
    setAdminSession(false);
    window.location.href = '/login';
  };

  const handleViewPublic = () => {
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminDashboard
      portfolioData={portfolioData}
      onUpdatePortfolio={handleUpdate}
      onViewPublicSite={handleViewPublic}
      onLogout={handleLogout}
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminPage />
  </StrictMode>,
);
