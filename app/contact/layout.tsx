import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact Us | Admissions Counseling & Executive Office',
  description:
    'Get in touch with GlobalPathwayHub education advisors. Direct email channels to CEO (ceo@), CTO (cto@), Marketing (hmm@), and student support (support@globalpathwayhub.com). Call or WhatsApp +880 1410-555054.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact GlobalPathwayHub | Higher Education Advisory & Support',
    description:
      'Direct admissions counseling helpline, executive office contacts, and free university admission appointment booking.',
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

