'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import AreaGraphChart from '@/components/admin/AreaGraphChart';
import StorageDatabaseMetrics from '@/components/admin/StorageDatabaseMetrics';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    GraduationCap,
    Target,
    Users,
    Activity,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    Flame,
    FileText,
    Receipt,
    RefreshCw,
    Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async (showToast = false) => {
        let toastId;
        if (showToast) {
            toastId = toast.loading('Syncing real-time enterprise metrics...');
        }
        try {
            setLoading(true);
            const res = await fetch('/api/dashboard/stats');
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
                if (showToast) {
                    toast.success('Dashboard metrics updated live!', { id: toastId });
                }
            } else if (showToast) {
                toast.error('Failed to sync metrics', { id: toastId });
            }
        } catch (err) {
            console.error('Failed to load stats:', err);
            if (showToast) {
                toast.error('Connection error', { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats(false);
    }, []);

    const fUSD = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const fBDT = (n) => `৳${Math.round(Number(n || 0) * 122).toLocaleString()}`; // Approx 1 USD = 122 BDT

    return (
        <AdminLayout>
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/80">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                            Executive Operations Center
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live
                        </span>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        High-altitude business intelligence, financial health, student pipelines, and marketing performance.
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        onClick={() => fetchStats(true)}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs gap-1.5 shadow-sm"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Sync Live Data
                    </Button>
                    <Link href="/admin/leads" className="flex-1 sm:flex-none">
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white text-xs gap-1.5 shadow-md shadow-primary/25 font-semibold">
                            <Plus className="w-3.5 h-3.5" />
                            New Lead
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Top Financial Health KPIs with Client-Side Color Combination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gross Revenue */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-blue-50/40 border border-blue-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100/80 border border-blue-200 text-primary flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/60 border border-blue-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Cash Inflow
                        </span>
                    </div>
                    <div className="text-slate-500 text-xs font-semibold">Total Gross Revenue</div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                        {fUSD(stats?.financials?.grossRevenue)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>Approx {fBDT(stats?.financials?.grossRevenue)}</span>
                        <span className="text-primary font-semibold">Tuition Cleared</span>
                    </div>
                </div>

                {/* Total Operating & Marketing Cost */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-rose-50/40 border border-rose-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-100/80 border border-rose-200 text-rose-600 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-100/60 border border-rose-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            Outflow
                        </span>
                    </div>
                    <div className="text-slate-500 text-xs font-semibold">Total Expenses & Cost</div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                        {fUSD(stats?.financials?.totalExpenses)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>Marketing: {fUSD(stats?.financials?.marketingSpend)}</span>
                        <span className="text-slate-600 font-medium">Rent: {fUSD(stats?.financials?.officeSpend)}</span>
                    </div>
                </div>

                {/* Net Operating Margin */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-amber-50/40 border border-amber-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-200 text-amber-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-md">
                            {stats?.financials?.profitMargin || 0}% Margin
                        </span>
                    </div>
                    <div className="text-slate-500 text-xs font-semibold">Net Operating Profit</div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-1 tracking-tight">
                        {fUSD(stats?.financials?.netOperatingProfit)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>Gross Inflows - All Costs</span>
                        <span className="text-emerald-700 font-semibold">Positive ROI</span>
                    </div>
                </div>

                {/* Agent Commissions Payouts */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-indigo-50/40 border border-indigo-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100/80 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100/60 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                            {stats?.agents?.active || 0} Counselors
                        </span>
                    </div>
                    <div className="text-slate-500 text-xs font-semibold">Agent Commissions Accrued</div>
                    <div className="text-2xl sm:text-3xl font-black text-indigo-900 mt-1 tracking-tight">
                        {fUSD(stats?.financials?.agentCommissions)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>Milestone Payouts</span>
                        <span className="text-indigo-600 font-semibold">Automated Split</span>
                    </div>
                </div>
            </div>

            {/* Operational Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-medium">Student Dossiers</div>
                        <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {stats?.students?.total || 0}
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                {stats?.students?.visasApproved || 0} Visas
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-medium">Total Leads Pipeline</div>
                        <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {stats?.leads?.total || 0}
                            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5" /> {stats?.leads?.hotLeads || 0} Hot
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-medium">Website Footprint</div>
                        <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {stats?.visitors?.total || 0}
                            <span className="text-[10px] text-slate-500 font-normal">
                                ({stats?.visitors?.unique || 0} Unique)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-medium">Offers & CAS Lodged</div>
                        <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {(stats?.students?.offersReceived || 0) + (stats?.students?.visasApproved || 0)}
                            <span className="text-[10px] text-emerald-700 font-semibold">85% Conversion</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AREA GRAPH WITH DYNAMIC FILTER FUNCTIONS */}
            <AreaGraphChart />

            {/* CLOUD OBJECT STORAGE & DATABASE INFRASTRUCTURE LIMITS & CURRENT USAGE */}
            <StorageDatabaseMetrics stats={stats} loading={loading} onRefresh={() => fetchStats(true)} />

            {/* Quick Action Dock */}
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Quick Action Shortcuts:
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/students">
                        <Button size="sm" variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 gap-1.5 shadow-sm">
                            <GraduationCap className="w-3.5 h-3.5 text-primary" />
                            + New Student File
                        </Button>
                    </Link>
                    <Link href="/admin/leads">
                        <Button size="sm" variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 gap-1.5 shadow-sm">
                            <Target className="w-3.5 h-3.5 text-amber-500" />
                            + Capture Lead
                        </Button>
                    </Link>
                    <Link href="/admin/finance/costs">
                        <Button size="sm" variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 gap-1.5 shadow-sm">
                            <Receipt className="w-3.5 h-3.5 text-rose-500" />
                            + Record Cost / Expense
                        </Button>
                    </Link>
                    <Link href="/admin/finance/revenue">
                        <Button size="sm" variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 gap-1.5 shadow-sm">
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            + New Revenue Invoice
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Two Column Layout: Recent Leads & Expense Allocation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hot & Recent Leads */}
                <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-amber-500" />
                            <h2 className="font-bold text-sm text-slate-900">Active Lead Inquiries</h2>
                        </div>
                        <Link href="/admin/leads" className="text-xs text-primary hover:underline font-semibold">
                            View All Pipeline →
                        </Link>
                    </div>

                    <div className="space-y-2.5">
                        {stats?.recentLeads && stats.recentLeads.length > 0 ? (
                            stats.recentLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
                                >
                                    <div className="min-w-0">
                                        <div className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                                            {lead.full_name}
                                            {lead.priority === 'high' && (
                                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-semibold border border-rose-200 flex items-center gap-0.5">
                                                    <Flame className="w-2.5 h-2.5" /> Hot
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                            {lead.phone} • {lead.preferred_country || 'Abroad'} • {lead.preferred_degree || 'Higher Ed'}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 capitalize shadow-sm">
                                            {lead.status.replace(/_/g, ' ')}
                                        </span>
                                        <div className="text-[10px] text-slate-500 mt-1 font-mono">Est. {fUSD(lead.estimated_commission)}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-xs text-slate-400">No leads recorded yet.</div>
                        )}
                    </div>
                </div>

                {/* Expense Breakdown by Category */}
                <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-rose-500" />
                            <h2 className="font-bold text-sm text-slate-900">Expense Allocation</h2>
                        </div>
                        <Link href="/admin/finance/costs" className="text-xs text-primary hover:underline font-semibold">
                            Full Ledger →
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {stats?.expenseByCategory && stats.expenseByCategory.length > 0 ? (
                            stats.expenseByCategory.map((cat) => {
                                const totalExp = stats.financials.totalExpenses || 1;
                                const pct = Math.round((Number(cat.total) / totalExp) * 100);
                                return (
                                    <div key={cat.category} className="space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-medium text-slate-700 capitalize">
                                                {cat.category.replace(/_/g, ' ')}
                                            </span>
                                            <span className="font-semibold text-slate-900 font-mono">
                                                {fUSD(cat.total)} <span className="text-slate-400 text-[10px]">({pct}%)</span>
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                                            <div
                                                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-primary rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(pct, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-6 text-xs text-slate-400">No expenses recorded yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
