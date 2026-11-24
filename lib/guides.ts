export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  country: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  images: Array<{ url: string; caption?: string }>;
  authorName: string;
  authorRole: string;
  readTime: string;
  featured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export const GUIDE_CATEGORIES = [
  'Survival Guide',
  'Study Reality',
  'Country Guide',
  'Visa & Finance',
  'Part-Time & Jobs',
  'Scholarships',
] as const;

export const GUIDE_COUNTRIES = [
  'Global',
  'Malaysia',
  'Canada',
  'Australia',
  'United Kingdom',
  'France',
  'United States',
  'Germany',
  'Ireland',
] as const;

export function slugifyGuideTitle(title: string): string {
  const cleaned = (title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned || `guide-${Date.now().toString(36)}`;
}

export function isBanglaGuide(guide: Pick<GuideArticle, 'title' | 'excerpt' | 'content'>): boolean {
  return /[\u0980-\u09FF]/.test(guide.title || guide.excerpt || '');
}

export const STARTER_GUIDES: GuideArticle[] = [
  // ── BANGLA SURVIVAL & STUDY ABROAD GUIDES (13 Researched Articles) ───────────────
  {
    id: 'guide_bn_reality_2026',
    slug: 'bn-part-time-job-reality-and-hidden-costs-abroad',
    title: 'পার্ট-টাইম চাকরির টাকায় কি বিদেশের টিউশন ও থাকা-খাওয়া চলে? ২০২৬-এর আসল হিসাব',
    category: 'Study Reality',
    country: 'Global',
    excerpt:
      'সোশ্যাল মিডিয়ার ভুয়া গল্পের বাইরে আসল বাস্তবতা: পার্ট-টাইম আয় দিয়ে কতটুকু খরচ ওঠে এবং প্রথম ৩ মাসের ক্যাশ বাফার কেন জরুরি।',
    content: `## সোশ্যাল মিডিয়া বনাম বাস্তব জীবনের হিসাব

বিদেশে পাড়ি জমানোর আগে অনেক শিক্ষার্থী মনে করেন, বিমানবন্দর থেকে নেমেই সপ্তাহে কাজ শুরু করে টিউশন ফি ও বাসা ভাড়া—দুটোই তুলে ফেলা যাবে। ২০২৬ সালের বর্তমান বিশ্ব অর্থনীতি ও ইমিগ্রেশন নিয়মে এই ধারণা সম্পূর্ণ অবাস্তব।

> **বাস্তব সতর্কতা:** কখনোই ভবিষ্যতের পার্ট-টাইম আয়ের ভরসায় বিশ্ববিদ্যালয়ের প্রথম বছরের টিউশন ফির কিস্তি বাকি রেখে বিদেশে আসবেন না। পড়াশোনার প্রথম ৩–৪ মাস চাকরি খুঁজতেই চলে যেতে পারে।

## ১. পার্ট-টাইম আয়ে আসলে কতটুকু কভার হয়?

- **নিত্যপ্রয়োজনীয় খরচ:** যুক্তরাজ্য (২০ ঘণ্টা/সপ্তাহ), কানাডা (২৪ ঘণ্টা/সপ্তাহ) বা অস্ট্রেলিয়ায় (৪৮ ঘণ্টা/১৪ দিন) বৈধভাবে কাজ করে মাসিক বাজার, লোকাল ট্রান্সপোর্ট ও মোবাইল/ইউটিলিটি বিল সামলানো সম্ভব।
- **বাসা ভাড়া ও টিউশন:** বড় শহরে (লন্ডন, টরন্টো, সিডনি) রুম ভাড়া এখন অনেক বেশি। পার্ট-টাইম আয় দিয়ে পুরো টিউশন ফি তোলা প্রায় অসম্ভব।
- **নগদ/অবৈধ কাজের ঝুঁকি:** অনুমোদিত ঘণ্টার বেশি "ক্যাশ-ইন-হ্যান্ড" কাজ করলে ধরা পড়লে ভিসা বাতিল হতে পারে—এবং ক্লাসে ফেল করলে রিপিট সাবজেক্টের ফি অনেক বেশি পড়ে।

## ২. যাওয়ার আগে থেকেই যে প্রস্তুতি নেবেন

1. **স্থানীয় ফরম্যাটে ১ পৃষ্ঠার সিভি বানান:** যুক্তরাজ্য, কানাডা বা অস্ট্রেলিয়ার সিভিতে ছবি, জন্মতারিখ বা বৈবাহিক অবস্থা দেবেন না।
2. **প্রথম সপ্তাহেই আবেদন করুন:** ক্যাম্পাসের লাইব্রেরি, ক্যাফেটেরিয়া, স্টুডেন্ট অ্যাম্বাসেডর ও রিটেইল চেইনে সরাসরি সিভি জমা দিন।
3. **৯০ দিনের জরুরি সঞ্চয় রাখুন:** অন্তত প্রথম ৩ মাসের বাসা ভাড়া ও খাবারের খরচ হাতে নিয়ে তবেই ফ্লাইট ধরুন।`,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'Abu Siam Khan',
    authorRole: 'Founder & CEO',
    readTime: '৫ মিনিট',
    featured: true,
    status: 'published',
    createdAt: '2026-11-24T10:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  },
  {
    id: 'guide_bn_uk_2026_rules',
    slug: 'bn-uk-student-visa-graduate-route-maintenance-2026',
    title: 'যুক্তরাজ্য (UK) স্টুডেন্ট ভিসা ২০২৬-২০২৭: নতুন ব্যাংক ব্যালেন্স, IHS ও ২ বছর থেকে ১৮ মাসের নিয়ম',
    category: 'Visa & Finance',
    country: 'United Kingdom',
    excerpt:
      'যুক্তরাজ্যের Graduate Route ভিসার মেয়াদ পরিবর্তন, ৩০ নভেম্বর ২০২৬ থেকে নতুন মাসিক ব্যাংক ব্যালেন্স ও ২৮-দিনের নিয়ম সম্পর্কে বিস্তারিত।',
    content: `## যুক্তরাজ্যে পড়াশোনার আগে নতুন নীতিমালা জেনে নিন

যুক্তরাজ্য দ্রুত ১ বছরের মাস্টার্স ডিগ্রির জন্য জনপ্রিয় হলেও ২০২৬ ও ২০২৭ সালে ভিসা খরচ ও পোস্ট-স্টাডি ওয়ার্ক নিয়মে গুরুত্বপূর্ণ পরিবর্তন কার্যকর হচ্ছে।

### ১. Graduate Route (পোস্ট-স্টাডি ওয়ার্ক ভিসা)

- **৩১ ডিসেম্বর ২০২৬ পর্যন্ত আবেদন:** ব্যাচেলর ও মাস্টার্স গ্র্যাজুয়েটরা ২ বছরের পোস্ট-স্টাডি ওয়ার্ক ভিসা পাবেন।
- **১ জানুয়ারি ২০২৭ থেকে পরিবর্তন:** ১ জানুয়ারি ২০২৭ বা তার পর আবেদনের ক্ষেত্রে স্ট্যান্ডার্ড Graduate Route-এর মেয়াদ ২ বছর থেকে কমে **১৮ মাস** হবে (তবে পিএইচডি শিক্ষার্থীদের জন্য ৩ বছরই থাকছে)।
- **ভিসা ফি ও স্বাস্থ্য চার্জ (IHS):** স্টুডেন্ট ভিসায় Immigration Health Surcharge বছরে **£৭৭৬** এবং পরবর্তীতে Graduate Route-এ গেলে তা বছরে **£১,০৩৫** হয়।

### ২. ব্যাংক ব্যালেন্স (Maintenance Funds) ও ২৮-দিনের নিয়ম

- **৩০ নভেম্বর ২০২৬ থেকে নতুন হার:** লন্ডনের ভেতরে পড়তে গেলে মাসে **£১,৫৭০** (৯ মাসে সর্বোচ্চ **£১৪,১৩০**) এবং লন্ডনের বাইরে মাসে **£১,২০৩** (৯ মাসে সর্বোচ্চ **£১০,৮২৭**) দেখাতে হবে (আগে যা ছিল £১,৫২৯ ও £১,১৭১)।
- **২৮-দিনের নিয়ম:** ভিসা আবেদনের আগে টাকা টানা **২৮ দিন** আপনার অ্যাকাউন্টে জমা থাকতে হবে এবং ব্যাংক স্টেটমেন্ট ৩১ দিনের বেশি পুরোনো হওয়া যাবে না।

### ৩. কাজের নিয়ম ও টিউশন সাশ্রয়

1. সেমিস্টার চলাকালীন সপ্তাহে সর্বোচ্চ **২০ ঘণ্টা** এবং অফিশিয়াল ছুটিতে পূর্ণ-সময় কাজ করা যায়।
2. ফুল-টাইম বিশ্ববিদ্যালয় শিক্ষার্থী হিসেবে লোকাল কাউন্সিলে **Council Tax Exemption Letter** জমা দিতে ভুলবেন না—এতে প্রতি মাসে বড় অঙ্কের ট্যাক্স বাঁচবে।`,
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'GlobalPathwayHub Advisory',
    authorRole: 'UK Admissions Desk',
    readTime: '৬ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-23T11:00:00.000Z',
    updatedAt: '2026-11-23T11:00:00.000Z',
  },
  {
    id: 'guide_bn_canada_2026',
    slug: 'bn-canada-study-permit-gic-23448-pal-pgwp-2026',
    title: 'কানাডা স্টাডি পারমিট ২০২৬: নতুন GIC হিসাব (CAD $২৩,৪৪৮), PAL চিঠি এবং ২৪ ঘণ্টা কাজের নিয়ম',
    category: 'Country Guide',
    country: 'Canada',
    excerpt:
      'পুরোনো $২০,৬৩৫ হিসাব আর চলবে না—সেপ্টেম্বর ২০২৬ থেকে কানাডায় জীবনযাত্রার খরচ প্রমাণ, PAL, ২৪ ঘণ্টা ওয়ার্ক ক্যাপ ও PGWP শর্ত।',
    content: `## কানাডা ফাইল জমা দেওয়ার আগে অবশ্যই আপডেটেড হিসাব জানুন

অনেক শিক্ষার্থী এখনো পুরোনো ১০,০০০ বা ২০,৬৩৫ ডলারের হিসাব দেখে কানাডার প্রস্তুতি নেন। কিন্তু ফেডারেল কস্ট-অফ-লিভিং (LICO) নীতিমালা অনুযায়ী আর্থিক প্রমাণের অঙ্ক এখন অনেক বেড়েছে।

> **জরুরি আপডেট:** ১ সেপ্টেম্বর ২০২৬ থেকে কানাডার বাইরে থাকা একজন শিক্ষার্থীর জন্য ন্যূনতম জীবনযাত্রার খরচ প্রমাণ বেড়ে **CAD $২৩,৪৪৮** নির্ধারিত হয়েছে (যা জানুয়ারি ২০২৫–আগস্ট ২০২৬ মেয়াদে ছিল **CAD $২২,৮৯৫**)। এই অঙ্কের সাথে ১ম বছরের সম্পূর্ণ টিউশন ও বিমান ভাড়া আলাদাভাবে যোগ হবে।

### ১. PAL (Provincial Attestation Letter)

- কানাডার অধিকাংশ ডিপ্লোমা ও ব্যাচেলর প্রোগ্রামের ভিসা আবেদনে প্রাদেশিক **PAL চিঠি** বাধ্যতামূলক। বিশ্ববিদ্যালয়ে অফার পাওয়ার পর ডিপোজিট জমা দিলে প্রতিষ্ঠান আপনার হয়ে প্রদেশের কোটায় PAL ইস্যু করে।

### ২. অফ-ক্যাম্পাস কাজের সময়সীমা (২৪ ঘণ্টা নিয়ম)

- পূর্ণকালীন DLI প্রতিষ্ঠানে পড়ার সময় সেমিস্টার চলাকালীন সপ্তাহে সর্বোচ্চ **২৪ ঘণ্টা** ক্যাম্পাসের বাইরে কাজ করা বৈধ।
- নির্ধারিত শীত বা গ্রীষ্মকালীন ছুটিতে কোনো ঘণ্টার সীমা থাকে না। অনুমোদিত ২৪ ঘণ্টার বেশি কাজ করলে পরবর্তীতে স্টাডি পারমিট নবায়ন বা ওয়ার্ক পারমিট বাতিল হতে পারে।

### ৩. PGWP (Post-Graduation Work Permit) পাওয়ার শর্ত

1. কমপক্ষে **৮ মাসের** পূর্ণকালীন PGWP-যোগ্য কোর্স সফলভাবে শেষ করতে হবে।
2. প্রতিটি সেমিস্টারে (শেষ টার্ম বাদে) ফুল-টাইম স্ট্যাটাস বজায় রাখতে হবে।
3. চূড়ান্ত ফলাফল পাওয়ার **১৮০ দিনের মধ্যে** ভাষা দক্ষতার স্কোরসহ PGWP আবেদন জমা দিতে হবে।`,
    coverImage: null,
    images: [],
    authorName: 'GlobalPathwayHub Advisory',
    authorRole: 'Canada Visa Desk',
    readTime: '৫ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-22T14:00:00.000Z',
    updatedAt: '2026-11-22T14:00:00.000Z',
  },
  {
    id: 'guide_bn_malaysia_reality',
    slug: 'bn-malaysia-emgs-student-pass-part-time-work-truth',
    title: 'মালয়েশিয়ায় পড়াশোনা ও পার্ট-টাইম কাজের আসল সত্য: EMGS ভিসা ও নিয়মকানুন',
    category: 'Study Reality',
    country: 'Malaysia',
    excerpt:
      'কম খরচে UK/অস্ট্রেলিয়ান ডিগ্রির সেরা গন্তব্য মালয়েশিয়া—তবে ক্লাস চলাকালীন কাজের বিষয়ে দালালদের মিথ্যা আশ্বাস থেকে সাবধান।',
    content: `## মালয়েশিয়ায় কম খরচে বিশ্বমানের ডিগ্রি—কিন্তু নিয়মগুলো স্পষ্ট জানুন

বাংলাদেশি শিক্ষার্থীদের জন্য মালয়েশিয়া অন্যতম সেরা ও সাশ্রয়ী গন্তব্য। কুয়ালালামপুর বা সাইবারজায়ায় থাকা-খাওয়ার মাসিক খরচ সাধারণত **RM ১,৫০০ থেকে RM ২,৫০০** (প্রায় ৪৫,০০০–৭৫,০০০ টাকা)-এর মধ্যে সামলানো যায়।

> **সবচেয়ে বড় সতর্কতা (কাজের নিয়ম):** ইউরোপ, কানাডা বা অস্ট্রেলিয়ার মতো মালয়েশিয়ায় **ক্লাস বা সেমিস্টার চলাকালীন কোনো পার্ট-টাইম কাজ করার অনুমতি নেই**! কোনো এজেন্ট যদি বলে মালয়েশিয়ায় গিয়েই পড়াশোনার পাশাপাশি পুরোদমে কাজ করে খরচ চালানো যায়, সেটি সম্পূর্ণ মিথ্যা।

### বৈধভাবে মালয়েশিয়ায় কখন ও কোথায় কাজ করা যায়?

1. **সময়সীমা:** কেবল **৭ দিনের বেশি দীর্ঘ অফিশিয়াল সেমিস্টার ব্রেকে** সপ্তাহে সর্বোচ্চ **২০ ঘণ্টা** কাজ করা যায়।
2. **অনুমোদিত খাত:** কেবল ৪টি খাতে কাজের সুযোগ আছে—**রেস্টুরেন্ট/ক্যাফে, মিনি-মার্কেট, পেট্রোল পাম্প এবং হোটেল**।
3. **নিষিদ্ধ পদ:** ক্যাশিয়ার, ফ্রন্ট-ডেস্ক, মিউজিশিয়ান বা স্টুডেন্ট রিক্রুটিং এজেন্ট হিসেবে কাজ করা সম্পূর্ণ নিষিদ্ধ।
4. **আগেই অনুমতি:** কাজ শুরুর আগে বিশ্ববিদ্যালয়ের ইন্টারন্যাশনাল অফিসের মাধ্যমে ইমিগ্রেশন ডিপার্টমেন্টের লিখিত অনুমোদন নিতে হয়।

### তাহলে মালয়েশিয়া কেন এত জনপ্রিয়?

- টিউশন ও থাকা-খাওয়া মিলিয়ে ইউরোপ-আমেরিকার তুলনায় **৬০% কম খরচে** আন্তর্জাতিক মানের ডিগ্রি।
- ব্রিটিশ ও অস্ট্রেলিয়ান ক্যাম্পাস ও **Credit Transfer (ডুয়াল ডিগ্রি)** সুবিধায় ১–২ বছর মালয়েশিয়ায় পড়ে শেষ বছর যুক্তরাজ্য বা অস্ট্রেলিয়ায় যাওয়ার সহজ পথ।
- **EMGS eVAL** ভিসা প্রসেস স্বচ্ছ এবং ব্যাংক জটিলতা তুলনামূলক অনেক কম।`,
    coverImage: null,
    images: [],
    authorName: 'Abu Siam Khan',
    authorRole: 'Founder & CEO',
    readTime: '৫ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-21T16:30:00.000Z',
    updatedAt: '2026-11-21T16:30:00.000Z',
  },
  {
    id: 'guide_bn_australia_500_485',
    slug: 'bn-australia-student-visa-29710-aud-work-rules',
    title: 'অস্ট্রেলিয়া স্টুডেন্ট ভিসা (Subclass 500): ২৯,৭১০ AUD ফান্ড, ৪৮ ঘণ্টা কাজ ও টিকে থাকার কৌশল',
    category: 'Country Guide',
    country: 'Australia',
    excerpt:
      'অস্ট্রেলিয়ায় ভিসা পেতে প্রকৃত আর্থিক সক্ষমতা, Genuine Student (GS) স্টেটমেন্ট এবং প্রতি ১৪ দিনে ৪৮ ঘণ্টা কাজের নিয়ম।',
    content: `## অস্ট্রেলিয়ার বর্তমান ভিসা ও জীবনযাত্রার বাস্তব চিত্র

উচ্চ পার্ট-টাইম মজুরির কারণে অস্ট্রেলিয়া বাংলাদেশি শিক্ষার্থীদের পছন্দের তালিকায় শীর্ষে থাকলেও ডিপার্টমেন্ট অব হোম অ্যাফেয়ার্সের (DHA) যাচাই-বাছাই এখন অত্যন্ত কঠোর।

### ১. আর্থিক সক্ষমতার প্রমাণ (AUD $২৯,৭১০)

- ভিসা আবেদনে একজন শিক্ষার্থীর **১২ মাসের জীবনযাত্রার খরচ** হিসেবে ন্যূনতম **AUD $২৯,৭১০** প্রমাণ দেখাতে হয়।
- এর সাথে ১ম বছরের বাকি টিউশন ফি এবং যাতায়াতের বিমান ভাড়া (~AUD $২,০০০) যোগ করতে হবে।
- বিকল্প হিসেবে অভিভাবকের বার্ষিক ব্যক্তিগত আয়ের বৈধ ও ট্যাক্স-নথিভুক্ত প্রমাণ (কমপক্ষে **AUD $৮৭,৮৫৬** বা প্রযোজ্য সীমা) গ্রহণযোগ্য হয়।

### ২. কাজের সময়সীমা (Condition 8105: ৪৮ ঘণ্টা/পাক্ষিক)

- সেমিস্টার চলাকালীন **প্রতি ১৪ দিনে (সোমবার থেকে শুরু হওয়া দুই সপ্তাহে) সর্বোচ্চ ৪৮ ঘণ্টা** কাজ করা যায়। কোনোভাবেই এর বেশি নয়।
- অফিশিয়াল সেমিস্টার ছুটিতে ঘণ্টার কোনো সীমাবদ্ধতা থাকে না।
- পিএইচডি বা মাস্টার্স বাই রিসার্চ শিক্ষার্থীদের জন্য কোর্স শুরু হওয়ার পর থেকে কাজের ঘণ্টায় কোনো সীমা থাকে না।

### ৩. সিডনি-মেলবোর্নে আবাসন ও খরচ কমানোর উপায়

1. অস্ট্রেলিয়ার বড় শহরে ভ্যাকেন্সি রেট খুব কম। দেশ থেকে যাওয়ার আগেই অস্থায়ী স্টুডেন্ট হোমস্টে বা পিবিএসএ (PBSA) নিশ্চিত করুন।
2. আঞ্চলিক শহর (যেমন—এডিলেড, পার্থ, ব্রিসবেন বা গোল্ড কোস্ট) বেছে নিলে বাসা ভাড়া যেমন কম হয়, তেমনি পড়াশোনা শেষে **Subclass 485 (Temporary Graduate Visa)**-এ বাড়তি থাকার সুবিধা মেলে।`,
    coverImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'GlobalPathwayHub Advisory',
    authorRole: 'Oceania Advisory Desk',
    readTime: '৫ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-20T12:00:00.000Z',
    updatedAt: '2026-11-20T12:00:00.000Z',
  },
  {
    id: 'guide_bn_france_caf_aps',
    slug: 'bn-france-study-caf-housing-964-hours-aps-visa',
    title: 'ফ্রান্সে পড়াশোনা ও বেঁচে থাকার গাইড: Campus France, ৯৬৪ ঘণ্টা কাজ, CAF ও APS ওয়ার্ক ভিসা',
    category: 'Country Guide',
    country: 'France',
    excerpt:
      'ইংরেজি মাধ্যমে পড়াশোনা, Visale ফ্রি বাসা গ্যারান্টর, CAF ভর্তুকির নতুন নিয়ম এবং পড়াশোনা শেষে ১–২ বছরের RECE/APS চাকরি ভিসা।',
    content: `## ইউরোপে সাশ্রয়ী বাজেটে সেরা ক্যারিয়ার সুযোগ: ফ্রান্স

অনেকেই মনে করেন ফ্রান্সে কেবল ফরাসি ভাষায় পড়াশোনা হয়—এটি ভুল। ফ্রান্সের বিখ্যাত বিজনেস স্কুল (Grandes Écoles) ও ইঞ্জিনিয়ারিং বিশ্ববিদ্যালয়গুলোতে শত শত **১০০% ইংরেজি মাধ্যম** ব্যাচেলর ও মাস্টার্স প্রোগ্রাম রয়েছে।

### ১. ভিসা ফান্ড ও কাজের অধিকার (৯৬৪ ঘণ্টা/বছর)

- Campus France (*Études en France*) এবং VLS-TS দীর্ঘমেয়াদি স্টুডেন্ট ভিসার জন্য মাসে ন্যূনতম **€৬১৫** (বছরে **€৭,৩৮০**) ব্যাংক ফান্ড বা স্কলারশিপ দেখাতে হয়।
- আপনার VLS-TS ভিসাই আপনাকে বছরে **৯৬৪ ঘণ্টা পর্যন্ত** (গড়ে সপ্তাহে ~২০ ঘণ্টা) বৈধভাবে কাজ করার অনুমতি দেয়—আলাদা ওয়ার্ক পারমিট লাগে না।

### ২. CAF বাসা ভাড়া ভর্তুকি (নতুন নিয়ম সতর্কতা)

- **CAF (APL/ALS)** শিক্ষার্থীদের মাসিক বাসা ভাড়ায় বড় সহায়তা দেয়। তবে সাম্প্রতিক নীতিমালা অনুযায়ী নন-ইইউ শিক্ষার্থীদের CAF সুবিধা পেতে হলে বৈধ পার্ট-টাইম বা *alternance* (অ্যাপ্রেন্টিসশিপ) কাজের চুক্তি কিংবা নির্দিষ্ট CROUS সামাজিক স্কলারশিপের শর্ত পূরণ করতে হতে পারে—তাই শুরু থেকেই বৈধ পার্ট-টাইম জব বা *alternance* খোঁজা লাভজনক।
- ৩০ বছরের কম বয়সী আন্তর্জাতিক শিক্ষার্থীদের বাসা ভাড়ায় জামানতের জন্য **Visale** নামক বিনামূল্যের সরকারি গ্যারান্টর সেবা ব্যবহার করুন।

### ৩. পড়াশোনা শেষে ১–২ বছরের স্টে-ব্যাক ভিসা (RECE / APS)

- মাস্টার্স বা সমমানের ডিগ্রি শেষে শিক্ষার্থীরা **RECE / APS** রেসিডেন্স পারমিট নিয়ে ফ্রান্সে **১ থেকে ২ বছর** অবস্থান করে চাকরি খুঁজতে বা নিজের স্টার্টআপ শুরু করতে পারেন।
- **টিপস:** ইংরেজিতে ডিগ্রি হলেও দেশ থেকে যাওয়ার আগেই A1/A2 লেভেলের প্রাথমিক ফরাসি ভাষা শিখে নিলে খাবারের দোকান, সুপারমার্কেট ও ইন্টার্নশিপ পাওয়া দ্বিগুণ সহজ হয়।`,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'Shahriar Hassan',
    authorRole: 'Head of Marketing & Management',
    readTime: '৬ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-19T09:30:00.000Z',
    updatedAt: '2026-11-19T09:30:00.000Z',
  },
  {
    id: 'guide_bn_germany_blocked_account',
    slug: 'bn-germany-free-tuition-blocked-account-11904-job-seeker',
    title: 'জার্মানিতে টিউশন-ফ্রি পড়াশোনা ও ব্লকড অ্যাকাউন্ট (€১১,৯০৪): সম্পূর্ণ খরচ ও কাজের নিয়ম',
    category: 'Country Guide',
    country: 'Germany',
    excerpt:
      'পাবলিক বিশ্ববিদ্যালয়ে বিনা টিউশনে পড়ার খরচ, Sperrkonto থেকে মাসে €৯৯২ তোলার নিয়ম এবং গ্র্যাজুয়েশনের পর ১৮ মাসের জব-সিকার ভিসা।',
    content: `## ইউরোপের ইঞ্জিনিয়ারিং ও টেক হাব জার্মানির বাস্তব চিত্র

জার্মানির সরকারি বিশ্ববিদ্যালয়গুলোতে (Baden-Württemberg রাজ্যের কিছু বিশ্ববিদ্যালয় বাদে) টিউশন ফি প্রায় শূন্য, কেবল প্রতি সেমিস্টারে €১৫০–€৩৫০ সেমিস্টার কন্ট্রিবিউশন (যার ভেতর ট্রান্সপোর্ট পাসও থাকে) দিতে হয়।

### ১. ব্লকড অ্যাকাউন্ট (Sperrkonto) ২০২৫–২০২৬

- স্টুডেন্ট ভিসার জন্য আপনার নিজের নামে জার্মান ব্লকড অ্যাকাউন্টে **€১১,৯০৪** জমা রাখতে হবে।
- জার্মানি পৌঁছানোর পর এই অ্যাকাউন্ট থেকে আপনি প্রতি মাসে **€৯৯২** করে নিজের ব্যাংক অ্যাকাউন্টে তুলতে পারবেন এবং তা দিয়ে থাকা-খাওয়ার মূল খরচ চালাবেন।

### ২. পড়াশোনা অবস্থায় কাজের সীমা

- শিক্ষার্থীরা বছরে **১৪০ পূর্ণ দিন বা ২৮০ অর্ধ দিন** (অথবা সপ্তাহে সর্বোচ্চ ২০ ঘণ্টা) কাজ করতে পারেন।
- বিশ্ববিদ্যালয়ের ভেতরে **HiWi (Research/Student Assistant)** হিসেবে কাজ পেলে যেমন পড়াশোনার সাথে মিল থাকে, তেমনি ১৪০-দিনের কোটাতেও বাড়তি সুবিধা পাওয়া যায়।

### ৩. পড়াশোনা শেষে ১৮ মাসের Job Seeker Visa (§20 AufenthG)

1. জার্মান বিশ্ববিদ্যালয় থেকে ব্যাচেলর, মাস্টার্স বা পিএইচডি শেষ করার পর আপনি **১৮ মাসের চাকরি খোঁজার রেসিডেন্স পারমিট** পাবেন।
2. এই ১৮ মাসে শিক্ষার্থীদের **কাজের কোনো ঘণ্টা-সীমা থাকে না**—আপনি পূর্ণ-সময় যেকোনো কাজ করে নিজের খরচ চালিয়ে আপনার ডিগ্রি-সম্পর্কিত চাকরির জন্য প্রস্তুতি নিতে পারবেন।`,
    coverImage: null,
    images: [],
    authorName: 'Argha Biswas',
    authorRole: 'Chief Technology Officer',
    readTime: '৫ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-18T11:00:00.000Z',
    updatedAt: '2026-11-18T11:00:00.000Z',
  },
  {
    id: 'guide_bn_ireland_stamp_1g',
    slug: 'bn-ireland-study-10000-euro-6-months-statement-stamp-1g',
    title: 'আয়ারল্যান্ডে পড়াশোনা ও Stamp 1G ভিসা: €১০,০০০ প্রমাণ ও ৬ মাসের ব্যাংক স্টেটমেন্টের কঠোর নিয়ম',
    category: 'Country Guide',
    country: 'Ireland',
    excerpt:
      'আয়ারল্যান্ডের ভিসায় হঠাৎ জমা দেওয়া টাকা কেন রিজেক্ট হয়, প্রথম বছরের টিউশন পরিশোধ এবং পড়াশোনা শেষে ২ বছরের Stamp 1G সুযোগ।',
    content: `## ইউরোপীয় ইউনিয়নের একমাত্র ইংরেজিভাষী টেক রাজধানী: আয়ারল্যান্ড

গুগল, মেটা, অ্যাপল ও বিশ্বের শীর্ষ ফার্মাসিউটিক্যাল কোম্পানিগুলোর ইউরোপীয় সদর দপ্তর ডাবলিনে অবস্থিত। তাই আইটি, ডেটা সায়েন্স, ফাইন্যান্স ও বায়োটেক শিক্ষার্থীদের জন্য আয়ারল্যান্ড এক অসাধারণ গন্তব্য।

> **আয়ারল্যান্ড ভিসার গুরুত্বপূর্ণ সতর্কতা:** আয়ারল্যান্ড ইমিগ্রেশন (ISD) আর্থিক কাগজপত্র খুব সূক্ষ্মভাবে যাচাই করে। ভিসার আগে **টানা ৬ মাসের নিরবচ্ছিন্ন ব্যাংক স্টেটমেন্ট** জমা দেওয়া জরুরি। হঠাৎ করে ভিসার ২ সপ্তাহ আগে বড় অঙ্কের টাকা অ্যাকাউন্টে জমা করলে ("Parked Funds") ভিসা বাতিল হওয়ার ঝুঁকি অনেক বেশি।

### ১. আর্থিক ও টিউশন নিয়ম

- ১ বছরের বেশি কোর্সের ক্ষেত্রে জীবনযাত্রার খরচ বাবদ ন্যূনতম **€১০,০০০** তাৎক্ষণিকভাবে ব্যবহারযোগ্য হিসেবে প্রমাণ করতে হবে (৮ মাসের কম কোর্সে মাসে €৮৩৩ হিসেবে)।
- এর পাশাপাশি ১ম বছরের **সম্পূর্ণ টিউশন ফি পরিশোধের** প্রমাণ বা বিশ্ববিদ্যালয়ের অনুমোদিত পেমেন্ট রসিদ দেখানো বাধ্যতামূলক এবং পরবর্তী বছরগুলোর খরচ কীভাবে চলবে তার স্পষ্ট আর্থিক পরিকল্পনা দিতে হবে।

### ২. কাজের সুযোগ ও Stamp 1G (Post-Study Work)

- টার্ম চলাকালীন সপ্তাহে **২০ ঘণ্টা** এবং ছুটিতে **৪০ ঘণ্টা** কাজ করা যায়।
- Level 8 (ব্যাচেলর) বা Level 9 (মাস্টার্স) শেষ করে **Stamp 1G** গ্র্যাজুয়েট ভিসায় সপ্তাহে **৪০ ঘণ্টা পূর্ণ-সময়** কাজ করা যায় (মাস্টার্সে সর্বোচ্চ ২ বছর পর্যন্ত নবায়নযোগ্য)। Stamp 1G থেকে Critical Skills Employment Permit-এ রূপান্তর অনেক দ্রুত হয়।`,
    coverImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'GlobalPathwayHub Advisory',
    authorRole: 'Europe Advisory Desk',
    readTime: '৫ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-17T10:15:00.000Z',
    updatedAt: '2026-11-17T10:15:00.000Z',
  },
  {
    id: 'guide_bn_usa_f1_stem_opt',
    slug: 'bn-usa-f1-visa-sevis-350-cpt-stem-opt-36-months',
    title: 'আমেরিকায় F-1 ভিসা ও STEM OPT: $৩৫০ SEVIS ফি, CPT-এর ফাঁদ ও ৩৬ মাসের কাজের সুযোগ',
    category: 'Visa & Finance',
    country: 'United States',
    excerpt:
      'ভিসা ইন্টারভিউয়ের আগে SEVIS ফি পরিশোধ, ক্যাম্পাসে ২০ ঘণ্টা কাজ এবং কোন ভুলের কারণে পুরো OPT সুবিধা বাতিল হয়ে যায়।',
    content: `## আমেরিকার F-1 ভিসা ও ক্যারিয়ার গড়ার সঠিক নিয়ম

গবেষণা অনুদান, টিচিং/রিসার্চ অ্যাসিস্ট্যান্টশিপ (TA/RA) এবং বড় চাকরির বাজারের কারণে যুক্তরাষ্ট্র এখনো মেধাবী শিক্ষার্থীদের প্রথম পছন্দ।

### ১. ভিসা ইন্টারভিউ ও SEVIS ফি ($৩৫০)

- বিশ্ববিদ্যালয় থেকে **Form I-20** পাওয়ার পর দূতাবাসে ইন্টারভিউ দিতে যাওয়ার আগেই fmjfee.com পোর্টালে গিয়ে **$৩৫০ SEVIS (I-901) ফি** পরিশোধ করতে হবে (MRV ভিসা ফি থেকে এটি আলাদা)।

### ২. ক্যাম্পাসে কাজ ও CPT-এর গুরুত্বপূর্ণ সতর্কতা

- ক্লাস চলাকালীন সপ্তাহে সর্বোচ্চ **২০ ঘণ্টা অন-ক্যাম্পাস** (লাইব্রেরি, ডাইনিং, TA/RA) এবং গ্রীষ্ম/শীতের ছুটিতে পূর্ণ-সময় কাজ করা বৈধ।
- **CPT (Curricular Practical Training) সতর্কতা:** ডিগ্রির অংশ হিসেবে ইন্টার্নশিপের জন্য CPT নেওয়া যায়—কিন্তু মনে রাখবেন, যদি আপনি **১২ মাস বা তার বেশি পূর্ণ-সময় (Full-time) CPT** ব্যবহার করেন, তবে ওই লেভেলের জন্য আপনার স্নাতকোত্তর **OPT সম্পূর্ণভাবে বাতিল** হয়ে যাবে! পার্ট-টাইম CPT করলে OPT নষ্ট হয় না।

### ৩. গ্রাজুয়েশনের পর ১২ থেকে ৩৬ মাসের OPT

1. ডিগ্রি শেষে সাধারণ **১২ মাসের OPT** পাওয়া যায়।
2. আপনার মেজর যদি অনুমোদিত **STEM (Science, Technology, Engineering, Math)** তালিকায় থাকে এবং নিয়োগকর্তা **E-Verify** নিবন্ধিত হন, তবে আরও **২৪ মাসের এক্সটেনশন** সহ মোট **৩৬ মাস (৩ বছর)** আমেরিকায় কাজের সুযোগ পাবেন।`,
    coverImage: null,
    images: [],
    authorName: 'GlobalPathwayHub Advisory',
    authorRole: 'USA Advisory Desk',
    readTime: '৫ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-16T08:45:00.000Z',
    updatedAt: '2026-11-16T08:45:00.000Z',
  },
  {
    id: 'guide_bn_rental_scams',
    slug: 'bn-avoid-rental-scams-abroad-uk-canada-australia',
    title: 'বিদেশে বাসা ভাড়ার প্রতারণা (Rental Scam) থেকে বাঁচার গাইড: লন্ডন, টরন্টো ও সিডনির নিয়ম',
    category: 'Survival Guide',
    country: 'Global',
    excerpt:
      'ভুয়া ফেসবুক লিস্টিং ও "বাড়িওয়ালা বিদেশে আছেন" গল্প চেনার উপায় এবং টাকা দেওয়ার আগে ৫টি আইনি নিরাপত্তা ধাপ।',
    content: `## নতুন শিক্ষার্থীরা কেন বাসা ভাড়ার প্রতারণার শিকার হন?

দেশ থেকে ফ্লাইট ধরার আগে তাড়াহুড়োয় কম ভাড়ার লোভে পড়ে প্রতি বছর অনেক শিক্ষার্থী ফেসবুক গ্রুপ বা অজানা লিস্টিংয়ে অগ্রিম টাকা পাঠিয়ে প্রতারিত হন।

### প্রতারকদের ৫টি পরিচিত চিহ্ন

- **"বাড়িওয়ালা এখন দেশের বাইরে আছেন":** দাবি করে যে চাবি কুরিয়ার করে দেবে, তবে আগে ব্যাংক বা মানি ট্রান্সফার/ক্রিপ্টো দিয়ে টাকা পাঠাতে হবে।
- **বাজারের চেয়ে অস্বাভাবিক কম ভাড়া:** লন্ডন বা টরন্টোতে শহরের কেন্দ্রের লাক্সারি ফ্ল্যাট অর্ধেক ভাড়ায় দেখালে সেটি নিশ্চিত প্রতারণা।
- **লাইভ ভিডিও ট্যুরে অনীহা:** লাইভ হোয়াটসঅ্যাপ/জুম কলে ফ্ল্যাট দেখিয়ে পানির কল খুলে বা জানালা দিয়ে রাস্তা দেখাতে বললে অজুহাত দেয়।

### দেশভেদে আপনার আইনি সুরক্ষা

1. **যুক্তরাজ্য (UK):** নিরাপত্তা জামানত সর্বোচ্চ **৫ সপ্তাহের ভাড়ার** বেশি হতে পারবে না এবং বাড়িওয়ালাকে অবশ্যই সরকারি **Deposit Protection Scheme (DPS/TDS/MyDeposits)**-এ টাকা জমা রাখতে হবে।
2. **কানাডা (Ontario):** অন্টারিওতে কেবল চলতি ও শেষ মাসের ভাড়া নেওয়া যায়; অতিরিক্ত ড্যামেজ ডিপোজিট নেওয়া বেআইনি। Interac e-Transfer-এ যাচাই ছাড়া টাকা দেবেন না।
3. **অস্ট্রেলিয়া (Australia):** রেন্টাল বন্ড সাধারণত **৪ সপ্তাহের ভাড়ার সমান** ও তা রাজ্যের সরকারি ট্রাস্ট অ্যাকাউন্টে (যেমন—NSW Fair Trading বা RTBA) জমা হয়, কোনো ব্যক্তির ব্যক্তিগত অ্যাকাউন্টে নয়।

> **নিরাপদ পথ:** প্রথম ৪–৮ সপ্তাহের জন্য বিশ্ববিদ্যালয়ের ডর্ম বা অনুমোদিত স্টুডেন্ট রেসিডেন্স (PBSA) বুক করে দেশে বসে ঝুঁকি এড়ান।`,
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'GlobalPathwayHub Advisory',
    authorRole: 'Student Safety Desk',
    readTime: '৫ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-15T13:00:00.000Z',
    updatedAt: '2026-11-15T13:00:00.000Z',
  },
  {
    id: 'guide_bn_first_30_days',
    slug: 'bn-first-30-days-checklist-abroad-survival',
    title: 'বিদেশে নেমে প্রথম ৩০ দিনে কী কী কাজ অবশ্যই শেষ করবেন? সম্পূর্ণ সারভাইভাল চেকলিস্ট',
    category: 'Survival Guide',
    country: 'Global',
    excerpt:
      'এয়ারপোর্ট থেকে নেমে সিম কার্ড, ব্যাংক অ্যাকাউন্ট, ট্যাক্স নম্বর, ডাক্তার নিবন্ধন ও প্রতারণা থেকে নিরাপদ থাকার সপ্তাহভিত্তিক রোডম্যাপ।',
    content: `## নতুন দেশে প্রথম এক মাসই আপনার ভিত্তি গড়ে দেবে

বিদেশে পৌঁছানোর প্রথম কয়েক দিন সবকিছু অচেনা লাগে। কোন কাজটি আগে করবেন আর কোনটি পরে, তা জানা থাকলে অহেতুক জরিমানা ও দুশ্চিন্তা এড়ানো যায়।

### সপ্তাহ ১: যোগাযোগ, কার্ড ও অস্থায়ী নিরাপত্তা
- বিমানবন্দরে সামান্য স্থানীয় নগদ টাকা ও ২ সপ্তাহের জরুরি বাফার রাখুন।
- শহরের অনুমোদিত টেলিকম দোকান থেকে লোকাল সিম বা eSIM চালু করুন এবং শিক্ষার্থীর জন্য মাসিক ট্রানজিট পাস সংগ্রহ করুন।
- বিশ্ববিদ্যালয়ের ইমার্জেন্সি সিকিউরিটি নম্বর ও বাংলাদেশ দূতাবাসের হেল্পলাইন ফোনে সেভ রাখুন।

### সপ্তাহ ২: বিশ্ববিদ্যালয় এনরোলমেন্ট ও ব্যাংক অ্যাকাউন্ট
1. ক্যাম্পাসে সরাসরি উপস্থিত হয়ে অফিশিয়াল রেজিস্ট্রেশন সম্পন্ন করে **Student Status Letter** সংগ্রহ করুন।
2. এই চিঠি নিয়ে একটি লোকাল স্টুডেন্ট ব্যাংক অ্যাকাউন্ট খুলুন (একটি হাই-স্ট্রিট ব্যাংক + একটি ডিজিটাল ব্যাংক অ্যাকাউন্ট রাখা সুবিধাজনক)।
3. বৈধভাবে কাজের বেতন নিতে ট্যাক্স/আইডি নম্বরের জন্য আবেদন করুন (UK-তে **NI Number**, কানাডায় **SIN**, অস্ট্রেলিয়ায় **TFN**)।

### সপ্তাহ ৩–৪: স্বাস্থ্যসেবা ও স্ক্যাম প্রতিরোধ
- অসুস্থ হওয়ার অপেক্ষা না করে সুস্থ অবস্থাতেই নিকটস্থ সরকারি ক্লিনিকে **GP / NHS / Ameli** রেজিস্ট্রেশন সেরে ফেলুন।
- **"ইমিগ্রেশন পুলিশ বা ট্যাক্স অফিস"** পরিচয়ে ফোন করে জরিমানা বা গিফট কার্ড চাইলে তাৎক্ষণিক কল কেটে দিন—সরকারি সংস্থা কখনো ফোনে হুমকি দিয়ে টাকা চায় না।`,
    coverImage: null,
    images: [],
    authorName: 'GlobalPathwayHub Advisory',
    authorRole: 'Student Transition Desk',
    readTime: '৪ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-14T10:00:00.000Z',
    updatedAt: '2026-11-14T10:00:00.000Z',
  },
  {
    id: 'guide_bn_mental_health_loneliness',
    slug: 'bn-overcoming-loneliness-culture-shock-winter-abroad',
    title: 'বিদেশে একা থাকা, শীতের বিষণ্ণতা ও মানসিক চাপ কীভাবে সামলাবেন? শিক্ষার্থীদের বাস্তব গাইড',
    category: 'Survival Guide',
    country: 'Global',
    excerpt:
      'পরিবার ছেড়ে প্রথমবার বিদেশে গেলে একাকীত্ব, কালচার শক, রান্না ও পড়াশোনার চাপ কীভাবে জয় করবেন।',
    content: `## উজ্জ্বল ছবির আড়ালে বিদেশ জীবনের নিঃশব্দ সংগ্রাম

বিমানের জানালার ছবি বা ক্যাম্পাসের হাসিমুখের পেছনে প্রথম ৩ মাস প্রায় প্রতিটি শিক্ষার্থীরই প্রচণ্ড একাকীত্ব ও মানসিক চাপের মধ্য দিয়ে যেতে হয়। এটি খুবই স্বাভাবিক, তবে উপেক্ষা করা উচিত নয়।

### ১. কালচার শক ও হোমসিকনেস মোকাবিলা

- নিজের দেশের খাবারের স্বাদ বজায় রাখতে দেশ থেকেই মসলা ও সহজ ৫–৬টি রেসিপি (ভাত, ডাল, মুরগি, ডিম, সবজি) রান্না শিখে যান।
- প্রতিদিন নির্দিষ্ট সময়ে পরিবারের সাথে কথা বলুন, তবে সারাদিন হোমসিক হয়ে ঘরে বসে থাকবেন না—ক্লাসমেট, লাইব্রেরি ও ইন্টারন্যাশনাল স্টুডেন্ট সোসাইটির সাথে মিশুন।

### ২. শীতের দেশে ভিটামিন-ডি ও Seasonal Depression

- যুক্তরাজ্য, কানাডা, ফ্রান্স বা জার্মানিতে শীতকালে বিকেল ৩:৩০–৪:০০ টায় সূর্য ডুবে যায়। রোদের অভাবে শরীর ক্লান্ত লাগে ও মন খারাপ হয়।
- ডাক্তার বা ফার্মাসিস্টের পরামর্শে নিয়মিত **Vitamin D** নিন এবং প্রতিদিন অন্তত ২০ মিনিট দিনের আলোতে হাঁটুন।

### ৩. বিশ্ববিদ্যালয়ের ফ্রি সাপোর্ট নিতে লজ্জা পাবেন না

1. প্রতিটি বিশ্ববিদ্যালয়ে **Free Student Counselling** ও **Academic Writing Support** থাকে—আপনার টিউশন ফির মধ্যেই এগুলো অন্তর্ভুক্ত।
2. অ্যাসাইনমেন্ট ডেডলাইন বা ব্যক্তিগত সমস্যায় পিছিয়ে পড়লে দেরি না করে কোর্স কো-অর্ডিনেটরকে ইমেইল করে **Mitigating Circumstances / Extension** আবেদন করুন।`,
    coverImage: null,
    images: [],
    authorName: 'Shahriar Hassan',
    authorRole: 'Head of Marketing & Management',
    readTime: '৪ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-13T15:30:00.000Z',
    updatedAt: '2026-11-13T15:30:00.000Z',
  },
  {
    id: 'guide_bn_avoid_agent_scams',
    slug: 'bn-how-to-spot-fake-study-abroad-agents-and-visa-scams',
    title: 'ভুয়া স্টুডেন্ট এজেন্সি ও দালালের প্রতারণা চিনবেন কীভাবে? ভিসা ব্যান থেকে বাঁচার উপায়',
    category: 'Visa & Finance',
    country: 'Global',
    excerpt:
      '"১০০% ভিসা গ্যারান্টি", ভুয়া অফার লেটার, জাল ব্যাংক স্টেটমেন্ট এবং সরাসরি বিশ্ববিদ্যালয়ে টিউশন পরিশোধের নিরাপদ নিয়ম।',
    content: `## একটি ভুল এজেন্সি আপনার ১০ বছরের ক্যারিয়ার নষ্ট করতে পারে

উচ্চশিক্ষার নামে দেশে-বিদেশে অসাধু চক্র শিক্ষার্থীদের কাছ থেকে লাখ লাখ টাকা হাতিয়ে নেয় এবং অনেক ক্ষেত্রে ভুয়া কাগজপত্র জমা দিয়ে আজীবন বা ১০ বছরের ভিসা ব্যান ডেকে আনে।

> **গোল্ডেন রুল:** কোনো এজেন্সি বা ব্যক্তি ভিসার **১০০% গ্যারান্টি** দিতে পারে না—ভিসা দেওয়ার একমাত্র ক্ষমতা সংশ্লিষ্ট দেশের দূতাবাসের। যে গ্যারান্টি দেয়, সে নিশ্চিতভাবেই মিথ্যা বলছে।

### প্রতারক এজেন্সির ৬টি লাল সংকেত (Red Flags)

1. **"কোনো ব্যাংক স্টেটমেন্ট বা IELTS ছাড়াই UK/Canada ভিসা"** — এটি প্রায়ই জাল ডকুমেন্টেশনের ফাঁদ।
2. **ব্যক্তিগত ব্যাংক অ্যাকাউন্টে টিউশন চাওয়া:** বিশ্ববিদ্যালয়ের অফিশিয়াল টিউশন ফি সবসময় **সরাসরি বিশ্ববিদ্যালয়ের ব্যাংক অ্যাকাউন্ট** বা অফিশিয়াল পেমেন্ট পোর্টাল (Flywire/Convera)-এর মাধ্যমে পাঠাবেন, কোনো এজেন্টের ব্যক্তিগত বিকাশ বা অ্যাকাউন্টে নয়।
3. **ভুয়া অফার লেটার যাচাই:** আপনার অফার লেটার বিশ্ববিদ্যালয়ের মূল অফিশিয়াল ডোমেইন (@university.ac.uk / .edu / .ca) থেকে এসেছে কি না যাচাই করুন এবং অফিশিয়াল অ্যাপ্লিকেশন পোর্টালে লগইন করে দেখুন।
4. **জাল কাগজপত্রের দায় আপনার:** এজেন্ট জাল ব্যাংক স্টেটমেন্ট বা কাজের অভিজ্ঞতা তৈরি করে দিলে দূতাবাসের কাছে **আপনিই দায়ী** হন এবং ১০ বছর পর্যন্ত ভিসা নিষেধাজ্ঞা (Deception Ban) পেতে পারেন।

### নিরাপদ প্রক্রিয়া কী?

- GlobalPathwayHub-এর মতো সরাসরি বিশ্ববিদ্যালয় প্রতিনিধির মাধ্যমে **বিনা সার্ভিস চার্জে** আবেদন করুন, প্রতিটি ধাপের লগইন ও রসিদ নিজের কাছে রাখুন এবং শতভাগ সত্য তথ্য দিয়ে ফাইল জমা দিন।`,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'Abu Siam Khan',
    authorRole: 'Founder & CEO',
    readTime: '৫ মিনিট',
    featured: false,
    status: 'published',
    createdAt: '2026-11-12T09:00:00.000Z',
    updatedAt: '2026-11-12T09:00:00.000Z',
  },

  // ── ENGLISH STARTER GUIDES ──────────────────────────────────────────────────────
  {
    id: 'guide_reality_2026',
    slug: 'unfiltered-study-abroad-reality-2026-2027',
    title: 'The Unfiltered Study Abroad Reality (2026–2027): Housing, Part-Time Pay & Cash Buffers',
    category: 'Study Reality',
    country: 'Global',
    excerpt:
      'What social media reels leave out about living abroad right now: tight rental markets, realistic part-time shift earnings, and why your first 90 days of savings decide everything.',
    content: `## Why Honest Expectations Matter Before You Fly

Every week, thousands of students land abroad expecting an instant part-time job within 48 hours and enough income to cover tuition plus rent. That narrative is outdated. Today across the **UK, Canada, Australia, and Europe**, smart students plan with numbers rather than hype.

> **Reality Check:** Never depend on future part-time wages to pay your university tuition installment. Immigration officers and campus budgets expect your first year of tuition plus 3–4 months of living cash to be ready before departure.

## 1. The Housing Crunch & How to Beat It

Rental competition in major student cities like Toronto, London, Sydney, and Paris is intense during August and September intakes.

- **Book temporary verified housing early:** Secure 4–8 weeks of campus accommodation or vetted student residence before hunting for shared apartments.
- **Never wire deposits via social media DMs:** Inspect leases, verify landlord registration, and insist on written tenancy agreements.
- **Look one transit zone outside the center:** Living 25–35 minutes away by train or tram typically cuts monthly rent by **25% to 40%**.

## 2. The Real Math Behind Part-Time Student Jobs

Part-time hours (typically 20–24 hrs/week during term time) reliably help cover groceries, transit, and utility bills. They rarely pay full international tuition.

1. Prepare a single-page local-format CV before landing (remove photos and marital status for UK/Canada/Australia).
2. Apply in person to university dining halls, libraries, campus bookshops, and retail during the first two weeks.
3. Learn local tax/work IDs immediately (NI Number in the UK, SIN in Canada, TFN in Australia, Social Security in France).`,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'Abu Siam Khan',
    authorRole: 'Founder & CEO',
    readTime: '6 min read',
    featured: false,
    status: 'published',
    createdAt: '2026-11-10T09:00:00.000Z',
    updatedAt: '2026-11-10T09:00:00.000Z',
  },
  {
    id: 'guide_first_30_days',
    slug: 'first-30-days-survival-checklist-abroad',
    title: 'First 30 Days Survival Checklist: SIM, Banking, Healthcare & Scam Prevention',
    category: 'Survival Guide',
    country: 'Global',
    excerpt:
      'A practical, zero-fluff week-by-week checklist covering everything an international student must complete from airport arrival to week four.',
    content: `## Week 1: Arrival, Connectivity & Emergency Buffer

The first seven days after landing feel overwhelming because every basic system — mobile data, transit cards, grocery stores, and banking — works differently from home.

- **Carry multi-format payment:** Bring at least 2 weeks of local cash plus an international card that works cleanly for initial transit and pharmacy costs.
- **Buy a local prepaid eSIM or SIM at a carrier store:** Avoid overpriced airport tourist booths if a city carrier shop is accessible.
- **Save university emergency numbers:** Keep your campus security desk, international student office, and embassy helpline pinned in your phone.

## Week 2: Official Enrollment, Biometrics & Bank Account

1. Complete campus in-person enrollment and collect your official **Student Status Letter** (required by almost every bank to open a student account).
2. Activate your student digital immigration status / EMGS medical screening / French OFII validation within the mandatory deadline.
3. Open a local bank account (traditional high-street banks for physical cash deposits plus low-fee digital accounts).

## Week 3–4: Healthcare & Scam Shield

> **Important Protection:** Always register with a local clinic/doctor (such as the NHS GP in the UK or Ameli in France) while you are healthy — waiting until you have a fever creates unnecessary delays.`,
    coverImage: null,
    images: [],
    authorName: 'GlobalPathwayHub Advisory',
    authorRole: 'Student Transition Desk',
    readTime: '5 min read',
    featured: false,
    status: 'published',
    createdAt: '2026-11-09T10:30:00.000Z',
    updatedAt: '2026-11-09T10:30:00.000Z',
  },
  {
    id: 'guide_france_survival_caf',
    slug: 'france-student-survival-caf-housing-aps-visa',
    title: 'Studying & Surviving in France: How CAF Housing Aid & the 2-Year APS Visa Actually Work',
    category: 'Country Guide',
    country: 'France',
    excerpt:
      'Why France has become one of Europe’s smartest study destinations: English-taught Master’s degrees, student housing assistance, and post-study work flexibility.',
    content: `## Why Students Are Looking Closely at France in 2026

While tuition and living costs climb across traditional Anglophone hubs, France combines world-ranked business and engineering schools with strong student benefits.

### Key Financial & Work Advantages

- **Part-Time Legal Work:** Student visas permit up to **964 hours/year** (roughly 20 hrs/week averaged across the year) with no separate work permit needed.
- **2-Year RECE / APS Stay-Back Visa:** Non-EU Master’s graduates can stay back in France to work or launch a business after graduation.
- **Visale Free Guarantor:** Government-backed rental guarantee for students under 30.`,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'Shahriar Hassan',
    authorRole: 'Head of Marketing & Management',
    readTime: '5 min read',
    featured: false,
    status: 'published',
    createdAt: '2026-11-08T11:00:00.000Z',
    updatedAt: '2026-11-08T11:00:00.000Z',
  },
  {
    id: 'guide_budget_country_comparison',
    slug: 'malaysia-uk-canada-australia-honest-cost-comparison',
    title: 'Malaysia vs UK vs Canada vs Australia: Choosing the Right Country for Your Budget',
    category: 'Visa & Finance',
    country: 'Malaysia',
    excerpt:
      'A transparent text breakdown comparing initial bank solvency needs, tuition installments, credit-transfer paths, and post-study job realities.',
    content: `## Stop Guessing Destinations Based Only on Trends

Choosing a country without matching your family's real financial capacity leads to mid-degree stress. Below is how experienced counselors break down four high-demand routes.

### Malaysia: Smart Dual-Degree & Value Strategy
- **Best for:** Students seeking globally recognized UK or Australian degrees at $4,500–$9,000/yr tuition with RM 1,500–2,500/month living expenses.

### United Kingdom: Speed & Efficiency
- **Best for:** Postgraduate students wanting a **12-month Master’s** rather than a 24-month program, saving a full extra year of living expenses.`,
    coverImage: null,
    images: [],
    authorName: 'Argha Biswas',
    authorRole: 'Chief Technology Officer',
    readTime: '4 min read',
    featured: false,
    status: 'published',
    createdAt: '2026-11-07T14:20:00.000Z',
    updatedAt: '2026-11-07T14:20:00.000Z',
  },
  {
    id: 'guide_part_time_jobs_survival',
    slug: 'legal-part-time-jobs-australia-uk-canada-guide',
    title: 'How Students Actually Find Legal Part-Time Work Without Risking Their Visa',
    category: 'Part-Time & Jobs',
    country: 'Australia',
    excerpt:
      'Understanding fortnightly and weekly hour caps, avoiding unsafe cash-in-hand traps, and tailoring your resume to get hired faster.',
    content: `## Rule #1: Never Breach Your Visa Work-Hour Cap

Every country strictly enforces legal hour limits during active academic semesters:
- **Australia:** Up to **48 hours per fortnight** during teaching periods (unlimited during official semester breaks).
- **United Kingdom:** Typically **20 hours per week** during term time.
- **Canada:** Up to **24 hours per week** off-campus during academic terms.
- **Germany:** **140 full days or 280 half days** per calendar year.`,
    coverImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop',
    images: [],
    authorName: 'GlobalPathwayHub Advisory',
    authorRole: 'Career & Visa Compliance Desk',
    readTime: '4 min read',
    featured: false,
    status: 'published',
    createdAt: '2026-11-06T16:00:00.000Z',
    updatedAt: '2026-11-06T16:00:00.000Z',
  },
];
