'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import toast from 'react-hot-toast';
import {
    Activity,
    Users,
    Globe,
    Share2,
    Eye,
    TrendingUp,
    Compass,
    Smartphone,
    Monitor,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnalyticsManagementPage() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/visitors').then((r) => r.json());
            if (res.success) {
                setAnalytics(res.stats);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to refresh visitor analytics');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        const toastId = toast.loading('Refreshing real-time analytics...');
        await loadAnalytics();
        toast.success('Analytics synchronized', { id: toastId });
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    const totalHits = analytics?.totalHits || 0;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <Activity className="w-7 h-7 text-primary" />
                        Visitor & Marketing Attribution Analytics
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Track campaign ROI across Meta Facebook ads, Google search, device types, and conversion funnel velocity.
                    </p>
                </div>

                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs gap-1.5 shadow-sm rounded-xl font-medium"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Analytics
                </Button>
            </div>

            {/* Top Traffic Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Web Impressions</span>
                        <Eye className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-3xl font-black text-slate-900">{totalHits}</div>
                    <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> All page views recorded
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Unique Prospective Students</span>
                        <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-black text-emerald-600">
                        {analytics?.uniqueVisitors || 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Deduped unique IP device signatures</div>
                </div>

                <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Last 24 Hours Activity</span>
                        <Activity className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-3xl font-black text-amber-600">
                        {analytics?.last24hVisitors || 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Active prospective student sessions</div>
                </div>
            </div>

            {/* Funnel Conversion Architecture */}
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Full-Funnel Student Conversion Velocity
                    </h2>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Enterprise Grade Funnel
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
                        <div className="text-xs text-slate-500 font-medium">1. Web Traffic</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-1">{totalHits}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Impressions</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
                        <div className="text-xs text-slate-500 font-medium">2. Leads Captured</div>
                        <div className="text-xl font-extrabold text-amber-600 mt-1">12</div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">High Intent</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
                        <div className="text-xs text-slate-500 font-medium">3. In Counseling</div>
                        <div className="text-xl font-extrabold text-primary mt-1">8</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Branch Sessions</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
                        <div className="text-xs text-slate-500 font-medium">4. Student Files</div>
                        <div className="text-xl font-extrabold text-purple-600 mt-1">5</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Dossiers Open</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 col-span-2 sm:col-span-1">
                        <div className="text-xs text-slate-500 font-medium">5. Visas Approved</div>
                        <div className="text-xl font-extrabold text-emerald-600 mt-1">100%</div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Visa Stamp Rate</div>
                    </div>
                </div>
            </div>

            {/* Attribution Breakdown: Channels & Popular Pages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Traffic Acquisition Channels */}
                <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-primary" />
                        <h2 className="font-bold text-sm text-slate-900">Acquisition Channels (UTM)</h2>
                    </div>

                    <div className="space-y-3">
                        {analytics?.bySource && analytics.bySource.length > 0 ? (
                            analytics.bySource.map((src) => {
                                const pct = totalHits > 0 ? Math.round((Number(src.count) / totalHits) * 100) : 0;
                                return (
                                    <div key={src.source} className="space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-medium text-slate-700 capitalize">{src.source}</span>
                                            <span className="font-semibold text-slate-900">
                                                {src.count} visits <span className="text-slate-400 text-[10px]">({pct}%)</span>
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full"
                                                style={{ width: `${Math.max(pct, 5)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-6 text-xs text-slate-400">No channel data recorded yet.</div>
                        )}
                    </div>
                </div>

                {/* Most Visited Destinations */}
                <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-amber-500" />
                        <h2 className="font-bold text-sm text-slate-900">Most Visited Landing Routes</h2>
                    </div>

                    <div className="space-y-3">
                        {analytics?.byPath && analytics.byPath.length > 0 ? (
                            analytics.byPath.map((item) => {
                                const pct = totalHits > 0 ? Math.round((Number(item.count) / totalHits) * 100) : 0;
                                return (
                                    <div key={item.path} className="space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-mono text-slate-700">{item.path}</span>
                                            <span className="font-semibold text-slate-900">
                                                {item.count} views <span className="text-slate-400 text-[10px]">({pct}%)</span>
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                                                style={{ width: `${Math.max(pct, 5)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-6 text-xs text-slate-400">No route views recorded yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
