'use client';

import React from 'react';
import GlassCard from '@/components/GlassCard';
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
} from 'react-icons/fa6';

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

    return (
        <div className="space-y-16 pb-20 container mx-auto px-4 pt-24">
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
