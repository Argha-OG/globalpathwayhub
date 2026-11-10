'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/Pagination';
import toast from 'react-hot-toast';
import {
    TrendingDown,
    Plus,
    Receipt,
    DollarSign,
    Calendar,
    Building2,
    Share2,
    Laptop,
    Users,
    Trash2,
    Filter,
    CheckCircle2,
    CheckSquare,
    Square,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const categoryLabels = {
    marketing_meta: { label: 'Meta / Facebook Ads', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    marketing_google: { label: 'Google Search Ads', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    daily_office: { label: 'Office Rent & Utilities', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    salaries: { label: 'Staff Salaries & Bonus', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    software_saas: { label: 'Software, Cloud & Tech', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    event_expo: { label: 'Education Expo & Seminars', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    travel: { label: 'Travel & Embassy Visits', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    legal: { label: 'Legal & Agency Licensing', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    other: { label: 'Miscellaneous Expense', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function CostsManagementPage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkUpdating, setBulkUpdating] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Create Modal state
    const [openModal, setOpenModal] = useState(false);
    const [form, setForm] = useState({
        title: '',
        category: 'marketing_meta',
        amount: '',
        currency: 'USD',
        expenseDate: new Date().toISOString().split('T')[0],
        paidTo: '',
        paymentMethod: 'bank_transfer',
        notes: '',
    });

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);

            const res = await fetch(`/api/expenses?${params.toString()}`).then((r) => r.json());
            if (res.success) setExpenses(res.expenses);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load expense ledger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExpenses();
        setCurrentPage(1);
        setSelectedIds([]);
    }, [categoryFilter]);

    // Client-side pagination slice
    const paginatedExpenses = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return expenses.slice(start, start + pageSize);
    }, [expenses, currentPage, pageSize]);

    const totalPages = Math.ceil(expenses.length / pageSize) || 1;

    // Selection helpers
    const isAllCurrentPageSelected =
        paginatedExpenses.length > 0 && paginatedExpenses.every((e) => selectedIds.includes(e.id));

    const toggleSelectAll = () => {
        if (isAllCurrentPageSelected) {
            const pageIds = new Set(paginatedExpenses.map((e) => e.id));
            setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
        } else {
            const newSet = new Set([...selectedIds, ...paginatedExpenses.map((e) => e.id)]);
            setSelectedIds(Array.from(newSet));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const clearSelection = () => {
        setSelectedIds([]);
    };

    const handleCreateExpense = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Recording operational expense...');
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Expense entry recorded', { id: toastId });
                setOpenModal(false);
                setForm({
                    title: '',
                    category: 'marketing_meta',
                    amount: '',
                    currency: 'USD',
                    expenseDate: new Date().toISOString().split('T')[0],
                    paidTo: '',
                    paymentMethod: 'bank_transfer',
                    notes: '',
                });
                loadExpenses();
            } else {
                toast.error(data.message || 'Failed to record expense', { id: toastId });
            }
        } catch {
            toast.error('Error creating expense', { id: toastId });
        }
    };

    const handleDeleteExpense = async (id) => {
        if (!window.confirm('Delete this expense entry?')) return;
        const toastId = toast.loading('Removing expense entry...');
        try {
            const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Expense deleted', { id: toastId });
                loadExpenses();
            } else {
                toast.error(data.message || 'Delete failed', { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error('Error deleting expense', { id: toastId });
        }
    };

    // Bulk Delete
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Permanently delete ${selectedIds.length} expense records?`)) return;

        const toastId = toast.loading(`Deleting ${selectedIds.length} records...`);
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/expenses/bulk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Deleted ${data.deletedCount} expense entries`, { id: toastId });
                setSelectedIds([]);
                loadExpenses();
            } else {
                toast.error(data.message || 'Bulk delete failed', { id: toastId });
            }
        } catch {
            toast.error('Network error during bulk delete', { id: toastId });
        } finally {
            setBulkUpdating(false);
        }
    };

    const fUSD = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const totalCost = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const marketingCost = expenses
        .filter((e) => ['marketing_meta', 'marketing_google'].includes(e.category))
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const officeCost = expenses
        .filter((e) => e.category === 'daily_office')
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <TrendingDown className="w-7 h-7 text-rose-600" />
                        Daily Cost & Marketing Expense Ledger
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Track Meta/Google Ads spending, branch office operational costs, counselor incentives, and events.
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5 shadow-md shadow-rose-600/25 font-semibold">
                                <Plus className="w-4 h-4" />
                                Record New Expense
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg bg-white border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                    <Receipt className="w-5 h-5 text-rose-600" />
                                    Record Operational Expense
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleCreateExpense} className="space-y-3 pt-2">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Expense Title / Purpose *</Label>
                                    <Input
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        required
                                        placeholder="e.g. Meta Ads Fall 2026 UK Intake"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-rose-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Cost Category *</Label>
                                        <Select
                                            value={form.category}
                                            onValueChange={(val) => setForm({ ...form, category: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="marketing_meta">Meta / Facebook Ads</SelectItem>
                                                <SelectItem value="marketing_google">Google Search Ads</SelectItem>
                                                <SelectItem value="daily_office">Office Rent & Utilities</SelectItem>
                                                <SelectItem value="salaries">Salaries & Counselor Bonus</SelectItem>
                                                <SelectItem value="software_saas">Software & Cloud Tech</SelectItem>
                                                <SelectItem value="event_expo">Education Expo & Seminars</SelectItem>
                                                <SelectItem value="travel">Travel & Embassy Delegations</SelectItem>
                                                <SelectItem value="legal">Legal & Licensing</SelectItem>
                                                <SelectItem value="other">Other Cost</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Amount ($ USD) *</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={form.amount}
                                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                            required
                                            placeholder="500.00"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-rose-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Expense Date</Label>
                                        <Input
                                            type="date"
                                            value={form.expenseDate}
                                            onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-rose-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Paid To (Vendor / Staff)</Label>
                                        <Input
                                            value={form.paidTo}
                                            onChange={(e) => setForm({ ...form, paidTo: e.target.value })}
                                            placeholder="Meta, Landlord, Staff"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-rose-500"
                                        />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <Label className="text-xs text-slate-700">Payment Method</Label>
                                        <Select
                                            value={form.paymentMethod}
                                            onValueChange={(val) => setForm({ ...form, paymentMethod: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="bank_transfer">Bank Wire Transfer</SelectItem>
                                                <SelectItem value="credit_card">Corporate Credit Card</SelectItem>
                                                <SelectItem value="cash">Petty Cash</SelectItem>
                                                <SelectItem value="mobile_banking">bKash / Nagad / Mobile</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Additional Notes / Invoice Ref</Label>
                                    <Input
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        placeholder="Invoice #, campaign ID, bank slip"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-rose-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpenModal(false)} className="text-xs">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold">
                                        Post Expense
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Financial Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Cumulative Costs</div>
                    <div className="text-2xl font-black text-rose-600 mt-1">{fUSD(totalCost)}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{expenses.length} Total recorded voucher items</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Paid Digital Ads (Meta + Google)</div>
                    <div className="text-2xl font-black text-blue-600 mt-1">{fUSD(marketingCost)}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Primary Student Acquisition Driver</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Physical Centers & Rent</div>
                    <div className="text-2xl font-black text-amber-600 mt-1">{fUSD(officeCost)}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Banani Head Office & Branches</div>
                </div>
            </div>

            {/* Category Filter and Selection bar */}
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span>Filter Expenses by Category:</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {paginatedExpenses.length > 0 && (
                        <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                        >
                            {isAllCurrentPageSelected ? (
                                <CheckSquare className="w-4 h-4 text-rose-600" />
                            ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                            )}
                            <span>Select Page ({paginatedExpenses.length})</span>
                        </button>
                    )}

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-64 bg-white border-slate-300 text-slate-800 text-xs rounded-xl">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                            <SelectItem value="all">All Categories ({expenses.length})</SelectItem>
                            <SelectItem value="marketing_meta">Meta / Facebook Ads</SelectItem>
                            <SelectItem value="marketing_google">Google Search Ads</SelectItem>
                            <SelectItem value="daily_office">Office Rent & Utilities</SelectItem>
                            <SelectItem value="salaries">Salaries & Bonuses</SelectItem>
                            <SelectItem value="software_saas">Software & SaaS</SelectItem>
                            <SelectItem value="event_expo">Education Expos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Expense Ledger Table */}
            <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                            <tr>
                                <th className="p-4 w-10 text-center">
                                    <button
                                        type="button"
                                        onClick={toggleSelectAll}
                                        className="text-slate-400 hover:text-slate-700"
                                    >
                                        {isAllCurrentPageSelected ? (
                                            <CheckSquare className="w-4 h-4 text-rose-600" />
                                        ) : (
                                            <Square className="w-4 h-4 text-slate-300" />
                                        )}
                                    </button>
                                </th>
                                <th className="p-4">Expense Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Paid To</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Method</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-400">
                                        Loading cost ledger...
                                    </td>
                                </tr>
                            ) : paginatedExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-400">
                                        No expenses recorded in this category.
                                    </td>
                                </tr>
                            ) : (
                                paginatedExpenses.map((exp) => {
                                    const catInfo = categoryLabels[exp.category] || { label: exp.category, color: 'bg-slate-100' };
                                    const isSelected = selectedIds.includes(exp.id);
                                    return (
                                        <tr
                                            key={exp.id}
                                            className={`transition-colors ${
                                                isSelected ? 'bg-rose-50/50' : 'hover:bg-slate-50/80'
                                            }`}
                                        >
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSelect(exp.id)}
                                                    className="text-slate-400 hover:text-rose-600"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="w-4 h-4 text-rose-600" />
                                                    ) : (
                                                        <Square className="w-4 h-4 text-slate-300" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="p-4 font-semibold text-slate-900">
                                                {exp.title}
                                                {exp.notes && (
                                                    <div className="text-[11px] text-slate-500 font-normal mt-0.5 truncate max-w-xs">
                                                        {exp.notes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catInfo.color}`}>
                                                    {catInfo.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-700">{exp.paidTo || '—'}</td>
                                            <td className="p-4 text-slate-500">{exp.expenseDate || '—'}</td>
                                            <td className="p-4 capitalize text-slate-500">{exp.paymentMethod.replace(/_/g, ' ')}</td>
                                            <td className="p-4 text-right font-mono font-bold text-rose-600 text-sm">
                                                -{fUSD(exp.amount)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleDeleteExpense(exp.id)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                    title="Delete Entry"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Component */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl px-4 shadow-sm mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={expenses.length}
                    pageSize={pageSize}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setCurrentPage(1);
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                />
            </div>

            {/* Floating Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-4 text-slate-800 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center">
                            {selectedIds.length}
                        </span>
                        <span className="text-xs font-bold text-slate-900">Expenses Selected</span>
                    </div>

                    {/* Bulk Delete */}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={bulkUpdating}
                        className="h-8 text-xs gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Selected ({selectedIds.length})
                    </Button>

                    {/* Clear selection */}
                    <button
                        type="button"
                        onClick={clearSelection}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
                        title="Cancel selection"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}
