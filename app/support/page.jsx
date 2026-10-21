'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaCircleQuestion, FaShieldHalved, FaFileContract } from 'react-icons/fa6';

const faqs = [
    { question: 'How do I apply to a university?', answer: "Browse our Universities page, select your preferred institution, and click on 'Apply Now'. You'll be guided through the application process with step-by-step instructions." },
    { question: 'Is the consultation service really free?', answer: 'Yes! Our basic consultation services are completely free. We believe every student deserves access to quality educational guidance.' },
    { question: 'What documents do I need for university applications?', answer: "Typically, you'll need academic transcripts, identification documents, passport-sized photos, and proof of English proficiency (if applicable). Specific requirements vary by university and program." },
    { question: 'How long does the application process take?', answer: "The application process usually takes 2-4 weeks, depending on the university and program. We'll keep you updated throughout the entire process." },
    { question: 'Can international students apply through GlobalPathwayHub?', answer: 'Yes! We assist both local and international students in finding and applying to universities.' },
    { question: 'Do you provide scholarship information?', answer: 'Absolutely! We maintain up-to-date information on scholarships, financial aid, and grants available at various universities.' },
    { question: "What if I'm unsure about which program to choose?", answer: "That's what we're here for! Contact our counselors for personalized guidance based on your interests, strengths, and career goals." },
    { question: 'Are there any hidden fees?', answer: "No hidden fees from GlobalPathwayHub. Our services are free. You'll only pay the application fees required by the universities themselves." }
];

function SupportContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('faq');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['faq', 'privacy', 'terms'].includes(tab)) setActiveTab(tab);
    }, [searchParams]);

    return (
        <div className="space-y-8 pb-20 container mx-auto px-4 pt-24">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Support Center</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Find answers to your questions and learn more about our policies</p>
            </div>

            <GlassCard className="p-6 sm:p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-8">
                        <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm sm:text-base flex items-center justify-center gap-2">
                            <FaCircleQuestion className="h-4 w-4" />FAQ
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="data-[state=active]:bg-secondary data-[state=active]:text-white text-sm sm:text-base flex items-center justify-center gap-2">
                            <FaShieldHalved className="h-4 w-4" />Privacy Policy
                        </TabsTrigger>
                        <TabsTrigger value="terms" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm sm:text-base flex items-center justify-center gap-2">
                            <FaFileContract className="h-4 w-4" />Terms of Service
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="faq" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground">Find quick answers to common questions about our services</p>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <GlassCard key={index} className="p-6 hover:border-primary/50 transition-all">
                                    <h3 className="text-lg font-semibold mb-3 text-primary">{faq.question}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                </GlassCard>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="privacy" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold">Privacy Policy</h2>
                            <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
                        </div>
                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            {[
                                { title: '1. Information We Collect', body: 'We collect information you provide directly to us, including name, email address, phone number, educational background, and any other information you choose to provide when using our services.' },
                                { title: '2. How We Use Your Information', body: 'We use the information we collect to provide, maintain, and improve our services; process your university applications; send you updates about your applications; respond to your comments and questions; and communicate with you about services, offers, and events.' },
                                { title: '3. Information Sharing', body: 'We share your information with universities you apply to and trusted partners who assist us in operating our platform. We do not sell your personal information to third parties.' },
                                { title: '4. Data Security', body: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.' },
                                { title: '5. Your Rights', body: 'You have the right to access, update, or delete your personal information at any time. Contact us at privacy@globalpathwayhub.com for any privacy-related requests.' },
                                { title: '6. Cookies', body: 'We use cookies and similar tracking technologies to track activity on our platform and hold certain information to improve your user experience.' },
                                { title: '7. Changes to This Policy', body: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.' }
                            ].map((section, i) => (
                                <section key={i} className="space-y-3">
                                    <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                                    <p>{section.body}</p>
                                </section>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="terms" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold">Terms of Service</h2>
                            <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
                        </div>
                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            {[
                                { title: '1. Acceptance of Terms', body: "By accessing and using GlobalPathwayHub's services, you accept and agree to be bound by the terms and provisions of this agreement." },
                                { title: '2. Use of Services', body: 'Our services are intended to provide information about universities and programs, assist with university application processes, offer educational counseling and guidance, and connect students with educational opportunities.' },
                                { title: '3. User Responsibilities', body: 'You agree to provide accurate and truthful information, maintain the confidentiality of your account, use our services only for lawful purposes, and not misrepresent your qualifications or credentials.' },
                                { title: '4. Intellectual Property', body: 'All content on GlobalPathwayHub, including text, graphics, logos, and software, is the property of GlobalPathwayHub or its content suppliers and is protected by intellectual property laws.' },
                                { title: '5. Limitation of Liability', body: 'GlobalPathwayHub provides information and assistance but does not guarantee university admission. We are not liable for any decisions made by universities regarding applications.' },
                                { title: '6. Service Modifications', body: 'We reserve the right to modify or discontinue our services at any time without prior notice. We shall not be liable to you or any third party for any modification or discontinuation.' },
                                { title: '7. Termination', body: 'We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.' }
                            ].map((section, i) => (
                                <section key={i} className="space-y-3">
                                    <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                                    <p>{section.body}</p>
                                </section>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </GlassCard>
        </div>
    );
}

export default function Support() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 pt-24 text-center">Loading support center...</div>}>
            <SupportContent />
        </Suspense>
    );
}
