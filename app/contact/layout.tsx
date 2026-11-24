import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact Us | Admissions Counseling & Head Office Dhaka',
  description:
    'Visit our head office at 6-A, Jass Nibash, Section-10, Block-B, Road Avenue-1, Plot-5, Mirpur-10, Dhaka - 1216. Direct WhatsApp lines: Abu Siam Khan (Founder & CEO: +880 1410-555054), Argha Biswas (CTO: +880 1999-389199), Shahriar Hassan (Head of Marketing: +60 17-536 0551).',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact GlobalPathwayHub | Higher Education Advisory & Support',
    description:
      'Direct admissions counseling helpline, head office location in Mirpur-10 Dhaka, and executive WhatsApp advisory.',
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

