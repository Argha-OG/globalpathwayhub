'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaShieldHalved, FaUserCheck, FaArrowLeft, FaLock, FaEnvelope } from 'react-icons/fa6';
import toast from 'react-hot-toast';

export default function AdminLoginCard({ onLoginSuccess }: { onLoginSuccess?: (user: any) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const toastId = toast.loading('Verifying portal credentials...');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Welcome back, ${data.user.name}!`, { id: toastId });
                localStorage.setItem('gph_token', data.token);
                localStorage.setItem('admin_user', JSON.stringify(data.user));
                localStorage.setItem('user', JSON.stringify(data.user));
                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                } else {
                    router.push('/admin');
                }
            } else {
                toast.error(data.message || 'Invalid credentials', { id: toastId });
                setError(data.message || 'Invalid email or password');
            }
        } catch {
            toast.error('Network error. Please try again.', { id: toastId });
            setError('Something went wrong. Please check connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (role) => {
        if (role === 'admin') {
            setEmail('admin@globalpathwayhub.com');
            setPassword('Admin@GPH2026!');
            toast.success('Super Admin credentials loaded');
        } else {
            setEmail('tanvir@globalpathwayhub.com');
            setPassword('Agent@GPH2026!');
            toast.success('Partner Agent credentials loaded');
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-[90vh] px-4 py-12"
            style={{
                backgroundImage: `
                    radial-gradient(at 0% 0%, hsla(221, 83%, 53%, 0.15) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, hsla(48, 96%, 53%, 0.15) 0px, transparent 50%),
                    radial-gradient(at 100% 100%, hsla(221, 83%, 53%, 0.15) 0px, transparent 50%),
                    radial-gradient(at 0% 100%, hsla(48, 96%, 53%, 0.15) 0px, transparent 50%)
                `,
            }}
        >
            <GlassCard className="w-full max-w-md space-y-6 p-8 shadow-2xl border-white/60 bg-white/85 backdrop-blur-2xl rounded-3xl">
                <div className="text-center space-y-2">
                    <img src="/globalpathwayhub-logo.png" alt="Logo" className="h-16 w-auto mx-auto mb-2 drop-shadow-md" />
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                        <FaLock className="w-3 h-3" />
                        Admin & Agent Management Portal
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Sign In</h1>
                    <p className="text-slate-500 text-xs">
                        Restricted to authorized administrators, education counselors, and partner agents.
                    </p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-xs text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                            <FaEnvelope className="w-3 h-3 text-slate-400" />
                            Work Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="counselor@globalpathwayhub.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/90 border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password" className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                                <FaLock className="w-3 h-3 text-slate-400" />
                                Password
                            </Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/90 border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-primary/20"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 font-semibold h-11 text-sm" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Enter Admin Portal'}
                    </Button>
                </form>

                {/* Quick 1-Click Demo Logins for Developers & Owners */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] text-slate-500 text-center font-medium">Quick 1-Click Access for Testing:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => fillDemo('admin')}
                            className="text-xs p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 text-left transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <FaShieldHalved className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-slate-900 text-[11px]">Super Admin</div>
                                <div className="text-[10px] text-amber-800">Executive Access</div>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemo('agent')}
                            className="text-xs p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200/80 text-left transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <FaUserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-slate-900 text-[11px]">Partner Agent</div>
                                <div className="text-[10px] text-blue-800">Counselor Access</div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-500 pt-1">
                    <Link href="/" className="hover:text-primary transition-colors flex items-center justify-center gap-1.5 font-medium">
                        <FaArrowLeft className="w-3 h-3" />
                        Return to Public Website
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}
