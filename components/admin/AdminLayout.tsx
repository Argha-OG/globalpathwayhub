'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    FaGaugeHigh,
    FaUserGraduate,
    FaBullseye,
    FaUsers,
    FaArrowTrendUp,
    FaArrowTrendDown,
    FaBuildingColumns,
    FaChartLine,
    FaArrowRightFromBracket,
    FaBars,
    FaXmark,
    FaArrowUpRightFromSquare,
    FaChevronRight,
} from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import AdminLoginCard from '@/components/admin/AdminLoginCard';
import toast from 'react-hot-toast';

const navItems = [
    { name: 'Executive Dashboard', path: '/admin', icon: FaGaugeHigh },
    { name: 'Student Dossiers', path: '/admin/students', icon: FaUserGraduate },
    { name: 'Leads Pipeline', path: '/admin/leads', icon: FaBullseye },
    { name: 'Counselors & Agents', path: '/admin/agents', icon: FaUsers },
    { name: 'Revenue & Invoicing', path: '/admin/finance/revenue', icon: FaArrowTrendUp },
    { name: 'Cost & Expense Ledger', path: '/admin/finance/costs', icon: FaArrowTrendDown },
    { name: 'Universities & Courses', path: '/admin/universities', icon: FaBuildingColumns },
    { name: 'Visitors & Analytics', path: '/admin/analytics', icon: FaChartLine },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('admin_user') || localStorage.getItem('user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('admin_user');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('admin_user');
        localStorage.removeItem('user');
        localStorage.removeItem('gph_token');
        setUser(null);
        toast.success('Signed out of management portal');
        router.push('/admin');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-500 text-sm font-medium">Loading Management Portal...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <AdminLoginCard onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
    }

    return (
        <div
            className="min-h-screen flex bg-[#f8fafc] text-slate-800 antialiased selection:bg-primary selection:text-white"
            style={{
                backgroundImage: `
                    radial-gradient(at 0% 0%, hsla(221, 83%, 53%, 0.12) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, hsla(48, 96%, 53%, 0.14) 0px, transparent 50%),
                    radial-gradient(at 100% 100%, hsla(221, 83%, 53%, 0.10) 0px, transparent 50%),
                    radial-gradient(at 0% 100%, hsla(48, 96%, 53%, 0.12) 0px, transparent 50%)
                `,
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Desktop Sidebar with Glassmorphic styling matching client side */}
            <aside className="hidden lg:flex flex-col w-72 bg-white/75 backdrop-blur-2xl border-r border-slate-200/80 shadow-sm sticky top-0 h-screen z-40">
                {/* Brand Header */}
                <div className="p-6 border-b border-slate-200/70 flex items-center justify-between bg-white/40">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <img
                            src="/globalpathwayhub-logo.png"
                            alt="Logo"
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                        <div>
                            <div className="font-bold text-base leading-tight tracking-tight text-slate-900 flex items-center gap-1.5">
                                GlobalPathway
                                <span className="text-primary font-black">Hub</span>
                            </div>
                            <div className="text-[10px] text-amber-600 font-semibold tracking-wider uppercase flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Enterprise ERP
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 pb-2">
                        Core Systems
                    </div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                    <span>{item.name}</span>
                                </div>
                                {isActive && <FaChevronRight className="w-3 h-3 text-white/80" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Actions Footer */}
                <div className="p-4 border-t border-slate-200/70 bg-white/40">
                    <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-sm">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1.5">
                                {user.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                                <span className="capitalize px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold text-[10px] border border-amber-200">
                                    {user.role || 'Staff'}
                                </span>
                                <span>• {user.branch ? user.branch.split(' ')[0] : 'Dhaka'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link href="/" target="_blank" className="flex-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs border-slate-200/90 bg-white hover:bg-slate-50 hover:text-primary text-slate-700 flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <FaArrowUpRightFromSquare className="w-3 h-3" />
                                Public Site
                            </Button>
                        </Link>
                        <Button
                            onClick={handleLogout}
                            size="sm"
                            variant="ghost"
                            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 font-medium"
                        >
                            <FaArrowRightFromBracket className="w-3 h-3" />
                            Exit
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
                <Link href="/admin" className="flex items-center gap-2">
                    <img src="/globalpathwayhub-logo.png" alt="Logo" className="h-8 w-auto" />
                    <span className="font-bold text-sm text-slate-900">GlobalPathwayHub</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
                    aria-label="Toggle Navigation Drawer"
                >
                    {mobileOpen ? <FaXmark className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md pt-16 px-4 pb-6 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-4 shadow-2xl space-y-3">
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                                            isActive
                                                ? 'bg-primary text-white font-semibold shadow-md'
                                                : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="pt-3 border-t border-slate-100 flex gap-2">
                            <Button onClick={handleLogout} variant="outline" className="w-full text-rose-600 border-rose-200 flex items-center justify-center gap-2">
                                <FaArrowRightFromBracket className="w-3.5 h-3.5" />
                                Log Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0 overflow-y-auto min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
