import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/globalpathwayhub.png';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="GlobalPathwayHub Logo"
                                className="h-16 w-auto object-contain"
                            />
                            <span className="font-bold text-xl text-foreground">
                                Global Pathway Hub
                            </span>
                        </div>
                        <p className="text-muted-foreground">
                            Your trusted partner in global education journey. We help you find the best universities and courses worldwide.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/universities" className="text-muted-foreground hover:text-primary transition-colors">Universities</Link></li>
                            <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link to="/support?tab=faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link to="/support?tab=privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/support?tab=terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://instagram.com/globalpathwayhub" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} GlobalPathwayHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
