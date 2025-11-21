import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { HelpCircle, Shield, FileText } from 'lucide-react';

const Support = () => {
    useDocumentTitle('Support');
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('faq');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['faq', 'privacy', 'terms'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const faqs = [
        {
            question: "How do I apply to a university?",
            answer: "Browse our Universities page, select your preferred institution, and click on 'Apply Now'. You'll be guided through the application process with step-by-step instructions."
        },
        {
            question: "Is the consultation service really free?",
            answer: "Yes! Our basic consultation services are completely free. We believe every student deserves access to quality educational guidance."
        },
        {
            question: "What documents do I need for university applications?",
            answer: "Typically, you'll need academic transcripts, identification documents, passport-sized photos, and proof of English proficiency (if applicable). Specific requirements vary by university and program."
        },
        {
            question: "How long does the application process take?",
            answer: "The application process usually takes 2-4 weeks, depending on the university and program. We'll keep you updated throughout the entire process."
        },
        {
            question: "Can international students apply through GlobalPathwayHub?",
            answer: "Yes! We assist both local and international students in finding and applying to Malaysian universities."
        },
        {
            question: "Do you provide scholarship information?",
            answer: "Absolutely! We maintain up-to-date information on scholarships, financial aid, and grants available at various universities."
        },
        {
            question: "What if I'm unsure about which program to choose?",
            answer: "That's what we're here for! Contact our counselors for personalized guidance based on your interests, strengths, and career goals."
        },
        {
            question: "Are there any hidden fees?",
            answer: "No hidden fees from GlobalPathwayHub. Our services are free. You'll only pay the application fees required by the universities themselves."
        }
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Support Center
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Find answers to your questions and learn more about our policies
                </p>
            </div>

            {/* Tabs Section */}
            <GlassCard className="p-6 sm:p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-8">
                        <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm sm:text-base">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            FAQ
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="data-[state=active]:bg-secondary data-[state=active]:text-white text-sm sm:text-base">
                            <Shield className="h-4 w-4 mr-2" />
                            Privacy Policy
                        </TabsTrigger>
                        <TabsTrigger value="terms" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm sm:text-base">
                            <FileText className="h-4 w-4 mr-2" />
                            Terms of Service
                        </TabsTrigger>
                    </TabsList>

                    {/* FAQ Tab */}
                    <TabsContent value="faq" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground">
                                Find quick answers to common questions about our services
                            </p>
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

                    {/* Privacy Policy Tab */}
                    <TabsContent value="privacy" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold">Privacy Policy</h2>
                            <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
                        </div>
                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">1. Information We Collect</h3>
                                <p>
                                    We collect information you provide directly to us, including name, email address, phone number,
                                    educational background, and any other information you choose to provide when using our services.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h3>
                                <p>We use the information we collect to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Process your university applications</li>
                                    <li>Send you updates about your applications and relevant educational opportunities</li>
                                    <li>Respond to your comments, questions, and requests</li>
                                    <li>Communicate with you about services, offers, and events</li>
                                </ul>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">3. Information Sharing</h3>
                                <p>
                                    We share your information with universities you apply to and trusted partners who assist us in
                                    operating our platform. We do not sell your personal information to third parties.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">4. Data Security</h3>
                                <p>
                                    We implement appropriate security measures to protect your personal information. However, no
                                    method of transmission over the Internet is 100% secure.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">5. Your Rights</h3>
                                <p>
                                    You have the right to access, update, or delete your personal information at any time.
                                    Contact us at privacy@globalpathwayhub.com for any privacy-related requests.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">6. Cookies</h3>
                                <p>
                                    We use cookies and similar tracking technologies to track activity on our platform and hold
                                    certain information to improve your user experience.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">7. Changes to This Policy</h3>
                                <p>
                                    We may update our Privacy Policy from time to time. We will notify you of any changes by
                                    posting the new Privacy Policy on this page.
                                </p>
                            </section>
                        </div>
                    </TabsContent>

                    {/* Terms of Service Tab */}
                    <TabsContent value="terms" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold">Terms of Service</h2>
                            <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
                        </div>
                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h3>
                                <p>
                                    By accessing and using GlobalPathwayHub's services, you accept and agree to be bound by the terms
                                    and provisions of this agreement.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">2. Use of Services</h3>
                                <p>Our services are intended to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide information about Malaysian universities and programs</li>
                                    <li>Assist with university application processes</li>
                                    <li>Offer educational counseling and guidance</li>
                                    <li>Connect students with educational opportunities</li>
                                </ul>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">3. User Responsibilities</h3>
                                <p>You agree to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide accurate and truthful information</li>
                                    <li>Maintain the confidentiality of your account</li>
                                    <li>Use our services only for lawful purposes</li>
                                    <li>Not misrepresent your qualifications or credentials</li>
                                </ul>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">4. Intellectual Property</h3>
                                <p>
                                    All content on GlobalPathwayHub, including text, graphics, logos, and software, is the property of
                                    GlobalPathwayHub or its content suppliers and is protected by intellectual property laws.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h3>
                                <p>
                                    GlobalPathwayHub provides information and assistance but does not guarantee university admission.
                                    We are not liable for any decisions made by universities regarding applications.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">6. Service Modifications</h3>
                                <p>
                                    We reserve the right to modify or discontinue our services at any time without prior notice.
                                    We shall not be liable to you or any third party for any modification or discontinuation.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">7. Termination</h3>
                                <p>
                                    We may terminate or suspend your access to our services immediately, without prior notice,
                                    for any breach of these Terms of Service.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">8. Governing Law</h3>
                                <p>
                                    These Terms shall be governed by and construed in accordance with the laws of Malaysia,
                                    without regard to its conflict of law provisions.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">9. Contact Us</h3>
                                <p>
                                    If you have any questions about these Terms, please contact us at legal@globalpathwayhub.com
                                </p>
                            </section>
                        </div>
                    </TabsContent>
                </Tabs>
            </GlassCard>
        </div>
    );
};

export default Support;
