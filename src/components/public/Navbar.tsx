import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Profile } from '../../types';

interface NavbarProps {
  profile: Profile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Tentang', href: '#tentang' },
    { label: 'Keahlian', href: '#keahlian' },
    { label: 'Project', href: '#project' },
    { label: 'Pengalaman', href: '#pengalaman' },
    { label: 'Pelatihan', href: '#pelatihan' },
    { label: 'Bahasa', href: '#bahasa' },
    { label: 'Kontak', href: '#kontak' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-zinc-100'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Name */}
        <a
          href="#tentang"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#tentang');
          }}
          className="text-lg font-bold tracking-tight text-zinc-900 hover:text-blue-600 transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          <span>{profile.name}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium text-zinc-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle (Min 44x44px touch target) */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-zinc-700 hover:text-blue-600 hover:bg-zinc-100 transition-colors"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-6 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-4 py-3 min-h-[44px] flex items-center text-base font-medium rounded-lg text-zinc-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
