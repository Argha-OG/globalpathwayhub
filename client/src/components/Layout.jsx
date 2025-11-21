import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MouseTracker from './MouseTracker';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground relative overflow-x-hidden">
            <MouseTracker />
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
