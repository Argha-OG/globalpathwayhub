'use client';

import React from 'react';
import Link from 'next/link';
import {
    FaCloudArrowUp,
    FaDatabase,
    FaServer,
    FaHardDrive,
    FaShieldHalved,
    FaCircleCheck,
    FaArrowsRotate,
    FaFileLines,
    FaLayerGroup,
    FaTable,
    FaArrowUpRightFromSquare,
} from 'react-icons/fa6';
import { SiCloudflare, SiPostgresql } from 'react-icons/si';
import { HiOutlineCircleStack, HiOutlineCloud } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';

export default function StorageDatabaseMetrics({ stats, loading = false, onRefresh }: { stats?: any; loading?: boolean; onRefresh?: () => void }) {
    const db = stats?.databaseStorage || {
        connected: true,
        usedBytes: 8839168,
        usedPretty: '8.43 MB',
        limitBytes: 536870912,
        limitPretty: '512 MB',
        usagePercent: 1.65,
        tablesCount: 11,
        totalRows: 880,
        breakdown: {
            students_count: 5,
            docs_count: 5,
            leads_count: 5,
            revenues_count: 4,
            expenses_count: 6,
            unis_count: 50,
            courses_count: 209,
            users_count: 3,
            visitors_count: 593,
        },
    };

    const r2 = stats?.objectStorage || {
        connected: true,
        bucketName: 'gph',
        objectCount: 1,
        usedBytes: 29,
        usedPretty: '29 B',
        limitBytes: 10737418240,
        limitPretty: '10 GB',
        usagePercent: 0,
    };

    // Calculate remaining capacities
    const dbRemainingBytes = Math.max(0, (db.limitBytes || 536870912) - (db.usedBytes || 0));
    const r2RemainingBytes = Math.max(0, (r2.limitBytes || 10737418240) - (r2.usedBytes || 0));

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const dbRemainingPretty = formatBytes(dbRemainingBytes);
    const r2RemainingPretty = formatBytes(r2RemainingBytes);

    // Color indicators for usage
    const getUsageColor = (pct) => {
        if (pct >= 90) return 'from-rose-500 to-red-600';
        if (pct >= 70) return 'from-amber-500 to-orange-500';
        return 'from-blue-600 via-indigo-600 to-primary';
    };

    const getR2UsageColor = (pct) => {
        if (pct >= 90) return 'from-rose-500 to-red-600';
        if (pct >= 70) return 'from-amber-500 to-orange-500';
        return 'from-sky-500 via-teal-500 to-emerald-500';
    };

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/20 border border-blue-200/80 text-primary flex items-center justify-center shadow-sm">
                        <HiOutlineCircleStack className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Cloud Infrastructure & Storage Quotas
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Sync
                            </span>
                        </h2>
                        <p className="text-xs text-slate-500">
                            Real-time monitoring of Cloudflare R2 object vault limits and Neon Serverless PostgreSQL storage consumption.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {onRefresh && (
                        <Button
                            onClick={onRefresh}
                            variant="outline"
                            size="sm"
                            className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs gap-1.5 shadow-sm ml-auto sm:ml-0"
                            disabled={loading}
                        >
                            <FaArrowsRotate className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Quotas
                        </Button>
                    )}
                </div>
            </div>

            {/* Two Column Grid: Object Storage & Database Storage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* 1. CLOUDFLARE R2 OBJECT STORAGE CARD */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white via-white to-sky-50/50 border border-sky-200/80 shadow-md hover:shadow-lg transition-all space-y-5 relative overflow-hidden">
                    {/* Top Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-sky-100/90 border border-sky-200 text-sky-600 flex items-center justify-center shadow-sm">
                                <SiCloudflare className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                                    Object Storage Vault
                                    <span className="text-[10px] font-normal lowercase text-sky-600 bg-sky-100/80 px-2 py-0.2 rounded-full border border-sky-200">
                                        s3-api
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    Cloudflare R2 Bucket ({r2.bucketName || 'gph'})
                                </h3>
                            </div>
                        </div>

                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <FaCircleCheck className="w-3 h-3 text-emerald-500" />
                            {r2.connected ? 'Operational' : 'Reconnecting'}
                        </span>
                    </div>

                    {/* Big Numbers & Quota Gauge */}
                    <div className="space-y-2 pt-1">
                        <div className="flex justify-between items-baseline">
                            <div>
                                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                                    {r2.usedPretty || '0 B'}
                                </span>
                                <span className="text-slate-500 text-xs sm:text-sm font-medium ml-1.5">
                                    used of <strong className="text-slate-700 font-bold">{r2.limitPretty || '10 GB'}</strong> limit
                                </span>
                            </div>
                            <span className="text-xs font-bold text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-lg border border-sky-200 font-mono">
                                {Number(r2.usagePercent || 0).toFixed(2)}% Used
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 rounded-full bg-slate-100 border border-slate-200/80 overflow-hidden p-0.5">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${getR2UsageColor(
                                    r2.usagePercent || 0
                                )} transition-all duration-700 shadow-sm`}
                                style={{ width: `${Math.max(Number(r2.usagePercent || 0), 2)}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                                <FaHardDrive className="w-3 h-3 text-sky-500" />
                                {r2RemainingPretty} Free Headroom
                            </span>
                            <span className="text-sky-700 font-semibold">Standard Free Tier Quota (10 GB)</span>
                        </div>
                    </div>

                    {/* Breakdown Sub-grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-sky-100">
                        <div className="p-2.5 rounded-xl bg-white/90 border border-sky-100/80 shadow-xs">
                            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                <FaFileLines className="w-2.5 h-2.5 text-sky-500" />
                                Files Uploaded
                            </div>
                            <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                                {r2.objectCount || 0} Assets
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/90 border border-sky-100/80 shadow-xs">
                            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                <FaCloudArrowUp className="w-2.5 h-2.5 text-emerald-500" />
                                Egress Pricing
                            </div>
                            <div className="text-sm font-bold text-emerald-600 mt-0.5">
                                $0.00 (Zero Fee)
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/90 border border-sky-100/80 shadow-xs col-span-2 sm:col-span-1">
                            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                <FaServer className="w-2.5 h-2.5 text-indigo-500" />
                                Edge Delivery
                            </div>
                            <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                                Cloudflare CDN
                            </div>
                        </div>
                    </div>

                    {/* Footer link to student files */}
                    <div className="pt-1 flex items-center justify-between text-xs border-t border-sky-100/80">
                        <span className="text-[11px] text-slate-500 truncate">
                            Encrypted storage for passports, transcripts, and offer letters.
                        </span>
                        <Link
                            href="/admin/students"
                            className="font-semibold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 flex-shrink-0"
                        >
                            Document Vault <FaArrowUpRightFromSquare className="w-2.5 h-2.5" />
                        </Link>
                    </div>
                </div>

                {/* 2. NEON POSTGRESQL DATABASE STORAGE CARD */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white via-white to-indigo-50/50 border border-indigo-200/80 shadow-md hover:shadow-lg transition-all space-y-5 relative overflow-hidden">
                    {/* Top Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-100/90 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-sm">
                                <SiPostgresql className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                                    Relational Data Store
                                    <span className="text-[10px] font-normal lowercase text-indigo-600 bg-indigo-100/80 px-2 py-0.2 rounded-full border border-indigo-200">
                                        neon-postgres
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    Neon Serverless PostgreSQL
                                </h3>
                            </div>
                        </div>

                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <FaShieldHalved className="w-3 h-3 text-emerald-500" />
                            {db.connected ? 'SSL TLSv1.3' : 'Offline'}
                        </span>
                    </div>

                    {/* Big Numbers & Quota Gauge */}
                    <div className="space-y-2 pt-1">
                        <div className="flex justify-between items-baseline">
                            <div>
                                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                                    {db.usedPretty || '0 B'}
                                </span>
                                <span className="text-slate-500 text-xs sm:text-sm font-medium ml-1.5">
                                    allocated of <strong className="text-slate-700 font-bold">{db.limitPretty || '512 MB'}</strong> starter tier
                                </span>
                            </div>
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-lg border border-indigo-200 font-mono">
                                {Number(db.usagePercent || 0).toFixed(2)}% Used
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 rounded-full bg-slate-100 border border-slate-200/80 overflow-hidden p-0.5">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${getUsageColor(
                                    db.usagePercent || 0
                                )} transition-all duration-700 shadow-sm`}
                                style={{ width: `${Math.max(Number(db.usagePercent || 0), 2)}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                                <FaDatabase className="w-3 h-3 text-indigo-500" />
                                {dbRemainingPretty} Remaining Quota
                            </span>
                            <span className="text-indigo-700 font-semibold">Scale-To-Zero Serverless Branch</span>
                        </div>
                    </div>

                    {/* Breakdown Sub-grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-indigo-100">
                        <div className="p-2.5 rounded-xl bg-white/90 border border-indigo-100/80 shadow-xs">
                            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                <FaLayerGroup className="w-2.5 h-2.5 text-indigo-500" />
                                Total Rows
                            </div>
                            <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                                {Number(db.totalRows || 0).toLocaleString()} Rows
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/90 border border-indigo-100/80 shadow-xs">
                            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                <FaTable className="w-2.5 h-2.5 text-blue-500" />
                                Schema Tables
                            </div>
                            <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                                {db.tablesCount || 0} Tables
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/90 border border-indigo-100/80 shadow-xs col-span-2 sm:col-span-1">
                            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                <FaServer className="w-2.5 h-2.5 text-emerald-500" />
                                Connection Pool
                            </div>
                            <div className="text-sm font-bold text-emerald-600 mt-0.5 truncate">
                                Neon Pooler (SSL)
                            </div>
                        </div>
                    </div>

                    {/* Table Row Pills Breakdown */}
                    {db.breakdown && (
                        <div className="pt-2 border-t border-indigo-100/80">
                            <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                                Active Table Populations:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                    Students: <strong>{db.breakdown.students_count || 0}</strong>
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                    Documents: <strong>{db.breakdown.docs_count || 0}</strong>
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                    Leads: <strong>{db.breakdown.leads_count || 0}</strong>
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                    Revenues: <strong>{db.breakdown.revenues_count || 0}</strong>
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                    Expenses: <strong>{db.breakdown.expenses_count || 0}</strong>
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                    Universities: <strong>{db.breakdown.unis_count || 0}</strong>
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                    Courses: <strong>{db.breakdown.courses_count || 0}</strong>
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                    Visitors: <strong>{db.breakdown.visitors_count || 0}</strong>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
