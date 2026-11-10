'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaLocationDot,
  FaCircleCheck,
  FaPaperPlane,
  FaGraduationCap,
  FaAward,
  FaUserTie,
  FaQuoteLeft,
  FaCopy,
  FaCheck,
  FaShareNodes,
  FaArrowRight,
} from 'react-icons/fa6';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { TEAM_MEMBERS, TEAM_LIST } from '@/lib/team';
import { copyToClipboard } from '@/lib/share';
import JsonLd from '@/components/JsonLd';
import { getPersonProfileSchema, getBreadcrumbSchema } from '@/lib/seo';

export default function TeamMemberDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const member = slug ? TEAM_MEMBERS[slug] : null;

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  if (!member) {
    return (
      <div className="container mx-auto px-4 py-28 text-center space-y-6 max-w-xl">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
          ?
        </div>
        <h1 className="text-3xl font-black text-slate-900">Team Profile Not Found</h1>
        <p className="text-slate-600 text-sm">
          The requested leadership profile does not exist or has been relocated.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/about">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-5">
              Back to About Us
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="rounded-xl text-xs font-bold px-5">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyContact = async () => {
    const text = `${member.name} (${member.role})\n${member.fullRole} at GlobalPathwayHub\nEmail: ${member.email}\nPhone: ${member.phone}\nWebsite: https://globalpathwayhub.com`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success(`Copied contact details for ${member.name}!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please provide your name, email, and message.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(`Forwarding your message to ${member.name}...`);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone || 'Direct Web Inquiry',
          leadSource: `team_profile_${member.slug}`,
          priority: 'high',
          notes: `[Directed to: ${member.name} (${member.role})]\nSubject: ${formData.subject || 'Direct Executive Inquiry'}\n\nMessage:\n${formData.message}`,
        }),
      });

      if (res.ok) {
        toast.success(`Message successfully sent to ${member.name}!`, { id: toastId });
        setSent(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error('Could not deliver message. Please use WhatsApp or email directly.', { id: toastId });
      }
    } catch {
      toast.error('Network error while delivering message.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const otherMembers = TEAM_LIST.filter((m) => m.slug !== member.slug);

  const profileSchema = member ? getPersonProfileSchema(member.slug) : null;
  const breadcrumbSchema = member
    ? getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About Us', url: '/about' },
        { name: 'Leadership', url: '/profile' },
        { name: member.name, url: `/profile/${member.slug}` },
      ])
    : null;

  return (
    <div className="container mx-auto px-4 py-10 pt-28 max-w-5xl space-y-12 pb-24">
      {profileSchema && <JsonLd data={profileSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}

      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-500 font-semibold">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">{member.name}</span>
        </div>

        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <FaArrowLeft className="h-3 w-3" />
          Back to Leadership Team
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <GlassCard className="p-6 sm:p-10 bg-white/80 backdrop-blur-2xl border border-white/60 shadow-xl rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo Frame */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 shadow-xl border-4 border-white">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-3.5 right-3.5">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-900 shadow-md">
                  {member.role}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Bio & Title */}
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  {member.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <FaCircleCheck className="h-3 w-3 text-emerald-500" />
                  Verified Executive
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 pt-1">
                {member.name}
              </h1>
              <p className="text-base sm:text-lg font-bold text-blue-600">
                {member.fullRole}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 pt-0.5">
                <FaLocationDot className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                {member.location}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {member.headline}
            </p>

            {/* Quick Contact & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={`https://api.whatsapp.com/send?phone=${member.whatsapp}&text=${encodeURIComponent(
                  `Hello ${member.name}, I am reaching out from GlobalPathwayHub website.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-10 px-4 text-xs gap-1.5 shadow-md shadow-emerald-600/20">
                  <FaWhatsapp className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>

              <a href={`mailto:${member.email}`}>
                <Button variant="outline" className="border-slate-300 hover:bg-slate-50 font-bold rounded-xl h-10 px-4 text-xs gap-1.5 text-slate-800">
                  <FaEnvelope className="h-3.5 w-3.5 text-blue-600" />
                  Email
                </Button>
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyContact}
                className="border-slate-300 hover:bg-slate-50 font-bold rounded-xl h-10 px-4 text-xs gap-1.5 text-slate-700"
              >
                {copied ? <FaCheck className="h-3.5 w-3.5 text-emerald-600" /> : <FaCopy className="h-3.5 w-3.5 text-slate-500" />}
                {copied ? 'Copied Details' : 'Copy Contact'}
              </Button>

              <Link href="/contact">
                <Button variant="outline" className="border-blue-200 text-blue-700 bg-blue-50/70 hover:bg-blue-100 font-bold rounded-xl h-10 px-4 text-xs gap-1.5">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Grid: Executive Bio & Responsibilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Biography & Strategic Responsibilities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Executive Biography */}
          <GlassCard className="p-6 sm:p-8 space-y-4 bg-white/80 backdrop-blur-xl border border-white/60 shadow-md rounded-3xl">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FaUserTie className="h-4 w-4 text-blue-600" />
              Executive Biography
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              {member.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </GlassCard>

          {/* Key Strategic Initiatives & Responsibilities */}
          <GlassCard className="p-6 sm:p-8 space-y-4 bg-white/80 backdrop-blur-xl border border-white/60 shadow-md rounded-3xl">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FaAward className="h-4 w-4 text-indigo-600" />
              Key Strategic Responsibilities
            </h2>
            <div className="space-y-3">
              {member.responsibilities.map((resp, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-100">
                  <FaCircleCheck className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-normal">
                    {resp}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Executive Philosophy Quote */}
          {member.quote && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl space-y-3 relative overflow-hidden">
              <FaQuoteLeft className="h-10 w-10 text-white/20 absolute -top-1 -left-1" />
              <div className="relative z-10 space-y-2 pl-4 border-l-2 border-white/40">
                <p className="text-base sm:text-lg italic font-medium leading-relaxed">
                  &ldquo;{member.quote}&rdquo;
                </p>
                <p className="text-xs font-bold text-blue-200">
                  — {member.name}, {member.role}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Credentials & Direct Inquiry Form */}
        <div className="space-y-6">
          {/* Direct Executive Contact Info */}
          <GlassCard className="p-6 space-y-4 bg-white/80 backdrop-blur-xl border border-white/60 shadow-md rounded-3xl">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FaEnvelope className="h-4 w-4 text-blue-600" />
              Direct Executive Contact
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Official Email
                </span>
                <a
                  href={`mailto:${member.email}`}
                  className="font-mono font-bold text-blue-600 hover:underline break-all block"
                >
                  {member.email}
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Support &amp; General Inquiries
                </span>
                <a
                  href="mailto:support@globalpathwayhub.com"
                  className="font-mono font-bold text-slate-700 hover:text-blue-600 hover:underline break-all block"
                >
                  support@globalpathwayhub.com
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Phone &amp; WhatsApp
                </span>
                <a
                  href={`https://api.whatsapp.com/send?phone=${member.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-slate-800 hover:text-emerald-600 flex items-center gap-1.5"
                >
                  <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
                  {member.phone}
                </a>
              </div>
            </div>
          </GlassCard>

          {/* Areas of Expertise */}
          <GlassCard className="p-6 space-y-4 bg-white/80 backdrop-blur-xl border border-white/60 shadow-md rounded-3xl">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Core Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {member.expertise.map((exp, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
                >
                  {exp}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Academic Background
              </span>
              <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FaGraduationCap className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                {member.education}
              </p>
            </div>
          </GlassCard>

          {/* Direct Inquiry Form to this person */}
          <GlassCard className="p-6 space-y-4 bg-white/80 backdrop-blur-xl border border-blue-200 shadow-lg rounded-3xl">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FaPaperPlane className="h-3.5 w-3.5 text-blue-600" />
                Message {member.name.split(' ')[0]}
              </h3>
              <p className="text-xs text-slate-500">
                Direct inquiry to {member.role}&apos;s office
              </p>
            </div>

            {sent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-xs">
                <FaCircleCheck className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-emerald-900">Message Delivered!</p>
                <p className="text-emerald-700">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSent(false)}
                  className="text-xs font-bold mt-2"
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <Input
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white border-slate-200 rounded-xl text-xs h-9"
                />
                <Input
                  type="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white border-slate-200 rounded-xl text-xs h-9"
                />
                <Input
                  placeholder="Phone / WhatsApp"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white border-slate-200 rounded-xl text-xs h-9"
                />
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-white border-slate-200 rounded-xl text-xs h-9"
                />
                <Textarea
                  placeholder={`Write your inquiry for ${member.name}... *`}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={3}
                  className="bg-white border-slate-200 rounded-xl text-xs resize-none"
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold h-9 shadow-md"
                >
                  {submitting ? 'Sending...' : 'Send Direct Message'}
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Switcher: Other Leadership Profiles */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Other Leadership Members</h3>
            <p className="text-xs text-slate-500">Explore the rest of the executive team</p>
          </div>
          <Link
            href="/about"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All Leadership <FaArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {otherMembers.map((other) => (
            <Link key={other.slug} href={`/profile/${other.slug}`} className="block group">
              <GlassCard className="p-4 sm:p-5 bg-white/70 hover:bg-white/95 border border-white/60 hover:border-blue-300 transition-all shadow-sm hover:shadow-lg rounded-2xl flex items-center gap-4">
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={other.image}
                    alt={other.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {other.role}
                  </span>
                  <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate mt-1">
                    {other.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{other.fullRole}</p>
                </div>
                <FaArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1 flex-shrink-0" />
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

