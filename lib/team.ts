export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  fullRole: string;
  badge: string;
  image: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  headline: string;
  bio: string[];
  responsibilities: string[];
  expertise: string[];
  education: string;
  quote: string;
  color: string;
  borderColor: string;
}

export const TEAM_MEMBERS: Record<string, TeamMember> = {
  'abu-siam-khan': {
    slug: 'abu-siam-khan',
    name: 'Abu Siam Khan',
    role: 'CEO',
    fullRole: 'Chief Executive Officer',
    badge: 'Executive Leadership',
    image: '/uploads/abu-siam-khan.jpg',
    email: 'ceo@globalpathwayhub.com',
    phone: '+880 1410-555054',
    whatsapp: '8801410555054',
    location: 'Dhaka, Bangladesh · Kuala Lumpur, Malaysia',
    headline: 'Founder & Chief Executive Officer driving global higher education access and international university alliances.',
    bio: [
      'Abu Siam Khan is the Founder and Chief Executive Officer of GlobalPathwayHub. With extensive cross-border experience in international education consulting, he leads the organization with a steadfast commitment to transparency, student success, and global university partnerships.',
      'Under his leadership, GlobalPathwayHub has established direct admissions and partner representations across Malaysia, the United Kingdom, the United States, Australia, and Canada, helping thousands of prospective scholars navigate admissions, scholarship allocations, and embassy visa protocols.',
      'Siam oversees corporate strategy, bilateral university agreements, and counselor operations, ensuring every student receives ethical, personalized, and accredited guidance throughout their academic journey.',
    ],
    responsibilities: [
      'Strategic corporate vision, institutional partnerships, and global expansion',
      'High-level university negotiations, fee concessions, and scholarship allocations',
      'Counselor quality governance, student advisory standards, and ethics compliance',
      'Government liaison, international education forum representations, and visa policy updates',
    ],
    expertise: [
      'Higher Education Consulting',
      'Strategic Partnerships',
      'University Admissions Protocol',
      'Global Student Advisory',
      'Executive Leadership',
      'Embassy Visa Regulations',
    ],
    education: 'Bachelor & Postgraduate Studies in Business Administration & Management',
    quote: 'Our mission is simple: eliminate geographical and informational barriers so that every deserving student can reach world-class education with total confidence.',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-200',
  },

  'argha-biswas': {
    slug: 'argha-biswas',
    name: 'Argha Biswas',
    role: 'CTO',
    fullRole: 'Chief Technology Officer',
    badge: 'Technology & Innovation',
    image: '/uploads/argha-biswas.jpg',
    email: 'cto@globalpathwayhub.com',
    phone: '+880 1410-555054',
    whatsapp: '8801410555054',
    location: 'Dhaka, Bangladesh',
    headline: 'Chief Technology Officer architecting high-performance digital admission platforms and real-time institutional data infrastructure.',
    bio: [
      'Argha Biswas serves as the Chief Technology Officer at GlobalPathwayHub, spearheading digital engineering, software architecture, and technology-driven student experience innovations.',
      'He directs the development of GlobalPathwayHub’s next-generation portal, featuring real-time worldwide university lookup engines, automated multi-currency tuition calculators, secure document upload infrastructure, and responsive admissions pipelines.',
      'With a deep technical foundation in modern web frameworks, cloud storage solutions, and distributed database systems, Argha ensures that prospective students, counselors, and university partners enjoy a rapid, resilient, and frictionless digital journey.',
    ],
    responsibilities: [
      'Platform architecture, web engineering, and cloud infrastructure management',
      'Real-time API integrations with worldwide institutional databases and currency registries',
      'Automated document verification, Cloudflare R2 object storage, and secure applicant data pipelines',
      'Continuous performance tuning, developer operations, and product security standards',
    ],
    expertise: [
      'Full-Stack Architecture',
      'Cloud & Serverless Infrastructure',
      'API Engineering & Data Integration',
      'Performance Optimization',
      'UI/UX Systems Design',
      'Security & Data Governance',
    ],
    education: 'Bachelor of Science in Computer Science & Engineering (BSc in CSE)',
    quote: 'Technology should empower human aspirations. We build digital tools that make discovering and applying to worldwide universities as seamless as sending a message.',
    color: 'from-indigo-600 to-purple-600',
    borderColor: 'border-indigo-200',
  },

  'shahriar-hassan': {
    slug: 'shahriar-hassan',
    name: 'Shahriar Hassan',
    role: 'Marketing and Management',
    fullRole: 'Head of Marketing & Management',
    badge: 'Growth & Operations',
    image: '/uploads/shahriar-hassan.jpg',
    email: 'hmm@globalpathwayhub.com',
    phone: '+880 1410-555054',
    whatsapp: '8801410555054',
    location: 'Dhaka, Bangladesh',
    headline: 'Head of Marketing & Management leading multi-channel student outreach, brand positioning, and counselor operational workflows.',
    bio: [
      'Shahriar Hassan leads Marketing and Management at GlobalPathwayHub, steering global brand strategy, youth community engagement, and operational counselor efficiency.',
      'He spearheads campaigns that bridge high school and university graduates with accredited global degree programs, organizing overseas education seminars, digital open days, and student workshop sessions.',
      'Shahriar coordinates between admissions counselors, prospective students, and partner universities, streamlining student inquiry lifecycles from initial contact through offer letter issuance and pre-departure briefings.',
    ],
    responsibilities: [
      'Global student acquisition strategy, multi-channel marketing, and campus engagement',
      'Overseas education expos, university seminar scheduling, and community workshops',
      'Lead management pipeline optimization, student consultation response times, and quality control',
      'Public relations, institutional branding, and cross-border promotional partnerships',
    ],
    expertise: [
      'Strategic Marketing',
      'Operations Management',
      'Student Community Engagement',
      'Counselor Team Leadership',
      'Brand & Digital Outreach',
      'Event & Seminar Coordination',
    ],
    education: 'Degree in Business Administration, Marketing & Management',
    quote: 'Connecting a student with their ideal university is about understanding their personal story, matching their passion with the right program, and walking beside them every step of the way.',
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-200',
  },
};

export const TEAM_LIST: TeamMember[] = Object.values(TEAM_MEMBERS);

