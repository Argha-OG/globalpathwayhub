import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Universities Directory | Search Top Global Institutions',
  description:
    'Explore accredited universities across Malaysia, Canada, Australia, the UK, France, the USA, Germany, and Ireland. Compare admission standards, post-study work pathways, and campus locations.',
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

