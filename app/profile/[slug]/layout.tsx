import type { Metadata } from 'next';
import { TEAM_MEMBERS } from '@/lib/team';
import { SITE_URL } from '@/lib/seo';

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = TEAM_MEMBERS[params.slug];
  if (!member) {
    return {
      title: 'Leadership Profile | GlobalPathwayHub',
      description: 'Executive leadership dossier at GlobalPathwayHub.',
    };
  }

  return {
    title: `${member.name} | ${member.fullRole} (${member.role})`,
    description: `${member.name} is the ${member.fullRole} at GlobalPathwayHub. ${member.headline}`,
    alternates: {
      canonical: `${SITE_URL}/profile/${member.slug}`,
    },
    openGraph: {
      title: `${member.name} - ${member.fullRole} | GlobalPathwayHub`,
      description: member.headline,
      url: `${SITE_URL}/profile/${member.slug}`,
      images: [
        {
          url: `${SITE_URL}${member.image}`,
          width: 800,
          height: 1000,
          alt: `${member.name} - ${member.fullRole}`,
        },
      ],
    },
  };
}

export default function ProfileSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

