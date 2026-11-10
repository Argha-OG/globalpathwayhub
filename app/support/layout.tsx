import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Support Center & FAQ | Admissions Helpdesk',
  description:
    'Answers to frequently asked questions about university applications, document checklists, visa processing timelines, and scholarship eligibility. Support: support@globalpathwayhub.com.',
  alternates: {
    canonical: `${SITE_URL}/support`,
  },
  openGraph: {
    title: 'Support Center & Student FAQ | GlobalPathwayHub',
    description:
      'Clear, authoritative answers to university admissions questions, document requirements, and student visa regulations.',
    url: `${SITE_URL}/support`,
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

