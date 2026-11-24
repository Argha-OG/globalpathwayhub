'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaBars, FaXmark } from 'react-icons/fa6';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Universities', path: '/universities' },
  { name: 'Courses', path: '/courses' },
  { name: 'Guide', path: '/guide' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#144272]/15 shadow-xs text-[#144272]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <img
            src="/logo-mark.png"
            alt="GlobalPathwayHub Logo"
            width={36}
            height={36}
            decoding="async"
            className="h-8 sm:h-9 w-8 sm:w-9 object-contain transition-transform group-hover:scale-105"
            style={{ background: 'transparent' }}
          />
          <span className="font-black text-base sm:text-lg tracking-tight text-[#144272] hidden md:block whitespace-nowrap">
            Global{' '}<span className="text-[#3FC1C9]">Pathway</span>{' '}Hub
          </span>
        </Link>

        {/* Desktop Navigation Links - Clean Icon-Free Typography (8px Radius) */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.path ||
              (link.path !== '/' && pathname?.startsWith(link.path + '/'));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                  isActive
                    ? 'bg-[#144272] text-white shadow-xs'
                    : 'text-[#144272] hover:text-[#144272] hover:bg-[#F5F5F5]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Area: Free Consultation CTA */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/contact" className="hidden lg:block flex-shrink-0">
            {/* Yellow button with left-to-right shine sweep */}
            <button
              className="relative overflow-hidden rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wider bg-[#FFD749] hover:bg-[#f5c800] text-[#144272] border-2 border-[#144272]/20 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              {/* Shine overlay */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 animate-shine"
                style={{
                  background:
                    'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
                  width: '60%',
                }}
              />
              Free Consultation
            </button>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#F5F5F5] border border-[#144272]/20 text-[#144272] hover:bg-[#144272] hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaXmark className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Clean Text-Only 8px Geometry) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#144272]/15 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-md">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.path ||
              (link.path !== '/' && pathname?.startsWith(link.path + '/'));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`px-4 py-2.5 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider block ${
                  isActive
                    ? 'bg-[#144272] text-white'
                    : 'text-[#144272] hover:bg-[#F5F5F5]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#144272]/10">
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <button
                className="relative overflow-hidden w-full rounded-lg text-xs font-black uppercase tracking-wider h-10 flex items-center justify-center bg-[#FFD749] hover:bg-[#f5c800] text-[#144272] border-2 border-[#144272]/20 shadow-md"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 animate-shine"
                  style={{
                    background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
                    width: '60%',
                  }}
                />
                Book Free Consultation
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
