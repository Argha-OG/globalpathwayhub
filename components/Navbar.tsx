'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaBars, FaXmark, FaHouse, FaBuildingColumns, FaGraduationCap, FaCircleInfo, FaPhone, FaCalendarCheck } from 'react-icons/fa6';
import CurrencyConverterNav from '@/components/CurrencyConverterNav';

const navLinks = [
    { name: 'Home', path: '/', icon: FaHouse },
    { name: 'Universities', path: '/universities', icon: FaBuildingColumns },
    { name: 'Courses', path: '/courses', icon: FaGraduationCap },
    { name: 'About', path: '/about', icon: FaCircleInfo },
    { name: 'Contact', path: '/contact', icon: FaPhone },
];

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <div className="bg-white/75 backdrop-blur-xl border border-white/40 rounded-full shadow-lg px-4 sm:px-6 py-2.5 sm:py-3 w-full max-w-6xl flex items-center justify-between gap-2 transition-all duration-300 hover:shadow-xl hover:bg-white/85 overflow-hidden">
                <div className="flex items-center justify-between w-full min-w-0 gap-2">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                        <img
                            src="/globalpathwayhub-logo.png"
                            alt="GlobalPathwayHub Logo"
                            className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                            style={{ background: 'transparent' }}
                        />
                        <span className="font-bold text-base sm:text-lg tracking-tight text-foreground hidden md:block whitespace-nowrap">
                            GlobalPathwayHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-black/5 rounded-full p-1 flex-shrink-0">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={`px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                                        isActive
                                            ? 'bg-white text-primary shadow-xs font-semibold'
                                            : 'text-foreground/80 hover:text-primary hover:bg-white'
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5 opacity-70" />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Action Area: Currency Converter + Consultation */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Live Currency Converter (hidden on mobile) */}
                        <div className="hidden sm:block">
                            <CurrencyConverterNav />
                        </div>

                        <Link href="/contact" className="hidden lg:block flex-shrink-0">
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-2 h-8 shadow-md hover:shadow-lg transition-all text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                                <FaCalendarCheck className="w-3 h-3" />
                                Free Consultation
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-1.5 lg:hidden flex-shrink-0">
                        <div className="sm:hidden">
                            <CurrencyConverterNav />
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-full hover:bg-black/5 transition-colors text-foreground"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <FaXmark className="h-5 w-5" />
                            ) : (
                                <FaBars className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 p-4 mx-4 bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl animate-in slide-in-from-top-2">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className={`px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-3 ${
                                            isActive
                                                ? 'bg-primary/10 text-primary font-semibold'
                                                : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Icon className="w-4 h-4 text-primary" />
                                        {link.name}
                                    </Link>
                                );
                            })}

                            <div className="pt-2 border-t border-black/5">
                                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg flex items-center justify-center gap-2">
                                        <FaCalendarCheck className="w-4 h-4" />
                                        Book Free Consultation
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
