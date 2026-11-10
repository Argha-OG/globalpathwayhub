'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
    FaLink,
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
import { getCollegeOrUniversitySchema, getBreadcrumbSchema } from '@/lib/seo';

function InitialsAvatar({ name, className = '' }: { name: string; className?: string }) {
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0] || '')
        .join('')
        .toUpperCase();
    const colors = [
        'bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-purple-600',
        'bg-emerald-600', 'bg-teal-600', 'bg-sky-600', 'bg-rose-600',
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    return (
        <div
            className={`flex items-center justify-center rounded-2xl text-white font-black ${colors[colorIndex]} ${className}`}
        >
            {initials}
        </div>
    );
}

export default function UniversityDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [university, setUniversity] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedUni, setCopiedUni] = useState(false);
    const [copiedCourseId, setCopiedCourseId] = useState<string | null>(null);

    const handleCopyUniversity = async () => {
        if (!university) return;
        const text = generateUniversityShareText(university);
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
        const text = generateUniversityShareText(university);
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

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        Promise.all([
            fetch(`/api/universities/${encodeURIComponent(id)}`).then((r) => r.json()),
            fetch(`/api/courses?universityId=${encodeURIComponent(id)}`).then((r) => r.json()),
        ])
            .then(([uniData, courseData]) => {
                if (uniData?.message && !uniData?.name) {
                    setError(uniData.message || 'University not found');
                } else {
                    setUniversity(uniData);
                    setCourses(Array.isArray(courseData) ? courseData : []);
                }
            })
            .catch(() => setError('Failed to load university details'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center space-y-4">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-500 font-medium">Loading university profile...</p>
                </div>
            </div>
        );
    }

    if (error || !university) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center space-y-4">
                    <FaBuildingColumns className="h-14 w-14 text-slate-300 mx-auto" />
                    <h2 className="text-xl font-bold text-slate-700">{error || 'University not found'}</h2>
                    <Link href="/universities">
                        <Button variant="outline">← Back to Universities</Button>
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
        description: university.description || `Accredited higher education institution in ${university.country}.`,
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

            {/* Back button */}
            <Link
                href="/universities"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
                <FaArrowLeft className="h-3.5 w-3.5" />
                Back to Universities
            </Link>

            {/* Hero Card */}
            <GlassCard className="p-8 md:p-10 bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl">
                <div className="flex flex-col md:flex-row gap-7 items-start">
                    {/* Initials Avatar */}
                    <InitialsAvatar name={university.name} className="w-24 h-24 text-3xl flex-shrink-0 shadow-lg" />

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Status badge */}
                            {status && (
                                <span
                                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                        status === 'active'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-rose-100 text-rose-800'
                                    }`}
                                >
                                    ● {status}
                                </span>
                            )}
                            {recognition && (
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                    Nationally {recognition}
                                </span>
                            )}
                            {level && (
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 capitalize">
                                    {level.replace(/_/g, ' ')}
                                </span>
                            )}
                            {(control || institutionType) && (
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                                    {institutionType || control}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                            {university.name}
                        </h1>

                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                            <FaLocationDot className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                            {[address, city, state, regionCode, university.country].filter(Boolean).join(', ')}
                            {countryCode && (
                                <span className="ml-1 font-bold text-blue-700">({countryCode})</span>
                            )}
                        </p>

                        {founded && (
                            <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                <FaClock className="h-3 w-3" />
                                Founded {founded}
                            </p>
                        )}

                        {/* Contact row */}
                        <div className="flex flex-wrap gap-3 pt-1">
                            {university.website && (
                                <a
                                    href={university.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                                >
                                    <FaGlobe className="h-3 w-3" />
                                    {university.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            {phone && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                    <FaPhone className="h-3 w-3" />
                                    {phone}
                                </span>
                            )}
                            {email && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                    <FaEnvelope className="h-3 w-3" />
                                    {email}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-2 w-full md:w-auto min-w-[170px]">
                        <Link href={`/apply/${encodeURIComponent(uniId)}`}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10 shadow-md gap-2 text-xs">
                                <FaPaperPlane className="h-3.5 w-3.5" />
                                Apply Now
                            </Button>
                        </Link>

                        {/* Copy details for WhatsApp */}
                        <Button
                            type="button"
                            onClick={handleCopyUniversity}
                            className={`w-full font-bold rounded-xl h-10 text-xs gap-1.5 shadow-xs transition-all ${
                                copiedUni
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                        >
                            {copiedUni ? (
                                <>
                                    <FaCheck className="h-3.5 w-3.5" />
                                    Copied for WhatsApp!
                                </>
                            ) : (
                                <>
                                    <FaCopy className="h-3.5 w-3.5" />
                                    Copy for WhatsApp
                                </>
                            )}
                        </Button>

                        {/* Direct WhatsApp Share */}
                        <Button
                            type="button"
                            onClick={handleWhatsAppShareUni}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-10 text-xs gap-1.5 shadow-xs"
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
                                    className="w-full text-slate-500 hover:text-blue-600 text-xs h-9 gap-1.5"
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
                        color: 'text-emerald-600 bg-emerald-50',
                    },
                    {
                        icon: <FaUsers className="h-5 w-5" />,
                        label: 'Enrollment',
                        value: enrollment ? Number(enrollment).toLocaleString() : 'N/A',
                        sub: details.enrollment_year ? `Year ${details.enrollment_year}` : undefined,
                        color: 'text-blue-600 bg-blue-50',
                    },
                    {
                        icon: <FaStar className="h-5 w-5" />,
                        label: 'Faculty Ratio',
                        value: facultyRatio ? `${facultyRatio}:1` : 'N/A',
                        sub: undefined,
                        color: 'text-violet-600 bg-violet-50',
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
                        color: 'text-amber-600 bg-amber-50',
                    },
                ].map((stat, i) => (
                    <GlassCard key={i} className="p-5 flex flex-col items-center text-center space-y-1.5 bg-white/60">
                        <div className={`p-2.5 rounded-xl ${stat.color}`}>{stat.icon}</div>
                        <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
                            {stat.label}
                        </span>
                        <span className="text-lg font-black text-slate-900">{stat.value}</span>
                        {stat.sub && <span className="text-[10px] text-slate-400">{stat.sub}</span>}
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column: About + Domains + Accreditation */}
                <div className="md:col-span-2 space-y-6">
                    {/* About */}
                    {university.description && (
                        <GlassCard className="p-6 bg-white/60 space-y-3">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <FaBuildingColumns className="h-4 w-4 text-blue-500" />
                                About
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">{university.description}</p>
                        </GlassCard>
                    )}

                    {/* Degree Types */}
                    {degreeTypes.length > 0 && (
                        <GlassCard className="p-6 bg-white/60 space-y-3">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <FaGraduationCap className="h-4 w-4 text-violet-500" />
                                Degree Types Offered ({degreeTypes.length})
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {degreeTypes.map((deg: string, i: number) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-100"
                                    >
                                        {deg}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* Accreditation */}
                    {accreditation && (
                        <GlassCard className="p-6 bg-white/60 space-y-3">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <FaCircleCheck className="h-4 w-4 text-emerald-500" />
                                Accreditation
                            </h2>
                            <p className="text-sm text-slate-600">{accreditation}</p>
                        </GlassCard>
                    )}

                    {/* Courses at this university */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <FaBookOpen className="h-5 w-5 text-blue-500" />
                                Courses at {university.name}
                            </h2>
                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                {courses.length} courses
                            </span>
                        </div>

                        {courses.length === 0 ? (
                            <GlassCard className="p-8 text-center bg-white/50">
                                <FaBookOpen className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 font-medium">No courses listed for this university yet.</p>
                                <p className="text-xs text-slate-400 mt-1">Check the official website or contact a counselor.</p>
                            </GlassCard>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {courses.map((course: any) => (
                                    <Link
                                        key={course._id}
                                        href={`/courses/${encodeURIComponent(course._id)}`}
                                        className="group"
                                    >
                                        <GlassCard className="p-5 bg-white/60 hover:bg-white/90 hover:shadow-lg hover:border-blue-200 transition-all h-full flex flex-col justify-between gap-3">
                                            <div className="space-y-1.5">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                                                        {course.name}
                                                    </h3>
                                                    <FaChevronRight className="h-3 w-3 text-slate-300 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
                                                </div>
                                                {course.description && (
                                                    <p className="text-xs text-slate-500 line-clamp-2">
                                                        {course.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2 items-center">
                                                {course.level && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        {course.level}
                                                    </span>
                                                )}
                                                {course.duration && (
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <FaClock className="h-2.5 w-2.5" />
                                                        {course.duration}
                                                    </span>
                                                )}
                                                {course.tuitionFee && (
                                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                        {course.tuitionFee}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quick Copy for WhatsApp */}
                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-slate-400">
                                                    Share with Student
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleCopyCourse(e, course)}
                                                    title="Copy course & costing details for WhatsApp"
                                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                                                        copiedCourseId === course._id
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                                                    }`}
                                                >
                                                    {copiedCourseId === course._id ? (
                                                        <>
                                                            <FaCheck className="h-2.5 w-2.5" />
                                                            <span>Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCopy className="h-2.5 w-2.5" />
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

                {/* Right column: Contact info + Domains */}
                <div className="space-y-6">
                    {/* Contact Details */}
                    <GlassCard className="p-6 bg-white/60 space-y-4">
                        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <FaLocationDot className="h-4 w-4 text-red-500" />
                            Location & Contact
                        </h2>
                        <div className="space-y-3 text-sm">
                            {address && (
                                <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Address</span>
                                    <p className="text-slate-700">
                                        {[address, city, state, university.country].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                            )}
                            {phone && (
                                <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Phone</span>
                                    <p className="text-slate-700">{phone}</p>
                                </div>
                            )}
                            {email && (
                                <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email</span>
                                    <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
                                </div>
                            )}
                            {university.website && (
                                <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Website</span>
                                    <a
                                        href={university.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-1 break-all"
                                    >
                                        <FaArrowUpRightFromSquare className="h-2.5 w-2.5 flex-shrink-0" />
                                        {university.website}
                                    </a>
                                </div>
                            )}
                            {domains.length > 0 && (
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email Domains</span>
                                    <div className="flex flex-wrap gap-1">
                                        {domains.map((domain: string, i: number) => (
                                            <span
                                                key={i}
                                                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono"
                                            >
                                                @{domain}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {university.country && (
                                <div className="pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <FaGlobe className="h-3.5 w-3.5 text-blue-400" />
                                        <span className="text-slate-700 font-semibold">{university.country}</span>
                                        {countryCode && <span className="text-slate-400 text-xs">({countryCode})</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Institution Details */}
                    <GlassCard className="p-6 bg-white/60 space-y-3">
                        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <FaBuildingColumns className="h-4 w-4 text-indigo-500" />
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
                                        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex-shrink-0">
                                            {item.label}
                                        </span>
                                        <span className="text-xs text-slate-700 capitalize text-right">{item.value}</span>
                                    </div>
                                ))}
                        </div>
                    </GlassCard>

                    {/* Apply CTA card */}
                    <GlassCard className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-3 border-blue-400/30">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-300" />
                            <span className="text-sm font-black">Ready to Apply?</span>
                        </div>
                        <p className="text-xs text-blue-100 leading-relaxed">
                            Our expert counselors will guide you through the full application process for{' '}
                            <strong>{university.name}</strong>.
                        </p>
                        <Link href={`/apply/${encodeURIComponent(uniId)}`}>
                            <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl h-10 mt-1">
                                Start Application →
                            </Button>
                        </Link>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

