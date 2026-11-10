'use client';

import React, { useState, useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Calendar,
    Filter,
    DollarSign,
    Target,
    Layers,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Realistic monthly & time-series dataset with financial & marketing metrics
const dataset = {
    '7d': [
        { label: 'Mon', revenue: 1200, expense: 450, leads: 4, profit: 750 },
        { label: 'Tue', revenue: 2400, expense: 620, leads: 7, profit: 1780 },
        { label: 'Wed', revenue: 1800, expense: 500, leads: 5, profit: 1300 },
        { label: 'Thu', revenue: 3500, expense: 890, leads: 9, profit: 2610 },
        { label: 'Fri', revenue: 2900, expense: 710, leads: 8, profit: 2190 },
        { label: 'Sat', revenue: 4200, expense: 1100, leads: 12, profit: 3100 },
        { label: 'Sun', revenue: 3800, expense: 850, leads: 10, profit: 2950 },
    ],
    '30d': [
        { label: 'Week 1', revenue: 14200, expense: 4800, leads: 32, profit: 9400 },
        { label: 'Week 2', revenue: 18500, expense: 5600, leads: 45, profit: 12900 },
        { label: 'Week 3', revenue: 21000, expense: 6200, leads: 52, profit: 14800 },
        { label: 'Week 4', revenue: 24800, expense: 7100, leads: 58, profit: 17700 },
    ],
    'quarter': [
        { label: 'Q1 (Jan-Mar)', revenue: 48000, expense: 16500, leads: 110, profit: 31500 },
        { label: 'Q2 (Apr-Jun)', revenue: 64000, expense: 21000, leads: 165, profit: 43000 },
        { label: 'Q3 (Jul-Sep)', revenue: 89000, expense: 27500, leads: 240, profit: 61500 },
        { label: 'Q4 (Oct-Dec)', revenue: 76000, expense: 23000, leads: 195, profit: 53000 },
    ],
    'year': [
        { label: 'Jan', revenue: 15000, expense: 5200, leads: 35, profit: 9800 },
        { label: 'Feb', revenue: 16500, expense: 5500, leads: 38, profit: 11000 },
        { label: 'Mar', revenue: 18000, expense: 5800, leads: 42, profit: 12200 },
        { label: 'Apr', revenue: 21000, expense: 6800, leads: 50, profit: 14200 },
        { label: 'May', revenue: 22500, expense: 7100, leads: 56, profit: 15400 },
        { label: 'Jun', revenue: 25000, expense: 7800, leads: 62, profit: 17200 },
        { label: 'Jul', revenue: 31000, expense: 9500, leads: 78, profit: 21500 },
        { label: 'Aug', revenue: 34500, expense: 10200, leads: 85, profit: 24300 },
        { label: 'Sep', revenue: 38000, expense: 11500, leads: 96, profit: 26500 },
        { label: 'Oct', revenue: 29000, expense: 8900, leads: 72, profit: 20100 },
        { label: 'Nov', revenue: 26500, expense: 7900, leads: 66, profit: 18600 },
        { label: 'Dec', revenue: 24000, expense: 7200, leads: 60, profit: 16800 },
    ],
};

export default function AreaGraphChart({ className = '' }) {
    const [timeRange, setTimeRange] = useState('year'); // '7d' | '30d' | 'quarter' | 'year'
    const [metricType, setMetricType] = useState('both'); // 'both' | 'revenue' | 'expense' | 'profit' | 'leads'
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const data = useMemo(() => dataset[timeRange] || dataset['year'], [timeRange]);

    // Compute coordinate points for SVG rendering
    const width = 800;
    const height = 300;
    const paddingX = 45;
    const paddingY = 35;

    const values = useMemo(() => {
        if (metricType === 'leads') {
            return data.map((d) => d.leads);
        }
        if (metricType === 'revenue') {
            return data.map((d) => d.revenue);
        }
        if (metricType === 'expense') {
            return data.map((d) => d.expense);
        }
        if (metricType === 'profit') {
            return data.map((d) => d.profit);
        }
        // 'both': scale against max of revenue and expense
        return data.flatMap((d) => [d.revenue, d.expense]);
    }, [data, metricType]);

    const maxVal = Math.max(...values, 100);
    const minVal = 0;

    const getX = (index) => {
        const step = (width - paddingX * 2) / (data.length - 1);
        return paddingX + index * step;
    };

    const getY = (val) => {
        const usableHeight = height - paddingY * 2;
        return height - paddingY - (val / maxVal) * usableHeight;
    };

    // Helper to generate smooth SVG path command using cubic Bezier curve
    const generatePath = (dataKey) => {
        if (data.length === 0) return '';
        const points = data.map((d, i) => ({ x: getX(i), y: getY(d[dataKey]) }));

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) / 2;
            const cp1y = p0.y;
            const cp2x = p0.x + (p1.x - p0.x) / 2;
            const cp2y = p1.y;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
        }
        return d;
    };

    // Generate closed area path for fill
    const generateAreaPath = (dataKey) => {
        const linePath = generatePath(dataKey);
        if (!linePath) return '';
        const lastX = getX(data.length - 1);
        const firstX = getX(0);
        const bottomY = height - paddingY;
        return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
    };

    // Aggregate statistics for selected view
    const totalRev = data.reduce((acc, c) => acc + c.revenue, 0);
    const totalExp = data.reduce((acc, c) => acc + c.expense, 0);
    const totalProfit = data.reduce((acc, c) => acc + c.profit, 0);
    const totalLeads = data.reduce((acc, c) => acc + c.leads, 0);

    const fUSD = (n) => `$${Number(n || 0).toLocaleString()}`;

    const activeItem = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

    return (
        <div className={`p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-md space-y-6 ${className}`}>
            {/* Header with Title and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                Financial Performance & Lead Area Analytics
                            </h2>
                            <p className="text-xs text-slate-500">
                                Dynamic curves visualizing monthly tuition commissions, ad spend, and net profit margins.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter Controls Bar */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Metric Selector Filter */}
                    <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs">
                        <button
                            type="button"
                            onClick={() => setMetricType('both')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                metricType === 'both' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            type="button"
                            onClick={() => setMetricType('revenue')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                metricType === 'revenue' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Revenue
                        </button>
                        <button
                            type="button"
                            onClick={() => setMetricType('expense')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                metricType === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Costs
                        </button>
                        <button
                            type="button"
                            onClick={() => setMetricType('profit')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                metricType === 'profit' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Net Profit
                        </button>
                        <button
                            type="button"
                            onClick={() => setMetricType('leads')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                metricType === 'leads' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Leads
                        </button>
                    </div>

                    {/* Time Range Filter */}
                    <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs">
                        <button
                            type="button"
                            onClick={() => setTimeRange('7d')}
                            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                                timeRange === '7d' ? 'bg-primary text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            7D
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeRange('30d')}
                            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                                timeRange === '30d' ? 'bg-primary text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            30D
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeRange('quarter')}
                            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                                timeRange === 'quarter' ? 'bg-primary text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Quarter
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeRange('year')}
                            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                                timeRange === 'year' ? 'bg-primary text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            12 Months
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick KPI Stat Highlights based on Active Filter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60">
                    <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Gross Inflow</div>
                    <div className="text-xl font-black text-blue-950 mt-0.5">{fUSD(totalRev)}</div>
                    <div className="text-[10px] text-blue-600 font-medium mt-0.5 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> +24% YoY Growth
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/60">
                    <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">Operating & Ad Cost</div>
                    <div className="text-xl font-black text-rose-950 mt-0.5">{fUSD(totalExp)}</div>
                    <div className="text-[10px] text-rose-600 font-medium mt-0.5">Marketing + Centers</div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                    <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Net Retained Profit</div>
                    <div className="text-xl font-black text-emerald-950 mt-0.5">{fUSD(totalProfit)}</div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                        {totalRev > 0 ? `${Math.round((totalProfit / totalRev) * 100)}% Margin` : '0%'}
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                    <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Leads Ingested</div>
                    <div className="text-xl font-black text-amber-950 mt-0.5">{totalLeads} Leads</div>
                    <div className="text-[10px] text-amber-700 font-medium mt-0.5">Meta & Google Channels</div>
                </div>
            </div>

            {/* The SVG Area Graph with Gradients and Interactive Crosshair */}
            <div className="relative pt-2">
                <div className="w-full h-72 sm:h-80 select-none">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        <defs>
                            {/* Blue Gradient for Revenue */}
                            <linearGradient id="areaRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" />
                                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                            </linearGradient>

                            {/* Rose Gradient for Expense */}
                            <linearGradient id="areaExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                                <stop offset="60%" stopColor="#fb7185" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#fb7185" stopOpacity="0.0" />
                            </linearGradient>

                            {/* Emerald Gradient for Profit */}
                            <linearGradient id="areaProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                                <stop offset="60%" stopColor="#34d399" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
                            </linearGradient>

                            {/* Amber Gradient for Leads */}
                            <linearGradient id="areaLeads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                                <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                            const y = height - paddingY - ratio * (height - paddingY * 2);
                            const val = Math.round(ratio * maxVal);
                            return (
                                <g key={ratio}>
                                    <line
                                        x1={paddingX}
                                        y1={y}
                                        x2={width - paddingX}
                                        y2={y}
                                        stroke="#e2e8f0"
                                        strokeDasharray="4 4"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={paddingX - 10}
                                        y={y + 3}
                                        textAnchor="end"
                                        className="text-[10px] fill-slate-400 font-mono"
                                    >
                                        {metricType === 'leads' ? val : `$${(val / 1000).toFixed(0)}k`}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Area Fills based on metric filter */}
                        {(metricType === 'both' || metricType === 'revenue') && (
                            <path d={generateAreaPath('revenue')} fill="url(#areaRevenue)" />
                        )}

                        {(metricType === 'both' || metricType === 'expense') && (
                            <path d={generateAreaPath('expense')} fill="url(#areaExpense)" />
                        )}

                        {metricType === 'profit' && (
                            <path d={generateAreaPath('profit')} fill="url(#areaProfit)" />
                        )}

                        {metricType === 'leads' && (
                            <path d={generateAreaPath('leads')} fill="url(#areaLeads)" />
                        )}

                        {/* Stroke Lines */}
                        {(metricType === 'both' || metricType === 'revenue') && (
                            <path
                                d={generatePath('revenue')}
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}

                        {(metricType === 'both' || metricType === 'expense') && (
                            <path
                                d={generatePath('expense')}
                                fill="none"
                                stroke="#f43f5e"
                                strokeWidth="2.5"
                                strokeDasharray={metricType === 'both' ? '6 4' : 'none'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}

                        {metricType === 'profit' && (
                            <path
                                d={generatePath('profit')}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}

                        {metricType === 'leads' && (
                            <path
                                d={generatePath('leads')}
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}

                        {/* Interactive Data Nodes & Crosshairs */}
                        {data.map((item, i) => {
                            const x = getX(i);
                            const isHovered = hoveredIndex === i;
                            return (
                                <g
                                    key={i}
                                    className="cursor-pointer group"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {/* Transparent hit area */}
                                    <rect
                                        x={x - 20}
                                        y={0}
                                        width={40}
                                        height={height}
                                        fill="transparent"
                                    />

                                    {/* Crosshair guide on hover */}
                                    {isHovered && (
                                        <line
                                            x1={x}
                                            y1={paddingY}
                                            x2={x}
                                            y2={height - paddingY}
                                            stroke="#3b82f6"
                                            strokeWidth="1.5"
                                            strokeDasharray="3 3"
                                        />
                                    )}

                                    {/* Node circles */}
                                    {(metricType === 'both' || metricType === 'revenue') && (
                                        <circle
                                            cx={x}
                                            cy={getY(item.revenue)}
                                            r={isHovered ? 6 : 3.5}
                                            fill="#ffffff"
                                            stroke="#2563eb"
                                            strokeWidth={isHovered ? 3 : 2}
                                            className="transition-all"
                                        />
                                    )}

                                    {(metricType === 'both' || metricType === 'expense') && (
                                        <circle
                                            cx={x}
                                            cy={getY(item.expense)}
                                            r={isHovered ? 5 : 3}
                                            fill="#ffffff"
                                            stroke="#f43f5e"
                                            strokeWidth={2}
                                            className="transition-all"
                                        />
                                    )}

                                    {/* X-axis labels */}
                                    <text
                                        x={x}
                                        y={height - paddingY + 20}
                                        textAnchor="middle"
                                        className={`text-[11px] font-medium transition-colors ${
                                            isHovered ? 'fill-primary font-bold' : 'fill-slate-500'
                                        }`}
                                    >
                                        {item.label}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Floating Detail Tooltip on Hover */}
                {hoveredIndex !== null && (
                    <div
                        className="absolute top-2 pointer-events-none transition-all duration-150 transform -translate-x-1/2 p-3 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl text-xs space-y-1.5 z-20"
                        style={{ left: `${(getX(hoveredIndex) / width) * 100}%` }}
                    >
                        <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center justify-between gap-4">
                            <span>{activeItem.label}</span>
                            <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-mono font-bold">
                                Active Period
                            </span>
                        </div>
                        <div className="space-y-1 text-slate-600">
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                    Gross Revenue:
                                </span>
                                <strong className="font-bold text-slate-900">{fUSD(activeItem.revenue)}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                    Costs / Ads:
                                </span>
                                <strong className="font-bold text-slate-900">{fUSD(activeItem.expense)}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
                                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                    Net Profit:
                                </span>
                                <strong className="font-bold text-emerald-700">{fUSD(activeItem.profit)}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                                    New Leads:
                                </span>
                                <strong className="font-bold text-amber-700">{activeItem.leads} Leads</strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend & Explanations */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-5">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                        <span className="font-semibold text-slate-800">Gross Tuition Commission</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-1 bg-rose-500 border-dashed"></span>
                        <span className="font-semibold text-slate-800">Operational & Marketing Costs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-slate-800">Net Agency Margin</span>
                    </div>
                </div>

                <div className="text-[11px] text-slate-400">
                    Hover over data nodes to inspect point-in-time financial delta.
                </div>
            </div>
        </div>
    );
}
