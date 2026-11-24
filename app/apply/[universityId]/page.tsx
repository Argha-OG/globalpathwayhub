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

    return (
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-lg bg-[#144272] text-[#FFD749] border border-[#3FC1C9]/30 font-black text-2xl sm:text-3xl shadow-xs flex-shrink-0">
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
                    <div className="h-10 w-10 border-4 border-[#144272] border-t-transparent rounded-[9999px] animate-spin mx-auto" />
                    <p className="text-[#144272] font-medium text-sm">Loading university information...</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 pb-20 pt-28 px-4">
                <GlassCard className="p-8 sm:p-12 text-center space-y-6 bg-white border border-[#144272]/15 shadow-xs rounded-lg">
                    <div className="w-20 h-20 mx-auto bg-[#3FC1C9]/20 rounded-lg flex items-center justify-center text-[#144272] shadow-xs">
                        <FaCircleCheck className="h-10 w-10 text-[#144272]" />
                    </div>

                    <div>
                        <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#FFD749] text-black border border-[#144272]/20 uppercase tracking-wider">
                            Application Received
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#144272] mt-3">
                            Application Submitted Successfully!
                        </h1>
                        <p className="text-sm text-black/70 mt-2">
                            Thank you for applying to <strong className="text-[#144272]">{university?.name}</strong>.
                        </p>
                    </div>

                    {/* Reference Box */}
                    <div className="p-4 rounded-lg bg-[#F5F5F5] border border-[#144272]/20 text-center space-y-1">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-black/50 block">
                            Application Reference ID
                        </span>
                        <span className="text-lg font-mono font-black text-[#144272] tracking-wider">
                            #{applicationRef}
                        </span>
                    </div>

                    <div className="space-y-3 text-left bg-[#3FC1C9]/15 p-5 rounded-lg border border-[#3FC1C9]/30 text-xs sm:text-sm text-black/80">
                        <h3 className="font-bold text-[#144272] flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#144272]" />
                            Next Steps:
                        </h3>
                        <ul className="space-y-2 list-disc pl-5 text-black/70">
                            <li>Our senior admissions counselor will review your academic qualifications.</li>
                            <li>You will be contacted via WhatsApp ({formData.phone}) or Email ({formData.email}) within 24 hours.</li>
                            <li>We will assist you with offer letter issuance, document verification, and embassy visa filing.</li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link href="/universities" className="flex-1">
                            <Button className="w-full bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] rounded-lg h-11 text-xs font-bold uppercase tracking-wider shadow-xs">
                                Browse Other Universities
                            </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button variant="outline" className="w-full rounded-lg h-11 text-xs font-bold border-[#144272]/30 text-[#144272]">
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
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#144272]/70 hover:text-[#144272] transition-colors"
            >
                <FaArrowLeft className="h-3.5 w-3.5" />
                Back to {university?.name || 'University'}
            </Link>

            {/* University Header Banner (Uses InitialsAvatar - NO broken logo images) */}
            {university && (
                <GlassCard className="p-6 sm:p-8 bg-white border border-[#144272]/15 shadow-xs rounded-lg">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Colored Initials Avatar */}
                        <UniversityInitialsAvatar name={university.name} />

                        <div className="flex-1 text-center sm:text-left space-y-2">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#F5F5F5] text-[#144272] border border-[#144272]/20 uppercase tracking-wider">
                                    {university.country || 'International'}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#FFD749] text-black border border-[#144272]/20 flex items-center gap-1">
                                    <FaCircleCheck className="h-3 w-3 text-[#144272]" />
                                    Verified Institution
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black text-[#144272] leading-tight">
                                {university.name}
                            </h1>

                            <p className="text-xs sm:text-sm text-black/60 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                                <FaLocationDot className="h-3.5 w-3.5 text-[#144272] flex-shrink-0" />
                                {university.location || university.country}
                            </p>

                            {tuition && (
                                <p className="text-xs font-semibold text-black/70">
                                    Estimated Annual Tuition: <span className="text-[#144272] font-bold">${Number(tuition).toLocaleString()}</span>
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
                                className="border-[#3FC1C9] text-[#144272] bg-[#3FC1C9]/20 hover:bg-[#3FC1C9]/40 rounded-lg text-xs font-bold h-10 px-4"
                            >
                                <FaBookOpen className="h-3.5 w-3.5 mr-1.5" />
                                View Profile
                            </Button>
                        </Link>
                    </div>
                </GlassCard>
            )}

            {/* Instruction Banner */}
            <div className="p-4 rounded-lg bg-[#3FC1C9]/15 border border-[#3FC1C9]/40 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[#144272] flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-black/80 space-y-0.5">
                    <p className="font-bold text-[#144272]">
                        Official Admission Application
                    </p>
                    <p className="text-black/70">
                        Only <strong className="text-[#144272]">Name</strong>, <strong className="text-[#144272]">Contact Number</strong>, and <strong className="text-[#144272]">Email Address</strong> are mandatory. All educational details and document attachments are optional but help speed up your offer letter.
                    </p>
                </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Mandatory & Personal Information */}
                <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-[#144272]/15 shadow-xs rounded-lg">
                    <div className="flex items-center justify-between pb-3 border-b border-[#144272]/10">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-[#3FC1C9]/20 text-[#144272]">
                                <FaUser className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[#144272]">Applicant Information</h2>
                                <p className="text-xs text-black/60">Contact details so counselors can reach you</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-black bg-[#FFD749] border border-[#144272]/20 px-2.5 py-0.5 rounded-lg">
                            * Mandatory Fields
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        {/* Full Name (MANDATORY) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName" className="text-xs font-bold text-[#144272] flex items-center gap-1">
                                Full Name <span className="text-[#144272] font-black">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleTextChange}
                                required
                                placeholder="e.g. Mohammad Argha Biswas"
                                className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black focus:border-[#3FC1C9]"
                            />
                        </div>

                        {/* Contact Number (MANDATORY) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-xs font-bold text-[#144272] flex items-center gap-1">
                                Contact Number / WhatsApp <span className="text-[#144272] font-black">*</span>
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleTextChange}
                                required
                                placeholder="e.g. +880 1712-345678"
                                className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black focus:border-[#3FC1C9]"
                            />
                        </div>

                        {/* Mail Address (MANDATORY) */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="email" className="text-xs font-bold text-[#144272] flex items-center gap-1">
                                Mail Address <span className="text-[#144272] font-black">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleTextChange}
                                required
                                placeholder="e.g. student@example.com"
                                className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black focus:border-[#3FC1C9]"
                            />
                        </div>

                        {/* Present Address (OPTIONAL) */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="address" className="text-xs font-semibold text-black/70 flex items-center justify-between">
                                <span>Present / Permanent Address</span>
                                <span className="text-[10px] text-black/40 font-normal">Optional</span>
                            </Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleTextChange}
                                placeholder="e.g. House #12, Road #4, Dhanmondi, Dhaka-1205"
                                className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black focus:border-[#3FC1C9]"
                            />
                        </div>

                        {/* Passport if have (OPTIONAL) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="passportNumber" className="text-xs font-semibold text-black/70 flex items-center justify-between">
                                <span>Passport Number (If Have)</span>
                                <span className="text-[10px] text-black/40 font-normal">Optional</span>
                            </Label>
                            <Input
                                id="passportNumber"
                                name="passportNumber"
                                value={formData.passportNumber}
                                onChange={handleTextChange}
                                placeholder="e.g. A01234567"
                                className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black focus:border-[#3FC1C9] uppercase"
                            />
                        </div>

                        {/* Passport Copy File (OPTIONAL) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="passportFile" className="text-xs font-semibold text-black/70 flex items-center justify-between">
                                <span>Passport Copy (If Have)</span>
                                <span className="text-[10px] text-black/40 font-normal">Optional</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="passportFile"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange('passportFile', e)}
                                    className="bg-white border-[#144272]/20 rounded-lg text-xs h-11 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3FC1C9]/20 file:text-[#144272] hover:file:bg-[#3FC1C9]/30 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* 2. Desired Degree & Program */}
                <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-[#144272]/15 shadow-xs rounded-lg">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-[#144272]/10">
                        <div className="p-2 rounded-lg bg-[#3FC1C9]/20 text-[#144272]">
                            <FaGraduationCap className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-[#144272]">Study Preferences</h2>
                            <p className="text-xs text-black/60">Select your intended degree level and intake</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-black/80">Applying Level</Label>
                            <Select
                                value={formData.applyingLevel}
                                onValueChange={(val) => handleSelectChange('applyingLevel', val)}
                            >
                                <SelectTrigger className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black">
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
                            <Label className="text-xs font-semibold text-black/80">Intended Course / Program</Label>
                            {courses.length > 0 ? (
                                <Select
                                    value={formData.desiredProgram}
                                    onValueChange={(val) => handleSelectChange('desiredProgram', val)}
                                >
                                    <SelectTrigger className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black">
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
                                    className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black"
                                />
                            )}
                        </div>
                    </div>
                </GlassCard>

                {/* 3. Secondary & Higher Secondary (SSC & HSC) */}
                <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-[#144272]/15 shadow-xs rounded-lg">
                    <div className="flex items-center justify-between pb-3 border-b border-[#144272]/10">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-[#FFD749] text-black">
                                <FaAward className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[#144272]">SSC &amp; HSC Academic Results</h2>
                                <p className="text-xs text-black/60">Provide points, passing year, and optional certificate upload</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold text-black/60 bg-[#F5F5F5] px-2.5 py-0.5 rounded-lg border border-[#144272]/20">
                            Optional
                        </span>
                    </div>

                    <div className="space-y-6">
                        {/* SSC Sub-section */}
                        <div className="p-4 rounded-lg bg-[#F5F5F5] border border-[#144272]/15 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#144272] flex items-center gap-1.5">
                                <FaCircleCheck className="h-3.5 w-3.5 text-[#144272]" />
                                Secondary School Certificate (SSC / O-Levels / 10th)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-black/70">SSC Point / GPA</Label>
                                    <Input
                                        name="sscPoint"
                                        value={formData.sscPoint}
                                        onChange={handleTextChange}
                                        placeholder="e.g. 5.00"
                                        className="bg-white border-[#144272]/20 rounded-lg text-xs h-10 text-black"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-black/70">Passing Year</Label>
                                    <Input
                                        name="sscYear"
                                        value={formData.sscYear}
                                        onChange={handleTextChange}
                                        placeholder="e.g. 2020"
                                        className="bg-white border-[#144272]/20 rounded-lg text-xs h-10 text-black"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-black/70">Attach SSC Transcript</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange('sscFile', e)}
                                        className="bg-white border-[#144272]/20 rounded-lg text-xs h-10 file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3FC1C9]/20 file:text-[#144272] cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* HSC Sub-section */}
                        <div className="p-4 rounded-lg bg-[#F5F5F5] border border-[#144272]/15 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#144272] flex items-center gap-1.5">
                                <FaCircleCheck className="h-3.5 w-3.5 text-[#144272]" />
                                Higher Secondary Certificate (HSC / A-Levels / 12th)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-black/70">HSC Point / GPA</Label>
                                    <Input
                                        name="hscPoint"
                                        value={formData.hscPoint}
                                        onChange={handleTextChange}
                                        placeholder="e.g. 5.00"
                                        className="bg-white border-[#144272]/20 rounded-lg text-xs h-10 text-black"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-black/70">Passing Year</Label>
                                    <Input
                                        name="hscYear"
                                        value={formData.hscYear}
                                        onChange={handleTextChange}
                                        placeholder="e.g. 2022"
                                        className="bg-white border-[#144272]/20 rounded-lg text-xs h-10 text-black"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-black/70">Attach HSC Transcript</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange('hscFile', e)}
                                        className="bg-white border-[#144272]/20 rounded-lg text-xs h-10 file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3FC1C9]/20 file:text-[#144272] cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* 4. Bachelor (BS) Section - Highlighted for MS applicants */}
                <GlassCard
                    className={`p-6 sm:p-8 space-y-6 bg-white border shadow-xs rounded-lg transition-all ${
                        isMS ? 'border-[#3FC1C9] ring-2 ring-[#3FC1C9]/20' : 'border-[#144272]/15'
                    }`}
                >
                    <div className="flex items-center justify-between pb-3 border-b border-[#144272]/10">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-[#3FC1C9]/20 text-[#144272]">
                                <FaBookOpen className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[#144272]">
                                    Undergraduate / Bachelor (BS) Degree
                                </h2>
                                <p className="text-xs text-black/60">
                                    {isMS
                                        ? 'Required for Master’s (MS) applicants'
                                        : 'Fill this section if applying for Master’s / MS / Postgrad'}
                                </p>
                            </div>
                        </div>
                        {isMS ? (
                            <span className="text-[11px] font-bold text-black bg-[#FFD749] border border-[#144272]/20 px-2.5 py-0.5 rounded-lg">
                                Recommended for MS
                            </span>
                        ) : (
                            <span className="text-[11px] font-semibold text-black/60 bg-[#F5F5F5] px-2.5 py-0.5 rounded-lg border border-[#144272]/20">
                                Optional
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-xs font-semibold text-black/80">
                                BS Degree Title / Major Subject
                            </Label>
                            <Input
                                name="bsTitle"
                                value={formData.bsTitle}
                                onChange={handleTextChange}
                                placeholder="e.g. BSc in Computer Science & Engineering, BBA in Finance"
                                className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-black/80">
                                BS Point / CGPA
                            </Label>
                            <Input
                                name="bsPoint"
                                value={formData.bsPoint}
                                onChange={handleTextChange}
                                placeholder="e.g. 3.65 (out of 4.00)"
                                className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-black/80">
                                Certificate / Registration Number &amp; Year
                            </Label>
                            <Input
                                name="bsNumber"
                                value={formData.bsNumber}
                                onChange={handleTextChange}
                                placeholder="e.g. Reg #18104523, Year 2024"
                                className="bg-white border-[#144272]/20 rounded-lg text-sm h-11 text-black"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-xs font-semibold text-black/80">
                                Attach BS Certificate / Transcript
                            </Label>
                            <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange('bsFile', e)}
                                className="bg-white border-[#144272]/20 rounded-lg text-xs h-11 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3FC1C9]/20 file:text-[#144272] hover:file:bg-[#3FC1C9]/30 cursor-pointer"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* 5. Additional Documents & Counselor Notes */}
                <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-[#144272]/15 shadow-xs rounded-lg">
                    <div className="flex items-center justify-between pb-3 border-b border-[#144272]/10">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-[#3FC1C9]/20 text-[#144272]">
                                <FaFileLines className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[#144272]">Additional Documents &amp; Notes</h2>
                                <p className="text-xs text-black/60">Attach any other supporting documents (CV, IELTS, Recommendations)</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold text-black/60 bg-[#F5F5F5] px-2.5 py-0.5 rounded-lg border border-[#144272]/20">
                            Optional
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-black/80">
                                Attach Other Supporting Documents (PDF / Image)
                            </Label>
                            <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange('additionalFile', e)}
                                className="bg-white border-[#144272]/20 rounded-lg text-xs h-11 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3FC1C9]/20 file:text-[#144272] hover:file:bg-[#3FC1C9]/30 cursor-pointer"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-semibold text-black/80">
                                Special Inquiries or Counselor Notes
                            </Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleTextChange}
                                placeholder="Any specific requirements, questions regarding scholarships, embassy visa, or accommodation..."
                                className="bg-white border-[#144272]/20 rounded-lg text-sm min-h-[90px] text-black"
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
                        className="w-full sm:w-auto rounded-lg h-11 px-6 border-[#144272]/30 text-xs font-bold text-[#144272]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] rounded-lg h-11 px-8 text-xs font-bold uppercase tracking-wider shadow-xs flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="h-4 w-4 border-2 border-[#FFD749] border-t-transparent rounded-[9999px] animate-spin" />
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
