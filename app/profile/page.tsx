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
    <div className="container mx-auto px-4 py-10 pt-28 max-w-5xl space-y-8 pb-24" style={{ color: '#000000' }}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#144272' }}>
          Leadership Profiles
        </h1>
        <p className="max-w-xl mx-auto text-sm text-black/75">
          Direct executive contacts and responsibilities.
        </p>
      </div>

      {/* Profile Selector Tabs */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 rounded-lg border"
        style={{ background: '#F5F5F5', borderColor: '#144272' }}
      >
        {TEAM_LIST.map((member) => {
          const isSelected = member.slug === selectedSlug;
          return (
            <button
              key={member.slug}
              type="button"
              onClick={() => setSelectedSlug(member.slug)}
              className={`p-3 rounded-lg transition-all flex items-center gap-3 text-left border ${
                isSelected
                  ? 'shadow-sm'
                  : 'hover:bg-white/60'
              }`}
              style={{
                background: isSelected ? '#144272' : 'transparent',
                borderColor: isSelected ? '#144272' : 'transparent',
                color: isSelected ? '#FFFFFF' : '#000000',
              }}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-lg border"
                    style={{
                      background: isSelected ? '#FFD749' : '#3FC1C9',
                      color: '#144272',
                      borderColor: '#144272',
                    }}
                  >
                    {member.role}
                  </span>
                </div>
                <div
                  className="text-sm font-black truncate mt-0.5"
                  style={{ color: isSelected ? '#FFFFFF' : '#144272' }}
                >
                  {member.name}
                </div>
                <div
                  className="text-[11px] font-mono truncate"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : '#000000' }}
                >
                  {member.email}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Person Detailed Dossier Card */}
      <GlassCard
        className="p-6 sm:p-8 border shadow-sm rounded-lg space-y-8"
        style={{ background: '#FFFFFF', borderColor: '#144272' }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div
              className="relative aspect-[4/5] rounded-lg overflow-hidden border-2 shadow-sm"
              style={{ background: '#F5F5F5', borderColor: '#144272' }}
            >
              <img
                src={activeMember.image}
                alt={activeMember.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-2.5 right-2.5">
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-sm"
                  style={{ background: '#FFD749', color: '#144272', borderColor: '#144272' }}
                >
                  {activeMember.role}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border"
                  style={{ background: '#3FC1C9', color: '#144272', borderColor: '#144272' }}
                >
                  {activeMember.badge}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border flex items-center gap-1"
                  style={{ background: '#F5F5F5', color: '#144272', borderColor: '#144272' }}
                >
                  <FaCircleCheck className="h-3 w-3" style={{ color: '#144272' }} />
                  Verified Executive Profile
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black pt-1" style={{ color: '#144272' }}>
                {activeMember.name}
              </h2>
              <p className="text-sm sm:text-base font-bold" style={{ color: '#144272' }}>
                {activeMember.fullRole}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-black/70">
                <a
                  href={`mailto:${activeMember.email}`}
                  className="font-semibold hover:underline flex items-center gap-1.5 transition-colors font-mono"
                  style={{ color: '#144272' }}
                >
                  <FaEnvelope className="h-3.5 w-3.5" style={{ color: '#144272' }} />
                  <span>{activeMember.email}</span>
                </a>
                <span>·</span>
                <p className="flex items-center gap-1.5">
                  <FaLocationDot className="h-3.5 w-3.5" style={{ color: '#144272' }} />
                  {activeMember.location}
                </p>
              </div>
            </div>

            <p className="text-sm text-black/80 leading-relaxed font-medium">
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
                <Button
                  className="font-bold rounded-lg h-9 px-4 text-xs gap-1.5 border"
                  style={{ background: '#FFD749', color: '#144272', borderColor: '#144272' }}
                >
                  <FaWhatsapp className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>

              <a href={`mailto:${activeMember.email}`}>
                <Button
                  variant="outline"
                  className="font-bold rounded-lg h-9 px-4 text-xs gap-1.5 border"
                  style={{ background: '#FFFFFF', color: '#144272', borderColor: '#144272' }}
                >
                  <FaEnvelope className="h-3.5 w-3.5" />
                  Email
                </Button>
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyProfile}
                className="font-bold rounded-lg h-9 px-4 text-xs gap-1.5 border"
                style={{ background: '#F5F5F5', color: '#144272', borderColor: '#144272' }}
              >
                {copied ? <FaCheck className="h-3.5 w-3.5" /> : <FaCopy className="h-3.5 w-3.5" />}
                {copied ? 'Copied Details' : 'Copy Contact'}
              </Button>

              <Link href={`/profile/${activeMember.slug}`}>
                <Button
                  className="text-white font-bold rounded-lg h-9 px-4 text-xs gap-1.5 border"
                  style={{ background: '#144272', borderColor: '#144272' }}
                >
                  <span>Full Dossier</span>
                  <FaArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Bio & Strategic Responsibilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t" style={{ borderColor: 'rgba(20,66,114,0.15)' }}>
          <div className="space-y-4">
            <h3 className="text-base font-black flex items-center gap-2" style={{ color: '#144272' }}>
              <FaUserTie className="h-4 w-4" style={{ color: '#144272' }} />
              Executive Profile &amp; Bio
            </h3>
            <div className="space-y-3 text-black/75 leading-relaxed text-xs sm:text-sm">
              {activeMember.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-black flex items-center gap-2" style={{ color: '#144272' }}>
              <FaAward className="h-4 w-4" style={{ color: '#144272' }} />
              Strategic Responsibilities
            </h3>
            <div className="space-y-2">
              {activeMember.responsibilities.map((resp, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border"
                  style={{ background: '#F5F5F5', borderColor: '#144272' }}
                >
                  <FaCircleCheck className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: '#144272' }} />
                  <span className="text-xs font-semibold leading-normal" style={{ color: '#000000' }}>
                    {resp}
                  </span>
                </div>
              ))}
            </div>

            {/* Core Competencies */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: '#144272' }}>
                Core Competencies &amp; Expertise
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeMember.expertise.map((exp, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold border"
                    style={{ background: '#3FC1C9', color: '#144272', borderColor: '#144272' }}
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

