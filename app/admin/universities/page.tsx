'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import toast from 'react-hot-toast';
import {
    Building2,
    BookOpen,
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    MapPin,
    GraduationCap,
    Sparkles,
    Search,
    Loader2,
    Globe,
    CheckCircle,
    X,
    CheckSquare,
    Square,
    Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UniversityDossierModal from '@/components/UniversityDossierModal';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

/** Colored initials badge — no logo image dependency */
function InitialsBadge({ name, size = 10 }: { name: string; size?: number }) {
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
    const colorIdx = name.charCodeAt(0) % colors.length;
    return (
        <div
            className={`w-${size} h-${size} rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${colors[colorIdx]}`}
        >
            {initials}
        </div>
    );
}

export default function AdminUniversitiesPage() {
    const [universities, setUniversities] = useState<any[]>([]);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [uniForm, setUniForm] = useState<any>({
        name: '', country: '', location: '', website: '', details: null,
    });
    const [courseForm, setCourseForm] = useState({
        name: '', universityId: '', level: 'Bachelor',
        duration: '3 years', tuitionFee: '', description: '',
    });
    const [editingUni, setEditingUni] = useState<any>(null);
    const [editingCourse, setEditingCourse] = useState<any>(null);

    // ── Bulk Selection States ──────────────────────────────────────────────────
    const [selectedUniIds, setSelectedUniIds] = useState<string[]>([]);
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // ── Pagination & Filter States: Universities ──────────────────────────────
    const [uniSearch, setUniSearch] = useState('');
    const [uniCountryFilter, setUniCountryFilter] = useState('all');
    const [uniPage, setUniPage] = useState(1);
    const [uniPageSize, setUniPageSize] = useState(8);

    // ── Pagination & Filter States: Courses ───────────────────────────────────
    const [courseSearch, setCourseSearch] = useState('');
    const [courseLevelFilter, setCourseLevelFilter] = useState('all');
    const [courseUniFilter, setCourseUniFilter] = useState('all');
    const [coursePage, setCoursePage] = useState(1);
    const [coursePageSize, setCoursePageSize] = useState(10);

    // ── API-Ninjas Global Registry Lookup ─────────────────────────────────────
    const [globalQuery, setGlobalQuery] = useState('');
    const [globalResults, setGlobalResults] = useState<any[]>([]);
    const [searchingGlobal, setSearchingGlobal] = useState(false);
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [addingPartner, setAddingPartner] = useState<string | null>(null);

    const [selectedDossierUni, setSelectedDossierUni] = useState<any | null>(null);

    const refreshData = async () => {
        try {
            setLoading(true);
            const [unisRes, coursesRes] = await Promise.all([
                fetch('/api/universities').then((r) => r.json()),
                fetch('/api/courses').then((r) => r.json()),
            ]);
            setUniversities(Array.isArray(unisRes) ? unisRes : []);
            setAllCourses(Array.isArray(coursesRes) ? coursesRes : []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    // ── Filtered & Paginated Universities ─────────────────────────────────────
    const filteredUniversities = useMemo(() => {
        let list = universities;
        if (uniSearch.trim()) {
            const q = uniSearch.toLowerCase();
            list = list.filter(
                (u) =>
                    u.name?.toLowerCase().includes(q) ||
                    u.country?.toLowerCase().includes(q) ||
                    u.location?.toLowerCase().includes(q)
            );
        }
        if (uniCountryFilter !== 'all') {
            list = list.filter((u) => u.country === uniCountryFilter);
        }
        return list;
    }, [universities, uniSearch, uniCountryFilter]);

    const paginatedUniversities = useMemo(() => {
        const start = (uniPage - 1) * uniPageSize;
        return filteredUniversities.slice(start, start + uniPageSize);
    }, [filteredUniversities, uniPage, uniPageSize]);

    const uniTotalPages = Math.ceil(filteredUniversities.length / uniPageSize) || 1;

    // Derived countries for university filter
    const uniCountries = useMemo(() => {
        const set = new Set<string>();
        universities.forEach((u) => { if (u.country) set.add(u.country); });
        return Array.from(set).sort();
    }, [universities]);

    // ── Filtered & Paginated Courses ──────────────────────────────────────────
    const filteredCourses = useMemo(() => {
        let list = allCourses;
        if (courseSearch.trim()) {
            const q = courseSearch.toLowerCase();
            list = list.filter(
                (c) =>
                    c.name?.toLowerCase().includes(q) ||
                    c.description?.toLowerCase().includes(q) ||
                    c.university?.name?.toLowerCase().includes(q)
            );
        }
        if (courseLevelFilter !== 'all') {
            list = list.filter((c) =>
                c.level?.toLowerCase().includes(courseLevelFilter.toLowerCase())
            );
        }
        if (courseUniFilter !== 'all') {
            list = list.filter(
                (c) =>
                    c.universityId === courseUniFilter ||
                    c.university?._id === courseUniFilter ||
                    c.university?.name === courseUniFilter
            );
        }
        return list;
    }, [allCourses, courseSearch, courseLevelFilter, courseUniFilter]);

    const paginatedCourses = useMemo(() => {
        const start = (coursePage - 1) * coursePageSize;
        return filteredCourses.slice(start, start + coursePageSize);
    }, [filteredCourses, coursePage, coursePageSize]);

    const courseTotalPages = Math.ceil(filteredCourses.length / coursePageSize) || 1;

    // ── Bulk Selection Handlers: Universities ──────────────────────────────────
    const allCurrentPageUnisSelected = useMemo(() => {
        return (
            paginatedUniversities.length > 0 &&
            paginatedUniversities.every((u) => selectedUniIds.includes(u._id))
        );
    }, [paginatedUniversities, selectedUniIds]);

    const handleToggleSelectAllUnis = () => {
        if (allCurrentPageUnisSelected) {
            const pageIds = new Set(paginatedUniversities.map((u) => u._id));
            setSelectedUniIds(selectedUniIds.filter((id) => !pageIds.has(id)));
        } else {
            const newSet = new Set([...selectedUniIds, ...paginatedUniversities.map((u) => u._id)]);
            setSelectedUniIds(Array.from(newSet));
        }
    };

    const handleToggleSelectUni = (id: string) => {
        if (selectedUniIds.includes(id)) {
            setSelectedUniIds(selectedUniIds.filter((item) => item !== id));
        } else {
            setSelectedUniIds([...selectedUniIds, id]);
        }
    };

    const handleBulkDeleteUnis = async () => {
        if (selectedUniIds.length === 0) return;
        if (
            !window.confirm(
                `Permanently delete ${selectedUniIds.length} partner universities and all their courses?`
            )
        )
            return;

        setBulkDeleting(true);
        const toastId = toast.loading(`Deleting ${selectedUniIds.length} universities...`);
        try {
            const res = await fetch('/api/universities/bulk', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer siam-secret-token',
                },
                body: JSON.stringify({ ids: selectedUniIds }),
            }).then((r) => r.json());

            if (res.success) {
                toast.success(`Deleted ${res.deletedCount || selectedUniIds.length} universities!`, {
                    id: toastId,
                });
                setSelectedUniIds([]);
                await refreshData();
            } else {
                toast.error(res.message || 'Bulk delete failed', { id: toastId });
            }
        } catch {
            toast.error('Network error during bulk delete', { id: toastId });
        } finally {
            setBulkDeleting(false);
        }
    };

    // ── Bulk Selection Handlers: Courses ───────────────────────────────────────
    const allCurrentPageCoursesSelected = useMemo(() => {
        return (
            paginatedCourses.length > 0 &&
            paginatedCourses.every((c) => selectedCourseIds.includes(c._id))
        );
    }, [paginatedCourses, selectedCourseIds]);

    const handleToggleSelectAllCourses = () => {
        if (allCurrentPageCoursesSelected) {
            const pageIds = new Set(paginatedCourses.map((c) => c._id));
            setSelectedCourseIds(selectedCourseIds.filter((id) => !pageIds.has(id)));
        } else {
            const newSet = new Set([...selectedCourseIds, ...paginatedCourses.map((c) => c._id)]);
            setSelectedCourseIds(Array.from(newSet));
        }
    };

    const handleToggleSelectCourse = (id: string) => {
        if (selectedCourseIds.includes(id)) {
            setSelectedCourseIds(selectedCourseIds.filter((item) => item !== id));
        } else {
            setSelectedCourseIds([...selectedCourseIds, id]);
        }
    };

    const handleBulkDeleteCourses = async () => {
        if (selectedCourseIds.length === 0) return;
        if (!window.confirm(`Permanently delete ${selectedCourseIds.length} degree programs?`))
            return;

        setBulkDeleting(true);
        const toastId = toast.loading(`Deleting ${selectedCourseIds.length} courses...`);
        try {
            const res = await fetch('/api/courses/bulk', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer siam-secret-token',
                },
                body: JSON.stringify({ ids: selectedCourseIds }),
            }).then((r) => r.json());

            if (res.success) {
                toast.success(`Deleted ${res.deletedCount || selectedCourseIds.length} courses!`, {
                    id: toastId,
                });
                setSelectedCourseIds([]);
                await refreshData();
            } else {
                toast.error(res.message || 'Bulk delete failed', { id: toastId });
            }
        } catch {
            toast.error('Network error during bulk delete', { id: toastId });
        } finally {
            setBulkDeleting(false);
        }
    };

    // ── Global Registry Search ─────────────────────────────────────────────────
    const handleGlobalLookup = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!globalQuery.trim()) {
            toast.error('Please enter a university name to search');
            return;
        }
        setSearchingGlobal(true);
        setGlobalResults([]);
        try {
            const res = await fetch(
                `/api/universities/lookup?name=${encodeURIComponent(globalQuery.trim())}`
            );
            const data = await res.json();
            if (Array.isArray(data)) {
                setGlobalResults(data);
                if (data.length === 0) toast('No universities found matching that name');
            } else {
                toast.error(data.error || 'Failed to search university registry');
            }
        } catch {
            toast.error('Network error while searching registry');
        } finally {
            setSearchingGlobal(false);
        }
    };

    const handleSelectGlobalUni = (uni: any) => {
        let country = uni.country || '';
        if (country === 'USA') country = 'United States';
        else if (country === 'UK') country = 'United Kingdom';

        const location =
            [uni.city, uni.state, uni.country].filter(Boolean).join(', ') || uni.country || '';
        const website =
            uni.website || (uni.domains?.[0] ? `https://${uni.domains[0]}` : '');

        setUniForm({
            name: uni.name || '',
            country: country,
            location: location,
            website: website,
            details: uni,
        });
        setEditingUni(null);
        toast.success(`Auto-filled form for ${uni.name}! Save to add as partner.`);
        setShowGlobalSearch(false);
    };

    const handleAddAsPartner = async (uni: any) => {
        const uniKey = uni.name;
        setAddingPartner(uniKey);
        const toastId = toast.loading(`Adding ${uni.name} as partner...`);

        let country = uni.country || '';
        if (country === 'USA') country = 'United States';
        else if (country === 'UK') country = 'United Kingdom';

        const location =
            [uni.city, uni.state, uni.country].filter(Boolean).join(', ') || uni.country || '';
        const website =
            uni.website || (uni.domains?.[0] ? `https://${uni.domains[0]}` : '');

        try {
            const res = await fetch('/api/universities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer siam-secret-token',
                },
                body: JSON.stringify({
                    name: uni.name,
                    country,
                    location,
                    website,
                    logo: null,
                    details: uni,
                }),
            }).then((r) => r.json());

            if (res._id || res.id || res.name) {
                toast.success(`${uni.name} added as partner university!`, { id: toastId });
                await refreshData();
                setShowGlobalSearch(false);
                setGlobalResults([]);
                setGlobalQuery('');
            } else {
                toast.error(res.message || 'Failed to add university', { id: toastId });
            }
        } catch {
            toast.error('Network error', { id: toastId });
        } finally {
            setAddingPartner(null);
        }
    };

    // ── Form Submits ───────────────────────────────────────────────────────────
    const handleAddUni = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(
            editingUni ? 'Updating university record...' : 'Saving partner university...'
        );

        const url = editingUni ? `/api/universities/${editingUni._id}` : '/api/universities';
        const method = editingUni ? 'PUT' : 'POST';

        try {
            const payload: any = {
                name: uniForm.name,
                country: uniForm.country,
                location: uniForm.location,
                website: uniForm.website,
                logo: null,
            };
            if (uniForm.details) payload.details = uniForm.details;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer siam-secret-token',
                },
                body: JSON.stringify(payload),
            }).then((r) => r.json());

            if (res._id || res.id || res.name) {
                toast.success(
                    editingUni ? 'University updated!' : 'University added successfully!',
                    { id: toastId }
                );
                setUniForm({ name: '', country: '', location: '', website: '', details: null });
                setEditingUni(null);
                refreshData();
            } else {
                toast.error('Error: ' + (res.message || 'Unknown error'), { id: toastId });
            }
        } catch {
            toast.error('Network error', { id: toastId });
        }
    };

    const handleEditUni = (uni: any) => {
        setEditingUni(uni);
        setUniForm({
            name: uni.name,
            country: uni.country,
            location: uni.location,
            website: uni.website || '',
            details: uni.details || null,
        });
        setTimeout(
            () => document.getElementById('uni-form')?.scrollIntoView({ behavior: 'smooth' }),
            100
        );
    };

    const handleDeleteUni = async (id: string) => {
        if (!window.confirm('Delete this university and its associated programs?')) return;
        const toastId = toast.loading('Deleting university...');
        try {
            const res = await fetch(`/api/universities/${id}`, {
                method: 'DELETE',
                headers: { Authorization: 'Bearer siam-secret-token' },
            }).then((r) => r.json());
            if (res.message && !res.error) {
                toast.success('University deleted', { id: toastId });
                setSelectedUniIds((prev) => prev.filter((item) => item !== id));
                refreshData();
            } else {
                toast.error(res.message || 'Delete failed', { id: toastId });
            }
        } catch {
            toast.error('Network error', { id: toastId });
        }
    };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(
            editingCourse ? 'Updating program...' : 'Saving degree program...'
        );
        const url = editingCourse ? `/api/courses/${editingCourse._id}` : '/api/courses';
        const method = editingCourse ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer siam-secret-token',
                },
                body: JSON.stringify(courseForm),
            }).then((r) => r.json());

            if (res._id || res.id || res.name) {
                toast.success(editingCourse ? 'Program updated!' : 'Program added!', {
                    id: toastId,
                });
                setCourseForm({
                    name: '', universityId: '', level: 'Bachelor',
                    duration: '3 years', tuitionFee: '', description: '',
                });
                setEditingCourse(null);
                refreshData();
            } else {
                toast.error('Error: ' + (res.message || 'Unknown error'), { id: toastId });
            }
        } catch {
            toast.error('Network error', { id: toastId });
        }
    };

    const handleEditCourse = (course: any) => {
        setEditingCourse(course);
        setCourseForm({
            name: course.name,
            universityId: course.universityId || course.university?._id || course.university,
            level: course.level,
            duration: course.duration,
            tuitionFee: course.tuitionFee || '',
            description: course.description || '',
        });
    };

    const handleDeleteCourse = async (id: string) => {
        if (!window.confirm('Delete this course program?')) return;
        const toastId = toast.loading('Deleting course program...');
        try {
            const res = await fetch(`/api/courses/${id}`, {
                method: 'DELETE',
                headers: { Authorization: 'Bearer siam-secret-token' },
            }).then((r) => r.json());
            if (res.message && !res.error) {
                toast.success('Course deleted', { id: toastId });
                setSelectedCourseIds((prev) => prev.filter((item) => item !== id));
                refreshData();
            } else {
                toast.error(res.message || 'Delete failed', { id: toastId });
            }
        } catch {
            toast.error('Network error', { id: toastId });
        }
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <Building2 className="w-7 h-7 text-primary" />
                        Partner Universities &amp; Course Catalog
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Add partner institutions from the worldwide API registry · manage degree
                        programs · bulk select &amp; pagination.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
                        {universities.length} Institutions
                    </span>
                    <span className="px-3.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                        {allCourses.length} Degree Programs
                    </span>
                </div>
            </div>

            <Tabs defaultValue="university" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 border border-slate-200 p-1 rounded-xl mb-6 shadow-sm">
                    <TabsTrigger
                        value="university"
                        className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-semibold"
                    >
                        Universities ({universities.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="course"
                        className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-semibold"
                    >
                        Courses &amp; Programs ({allCourses.length})
                    </TabsTrigger>
                </TabsList>

                {/* ════════════════════ UNIVERSITIES TAB ════════════════════ */}
                <TabsContent value="university" className="space-y-6">

                    {/* Global Registry Search Panel */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-600" />
                                    Global Registry Lookup
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Search 10,000+ worldwide institutions and add directly as partner universities.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowGlobalSearch(!showGlobalSearch)}
                                className="border-blue-200 text-blue-700 hover:bg-blue-100 text-xs flex items-center gap-1.5"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                {showGlobalSearch ? 'Hide Search' : 'Search & Import University'}
                            </Button>
                        </div>

                        {showGlobalSearch && (
                            <div className="space-y-3">
                                <form
                                    onSubmit={handleGlobalLookup}
                                    className="flex flex-col sm:flex-row gap-2"
                                >
                                    <div className="relative flex-1">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            value={globalQuery}
                                            onChange={(e) => setGlobalQuery(e.target.value)}
                                            placeholder="Search institution name (e.g. Harvard, Oxford, Monash)..."
                                            className="pl-9 bg-white border-blue-200 text-xs"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={searchingGlobal}
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        {searchingGlobal ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-3.5 h-3.5" />
                                                Search
                                            </>
                                        )}
                                    </Button>
                                </form>

                                {globalResults.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-slate-700">
                                                Found {globalResults.length} institutions:
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setGlobalResults([])}
                                                className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
                                            >
                                                <X className="w-3 h-3" /> Clear
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                                            {globalResults.map((uni: any, idx: number) => {
                                                const isAlreadyPartner = universities.some(
                                                    (u: any) =>
                                                        u.name?.toLowerCase() ===
                                                        uni.name?.toLowerCase()
                                                );
                                                const isAdding = addingPartner === uni.name;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="p-3 bg-white border border-blue-100 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all flex flex-col gap-2"
                                                    >
                                                        <div>
                                                            <div className="flex items-start justify-between gap-2">
                                                                <span className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                                                                    {uni.name}
                                                                </span>
                                                                <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded whitespace-nowrap">
                                                                    {uni.country}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                                📍{' '}
                                                                {[uni.city, uni.state]
                                                                    .filter(Boolean)
                                                                    .join(', ') || uni.country}
                                                            </p>
                                                            {uni.tuition && (
                                                                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                                                    💰 ${Number(uni.tuition).toLocaleString()} / yr
                                                                </p>
                                                            )}
                                                            {uni.level && (
                                                                <p className="text-[10px] text-indigo-600 capitalize mt-0.5">
                                                                    🎓 {uni.level.replace(/_/g, ' ')}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedDossierUni(uni)}
                                                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                All Data ↗
                                                            </button>
                                                            <span className="text-slate-200">|</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSelectGlobalUni(uni)}
                                                                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                                                            >
                                                                Fill Form
                                                            </button>
                                                            <div className="ml-auto">
                                                                {isAlreadyPartner ? (
                                                                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                                                        <CheckCircle className="w-3 h-3" />
                                                                        Partner
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        disabled={isAdding}
                                                                        onClick={() => handleAddAsPartner(uni)}
                                                                        className="text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                                                                    >
                                                                        {isAdding ? (
                                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                                        ) : (
                                                                            <Plus className="w-3 h-3" />
                                                                        )}
                                                                        Add Partner
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Manual Add / Edit Form */}
                    <div
                        id="uni-form"
                        className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm space-y-4"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    {editingUni ? '✏️ Edit University' : '＋ Manually Add University'}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Use the Global Registry Lookup above to auto-fill, or type manually below.
                                </p>
                            </div>
                            {editingUni && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setEditingUni(null);
                                        setUniForm({
                                            name: '', country: '', location: '', website: '', details: null,
                                        });
                                    }}
                                    className="text-xs text-slate-500"
                                >
                                    <X className="w-3.5 h-3.5 mr-1" /> Cancel Edit
                                </Button>
                            )}
                        </div>

                        {uniForm.details && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>
                                    <strong>API data loaded</strong> for{' '}
                                    <strong>{uniForm.details.name}</strong> —{' '}
                                    {Object.keys(uniForm.details).length} registry fields will be saved.
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setUniForm((p: any) => ({ ...p, details: null }))}
                                    className="ml-auto text-emerald-500 hover:text-emerald-700"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleAddUni} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">University Name *</Label>
                                    <Input
                                        value={uniForm.name}
                                        onChange={(e) => setUniForm({ ...uniForm, name: e.target.value })}
                                        required
                                        placeholder="e.g. University of Oxford"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Campus City / Location *</Label>
                                    <Input
                                        value={uniForm.location}
                                        onChange={(e) => setUniForm({ ...uniForm, location: e.target.value })}
                                        required
                                        placeholder="e.g. Oxford, England"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Country *</Label>
                                    <Input
                                        value={uniForm.country}
                                        onChange={(e) => setUniForm({ ...uniForm, country: e.target.value })}
                                        required
                                        placeholder="e.g. United Kingdom"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Official Website</Label>
                                    <Input
                                        value={uniForm.website}
                                        onChange={(e) => setUniForm({ ...uniForm, website: e.target.value })}
                                        placeholder="https://..."
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-400 italic">
                                Note: No logo upload required — university cards display colored initials badges.
                            </p>
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold"
                            >
                                {editingUni ? 'Update University Record' : 'Save Partner University'}
                            </Button>
                        </form>
                    </div>

                    {/* Filter and Selection Toolbar */}
                    <div className="p-4 rounded-xl bg-white/80 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex flex-wrap items-center gap-2 flex-1 w-full sm:w-auto">
                            {/* Search */}
                            <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={uniSearch}
                                    onChange={(e) => { setUniSearch(e.target.value); setUniPage(1); }}
                                    placeholder="Filter universities..."
                                    className="pl-8 bg-white border-slate-200 text-xs h-9 rounded-lg"
                                />
                            </div>

                            {/* Country filter */}
                            <Select
                                value={uniCountryFilter}
                                onValueChange={(val) => { setUniCountryFilter(val); setUniPage(1); }}
                            >
                                <SelectTrigger className="w-40 h-9 bg-white border-slate-200 text-xs rounded-lg">
                                    <SelectValue placeholder="All Countries" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-800">
                                    <SelectItem value="all">All Countries</SelectItem>
                                    {uniCountries.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {(uniSearch || uniCountryFilter !== 'all') && (
                                <button
                                    onClick={() => { setUniSearch(''); setUniCountryFilter('all'); setUniPage(1); }}
                                    className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
                                >
                                    <X className="w-3 h-3" /> Clear
                                </button>
                            )}
                        </div>

                        {/* Select All Checkbox on Current Page */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleToggleSelectAllUnis}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                            >
                                {allCurrentPageUnisSelected ? (
                                    <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                    <Square className="w-4 h-4 text-slate-400" />
                                )}
                                <span>Select All on Page</span>
                                {selectedUniIds.length > 0 && (
                                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                                        {selectedUniIds.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Universities Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : filteredUniversities.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 bg-white/60 rounded-2xl border border-slate-200">
                            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">No partner universities found.</p>
                            <p className="text-xs mt-1">Try adjusting your filter or import using Global Registry Lookup.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {paginatedUniversities.map((uni: any) => {
                                    const isSelected = selectedUniIds.includes(uni._id);
                                    return (
                                        <div
                                            key={uni._id}
                                            onClick={() => handleToggleSelectUni(uni._id)}
                                            className={`p-4 rounded-xl bg-white/90 backdrop-blur-xl border transition-all shadow-sm flex items-center justify-between cursor-pointer ${
                                                isSelected
                                                    ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                                                    : 'border-slate-200/90 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                {/* Row Checkbox */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleSelectUni(uni._id);
                                                    }}
                                                    className="flex-shrink-0 text-slate-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <Square className="w-5 h-5 text-slate-300" />
                                                    )}
                                                </button>

                                                {/* Initials badge */}
                                                <InitialsBadge name={uni.name} size={10} />

                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-bold text-sm text-slate-900 truncate">
                                                        {uni.name}
                                                    </h4>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                                        <span className="truncate">
                                                            {uni.location || uni.country}
                                                            {uni.country && uni.location ? `, ${uni.country}` : ''}
                                                        </span>
                                                    </div>
                                                    {uni.details && (
                                                        <span className="text-[10px] text-blue-600 font-semibold">
                                                            API data: {Object.keys(uni.details).length} fields
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className="flex items-center gap-1.5 flex-shrink-0 ml-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/70 rounded-lg"
                                                    onClick={() => setSelectedDossierUni(uni)}
                                                >
                                                    Inspect
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-lg"
                                                    onClick={() => handleEditUni(uni)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                                                    onClick={() => handleDeleteUni(uni._id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                                {uni.website && (
                                                    <a
                                                        href={uni.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Universities Pagination */}
                            <Pagination
                                currentPage={uniPage}
                                totalPages={uniTotalPages}
                                totalItems={filteredUniversities.length}
                                pageSize={uniPageSize}
                                pageSizeOptions={[4, 8, 16, 32]}
                                onPageChange={(p) => setUniPage(p)}
                                onPageSizeChange={(s) => { setUniPageSize(s); setUniPage(1); }}
                                className="bg-white/80 rounded-xl border border-slate-200 shadow-xs px-3"
                            />
                        </div>
                    )}
                </TabsContent>

                {/* ════════════════════ COURSES TAB ════════════════════ */}
                <TabsContent value="course" className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                            <h2 className="text-base font-bold text-slate-900">
                                {editingCourse ? '✏️ Edit Degree Program' : '＋ Add New Degree Program'}
                            </h2>
                            {editingCourse && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditingCourse(null);
                                        setCourseForm({
                                            name: '', universityId: '', level: 'Bachelor',
                                            duration: '3 years', tuitionFee: '', description: '',
                                        });
                                    }}
                                    className="text-xs"
                                >
                                    <X className="w-3.5 h-3.5 mr-1" /> Cancel Edit
                                </Button>
                            )}
                        </div>

                        <form onSubmit={handleAddCourse} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Program / Course Name *</Label>
                                    <Input
                                        value={courseForm.name}
                                        onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                                        required
                                        placeholder="e.g. M.Sc Artificial Intelligence"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Associated University *</Label>
                                    <Select
                                        value={courseForm.universityId}
                                        onValueChange={(val) =>
                                            setCourseForm({ ...courseForm, universityId: val })
                                        }
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                            <SelectValue placeholder="Select University" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                                            {universities.map((u: any) => (
                                                <SelectItem key={u._id} value={u._id}>
                                                    {u.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Degree Level</Label>
                                    <Select
                                        value={courseForm.level}
                                        onValueChange={(val) =>
                                            setCourseForm({ ...courseForm, level: val })
                                        }
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                                            <SelectItem value="Certificate">Certificate</SelectItem>
                                            <SelectItem value="Diploma">Diploma</SelectItem>
                                            <SelectItem value="Advance Diploma">Advance Diploma</SelectItem>
                                            <SelectItem value="Foundation">Foundation / Pathway</SelectItem>
                                            <SelectItem value="Bachelor">Bachelors</SelectItem>
                                            <SelectItem value="Masters">Masters / Postgraduate</SelectItem>
                                            <SelectItem value="PhD">Doctorate / PhD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Duration</Label>
                                    <Input
                                        value={courseForm.duration}
                                        onChange={(e) =>
                                            setCourseForm({ ...courseForm, duration: e.target.value })
                                        }
                                        placeholder="e.g. 1 year / 3 years"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <Label className="text-xs text-slate-700">
                                        Estimated Tuition Fee
                                    </Label>
                                    <Input
                                        value={courseForm.tuitionFee}
                                        onChange={(e) =>
                                            setCourseForm({ ...courseForm, tuitionFee: e.target.value })
                                        }
                                        placeholder="e.g. £18,500/year or RM 45,000/year"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <Label className="text-xs text-slate-700">Description (optional)</Label>
                                    <Input
                                        value={courseForm.description}
                                        onChange={(e) =>
                                            setCourseForm({ ...courseForm, description: e.target.value })
                                        }
                                        placeholder="Brief program overview..."
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold"
                            >
                                {editingCourse ? 'Update Course Record' : 'Save Program Details'}
                            </Button>
                        </form>
                    </div>

                    {/* Courses Filter and Selection Toolbar */}
                    <div className="p-4 rounded-xl bg-white/80 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex flex-wrap items-center gap-2 flex-1 w-full sm:w-auto">
                            {/* Course Search */}
                            <div className="relative flex-1 sm:max-w-xs min-w-[180px]">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={courseSearch}
                                    onChange={(e) => { setCourseSearch(e.target.value); setCoursePage(1); }}
                                    placeholder="Filter courses..."
                                    className="pl-8 bg-white border-slate-200 text-xs h-9 rounded-lg"
                                />
                            </div>

                            {/* Level Filter */}
                            <Select
                                value={courseLevelFilter}
                                onValueChange={(val) => { setCourseLevelFilter(val); setCoursePage(1); }}
                            >
                                <SelectTrigger className="w-36 h-9 bg-white border-slate-200 text-xs rounded-lg">
                                    <SelectValue placeholder="All Levels" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-800">
                                    <SelectItem value="all">All Levels</SelectItem>
                                    <SelectItem value="Certificate">Certificate</SelectItem>
                                    <SelectItem value="Diploma">Diploma</SelectItem>
                                    <SelectItem value="Advance Diploma">Advance Diploma</SelectItem>
                                    <SelectItem value="Foundation">Foundation</SelectItem>
                                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                                    <SelectItem value="Masters">Masters</SelectItem>
                                    <SelectItem value="PhD">PhD</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* University Filter */}
                            <Select
                                value={courseUniFilter}
                                onValueChange={(val) => { setCourseUniFilter(val); setCoursePage(1); }}
                            >
                                <SelectTrigger className="w-44 h-9 bg-white border-slate-200 text-xs rounded-lg">
                                    <SelectValue placeholder="All Universities" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-800">
                                    <SelectItem value="all">All Universities</SelectItem>
                                    {universities.map((u: any) => (
                                        <SelectItem key={u._id} value={u._id}>
                                            {u.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {(courseSearch || courseLevelFilter !== 'all' || courseUniFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setCourseSearch('');
                                        setCourseLevelFilter('all');
                                        setCourseUniFilter('all');
                                        setCoursePage(1);
                                    }}
                                    className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
                                >
                                    <X className="w-3 h-3" /> Clear
                                </button>
                            )}
                        </div>

                        {/* Select All on Page Checkbox */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleToggleSelectAllCourses}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                            >
                                {allCurrentPageCoursesSelected ? (
                                    <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                    <Square className="w-4 h-4 text-slate-400" />
                                )}
                                <span>Select All on Page</span>
                                {selectedCourseIds.length > 0 && (
                                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                                        {selectedCourseIds.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 bg-white/60 rounded-2xl border border-slate-200">
                            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">No courses found matching filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {paginatedCourses.map((course: any) => {
                                    const isSelected = selectedCourseIds.includes(course._id);
                                    return (
                                        <div
                                            key={course._id}
                                            onClick={() => handleToggleSelectCourse(course._id)}
                                            className={`p-4 rounded-xl bg-white/90 backdrop-blur-xl border transition-all shadow-sm flex items-center justify-between cursor-pointer ${
                                                isSelected
                                                    ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                                                    : 'border-slate-200/90 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                {/* Row Checkbox */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleSelectCourse(course._id);
                                                    }}
                                                    className="flex-shrink-0 text-slate-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <Square className="w-5 h-5 text-slate-300" />
                                                    )}
                                                </button>

                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-bold text-sm text-slate-900 truncate">
                                                        {course.name}
                                                    </h4>
                                                    <div className="text-xs text-slate-500 mt-0.5">
                                                        {course.university?.name || 'Institution'} ·{' '}
                                                        <span className="text-primary font-medium">
                                                            {course.level}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-amber-700 font-mono mt-1 font-semibold">
                                                        {course.tuitionFee || 'Tuition on inquiry'} (
                                                        {course.duration})
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="flex gap-1.5 flex-shrink-0 ml-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Link href={`/courses/${encodeURIComponent(course._id)}`} target="_blank">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/70 rounded-lg"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-lg"
                                                    onClick={() => handleEditCourse(course)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                                                    onClick={() => handleDeleteCourse(course._id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Courses Pagination */}
                            <Pagination
                                currentPage={coursePage}
                                totalPages={courseTotalPages}
                                totalItems={filteredCourses.length}
                                pageSize={coursePageSize}
                                pageSizeOptions={[5, 10, 20, 50]}
                                onPageChange={(p) => setCoursePage(p)}
                                onPageSizeChange={(s) => { setCoursePageSize(s); setCoursePage(1); }}
                                className="bg-white/80 rounded-xl border border-slate-200 shadow-xs px-3"
                            />
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* ════════════════════ FLOATING BULK ACTION BARS ════════════════════ */}

            {/* Universities Bulk Action Bar */}
            {selectedUniIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-4 text-slate-800 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                            {selectedUniIds.length}
                        </span>
                        <span className="text-xs font-bold text-slate-900">Universities Selected</span>
                    </div>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleBulkDeleteUnis}
                        disabled={bulkDeleting}
                        className="h-8 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-sm"
                    >
                        {bulkDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete Selected ({selectedUniIds.length})
                    </Button>

                    <button
                        type="button"
                        onClick={() => setSelectedUniIds([])}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition-colors ml-auto"
                    >
                        <X className="w-3.5 h-3.5" /> Deselect All
                    </button>
                </div>
            )}

            {/* Courses Bulk Action Bar */}
            {selectedCourseIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-4 text-slate-800 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                            {selectedCourseIds.length}
                        </span>
                        <span className="text-xs font-bold text-slate-900">Courses Selected</span>
                    </div>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleBulkDeleteCourses}
                        disabled={bulkDeleting}
                        className="h-8 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-sm"
                    >
                        {bulkDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete Selected ({selectedCourseIds.length})
                    </Button>

                    <button
                        type="button"
                        onClick={() => setSelectedCourseIds([])}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition-colors ml-auto"
                    >
                        <X className="w-3.5 h-3.5" /> Deselect All
                    </button>
                </div>
            )}

            {/* Dossier Modal */}
            <UniversityDossierModal
                isOpen={!!selectedDossierUni}
                onClose={() => setSelectedDossierUni(null)}
                university={selectedDossierUni}
            />
        </AdminLayout>
    );
}
