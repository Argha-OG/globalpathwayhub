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
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto text-2xl font-black border"
          style={{ background: '#F5F5F5', color: '#144272', borderColor: '#144272' }}
        >
          ?
        </div>
        <h1 className="text-3xl font-black" style={{ color: '#144272' }}>Team Profile Not Found</h1>
        <p className="text-sm text-black/70">
          The requested leadership profile does not exist or has been relocated.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/about">
            <Button
              className="text-white rounded-lg text-xs font-bold px-5 border"
              style={{ background: '#144272', borderColor: '#144272' }}
            >
              Back to About Us
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="rounded-lg text-xs font-bold px-5 border"
              style={{ background: '#F5F5F5', color: '#144272', borderColor: '#144272' }}
            >
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
        <div className="flex items-center gap-2 font-semibold" style={{ color: '#144272' }}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <span>/</span>
          <span style={{ color: '#000000' }} className="font-bold">{member.name}</span>
        </div>

        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline transition-colors"
          style={{ color: '#144272' }}
        >
          <FaArrowLeft className="h-3 w-3" />
          Back to Leadership Team
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <GlassCard
        className="p-6 sm:p-8 border shadow-xs rounded-lg overflow-hidden"
        style={{ background: '#FFFFFF', borderColor: '#144272' }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo Frame */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div
              className="relative aspect-[4/5] rounded-lg overflow-hidden border shadow-sm"
              style={{ background: '#F5F5F5', borderColor: '#144272' }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-2.5 right-2.5">
                <span
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider border shadow-xs"
                  style={{ background: '#FFD749', color: '#144272', borderColor: '#144272' }}
                >
                  {member.role}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Bio & Title */}
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider border"
                  style={{ background: '#3FC1C9', color: '#144272', borderColor: '#144272' }}
                >
                  {member.badge}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border flex items-center gap-1"
                  style={{ background: '#F5F5F5', color: '#144272', borderColor: '#144272' }}
                >
                  <FaCircleCheck className="h-2.5 w-2.5" style={{ color: '#144272' }} />
                  Verified Executive
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black pt-1" style={{ color: '#144272' }}>
                {member.name}
              </h1>
              <p className="text-sm sm:text-base font-bold" style={{ color: '#144272' }}>
                {member.fullRole}
              </p>
              <p className="text-xs flex items-center gap-1.5 pt-0.5 text-black/70">
                <FaLocationDot className="h-3 w-3" style={{ color: '#144272' }} />
                {member.location}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-black/80 leading-relaxed font-medium">
              {member.headline}
            </p>

            {/* Quick Contact & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href={`https://api.whatsapp.com/send?phone=${member.whatsapp}&text=${encodeURIComponent(
                  `Hello ${member.name}, I am reaching out from GlobalPathwayHub website.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="font-bold rounded-lg h-9 px-3.5 text-xs uppercase tracking-wider gap-1.5 shadow-xs border"
                  style={{ background: '#FFD749', color: '#144272', borderColor: '#144272' }}
                >
                  <FaWhatsapp className="h-3.5 w-3.5" />
                  WhatsApp
                </Button>
              </a>

              <a href={`mailto:${member.email}`}>
                <Button
                  variant="outline"
                  className="font-bold rounded-lg h-9 px-3.5 text-xs uppercase tracking-wider gap-1.5 border"
                  style={{ background: '#FFFFFF', color: '#144272', borderColor: '#144272' }}
                >
                  <FaEnvelope className="h-3 w-3" />
                  Email
                </Button>
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyContact}
                className="font-bold rounded-lg h-9 px-3.5 text-xs uppercase tracking-wider gap-1.5 border"
                style={{ background: '#F5F5F5', color: '#144272', borderColor: '#144272' }}
              >
                {copied ? <FaCheck className="h-3 w-3" /> : <FaCopy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy Contact'}
              </Button>

              <Link href="/contact">
                <Button
                  variant="outline"
                  className="font-bold rounded-lg h-9 px-3.5 text-xs uppercase tracking-wider gap-1.5 border"
                  style={{ background: '#3FC1C9', color: '#144272', borderColor: '#144272' }}
                >
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
          <GlassCard
            className="p-6 sm:p-8 space-y-4 border shadow-xs rounded-lg"
            style={{ background: '#FFFFFF', borderColor: '#144272' }}
          >
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#144272' }}>
              <FaUserTie className="h-4 w-4" style={{ color: '#144272' }} />
              Executive Biography
            </h2>
            <div className="space-y-3 text-black/75 leading-relaxed text-xs sm:text-sm">
              {member.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </GlassCard>

          {/* Key Strategic Initiatives & Responsibilities */}
          <GlassCard
            className="p-6 sm:p-8 space-y-4 border shadow-xs rounded-lg"
            style={{ background: '#FFFFFF', borderColor: '#144272' }}
          >
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#144272' }}>
              <FaAward className="h-4 w-4" style={{ color: '#144272' }} />
              Key Strategic Responsibilities
            </h2>
            <div className="space-y-2">
              {member.responsibilities.map((resp, i) => (
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
          </GlassCard>

          {/* Executive Philosophy Quote */}
          {member.quote && (
            <div
              className="p-6 sm:p-8 rounded-lg border text-white shadow-md space-y-3 relative overflow-hidden"
              style={{ background: '#144272', borderColor: '#144272' }}
            >
              <FaQuoteLeft className="h-10 w-10 text-white/10 absolute -top-1 -left-1" />
              <div
                className="relative z-10 space-y-2 pl-4 border-l-2"
                style={{ borderColor: '#FFD749' }}
              >
                <p className="text-sm sm:text-base italic font-medium leading-relaxed text-white/90">
                  &ldquo;{member.quote}&rdquo;
                </p>
                <p className="text-xs font-bold" style={{ color: '#FFD749' }}>
                  — {member.name}, {member.role}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Credentials & Direct Inquiry Form */}
        <div className="space-y-6">
          {/* Direct Executive Contact Info */}
          <GlassCard
            className="p-6 space-y-4 border shadow-xs rounded-lg"
            style={{ background: '#FFFFFF', borderColor: '#144272' }}
          >
            <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider" style={{ color: '#144272' }}>
              <FaEnvelope className="h-3.5 w-3.5" style={{ color: '#144272' }} />
              Direct Executive Contact
            </h3>
            <div className="space-y-2.5 text-xs">
              <div
                className="p-2.5 rounded-lg border space-y-0.5"
                style={{ background: '#F5F5F5', borderColor: '#144272' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block font-mono" style={{ color: '#144272' }}>
                  Official Email
                </span>
                <a
                  href={`mailto:${member.email}`}
                  className="font-mono font-bold hover:underline break-all block"
                  style={{ color: '#144272' }}
                >
                  {member.email}
                </a>
              </div>

              <div
                className="p-2.5 rounded-lg border space-y-0.5"
                style={{ background: '#F5F5F5', borderColor: '#144272' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block font-mono" style={{ color: '#144272' }}>
                  Support &amp; General Inquiries
                </span>
                <a
                  href="mailto:support@globalpathwayhub.com"
                  className="font-mono font-bold hover:underline break-all block"
                  style={{ color: '#144272' }}
                >
                  support@globalpathwayhub.com
                </a>
              </div>

              <div
                className="p-2.5 rounded-lg border space-y-0.5"
                style={{ background: '#F5F5F5', borderColor: '#144272' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block font-mono" style={{ color: '#144272' }}>
                  Phone &amp; WhatsApp
                </span>
                <a
                  href={`https://api.whatsapp.com/send?phone=${member.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold flex items-center gap-1.5 hover:underline"
                  style={{ color: '#144272' }}
                >
                  <FaWhatsapp className="h-3.5 w-3.5" style={{ color: '#144272' }} />
                  {member.phone}
                </a>
              </div>
            </div>
          </GlassCard>

          {/* Areas of Expertise */}
          <GlassCard
            className="p-6 space-y-4 border shadow-xs rounded-lg"
            style={{ background: '#FFFFFF', borderColor: '#144272' }}
          >
            <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider" style={{ color: '#144272' }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: '#144272' }} />
              Core Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {member.expertise.map((exp, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold border"
                  style={{ background: '#3FC1C9', color: '#144272', borderColor: '#144272' }}
                >
                  {exp}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t space-y-1" style={{ borderColor: 'rgba(20,66,114,0.15)' }}>
              <span className="text-[10px] font-bold uppercase tracking-wider block font-mono" style={{ color: '#144272' }}>
                Academic Background
              </span>
              <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#000000' }}>
                <FaGraduationCap className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#144272' }} />
                {member.education}
              </p>
            </div>
          </GlassCard>

          {/* Direct Inquiry Form to this person */}
          <GlassCard
            className="p-6 space-y-4 border shadow-sm rounded-lg"
            style={{ background: '#FFFFFF', borderColor: '#144272' }}
          >
            <div className="space-y-1">
              <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider" style={{ color: '#144272' }}>
                <FaPaperPlane className="h-3.5 w-3.5" style={{ color: '#144272' }} />
                Message {member.name.split(' ')[0]}
              </h3>
              <p className="text-xs text-black/60">
                Direct inquiry to {member.role}&apos;s office
              </p>
            </div>

            {sent ? (
              <div
                className="p-4 rounded-lg border text-center space-y-2 text-xs"
                style={{ background: '#F5F5F5', borderColor: '#144272' }}
              >
                <FaCircleCheck className="h-6 w-6 mx-auto" style={{ color: '#144272' }} />
                <p className="font-bold" style={{ color: '#144272' }}>Message Delivered!</p>
                <p style={{ color: '#000000' }}>
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSent(false)}
                  className="text-xs font-bold mt-2 rounded-lg border"
                  style={{ background: '#FFFFFF', color: '#144272', borderColor: '#144272' }}
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2.5">
                <Input
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white rounded-lg text-xs h-9 border"
                  style={{ borderColor: '#144272' }}
                />
                <Input
                  type="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white rounded-lg text-xs h-9 border"
                  style={{ borderColor: '#144272' }}
                />
                <Input
                  placeholder="Phone / WhatsApp"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white rounded-lg text-xs h-9 border"
                  style={{ borderColor: '#144272' }}
                />
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-white rounded-lg text-xs h-9 border"
                  style={{ borderColor: '#144272' }}
                />
                <Textarea
                  placeholder={`Write your inquiry for ${member.name}... *`}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={3}
                  className="bg-white rounded-lg text-xs resize-none border"
                  style={{ borderColor: '#144272' }}
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-white rounded-lg text-xs font-bold uppercase tracking-wider h-9 shadow-xs border"
                  style={{ background: '#144272', borderColor: '#144272' }}
                >
                  {submitting ? 'Sending...' : 'Send Direct Message'}
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Switcher: Other Leadership Profiles */}
      <div className="pt-8 border-t space-y-4" style={{ borderColor: 'rgba(20,66,114,0.2)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black" style={{ color: '#144272' }}>Other Leadership Members</h3>
            <p className="text-xs text-black/60">Explore the rest of the executive team</p>
          </div>
          <Link
            href="/about"
            className="text-xs font-bold flex items-center gap-1 uppercase tracking-wider hover:underline"
            style={{ color: '#144272' }}
          >
            All Leadership <FaArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherMembers.map((other) => (
            <Link key={other.slug} href={`/profile/${other.slug}`} className="block group">
              <GlassCard
                className="p-4 transition-all shadow-2xs hover:shadow-sm rounded-lg flex items-center gap-4 border"
                style={{ background: '#FFFFFF', borderColor: '#144272' }}
              >
                <div
                  className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border"
                  style={{ background: '#F5F5F5', borderColor: '#144272' }}
                >
                  <img
                    src={other.image}
                    alt={other.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border inline-block"
                    style={{ background: '#3FC1C9', color: '#144272', borderColor: '#144272' }}
                  >
                    {other.role}
                  </span>
                  <h4
                    className="text-base font-black truncate mt-1 group-hover:underline"
                    style={{ color: '#144272' }}
                  >
                    {other.name}
                  </h4>
                  <p className="text-xs truncate font-medium text-black/70">{other.fullRole}</p>
                </div>
                <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 flex-shrink-0" style={{ color: '#144272' }} />
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

