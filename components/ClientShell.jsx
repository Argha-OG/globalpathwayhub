'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisitorTracker from '@/components/VisitorTracker';
import { Toaster } from 'react-hot-toast';

export default function ClientShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname && pathname.startsWith('/admin');

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#0f172a',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            borderRadius: '1rem',
            padding: '12px 16px',
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: '#2563eb',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#e11d48',
              secondary: '#ffffff',
            },
          },
        }}
      />
      {isAdminRoute ? (
        children
      ) : (
        <>
          <VisitorTracker />
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20">
            {children}
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
