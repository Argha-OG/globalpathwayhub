'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/GlassCard';
import {
  FaLocationDot,
  FaGlobe,
  FaPhone,
  FaDollarSign,
  FaUsers,
  FaBuildingColumns,
  FaCircleCheck,
  FaArrowLeft,
  FaArrowUpRightFromSquare,
  FaBookOpen,
  FaGraduationCap,
  FaPaperPlane,
  FaEnvelope,
  FaClock,
  FaStar,
  FaChevronRight,
  FaCopy,
  FaCheck,
  FaWhatsapp,
} from 'react-icons/fa6';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  generateUniversityShareText,
  generateCourseShareText,
  copyToClipboard,
} from '@/lib/share';
import JsonLd from '@/components/JsonLd';
import { getCollegeOrUniversitySchema, getBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import CountryFlag from '@/components/CountryFlag';

function InitialsAvatar({ name, className = '' }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();
  return (
    <div
      className={`flex items-center justify-center rounded-lg text-[#FFD749] bg-[#144272] border border-[#3FC1C9]/30 font-black shadow-xs ${className}`}
    >
      {initials}
    </div>
  );
}

export default function UniversityDetailClient({
  university,
  courses,
  id,
}: {
  university: any | null;
  courses: any[];
  id: string;
}) {
  const [copiedUni, setCopiedUni] = useState(false);
  const [copiedCourseId, setCopiedCourseId] = useState<string | null>(null);

  const handleCopyUniversity = async () => {
    if (!university) return;
    const url = `${window.location.origin}/universities/${encodeURIComponent(university._id || university.id || id)}`;
    const text = generateUniversityShareText(university, url);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedUni(true);
      toast.success(`Copied details for ${university.name}! Ready to paste into WhatsApp.`);
      setTimeout(() => setCopiedUni(false), 2500);
    } else {
      toast.error('Could not copy to clipboard');
    }
  };

  const handleWhatsAppShareUni = () => {
    if (!university) return;
    const url = `${SITE_URL}/universities/${encodeURIComponent(university._id || university.id || id)}`;
    const text = generateUniversityShareText(university, url);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyCourse = async (e: React.MouseEvent, course: any) => {
    e.preventDefault();
    e.stopPropagation();
    const courseWithUni = {
      ...course,
      university: course.university || university,
    };
    const text = generateCourseShareText(courseWithUni);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedCourseId(course._id);
      toast.success(`Copied "${course.name}" costing details for WhatsApp!`);
      setTimeout(() => setCopiedCourseId(null), 2500);
    } else {
      toast.error('Could not copy course details');
    }
  };

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <FaBuildingColumns className="h-14 w-14 text-[#144272]/30 mx-auto" />
          <h2 className="text-xl font-bold text-[#144272]">University not found</h2>
          <Link href="/universities">
            <Button variant="outline" className="border-[#144272]/30 text-[#144272]">
              ← Back to Universities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const details = university.details || {};
  const uniId = university._id || university.id || id;

  const tuition = details.tuition || details.tuition_out_of_state;
  const enrollment = details.enrollment;
  const facultyRatio = details.student_faculty_ratio;
  const founded = details.founded;
  const researchOutput = details.research_output;
  const level = details.level;
  const control = details.control;
  const institutionType = details.institution_type;
  const recognition = details.recognition;
  const status = details.status;
  const address = details.address;
  const city = details.city;
  const state = details.state;
  const regionCode = details.region_code;
  const phone = details.phone;
  const email = details.email;
  const domains = details.domains || [];
  const degreeTypes = details.degree_types || [];
  const accreditation = details.accreditation;
  const countryCode = details.country_code;

  const uniSchema = getCollegeOrUniversitySchema({
    id: university._id || university.id,
    name: university.name,
    country: university.country,
    city: city || address,
    website: university.website,
    description:
      university.description ||
      `Accredited higher education institution in ${university.country}.`,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Universities', url: '/universities' },
    { name: university.name, url: `/universities/${university._id || university.id}` },
  ]);

  return (
    <div className="container mx-auto px-4 py-10 pt-28 max-w-6xl space-y-8">
      <JsonLd data={uniSchema} />
      <JsonLd data={breadcrumbSchema} />

      <Link
        href="/universities"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#144272]/70 hover:text-[#144272] transition-colors"
      >
        <FaArrowLeft className="h-3.5 w-3.5" />
        Back to Universities
      </Link>

      {/* Hero Card */}
      <GlassCard className="p-6 md:p-8 bg-white border border-[#144272]/15 shadow-xs rounded-lg">
        <div className="flex flex-col md:flex-row gap-7 items-start">
          <InitialsAvatar name={university.name} className="w-20 h-20 text-2xl flex-shrink-0 shadow-xs" />

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap gap-1.5 items-center">
              {status && (
                <span
                  className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                    status === 'active'
                      ? 'bg-[#3FC1C9]/20 text-[#144272] border border-[#3FC1C9]/40'
                      : 'bg-[#F5F5F5] text-[#144272] border border-[#144272]/20'
                  }`}
                >
                  ● {status}
                </span>
              )}
              {recognition && (
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-lg bg-[#FFD749] text-black border border-[#144272]/20">
                  Nationally {recognition}
                </span>
              )}
              {level && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] border border-[#144272]/20 capitalize">
                  {level.replace(/_/g, ' ')}
                </span>
              )}
              {(control || institutionType) && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] border border-[#144272]/20 capitalize">
                  {institutionType || control}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-[#144272] leading-tight">
              {university.name}
            </h1>

            <p className="text-xs sm:text-sm text-black/60 flex items-center gap-2 font-medium">
              <CountryFlag country={university.country} size="sm" />
              <span>
                {[address, city, state, regionCode, university.country].filter(Boolean).join(', ')}
                {countryCode && (
                  <span className="ml-1 font-bold text-[#144272]">({countryCode})</span>
                )}
              </span>
            </p>

            {founded && (
              <p className="text-xs text-black/40 flex items-center gap-1.5">
                <FaClock className="h-3 w-3" />
                Founded {founded}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              {university.website && (
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#144272] hover:text-[#3FC1C9] hover:underline"
                >
                  <FaGlobe className="h-3 w-3" />
                  {university.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {phone && (
                <span className="inline-flex items-center gap-1.5 text-xs text-black/60">
                  <FaPhone className="h-3 w-3 text-[#144272]" />
                  {phone}
                </span>
              )}
              {email && (
                <span className="inline-flex items-center gap-1.5 text-xs text-black/60">
                  <FaEnvelope className="h-3 w-3 text-[#144272]" />
                  {email}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto min-w-[170px]">
            <Link href={`/apply/${encodeURIComponent(uniId)}`}>
              <Button className="w-full bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] font-bold rounded-lg h-9 shadow-xs gap-1.5 text-xs uppercase tracking-wider">
                <FaPaperPlane className="h-3 w-3" />
                Apply Now
              </Button>
            </Link>

            <Button
              type="button"
              onClick={handleCopyUniversity}
              className={`w-full font-bold rounded-lg h-9 text-xs gap-1.5 shadow-xs transition-all uppercase tracking-wider ${
                copiedUni
                  ? 'bg-[#3FC1C9] text-[#144272]'
                  : 'border border-[#144272]/30 bg-white text-[#144272] hover:bg-[#F5F5F5]'
              }`}
            >
              {copiedUni ? (
                <>
                  <FaCheck className="h-3 w-3 text-[#144272]" />
                  Copied!
                </>
              ) : (
                <>
                  <FaCopy className="h-3 w-3 text-[#144272]" />
                  Copy for WhatsApp
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={handleWhatsAppShareUni}
              className="w-full bg-[#3FC1C9] hover:bg-[#3FC1C9]/80 text-[#144272] font-bold rounded-lg h-9 text-xs gap-1.5 shadow-xs uppercase tracking-wider"
            >
              <FaWhatsapp className="h-3.5 w-3.5" />
              Share on WhatsApp
            </Button>

            {university.website && (
              <a
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="ghost"
                  className="w-full text-[#144272] hover:text-[#144272] hover:bg-[#FFD749]/30 text-xs h-8 gap-1.5 rounded-lg"
                >
                  <FaArrowUpRightFromSquare className="h-3 w-3" />
                  Official Website
                </Button>
              </a>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Key Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: <FaDollarSign className="h-5 w-5" />,
            label: 'Annual Tuition',
            value: tuition ? `$${Number(tuition).toLocaleString()}` : 'N/A',
            sub: details.tuition_out_of_state ? 'Out-of-state' : undefined,
            color: 'text-[#144272] bg-[#3FC1C9]/20',
          },
          {
            icon: <FaUsers className="h-5 w-5" />,
            label: 'Enrollment',
            value: enrollment ? Number(enrollment).toLocaleString() : 'N/A',
            sub: details.enrollment_year ? `Year ${details.enrollment_year}` : undefined,
            color: 'text-[#144272] bg-[#FFD749]',
          },
          {
            icon: <FaStar className="h-5 w-5" />,
            label: 'Faculty Ratio',
            value: facultyRatio ? `${facultyRatio}:1` : 'N/A',
            sub: undefined,
            color: 'text-[#144272] bg-[#F5F5F5]',
          },
          {
            icon: <FaBookOpen className="h-5 w-5" />,
            label: 'Research Output',
            value: researchOutput
              ? Number(researchOutput) > 1000000
                ? `${(Number(researchOutput) / 1000000).toFixed(1)}M papers`
                : `${Number(researchOutput).toLocaleString()} papers`
              : 'N/A',
            sub: undefined,
            color: 'text-[#144272] bg-[#3FC1C9]/20',
          },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-5 flex flex-col items-center text-center space-y-1.5 bg-white border border-[#144272]/15 rounded-lg">
            <div className={`p-2.5 rounded-lg ${stat.color}`}>{stat.icon}</div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-black/50">
              {stat.label}
            </span>
            <span className="text-lg font-black text-[#144272]">{stat.value}</span>
            {stat.sub && <span className="text-[10px] text-black/40">{stat.sub}</span>}
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {university.description && (
            <GlassCard className="p-6 bg-white border border-[#144272]/15 rounded-lg space-y-3">
              <h2 className="text-base font-bold text-[#144272] flex items-center gap-2">
                <FaBuildingColumns className="h-4 w-4 text-[#3FC1C9]" />
                About
              </h2>
              <p className="text-sm text-black/70 leading-relaxed">{university.description}</p>
            </GlassCard>
          )}

          {degreeTypes.length > 0 && (
            <GlassCard className="p-6 bg-white border border-[#144272]/15 rounded-lg space-y-3">
              <h2 className="text-base font-bold text-[#144272] flex items-center gap-2">
                <FaGraduationCap className="h-4 w-4 text-[#3FC1C9]" />
                Degree Types Offered ({degreeTypes.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {degreeTypes.map((deg: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-[#F5F5F5] text-[#144272] text-xs font-semibold border border-[#144272]/20"
                  >
                    {deg}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {accreditation && (
            <GlassCard className="p-6 bg-white border border-[#144272]/15 rounded-lg space-y-3">
              <h2 className="text-base font-bold text-[#144272] flex items-center gap-2">
                <FaCircleCheck className="h-4 w-4 text-[#3FC1C9]" />
                Accreditation
              </h2>
              <p className="text-sm text-black/70">{accreditation}</p>
            </GlassCard>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#144272] flex items-center gap-2">
                <FaBookOpen className="h-5 w-5 text-[#3FC1C9]" />
                Courses at {university.name}
              </h2>
              <span className="text-xs font-bold text-[#144272] bg-[#F5F5F5] px-3 py-1 rounded-lg border border-[#144272]/20">
                {courses.length} courses
              </span>
            </div>

            {courses.length === 0 ? (
              <GlassCard className="p-8 text-center bg-white border border-[#144272]/15 rounded-lg">
                <FaBookOpen className="h-10 w-10 text-[#144272]/30 mx-auto mb-3" />
                <p className="text-sm text-black/70 font-medium">No courses listed for this university yet.</p>
                <p className="text-xs text-black/40 mt-1">Check the official website or contact a counselor.</p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((course: any) => (
                  <Link
                    key={course._id}
                    href={`/courses/${encodeURIComponent(course._id)}`}
                    className="group"
                  >
                    <GlassCard className="p-5 bg-white hover:border-[#3FC1C9] border-[#144272]/15 transition-all h-full flex flex-col justify-between gap-3 rounded-lg">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-[#144272] group-hover:text-[#3FC1C9] transition-colors leading-snug">
                            {course.name}
                          </h3>
                          <FaChevronRight className="h-3 w-3 text-[#144272]/40 group-hover:text-[#3FC1C9] flex-shrink-0 mt-0.5 transition-colors" />
                        </div>
                        {course.description && (
                          <p className="text-xs text-black/70 line-clamp-2">
                            {course.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        {course.level && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] border border-[#144272]/20">
                            {course.level}
                          </span>
                        )}
                        {course.duration && (
                          <span className="text-[10px] text-black/60 flex items-center gap-1">
                            <FaClock className="h-2.5 w-2.5 text-[#144272]" />
                            {course.duration}
                          </span>
                        )}
                        {course.tuitionFee && (
                          <span className="text-[10px] font-bold text-black bg-[#FFD749] px-2 py-0.5 rounded-lg">
                            {course.tuitionFee}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#144272]/10 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-black/50">
                          Share with Student
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCourse(e, course)}
                          title="Copy course & costing details for WhatsApp"
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                            copiedCourseId === course._id
                              ? 'bg-[#3FC1C9] text-[#144272]'
                              : 'bg-[#F5F5F5] hover:bg-[#3FC1C9]/20 text-[#144272]'
                          }`}
                        >
                          {copiedCourseId === course._id ? (
                            <>
                              <FaCheck className="h-2.5 w-2.5 text-[#144272]" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <FaCopy className="h-2.5 w-2.5 text-[#144272]" />
                              <span>Copy for WhatsApp</span>
                            </>
                          )}
                        </button>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 bg-white border border-[#144272]/15 rounded-lg space-y-4">
            <h2 className="text-base font-bold text-[#144272] flex items-center gap-2">
              <FaLocationDot className="h-4 w-4 text-[#3FC1C9]" />
              Location &amp; Contact
            </h2>
            <div className="space-y-3 text-sm">
              {address && (
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-black/50">Address</span>
                  <p className="text-black/80">
                    {[address, city, state, university.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
              {phone && (
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-black/50">Phone</span>
                  <p className="text-black/80">{phone}</p>
                </div>
              )}
              {email && (
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-black/50">Email</span>
                  <a href={`mailto:${email}`} className="text-[#144272] hover:text-[#3FC1C9] hover:underline">{email}</a>
                </div>
              )}
              {university.website && (
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-black/50">Website</span>
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#144272] hover:text-[#3FC1C9] hover:underline flex items-center gap-1 break-all"
                  >
                    <FaArrowUpRightFromSquare className="h-2.5 w-2.5 flex-shrink-0" />
                    {university.website}
                  </a>
                </div>
              )}
              {domains.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-black/50">Email Domains</span>
                  <div className="flex flex-wrap gap-1">
                    {domains.map((domain: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] font-mono border border-[#144272]/15"
                      >
                        @{domain}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {university.country && (
                <div className="pt-2 border-t border-[#144272]/10">
                  <div className="flex items-center gap-2">
                    <FaGlobe className="h-3.5 w-3.5 text-[#3FC1C9]" />
                    <span className="text-[#144272] font-semibold">{university.country}</span>
                    {countryCode && <span className="text-black/50 text-xs">({countryCode})</span>}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-white border border-[#144272]/15 rounded-lg space-y-3">
            <h2 className="text-base font-bold text-[#144272] flex items-center gap-2">
              <FaBuildingColumns className="h-4 w-4 text-[#3FC1C9]" />
              Institution Details
            </h2>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Type', value: level?.replace(/_/g, ' ') },
                { label: 'Control', value: control?.replace(/_/g, ' ') },
                { label: 'Institution', value: institutionType },
                { label: 'Founded', value: founded },
                { label: 'Recognition', value: recognition },
                { label: 'Status', value: status },
                { label: 'Country Code', value: countryCode },
              ]
                .filter((item) => item.value)
                .map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-black/50 flex-shrink-0">
                      {item.label}
                    </span>
                    <span className="text-xs text-[#144272] font-semibold capitalize text-right">{item.value}</span>
                  </div>
                ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-[#144272] text-white space-y-3 border border-[#3FC1C9]/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FFD749]" />
              <span className="text-sm font-black">Ready to Apply?</span>
            </div>
            <p className="text-xs text-[#F5F5F5]/80 leading-relaxed">
              Our expert counselors will guide you through the full application process for{' '}
              <strong>{university.name}</strong>.
            </p>
            <Link href={`/apply/${encodeURIComponent(uniId)}`}>
              <Button className="w-full bg-[#FFD749] text-black hover:bg-[#FFD749]/90 font-bold rounded-lg h-10 mt-1">
                Start Application →
              </Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
