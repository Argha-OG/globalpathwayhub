import React from 'react';
import Link from 'next/link';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter,
    FaArrowRight,
    FaLocationDot,
    FaWhatsapp,
    FaPhone,
} from 'react-icons/fa6';
import CountryFlag from '@/components/CountryFlag';
import { DESTINATIONS } from '@/lib/destinations';

const Footer = () => {
    return (
        <footer className="bg-[#144272] text-[#F5F5F5] border-t border-[#3FC1C9]/20 pt-16 pb-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo-mark.png"
                                alt="GlobalPathwayHub Logo"
                                width={48}
                                height={48}
                                decoding="async"
                                className="h-12 w-12 object-contain"
                            />
                            <span className="font-extrabold text-lg text-white tracking-tight">
                                Global{' '}<span className="text-[#3FC1C9]">Pathway</span>{' '}Hub
                            </span>
                        </div>
                        <p className="text-[#F5F5F5]/80 text-xs leading-relaxed max-w-sm">
                            Direct university admissions and student visa advisory.
                        </p>
                        <div className="pt-2 text-xs text-[#F5F5F5] space-y-1.5 border-t border-[#3FC1C9]/20">
                            <div className="flex items-start gap-2">
                                <FaLocationDot className="h-3.5 w-3.5 text-[#FFD749] flex-shrink-0 mt-0.5" />
                                <span className="text-[11px] leading-relaxed text-[#F5F5F5]/90">
                                    6-A, Jass Nibash, Section-10, Block-B, Road Avenue-1, Plot-5, Mirpur-10, Mirpur, Dhaka - 1216
                                </span>
                            </div>
                        </div>

                        {/* Active Destination Flags */}
                        <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD749] block mb-2">
                                Active Destinations
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {DESTINATIONS.map((dest) => (
                                    <Link
                                        key={dest.name}
                                        href={`/universities?country=${encodeURIComponent(dest.name)}`}
                                        title={`Study in ${dest.name}`}
                                        className="inline-flex items-center gap-1 px-1.5 py-1 rounded-lg bg-white/10 border border-[#3FC1C9]/30 hover:border-[#FFD749] transition-colors text-[10px] font-bold text-white"
                                    >
                                        <CountryFlag country={dest.name} size="xs" />
                                        <span>{dest.code}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#FFD749] mb-4">Quick Links</h3>
                        <ul className="space-y-2.5 text-xs font-medium">
                            <li>
                                <Link href="/universities" className="text-[#F5F5F5]/80 hover:text-[#3FC1C9] transition-colors flex items-center gap-1.5 group">
                                    <FaArrowRight className="h-2.5 w-2.5 text-[#3FC1C9] group-hover:translate-x-0.5 transition-transform" />
                                    Universities Directory
                                </Link>
                            </li>
                            <li>
                                <Link href="/courses" className="text-[#F5F5F5]/80 hover:text-[#3FC1C9] transition-colors flex items-center gap-1.5 group">
                                    <FaArrowRight className="h-2.5 w-2.5 text-[#3FC1C9] group-hover:translate-x-0.5 transition-transform" />
                                    Accredited Programs
                                </Link>
                            </li>
                            <li>
                                <Link href="/guide" className="text-[#F5F5F5]/80 hover:text-[#3FC1C9] transition-colors flex items-center gap-1.5 group">
                                    <FaArrowRight className="h-2.5 w-2.5 text-[#3FC1C9] group-hover:translate-x-0.5 transition-transform" />
                                    Student Survival Guide
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-[#F5F5F5]/80 hover:text-[#3FC1C9] transition-colors flex items-center gap-1.5 group">
                                    <FaArrowRight className="h-2.5 w-2.5 text-[#3FC1C9] group-hover:translate-x-0.5 transition-transform" />
                                    About Our Advisory
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-[#F5F5F5]/80 hover:text-[#3FC1C9] transition-colors flex items-center gap-1.5 group">
                                    <FaArrowRight className="h-2.5 w-2.5 text-[#3FC1C9] group-hover:translate-x-0.5 transition-transform" />
                                    Contact Admissions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#FFD749] mb-4">Admissions & Support</h3>
                        <ul className="space-y-2.5 text-xs font-medium">
                            <li><Link href="/support?tab=faq" className="text-[#F5F5F5]/80 hover:text-[#3FC1C9] transition-colors">Admissions FAQ</Link></li>
                            <li><Link href="/support?tab=privacy" className="text-[#F5F5F5]/80 hover:text-[#3FC1C9] transition-colors">Privacy Governance</Link></li>
                            <li><Link href="/support?tab=terms" className="text-[#F5F5F5]/80 hover:text-[#3FC1C9] transition-colors">Terms of Representation</Link></li>
                            <li>
                                <a href="mailto:support@globalpathwayhub.com" className="text-[#3FC1C9] font-bold hover:underline">
                                    support@globalpathwayhub.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#FFD749] mb-4">Connect With Advisory</h3>
                        <div className="flex gap-2">
                            <a
                                href="https://www.facebook.com/GlobalPathwayHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/10 border border-[#3FC1C9]/30 text-[#F5F5F5] hover:bg-[#3FC1C9] hover:text-[#144272] transition-all flex items-center justify-center shadow-2xs"
                                aria-label="Facebook"
                            >
                                <FaFacebookF className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://www.instagram.com/globalpathwayhub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/10 border border-[#3FC1C9]/30 text-[#F5F5F5] hover:bg-[#3FC1C9] hover:text-[#144272] transition-all flex items-center justify-center shadow-2xs"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://x.com/GlobalPathwayHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/10 border border-[#3FC1C9]/30 text-[#F5F5F5] hover:bg-[#3FC1C9] hover:text-[#144272] transition-all flex items-center justify-center shadow-2xs"
                                aria-label="X (formerly Twitter)"
                            >
                                <FaXTwitter className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/GlobalPathwayHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/10 border border-[#3FC1C9]/30 text-[#F5F5F5] hover:bg-[#3FC1C9] hover:text-[#144272] transition-all flex items-center justify-center shadow-2xs"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedinIn className="h-3.5 w-3.5" />
                            </a>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#3FC1C9]/20 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD749] block">
                                Direct WhatsApp Lines
                            </span>
                            <a
                                href="https://api.whatsapp.com/send?phone=8801410555054"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#3FC1C9] hover:text-[#FFD749] transition-colors flex items-center gap-1.5 font-medium text-[11px]"
                            >
                                <FaWhatsapp className="h-3.5 w-3.5 text-[#3FC1C9] flex-shrink-0" />
                                <span>Abu Siam Khan (Founder &amp; CEO): +880 1410-555054</span>
                            </a>
                            <a
                                href="https://api.whatsapp.com/send?phone=8801999389199"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#3FC1C9] hover:text-[#FFD749] transition-colors flex items-center gap-1.5 font-medium text-[11px]"
                            >
                                <FaWhatsapp className="h-3.5 w-3.5 text-[#3FC1C9] flex-shrink-0" />
                                <span>Argha Biswas (CTO): +880 1999-389199</span>
                            </a>
                            <a
                                href="https://api.whatsapp.com/send?phone=60175360551"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#3FC1C9] hover:text-[#FFD749] transition-colors flex items-center gap-1.5 font-medium text-[11px]"
                            >
                                <FaWhatsapp className="h-3.5 w-3.5 text-[#3FC1C9] flex-shrink-0" />
                                <span>Shahriar Hassan (Head of Marketing): +60 17-536 0551</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#3FC1C9]/20 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#F5F5F5]/70 gap-4">
                    <p>&copy; {new Date().getFullYear()} Global Pathway Hub Education Advisory Ltd. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80">
                        <Link href="/about" className="hover:text-[#3FC1C9] transition-colors">
                            About Us
                        </Link>
                        <span className="text-[#3FC1C9]/40">|</span>
                        <Link href="/contact" className="hover:text-[#3FC1C9] transition-colors">
                            Contact
                        </Link>
                        <span className="text-[#3FC1C9]/40">|</span>
                        <Link href="/support" className="hover:text-[#3FC1C9] transition-colors">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
