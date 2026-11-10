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
    FaCircleQuestion,
    FaWhatsapp,
    FaArrowRight,
    FaUserTie,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { TEAM_LIST } from '@/lib/team';
import JsonLd from '@/components/JsonLd';
import { getFaqSchema, getBreadcrumbSchema } from '@/lib/seo';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const toastId = toast.loading('Sending your message to our counseling team...');

        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.name,
                    email: formData.email,
                    phone: formData.phone || 'Web Form (No phone provided)',
                    leadSource: 'website_inquiry',
                    priority: 'medium',
                    notes: `Subject: ${formData.subject}\n\nMessage: ${formData.message}`,
                }),
            });

            toast.success('Message received! Our team will get back to you within 24 hours.', { id: toastId });
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            }, 4000);
        } catch {
            toast.error('Failed to send message. Please contact us via WhatsApp or email directly.', { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const contactInfo = [
        { icon: <FaEnvelope className="h-6 w-6" />, title: 'Email Us', details: ['support@globalpathwayhub.com'] },
        { icon: <FaPhone className="h-6 w-6" />, title: 'Call Us', details: ['+880 1410-555054'] },
        { icon: <FaLocationDot className="h-6 w-6" />, title: 'Visit Us', details: ['Dhaka, Bangladesh'] },
        { icon: <FaGlobe className="h-6 w-6" />, title: 'Website', details: ['globalpathwayhub.com'] }
    ];

    const faqs = [
        { question: 'How do I apply to a university?', answer: 'Browse our universities page, select your preferred institution, and click \'Apply Now\'. We\'ll guide you through the application process.' },
        { question: 'Is your consultation service free?', answer: 'Yes! We offer free initial consultation to help you choose the right university and program.' },
        { question: 'Can you help with scholarship applications?', answer: 'Absolutely! We provide information about available scholarships and assist with the application process.' },
        { question: 'How long does the application process take?', answer: 'The timeline varies by university, but typically takes 2-4 weeks from application submission to admission decision.' }
    ];

    const faqSchema = getFaqSchema(faqs);
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Contact Us', url: '/contact' },
    ]);

    return (
        <div className="space-y-16 pb-20 container mx-auto px-4 pt-24">
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />

            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Get In Touch</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Have questions? We're here to help you find the perfect university</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((info, index) => (
                    <GlassCard key={index} className="p-6 space-y-4 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/20 group cursor-pointer">
                        <div className="text-primary group-hover:scale-110 transition-transform">{info.icon}</div>
                        <h3 className="font-bold text-lg">{info.title}</h3>
                        <div className="space-y-1">{info.details.map((detail, idx) => <p key={idx} className="text-muted-foreground text-sm">{detail}</p>)}</div>
                    </GlassCard>
                ))}
            </div>

            {/* Direct Leadership Contacts */}
            <div className="space-y-8">
                <div className="text-center space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                        Executive Directory
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Direct Leadership &amp; Department Contacts
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
                        Need executive guidance, university partnership discussions, or technical support? Connect directly with our leadership team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {TEAM_LIST.map((member) => (
                        <GlassCard
                            key={member.slug}
                            className={`p-6 space-y-5 bg-white/80 backdrop-blur-xl border ${member.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl group flex flex-col justify-between`}
                        >
                            <div className="space-y-4">
                                {/* Photo */}
                                <Link href={`/profile/${member.slug}`} className="block relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/5] shadow-inner cursor-pointer">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-900 shadow-md">
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
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {member.name}
                                        </h3>
                                    </Link>
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-0.5">
                                        {member.fullRole}
                                    </p>
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 mt-1.5 transition-colors"
                                    >
                                        <FaEnvelope className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                        <span className="font-mono">{member.email}</span>
                                    </a>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                                        <FaLocationDot className="h-3 w-3 text-rose-500 flex-shrink-0" />
                                        {member.location}
                                    </p>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                                    {member.headline}
                                </p>
                            </div>

                            {/* Direct Connect Buttons */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-2">
                                    <a
                                        href={`https://api.whatsapp.com/send?phone=${member.whatsapp}&text=${encodeURIComponent(
                                            `Hello ${member.name}, I am contacting you from the GlobalPathwayHub website.`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button
                                            type="button"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-9 shadow-xs gap-1.5 flex items-center justify-center"
                                        >
                                            <FaWhatsapp className="h-3.5 w-3.5" />
                                            WhatsApp
                                        </Button>
                                    </a>

                                    <a href={`mailto:${member.email}`} className="w-full">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold h-9 gap-1.5 text-slate-700 flex items-center justify-center"
                                        >
                                            <FaEnvelope className="h-3.5 w-3.5 text-blue-600" />
                                            Email
                                        </Button>
                                    </a>
                                </div>

                                <Link href={`/profile/${member.slug}`} className="block">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold h-9 shadow-xs flex items-center justify-center gap-1.5 transition-all"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-8 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Send Us a Message</h2>
                        <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours</p>
                    </div>
                    {submitted ? (
                        <div className="text-center py-8 space-y-3">
                            <div className="flex justify-center">
                                <FaCircleCheck className="w-12 h-12 text-emerald-500 animate-in zoom-in" />
                            </div>
                            <p className="text-lg font-semibold text-emerald-500">Message sent! We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Name *</label>
                                <Input required name="name" value={formData.name} onChange={handleChange} placeholder="Tanvir Ahmed" className="bg-white/50" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address *</label>
                                    <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tanvir@example.com" className="bg-white/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+880 1700-000000" className="bg-white/50" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject</label>
                                <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="Inquiry about UK Master's Programs" className="bg-white/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Message *</label>
                                <textarea required rows={4} name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your educational background and target universities..." className="w-full px-3 py-2 rounded-xl border border-input bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold flex items-center justify-center gap-2">
                                <FaPaperPlane className="w-4 h-4" />
                                {submitting ? 'Transmitting...' : 'Send Message'}
                            </Button>
                        </form>
                    )}
                </GlassCard>

                {/* FAQ & Socials */}
                <div className="space-y-6">
                    <GlassCard className="p-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <FaCircleQuestion className="w-5 h-5 text-primary" />
                            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="space-y-1 pb-4 border-b border-black/5 last:border-0 last:pb-0">
                                    <h4 className="font-semibold text-foreground text-sm">{faq.question}</h4>
                                    <p className="text-muted-foreground text-xs leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="font-bold text-sm text-foreground mb-3">Connect on Social Channels</h3>
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/GlobalPathwayHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-sm"
                                aria-label="Facebook"
                            >
                                <FaFacebookF className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.instagram.com/globalpathwayhub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-600 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://x.com/GlobalPathwayHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-sm"
                                aria-label="X (formerly Twitter)"
                            >
                                <FaXTwitter className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/GlobalPathwayHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-sm"
                                aria-label="LinkedIn"
                            >
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
