'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import {
    FaGraduationCap,
    FaBookOpen,
    FaUsers,
    FaAward,
    FaGlobe,
    FaCircleCheck,
    FaArrowRight,
    FaBuildingColumns,
    FaLocationDot,
    FaCopy,
    FaCheck,
    FaWhatsapp,
    FaArrowUpRightFromSquare,
    FaUserTie,
} from 'react-icons/fa6';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { generateUniversityShareText, copyToClipboard } from '@/lib/share';
import { TEAM_LIST } from '@/lib/team';

// Colored Initials Badge
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
            className="w-14 h-14 flex items-center justify-center rounded-2xl text-white font-black text-lg shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{
                background: `linear-gradient(135deg, hsl(${hue}, 65%, 45%), hsl(${(hue + 40) % 360}, 75%, 35%))`,
            }}
        >
            {initials || 'UN'}
        </div>
    );
}

const Home = () => {
    useDocumentTitle('Home');

    const [featuredUnis, setFeaturedUnis] = useState<any[]>([]);
    const [copiedUniId, setCopiedUniId] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/universities')
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    // Pick 6 prominent universities
                    setFeaturedUnis(data.slice(0, 6));
                }
            })
            .catch(() => {});
    }, []);

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

    const features = [
        {
            icon: <FaGraduationCap className="h-10 w-10" />,
            title: "50+ Partner Universities",
            description: "Direct admissions representation with pre-negotiated counselor support worldwide"
        },
        {
            icon: <FaBookOpen className="h-10 w-10" />,
            title: "200+ Accredited Programs",
            description: "Wide range of accredited courses from engineering to medical, business, and arts"
        },
        {
            icon: <FaUsers className="h-10 w-10" />,
            title: "Expert Counseling",
            description: "Personalized student advisory, file processing, and embassy visa filing"
        },
        {
            icon: <FaAward className="h-10 w-10" />,
            title: "Scholarship & Aid",
            description: "Comprehensive scholarship assessment and tuition reduction opportunities"
        }
    ];

    const steps = [
        { number: "01", title: "Explore Universities", description: "Browse through 50+ partner universities and over 10,000+ worldwide institutions" },
        { number: "02", title: "Choose Your Program", description: "Find the perfect course matching your career goals, budget, and intake" },
        { number: "03", title: "Get Expert Advice", description: "Consult with our certified education counselors for admission and offer letters" },
        { number: "04", title: "Apply & Succeed", description: "Submit verified documents, receive your CAS/visa letter, and begin your journey" }
    ];

    const stats = [
        { value: "10,000+", label: "Global Institutions" },
        { value: "50+", label: "Partner Universities" },
        { value: "200+", label: "Accredited Programs" },
        { value: "98%", label: "Visa Success Rate" }
    ];

    const [homeSearch, setHomeSearch] = useState('');
    const handleHomeSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (homeSearch.trim()) {
            window.location.href = `/universities?search=${encodeURIComponent(homeSearch.trim())}`;
        } else {
            window.location.href = '/universities';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-24 md:space-y-32 pb-20 pt-10">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center w-full">
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                    <div className="space-y-8 animate-in slide-in-from-left duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-sm font-semibold text-primary shadow-sm">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            Your Future Starts Here
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1]">
                            Global
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary">
                                PathwayHub
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                            Connect with leading universities worldwide. Explore accredited programs, compare institutions, and take the first step towards academic success with expert guidance.
                        </p>

                        <form onSubmit={handleHomeSearch} className="pt-2 max-w-xl">
                            <div className="relative flex items-center shadow-lg rounded-full overflow-hidden bg-white/70 backdrop-blur-xl border border-white/60 p-1.5 focus-within:ring-2 focus-within:ring-primary/40">
                                <FaBuildingColumns className="h-5 w-5 text-primary ml-3 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={homeSearch}
                                    onChange={(e) => setHomeSearch(e.target.value)}
                                    placeholder="Search universities worldwide (e.g. Oxford, Harvard, Taylor's)..."
                                    className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                                />
                                <Button
                                    type="submit"
                                    className="rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 h-9 flex-shrink-0"
                                >
                                    Search
                                </Button>
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-1.5 block pl-3">
                                Verified accreditation, live tuition, & 35+ institutional registry attributes
                            </span>
                        </form>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link href="/universities">
                                <Button size="lg" className="text-base px-7 py-5 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 flex items-center gap-2">
                                    Browse All 50+ Universities
                                    <FaArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/courses">
                                <Button size="lg" variant="outline" className="text-base px-7 py-5 rounded-full border-2 hover:bg-white/50 flex items-center gap-2">
                                    <FaGraduationCap className="h-4 w-4 text-primary" />
                                    Explore Courses
                                </Button>
                            </Link>
                        </div>

                        {/* Floating Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative hidden lg:block animate-in slide-in-from-right duration-700 delay-200">
                        <div className="relative z-10 grid grid-cols-2 gap-6">
                            <GlassCard className="mt-12 animate-float delay-700">
                                <FaBuildingColumns className="h-10 w-10 text-primary mb-4" />
                                <div className="text-4xl font-bold">50+</div>
                                <div className="text-sm text-muted-foreground">Partner Universities</div>
                            </GlassCard>
                            <GlassCard className="animate-float delay-1000">
                                <FaUsers className="h-10 w-10 text-secondary mb-4" />
                                <div className="text-4xl font-bold">50K+</div>
                                <div className="text-sm text-muted-foreground">Students Helped</div>
                            </GlassCard>
                            <GlassCard className="col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-full shadow-lg text-primary">
                                        <FaGlobe className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">Global Reach</div>
                                        <div className="text-sm text-muted-foreground">Connecting you to world-class education</div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Decorative blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-[80px] -z-10" />
                    </div>
                </div>
            </section>

            {/* Featured Universities Showcase Section */}
            {featuredUnis.length > 0 && (
                <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-black/5 pb-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                Featured Partner Institutions
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                Partner Universities Available on Our Platform
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Representing accredited institutions across the UK, USA, Malaysia, and worldwide
                            </p>
                        </div>
                        <Link href="/universities">
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold px-5 h-10 flex items-center gap-2 shadow-sm">
                                View All 50+ Universities
                                <FaArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredUnis.map((uni: any) => {
                            const isCopied = copiedUniId === (uni._id || uni.id);
                            const uniTargetUrl = `/universities/${encodeURIComponent(uni._id || uni.id)}`;
                            const shareUrl =
                                typeof window !== 'undefined'
                                    ? `${window.location.origin}${uniTargetUrl}`
                                    : '';
                            const shareText = generateUniversityShareText(uni, shareUrl);
                            const waHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

                            return (
                                <Link
                                    key={uni._id || uni.id}
                                    href={uniTargetUrl}
                                    className="block group"
                                >
                                    <GlassCard className="p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-white/60 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer h-full">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <UniversityInitialsBadge name={uni.name} />
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                                                        {uni.country || 'Global'}
                                                    </span>
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                                        <FaCircleCheck className="h-2.5 w-2.5 text-emerald-500" />
                                                        Verified Partner
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 flex items-center justify-between">
                                                    <span>{uni.name}</span>
                                                    <FaArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                                    <FaLocationDot className="h-3 w-3 text-rose-500 flex-shrink-0" />
                                                    {uni.location || uni.country}
                                                </p>
                                            </div>

                                            {uni.description && (
                                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                    {uni.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold h-9"
                                                >
                                                    View Details
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleCopyUniversity(e, uni);
                                                    }}
                                                    className={`text-xs font-bold rounded-xl h-9 px-3 flex items-center gap-1.5 ${
                                                        isCopied
                                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                            : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                    title="Copy details for WhatsApp"
                                                >
                                                    {isCopied ? (
                                                        <FaCheck className="h-3.5 w-3.5 text-emerald-600" />
                                                    ) : (
                                                        <FaCopy className="h-3.5 w-3.5 text-slate-500" />
                                                    )}
                                                    {isCopied ? 'Copied' : 'Copy'}
                                                </Button>

                                                <a
                                                    href={waHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Share on WhatsApp"
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl h-9 px-3 flex items-center justify-center"
                                                    >
                                                        <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold">Why Choose GlobalPathwayHub?</h2>
                    <p className="text-xl text-muted-foreground">
                        We provide comprehensive support for your higher education journey with a personalized approach.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <GlassCard
                            key={index}
                            className={`p-8 space-y-4 group cursor-pointer hover:bg-white/80 ${index % 2 === 0 ? 'lg:translate-y-8' : ''}`}
                        >
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <div className="text-primary">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="space-y-16 py-10">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">Your Journey Starts Here</h2>
                    <p className="text-xl text-muted-foreground">
                        4 simple steps to your dream university
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 -translate-y-1/2 hidden lg:block" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative group">
                                <GlassCard className="p-8 space-y-4 relative z-10 h-full hover:border-primary/50">
                                    <div className="text-6xl font-black text-primary/10 absolute top-4 right-4 group-hover:text-primary/20 transition-colors">
                                        {step.number}
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold pt-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </GlassCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* University Categories */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">Explore Categories</h2>
                    <p className="text-xl text-muted-foreground">
                        Find the institution that fits your needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <GlassCard className="p-10 space-y-8 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-colors" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-secondary/20 rounded-2xl text-secondary">
                                    <FaBuildingColumns className="h-8 w-8" />
                                </div>
                                <h3 className="text-3xl font-bold">Public Universities</h3>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-lg">
                                    <FaCircleCheck className="h-5 w-5 text-secondary flex-shrink-0" />
                                    <span>Affordable tuition fees & government grants</span>
                                </li>
                                <li className="flex items-center gap-3 text-lg">
                                    <FaCircleCheck className="h-5 w-5 text-secondary flex-shrink-0" />
                                    <span>World-class faculty & research infrastructure</span>
                                </li>
                                <li className="flex items-center gap-3 text-lg">
                                    <FaCircleCheck className="h-5 w-5 text-secondary flex-shrink-0" />
                                    <span>Global alumni network</span>
                                </li>
                            </ul>

                            <Link href="/universities">
                                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-14 text-lg rounded-xl shadow-lg shadow-secondary/20">
                                    View Public Universities
                                </Button>
                            </Link>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-10 space-y-8 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-primary/20 rounded-2xl text-primary">
                                    <FaGlobe className="h-8 w-8" />
                                </div>
                                <h3 className="text-3xl font-bold">Private Universities</h3>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-lg">
                                    <FaCircleCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>Flexible degree tracks & rolling intakes</span>
                                </li>
                                <li className="flex items-center gap-3 text-lg">
                                    <FaCircleCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>International partnerships & dual degree options</span>
                                </li>
                                <li className="flex items-center gap-3 text-lg">
                                    <FaCircleCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>Modern state-of-the-art campus facilities</span>
                                </li>
                            </ul>

                            <Link href="/universities">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg rounded-xl shadow-lg shadow-primary/20">
                                    View Private Universities
                                </Button>
                            </Link>
                        </div>
                    </GlassCard>
                </div>
            </section>

            {/* Leadership & Executive Team */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                        Executive Leadership
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Meet Our Leadership
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Experienced directors committed to empowering students with verified global higher education pathways.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TEAM_LIST.map((member) => (
                        <GlassCard
                            key={member.slug}
                            className={`p-6 space-y-5 bg-white/80 backdrop-blur-xl border ${member.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl group flex flex-col justify-between`}
                        >
                            <div className="space-y-4">
                                <Link href={`/profile/${member.slug}`} className="block relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/5] shadow-inner cursor-pointer">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900 shadow-md">
                                            {member.role}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <span className="text-xs text-white/90 font-medium">
                                            {member.badge}
                                        </span>
                                    </div>
                                </Link>

                                <div>
                                    <Link href={`/profile/${member.slug}`}>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {member.name}
                                        </h3>
                                    </Link>
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-0.5">
                                        {member.fullRole}
                                    </p>
                                </div>

                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                                    {member.headline}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                <Link href={`/profile/${member.slug}`} className="w-full">
                                    <Button
                                        variant="outline"
                                        className="w-full border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold h-10 shadow-xs flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <span>View Profile Details</span>
                                        <FaArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative">
                <GlassCard className="p-16 text-center space-y-8 overflow-hidden relative border-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
                    <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to Start Your Journey?</h2>
                        <p className="text-xl md:text-2xl text-muted-foreground">
                            Join thousands of students who have found their perfect university through GlobalPathwayHub
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                            <Link href="/universities">
                                <Button size="lg" className="text-xl px-12 py-8 rounded-full h-auto bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30">
                                    Explore Universities Now
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="text-xl px-12 py-8 rounded-full h-auto border-2">
                                    Get Free Consultation
                                </Button>
                            </Link>
                        </div>
                    </div>
                </GlassCard>
            </section>
        </div>
    );
};

export default Home;
