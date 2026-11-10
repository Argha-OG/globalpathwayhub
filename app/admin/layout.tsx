import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staff & Counselor Portal | GlobalPathwayHub Internal',
  description: 'GlobalPathwayHub authorized staff, agent, and counselor management platform.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

