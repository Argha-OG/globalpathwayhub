import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Us | Executive Leadership & Vision',
  description:
    'Learn about GlobalPathwayHub, our executive leadership team (Abu Siam Khan CEO, Argha Biswas CTO, Shahriar Hassan Head of Marketing), our university network, and our mission to democratize global higher education.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'About GlobalPathwayHub | Leadership & Global Education Access',
    description:
      'Discover the team, history, and achievements behind GlobalPathwayHub. Ethical higher education advisory with direct partner representation worldwide.',
    url: `${SITE_URL}/about`,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

