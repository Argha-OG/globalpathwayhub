'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Pagination from '@/components/Pagination';
import {
    FaMagnifyingGlass,
    FaGraduationCap,
    FaBuildingColumns,
    FaLocationDot,
    FaClock,
    FaDollarSign,
    FaChevronRight,
    FaFilter,
    FaXmark,
    FaCopy,
    FaCheck,
    FaWhatsapp,
} from 'react-icons/fa6';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateCourseShareText, copyToClipboard } from '@/lib/share';

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
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cls} whitespace-nowrap`}>
            {level}
        </span>
    );
}

const LEVELS = ['Certificate', 'Diploma', 'Advance Diploma', 'Foundation', 'Bachelor', 'Masters', 'PhD'];
const PAGE_SIZE = 12;

export default function CoursesPage() {
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedCountry, setSelectedCountry] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [copiedCourseId, setCopiedCourseId] = useState<string | null>(null);

    const handleCopyCourse = async (e: React.MouseEvent, course: any) => {
        e.preventDefault();
        e.stopPropagation();
        const text = generateCourseShareText(course);
        const ok = await copyToClipboard(text);
        if (ok) {
            setCopiedCourseId(course._id);
            toast.success(`Copied "${course.name}" details! Ready to paste into WhatsApp.`);
            setTimeout(() => setCopiedCourseId(null), 2500);
        } else {
            toast.error('Could not copy course details');
        }
    };

    // Load all courses once
    useEffect(() => {
        setLoading(true);
        fetch('/api/courses')
            .then((r) => r.json())
            .then((data) => {
                setAllCourses(Array.isArray(data) ? data : []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Derive unique countries
    const countries = React.useMemo(() => {
        const set = new Set<string>();
        allCourses.forEach((c) => {
            const country = c.university?.country;
            if (country) set.add(country);
        });
        return Array.from(set).sort();
    }, [allCourses]);

    // Filter logic
    useEffect(() => {
        let result = allCourses;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.name?.toLowerCase().includes(q) ||
                    c.description?.toLowerCase().includes(q) ||
                    c.university?.name?.toLowerCase().includes(q)
            );
        }

        if (selectedLevel !== 'all') {
            result = result.filter((c) =>
                c.level?.toLowerCase().includes(selectedLevel.toLowerCase())
            );
        }

        if (selectedCountry !== 'all') {
            result = result.filter((c) => c.university?.country === selectedCountry);
        }

        setFiltered(result);
        setCurrentPage(1);
    }, [search, selectedLevel, selectedCountry, allCourses]);

    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const hasFilters = search.trim() || selectedLevel !== 'all' || selectedCountry !== 'all';

    const resetFilters = () => {
        setSearch('');
        setSelectedLevel('all');
        setSelectedCountry('all');
    };

    return (
        <div className="container mx-auto px-4 py-12 pt-28 space-y-10 max-w-7xl">
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Accredited Programs Worldwide
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                    Explore All Courses
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                    Browse{' '}
                    <span className="font-bold text-blue-700">{allCourses.length}+ accredited programs</span> across
                    partner universities worldwide. Filter by level, country, or search by name.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                    <FaFilter className="h-4 w-4 text-blue-500" />
                    Search & Filter
                    {hasFilters && (
                        <button
                            onClick={resetFilters}
                            className="ml-auto text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
                        >
                            <FaXmark className="h-3 w-3" />
                            Clear filters
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Search */}
                    <div className="sm:col-span-5 relative">
                        <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search courses, programs, universities..."
                            className="pl-10 bg-white border-slate-300 rounded-xl"
                        />
                    </div>

                    {/* Level */}
                    <div className="sm:col-span-3">
                        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                            <SelectTrigger className="bg-white border-slate-300 rounded-xl">
                                <SelectValue placeholder="All Levels" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                {LEVELS.map((l) => (
                                    <SelectItem key={l} value={l}>
                                        {l}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Country */}
                    <div className="sm:col-span-3">
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger className="bg-white border-slate-300 rounded-xl">
                                <SelectValue placeholder="All Countries" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Countries</SelectItem>
                                {countries.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Results count pill */}
                    <div className="sm:col-span-1 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl whitespace-nowrap">
                            {filtered.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center py-20 space-y-3">
                    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-slate-500 font-medium">Loading courses...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                    <FaMagnifyingGlass className="h-12 w-12 text-slate-200 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-700">No courses found</h3>
                    <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
                    {hasFilters && (
                        <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline font-semibold">
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {paginated.map((course: any) => {
                            const uniId =
                                course.university?._id || course.university?.id || course.universityId;
                            return (
                                <Link
                                    key={course._id}
                                    href={`/courses/${encodeURIComponent(course._id)}`}
                                    className="group"
                                >
                                    <GlassCard className="p-6 bg-white/60 hover:bg-white/90 hover:shadow-xl hover:border-blue-200 transition-all h-full flex flex-col justify-between gap-4 rounded-2xl">
                                        {/* Top */}
                                        <div className="space-y-3">
                                            {/* Level & Duration badges */}
                                            <div className="flex flex-wrap gap-1.5 items-center">
                                                {course.level && <LevelBadge level={course.level} />}
                                                {course.duration && (
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                                                        <FaClock className="h-2.5 w-2.5" />
                                                        {course.duration}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Course name */}
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                                                    {course.name}
                                                </h3>
                                                <FaChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
                                            </div>

                                            {/* Description */}
                                            {course.description && (
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                    {course.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Bottom: University info + tuition */}
                                        <div className="space-y-3 pt-3 border-t border-slate-100">
                                            {course.university?.name && (
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                                                        style={{
                                                            background: `hsl(${
                                                                (course.university.name.charCodeAt(0) * 37) % 360
                                                            }, 60%, 50%)`,
                                                        }}
                                                    >
                                                        {course.university.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-slate-700 truncate">
                                                            {course.university.name}
                                                        </p>
                                                        {course.university.country && (
                                                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                                <FaLocationDot className="h-2.5 w-2.5 text-red-400" />
                                                                {course.university.country}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-1 gap-2">
                                                {course.tuitionFee ? (
                                                    <div>
                                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                                                            Tuition Fee
                                                        </span>
                                                        <span className="text-sm font-black text-emerald-700">
                                                            {course.tuitionFee}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div />
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={(e) => handleCopyCourse(e, course)}
                                                    title="Copy course & university details for WhatsApp / Messaging"
                                                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                                        copiedCourseId === course._id
                                                            ? 'bg-emerald-600 text-white shadow-xs'
                                                            : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 border border-transparent'
                                                    }`}
                                                >
                                                    {copiedCourseId === course._id ? (
                                                        <>
                                                            <FaCheck className="h-3 w-3" />
                                                            <span>Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCopy className="h-3 w-3" />
                                                            <span>Copy Details</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {filtered.length > pageSize && (
                        <div className="pt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={filtered.length}
                                pageSize={pageSize}
                                pageSizeOptions={[6, 12, 24, 48]}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 100, behavior: 'smooth' });
                                }}
                                onPageSizeChange={(newSize) => {
                                    setPageSize(newSize);
                                    setCurrentPage(1);
                                }}
                                className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 p-4 shadow-sm"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
