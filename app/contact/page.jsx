'use client';

import React, { useState } from 'react';
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
    FaLinkedinIn,
    FaXTwitter,
    FaCircleCheck,
    FaCircleQuestion,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';

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
        { icon: <FaEnvelope className="h-6 w-6" />, title: 'Email Us', details: ['globalpathwayhub@gmail.com'] },
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

    return (
        <div className="space-y-16 pb-20 container mx-auto px-4 pt-24">
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
