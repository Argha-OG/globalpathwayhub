'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  FaArrowRight,
  FaCheck,
  FaCopy,
  FaWhatsapp,
  FaChevronDown,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { generateUniversityShareText, copyToClipboard } from '@/lib/share';
import { TEAM_LIST } from '@/lib/team';
import CountryFlag from '@/components/CountryFlag';
import Hero3DGallery from '@/components/Hero3DGallery';
import { DESTINATIONS } from '@/lib/destinations';
import { GuideArticle, isBanglaGuide } from '@/lib/guides';
import { SITE_URL } from '@/lib/seo';

function UniversityInitialsBadge({ name }: { name: string }) {
  const initials = (name || 'UN')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#144272] text-[#FFD749] font-black text-sm flex-shrink-0 border border-[#3FC1C9]/30">
      {initials || 'UN'}
    </div>
  );
}

const HOME_FAQS = [
  {
    q: 'Is admissions counseling really free for students?',
    a: 'Yes. Profile checks, shortlisting accredited universities, and submitting applications through our partner portals carry zero service charge.',
  },
  {
    q: 'Which destinations offer the most affordable total budget?',
    a: 'Germany (near-zero public tuition), Malaysia ($4,500—$9,000/yr tuition with low living costs), and France (subsidized tuition + CAF housing support) offer strong ROI.',
  },
  {
    q: 'How long does an official university offer letter take?',
    a: 'Depending on the destination and intake, conditional or unconditional offer letters typically issue in 1 to 4 weeks when transcripts and English scores are ready.',
  },
  {
    q: 'Do you help with bank solvency and embassy visa interviews?',
    a: 'Yes. We audit sponsor statements, CAS/I-20/PAL/EMGS eVAL paperwork, and run one-on-one mock credibility interviews before visa submission.',
  },
];

const ADVANTAGES = [
  {
    title: 'Zero Service Fee',
    desc: 'Direct partner representation with official university portals and transparent tuition.',
  },
  {
    title: 'Scholarship Screening',
    desc: 'Merit awards, tuition fee waivers, and early-bird concessions applied before submission.',
  },
  {
    title: 'Visa Compliance Audit',
    desc: 'Country-specific solvency rules, CAS, I-20, PAL, and GIC files verified cleanly.',
  },
  {
    title: 'Pre-Departure Survival',
    desc: 'Housing scam prevention, legal part-time work caps, and landing checklists in Bangla & English.',
  },
];

export default function HomeClient({
  initialFeaturedUnis,
  initialGuides = [],
}: {
  initialFeaturedUnis: any[];
  initialGuides?: GuideArticle[];
}) {
  const [featuredUnis] = useState<any[]>(initialFeaturedUnis);
  const [copiedUniId, setCopiedUniId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedBudgetFilter, setSelectedBudgetFilter] = useState<'all' | 'low-tuition' | 'work-visa'>('all');

  const handleCopyUniversity = async (e: React.MouseEvent, uni: any) => {
    e.preventDefault();
    e.stopPropagation();
    const uniUrl = `${window.location.origin}/universities/${encodeURIComponent(uni._id || uni.id)}`;
    const text = generateUniversityShareText(uni, uniUrl);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedUniId(uni._id || uni.id);
      toast.success(`Copied ${uni.name} details`);
      setTimeout(() => setCopiedUniId(null), 2500);
    } else {
      toast.error('Copy failed');
    }
  };

  const comparedDestinations = DESTINATIONS.filter((dest) => {
    if (selectedBudgetFilter === 'low-tuition') {
      return ['Malaysia', 'Germany', 'France'].includes(dest.name);
    }
    if (selectedBudgetFilter === 'work-visa') {
      return ['Canada', 'Australia', 'United Kingdom', 'United States', 'Ireland'].includes(dest.name);
    }
    return true;
  });

  return (
    <div className="w-full pb-20 text-black">
      {/* 1. Full-Width Light Hero Stage & Auto-Looping 3D Gallery */}
      <section className="relative -mt-4 w-full bg-white border-b border-[#144272]/12 overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h1 className="text-4xl sm:text-5xl xl:text-[3.75rem] font-black tracking-[-0.03em] leading-[1.03] gradient-title">
                Your Global Degree.
                <span className="block mt-1">Direct Admissions.</span>
              </h1>

              <div className="w-14 h-1 bg-[#3FC1C9] rounded-lg" aria-hidden="true" />

              <p className="text-base sm:text-lg text-[#144272]/80 font-medium leading-relaxed max-w-md">
                Accredited universities across Malaysia, Canada, Australia, the UK, and France — with transparent cost guidance.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <Link href="/universities">
                  {/* Hero CTA — navy with shine sweep */}
                  <button className="relative overflow-hidden rounded-lg bg-[#144272] hover:bg-[#0f3459] text-white font-black text-xs sm:text-sm uppercase tracking-wider h-12 px-6 gap-3 inline-flex items-center shadow-[0_12px_24px_-8px_rgba(20,66,114,0.35)] transition-all hover:-translate-y-0.5">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 animate-shine"
                      style={{
                        background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
                        width: '60%',
                      }}
                    />
                    <span>Explore Universities</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#FFD749] text-[#144272]">
                      <FaArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                </Link>

                {/* Hero WhatsApp CTA — green heartbeat pulse */}
                <a
                  href="https://api.whatsapp.com/send?phone=8801410555054"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="relative overflow-hidden inline-flex items-center gap-2 rounded-lg h-12 px-5 font-black text-xs sm:text-sm uppercase tracking-wider text-white border-2 border-[#128C3E] shadow-[0_12px_24px_-8px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 animate-heartbeat"
                  style={{ background: '#25D366' }}
                >
                  <FaWhatsapp className="h-5 w-5 flex-shrink-0" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <Hero3DGallery />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 space-y-16 md:space-y-24">
        {/* 2. Study Destinations */}
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-3 border-b border-[#144272]/15 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight gradient-title">
              Study Destinations
            </h2>
            <Link
              href="/universities"
              className="text-xs font-black uppercase tracking-wider text-[#144272] hover:text-[#3FC1C9] inline-flex items-center gap-1"
            >
              View Directory
              <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DESTINATIONS.map((dest) => {
              const destWaHref = `https://api.whatsapp.com/send?phone=8801410555054&text=${encodeURIComponent(
                `Hello GlobalPathwayHub, share admissions details for ${dest.name}.`
              )}`;

              return (
                <div
                  key={dest.name}
                  className="bg-white border border-[#144272]/20 hover:border-[#3FC1C9] rounded-lg p-4 flex flex-col justify-between gap-3 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <CountryFlag country={dest.name} size="md" />
                        <h3 className="text-base font-black text-[#144272]">
                          {dest.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#FFD749] text-[#144272]">
                        {dest.code}
                      </span>
                    </div>

                    <div className="bg-[#F5F5F5] rounded-lg p-2.5 space-y-1 text-[11px] border border-[#144272]/10">
                      <div className="flex justify-between gap-2">
                        <span className="text-black/60">Work Visa:</span>
                        <span className="font-bold text-[#144272] text-right">{dest.postStudyWork}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-black/60">Part-Time:</span>
                        <span className="font-bold text-black text-right">{dest.partTimeWork}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-black/60">Tuition:</span>
                        <span className="font-bold text-[#144272] text-right">{dest.tuition}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/universities?country=${encodeURIComponent(dest.name)}`}
                      className="flex-1"
                    >
                      <Button
                        type="button"
                        className="w-full bg-[#144272] hover:bg-[#144272]/90 text-white rounded-lg text-xs font-bold h-8"
                      >
                        Explore
                      </Button>
                    </Link>
                    <a
                      href={destWaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp about ${dest.name}`}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[#3FC1C9] text-[#144272] bg-[#3FC1C9]/20 hover:bg-[#3FC1C9] rounded-lg h-8 px-2.5"
                      >
                        <FaWhatsapp className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. NEW SECTION: Student Survival & Reality Guides (Bangla + English) */}
        {initialGuides.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3 border-b border-[#144272]/15 pb-3">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight gradient-title">
                Student Survival &amp; Reality Guides
              </h2>
              <Link
                href="/guide"
                className="text-xs font-black uppercase tracking-wider text-[#144272] hover:text-[#3FC1C9] inline-flex items-center gap-1"
              >
                All Guides
                <FaArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {initialGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guide/${encodeURIComponent(guide.slug)}`}
                  className="group bg-white border border-[#144272]/20 hover:border-[#3FC1C9] rounded-lg overflow-hidden flex flex-col justify-between transition-all"
                >
                  <div>
                    {guide.coverImage ? (
                      <div className="relative aspect-[16/10] bg-[#F5F5F5] overflow-hidden border-b border-[#144272]/10">
                        <img
                          src={guide.coverImage}
                          alt={guide.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-[#144272] text-[#FFD749] text-[10px] font-black uppercase">
                          {guide.category}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-[#144272] px-4 py-3 flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-[#FFD749] text-[#144272] text-[10px] font-black uppercase">
                          {guide.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#3FC1C9] font-bold">
                          {guide.readTime}
                        </span>
                      </div>
                    )}

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {guide.country && guide.country !== 'Global' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] font-bold">
                            <CountryFlag country={guide.country} size="xs" />
                            <span>{guide.country}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] font-bold">
                            Global
                          </span>
                        )}
                        {isBanglaGuide(guide) && (
                          <span className="px-2 py-0.5 rounded-lg bg-[#FFD749] text-[#144272] font-black">
                            à¦¬à¦¾à¦‚à¦²à¦¾
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-black text-[#144272] group-hover:text-[#3FC1C9] transition-colors leading-snug line-clamp-2">
                        {guide.title}
                      </h3>

                      <p className="text-xs text-black/70 line-clamp-2 leading-relaxed">
                        {guide.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-2.5 bg-[#F5F5F5] border-t border-[#144272]/10 flex items-center justify-between text-[11px] font-bold text-[#144272]">
                    <span className="font-mono text-black/60">{guide.readTime}</span>
                    <span className="inline-flex items-center gap-1 group-hover:text-[#3FC1C9]">
                      Read
                      <FaArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. NEW SECTION: Tuition & Work Rights Comparison Matrix */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#144272]/15 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight gradient-title">
              Cost &amp; Work Rights Comparison
            </h2>

            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#144272]/15 self-start sm:self-auto">
              {[
                { id: 'all', label: 'All Countries' },
                { id: 'low-tuition', label: 'Low Tuition' },
                { id: 'work-visa', label: 'Post-Study Visa' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedBudgetFilter(tab.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    selectedBudgetFilter === tab.id
                      ? 'bg-[#144272] text-[#FFD749]'
                      : 'text-[#144272] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#144272]/20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#144272] text-white text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-black">Country</th>
                    <th className="py-3.5 px-4 font-black">Annual Tuition</th>
                    <th className="py-3.5 px-4 font-black">Est. Living / Yr</th>
                    <th className="py-3.5 px-4 font-black">Part-Time Limit</th>
                    <th className="py-3.5 px-4 font-black">Stay-Back Visa</th>
                    <th className="py-3.5 px-4 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#144272]/10 text-xs">
                  {comparedDestinations.map((dest) => (
                    <tr key={dest.code} className="hover:bg-[#F5F5F5]/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5 font-black text-[#144272] whitespace-nowrap">
                          <CountryFlag country={dest.name} size="sm" />
                          <span>{dest.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#144272] tabular-nums whitespace-nowrap">
                        {dest.tuition}
                      </td>
                      <td className="py-3 px-4 font-medium text-black/75 tabular-nums whitespace-nowrap">
                        {dest.living}
                      </td>
                      <td className="py-3 px-4 font-medium text-black/80 whitespace-nowrap">
                        {dest.partTimeWork}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-[#FFD749] text-[#144272] font-bold text-[11px] whitespace-nowrap">
                          {dest.postStudyWork}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/universities?country=${encodeURIComponent(dest.name)}`}
                          className="inline-flex items-center gap-1 font-black text-[#144272] hover:text-[#3FC1C9] whitespace-nowrap"
                        >
                          Universities
                          <FaArrowRight className="h-2.5 w-2.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Partner Universities (when populated) */}
        {featuredUnis.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3 border-b border-[#144272]/15 pb-3">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight gradient-title">
                Partner Universities
              </h2>
              <Link
                href="/universities"
                className="text-xs font-black uppercase tracking-wider text-[#144272] hover:text-[#3FC1C9] inline-flex items-center gap-1"
              >
                View All
                <FaArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredUnis.map((uni: any) => {
                const isCopied = copiedUniId === (uni._id || uni.id);
                const uniTargetUrl = `/universities/${encodeURIComponent(uni._id || uni.id)}`;
                const shareUrl = `${SITE_URL}${uniTargetUrl}`;
                const waHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                  generateUniversityShareText(uni, shareUrl)
                )}`;

                return (
                  <Link
                    key={uni._id || uni.id}
                    href={uniTargetUrl}
                    className="block group"
                  >
                    <div className="bg-white border border-[#144272]/20 hover:border-[#3FC1C9] rounded-lg p-4 flex flex-col justify-between h-full gap-4 transition-all">
                      <div className="flex items-start gap-3">
                        <UniversityInitialsBadge name={uni.name} />
                        <div className="min-w-0 flex-1 space-y-1">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] border border-[#144272]/15 uppercase">
                            <CountryFlag country={uni.country} size="xs" />
                            <span>{uni.country || 'Global'}</span>
                          </span>
                          <h3 className="text-sm font-black text-[#144272] group-hover:text-[#3FC1C9] transition-colors line-clamp-1">
                            {uni.name}
                          </h3>
                          <p className="text-xs text-black/60 truncate">
                            {uni.location || uni.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#144272]/10">
                        <Button
                          type="button"
                          className="flex-1 bg-[#144272] hover:bg-[#144272]/90 text-white rounded-lg text-xs font-bold h-8"
                        >
                          Details
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => handleCopyUniversity(e, uni)}
                          className="rounded-lg h-8 px-2.5 border-[#144272]/25 text-[#144272]"
                          title="Copy details"
                        >
                          {isCopied ? <FaCheck className="h-3 w-3 text-[#3FC1C9]" /> : <FaCopy className="h-3 w-3" />}
                        </Button>
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Share on WhatsApp"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[#3FC1C9] text-[#144272] bg-[#3FC1C9]/20 hover:bg-[#3FC1C9] rounded-lg h-8 px-2.5"
                          >
                            <FaWhatsapp className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. NEW SECTION: Why Apply Direct With GlobalPathwayHub */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 bg-[#144272] text-white rounded-lg p-7 sm:p-9 flex flex-col justify-between gap-6 border border-[#3FC1C9]/30">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Transparent Guidance From Application to Arrival.
              </h2>
              <p className="text-sm text-[#F5F5F5]/80 leading-relaxed">
                You pay tuition directly to the university portal and keep complete visibility over your admission files.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://api.whatsapp.com/send?phone=8801410555054"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#FFD749] hover:bg-[#FFD749]/90 text-[#144272] font-black text-xs uppercase tracking-wider h-10 px-5 rounded-lg gap-2">
                  <FaWhatsapp className="h-4 w-4" />
                  Chat With Advisor
                </Button>
              </a>
              <Link href="/about">
                <Button className="bg-[#3FC1C9] hover:bg-[#34b0b8] text-[#144272] font-bold text-xs uppercase tracking-wider h-10 px-5 rounded-lg">
                  About Us
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ADVANTAGES.map((adv) => (
              <div
                key={adv.title}
                className="bg-white border border-[#144272]/20 rounded-lg p-5 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#3FC1C9]/20 text-[#144272] flex items-center justify-center flex-shrink-0">
                    <FaCheck className="h-3 w-3" />
                  </span>
                  <h3 className="text-base font-black text-[#144272]">{adv.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-black/70 leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. How It Works */}
        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black text-[#144272] tracking-tight border-b border-[#144272]/15 pb-3">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Profile Check', desc: 'Review transcripts, scores, and budget.' },
              { step: '02', title: 'Shortlisting', desc: 'Match 3—5 accredited partner universities.' },
              { step: '03', title: 'Direct Offer', desc: 'Fast submission and scholarship evaluation.' },
              { step: '04', title: 'Visa & Fly', desc: 'Complete visa file audit and pre-departure.' },
            ].map((st) => (
              <div
                key={st.step}
                className="bg-white border border-[#144272]/20 rounded-lg p-5 space-y-2"
              >
                <span className="text-xs font-black text-[#144272] bg-[#FFD749] px-2.5 py-0.5 rounded-lg inline-block">
                  {st.step}
                </span>
                <h3 className="text-base font-black text-[#144272]">{st.title}</h3>
                <p className="text-xs text-black/70">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Advisory Team */}
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-3 border-b border-[#144272]/15 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight gradient-title">
              Advisory Team
            </h2>
            <Link
              href="/contact"
              className="text-xs font-black uppercase tracking-wider text-[#144272] hover:text-[#3FC1C9] inline-flex items-center gap-1"
            >
              Office Location
              <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TEAM_LIST.map((member) => (
              <div
                key={member.slug}
                className="bg-white border border-[#144272]/20 hover:border-[#3FC1C9] rounded-lg p-4 flex flex-col justify-between gap-4 transition-all group"
              >
                <div className="space-y-3">
                  <Link
                    href={`/profile/${member.slug}`}
                    className="block relative overflow-hidden rounded-lg bg-[#F5F5F5] aspect-[4/4] border border-[#144272]/15"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      decoding="async"
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-[#144272] text-[#FFD749]">
                      {member.role}
                    </span>
                  </Link>

                  <div>
                    <Link href={`/profile/${member.slug}`}>
                      <h3 className="text-base font-black text-[#144272] group-hover:text-[#3FC1C9] transition-colors">
                        {member.name}
                      </h3>
                    </Link>
                    <p className="text-xs font-bold text-[#3FC1C9]">{member.fullRole}</p>
                    <p className="text-xs font-mono text-black/70 mt-1">{member.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#144272]/10">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${member.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      className="w-full rounded-lg text-xs font-bold h-9 bg-[#3FC1C9] hover:bg-[#34b0b8] text-[#144272]"
                    >
                      <FaWhatsapp className="h-3.5 w-3.5 mr-1.5" />
                      WhatsApp
                    </Button>
                  </a>
                  <Link href={`/profile/${member.slug}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full rounded-lg text-xs font-bold h-9 border-[#144272]/25 text-[#144272] hover:bg-[#F5F5F5]"
                    >
                      Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. NEW SECTION: Compact Frequently Asked Questions */}
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-3 border-b border-[#144272]/15 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight gradient-title">
              Common Questions
            </h2>
            <Link
              href="/support?tab=faq"
              className="text-xs font-black uppercase tracking-wider text-[#144272] hover:text-[#3FC1C9] inline-flex items-center gap-1"
            >
              More Policies
              <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HOME_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="bg-white border border-[#144272]/20 rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left"
                  >
                    <span className="text-sm font-black text-[#144272]">{item.q}</span>
                    <FaChevronDown
                      className={`h-3.5 w-3.5 text-[#144272] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-black/75 leading-relaxed border-t border-[#144272]/10 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. Compact CTA */}
        <section className="bg-[#144272] text-white rounded-lg p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-[#3FC1C9]/30">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to Start Your Application?
          </h2>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link href="/universities">
              {/* CTA section — yellow with shine */}
              <button className="relative overflow-hidden rounded-lg text-xs font-black uppercase tracking-wider h-10 px-5 inline-flex items-center bg-[#FFD749] hover:bg-[#f5c800] text-[#144272] border-2 border-[#144272]/15 shadow-md transition-all hover:scale-105">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 animate-shine"
                  style={{
                    background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
                    width: '60%',
                  }}
                />
                Explore Universities
              </button>
            </Link>
            <Link href="/contact">
              {/* CTA section — yellow with shine */}
              <button className="relative overflow-hidden rounded-lg text-xs font-black uppercase tracking-wider h-10 px-5 inline-flex items-center bg-[#FFD749] hover:bg-[#f5c800] text-[#144272] border-2 border-[#144272]/15 shadow-md transition-all hover:scale-105">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 animate-shine"
                  style={{
                    background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
                    width: '60%',
                  }}
                />
                Free Consultation
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}



