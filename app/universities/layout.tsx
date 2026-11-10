import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Universities Directory | Search Top Global Institutions',
  description:
    'Explore 5,000+ accredited universities across the UK, USA, Canada, Australia, Malaysia, and Europe. Compare rankings, admission standards, and campus locations.',
  alternates: {
    canonical: `${SITE_URL}/universities`,
  },
  openGraph: {
    title: 'Global Universities Directory | GlobalPathwayHub',
    description:
      'Search worldwide universities with real-time institutional lookup, location mapping, and direct application guidance.',
    url: `${SITE_URL}/universities`,
  },
};

export default function UniversitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

