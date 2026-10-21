'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaBars, FaXmark, FaHouse, FaBuildingColumns, FaCircleInfo, FaPhone, FaCalendarCheck } from 'react-icons/fa6';

const navLinks = [
    { name: 'Home', path: '/', icon: FaHouse },
    { name: 'Universities', path: '/universities', icon: FaBuildingColumns },
    { name: 'About', path: '/about', icon: FaCircleInfo },
    { name: 'Contact', path: '/contact', icon: FaPhone },
];

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const [pageTitle, setPageTitle] = useState('Global Pathway Hub');

    useEffect(() => {
        const path = pathname || '/';
        if (path === '/') {
            setPageTitle('Global Pathway Hub');
        } else if (path.startsWith('/universities')) {
            setPageTitle('Universities');
        } else if (path.startsWith('/about')) {
            setPageTitle('About Us');
        } else if (path.startsWith('/contact')) {
            setPageTitle('Contact Us');
        } else if (path.startsWith('/login')) {
            setPageTitle('Login');
        } else if (path.startsWith('/register')) {
            setPageTitle('Register');
        } else if (path.startsWith('/apply')) {
            setPageTitle('Apply Now');
        } else if (path.startsWith('/admin')) {
            setPageTitle('Admin Portal');
        } else {
            setPageTitle('Global Pathway Hub');
        }
    }, [pathname]);

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-full shadow-lg px-6 py-3 w-full max-w-6xl flex justify-between items-center transition-all duration-300 hover:shadow-xl hover:bg-white/80">
                <div className="flex justify-between items-center w-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group flex-shrink-0 mr-8">
                        <img
                            src="/globalpathwayhub-logo.png"
                            alt="GlobalPathwayHub Logo"
                            className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                            style={{ background: 'transparent' }}
                        />
                        <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
                            {pageTitle}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1 bg-black/5 rounded-full p-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
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

                    {/* Desktop Action CTA */}
                    <div className="hidden lg:flex items-center gap-3 ml-8">
                        <Link href="/contact">
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all font-medium flex items-center gap-2">
                                <FaCalendarCheck className="w-3.5 h-3.5" />
                                Free Consultation
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-full hover:bg-black/5 transition-colors text-foreground"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <FaXmark className="h-5 w-5" />
                        ) : (
                            <FaBars className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-4 p-4 mx-4 bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl animate-in slide-in-from-top-2">
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
                            <div className="flex flex-col gap-3 pt-4 border-t border-black/5 mt-2">
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
