import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Courses & Programs Directory | Find Bachelor, Master & PhD Degrees',
  description:
    'Browse thousands of accredited academic courses and degree programs worldwide. Filter by degree level, duration, and tuition fee with live currency conversion.',
  alternates: {
    canonical: `${SITE_URL}/courses`,
  },
  openGraph: {
    title: 'Degree Courses & Academic Programs | GlobalPathwayHub',
    description:
      'Search undergraduate, graduate, and doctoral degree programs across partner universities worldwide with verified tuition fees.',
    url: `${SITE_URL}/courses`,
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

