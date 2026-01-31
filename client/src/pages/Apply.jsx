import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitApplication } from '@/lib/api'; // Import the API function
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUniversityById } from '@/data/universitiesData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { GraduationCap, User, Mail, Phone, Calendar, FileText, Send, CheckCircle } from 'lucide-react';

const Apply = () => {
    const { universityId } = useParams();
    const navigate = useNavigate();
    const [university, setUniversity] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        currentEducation: '',
        gpa: '',
        fieldOfStudy: '',
        desiredProgram: '',
        intakeSemester: '',
        whyUniversity: '',
        careerGoals: ''
    });

    useDocumentTitle(university ? `Apply to ${university.name}` : 'Apply');

    useEffect(() => {
        const uni = getUniversityById(universityId);
        if (uni) {
            setUniversity(uni);
        } else {
            navigate('/universities');
        }
    }, [universityId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            universityId,
            universityName: university.name // Helpful to have name on backend too
        };

        const res = await submitApplication(payload);

        if (res.success) {
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert("Error submitting application: " + res.message);
        }
    };

    if (!university) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="text-4xl">🔍</div>
                    <p className="text-muted-foreground">Loading university information...</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 pb-20">
                <GlassCard className="p-8 sm:p-12 text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold">Application Submitted!</h1>
                    <p className="text-lg text-muted-foreground">
                        Thank you for applying to <span className="text-primary font-semibold">{university.name}</span>
                    </p>
                    <div className="space-y-3 text-left bg-white/5 p-6 rounded-lg">
                        <h3 className="font-semibold text-lg">What's Next?</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>You will receive a confirmation email within 24 hours</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Our admissions team will review your application</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>You'll be contacted for an interview if shortlisted</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Final decision will be communicated within 2-4 weeks</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            onClick={() => navigate('/universities')}
                            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        >
                            Browse More Universities
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="flex-1 border-primary/50 hover:bg-primary/10"
                        >
                            Back to Home
                        </Button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-20">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Apply to University
                </h1>
                <p className="text-lg text-muted-foreground">
                    Complete the form below to submit your application
                </p>
            </div>

            {/* University Info Card */}
            <GlassCard className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 border-2 border-primary/30 flex-shrink-0">
                        <img
                            src={university.logo}
                            alt={`${university.name} logo`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold">{university.name}</h2>
                        <p className="text-muted-foreground">{university.location}</p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${university.type === 'public'
                                ? 'bg-secondary/20 text-secondary'
                                : 'bg-purple-600/20 text-purple-400'
                                }`}>
                                {university.type.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                                {university.ranking}
                            </span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <User className="h-6 w-6 text-primary" />
                        <h3 className="text-xl sm:text-2xl font-bold">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your.email@example.com"
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="+60 12-345 6789"
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                            <Input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Academic Information */}
                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <h3 className="text-xl sm:text-2xl font-bold">Academic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="currentEducation">Current Education Level *</Label>
                            <Select value={formData.currentEducation} onValueChange={(value) => handleSelectChange('currentEducation', value)} required>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
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
                        <div className="space-y-2">
                            <Label htmlFor="gpa">GPA / CGPA *</Label>
                            <Input
                                id="gpa"
                                name="gpa"
                                value={formData.gpa}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 3.75"
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="fieldOfStudy">Current Field of Study *</Label>
                            <Input
                                id="fieldOfStudy"
                                name="fieldOfStudy"
                                value={formData.fieldOfStudy}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Science, Arts, Commerce"
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Program Selection */}
                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <FileText className="h-6 w-6 text-primary" />
                        <h3 className="text-xl sm:text-2xl font-bold">Program Selection</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="desiredProgram">Desired Program *</Label>
                            <Select value={formData.desiredProgram} onValueChange={(value) => handleSelectChange('desiredProgram', value)} required>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select a program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {university.programs.map((program, idx) => (
                                        <SelectItem key={idx} value={program}>{program}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="intakeSemester">Intake Semester *</Label>
                            <Select value={formData.intakeSemester} onValueChange={(value) => handleSelectChange('intakeSemester', value)} required>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select intake" />
                                </SelectTrigger>
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

                {/* Additional Information */}
                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <Send className="h-6 w-6 text-primary" />
                        <h3 className="text-xl sm:text-2xl font-bold">Additional Information</h3>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="whyUniversity">Why do you want to study at {university.name}? *</Label>
                            <Textarea
                                id="whyUniversity"
                                name="whyUniversity"
                                value={formData.whyUniversity}
                                onChange={handleChange}
                                required
                                placeholder="Tell us why you're interested in this university..."
                                className="bg-white/5 border-white/10 min-h-[120px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="careerGoals">What are your career goals? *</Label>
                            <Textarea
                                id="careerGoals"
                                name="careerGoals"
                                value={formData.careerGoals}
                                onChange={handleChange}
                                required
                                placeholder="Share your career aspirations..."
                                className="bg-white/5 border-white/10 min-h-[120px]"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/universities')}
                        className="flex-1 border-white/20 hover:bg-white/5"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg h-12"
                    >
                        <Send className="h-5 w-5 mr-2" />
                        Submit Application
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Apply;
