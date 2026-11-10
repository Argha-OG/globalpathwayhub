import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Executive Leadership Profiles | GlobalPathwayHub',
  description:
    'Portfolios, verified credentials, and strategic responsibilities of GlobalPathwayHub executive leadership: Abu Siam Khan (CEO), Argha Biswas (CTO), and Shahriar Hassan (Head of Marketing & Management).',
  alternates: {
    canonical: `${SITE_URL}/profile`,
  },
  openGraph: {
    title: 'Executive Leadership Portfolios | GlobalPathwayHub',
    description:
      'Verified executive dossiers, direct corporate contact details, and strategic initiatives driving global higher education access.',
    url: `${SITE_URL}/profile`,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

