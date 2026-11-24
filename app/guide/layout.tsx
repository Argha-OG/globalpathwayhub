import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Student Survival Guide & Study Abroad Blog | GlobalPathwayHub',
  description:
    'Honest, practical articles on current study abroad realities, housing strategies, part-time work caps, country guides, and student survival tips across Malaysia, Canada, Australia, UK, and France.',
  alternates: {
    canonical: `${SITE_URL}/guide`,
  },
  openGraph: {
    title: 'Student Guide & Study Abroad Reality Blog | GlobalPathwayHub',
    description:
      'Essential student guidelines on surviving abroad, legal part-time jobs, housing aid, and budgeting.',
    url: `${SITE_URL}/guide`,
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
