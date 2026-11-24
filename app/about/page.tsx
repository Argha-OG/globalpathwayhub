import React from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import {
    FaEnvelope,
    FaArrowRight,
    FaWhatsapp,
} from 'react-icons/fa6';
import { TEAM_LIST } from '@/lib/team';
import JsonLd from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo';
import CountryFlag from '@/components/CountryFlag';
import { DESTINATIONS } from '@/lib/destinations';

const About = () => {
    const achievements = [
        { number: '10+', label: 'Years Experience' },
        { number: '50K+', label: 'Students Guided' },
        { number: '50+', label: 'Partner Universities' },
        { number: '98.4%', label: 'Visa Approval' },
    ];

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About Us', url: '/about' },
    ]);

    return (
        <div className="space-y-12 pb-20 container mx-auto px-4 pt-24 max-w-6xl text-black">
            <JsonLd data={breadcrumbSchema} />

            {/* Clean Concise Header */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight gradient-title">
                    About GlobalPathwayHub
                </h1>
                <p className="text-sm sm:text-base text-black/75">
                    Direct university admissions and visa guidance across Malaysia, Canada, Australia, the UK, and France.
                </p>
            </div>

            {/* Key Numbers Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((item, i) => (
                    <div
                        key={i}
                        className="bg-white border border-[#144272]/20 rounded-lg p-6 text-center"
                    >
                        <div className="text-3xl sm:text-4xl font-black text-[#144272]">{item.number}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#3FC1C9] mt-1">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Where We Operate */}
            <GlassCard className="p-6 sm:p-8 space-y-5 bg-white border border-[#144272]/20 rounded-lg">
                <h2 className="text-2xl font-black text-[#144272]">Where We Operate</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {DESTINATIONS.map((dest) => (
                        <Link
                            key={dest.name}
                            href={`/universities?country=${encodeURIComponent(dest.name)}`}
                            className="p-3.5 rounded-lg bg-[#F5F5F5] border border-[#144272]/15 hover:border-[#3FC1C9] transition-all flex flex-col gap-1.5 group"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <CountryFlag country={dest.name} size="md" />
                                    <span className="font-black text-sm text-[#144272] group-hover:text-[#3FC1C9] transition-colors">
                                        {dest.name}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FFD749] text-[#144272]">
                                    {dest.code}
                                </span>
                            </div>
                            <span className="text-xs font-bold text-[#144272]">{dest.postStudyWork}</span>
                        </Link>
                    ))}
                </div>
            </GlassCard>

            {/* Executive Leadership Team */}
            <div className="space-y-5">
                <h2 className="text-2xl sm:text-3xl font-black text-[#144272] tracking-tight">
                    Leadership Team
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TEAM_LIST.map((member) => (
                        <GlassCard
                            key={member.slug}
                            className="p-5 space-y-4 bg-white border border-[#144272]/20 hover:border-[#3FC1C9] transition-all rounded-lg group flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <Link
                                    href={`/profile/${member.slug}`}
                                    className="block relative overflow-hidden rounded-lg bg-[#F5F5F5] aspect-[4/4] border border-[#144272]/15"
                                >
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-[#144272] text-[#FFD749]">
                                        {member.role}
                                    </span>
                                </Link>

                                <div>
                                    <Link href={`/profile/${member.slug}`}>
                                        <h3 className="text-lg font-black text-[#144272] group-hover:text-[#3FC1C9] transition-colors">
                                            {member.name}
                                        </h3>
                                    </Link>
                                    <p className="text-xs font-bold text-[#3FC1C9] uppercase tracking-wider">
                                        {member.fullRole}
                                    </p>
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="text-xs font-mono text-black/75 hover:text-[#3FC1C9] inline-flex items-center gap-1.5 mt-1"
                                    >
                                        <FaEnvelope className="h-3 w-3 text-[#144272]" />
                                        <span>{member.email}</span>
                                    </a>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-[#144272]/10 flex items-center gap-2">
                                <a
                                    href={`https://api.whatsapp.com/send?phone=${member.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1"
                                >
                                    <Button
                                        type="button"
                                        className="w-full bg-[#3FC1C9] hover:bg-[#34b0b8] text-[#144272] rounded-lg text-xs font-bold h-9 gap-1.5"
                                    >
                                        <FaWhatsapp className="h-3.5 w-3.5" />
                                        WhatsApp
                                    </Button>
                                </a>
                                <Link href={`/profile/${member.slug}`} className="flex-1">
                                    <Button
                                        variant="outline"
                                        className="w-full border-[#144272]/30 text-[#144272] bg-[#F5F5F5] hover:bg-[#144272] hover:text-white rounded-lg text-xs font-bold h-9 gap-1.5"
                                    >
                                        <span>Profile</span>
                                        <FaArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Consolidated Core Services */}
            <GlassCard className="p-6 sm:p-8 space-y-5 bg-white border border-[#144272]/20 rounded-lg">
                <h2 className="text-2xl font-black text-[#144272]">Core Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: 'University Matching', desc: 'Shortlist accredited universities by grade and budget.' },
                        { title: 'Free Admissions', desc: 'Zero agency service charges on partner applications.' },
                        { title: 'Scholarships', desc: 'Merit bursaries and fee concession negotiation.' },
                        { title: 'Document Auditing', desc: 'SOP, CV, and transcript compliance review.' },
                        { title: 'Visa Filing', desc: 'Solvency checks, CAS/I-20/PAL & mock interviews.' },
                        { title: 'Pre-Departure', desc: 'Housing guidance, banking & survival prep.' },
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-lg bg-[#F5F5F5] border border-[#144272]/15 space-y-1">
                            <h3 className="font-black text-sm text-[#144272]">{item.title}</h3>
                            <p className="text-xs text-black/70">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default About;

