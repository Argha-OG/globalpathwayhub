'use client';

import React from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import {
    FaBullseye,
    FaEye,
    FaHeart,
    FaUsers,
    FaAward,
    FaArrowTrendUp,
    FaBuildingColumns,
    FaUserGraduate,
    FaBriefcase,
    FaUserTie,
    FaEnvelope,
    FaLinkedin,
    FaArrowRight,
} from 'react-icons/fa6';
import { TEAM_LIST } from '@/lib/team';
import JsonLd from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo';

const About = () => {
    const values = [
        {
            icon: <FaBullseye className="h-8 w-8" />,
            title: 'Our Mission',
            description: 'To empower students with comprehensive information and guidance to make informed decisions about their higher education journey.'
        },
        {
            icon: <FaEye className="h-8 w-8" />,
            title: 'Our Vision',
            description: 'To be the leading platform connecting students with top universities worldwide, fostering academic excellence and career success.'
        },
        {
            icon: <FaHeart className="h-8 w-8" />,
            title: 'Our Values',
            description: 'Integrity, excellence, student-centricity, and commitment to helping every student achieve their educational dreams.'
        }
    ];

    const achievements = [
        { number: '10+', label: 'Years of Experience' },
        { number: '50K+', label: 'Students Helped' },
        { number: '20+', label: 'Partner Universities' },
        { number: '95%', label: 'Satisfaction Rate' }
    ];

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About Us', url: '/about' },
    ]);

    return (
        <div className="space-y-16 pb-20 container mx-auto px-4 pt-24">
            <JsonLd data={breadcrumbSchema} />
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    About GlobalPathwayHub
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Your trusted partner in navigating the path to higher education
                </p>
            </div>

            <GlassCard className="p-10 space-y-6">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>Founded with a vision to simplify the university selection process, GlobalPathwayHub has been helping students discover their perfect educational path for over a decade. We understand that choosing the right university is one of the most important decisions in a student's life.</p>
                    <p>Our platform brings together comprehensive information about top universities worldwide, making it easier for students to compare programs, understand admission requirements, and make informed decisions about their future.</p>
                    <p>With partnerships across 20+ leading universities and a track record of helping over 50,000 students, we continue to evolve and improve our services to meet the changing needs of modern education seekers.</p>
                </div>
            </GlassCard>

            {/* Executive Leadership Team */}
            <div className="space-y-8">
                <div className="text-center space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                        Executive Leadership
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Meet Our Leadership Team
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
                        The visionary leadership driving GlobalPathwayHub’s mission to connect students with world-class universities and global career opportunities.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TEAM_LIST.map((member) => (
                        <GlassCard
                            key={member.slug}
                            className={`p-6 space-y-5 bg-white/80 backdrop-blur-xl border ${member.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl group flex flex-col justify-between`}
                        >
                            <div className="space-y-4">
                                {/* Member Photo Frame */}
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

                                {/* Details */}
                                <div>
                                    <Link href={`/profile/${member.slug}`}>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {member.name}
                                        </h3>
                                    </Link>
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-0.5">
                                        {member.fullRole}
                                    </p>
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="text-xs font-semibold text-slate-700 hover:text-blue-600 inline-flex items-center gap-1.5 mt-1 transition-colors"
                                    >
                                        <FaEnvelope className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                        <span className="font-mono">{member.email}</span>
                                    </a>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {values.map((value, index) => (
                    <GlassCard key={index} className="p-8 space-y-4 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/20 group cursor-pointer">
                        <div className="text-primary group-hover:scale-110 transition-transform">{value.icon}</div>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </GlassCard>
                ))}
            </div>

            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center">Our Achievements</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {achievements.map((achievement, index) => (
                        <GlassCard key={index} className="text-center p-8 hover:scale-105 transition-transform cursor-pointer">
                            <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{achievement.number}</div>
                            <div className="text-muted-foreground mt-2 font-medium">{achievement.label}</div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <GlassCard className="p-10 space-y-6">
                <h2 className="text-3xl font-bold">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { icon: <FaBuildingColumns className="h-4 w-4 text-primary" />, title: 'Comprehensive University Database', desc: 'Detailed information about 20+ top universities' },
                        { icon: <FaUsers className="h-4 w-4 text-primary" />, title: 'Expert Counseling', desc: 'Professional guidance from experienced education counselors' },
                        { icon: <FaArrowTrendUp className="h-4 w-4 text-primary" />, title: 'Program Comparison', desc: 'Easy-to-use tools to compare programs across universities' },
                        { icon: <FaAward className="h-4 w-4 text-secondary" />, title: 'Scholarship Information', desc: 'Up-to-date information on scholarships and financial aid' },
                        { icon: <FaUserGraduate className="h-4 w-4 text-secondary" />, title: 'Application Support', desc: 'Step-by-step guidance through the application process' },
                        { icon: <FaBriefcase className="h-4 w-4 text-secondary" />, title: 'Career Guidance', desc: 'Insights into career prospects for different programs' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-full mt-1">{item.icon}</div>
                            <div>
                                <h4 className="font-semibold text-lg">{item.title}</h4>
                                <p className="text-muted-foreground text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center">Why Students Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        'Unbiased, comprehensive information',
                        'Free consultation services',
                        'Partnerships with top universities',
                        'Personalized recommendations',
                        'Regular updates on programs',
                        'Success stories and testimonials'
                    ].map((reason, index) => (
                        <GlassCard key={index} className="p-6 text-center hover:border-primary/50 transition-colors">
                            <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                {index + 1}
                            </div>
                            <p className="font-semibold">{reason}</p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
