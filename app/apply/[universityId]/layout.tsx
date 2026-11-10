import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply Online | Global University Admissions',
  description:
    'Submit your university application online with GlobalPathwayHub certified counselor guidance.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

