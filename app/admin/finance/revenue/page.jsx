'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/Pagination';
import toast from 'react-hot-toast';
import {
    TrendingUp,
    Plus,
    FileText,
    DollarSign,
    Calendar,
    Users,
    GraduationCap,
    CheckCircle2,
    Clock,
    Trash2,
    Filter,
    Percent,
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
    university_commission: { label: 'University Partner Commission', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    student_service_fee: { label: 'Student File Processing Fee', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    visa_processing_fee: { label: 'Visa Consultancy & Filing', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    consultancy_fee: { label: 'Premium VIP Advisory', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    partner_rebate: { label: 'Insurance & Testing Rebates', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    other: { label: 'Other Revenue', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function RevenueManagementPage() {
    const [revenues, setRevenues] = useState([]);
    const [students, setStudents] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

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
        category: 'university_commission',
        totalAmount: '',
        studentId: '',
        agentId: '',
        status: 'received',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'wire_transfer',
        notes: '',
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

            const [revRes, stuRes, agtRes] = await Promise.all([
                fetch(`/api/revenues?${params.toString()}`).then((r) => r.json()),
                fetch('/api/students').then((r) => r.json()),
                fetch('/api/agents').then((r) => r.json()),
            ]);

            if (revRes.success) setRevenues(revRes.revenues);
            if (stuRes.success) setStudents(stuRes.students);
            if (agtRes.success) setAgents(agtRes.agents);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load revenue data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        setCurrentPage(1);
        setSelectedIds([]);
    }, [statusFilter]);

    // Client-side pagination slice
    const paginatedRevenues = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return revenues.slice(start, start + pageSize);
    }, [revenues, currentPage, pageSize]);

    const totalPages = Math.ceil(revenues.length / pageSize) || 1;

    // Selection helpers
    const isAllCurrentPageSelected =
        paginatedRevenues.length > 0 && paginatedRevenues.every((r) => selectedIds.includes(r.id));

    const toggleSelectAll = () => {
        if (isAllCurrentPageSelected) {
            const pageIds = new Set(paginatedRevenues.map((r) => r.id));
            setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
        } else {
            const newSet = new Set([...selectedIds, ...paginatedRevenues.map((r) => r.id)]);
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

    const handleCreateRevenue = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Generating revenue invoice...');
        try {
            const res = await fetch('/api/revenues', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Revenue invoice generated', { id: toastId });
                setOpenModal(false);
                setForm({
                    title: '',
                    category: 'university_commission',
                    totalAmount: '',
                    studentId: '',
                    agentId: '',
                    status: 'received',
                    paymentDate: new Date().toISOString().split('T')[0],
                    paymentMethod: 'wire_transfer',
                    notes: '',
                });
                loadData();
            } else {
                toast.error(data.message || 'Failed to record revenue', { id: toastId });
            }
        } catch {
            toast.error('Error creating revenue', { id: toastId });
        }
    };

    const handleUpdateStatus = async (id, status) => {
        const toastId = toast.loading('Updating invoice status...');
        try {
            const res = await fetch(`/api/revenues/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Invoice marked as ${status}`, { id: toastId });
                loadData();
            } else {
                toast.error(data.message || 'Update failed', { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error('Error updating status', { id: toastId });
        }
    };

    const handleDeleteRevenue = async (id) => {
        if (!window.confirm('Delete this revenue invoice?')) return;
        const toastId = toast.loading('Deleting revenue invoice...');
        try {
            const res = await fetch(`/api/revenues/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Invoice deleted', { id: toastId });
                loadData();
            } else {
                toast.error(data.message || 'Delete failed', { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error('Error deleting invoice', { id: toastId });
        }
    };

    // Bulk Action: Status Update
    const handleBulkStatusChange = async (newStatus) => {
        if (!newStatus || selectedIds.length === 0) return;
        const toastId = toast.loading(`Updating ${selectedIds.length} invoices to ${newStatus}...`);
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/revenues/bulk', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds, status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Updated ${data.updatedCount} invoices to ${newStatus}`, { id: toastId });
                setSelectedIds([]);
                loadData();
            } else {
                toast.error(data.message || 'Bulk update failed', { id: toastId });
            }
        } catch {
            toast.error('Network error during bulk update', { id: toastId });
        } finally {
            setBulkUpdating(false);
        }
    };

    // Bulk Action: Delete
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Permanently delete ${selectedIds.length} revenue invoices?`)) return;

        const toastId = toast.loading(`Deleting ${selectedIds.length} invoices...`);
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/revenues/bulk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Deleted ${data.deletedCount} invoices`, { id: toastId });
                setSelectedIds([]);
                loadData();
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

    const totalGross = revenues.reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);
    const totalNetCompany = revenues.reduce((acc, curr) => acc + Number(curr.netCompanyAmount || 0), 0);
    const totalAgentCommissions = revenues.reduce((acc, curr) => acc + Number(curr.agentCommissionAmount || 0), 0);

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-7 h-7 text-emerald-600" />
                        Revenue & Invoicing Inflow Center
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Track university partner tuition commissions, student processing fees, and counselor revenue splits.
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-md shadow-emerald-600/25 font-semibold">
                                <Plus className="w-4 h-4" />
                                Create Revenue Invoice
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg bg-white border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto shadow-2xl rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                    Generate New Revenue Invoice
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleCreateRevenue} className="space-y-3 pt-2">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Invoice Title / Description *</Label>
                                    <Input
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        required
                                        placeholder="e.g. University of Manchester 15% First Year Commission"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-emerald-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Revenue Category *</Label>
                                        <Select
                                            value={form.category}
                                            onValueChange={(val) => setForm({ ...form, category: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="university_commission">University Commission</SelectItem>
                                                <SelectItem value="student_service_fee">Student Service Fee</SelectItem>
                                                <SelectItem value="visa_processing_fee">Visa Filing Fee</SelectItem>
                                                <SelectItem value="consultancy_fee">VIP Consultancy</SelectItem>
                                                <SelectItem value="partner_rebate">Partner Rebate</SelectItem>
                                                <SelectItem value="other">Other Inflow</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Gross Inflow Amount ($ USD) *</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={form.totalAmount}
                                            onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                                            required
                                            placeholder="4500.00"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Associated Student File</Label>
                                        <Select
                                            value={form.studentId}
                                            onValueChange={(val) => setForm({ ...form, studentId: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue placeholder="Select student (optional)" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                {students.map((st) => (
                                                    <SelectItem key={st.id} value={st.id}>
                                                        {st.fullName} ({st.studentCode})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Attributed Agent / Counselor</Label>
                                        <Select
                                            value={form.agentId}
                                            onValueChange={(val) => setForm({ ...form, agentId: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue placeholder="Select agent for split" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                {agents.map((ag) => (
                                                    <SelectItem key={ag.id} value={ag.id}>
                                                        {ag.name} ({ag.commissionRate}% split)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Invoice Status</Label>
                                        <Select
                                            value={form.status}
                                            onValueChange={(val) => setForm({ ...form, status: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="received">Received & Cleared</SelectItem>
                                                <SelectItem value="pending">Pending Payment</SelectItem>
                                                <SelectItem value="overdue">Overdue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Payment Date</Label>
                                        <Input
                                            type="date"
                                            value={form.paymentDate}
                                            onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-emerald-500"
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
                                                <SelectItem value="wire_transfer">International Wire / SWIFT</SelectItem>
                                                <SelectItem value="bank_transfer">Local Bank Transfer</SelectItem>
                                                <SelectItem value="credit_card">Stripe / Credit Card</SelectItem>
                                                <SelectItem value="check">Bank Draft / Check</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Internal Reference / Notes</Label>
                                    <Input
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        placeholder="Swift transfer reference, university invoice number..."
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-emerald-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpenModal(false)} className="text-xs">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
                                        Issue Invoice & Post Revenue
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Financial Revenue KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Gross Cash Inflow</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">{fUSD(totalGross)}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{revenues.length} Invoices Cleared</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Net Agency Retained</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{fUSD(totalNetCompany)}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Retained after counselor splits</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Agent Commission Pool</div>
                    <div className="text-2xl font-black text-blue-600 mt-1">{fUSD(totalAgentCommissions)}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Automated counselor compensation</div>
                </div>
            </div>

            {/* Filter and Selection Bar */}
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span>Filter Invoices by Status:</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {paginatedRevenues.length > 0 && (
                        <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                        >
                            {isAllCurrentPageSelected ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                            )}
                            <span>Select Page ({paginatedRevenues.length})</span>
                        </button>
                    )}

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-56 bg-white border-slate-300 text-slate-800 text-xs rounded-xl">
                            <SelectValue placeholder="All Invoices" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                            <SelectItem value="all">All Invoices ({revenues.length})</SelectItem>
                            <SelectItem value="received">Received & Cleared</SelectItem>
                            <SelectItem value="pending">Pending Payment</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Revenue Invoices Table */}
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
                                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <Square className="w-4 h-4 text-slate-300" />
                                        )}
                                    </button>
                                </th>
                                <th className="p-4">Invoice #</th>
                                <th className="p-4">Title / Category</th>
                                <th className="p-4">Student Dossier</th>
                                <th className="p-4">Attributed Agent</th>
                                <th className="p-4 text-right">Gross Total</th>
                                <th className="p-4 text-right">Net Agency</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-slate-400">
                                        Loading revenue invoices...
                                    </td>
                                </tr>
                            ) : paginatedRevenues.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-slate-400">
                                        No revenue invoices recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                paginatedRevenues.map((rev) => {
                                    const catInfo = categoryLabels[rev.category] || { label: rev.category, color: 'bg-slate-100' };
                                    const isSelected = selectedIds.includes(rev.id);
                                    return (
                                        <tr
                                            key={rev.id}
                                            className={`transition-colors ${
                                                isSelected ? 'bg-emerald-50/50' : 'hover:bg-slate-50/80'
                                            }`}
                                        >
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSelect(rev.id)}
                                                    className="text-slate-400 hover:text-emerald-600"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                                                    ) : (
                                                        <Square className="w-4 h-4 text-slate-300" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="p-4 font-mono font-bold text-primary">
                                                {rev.invoiceNumber}
                                                <div className="text-[10px] text-slate-400 font-normal font-sans">
                                                    {rev.paymentDate || '—'}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-slate-900">{rev.title}</div>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catInfo.color}`}>
                                                    {catInfo.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-700 font-medium">
                                                {rev.studentName ? (
                                                    <span className="flex items-center gap-1.5">
                                                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                                                        {rev.studentName}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">Direct Agency</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-slate-700">
                                                {rev.agentName ? (
                                                    <div>
                                                        <div className="font-semibold text-amber-700">{rev.agentName}</div>
                                                        <div className="text-[10px] text-slate-500">
                                                            Split: {fUSD(rev.agentCommissionAmount)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right font-mono font-bold text-emerald-600 text-sm">
                                                +{fUSD(rev.totalAmount)}
                                            </td>
                                            <td className="p-4 text-right font-mono font-bold text-slate-900 text-sm">
                                                {fUSD(rev.netCompanyAmount)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span
                                                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                                                        rev.status === 'received'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}
                                                >
                                                    {rev.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleDeleteRevenue(rev.id)}
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
                    totalItems={revenues.length}
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
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                            {selectedIds.length}
                        </span>
                        <span className="text-xs font-bold text-slate-900">Invoices Selected</span>
                    </div>

                    {/* Bulk Status Select */}
                    <div className="flex items-center gap-1.5">
                        <Select onValueChange={handleBulkStatusChange} disabled={bulkUpdating}>
                            <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-300 w-44">
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                <SelectItem value="received">Mark Received & Cleared</SelectItem>
                                <SelectItem value="pending">Mark Pending Payment</SelectItem>
                                <SelectItem value="overdue">Mark Overdue</SelectItem>
                            </SelectContent>
                        </Select>
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
                        Delete ({selectedIds.length})
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
