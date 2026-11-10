import { TEAM_LIST } from '@/lib/team';

export const SITE_URL = 'https://globalpathwayhub.com';
export const SITE_NAME = 'GlobalPathwayHub';

export const SOCIAL_PROFILES = [
  'https://www.facebook.com/GlobalPathwayHub',
  'https://www.instagram.com/globalpathwayhub',
  'https://www.linkedin.com/company/GlobalPathwayHub',
  'https://x.com/GlobalPathwayHub',
];

/**
 * Generates Schema.org EducationalOrganization structured data.
 */
export function getEducationalOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: 'GlobalPathwayHub Education Advisory Ltd.',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/globalpathwayhub-logo.png`,
      caption: 'GlobalPathwayHub Official Logo',
    },
    image: `${SITE_URL}/globalpathwayhub-logo.png`,
    description:
      'Premier international higher education consulting agency and global university admissions advisory connecting students with accredited universities across the UK, USA, Canada, Australia, Malaysia, and Europe.',
    telephone: '+880 1410-555054',
    email: 'support@globalpathwayhub.com',
    sameAs: SOCIAL_PROFILES,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Banani Corporate District',
      addressLocality: 'Dhaka',
      addressRegion: 'Dhaka Division',
      postalCode: '1213',
      addressCountry: 'BD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '23.7937',
      longitude: '90.4066',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+880 1410-555054',
        contactType: 'admissions inquiries',
        email: 'support@globalpathwayhub.com',
        areaServed: ['BD', 'MY', 'GB', 'US', 'CA', 'AU'],
        availableLanguage: ['English', 'Bengali'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+880 1410-555054',
        contactType: 'executive leadership',
        email: 'ceo@globalpathwayhub.com',
        availableLanguage: ['English', 'Bengali'],
      },
    ],
    founder: TEAM_LIST.map((m) => ({
      '@type': 'Person',
      name: m.name,
      jobTitle: m.fullRole,
      email: m.email,
      url: `${SITE_URL}/profile/${m.slug}`,
      image: `${SITE_URL}${m.image}`,
    })),
    knowsAbout: [
      'Higher Education Admissions',
      'Study Abroad Consulting',
      'International University Partnerships',
      'Student Visa Guidance',
      'Merit Scholarship Applications',
      'IELTS & English Language Proficiency',
    ],
  };
}

/**
 * Generates Schema.org WebSite with SearchAction.
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      'Explore accredited worldwide universities and academic programs with 1-click admissions advice.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/universities?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates Schema.org BreadcrumbList.
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates Schema.org ProfilePage + Person for leadership.
 */
export function getPersonProfileSchema(slug: string) {
  const member = TEAM_LIST.find((m) => m.slug === slug);
  if (!member) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/profile/${member.slug}#person`,
      name: member.name,
      jobTitle: member.fullRole,
      worksFor: {
        '@id': `${SITE_URL}/#organization`,
      },
      email: member.email,
      telephone: member.phone,
      image: `${SITE_URL}${member.image}`,
      description: member.headline,
      alumniOf: member.education,
      knowsAbout: member.expertise,
      url: `${SITE_URL}/profile/${member.slug}`,
      sameAs: SOCIAL_PROFILES,
    },
  };
}

/**
 * Generates Schema.org FAQPage for FAQ sections.
 */
export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates Schema.org CollegeOrUniversity.
 */
export function getCollegeOrUniversitySchema(uni: {
  name: string;
  country?: string;
  city?: string;
  website?: string;
  description?: string;
  slug?: string;
  id?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: uni.name,
    url: uni.website || `${SITE_URL}/universities/${uni.id || uni.slug}`,
    description:
      uni.description ||
      `Accredited higher education institution in ${uni.country || 'worldwide'}. Discover admissions and programs via GlobalPathwayHub.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: uni.city || undefined,
      addressCountry: uni.country || undefined,
    },
  };
}

/**
 * Generates Schema.org Course.
 */
export function getCourseSchema(course: {
  id?: string;
  name: string;
  university_name?: string;
  level?: string;
  duration?: string;
  fee?: number | string;
  currency?: string;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description:
      course.description ||
      `${course.level || 'Degree'} program in ${course.name} offered at ${course.university_name || 'Partner University'}.`,
    educationalLevel: course.level || 'Higher Education',
    timeRequired: course.duration || undefined,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: course.university_name || 'Accredited Partner University',
    },
    offers: course.fee
      ? {
          '@type': 'Offer',
          price: course.fee,
          priceCurrency: course.currency || 'USD',
          category: 'Tuition Fee',
          url: `${SITE_URL}/courses/${course.id}`,
        }
      : undefined,
  };
}

