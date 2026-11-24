'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JsonLd from '@/components/JsonLd';
import { getFaqSchema, getBreadcrumbSchema } from '@/lib/seo';

const faqs = [
    { question: 'How do I apply?', answer: 'Open any university page and submit the application form.' },
    { question: 'Is counseling really free?', answer: 'Yes. Consultation and university shortlisting are 100% free.' },
    { question: 'What documents are required?', answer: 'Academic transcripts, passport copy, photo, and IELTS/PTE score.' },
    { question: 'How fast are offer letters?', answer: 'Typically 1 to 4 weeks depending on the university.' },
    { question: 'Do you support scholarships?', answer: 'Yes, we negotiate merit bursaries and regional waivers.' },
    { question: 'Are there any hidden fees?', answer: 'None from us—only official university fees if applicable.' },
];

function SupportContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('faq');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['faq', 'privacy', 'terms'].includes(tab)) setActiveTab(tab);
    }, [searchParams]);

    const faqSchema = getFaqSchema(faqs);
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Support Center', url: '/support' },
    ]);

    return (
        <div className="space-y-8 pb-20 container mx-auto px-4 pt-24 max-w-5xl text-black">
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />

            <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#144272]">Support &amp; Policies</h1>
                <div className="inline-flex items-center gap-2 bg-[#FFD749] border border-[#144272]/20 px-4 py-1.5 rounded-lg text-xs font-bold">
                    <span>Helpdesk:</span>
                    <a href="mailto:support@globalpathwayhub.com" className="underline text-[#144272]">support@globalpathwayhub.com</a>
                </div>
            </div>

            <GlassCard className="p-6 sm:p-8 bg-white border border-[#144272]/20 rounded-lg shadow-xs">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-[#F5F5F5] p-1 rounded-lg mb-6 border border-[#144272]/15">
                        <TabsTrigger value="faq" className="data-[state=active]:bg-[#144272] data-[state=active]:text-[#FFD749] rounded-lg text-xs font-bold text-black/70">
                            FAQ
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="data-[state=active]:bg-[#3FC1C9] data-[state=active]:text-[#144272] rounded-lg text-xs font-bold text-black/70">
                            Privacy Policy
                        </TabsTrigger>
                        <TabsTrigger value="terms" className="data-[state=active]:bg-[#144272] data-[state=active]:text-[#FFD749] rounded-lg text-xs font-bold text-black/70">
                            Terms
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="faq" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="p-4 bg-[#F5F5F5] border border-[#144272]/15 rounded-lg space-y-1">
                                <h2 className="text-sm font-black text-[#144272]">{faq.question}</h2>
                                <p className="text-black/75 text-xs leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="privacy" className="space-y-3 text-black/80 text-xs sm:text-sm">
                        {[
                            { title: '1. Data Collected', body: 'Contact info, educational records, and documents submitted for university applications.' },
                            { title: '2. Usage & Sharing', body: 'Used strictly to process admissions with partner universities. Never sold to third parties.' },
                            { title: '3. Security & Rights', body: 'Protected in encrypted storage. Request updates or deletion anytime via support@globalpathwayhub.com.' },
                        ].map((section, i) => (
                            <div key={i} className="p-4 rounded-lg bg-[#F5F5F5] border border-[#144272]/15 space-y-1">
                                <h3 className="text-sm font-black text-[#144272]">{section.title}</h3>
                                <p>{section.body}</p>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="terms" className="space-y-3 text-black/80 text-xs sm:text-sm">
                        {[
                            { title: '1. Advisory Scope', body: 'We assist with university shortlisting, applications, and visa guidance; admission decisions rest with institutions.' },
                            { title: '2. Applicant Accuracy', body: 'Applicants must supply genuine transcripts, financial records, and valid test scores.' },
                            { title: '3. Service Changes', body: 'Partner programs, deadlines, and policies may update without prior notice.' },
                        ].map((section, i) => (
                            <div key={i} className="p-4 rounded-lg bg-[#F5F5F5] border border-[#144272]/15 space-y-1">
                                <h3 className="text-sm font-black text-[#144272]">{section.title}</h3>
                                <p>{section.body}</p>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </GlassCard>
        </div>
    );
}

export default function Support() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 pt-24 text-center text-sm font-bold text-[#144272]">Loading...</div>}>
            <SupportContent />
        </Suspense>
    );
}
