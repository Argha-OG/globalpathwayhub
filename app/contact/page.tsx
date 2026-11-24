'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    FaEnvelope,
    FaPhone,
    FaLocationDot,
    FaGlobe,
    FaPaperPlane,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter,
    FaCircleCheck,
    FaWhatsapp,
    FaArrowRight,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { TEAM_LIST } from '@/lib/team';
import JsonLd from '@/components/JsonLd';
import { getFaqSchema, getBreadcrumbSchema } from '@/lib/seo';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const toastId = toast.loading('Sending inquiry...');

        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.name,
                    email: formData.email,
                    phone: formData.phone || 'Web Form',
                    leadSource: 'website_inquiry',
                    priority: 'medium',
                    notes: `Subject: ${formData.subject}\n\nMessage: ${formData.message}`,
                }),
            });

            toast.success('Inquiry sent. Expect a reply within 24 hours.', { id: toastId });
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            }, 4000);
        } catch {
            toast.error('Send failed. Please message us on WhatsApp.', { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const contactInfo = [
        {
            icon: <FaEnvelope className="h-5 w-5" />,
            title: 'Email',
            details: ['support@globalpathwayhub.com'],
        },
        {
            icon: <FaPhone className="h-5 w-5" />,
            title: 'Call & WhatsApp',
            details: [
                'Abu Siam Khan (Founder & CEO): +880 1410-555054',
                'Argha Biswas (CTO): +880 1999-389199',
                'Shahriar Hassan (Head of Marketing): +60 17-536 0551',
            ],
        },
        {
            icon: <FaLocationDot className="h-5 w-5" />,
            title: 'Head Office',
            details: [
                '6-A, Jass Nibash, Section-10, Block-B',
                'Road Avenue-1, Plot-5, Mirpur-10, Dhaka - 1216',
            ],
        },
        {
            icon: <FaGlobe className="h-5 w-5" />,
            title: 'Portal',
            details: ['globalpathwayhub.com'],
        },
    ];

    const faqs = [
        { question: 'How do I apply?', answer: 'Pick a university, open its page, and submit your application form.' },
        { question: 'Is counseling free?', answer: 'Yes. Student advisory and shortlisting are 100% free.' },
        { question: 'Do you assist with scholarships?', answer: 'Yes, we handle merit award and fee waiver requests.' },
        { question: 'How long do offers take?', answer: 'Usually 1 to 4 weeks depending on the university.' },
    ];

    const faqSchema = getFaqSchema(faqs);
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Contact Us', url: '/contact' },
    ]);

    return (
        <div className="space-y-12 pb-20 container mx-auto px-4 pt-24 max-w-6xl text-black">
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />

            {/* Clean Concise Header */}
            <div className="text-center space-y-2 max-w-xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight gradient-title">Contact Us</h1>
                <p className="text-sm sm:text-base text-black/75">
                    Reach our Dhaka office or message a director directly.
                </p>
            </div>

            {/* 4 Contact Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {contactInfo.map((info, index) => (
                    <GlassCard key={index} className="p-5 space-y-3 bg-white border border-[#144272]/20 hover:border-[#3FC1C9] rounded-lg transition-all">
                        <div className="text-[#144272]">{info.icon}</div>
                        <h3 className="font-black text-sm uppercase tracking-wider text-[#144272]">{info.title}</h3>
                        <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                                <p key={idx} className="text-black/75 text-xs font-medium">{detail}</p>
                            ))}
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Direct Leadership Contacts */}
            <div className="space-y-5">
                <h2 className="text-2xl sm:text-3xl font-black text-[#144272] tracking-tight">
                    Leadership Contacts
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TEAM_LIST.map((member) => (
                        <GlassCard
                            key={member.slug}
                            className="p-5 space-y-4 bg-white border border-[#144272]/20 hover:border-[#3FC1C9] transition-all rounded-lg group flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <Link href={`/profile/${member.slug}`} className="block relative overflow-hidden rounded-lg bg-[#F5F5F5] aspect-[4/4] border border-[#144272]/15">
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
                                    <p className="text-xs font-bold text-[#3FC1C9] uppercase">{member.fullRole}</p>
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="text-xs font-mono text-black/75 hover:text-[#3FC1C9] flex items-center gap-1.5 mt-1"
                                    >
                                        <FaEnvelope className="h-3 w-3 text-[#144272]" />
                                        <span>{member.email}</span>
                                    </a>
                                    <a
                                        href={`https://api.whatsapp.com/send?phone=${member.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-mono font-bold text-[#144272] hover:text-[#3FC1C9] flex items-center gap-1.5 mt-0.5"
                                    >
                                        <FaWhatsapp className="h-3.5 w-3.5 text-[#3FC1C9]" />
                                        <span>{member.phone}</span>
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-[#144272]/10">
                                <div className="grid grid-cols-2 gap-2">
                                    <a
                                        href={`https://api.whatsapp.com/send?phone=${member.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            type="button"
                                            className="w-full bg-[#3FC1C9] hover:bg-[#34b0b8] text-[#144272] rounded-lg text-xs font-bold h-9 gap-1.5"
                                        >
                                            <FaWhatsapp className="h-3.5 w-3.5" />
                                            WhatsApp
                                        </Button>
                                    </a>
                                    <a href={`mailto:${member.email}`}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-[#144272]/25 hover:bg-[#F5F5F5] rounded-lg text-xs font-bold h-9 gap-1.5 text-[#144272]"
                                        >
                                            <FaEnvelope className="h-3.5 w-3.5" />
                                            Email
                                        </Button>
                                    </a>
                                </div>

                                <Link href={`/profile/${member.slug}`} className="block">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-[#144272]/25 text-[#144272] bg-[#F5F5F5] hover:bg-[#144272] hover:text-white rounded-lg text-xs font-bold h-9 gap-1.5"
                                    >
                                        <span>View Profile</span>
                                        <FaArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Office Location & Interactive Google Map */}
            <GlassCard className="p-6 sm:p-8 bg-white border border-[#144272]/20 rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="space-y-1.5">
                            <h2 className="text-xl font-black text-[#144272]">Head Office</h2>
                            <p className="text-xs sm:text-sm text-black/80 leading-relaxed font-medium">
                                6-A, Jass Nibash, Section-10, Block-B, Road Avenue-1, Plot-5, Mirpur-10, Mirpur, Dhaka - 1216.
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-[#144272]/10 text-xs">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-black/50 block font-mono">
                                    Hours
                                </span>
                                <span className="font-semibold text-black">
                                    Sat — Thu: 10:00 AM — 6:30 PM (BST)
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-black/50 block font-mono">
                                    Direct WhatsApp Support
                                </span>
                                <div className="space-y-1.5 pt-1">
                                    <a
                                        href="https://api.whatsapp.com/send?phone=8801410555054"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#144272] hover:text-[#3FC1C9] font-bold flex items-center gap-1.5"
                                    >
                                        <FaWhatsapp className="h-3.5 w-3.5 text-[#3FC1C9]" />
                                        <span>Abu Siam Khan (Founder &amp; CEO): +880 1410-555054</span>
                                    </a>
                                    <a
                                        href="https://api.whatsapp.com/send?phone=8801999389199"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#144272] hover:text-[#3FC1C9] font-bold flex items-center gap-1.5"
                                    >
                                        <FaWhatsapp className="h-3.5 w-3.5 text-[#3FC1C9]" />
                                        <span>Argha Biswas (CTO): +880 1999-389199</span>
                                    </a>
                                    <a
                                        href="https://api.whatsapp.com/send?phone=60175360551"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#144272] hover:text-[#3FC1C9] font-bold flex items-center gap-1.5"
                                    >
                                        <FaWhatsapp className="h-3.5 w-3.5 text-[#3FC1C9]" />
                                        <span>Shahriar Hassan (Head of Marketing): +60 17-536 0551</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="pt-1 flex flex-wrap gap-2">
                            <a
                                href="https://maps.google.com/?q=23.809391,90.368409"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[130px]"
                            >
                                <Button
                                    type="button"
                                    className="w-full bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] rounded-lg text-xs font-bold h-9 gap-1.5 uppercase tracking-wider"
                                >
                                    <FaLocationDot className="h-3.5 w-3.5" />
                                    Directions
                                </Button>
                            </a>
                            <a
                                href="https://api.whatsapp.com/send?phone=8801410555054"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[130px]"
                            >
                                <Button
                                    type="button"
                                    className="w-full bg-[#3FC1C9] text-[#144272] hover:bg-[#34b0b8] rounded-lg text-xs font-bold h-9 gap-1.5 uppercase tracking-wider"
                                >
                                    <FaWhatsapp className="h-3.5 w-3.5" />
                                    CEO Desk
                                </Button>
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-2 w-full h-[360px] sm:h-[420px] rounded-lg overflow-hidden border border-[#144272]/20 bg-[#F5F5F5]">
                        <iframe
                            src="https://maps.google.com/maps?q=23.809391,90.368409+(GlobalPathwayHub+-+Jass+Nibash)&t=&z=18&ie=UTF8&iwloc=B&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="GlobalPathwayHub Head Office Location Map"
                            className="w-full h-full rounded-lg"
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Form + Quick FAQ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6 sm:p-8 space-y-5 bg-white border border-[#144272]/20 rounded-lg">
                    <h2 className="text-xl font-black text-[#144272]">Send a Message</h2>
                    {submitted ? (
                        <div className="text-center py-8 space-y-3">
                            <FaCircleCheck className="w-10 h-10 text-[#3FC1C9] mx-auto" />
                            <p className="text-base font-bold text-[#144272]">Received. We will reply within 24 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            <Input required name="name" value={formData.name} onChange={handleChange} placeholder="Full Name *" className="bg-[#F5F5F5] border-[#144272]/20 rounded-lg" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className="bg-[#F5F5F5] border-[#144272]/20 rounded-lg" />
                                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone / WhatsApp" className="bg-[#F5F5F5] border-[#144272]/20 rounded-lg" />
                            </div>
                            <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="Target Country or Subject" className="bg-[#F5F5F5] border-[#144272]/20 rounded-lg" />
                            <textarea required rows={3} name="message" value={formData.message} onChange={handleChange} placeholder="Your message or academic background *" className="w-full px-3 py-2 rounded-lg border border-[#144272]/20 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                            <Button type="submit" disabled={submitting} className="w-full bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] font-bold rounded-lg h-10 gap-2">
                                <FaPaperPlane className="w-3.5 h-3.5" />
                                {submitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    )}
                </GlassCard>

                <div className="space-y-6">
                    <GlassCard className="p-6 space-y-4 bg-white border border-[#144272]/20 rounded-lg">
                        <h2 className="text-xl font-black text-[#144272]">Quick Answers</h2>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="pb-3 border-b border-[#144272]/10 last:border-0 last:pb-0">
                                    <h3 className="font-bold text-[#144272] text-sm">{faq.question}</h3>
                                    <p className="text-black/70 text-xs mt-0.5">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 bg-white border border-[#144272]/20 rounded-lg flex items-center justify-between">
                        <span className="font-bold text-sm text-[#144272]">Follow Us</span>
                        <div className="flex gap-2">
                            <a href="https://www.facebook.com/GlobalPathwayHub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#F5F5F5] border border-[#144272]/20 text-[#144272] hover:bg-[#3FC1C9] flex items-center justify-center" aria-label="Facebook">
                                <FaFacebookF className="h-4 w-4" />
                            </a>
                            <a href="https://www.instagram.com/globalpathwayhub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#F5F5F5] border border-[#144272]/20 text-[#144272] hover:bg-[#3FC1C9] flex items-center justify-center" aria-label="Instagram">
                                <FaInstagram className="h-4 w-4" />
                            </a>
                            <a href="https://x.com/GlobalPathwayHub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#F5F5F5] border border-[#144272]/20 text-[#144272] hover:bg-[#3FC1C9] flex items-center justify-center" aria-label="X">
                                <FaXTwitter className="h-4 w-4" />
                            </a>
                            <a href="https://www.linkedin.com/company/GlobalPathwayHub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#F5F5F5] border border-[#144272]/20 text-[#144272] hover:bg-[#3FC1C9] flex items-center justify-center" aria-label="LinkedIn">
                                <FaLinkedinIn className="h-4 w-4" />
                            </a>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Contact;


