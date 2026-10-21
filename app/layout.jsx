import './globals.css';
import { Outfit } from 'next/font/google';
import MouseTracker from '@/components/MouseTracker';
import ClientShell from '@/components/ClientShell';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'Global Pathway Hub | Discover Universities & Courses Worldwide',
  description: 'Your trusted partner in your global education journey. Discover top universities, browse accredited programs, and apply with expert guidance.',
  icons: {
    icon: '/globalpathwayhub-logo.svg',
    apple: '/globalpathwayhub-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground relative overflow-x-hidden antialiased">
        <MouseTracker />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
