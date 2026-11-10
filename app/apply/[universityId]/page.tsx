'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    FaGraduationCap,
    FaUser,
    FaFileLines,
    FaPaperPlane,
    FaCircleCheck,
    FaMagnifyingGlass,
    FaDollarSign,
    FaUsers,
    FaLocationDot,
    FaBookOpen,
    FaGlobe,
    FaUpload,
    FaPassport,
    FaPhone,
    FaEnvelope,
    FaMapPin,
    FaAward,
    FaFilePdf,
    FaArrowLeft,
} from 'react-icons/fa6';
import { Sparkles, AlertCircle, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

// Deterministic Initials Avatar Component (No external broken logo images)
function UniversityInitialsAvatar({ name }: { name: string }) {
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
            className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-3xl text-white font-black text-2xl sm:text-3xl shadow-lg flex-shrink-0"
            style={{
                background: `linear-gradient(135deg, hsl(${hue}, 65%, 45%), hsl(${(hue + 40) % 360}, 75%, 35%))`,
            }}
        >
            {initials || 'UN'}
        </div>
    );
}

export default function ApplyPage() {
    const { universityId } = useParams();
    const router = useRouter();

    const [university, setUniversity] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loadingUni, setLoadingUni] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [applicationRef, setApplicationRef] = useState('');

    // Form state: only Name, Phone, Email are mandatory
    const [formData, setFormData] = useState({
        // Mandatory
        fullName: '',
        phone: '',
        email: '',

        // Optional Personal
        address: '',
        passportNumber: '',

        // Degree preference
        applyingLevel: 'Bachelor',
        desiredProgram: '',
        intakeSession: 'Fall 2025',

        // SSC / 10th Grade
        sscPoint: '',
        sscYear: '',

        // HSC / 12th Grade
        hscPoint: '',
        hscYear: '',

        // BS / Bachelor (For Master's / MS applicants)
        bsTitle: '',
        bsPoint: '',
        bsNumber: '',
        bsYear: '',

        // Notes
        notes: '',
    });

    // File attachments state (Optional)
    const [files, setFiles] = useState<{
        sscFile?: File | null;
        hscFile?: File | null;
        bsFile?: File | null;
        passportFile?: File | null;
        additionalFile?: File | null;
    }>({});

    // Fetch university & courses
    useEffect(() => {
        if (!universityId) return;
        setLoadingUni(true);
        Promise.all([
            fetch(`/api/universities/${encodeURIComponent(String(universityId))}`).then((r) => r.json()),
            fetch(`/api/courses?universityId=${encodeURIComponent(String(universityId))}`).then((r) => r.json()),
        ])
            .then(([uniData, courseData]) => {
                if (uniData && !uniData.error && uniData.name) {
                    setUniversity(uniData);
                    setCourses(Array.isArray(courseData) ? courseData : []);
                } else {
                    toast.error('Could not load institution details');
                }
            })
            .catch(() => toast.error('Error fetching university'))
            .finally(() => setLoadingUni(false));
    }, [universityId]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setFiles((prev) => ({ ...prev, [field]: selected }));
            toast.success(`Attached ${selected.name}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate strictly mandatory fields
        if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
            toast.error('Please enter your Full Name, Contact Number, and Email Address.');
            return;
        }

        setSubmitting(true);
        const toastId = toast.loading('Submitting application & uploading documents...');

        try {
            const data = new FormData();
            // Append all text fields
            Object.entries(formData).forEach(([k, v]) => {
                if (v) data.append(k, v);
            });

            data.append('universityId', String(university?._id || university?.id || universityId));
            data.append('universityName', university?.name || String(universityId));
            data.append('country', university?.country || 'Bangladesh');

            // Append optional files if attached
            if (files.sscFile) data.append('sscFile', files.sscFile);
            if (files.hscFile) data.append('hscFile', files.hscFile);
            if (files.bsFile) data.append('bsFile', files.bsFile);
            if (files.passportFile) data.append('passportFile', files.passportFile);
            if (files.additionalFile) data.append('additionalFile', files.additionalFile);

            const res = await fetch('/api/applications', {
                method: 'POST',
                body: data,
            });

            const resData = await res.json();
            if (res.ok && resData.success) {
                toast.success('Application submitted successfully!', { id: toastId });
                setApplicationRef(resData.data?._id || `APP-${Date.now().toString().slice(-6)}`);
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast.error(resData.message || 'Error submitting application', { id: toastId });
            }
        } catch {
            toast.error('Network error during application submission', { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingUni) {
        return (
            <div className="flex justify-center items-center min-h-[70vh] pt-24">
                <div className="text-center space-y-3">
                    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-500 font-medium text-sm">Loading university information...</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 pb-20 pt-28 px-4">
                <GlassCard className="p-8 sm:p-12 text-center space-y-6 bg-white/80 backdrop-blur-xl border border-emerald-200 shadow-xl rounded-3xl">
                    <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                        <FaCircleCheck className="h-10 w-10 text-emerald-600" />
                    </div>

                    <div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                            Application Received
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                            Application Submitted Successfully!
                        </h1>
                        <p className="text-sm text-slate-600 mt-2">
                            Thank you for applying to <strong className="text-blue-700">{university?.name}</strong>.
                        </p>
                    </div>

                    {/* Reference Box */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                            Application Reference ID
                        </span>
                        <span className="text-lg font-mono font-black text-slate-900 tracking-wider">
                            #{applicationRef}
                        </span>
                    </div>

                    <div className="space-y-3 text-left bg-blue-50/60 p-5 rounded-2xl border border-blue-100 text-xs sm:text-sm text-slate-700">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            Next Steps:
                        </h3>
                        <ul className="space-y-2 list-disc pl-5 text-slate-600">
                            <li>Our senior admissions counselor will review your academic qualifications.</li>
                            <li>You will be contacted via WhatsApp ({formData.phone}) or Email ({formData.email}) within 24 hours.</li>
                            <li>We will assist you with offer letter issuance, document verification, and embassy visa filing.</li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link href="/universities" className="flex-1">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 text-xs font-bold shadow-md">
                                Browse Other Universities
                            </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button variant="outline" className="w-full rounded-xl h-11 text-xs font-bold border-slate-300">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </GlassCard>
            </div>
        );
    }

    const d = university?.details || {};
    const tuition = d.tuition || d.tuition_out_of_state;
    const isMS = formData.applyingLevel === "Master's / MS" || formData.applyingLevel === 'PhD';

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-20 pt-28 px-4">
            {/* Back link */}
            <Link
                href={`/universities/${encodeURIComponent(university?._id || university?.id || universityId)}`}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
                <FaArrowLeft className="h-3.5 w-3.5" />
                Back to {university?.name || 'University'}
            </Link>

            {/* University Header Banner (Uses InitialsAvatar - NO broken logo images) */}
            {university && (
                <GlassCard className="p-6 sm:p-8 bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg rounded-3xl">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Colored Initials Avatar */}
                        <UniversityInitialsAvatar name={university.name} />

                        <div className="flex-1 text-center sm:text-left space-y-2">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                                    {university.country || 'International'}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <FaCircleCheck className="h-3 w-3 text-emerald-500" />
                                    Verified Institution
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                                {university.name}
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                                <FaLocationDot className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                                {university.location || university.country}
                            </p>

                            {tuition && (
                                <p className="text-xs font-semibold text-slate-600">
                                    Estimated Annual Tuition: <span className="text-emerald-700 font-bold">${Number(tuition).toLocaleString()}</span>
                                </p>
                            )}
                        </div>

                        <Link
                            href={`/universities/${encodeURIComponent(university._id || university.id || universityId)}`}
                            className="flex-shrink-0"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                className="border-blue-200 text-blue-700 bg-blue-50/70 hover:bg-blue-100 rounded-xl text-xs font-bold h-10 px-4"
                            >
                                <FaBookOpen className="h-3.5 w-3.5 mr-1.5" />
                                View Profile
                            </Button>
                        </Link>
                    </div>
                </GlassCard>
            )}

            {/* Instruction Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-700 space-y-0.5">
                    <p className="font-bold text-slate-900">
                        Official Admission Application
                    </p>
                    <p className="text-slate-600">
                        Only <strong className="text-rose-600">Name</strong>, <strong className="text-rose-600">Contact Number</strong>, and <strong className="text-rose-600">Email Address</strong> are mandatory. All educational details and document attachments are optional but help speed up your offer letter.
                    </p>
                </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Mandatory & Personal Information */}
                <GlassCard className="p-6 sm:p-8 space-y-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-md rounded-3xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                                <FaUser className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Applicant Information</h2>
                                <p className="text-xs text-slate-500">Contact details so counselors can reach you</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            * Mandatory Fields
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        {/* Full Name (MANDATORY) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                Full Name <span className="text-rose-600 font-black">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleTextChange}
                                required
                                placeholder="e.g. Mohammad Argha Biswas"
                                className="bg-white border-slate-300 rounded-xl text-sm h-11 focus:border-blue-500"
                            />
                        </div>

                        {/* Contact Number (MANDATORY) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                Contact Number / WhatsApp <span className="text-rose-600 font-black">*</span>
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleTextChange}
                                required
                                placeholder="e.g. +880 1712-345678"
                                className="bg-white border-slate-300 rounded-xl text-sm h-11 focus:border-blue-500"
                            />
                        </div>

                        {/* Mail Address (MANDATORY) */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                Mail Address <span className="text-rose-600 font-black">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleTextChange}
                                required
                                placeholder="e.g. student@example.com"
                                className="bg-white border-slate-300 rounded-xl text-sm h-11 focus:border-blue-500"
                            />
                        </div>

                        {/* Present Address (OPTIONAL) */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="address" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                                <span>Present / Permanent Address</span>
                                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                            </Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleTextChange}
                                placeholder="e.g. House #12, Road #4, Dhanmondi, Dhaka-1205"
                                className="bg-white border-slate-300 rounded-xl text-sm h-11 focus:border-blue-500"
                            />
                        </div>

                        {/* Passport if have (OPTIONAL) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="passportNumber" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                                <span>Passport Number (If Have)</span>
                                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                            </Label>
                            <Input
                                id="passportNumber"
                                name="passportNumber"
                                value={formData.passportNumber}
                                onChange={handleTextChange}
                                placeholder="e.g. A01234567"
                                className="bg-white border-slate-300 rounded-xl text-sm h-11 focus:border-blue-500 uppercase"
                            />
                        </div>

                        {/* Passport Copy File (OPTIONAL) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="passportFile" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                                <span>Passport Copy (If Have)</span>
                                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="passportFile"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange('passportFile', e)}
                                    className="bg-white border-slate-300 rounded-xl text-xs h-11 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* 2. Desired Degree & Program */}
                <GlassCard className="p-6 sm:p-8 space-y-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-md rounded-3xl">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                            <FaGraduationCap className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Study Preferences</h2>
                            <p className="text-xs text-slate-500">Select your intended degree level and intake</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-700">Applying Level</Label>
                            <Select
                                value={formData.applyingLevel}
                                onValueChange={(val) => handleSelectChange('applyingLevel', val)}
                            >
                                <SelectTrigger className="bg-white border-slate-300 rounded-xl text-sm h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bachelor">Bachelor / Undergraduate</SelectItem>
                                    <SelectItem value="Master's / MS">Master&apos;s / MS / Postgraduate</SelectItem>
                                    <SelectItem value="PhD">PhD / Doctorate</SelectItem>
                                    <SelectItem value="Diploma">Diploma / Foundation</SelectItem>
                                    <SelectItem value="General">General Consultation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-xs font-semibold text-slate-700">Intended Course / Program</Label>
                            {courses.length > 0 ? (
                                <Select
                                    value={formData.desiredProgram}
                                    onValueChange={(val) => handleSelectChange('desiredProgram', val)}
                                >
                                    <SelectTrigger className="bg-white border-slate-300 rounded-xl text-sm h-11">
                                        <SelectValue placeholder="Choose a course or type below" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General Admissions / Undecided">General Admissions / Undecided</SelectItem>
                                        {courses.map((c: any) => (
                                            <SelectItem key={c._id} value={c.name}>
                                                {c.name} {c.level ? `(${c.level})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    name="desiredProgram"
                                    value={formData.desiredProgram}
                                    onChange={handleTextChange}
                                    placeholder="e.g. Computer Science, MBA, Engineering..."
                                    className="bg-white border-slate-300 rounded-xl text-sm h-11"
                                />
                            )}
                        </div>
                    </div>
                </GlassCard>

                {/* 3. Secondary & Higher Secondary (SSC & HSC) */}
                <GlassCard className="p-6 sm:p-8 space-y-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-md rounded-3xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                                <FaAward className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900">SSC &amp; HSC Academic Results</h2>
                                <p className="text-xs text-slate-500">Provide points, passing year, and optional certificate upload</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            Optional
                        </span>
                    </div>

                    <div className="space-y-6">
                        {/* SSC Sub-section */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <FaCircleCheck className="h-3.5 w-3.5 text-blue-600" />
                                Secondary School Certificate (SSC / O-Levels / 10th)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-600">SSC Point / GPA</Label>
                                    <Input
                                        name="sscPoint"
                                        value={formData.sscPoint}
                                        onChange={handleTextChange}
                                        placeholder="e.g. 5.00"
                                        className="bg-white border-slate-300 rounded-xl text-xs h-10"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-600">Passing Year</Label>
                                    <Input
                                        name="sscYear"
                                        value={formData.sscYear}
                                        onChange={handleTextChange}
                                        placeholder="e.g. 2020"
                                        className="bg-white border-slate-300 rounded-xl text-xs h-10"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-600">Attach SSC Transcript</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange('sscFile', e)}
                                        className="bg-white border-slate-300 rounded-xl text-xs h-10 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* HSC Sub-section */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <FaCircleCheck className="h-3.5 w-3.5 text-indigo-600" />
                                Higher Secondary Certificate (HSC / A-Levels / 12th)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-600">HSC Point / GPA</Label>
                                    <Input
                                        name="hscPoint"
                                        value={formData.hscPoint}
                                        onChange={handleTextChange}
                                        placeholder="e.g. 5.00"
                                        className="bg-white border-slate-300 rounded-xl text-xs h-10"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-600">Passing Year</Label>
                                    <Input
                                        name="hscYear"
                                        value={formData.hscYear}
                                        onChange={handleTextChange}
                                        placeholder="e.g. 2022"
                                        className="bg-white border-slate-300 rounded-xl text-xs h-10"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-600">Attach HSC Transcript</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange('hscFile', e)}
                                        className="bg-white border-slate-300 rounded-xl text-xs h-10 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* 4. Bachelor (BS) Section - Highlighted for MS applicants */}
                <GlassCard
                    className={`p-6 sm:p-8 space-y-6 bg-white/80 backdrop-blur-xl border shadow-md rounded-3xl transition-all ${
                        isMS ? 'border-purple-300 ring-2 ring-purple-100' : 'border-white/60'
                    }`}
                >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                                <FaBookOpen className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900">
                                    Undergraduate / Bachelor (BS) Degree
                                </h2>
                                <p className="text-xs text-slate-500">
                                    {isMS
                                        ? 'Required for Master’s (MS) applicants'
                                        : 'Fill this section if applying for Master’s / MS / Postgrad'}
                                </p>
                            </div>
                        </div>
                        {isMS ? (
                            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                                Recommended for MS
                            </span>
                        ) : (
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                Optional
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-xs font-semibold text-slate-700">
                                BS Degree Title / Major Subject
                            </Label>
                            <Input
                                name="bsTitle"
                                value={formData.bsTitle}
                                onChange={handleTextChange}
                                placeholder="e.g. BSc in Computer Science & Engineering, BBA in Finance"
                                className="bg-white border-slate-300 rounded-xl text-sm h-11"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-700">
                                BS Point / CGPA
                            </Label>
                            <Input
                                name="bsPoint"
                                value={formData.bsPoint}
                                onChange={handleTextChange}
                                placeholder="e.g. 3.65 (out of 4.00)"
                                className="bg-white border-slate-300 rounded-xl text-sm h-11"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-700">
                                Certificate / Registration Number &amp; Year
                            </Label>
                            <Input
                                name="bsNumber"
                                value={formData.bsNumber}
                                onChange={handleTextChange}
                                placeholder="e.g. Reg #18104523, Year 2024"
                                className="bg-white border-slate-300 rounded-xl text-sm h-11"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-xs font-semibold text-slate-700">
                                Attach BS Certificate / Transcript
                            </Label>
                            <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange('bsFile', e)}
                                className="bg-white border-slate-300 rounded-xl text-xs h-11 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* 5. Additional Documents & Counselor Notes */}
                <GlassCard className="p-6 sm:p-8 space-y-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-md rounded-3xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                                <FaFileLines className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Additional Documents &amp; Notes</h2>
                                <p className="text-xs text-slate-500">Attach any other supporting documents (CV, IELTS, Recommendations)</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            Optional
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-700">
                                Attach Other Supporting Documents (PDF / Image)
                            </Label>
                            <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange('additionalFile', e)}
                                className="bg-white border-slate-300 rounded-xl text-xs h-11 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-semibold text-slate-700">
                                Special Inquiries or Counselor Notes
                            </Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleTextChange}
                                placeholder="Any specific requirements, questions regarding scholarships, embassy visa, or accommodation..."
                                className="bg-white border-slate-300 rounded-xl text-sm min-h-[90px]"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="w-full sm:w-auto rounded-xl h-11 px-6 border-slate-300 text-xs font-bold"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Submitting Application...
                            </>
                        ) : (
                            <>
                                <FaPaperPlane className="h-3.5 w-3.5" />
                                Submit Official Application
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
