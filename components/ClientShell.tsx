'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisitorTracker from '@/components/VisitorTracker';
import { Toaster } from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa6';

export default function ClientShell({ children }: { children: React.ReactNode }) {
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
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: '#144272',
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
          <main className="min-h-screen pt-20 flex flex-col">{children}</main>
          <Footer />

          {/* Floating WhatsApp Button — green heartbeat pulse */}
          <a
            href="https://api.whatsapp.com/send?phone=8801410555054"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp Support"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-lg border-2 shadow-xl hover:scale-110 transition-transform animate-heartbeat"
            style={{
              background: '#25D366',
              color: '#ffffff',
              borderColor: '#128C3E',
            }}
          >
            <FaWhatsapp className="h-5 w-5 flex-shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider hidden sm:inline-block">
              WhatsApp Desk
            </span>
          </a>
        </>
      )}
    </>
  );
}
