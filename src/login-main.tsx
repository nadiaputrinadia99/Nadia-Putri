import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminLogin } from './components/admin/AdminLogin';
import { getAdminSession, setAdminSession } from './lib/storage';
import './index.css';

function LoginPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If already authenticated, directly proceed to admin dashboard page
    if (getAdminSession()) {
      window.location.replace('/admin');
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminLogin
      onLoginSuccess={() => {
        setAdminSession(true);
        window.location.href = '/admin';
      }}
      onNavigateHome={() => {
        window.location.href = '/';
      }}
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>,
);
