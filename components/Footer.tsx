import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaShieldHalved } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/globalpathwayhub-logo.png"
                                alt="GlobalPathwayHub Logo"
                                className="h-16 w-auto object-contain"
                            />
                            <span className="font-bold text-xl text-foreground">
                                GlobalPathwayHub
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Your trusted partner in global education journey. We help you find the best universities and courses worldwide.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/universities" className="text-muted-foreground hover:text-primary transition-colors">Universities</Link></li>
                            <li><Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">Courses & Programs</Link></li>
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/support?tab=faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/support?tab=privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/support?tab=terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><a href="mailto:support@globalpathwayhub.com" className="text-primary font-medium hover:underline">support@globalpathwayhub.com</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/GlobalPathwayHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
                                aria-label="Facebook"
                            >
                                <FaFacebookF className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.instagram.com/globalpathwayhub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-600 hover:bg-pink-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://x.com/GlobalPathwayHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
                                aria-label="X (formerly Twitter)"
                            >
                                <FaXTwitter className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/GlobalPathwayHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedinIn className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
                    <p>&copy; {new Date().getFullYear()} GlobalPathwayHub. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/admin" className="hover:text-primary transition-colors text-xs text-muted-foreground/60 hover:text-muted-foreground flex items-center gap-1.5">
                            <FaShieldHalved className="w-3 h-3 text-emerald-500" />
                            Staff & Agent Portal
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
