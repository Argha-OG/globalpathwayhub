export interface StudyDestination {
  name: string;
  shortName: string;
  code: string;
  tuition: string;
  living: string;
  duration: string;
  scholarship: string;
  intake: string;
  postStudyWork: string;
  partTimeWork: string;
  opportunityBadge: string;
  tag: string;
  keyAdvantage: string;
  image: string;
}

export const DESTINATIONS: StudyDestination[] = [
  {
    name: 'Malaysia',
    shortName: 'Malaysia',
    code: 'MY',
    tuition: '$4,500 – $9,000/yr',
    living: '$3,000 – $4,500/yr',
    duration: '3 Yrs (BSc) / 1.5 Yrs (MSc)',
    scholarship: 'Up to 50% Tuition Waiver',
    intake: 'March / July / Oct',
    postStudyWork: 'Graduate & Mobility Pass',
    partTimeWork: 'Up to 20 hrs/wk (breaks)',
    opportunityBadge: 'High Value & UK Transfers',
    tag: 'Affordable World-Class UK Transfers',
    keyAdvantage: 'UK & Australian accredited degrees with low living costs and fast EMGS eVAL processing.',
    image: '/images/malaysia-campus.jpg',
  },
  {
    name: 'Canada',
    shortName: 'Canada',
    code: 'CA',
    tuition: 'CAD 16,000 – 28,000/yr',
    living: 'CAD 12,000 – 16,000/yr',
    duration: '4 Yrs (BSc) / 2 Yrs (MSc)',
    scholarship: 'Entrance & Regional Bursaries',
    intake: 'Sept / Jan / May',
    postStudyWork: 'Up to 3 Years PGWP',
    partTimeWork: 'Up to 24 hrs/wk (off-campus)',
    opportunityBadge: '3-Yr Post-Study Work',
    tag: 'Post-Graduation Work Permits (PGWP)',
    keyAdvantage: 'Co-op paid internships and direct Post-Graduation Work Permit pathways toward residency.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Australia',
    shortName: 'Australia',
    code: 'AU',
    tuition: 'AUD 24,000 – 38,000/yr',
    living: 'AUD 21,000 – 25,000/yr',
    duration: '3 Yrs (BSc) / 2 Yrs (MSc)',
    scholarship: 'Vice-Chancellor Grants (20–30%)',
    intake: 'Feb / July',
    postStudyWork: '2–4 Yrs Subclass 485 Visa',
    partTimeWork: '48 hrs/fortnight (term)',
    opportunityBadge: 'High Student Wage Rate',
    tag: 'Extended Post-Study Work Visas',
    keyAdvantage: 'World-ranked Go8 & tech campuses with strong part-time earnings and extended stay rights.',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'United Kingdom',
    shortName: 'UK',
    code: 'GB',
    tuition: '£12,000 – £22,000/yr',
    living: '£9,000 – £12,000/yr',
    duration: '3 Yrs (BSc) / 1 Yr (MSc)',
    scholarship: 'Up to £5,000 Merit Award',
    intake: 'Sept / Jan',
    postStudyWork: '2 Yrs Graduate Route (3 Yrs PhD)',
    partTimeWork: '20 hrs/wk (full-time breaks)',
    opportunityBadge: '1-Year Master’s',
    tag: 'Fast 1-Year Master’s Available',
    keyAdvantage: 'Complete Master’s in 12 months with no GRE/GMAT and 2-year Graduate Route post-study work.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'France',
    shortName: 'France',
    code: 'FR',
    tuition: '€3,800 – €14,000/yr',
    living: '€8,000 – €11,000/yr',
    duration: '3 Yrs (BSc) / 1–2 Yrs (MSc)',
    scholarship: 'Eiffel, Charpak & CAF Aid',
    intake: 'Sept / Jan',
    postStudyWork: '2 Yrs APS Stay-Back Visa',
    partTimeWork: '964 hrs/yr (~20 hrs/wk)',
    opportunityBadge: 'CAF Housing Subsidy',
    tag: 'English-Taught Grandes Écoles',
    keyAdvantage: 'Subsidized tuition, monthly CAF housing allowance for students, and 2-year APS work visa.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'United States',
    shortName: 'USA',
    code: 'US',
    tuition: '$18,000 – $35,000/yr',
    living: '$10,000 – $15,000/yr',
    duration: '4 Yrs (BS) / 2 Yrs (MS)',
    scholarship: 'Dean’s & Research Grants',
    intake: 'Fall / Spring',
    postStudyWork: 'Up to 36 Mo STEM OPT',
    partTimeWork: '20 hrs/wk on-campus (+ CPT)',
    opportunityBadge: '36-Mo STEM Work',
    tag: 'OPT STEM Work Authorization',
    keyAdvantage: 'Top global research hubs, paid assistantships, and up to 3 years of STEM OPT work training.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Germany',
    shortName: 'Germany',
    code: 'DE',
    tuition: '€0 – €3,000 (Public)',
    living: '€9,500 – €11,900/yr',
    duration: '3–3.5 Yrs (BSc) / 2 Yrs (MSc)',
    scholarship: 'DAAD & Merit Waivers',
    intake: 'Oct / April',
    postStudyWork: '18 Mo Job Seeker Visa',
    partTimeWork: '140 full / 280 half days/yr',
    opportunityBadge: 'Low / €0 Public Tuition',
    tag: 'Zero/Low Tuition Engineering Hub',
    keyAdvantage: 'No or minimal tuition at public institutions and Europe’s strongest engineering job market.',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Ireland',
    shortName: 'Ireland',
    code: 'IE',
    tuition: '€11,000 – €20,000/yr',
    living: '€10,000 – €13,000/yr',
    duration: '3–4 Yrs (BSc) / 1 Yr (MSc)',
    scholarship: 'Govt & University Bursaries',
    intake: 'Sept / Jan',
    postStudyWork: '2 Yrs Stay-Back (Master’s)',
    partTimeWork: '20 hrs/wk (40 hrs/wk breaks)',
    opportunityBadge: 'EU English Tech Hub',
    tag: 'European Tech & Pharma Capital',
    keyAdvantage: 'Home to top global tech HQs in the EU with a 2-year Stay Back visa for Master’s graduates.',
    image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?q=80&w=1200&auto=format&fit=crop',
  },
];

export const DESTINATION_MAP: Record<string, StudyDestination> = Object.fromEntries(
  DESTINATIONS.map((d) => [d.name, d])
);
