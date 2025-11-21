import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/globalpathwayhub.png';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState('Global Pathway Hub');

    useEffect(() => {
        const path = location.pathname;
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
        } else {
            setPageTitle('Global Pathway Hub');
        }
    }, [location]);

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-full shadow-lg px-6 py-3 w-full max-w-6xl flex justify-between items-center transition-all duration-300 hover:shadow-xl hover:bg-white/80">
                <div className="flex justify-between items-center w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group flex-shrink-0 mr-8">
                        <img
                            src={logo}
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
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'Universities', path: '/universities' },
                            { name: 'About', path: '/about' },
                            { name: 'Contact', path: '/contact' }
                        ].map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="px-5 py-2 rounded-full text-sm font-medium text-foreground/80 hover:text-primary hover:bg-white transition-all duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex items-center gap-3 ml-8">
                        <Link to="/login">
                            <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary rounded-full px-6">
                                Login
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-full hover:bg-black/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-4 p-4 mx-4 bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl animate-in slide-in-from-top-2">
                        <div className="flex flex-col space-y-2">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Universities', path: '/universities' },
                                { name: 'About', path: '/about' },
                                { name: 'Contact', path: '/contact' }
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-3 pt-4 border-t border-black/5 mt-2">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full rounded-xl border-primary/20">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg">
                                        Get Started
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
