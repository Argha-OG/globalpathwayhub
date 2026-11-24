'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/GlassCard';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaGraduationCap,
  FaBuildingColumns,
  FaGlobe,
  FaClock,
  FaDollarSign,
  FaChevronRight,
  FaCircleCheck,
  FaPaperPlane,
  FaBookOpen,
  FaCopy,
  FaCheck,
  FaWhatsapp,
} from 'react-icons/fa6';
import { Sparkles } from 'lucide-react';
import { generateCourseShareText, copyToClipboard } from '@/lib/share';
import JsonLd from '@/components/JsonLd';
import { getCourseSchema, getBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import CountryFlag from '@/components/CountryFlag';

function LevelBadge({ level }: { level: string }) {
  return (
    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#144272]/20 bg-[#F5F5F5] text-[#144272]">
      {level}
    </span>
  );
}

function InitialsAvatar({ name, className = '' }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0] || '')
    .join('')
    .toUpperCase();
  return (
    <div className={`flex items-center justify-center rounded-lg text-[#FFD749] bg-[#144272] border border-[#3FC1C9]/30 font-black ${className}`}>
      {initials}
    </div>
  );
}

export default function CourseDetailClient({
  course,
  similarCourses,
  id,
}: {
  course: any | null;
  similarCourses: any[];
  id: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyDetails = async () => {
    if (!course) return;
    const url = `${window.location.origin}/courses/${encodeURIComponent(course._id || id)}`;
    const text = generateCourseShareText(course, url);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success('Course & costing details copied! Ready to paste into WhatsApp.');
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleWhatsAppShare = () => {
    if (!course) return;
    const url = `${SITE_URL}/courses/${encodeURIComponent(course._id || id)}`;
    const text = generateCourseShareText(course, url);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <FaBookOpen className="h-14 w-14 text-[#144272]/30 mx-auto" />
          <h2 className="text-xl font-bold text-[#144272]">Course not found</h2>
          <Link href="/courses">
            <Button variant="outline" className="border-[#144272]/30 text-[#144272]">
              ← Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const university = course.university;
  const uniId = university?._id || university?.id || course.universityId;
  const uniName = university?.name || 'University';

  const courseSchema = getCourseSchema({
    id: course._id || course.id,
    name: course.name,
    university_name: uniName,
    level: course.level,
    duration: course.duration,
    fee: course.tuitionFee || course.tuition_fee,
    currency: course.currency || 'USD',
    description: course.description,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Courses & Programs', url: '/courses' },
    { name: uniName, url: uniId ? `/universities/${uniId}` : '/universities' },
    { name: course.name, url: `/courses/${course._id || course.id}` },
  ]);

  return (
    <div className="container mx-auto px-4 py-10 pt-28 max-w-5xl space-y-8">
      <JsonLd data={courseSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="flex items-center justify-between">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#144272]/70 hover:text-[#144272] transition-colors"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </Link>

        <Button
          type="button"
          onClick={handleCopyDetails}
          variant="outline"
          className="border-[#3FC1C9] text-[#144272] bg-[#3FC1C9]/20 hover:bg-[#3FC1C9]/40 rounded-lg text-xs font-bold gap-2 h-9 shadow-xs"
        >
          {copied ? (
            <>
              <FaCheck className="h-3.5 w-3.5 text-[#144272]" />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <FaCopy className="h-3.5 w-3.5 text-[#144272]" />
              Copy for WhatsApp / Student
            </>
          )}
        </Button>
      </div>

      {/* Course Hero */}
      <GlassCard className="p-8 bg-white border border-[#144272]/15 shadow-sm space-y-5 rounded-lg">
        <div className="flex flex-wrap gap-2 items-center">
          {course.level && <LevelBadge level={course.level} />}
          {course.duration && (
            <span className="text-xs text-[#144272] flex items-center gap-1.5 bg-[#F5F5F5] border border-[#144272]/20 px-2.5 py-0.5 rounded-lg">
              <FaClock className="h-3 w-3 text-[#144272]" />
              {course.duration}
            </span>
          )}
          {course.tuitionFee && (
            <span className="text-xs font-bold text-black bg-[#FFD749] border border-[#144272]/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
              <FaDollarSign className="h-3 w-3 text-[#144272]" />
              {course.tuitionFee}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-[#144272] leading-tight">
          {course.name}
        </h1>

        {course.description && (
          <p className="text-base text-black/70 leading-relaxed max-w-3xl">
            {course.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {uniId && (
            <Link href={`/apply/${encodeURIComponent(uniId)}`}>
              <Button className="bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] font-bold rounded-lg h-11 px-6 gap-2 text-sm uppercase tracking-wider">
                <FaPaperPlane className="h-4 w-4" />
                Apply for this Course
              </Button>
            </Link>
          )}

          <Button
            type="button"
            onClick={handleCopyDetails}
            className={`font-bold rounded-lg h-11 px-6 gap-2 shadow-xs transition-all text-sm uppercase tracking-wider ${
              copied
                ? 'bg-[#3FC1C9] text-[#144272]'
                : 'border border-[#144272]/30 bg-white text-[#144272] hover:bg-[#F5F5F5]'
            }`}
          >
            {copied ? (
              <>
                <FaCheck className="h-4 w-4 text-[#144272]" />
                Copied for WhatsApp!
              </>
            ) : (
              <>
                <FaCopy className="h-4 w-4 text-[#144272]" />
                Copy Course &amp; Costing Details
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleWhatsAppShare}
            className="bg-[#3FC1C9] hover:bg-[#3FC1C9]/80 text-[#144272] font-bold rounded-lg h-11 px-5 gap-2 shadow-xs text-sm uppercase tracking-wider"
            title="Open WhatsApp with prefilled message"
          >
            <FaWhatsapp className="h-4 w-4 text-[#144272]" />
            Share on WhatsApp
          </Button>

          {uniId && (
            <Link href={`/universities/${encodeURIComponent(uniId)}`}>
              <Button variant="outline" className="border-[#144272]/20 text-[#144272] hover:bg-[#F5F5F5] rounded-lg h-11 px-5 gap-2 text-sm">
                <FaBuildingColumns className="h-4 w-4" />
                University Profile
              </Button>
            </Link>
          )}
        </div>
      </GlassCard>

      {university && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[#144272] flex items-center gap-2">
            <FaBuildingColumns className="h-5 w-5 text-[#3FC1C9]" />
            Offered By
          </h2>
          <Link href={uniId ? `/universities/${encodeURIComponent(uniId)}` : '#'} className="group block">
            <GlassCard className="p-6 bg-white hover:border-[#3FC1C9] border-[#144272]/15 transition-all rounded-lg">
              <div className="flex items-center gap-5">
                <InitialsAvatar name={uniName} className="w-14 h-14 text-xl flex-shrink-0 shadow-xs" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#144272] group-hover:text-[#3FC1C9] transition-colors">
                    {uniName}
                  </h3>
                  {(university.country || university.location) && (
                    <p className="text-xs text-black/60 mt-0.5 flex items-center gap-1.5">
                      <CountryFlag country={university.country} size="xs" />
                      <span>{university.location || university.country}</span>
                    </p>
                  )}
                  {university.website && (
                    <p className="text-xs text-[#144272] hover:text-[#3FC1C9] mt-0.5 flex items-center gap-1.5">
                      <FaGlobe className="h-2.5 w-2.5 flex-shrink-0" />
                      {university.website.replace(/^https?:\/\//, '')}
                    </p>
                  )}
                </div>
                <FaChevronRight className="h-4 w-4 text-[#144272]/40 group-hover:text-[#3FC1C9] flex-shrink-0 transition-colors" />
              </div>
            </GlassCard>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <FaGraduationCap className="h-5 w-5 text-[#144272]" />, label: 'Level', value: course.level },
          { icon: <FaClock className="h-5 w-5 text-[#144272]" />, label: 'Duration', value: course.duration },
          { icon: <FaDollarSign className="h-5 w-5 text-[#144272]" />, label: 'Tuition Fee / Costing', value: course.tuitionFee },
        ]
          .filter((item) => item.value)
          .map((item, i) => (
            <GlassCard key={i} className="p-5 bg-white border border-[#144272]/15 flex items-center gap-4 rounded-lg">
              <div className="p-2.5 rounded-lg bg-[#3FC1C9]/20">{item.icon}</div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-black/50 block">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-[#144272]">{item.value}</span>
              </div>
            </GlassCard>
          ))}
      </div>

      {uniId && (
        <GlassCard className="p-8 bg-[#144272] text-white border border-[#3FC1C9]/30 flex flex-col sm:flex-row items-center gap-6 rounded-lg">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FFD749]" />
              <span className="text-lg font-black">Ready to Enroll?</span>
            </div>
            <p className="text-sm text-[#F5F5F5]/80 leading-relaxed">
              Apply for <strong>{course.name}</strong> at <strong>{uniName}</strong> with expert counselor support.
            </p>
          </div>
          <Link href={`/apply/${encodeURIComponent(uniId)}`} className="flex-shrink-0">
            <Button className="bg-[#FFD749] text-black hover:bg-[#FFD749]/90 font-bold rounded-lg h-11 px-7 gap-2 text-sm uppercase tracking-wider">
              <FaPaperPlane className="h-4 w-4" />
              Apply Now →
            </Button>
          </Link>
        </GlassCard>
      )}

      {similarCourses.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#144272] flex items-center gap-2">
              <FaCircleCheck className="h-5 w-5 text-[#3FC1C9]" />
              Similar Courses
            </h2>
            <Link href="/courses" className="text-xs font-semibold text-[#144272] hover:text-[#3FC1C9] hover:underline">
              View all courses →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {similarCourses.map((sc: any) => (
              <Link
                key={sc._id}
                href={`/courses/${encodeURIComponent(sc._id)}`}
                className="group"
              >
                <GlassCard className="p-5 bg-white hover:border-[#3FC1C9] border-[#144272]/15 transition-all h-full flex flex-col justify-between gap-3 rounded-lg">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-[#144272] group-hover:text-[#3FC1C9] transition-colors leading-snug">
                        {sc.name}
                      </h3>
                      <FaChevronRight className="h-3 w-3 text-[#144272]/40 group-hover:text-[#3FC1C9] flex-shrink-0 mt-0.5 transition-colors" />
                    </div>
                    {sc.university?.name && (
                      <p className="text-[11px] text-black/50 flex items-center gap-1">
                        <FaBuildingColumns className="h-2.5 w-2.5 text-[#144272]" />
                        {sc.university.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {sc.level && <LevelBadge level={sc.level} />}
                    {sc.tuitionFee && (
                      <span className="text-[10px] font-bold text-black bg-[#FFD749] px-2 py-0.5 rounded-lg ml-auto border border-[#144272]/20">
                        {sc.tuitionFee}
                      </span>
                    )}
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
