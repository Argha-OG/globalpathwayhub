'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    FaLocationDot,
    FaCircleCheck,
    FaDollarSign,
    FaMagnifyingGlass,
    FaFilter,
    FaBuildingColumns,
    FaGlobe,
    FaGraduationCap,
    FaArrowUpRightFromSquare,
    FaCopy,
    FaCheck,
    FaWhatsapp,
    FaRotateLeft,
    FaChevronRight,
} from 'react-icons/fa6';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '@/components/Pagination';
import { generateUniversityShareText, copyToClipboard } from '@/lib/share';

// Deterministic Initials Badge
function UniversityInitialsBadge({ name }: { name: string }) {
    const initials = (name || 'UN')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

    const hash = (name || 'UN').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const hue = (hash * 37) % 360;

    return (
        <div
            className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl text-white font-black text-xl sm:text-2xl shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{
                background: `linear-gradient(135deg, hsl(${hue}, 65%, 45%), hsl(${(hue + 40) % 360}, 75%, 35%))`,
            }}
        >
            {initials || 'UN'}
        </div>
    );
}

function UniversitiesContent() {
    const searchParams = useSearchParams();
    const urlSearch = searchParams.get('search') || '';
    const urlCountry = searchParams.get('country') || 'all';

    const [directoryMode, setDirectoryMode] = useState<'partners' | 'global'>('partners');

    // Partner Universities State
    const [universities, setUniversities] = useState<any[]>([]);
    const [loadingPartners, setLoadingPartners] = useState(true);
    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const [selectedCountry, setSelectedCountry] = useState(urlCountry);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedOfferTypes, setSelectedOfferTypes] = useState<string[]>([]);
    const [copiedUniId, setCopiedUniId] = useState<string | null>(null);

    // Partner Pagination (default 12 for ample visibility)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    // Global Registry State (Worldwide Lookup)
    const [globalQuery, setGlobalQuery] = useState(urlSearch || 'Oxford');
    const [globalCountry, setGlobalCountry] = useState('all');
    const [globalLevel, setGlobalLevel] = useState('all');
    const [globalControl, setGlobalControl] = useState('all');
    const [globalList, setGlobalList] = useState<any[]>([]);
    const [loadingGlobal, setLoadingGlobal] = useState(false);
    const [globalPage, setGlobalPage] = useState(1);
    const [globalPageSize, setGlobalPageSize] = useState(12);

    // Synchronize URL parameters if they change
    useEffect(() => {
        if (urlSearch) {
            setSearchQuery(urlSearch);
            setGlobalQuery(urlSearch);
        }
        if (urlCountry && urlCountry !== 'all') {
            setSelectedCountry(urlCountry);
        }
    }, [urlSearch, urlCountry]);

    // Initial partner universities & courses fetch
    useEffect(() => {
        setLoadingPartners(true);
        Promise.all([
            fetch('/api/universities').then((r) => r.json()),
            fetch('/api/courses').then((r) => r.json()),
        ])
            .then(([unis, courses]) => {
                const uniList = Array.isArray(unis) ? unis : [];
                const courseList = Array.isArray(courses) ? courses : [];

                const combined = uniList.map((u: any) => {
                    const uniCourses = courseList.filter(
                        (c: any) =>
                            c.universityId === u._id ||
                            c.university?._id === u._id ||
                            c.university === u._id
                    );

                    const programs = uniCourses.map((c: any) => {
                        const feeString = c.tuitionFee || '0';
                        const feeMatch = feeString.match(/[\d,]+/);
                        const fee = feeMatch ? parseInt(feeMatch[0].replace(/,/g, '')) : 0;
                        return { title: c.name, category: c.level, fee, feeString: c.tuitionFee };
                    });

                    // Collect distinct levels offered by this university
                    const levelSet = new Set<string>();
                    uniCourses.forEach((c: any) => {
                        if (c.level) levelSet.add(c.level);
                    });
                    if (u.details?.degree_types && Array.isArray(u.details.degree_types)) {
                        u.details.degree_types.forEach((d: string) => levelSet.add(d));
                    }

                    const offerLetterFee =
                        u.offerLetterFee ||
                        u.details?.offer_letter_fee ||
                        (u.country === 'Malaysia' ? 'Free' : 'Paid');

                    return {
                        ...u,
                        programs,
                        levels: Array.from(levelSet),
                        courseCount: uniCourses.length,
                        offerLetterFee,
                    };
                });

                setUniversities(combined);
            })
            .catch(() => {
                toast.error('Failed to load universities');
            })
            .finally(() => setLoadingPartners(false));
    }, []);

    // Fetch Global Directory results
    const fetchGlobalUniversities = async (
        nameQuery = globalQuery,
        countryQuery = globalCountry,
        levelQuery = globalLevel,
        controlQuery = globalControl
    ) => {
        setLoadingGlobal(true);
        try {
            const params = new URLSearchParams();
            if (nameQuery && nameQuery.trim()) params.set('name', nameQuery.trim());
            if (countryQuery && countryQuery !== 'all') params.set('country', countryQuery);
            if (levelQuery && levelQuery !== 'all') params.set('level', levelQuery);
            if (controlQuery && controlQuery !== 'all') params.set('control', controlQuery);

            const res = await fetch(`/api/universities/lookup?${params.toString()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setGlobalList(data);
                setGlobalPage(1);
            } else {
                setGlobalList([]);
            }
        } catch {
            setGlobalList([]);
        } finally {
            setLoadingGlobal(false);
        }
    };

    useEffect(() => {
        if (directoryMode === 'global' && globalList.length === 0) {
            fetchGlobalUniversities('University', 'USA', 'all', 'all');
        }
    }, [directoryMode]);

    // Unique countries derived from available universities
    const countries = useMemo(() => {
        const set = new Set<string>();
        universities.forEach((u: any) => {
            if (u.country) set.add(u.country);
        });
        return ['all', ...Array.from(set).sort()];
    }, [universities]);

    // Unique locations / cities
    const locations = useMemo(() => {
        const set = new Set<string>();
        universities.forEach((u: any) => {
            if (u.location) {
                const parts = u.location.split(',');
                const city = parts[0]?.trim();
                if (city) set.add(city);
            }
        });
        return ['all', ...Array.from(set).sort()];
    }, [universities]);

    const levels = ['Bachelor', 'Masters', 'PhD', 'Diploma', 'Certificate'];

    const handleLevelChange = (level: string) => {
        setSelectedLevels((prev) =>
            prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
        );
        setCurrentPage(1);
    };

    const handleOfferTypeChange = (type: string) => {
        setSelectedOfferTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setSelectedLevels([]);
        setSelectedCountry('all');
        setSelectedLocation('all');
        setSelectedOfferTypes([]);
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Filter partner universities strictly returning universities
    const filteredUniversities = useMemo(() => {
        return universities.filter((uni: any) => {
            // Country Filter
            if (selectedCountry !== 'all') {
                const c1 = (uni.country || '').toLowerCase();
                const c2 = selectedCountry.toLowerCase();
                if (c1 !== c2 && !c1.includes(c2) && !c2.includes(c1)) {
                    return false;
                }
            }

            // Location / City Filter
            if (selectedLocation !== 'all') {
                if (!uni.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
                    return false;
                }
            }

            // Level of Interest Filter
            if (selectedLevels.length > 0) {
                const uniLevels = (uni.levels || []).map((l: string) =>
                    l.toLowerCase().trim().replace(/s$/, '')
                );
                const hasMatch = selectedLevels.some((sel) => {
                    const normSel = sel.toLowerCase().trim().replace(/s$/, '');
                    return uniLevels.some((ul: string) => ul.includes(normSel) || normSel.includes(ul));
                });
                if (!hasMatch) return false;
            }

            // Offer Type Filter
            if (selectedOfferTypes.length > 0) {
                const feeStatus = uni.offerLetterFee || 'Paid';
                const wantFree = selectedOfferTypes.includes('Free Offer Letter');
                const wantPaid = selectedOfferTypes.includes('Offer Letter Fees Apply');
                if (wantFree && !wantPaid && feeStatus !== 'Free') return false;
                if (wantPaid && !wantFree && feeStatus === 'Free') return false;
            }

            // Search Query Filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const nameMatch = uni.name?.toLowerCase().includes(q);
                const countryMatch = uni.country?.toLowerCase().includes(q);
                const locMatch = uni.location?.toLowerCase().includes(q);
                const courseMatch = (uni.programs || []).some((p: any) =>
                    p.title?.toLowerCase().includes(q)
                );
                if (!nameMatch && !countryMatch && !locMatch && !courseMatch) {
                    return false;
                }
            }

            return true;
        });
    }, [universities, selectedCountry, selectedLocation, selectedLevels, selectedOfferTypes, searchQuery]);

    // Pagination for Partner Universities
    const totalPages = Math.ceil(filteredUniversities.length / pageSize) || 1;
    const paginatedUniversities = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredUniversities.slice(start, start + pageSize);
    }, [filteredUniversities, currentPage, pageSize]);

    // Pagination for Global Directory
    const globalTotalPages = Math.ceil(globalList.length / globalPageSize) || 1;
    const paginatedGlobal = useMemo(() => {
        const start = (globalPage - 1) * globalPageSize;
        return globalList.slice(start, start + globalPageSize);
    }, [globalList, globalPage, globalPageSize]);

    // 1-Click WhatsApp Copy handler for universities
    const handleCopyUniversity = async (e: React.MouseEvent, uni: any) => {
        e.preventDefault();
        e.stopPropagation();
        const text = generateUniversityShareText(uni);
        const ok = await copyToClipboard(text);
        if (ok) {
            setCopiedUniId(uni._id || uni.id);
            toast.success(`Copied "${uni.name}" details! Ready to paste into WhatsApp.`);
            setTimeout(() => setCopiedUniId(null), 2500);
        } else {
            toast.error('Could not copy university details');
        }
    };

    const hasActiveFilters =
        selectedLevels.length > 0 ||
        selectedCountry !== 'all' ||
        selectedLocation !== 'all' ||
        selectedOfferTypes.length > 0 ||
        searchQuery.trim().length > 0;

    return (
        <div className="container mx-auto px-4 py-12 pt-24 space-y-8">
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Verified Global Education Network & Institutional Directory
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                    Find Your Destination Institution
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                    Click any university card to view its dedicated profile page, degree courses, tuition costing, and counselor admission support.
                </p>

                {/* Directory Mode Switcher Tabs */}
                <div className="flex justify-center pt-2">
                    <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300 shadow-inner gap-1">
                        <button
                            type="button"
                            onClick={() => setDirectoryMode('partners')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                directoryMode === 'partners'
                                    ? 'bg-white text-blue-700 shadow-md shadow-blue-500/10'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <FaBuildingColumns className="h-4 w-4" />
                            Partner Universities ({universities.length} Available)
                        </button>
                        <button
                            type="button"
                            onClick={() => setDirectoryMode('global')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                directoryMode === 'global'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <FaGlobe className="h-4 w-4" />
                            Global Registry (10,000+ Worldwide)
                        </button>
                    </div>
                </div>
            </div>

            {/* PARTNER UNIVERSITIES MODE */}
            {directoryMode === 'partners' && (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-1/4">
                        <div className="sticky top-28 space-y-6">
                            <GlassCard className="p-6 space-y-6 border-white/60 shadow-lg">
                                <div className="flex items-center justify-between pb-4 border-b border-black/5">
                                    <div className="flex items-center space-x-2 text-primary font-bold">
                                        <FaFilter className="h-4 w-4" />
                                        <span>Filter Institutions</span>
                                    </div>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={handleResetFilters}
                                            className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-1 cursor-pointer"
                                        >
                                            <FaRotateLeft className="h-3 w-3" />
                                            Reset All
                                        </button>
                                    )}
                                </div>

                                {/* Search Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80">Search Partner</label>
                                    <div className="relative">
                                        <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="Institution, country, or course..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="pl-9 bg-white/60 border-slate-200 rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Country Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80">Country</label>
                                    <Select
                                        value={selectedCountry}
                                        onValueChange={(val) => {
                                            setSelectedCountry(val);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="bg-white/60 border-slate-200 rounded-xl">
                                            <SelectValue placeholder="All Countries" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c === 'all' ? 'All Countries' : c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* City / Location Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80">City / Region</label>
                                    <Select
                                        value={selectedLocation}
                                        onValueChange={(val) => {
                                            setSelectedLocation(val);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="bg-white/60 border-slate-200 rounded-xl">
                                            <SelectValue placeholder="All Cities" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((loc) => (
                                                <SelectItem key={loc} value={loc}>
                                                    {loc === 'all' ? 'All Cities' : loc}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Level of Interest */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-foreground/80">Level of Interest</label>
                                    <div className="space-y-2">
                                        {levels.map((level) => (
                                            <div key={level} className="flex items-center space-x-3 group cursor-pointer">
                                                <Checkbox
                                                    id={level}
                                                    checked={selectedLevels.includes(level)}
                                                    onCheckedChange={() => handleLevelChange(level)}
                                                    className="border-primary/30 data-[state=checked]:bg-primary"
                                                />
                                                <label
                                                    htmlFor={level}
                                                    className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer"
                                                >
                                                    {level}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Offer Letter Fee */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-foreground/80">Offer Letter</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3 group cursor-pointer">
                                            <Checkbox
                                                id="free-offer"
                                                checked={selectedOfferTypes.includes('Free Offer Letter')}
                                                onCheckedChange={() => handleOfferTypeChange('Free Offer Letter')}
                                                className="border-primary/30"
                                            />
                                            <label
                                                htmlFor="free-offer"
                                                className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer"
                                            >
                                                Free Offer Letter
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-3 group cursor-pointer">
                                            <Checkbox
                                                id="paid-offer"
                                                checked={selectedOfferTypes.includes('Offer Letter Fees Apply')}
                                                onCheckedChange={() => handleOfferTypeChange('Offer Letter Fees Apply')}
                                                className="border-primary/30"
                                            />
                                            <label
                                                htmlFor="paid-offer"
                                                className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer"
                                            >
                                                Offer Letter Fees Apply
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>

                    {/* Main Content: Clickable University Cards */}
                    <div className="w-full lg:w-3/4 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {filteredUniversities.length} {filteredUniversities.length === 1 ? 'University' : 'Universities'} Found
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Click any card to open the university detail page and courses
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-medium">Per Page:</span>
                                <Select
                                    value={String(pageSize)}
                                    onValueChange={(val) => {
                                        setPageSize(Number(val));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-24 h-8 text-xs bg-white border-slate-300 rounded-lg">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6">6</SelectItem>
                                        <SelectItem value="12">12</SelectItem>
                                        <SelectItem value="24">24</SelectItem>
                                        <SelectItem value="50">All 50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loadingPartners ? (
                            <div className="text-center py-20 space-y-3">
                                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-sm font-semibold text-slate-600">Loading partner universities...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {paginatedUniversities.map((university: any) => {
                                    const uniTargetUrl = `/universities/${encodeURIComponent(university._id || university.id)}`;
                                    const shareUrl =
                                        typeof window !== 'undefined'
                                            ? `${window.location.origin}${uniTargetUrl}`
                                            : '';
                                    const shareText = generateUniversityShareText(university, shareUrl);
                                    const waHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                                    const isCopied = copiedUniId === (university._id || university.id);

                                    return (
                                        <Link
                                            key={university._id || university.id}
                                            href={uniTargetUrl}
                                            className="block group"
                                        >
                                            <GlassCard className="p-0 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300 border-white/60 bg-white/70 backdrop-blur-md rounded-3xl cursor-pointer">
                                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">
                                                    {/* Colored Initials Badge */}
                                                    <div className="w-full md:w-auto flex justify-center md:justify-start flex-shrink-0">
                                                        <UniversityInitialsBadge name={university.name} />
                                                    </div>

                                                    {/* University Details */}
                                                    <div className="flex-1 space-y-3 w-full">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                                                                {university.country || 'International'}
                                                            </span>
                                                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                                                <FaCircleCheck className="h-3 w-3 text-emerald-500" />
                                                                Verified Partner
                                                            </span>
                                                            {university.offerLetterFee && (
                                                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                                                    Offer Letter: {university.offerLetterFee}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                                                                <span>{university.name}</span>
                                                                <FaChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                                                            </h3>
                                                            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                                                <FaLocationDot className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                                                                {university.location || university.country}
                                                            </p>
                                                        </div>

                                                        {university.description && (
                                                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                                                {university.description}
                                                            </p>
                                                        )}

                                                        {/* Degree Levels & Programs Counter */}
                                                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/80 text-blue-700 font-bold border border-blue-100">
                                                                <FaGraduationCap className="h-3.5 w-3.5" />
                                                                {university.courseCount || university.programs?.length || 0} Degree Programs
                                                            </span>

                                                            {university.levels && university.levels.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {university.levels.slice(0, 4).map((lvl: string, idx: number) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]"
                                                                        >
                                                                            {lvl}
                                                                        </span>
                                                                    ))}
                                                                    {university.levels.length > 4 && (
                                                                        <span className="text-[11px] text-slate-400 font-medium self-center">
                                                                            +{university.levels.length - 4} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons (with stopPropagation) */}
                                                    <div className="flex flex-col gap-2 w-full md:w-44 flex-shrink-0 pt-2 md:pt-0">
                                                        <Button
                                                            type="button"
                                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                                                        >
                                                            <FaBuildingColumns className="h-3.5 w-3.5" />
                                                            View Details
                                                        </Button>

                                                        {/* 1-Click WhatsApp Copy */}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={(e) => handleCopyUniversity(e, university)}
                                                            className={`w-full text-xs font-bold rounded-xl h-10 flex items-center justify-center gap-1.5 transition-colors ${
                                                                isCopied
                                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold'
                                                                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            {isCopied ? (
                                                                <>
                                                                    <FaCheck className="h-3 w-3 text-emerald-600" />
                                                                    Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaCopy className="h-3 w-3 text-slate-500" />
                                                                    Copy for WhatsApp
                                                                </>
                                                            )}
                                                        </Button>

                                                        {/* WhatsApp direct share */}
                                                        <a
                                                            href={waHref}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full"
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="w-full border-emerald-300 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 h-10"
                                                            >
                                                                <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
                                                                Share on WhatsApp
                                                            </Button>
                                                        </a>

                                                        {/* Direct Apply Link */}
                                                        <Link
                                                            href={`/apply/${encodeURIComponent(university._id || university.id)}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full"
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                className="w-full text-slate-600 hover:text-blue-700 hover:bg-blue-50 text-xs h-9 font-semibold"
                                                            >
                                                                Apply Now →
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </Link>
                                    );
                                })}

                                {filteredUniversities.length === 0 && (
                                    <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
                                        <div className="inline-flex p-5 rounded-full bg-slate-100 text-slate-400">
                                            <FaMagnifyingGlass className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">
                                                No partner universities match your search
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                                                We didn&apos;t find any direct partner matching your query. However, you can search over
                                                10,000+ universities worldwide in our Global Registry!
                                            </p>
                                        </div>
                                        {searchQuery && (
                                            <Button
                                                onClick={() => {
                                                    setGlobalQuery(searchQuery);
                                                    setDirectoryMode('global');
                                                    fetchGlobalUniversities(searchQuery, 'all', 'all', 'all');
                                                }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-5 py-2.5 shadow-md flex items-center gap-2 mx-auto"
                                            >
                                                <FaGlobe className="h-3.5 w-3.5" />
                                                Search Worldwide Registry for &quot;{searchQuery}&quot;
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {filteredUniversities.length > 0 && (
                                    <div className="pt-4">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            totalItems={filteredUniversities.length}
                                            pageSize={pageSize}
                                            pageSizeOptions={[6, 12, 24, 50]}
                                            onPageChange={(page) => {
                                                setCurrentPage(page);
                                                window.scrollTo({ top: 120, behavior: 'smooth' });
                                            }}
                                            onPageSizeChange={(newSize) => {
                                                setPageSize(newSize);
                                                setCurrentPage(1);
                                            }}
                                            className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-4 shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* GLOBAL REGISTRY EXPLORER MODE */}
            {directoryMode === 'global' && (
                <div className="space-y-6">
                    {/* Live Search Ribbon */}
                    <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/90 shadow-lg space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                    <FaGlobe className="h-5 w-5 text-blue-600" />
                                    Search Worldwide University Registry
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Search 10,000+ accredited institutions worldwide. Click any card to open its dedicated page.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                fetchGlobalUniversities();
                            }}
                            className="space-y-3"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                <div className="sm:col-span-5 relative">
                                    <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                    <Input
                                        value={globalQuery}
                                        onChange={(e) => setGlobalQuery(e.target.value)}
                                        placeholder="Institution name (e.g. Oxford, Harvard, Sydney, Toronto)..."
                                        className="pl-10 bg-white border-slate-300 rounded-xl text-sm"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <Select value={globalCountry} onValueChange={(val) => setGlobalCountry(val)}>
                                        <SelectTrigger className="bg-white border-slate-300 rounded-xl text-sm">
                                            <SelectValue placeholder="Country Filter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Countries</SelectItem>
                                            <SelectItem value="USA">United States (USA)</SelectItem>
                                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                            <SelectItem value="Canada">Canada</SelectItem>
                                            <SelectItem value="Australia">Australia</SelectItem>
                                            <SelectItem value="Germany">Germany</SelectItem>
                                            <SelectItem value="Malaysia">Malaysia</SelectItem>
                                            <SelectItem value="Singapore">Singapore</SelectItem>
                                            <SelectItem value="India">India</SelectItem>
                                            <SelectItem value="Japan">Japan</SelectItem>
                                            <SelectItem value="France">France</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="sm:col-span-2">
                                    <Select value={globalLevel} onValueChange={(val) => setGlobalLevel(val)}>
                                        <SelectTrigger className="bg-white border-slate-300 rounded-xl text-sm capitalize">
                                            <SelectValue placeholder="Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Levels</SelectItem>
                                            <SelectItem value="university">University</SelectItem>
                                            <SelectItem value="college">College</SelectItem>
                                            <SelectItem value="polytechnic">Polytechnic</SelectItem>
                                            <SelectItem value="community_college">Community College</SelectItem>
                                            <SelectItem value="vocational">Vocational</SelectItem>
                                            <SelectItem value="specialized">Specialized</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="sm:col-span-2">
                                    <Button
                                        type="submit"
                                        disabled={loadingGlobal}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10 text-sm shadow-md"
                                    >
                                        {loadingGlobal ? 'Searching...' : 'Search'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Results Grid */}
                    {loadingGlobal ? (
                        <div className="text-center py-20 space-y-3">
                            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-sm font-semibold text-slate-600">
                                Querying Global University Registry...
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 gap-2">
                                <span className="text-sm font-bold text-slate-800">
                                    Found {globalList.length} Worldwide Higher Education Institutions
                                </span>
                                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                    Click any university to view full institutional profile &amp; courses
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {paginatedGlobal.map((uni: any, idx: number) => {
                                    const tuitionVal = uni.tuition || uni.tuition_out_of_state;
                                    const shareText = generateUniversityShareText(uni);
                                    const waHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                                    const targetUniUrl = `/universities/${encodeURIComponent(uni.name)}`;

                                    return (
                                        <Link
                                            key={idx}
                                            href={targetUniUrl}
                                            className="block group"
                                        >
                                            <GlassCard className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 cursor-pointer h-full">
                                                <div className="space-y-3">
                                                    {/* Header Badges */}
                                                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                                                                {uni.country || 'Global'} {uni.country_code ? `(${uni.country_code})` : ''}
                                                            </span>

                                                            {uni.level && (
                                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
                                                                    {uni.level.replace(/_/g, ' ')}
                                                                </span>
                                                            )}

                                                            {uni.recognition && (
                                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                                                                    Nationally {uni.recognition}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {uni.status && (
                                                            <span
                                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                                                    uni.status === 'active'
                                                                        ? 'bg-emerald-100 text-emerald-800'
                                                                        : 'bg-rose-100 text-rose-800'
                                                                }`}
                                                            >
                                                                ● {uni.status}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* University Title & Location */}
                                                    <div>
                                                        <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                                                            <span>{uni.name}</span>
                                                            <FaChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                                                        </h3>
                                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                                            <FaLocationDot className="h-3 w-3 text-red-500 flex-shrink-0" />
                                                            {[uni.address, uni.city, uni.state, uni.region_code, uni.country].filter(Boolean).join(', ')}
                                                        </p>
                                                    </div>

                                                    {/* Key Metrics Quick Ribbon */}
                                                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                                                        <div className="p-2 rounded-xl bg-slate-50">
                                                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                                                Tuition
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {tuitionVal
                                                                    ? `$${Number(tuitionVal).toLocaleString()}`
                                                                    : 'N/A'}
                                                            </span>
                                                            {uni.tuition_out_of_state && (
                                                                <span className="text-[9px] text-blue-600 block">Out-of-state</span>
                                                            )}
                                                        </div>

                                                        <div className="p-2 rounded-xl bg-slate-50">
                                                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                                                Enrollment
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {uni.enrollment
                                                                    ? Number(uni.enrollment).toLocaleString()
                                                                    : 'Active'}
                                                            </span>
                                                            {uni.enrollment_year && (
                                                                <span className="text-[9px] text-slate-400 block">Yr {uni.enrollment_year}</span>
                                                            )}
                                                        </div>

                                                        <div className="p-2 rounded-xl bg-slate-50">
                                                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                                                Faculty Ratio
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {uni.student_faculty_ratio || 'Standard'}
                                                            </span>
                                                            {uni.research_output && (
                                                                <span className="text-[9px] text-purple-600 block">
                                                                    {Number(uni.research_output) > 1000000 ? `${(Number(uni.research_output)/1000000).toFixed(1)}M papers` : `${uni.research_output} papers`}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Degree levels list */}
                                                    {uni.degree_types && uni.degree_types.length > 0 && (
                                                        <div className="space-y-1">
                                                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                                                                Degrees Offered ({uni.degree_types.length}):
                                                            </span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {uni.degree_types.slice(0, 4).map((deg: string, dIdx: number) => (
                                                                    <span
                                                                        key={dIdx}
                                                                        className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-700"
                                                                    >
                                                                        {deg}
                                                                    </span>
                                                                ))}
                                                                {uni.degree_types.length > 4 && (
                                                                    <span className="text-[10px] text-blue-600 font-semibold self-center">
                                                                        +{uni.degree_types.length - 4} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons (with stopPropagation) */}
                                                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 border-t border-slate-100">
                                                    <Button
                                                        type="button"
                                                        className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-10 shadow-sm flex items-center justify-center gap-1.5"
                                                    >
                                                        <FaBuildingColumns className="h-3 w-3" />
                                                        View Profile
                                                    </Button>

                                                    <a
                                                        href={waHref}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-full sm:flex-1"
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-full border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold rounded-xl h-10 flex items-center justify-center gap-1.5"
                                                        >
                                                            <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
                                                            Share WhatsApp
                                                        </Button>
                                                    </a>

                                                    <Link
                                                        href={`/apply/${encodeURIComponent(uni.name)}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-full sm:flex-1"
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl h-10"
                                                        >
                                                            Apply
                                                        </Button>
                                                    </Link>

                                                    {uni.website && (
                                                        <a
                                                            href={uni.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                                                            title="Visit Official Website"
                                                        >
                                                            <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </GlassCard>
                                        </Link>
                                    );
                                })}
                            </div>

                            {globalList.length === 0 && !loadingGlobal && (
                                <div className="text-center py-16 bg-white/60 rounded-3xl border border-slate-200 p-8">
                                    <FaBuildingColumns className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                    <h4 className="text-base font-bold text-slate-800">
                                        No universities found matching your search
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Try searching with a broader name (e.g. &quot;College&quot;, &quot;Institute&quot;, or a city/country).
                                    </p>
                                </div>
                            )}

                            {globalList.length > 0 && (
                                <Pagination
                                    currentPage={globalPage}
                                    totalPages={globalTotalPages}
                                    totalItems={globalList.length}
                                    pageSize={globalPageSize}
                                    pageSizeOptions={[6, 12, 24, 48]}
                                    onPageChange={(page) => {
                                        setGlobalPage(page);
                                        window.scrollTo({ top: 120, behavior: 'smooth' });
                                    }}
                                    onPageSizeChange={(newSize) => {
                                        setGlobalPageSize(newSize);
                                        setGlobalPage(1);
                                    }}
                                    className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-sm"
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function UniversitiesPage() {
    return (
        <Suspense
            fallback={
                <div className="container mx-auto px-4 py-32 text-center">
                    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-slate-600 mt-3">Loading Universities Directory...</p>
                </div>
            }
        >
            <UniversitiesContent />
        </Suspense>
    );
}
