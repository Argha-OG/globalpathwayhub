'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import {
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaLocationDot,
  FaCircleCheck,
  FaArrowRight,
  FaGraduationCap,
  FaAward,
  FaQuoteLeft,
  FaCopy,
  FaCheck,
  FaPaperPlane,
} from 'react-icons/fa6';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { TEAM_MEMBERS, TEAM_LIST, TeamMember } from '@/lib/team';
import { copyToClipboard } from '@/lib/share';

export default function ProfileDirectoryPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>('abu-siam-khan');
  const [copied, setCopied] = useState(false);

  const activeMember: TeamMember = TEAM_MEMBERS[selectedSlug] || TEAM_LIST[0];

  const handleCopyProfile = async () => {
    const text = `*${activeMember.name}* - ${activeMember.fullRole} (${activeMember.role})\nGlobalPathwayHub Executive Leadership\nEmail: ${activeMember.email}\nPhone: ${activeMember.phone}\nProfile Details: https://globalpathwayhub.com/profile/${activeMember.slug}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success(`Copied profile details for ${activeMember.name}!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 pt-28 max-w-5xl space-y-10 pb-24">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
          Executive Leadership Dossiers
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Leadership Profile Details
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
          Detailed executive portfolios, strategic responsibilities, and direct communication channels for GlobalPathwayHub&apos;s leadership.
        </p>
      </div>

      {/* Profile Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-100/80 p-2 rounded-2xl border border-slate-200">
        {TEAM_LIST.map((member) => {
          const isSelected = member.slug === selectedSlug;
          return (
            <button
              key={member.slug}
              type="button"
              onClick={() => setSelectedSlug(member.slug)}
              className={`p-3 rounded-xl transition-all flex items-center gap-3 text-left ${
                isSelected
                  ? 'bg-white shadow-md border border-blue-200 text-blue-700'
                  : 'hover:bg-white/60 text-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {member.role}
                  </span>
                </div>
                <div className="text-sm font-black truncate text-slate-900 mt-0.5">
                  {member.name}
                </div>
                <div className="text-[11px] font-mono text-slate-500 truncate">
                  {member.email}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Person Detailed Dossier Card */}
      <GlassCard className="p-6 sm:p-10 bg-white/85 backdrop-blur-2xl border border-white/60 shadow-xl rounded-3xl space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 shadow-xl border-4 border-white">
              <img
                src={activeMember.image}
                alt={activeMember.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-3.5 right-3.5">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-900 shadow-md">
                  {activeMember.role}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  {activeMember.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <FaCircleCheck className="h-3 w-3 text-emerald-500" />
                  Verified Executive Profile
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 pt-1">
                {activeMember.name}
              </h2>
              <p className="text-base sm:text-lg font-bold text-blue-600">
                {activeMember.fullRole}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                <a
                  href={`mailto:${activeMember.email}`}
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 transition-colors font-mono"
                >
                  <FaEnvelope className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                  <span>{activeMember.email}</span>
                </a>
                <span className="text-slate-300">·</span>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                  <FaLocationDot className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                  {activeMember.location}
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {activeMember.headline}
            </p>

            {/* Direct Connect Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={`https://api.whatsapp.com/send?phone=${activeMember.whatsapp}&text=${encodeURIComponent(
                  `Hello ${activeMember.name}, I am reaching out regarding GlobalPathwayHub.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-10 px-4 text-xs gap-1.5 shadow-md shadow-emerald-600/20">
                  <FaWhatsapp className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>

              <a href={`mailto:${activeMember.email}`}>
                <Button variant="outline" className="border-slate-300 hover:bg-slate-50 font-bold rounded-xl h-10 px-4 text-xs gap-1.5 text-slate-800">
                  <FaEnvelope className="h-3.5 w-3.5 text-blue-600" />
                  Email
                </Button>
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyProfile}
                className="border-slate-300 hover:bg-slate-50 font-bold rounded-xl h-10 px-4 text-xs gap-1.5 text-slate-700"
              >
                {copied ? <FaCheck className="h-3.5 w-3.5 text-emerald-600" /> : <FaCopy className="h-3.5 w-3.5 text-slate-500" />}
                {copied ? 'Copied Details' : 'Copy Contact'}
              </Button>

              <Link href={`/profile/${activeMember.slug}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10 px-4 text-xs gap-1.5 shadow-md shadow-blue-600/20">
                  <span>Full Dossier Page</span>
                  <FaArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Bio & Strategic Responsibilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FaUserTie className="h-4 w-4 text-blue-600" />
              Executive Profile &amp; Bio
            </h3>
            <div className="space-y-3 text-slate-600 leading-relaxed text-xs sm:text-sm">
              {activeMember.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FaAward className="h-4 w-4 text-indigo-600" />
              Strategic Responsibilities
            </h3>
            <div className="space-y-2.5">
              {activeMember.responsibilities.map((resp, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <FaCircleCheck className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 leading-normal">
                    {resp}
                  </span>
                </div>
              ))}
            </div>

            {/* Core Competencies */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Core Competencies &amp; Expertise
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeMember.expertise.map((exp, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

