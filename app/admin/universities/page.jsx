'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminUniversitiesPage() {
    const [universities, setUniversities] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [uniForm, setUniForm] = useState({ name: '', country: '', location: '', website: '', image: null });
    const [courseForm, setCourseForm] = useState({ name: '', universityId: '', level: 'Bachelor', duration: '3 years', tuitionFee: '', description: '' });
    const [editingUni, setEditingUni] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);

    const refreshData = async () => {
        try {
            setLoading(true);
            const [unisRes, coursesRes, countriesRes] = await Promise.all([
                fetch('/api/universities').then((r) => r.json()),
                fetch('/api/courses').then((r) => r.json()),
                fetch('/api/countries').then((r) => r.json()).catch(() => [
                    { name: 'United Kingdom' },
                    { name: 'United States' },
                    { name: 'Canada' },
                    { name: 'Australia' },
                    { name: 'Germany' },
                    { name: 'Malaysia' },
                ]),
            ]);
            setUniversities(unisRes || []);
            setAllCourses(coursesRes || []);
            setCountries(countriesRes || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load universities');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleAddUni = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(editingUni ? 'Updating university record...' : 'Saving partner university...');
        const data = new FormData();
        data.append('name', uniForm.name);
        data.append('country', uniForm.country);
        data.append('location', uniForm.location);
        data.append('website', uniForm.website);
        if (uniForm.image) data.append('image', uniForm.image);

        const url = editingUni ? `/api/universities/${editingUni._id}` : '/api/universities';
        const method = editingUni ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, { method, body: data }).then((r) => r.json());

            if (res.success) {
                toast.success(editingUni ? 'University updated!' : 'University added successfully!', { id: toastId });
                setUniForm({ name: '', country: '', location: '', website: '', image: null });
                setEditingUni(null);
                refreshData();
            } else {
                toast.error('Error: ' + res.message, { id: toastId });
            }
        } catch {
            toast.error('Network error', { id: toastId });
        }
    };

    const handleEditUni = (uni) => {
        setEditingUni(uni);
        setUniForm({ name: uni.name, country: uni.country, location: uni.location, website: uni.website || '', image: null });
    };

    const handleDeleteUni = async (id) => {
        if (!window.confirm('Delete this university and associated programs?')) return;
        const toastId = toast.loading('Deleting university...');
        try {
            const res = await fetch(`/api/universities/${id}`, { method: 'DELETE' }).then((r) => r.json());
            if (res.success) {
                toast.success('University deleted', { id: toastId });
                refreshData();
            } else {
                toast.error(res.message || 'Delete failed', { id: toastId });
            }
        } catch {
            toast.error('Network error', { id: toastId });
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(editingCourse ? 'Updating degree program...' : 'Saving degree program...');
        const url = editingCourse ? `/api/courses/${editingCourse._id}` : '/api/courses';
        const method = editingCourse ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseForm),
            }).then((r) => r.json());

            if (res.success) {
                toast.success(editingCourse ? 'Program updated!' : 'Program added!', { id: toastId });
                setCourseForm({ name: '', universityId: '', level: 'Bachelor', duration: '3 years', tuitionFee: '', description: '' });
                setEditingCourse(null);
                refreshData();
            } else {
                toast.error('Error: ' + res.message, { id: toastId });
            }
        } catch {
            toast.error('Network error', { id: toastId });
        }
    };

    const handleEditCourse = (course) => {
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

    const handleDeleteCourse = async (id) => {
        if (!window.confirm('Delete this course program?')) return;
        const toastId = toast.loading('Deleting course program...');
        try {
            const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' }).then((r) => r.json());
            if (res.success) {
                toast.success('Course deleted', { id: toastId });
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
                        Partner Universities & Course Catalog
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Manage global partner institutions, program requirements, and Cloudflare R2 logo assets.
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
                    <TabsTrigger value="university" className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-semibold">
                        Universities ({universities.length})
                    </TabsTrigger>
                    <TabsTrigger value="course" className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-semibold">
                        Courses & Programs ({allCourses.length})
                    </TabsTrigger>
                </TabsList>

                {/* Universities Tab */}
                <TabsContent value="university" className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                            <h2 className="text-base font-bold text-slate-900">
                                {editingUni ? 'Edit University Institution' : 'Add New Partner University'}
                            </h2>
                            {editingUni && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditingUni(null);
                                        setUniForm({ name: '', country: '', location: '', website: '', image: null });
                                    }}
                                    className="text-xs"
                                >
                                    Cancel Edit
                                </Button>
                            )}
                        </div>

                        <form onSubmit={handleAddUni} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">University Name *</Label>
                                    <Input
                                        value={uniForm.name}
                                        onChange={(e) => setUniForm({ ...uniForm, name: e.target.value })}
                                        required
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Campus City / Location *</Label>
                                    <Input
                                        value={uniForm.location}
                                        onChange={(e) => setUniForm({ ...uniForm, location: e.target.value })}
                                        required
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Country *</Label>
                                    <Select
                                        value={uniForm.country}
                                        onValueChange={(val) => setUniForm({ ...uniForm, country: val })}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                            <SelectItem value="United States">United States</SelectItem>
                                            <SelectItem value="Canada">Canada</SelectItem>
                                            <SelectItem value="Australia">Australia</SelectItem>
                                            <SelectItem value="Germany">Germany</SelectItem>
                                            <SelectItem value="Malaysia">Malaysia</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                <div className="space-y-1 sm:col-span-2">
                                    <Label className="text-xs text-slate-700">University Logo (Cloudflare R2)</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setUniForm({ ...uniForm, image: e.target.files[0] })}
                                        className="bg-white border-slate-300 text-slate-800 text-xs file:text-xs file:bg-slate-100 file:border-0 file:rounded-md file:px-2 file:py-1"
                                    />
                                </div>
                            </div>
                            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold">
                                {editingUni ? 'Update University Record' : 'Save Partner University'}
                            </Button>
                        </form>
                    </div>

                    {/* Universities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {universities.map((uni) => (
                            <div
                                key={uni._id}
                                className="p-4 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/90 flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {uni.logo ? (
                                        <img src={uni.logo} alt={uni.name} className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm text-slate-900 truncate">{uni.name}</h4>
                                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                            <MapPin className="w-3 h-3 text-slate-400" />
                                            {uni.location}, {uni.country}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-1.5">
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
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Courses Tab */}
                <TabsContent value="course" className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                            <h2 className="text-base font-bold text-slate-900">
                                {editingCourse ? 'Edit Degree Program' : 'Add New Degree Program'}
                            </h2>
                            {editingCourse && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditingCourse(null);
                                        setCourseForm({ name: '', universityId: '', level: 'Bachelor', duration: '3 years', tuitionFee: '', description: '' });
                                    }}
                                    className="text-xs"
                                >
                                    Cancel Edit
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
                                        onValueChange={(val) => setCourseForm({ ...courseForm, universityId: val })}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                            <SelectValue placeholder="Select University" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                                            {universities.map((u) => (
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
                                        onValueChange={(val) => setCourseForm({ ...courseForm, level: val })}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                                            <SelectItem value="Bachelor">Bachelors</SelectItem>
                                            <SelectItem value="Masters">Masters / Postgraduate</SelectItem>
                                            <SelectItem value="PhD">Doctorate / PhD</SelectItem>
                                            <SelectItem value="Foundation">Foundation / Pathway</SelectItem>
                                            <SelectItem value="Diploma">Diploma</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Duration</Label>
                                    <Input
                                        value={courseForm.duration}
                                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                                        placeholder="e.g. 1 year / 3 years"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <Label className="text-xs text-slate-700">Estimated Tuition Fee</Label>
                                    <Input
                                        value={courseForm.tuitionFee}
                                        onChange={(e) => setCourseForm({ ...courseForm, tuitionFee: e.target.value })}
                                        placeholder="e.g. £18,500/year"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                            </div>
                            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold">
                                {editingCourse ? 'Update Course Record' : 'Save Program Details'}
                            </Button>
                        </form>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {allCourses.map((course) => (
                            <div
                                key={course._id}
                                className="p-4 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/90 flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition-all shadow-sm"
                            >
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm text-slate-900 truncate">{course.name}</h4>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {course.university?.name || 'Institution'} •{' '}
                                        <span className="text-primary font-medium">{course.level}</span>
                                    </div>
                                    <div className="text-[11px] text-amber-700 font-mono mt-1 font-semibold">
                                        {course.tuitionFee || 'Tuition on inquiry'} ({course.duration})
                                    </div>
                                </div>

                                <div className="flex gap-1.5 flex-shrink-0">
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
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
