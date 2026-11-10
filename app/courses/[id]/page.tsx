'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/GlassCard';
import toast from 'react-hot-toast';
import {
    FaArrowLeft,
    FaGraduationCap,
    FaBuildingColumns,
    FaLocationDot,
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
import { getCourseSchema, getBreadcrumbSchema } from '@/lib/seo';

function LevelBadge({ level }: { level: string }) {
    const colorMap: Record<string, string> = {
        certificate: 'bg-orange-100 text-orange-800 border-orange-200',
        diploma: 'bg-amber-100 text-amber-800 border-amber-200',
        'advance diploma': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        foundation: 'bg-lime-100 text-lime-800 border-lime-200',
        bachelor: 'bg-blue-100 text-blue-800 border-blue-200',
        masters: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        phd: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    const key = level?.toLowerCase() || '';
    const cls =
        Object.entries(colorMap).find(([k]) => key.includes(k))?.[1] ||
        'bg-slate-100 text-slate-700 border-slate-200';
    return (
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cls}`}>
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
    const colors = [
        'bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-purple-600',
        'bg-emerald-600', 'bg-teal-600', 'bg-sky-600', 'bg-rose-600',
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    return (
        <div className={`flex items-center justify-center rounded-xl text-white font-black ${colors[colorIndex]} ${className}`}>
            {initials}
        </div>
    );
}

export default function CourseDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [course, setCourse] = useState<any>(null);
    const [similarCourses, setSimilarCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/courses/${encodeURIComponent(id)}`)
            .then((r) => r.json())
            .then((data) => {
                if (data?.message && !data?.name) {
                    setError(data.message);
                } else {
                    setCourse(data);
                    const level = data.level || '';
                    const qParams = new URLSearchParams();
                    if (level) qParams.set('level', level);
                    qParams.set('excludeId', data._id || id);
                    qParams.set('limit', '6');
                    fetch(`/api/courses?${qParams.toString()}`)
                        .then((r) => r.json())
                        .then((similar) => {
                            setSimilarCourses(Array.isArray(similar) ? similar : []);
                        })
                        .catch(() => {});
                }
            })
            .catch(() => setError('Failed to load course details'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleCopyDetails = async () => {
        if (!course) return;
        const text = generateCourseShareText(course);
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
        const text = generateCourseShareText(course);
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center space-y-4">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-500 font-medium">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center space-y-4">
                    <FaBookOpen className="h-14 w-14 text-slate-300 mx-auto" />
                    <h2 className="text-xl font-bold text-slate-700">{error || 'Course not found'}</h2>
                    <Link href="/courses">
                        <Button variant="outline">← Back to Courses</Button>
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
        fee: course.tuition_fee,
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

            {/* Back link & Top Quick Share Button */}
            <div className="flex items-center justify-between">
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <FaArrowLeft className="h-3.5 w-3.5" />
                    Back to Courses
                </Link>

                <Button
                    type="button"
                    onClick={handleCopyDetails}
                    variant="outline"
                    className="border-blue-200 text-blue-700 bg-blue-50/70 hover:bg-blue-100 rounded-xl text-xs font-bold gap-2 h-9 shadow-xs"
                >
                    {copied ? (
                        <>
                            <FaCheck className="h-3.5 w-3.5 text-emerald-600" />
                            Copied to Clipboard!
                        </>
                    ) : (
                        <>
                            <FaCopy className="h-3.5 w-3.5 text-blue-600" />
                            Copy for WhatsApp / Student
                        </>
                    )}
                </Button>
            </div>

            {/* Course Hero */}
            <GlassCard className="p-8 bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl space-y-5">
                <div className="flex flex-wrap gap-2 items-center">
                    {course.level && <LevelBadge level={course.level} />}
                    {course.duration && (
                        <span className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            <FaClock className="h-3 w-3" />
                            {course.duration}
                        </span>
                    )}
                    {course.tuitionFee && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <FaDollarSign className="h-3 w-3" />
                            {course.tuitionFee}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                    {course.name}
                </h1>

                {course.description && (
                    <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
                        {course.description}
                    </p>
                )}

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    {uniId && (
                        <Link href={`/apply/${encodeURIComponent(uniId)}`}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-6 gap-2">
                                <FaPaperPlane className="h-4 w-4" />
                                Apply for this Course
                            </Button>
                        </Link>
                    )}

                    {/* Copy Details for WhatsApp Button */}
                    <Button
                        type="button"
                        onClick={handleCopyDetails}
                        className={`font-bold rounded-xl h-11 px-6 gap-2 shadow-sm transition-all ${
                            copied
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                    >
                        {copied ? (
                            <>
                                <FaCheck className="h-4 w-4" />
                                Copied for WhatsApp!
                            </>
                        ) : (
                            <>
                                <FaCopy className="h-4 w-4" />
                                Copy Course & Costing Details
                            </>
                        )}
                    </Button>

                    {/* Direct WhatsApp Share Button */}
                    <Button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 px-5 gap-2 shadow-sm"
                        title="Open WhatsApp with prefilled message"
                    >
                        <FaWhatsapp className="h-4 w-4 text-white" />
                        Share on WhatsApp
                    </Button>

                    {uniId && (
                        <Link href={`/universities/${encodeURIComponent(uniId)}`}>
                            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-11 px-5 gap-2">
                                <FaBuildingColumns className="h-4 w-4" />
                                University Profile
                            </Button>
                        </Link>
                    )}
                </div>
            </GlassCard>

            {/* University Info Card */}
            {university && (
                <div className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FaBuildingColumns className="h-5 w-5 text-blue-500" />
                        Offered By
                    </h2>
                    <Link href={uniId ? `/universities/${encodeURIComponent(uniId)}` : '#'} className="group block">
                        <GlassCard className="p-6 bg-white/60 hover:bg-white/90 hover:shadow-lg hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-5">
                                <InitialsAvatar name={uniName} className="w-14 h-14 text-xl flex-shrink-0 shadow" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                        {uniName}
                                    </h3>
                                    {(university.country || university.location) && (
                                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                                            <FaLocationDot className="h-3 w-3 text-red-400 flex-shrink-0" />
                                            {university.location || university.country}
                                        </p>
                                    )}
                                    {university.website && (
                                        <p className="text-xs text-blue-500 mt-0.5 flex items-center gap-1.5">
                                            <FaGlobe className="h-2.5 w-2.5 flex-shrink-0" />
                                            {university.website.replace(/^https?:\/\//, '')}
                                        </p>
                                    )}
                                </div>
                                <FaChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                            </div>
                        </GlassCard>
                    </Link>
                </div>
            )}

            {/* Course Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { icon: <FaGraduationCap className="h-5 w-5 text-indigo-600" />, label: 'Level', value: course.level },
                    { icon: <FaClock className="h-5 w-5 text-amber-600" />, label: 'Duration', value: course.duration },
                    { icon: <FaDollarSign className="h-5 w-5 text-emerald-600" />, label: 'Tuition Fee / Costing', value: course.tuitionFee },
                ]
                    .filter((item) => item.value)
                    .map((item, i) => (
                        <GlassCard key={i} className="p-5 bg-white/60 flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-slate-100">{item.icon}</div>
                            <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                                    {item.label}
                                </span>
                                <span className="text-sm font-bold text-slate-800">{item.value}</span>
                            </div>
                        </GlassCard>
                    ))}
            </div>

            {/* Apply CTA Banner */}
            {uniId && (
                <GlassCard className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-400/30 flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-300" />
                            <span className="text-lg font-black">Ready to Enroll?</span>
                        </div>
                        <p className="text-sm text-blue-100 leading-relaxed">
                            Apply for <strong>{course.name}</strong> at <strong>{uniName}</strong> with expert counselor support.
                        </p>
                    </div>
                    <Link href={`/apply/${encodeURIComponent(uniId)}`} className="flex-shrink-0">
                        <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl h-11 px-7 gap-2 text-sm">
                            <FaPaperPlane className="h-4 w-4" />
                            Apply Now →
                        </Button>
                    </Link>
                </GlassCard>
            )}

            {/* Similar Courses */}
            {similarCourses.length > 0 && (
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <FaCircleCheck className="h-5 w-5 text-emerald-500" />
                            Similar Courses
                        </h2>
                        <Link href="/courses" className="text-xs font-semibold text-blue-600 hover:underline">
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
                                <GlassCard className="p-5 bg-white/60 hover:bg-white/90 hover:shadow-lg hover:border-blue-200 transition-all h-full flex flex-col justify-between gap-3">
                                    <div className="space-y-1.5">
                                        <div className="flex items-start justify-between gap-1">
                                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                                                {sc.name}
                                            </h3>
                                            <FaChevronRight className="h-3 w-3 text-slate-300 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
                                        </div>
                                        {sc.university?.name && (
                                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                                <FaBuildingColumns className="h-2.5 w-2.5 flex-shrink-0" />
                                                {sc.university.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 items-center">
                                        {sc.level && <LevelBadge level={sc.level} />}
                                        {sc.tuitionFee && (
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
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
