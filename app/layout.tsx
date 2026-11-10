import './globals.css';
import MouseTracker from '@/components/MouseTracker';
import ClientShell from '@/components/ClientShell';
import JsonLd from '@/components/JsonLd';
import { getEducationalOrganizationSchema, getWebSiteSchema, SITE_URL } from '@/lib/seo';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GlobalPathwayHub | Study Abroad, Universities & Degrees Worldwide',
    template: '%s | GlobalPathwayHub',
  },
  description:
    'Your trusted partner in global higher education. Discover 5,000+ top universities, browse accredited Bachelor, Master & PhD programs, calculate tuition fees, and apply with authorized admissions counseling.',
  keywords: [
    'Study Abroad',
    'Global University Admissions',
    'International Education Consulting',
    'Universities in UK',
    'Study in USA',
    'Universities in Canada',
    'Study in Australia',
    'Universities in Malaysia',
    'Degree Programs Worldwide',
    'Higher Education Scholarships',
    'Student Visa Filing',
    'GlobalPathwayHub',
  ],
  authors: [{ name: 'GlobalPathwayHub Education Advisory' }],
  creator: 'GlobalPathwayHub',
  publisher: 'GlobalPathwayHub Education Advisory Ltd.',
  applicationName: 'GlobalPathwayHub',
  category: 'education',
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-US': SITE_URL,
      'en-GB': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    title: 'GlobalPathwayHub | Study Abroad, Universities & Degrees Worldwide',
    description:
      'Discover 5,000+ top universities, compare accredited degree courses, calculate live currency tuition costs, and apply with certified education counselors.',
    url: SITE_URL,
    siteName: 'GlobalPathwayHub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GlobalPathwayHub - Global University Admissions Advisory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlobalPathwayHub | Study Abroad & Global University Admissions',
    description:
      'Search accredited universities and degree courses worldwide. 1-click counselor pitch templates, document filing, and scholarship guidance.',
    site: '@GlobalPathwayHub',
    creator: '@GlobalPathwayHub',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/globalpathwayhub-logo.svg', type: 'image/svg+xml' },
      { url: '/globalpathwayhub-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/globalpathwayhub-logo.png',
    apple: [
      { url: '/globalpathwayhub-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getEducationalOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html lang="en">
      <head>
        <JsonLd data={orgSchema} />
        <JsonLd data={webSiteSchema} />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground relative overflow-x-hidden antialiased">
        <MouseTracker />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
