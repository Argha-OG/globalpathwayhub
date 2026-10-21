'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    FaGraduationCap,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaFileLines,
    FaPaperPlane,
    FaCircleCheck,
    FaMagnifyingGlass,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';

const Apply = () => {
    const { universityId } = useParams();
    const router = useRouter();
    const [university, setUniversity] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', dateOfBirth: '',
        currentEducation: '', gpa: '', fieldOfStudy: '',
        desiredProgram: '', intakeSemester: '', whyUniversity: '', careerGoals: ''
    });

    useEffect(() => {
        fetch(`/api/universities/${universityId}`)
            .then(r => r.json())
            .then(data => {
                if (data && !data.error) setUniversity(data);
                else router.push('/universities');
            })
            .catch(() => router.push('/universities'));
    }, [universityId, router]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSelectChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Lodging your university application...');
        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, universityId, universityName: university?.name })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Application submitted successfully! Our admissions counselors will review your profile.', { id: toastId });
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast.error(data.message || 'Error submitting application', { id: toastId });
            }
        } catch {
            toast.error('Network error during application submission', { id: toastId });
        }
    };

    if (!university) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <FaMagnifyingGlass className="w-8 h-8 animate-pulse" />
                    </div>
                    <p className="text-muted-foreground text-sm">Loading university information...</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 pb-20 pt-24 px-4">
                <GlassCard className="p-8 sm:p-12 text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                        <FaCircleCheck className="h-12 w-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold">Application Submitted!</h1>
                    <p className="text-lg text-muted-foreground">Thank you for applying to <span className="text-primary font-semibold">{university.name}</span></p>
                    <div className="space-y-3 text-left bg-white/5 p-6 rounded-lg">
                        <h3 className="font-semibold text-lg">What's Next?</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>You will receive a confirmation email within 24 hours</span></li>
                            <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>Our admissions team will review your application</span></li>
                            <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>You'll be contacted for an interview if shortlisted</span></li>
                            <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>Final decision will be communicated within 2-4 weeks</span></li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button onClick={() => router.push('/universities')} className="flex-1 bg-gradient-to-r from-primary to-secondary">Browse More Universities</Button>
                        <Button variant="outline" onClick={() => router.push('/')} className="flex-1 border-primary/50 hover:bg-primary/10">Back to Home</Button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-20 pt-24 px-4">
            <div className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Apply to University</h1>
                <p className="text-lg text-muted-foreground">Complete the form below to submit your application</p>
            </div>

            <GlassCard className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 border-2 border-primary/30 flex-shrink-0">
                        <img src={university.logo} alt={`${university.name} logo`} className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(university.name)}&size=200&background=random&color=fff&bold=true`; }}
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{university.name}</h2>
                        <p className="text-muted-foreground">{university.location}</p>
                    </div>
                </div>
            </GlassCard>

            <form onSubmit={handleSubmit} className="space-y-6">
                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <FaUser className="h-5 w-5 text-primary" />
                        <h3 className="text-xl sm:text-2xl font-bold">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2"><Label htmlFor="fullName">Full Name *</Label><Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Enter your full name" className="bg-white/5 border-white/10" /></div>
                        <div className="space-y-2"><Label htmlFor="email">Email Address *</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" className="bg-white/5 border-white/10" /></div>
                        <div className="space-y-2"><Label htmlFor="phone">Phone Number *</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+880 1410-555054" className="bg-white/5 border-white/10" /></div>
                        <div className="space-y-2"><Label htmlFor="dateOfBirth">Date of Birth *</Label><Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required className="bg-white/5 border-white/10" /></div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <FaGraduationCap className="h-5 w-5 text-primary" />
                        <h3 className="text-xl sm:text-2xl font-bold">Academic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label>Current Education Level *</Label>
                            <Select value={formData.currentEducation} onValueChange={(v) => handleSelectChange('currentEducation', v)}>
                                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Select education level" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="spm">SPM / O-Levels</SelectItem>
                                    <SelectItem value="stpm">STPM / A-Levels</SelectItem>
                                    <SelectItem value="foundation">Foundation</SelectItem>
                                    <SelectItem value="diploma">Diploma</SelectItem>
                                    <SelectItem value="degree">Bachelor's Degree</SelectItem>
                                    <SelectItem value="masters">Master's Degree</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2"><Label htmlFor="gpa">GPA / CGPA *</Label><Input id="gpa" name="gpa" value={formData.gpa} onChange={handleChange} required placeholder="e.g., 3.75" className="bg-white/5 border-white/10" /></div>
                        <div className="space-y-2 sm:col-span-2"><Label htmlFor="fieldOfStudy">Current Field of Study *</Label><Input id="fieldOfStudy" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} required placeholder="e.g., Science, Arts, Commerce" className="bg-white/5 border-white/10" /></div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <FaFileLines className="h-5 w-5 text-primary" />
                        <h3 className="text-xl sm:text-2xl font-bold">Program Selection</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label>Desired Program *</Label>
                            <Select value={formData.desiredProgram} onValueChange={(v) => handleSelectChange('desiredProgram', v)}>
                                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Select a program" /></SelectTrigger>
                                <SelectContent>
                                    {(university.programs || []).map((program, idx) => (
                                        <SelectItem key={idx} value={program.title || program}>{program.title || program}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Intake Semester *</Label>
                            <Select value={formData.intakeSemester} onValueChange={(v) => handleSelectChange('intakeSemester', v)}>
                                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Select intake" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2025-jan">January 2025</SelectItem>
                                    <SelectItem value="2025-apr">April 2025</SelectItem>
                                    <SelectItem value="2025-jul">July 2025</SelectItem>
                                    <SelectItem value="2025-sep">September 2025</SelectItem>
                                    <SelectItem value="2026-jan">January 2026</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <FaPaperPlane className="h-5 w-5 text-primary" />
                        <h3 className="text-xl sm:text-2xl font-bold">Additional Information</h3>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="whyUniversity">Why do you want to study at {university.name}? *</Label>
                            <Textarea id="whyUniversity" name="whyUniversity" value={formData.whyUniversity} onChange={handleChange} required placeholder="Tell us why you're interested in this university..." className="bg-white/5 border-white/10 min-h-[120px]" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="careerGoals">What are your career goals? *</Label>
                            <Textarea id="careerGoals" name="careerGoals" value={formData.careerGoals} onChange={handleChange} required placeholder="Share your career aspirations..." className="bg-white/5 border-white/10 min-h-[120px]" />
                        </div>
                    </div>
                </GlassCard>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push('/universities')} className="flex-1 border-white/20 hover:bg-white/5">Cancel</Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg h-12 flex items-center justify-center gap-2">
                        <FaPaperPlane className="h-4 w-4" />Submit Application
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Apply;
