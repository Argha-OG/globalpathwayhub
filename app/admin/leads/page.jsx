'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/Pagination';
import toast from 'react-hot-toast';
import {
    Target,
    Plus,
    Search,
    Phone,
    Mail,
    MapPin,
    Flame,
    CheckCircle2,
    ArrowRight,
    UserCheck,
    DollarSign,
    Filter,
    Calendar,
    Sparkles,
    CheckSquare,
    Square,
    Trash2,
    X,
    Users,
    Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const sourceBadge = {
    facebook_ads: 'bg-blue-50 text-blue-700 border-blue-200',
    google_search: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tiktok: 'bg-pink-50 text-pink-700 border-pink-200',
    walk_in: 'bg-amber-50 text-amber-700 border-amber-200',
    website_inquiry: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    sub_agent: 'bg-teal-50 text-teal-700 border-teal-200',
};

const statusColors = {
    new: 'bg-rose-50 text-rose-700 border-rose-200',
    contacted: 'bg-amber-50 text-amber-700 border-amber-200',
    counseling_scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    documents_pending: 'bg-purple-50 text-purple-700 border-purple-200',
    converted_to_student: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold',
    cold_lost: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function LeadsManagementPage() {
    const [leads, setLeads] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sourceFilter, setSourceFilter] = useState('all');

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkUpdating, setBulkUpdating] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Create Modal state
    const [openModal, setOpenModal] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        city: 'Dhaka',
        preferredCountry: 'United Kingdom',
        preferredDegree: 'Masters',
        leadSource: 'facebook_ads',
        status: 'new',
        priority: 'high',
        assignedAgentId: '',
        estimatedCommission: 1500,
        notes: '',
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
            if (sourceFilter && sourceFilter !== 'all') params.append('source', sourceFilter);

            const [leadsRes, agentsRes] = await Promise.all([
                fetch(`/api/leads?${params.toString()}`).then((r) => r.json()),
                fetch('/api/agents').then((r) => r.json()),
            ]);

            if (leadsRes.success) setLeads(leadsRes.leads);
            if (agentsRes.success) setAgents(agentsRes.agents);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load lead pipeline');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        setCurrentPage(1);
        setSelectedIds([]);
    }, [statusFilter, sourceFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadData();
        setCurrentPage(1);
        setSelectedIds([]);
    };

    // Client-side pagination slice
    const paginatedLeads = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return leads.slice(start, start + pageSize);
    }, [leads, currentPage, pageSize]);

    const totalPages = Math.ceil(leads.length / pageSize) || 1;

    // Selection helpers
    const isAllCurrentPageSelected =
        paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedIds.includes(l.id));

    const toggleSelectAll = () => {
        if (isAllCurrentPageSelected) {
            const pageIds = new Set(paginatedLeads.map((l) => l.id));
            setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
        } else {
            const newSet = new Set([...selectedIds, ...paginatedLeads.map((l) => l.id)]);
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

    // Bulk Action: Status Change
    const handleBulkStatusChange = async (newStatus) => {
        if (!newStatus || selectedIds.length === 0) return;
        const toastId = toast.loading(`Updating ${selectedIds.length} leads...`);
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/leads/bulk', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds, status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Updated ${data.updatedCount} leads to ${newStatus.replace(/_/g, ' ')}`, { id: toastId });
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

    // Bulk Action: Agent Assignment
    const handleBulkAgentAssign = async (agentId) => {
        if (!agentId || selectedIds.length === 0) return;
        const ag = agents.find((a) => a.id === agentId);
        const toastId = toast.loading(`Assigning ${selectedIds.length} leads to ${ag?.name || 'Agent'}...`);
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/leads/bulk', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds, assignedAgentId: agentId }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Assigned ${data.updatedCount} leads to ${ag?.name || 'Counselor'}`, { id: toastId });
                setSelectedIds([]);
                loadData();
            } else {
                toast.error(data.message || 'Bulk assignment failed', { id: toastId });
            }
        } catch {
            toast.error('Network error during assignment', { id: toastId });
        } finally {
            setBulkUpdating(false);
        }
    };

    // Bulk Action: Delete
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Permanently delete ${selectedIds.length} prospective leads?`)) return;

        const toastId = toast.loading(`Deleting ${selectedIds.length} leads...`);
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/leads/bulk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Deleted ${data.deletedCount} leads`, { id: toastId });
                setSelectedIds([]);
                loadData();
            } else {
                toast.error(data.message || 'Bulk delete failed', { id: toastId });
            }
        } catch {
            toast.error('Network error during delete', { id: toastId });
        } finally {
            setBulkUpdating(false);
        }
    };

    const handleCreateLead = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Capturing lead to pipeline...');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Captured lead: ${form.fullName}`, { id: toastId });
                setOpenModal(false);
                setForm({
                    fullName: '',
                    phone: '',
                    email: '',
                    city: 'Dhaka',
                    preferredCountry: 'United Kingdom',
                    preferredDegree: 'Masters',
                    leadSource: 'facebook_ads',
                    status: 'new',
                    priority: 'high',
                    assignedAgentId: '',
                    estimatedCommission: 1500,
                    notes: '',
                });
                loadData();
            } else {
                toast.error(data.message || 'Failed to capture lead', { id: toastId });
            }
        } catch {
            toast.error('Error creating lead', { id: toastId });
        }
    };

    const handleUpdateStatus = async (leadId, newStatus) => {
        const toastId = toast.loading('Updating stage...');
        try {
            await fetch(`/api/leads/${leadId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            toast.success('Lead stage updated', { id: toastId });
            loadData();
        } catch (err) {
            console.error(err);
            toast.error('Error updating stage', { id: toastId });
        }
    };

    const handleConvertLead = async (leadId) => {
        if (!window.confirm('Convert this lead into an official Student Dossier?')) return;
        const toastId = toast.loading('Creating student dossier file from lead...');
        try {
            const res = await fetch(`/api/leads/${leadId}/convert`, { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                toast.success(`Success! Student Dossier opened with code: ${data.student?.studentCode || 'GPH'}`, { id: toastId });
                loadData();
            } else {
                toast.error(data.message || 'Conversion failed', { id: toastId });
            }
        } catch {
            toast.error('Error converting lead', { id: toastId });
        }
    };

    const totalPipelineValue = leads.reduce((acc, curr) => acc + Number(curr.estimatedCommission || 0), 0);
    const hotLeadsCount = leads.filter((l) => l.priority === 'high').length;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <Target className="w-7 h-7 text-amber-500" />
                        Omnichannel Lead Pipeline & CRM
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Capture Meta/Google ad inquiries, assign to branch counselors, and convert qualified leads into students.
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-xs gap-1.5 shadow-md shadow-primary/25 font-semibold">
                                <Plus className="w-4 h-4" />
                                Capture New Lead
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl bg-white border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto shadow-2xl rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                    <Target className="w-5 h-5 text-amber-500" />
                                    Capture New Prospective Student Lead
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleCreateLead} className="space-y-3 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Full Name *</Label>
                                        <Input
                                            value={form.fullName}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                            required
                                            placeholder="Lead student name"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Phone (WhatsApp) *</Label>
                                        <Input
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            required
                                            placeholder="+880 1711-XXXXXX"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Email Address</Label>
                                        <Input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="student@example.com"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">City / Origin</Label>
                                        <Input
                                            value={form.city}
                                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                                            placeholder="Dhaka, Chittagong, Sylhet..."
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Preferred Country</Label>
                                        <Select
                                            value={form.preferredCountry}
                                            onValueChange={(val) => setForm({ ...form, preferredCountry: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                <SelectItem value="United States">United States</SelectItem>
                                                <SelectItem value="Canada">Canada</SelectItem>
                                                <SelectItem value="Australia">Australia</SelectItem>
                                                <SelectItem value="Germany">Germany</SelectItem>
                                                <SelectItem value="Malaysia">Malaysia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Desired Degree Level</Label>
                                        <Select
                                            value={form.preferredDegree}
                                            onValueChange={(val) => setForm({ ...form, preferredDegree: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="Bachelors">Undergraduate (Bachelors)</SelectItem>
                                                <SelectItem value="Masters">Postgraduate (Masters)</SelectItem>
                                                <SelectItem value="PhD">Doctorate / PhD</SelectItem>
                                                <SelectItem value="Foundation">Foundation / Pathway</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Lead Ingestion Channel</Label>
                                        <Select
                                            value={form.leadSource}
                                            onValueChange={(val) => setForm({ ...form, leadSource: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="facebook_ads">Meta / Facebook Ads</SelectItem>
                                                <SelectItem value="google_search">Google Search PPC</SelectItem>
                                                <SelectItem value="tiktok">TikTok Campaign</SelectItem>
                                                <SelectItem value="walk_in">Walk-in Visit</SelectItem>
                                                <SelectItem value="website_inquiry">Website Portal Form</SelectItem>
                                                <SelectItem value="sub_agent">Sub-Agent Referral</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Priority Level</Label>
                                        <Select
                                            value={form.priority}
                                            onValueChange={(val) => setForm({ ...form, priority: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="high">Hot (Immediate Action)</SelectItem>
                                                <SelectItem value="medium">Warm (Follow-up 24h)</SelectItem>
                                                <SelectItem value="low">Cold / Nurturing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <Label className="text-xs text-slate-700">Assign To Counselor</Label>
                                        <Select
                                            value={form.assignedAgentId}
                                            onValueChange={(val) => setForm({ ...form, assignedAgentId: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue placeholder="Select counselor from team" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                {agents.map((ag) => (
                                                    <SelectItem key={ag.id} value={ag.id}>
                                                        {ag.name} ({ag.branch ? ag.branch.split(' ')[0] : 'Office'})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Conversation Notes / Requirements</Label>
                                    <Input
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        placeholder="IELTS score, budget constraints, intake preference..."
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpenModal(false)} className="text-xs">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold">
                                        Save Lead to Pipeline
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Quick KPI stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Active Pipeline Leads</div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{leads.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Hot Leads Priority</div>
                    <div className="text-2xl font-extrabold text-rose-600 mt-1 flex items-center gap-1.5">
                        {hotLeadsCount} <Flame className="w-5 h-5 fill-rose-500 text-rose-600" />
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">In Counseling Stage</div>
                    <div className="text-2xl font-extrabold text-amber-600 mt-1">
                        {leads.filter((l) => l.status === 'counseling_scheduled').length}
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Estimated Pipeline Value</div>
                    <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                        ${totalPipelineValue.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Filters and Selection Header Bar */}
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-72">
                    <div className="relative w-full">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <Input
                            placeholder="Search lead name, phone, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 bg-slate-50 border-slate-300 text-slate-800 text-xs rounded-xl focus:border-primary focus:bg-white"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="ghost" className="text-xs text-primary font-semibold hover:bg-primary/10">
                        Filter
                    </Button>
                </form>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Select All Page Button */}
                    {paginatedLeads.length > 0 && (
                        <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                        >
                            {isAllCurrentPageSelected ? (
                                <CheckSquare className="w-4 h-4 text-primary" />
                            ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                            )}
                            <span>Select Page ({paginatedLeads.length})</span>
                        </button>
                    )}

                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                        <SelectTrigger className="w-full sm:w-40 bg-white border-slate-300 text-slate-800 text-xs rounded-xl">
                            <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                            <SelectItem value="all">All Channels</SelectItem>
                            <SelectItem value="facebook_ads">Meta Ads</SelectItem>
                            <SelectItem value="google_search">Google Search</SelectItem>
                            <SelectItem value="walk_in">Walk-in</SelectItem>
                            <SelectItem value="website_inquiry">Website</SelectItem>
                            <SelectItem value="sub_agent">Sub-Agent</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-44 bg-white border-slate-300 text-slate-800 text-xs rounded-xl">
                            <SelectValue placeholder="Pipeline Stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="new">New Inquiries</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="counseling_scheduled">Counseling Scheduled</SelectItem>
                            <SelectItem value="documents_pending">Documents Pending</SelectItem>
                            <SelectItem value="converted_to_student">Converted to Student</SelectItem>
                            <SelectItem value="cold_lost">Cold / Dropped</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Leads Cards Grid */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                        Loading leads...
                    </div>
                ) : paginatedLeads.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl bg-white/80 border border-slate-200 text-slate-500 text-xs">
                        No leads found in this pipeline filter.
                    </div>
                ) : (
                    paginatedLeads.map((lead) => {
                        const isSelected = selectedIds.includes(lead.id);
                        return (
                            <div
                                key={lead.id}
                                className={`p-5 rounded-2xl border transition-all space-y-3 shadow-sm ${
                                    isSelected
                                        ? 'bg-blue-50/60 border-primary/50 shadow-md ring-1 ring-primary/30'
                                        : 'bg-white/90 backdrop-blur-xl border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div className="flex items-start sm:items-center gap-3">
                                        {/* Row Checkbox */}
                                        <button
                                            type="button"
                                            onClick={() => toggleSelect(lead.id)}
                                            className="mt-0.5 sm:mt-0 text-slate-400 hover:text-primary transition-colors"
                                            title={isSelected ? 'Deselect lead' : 'Select lead for bulk action'}
                                        >
                                            {isSelected ? (
                                                <CheckSquare className="w-5 h-5 text-primary fill-blue-50" />
                                            ) : (
                                                <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                                            )}
                                        </button>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold text-base text-slate-900">{lead.fullName}</h3>
                                                <span
                                                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                                        sourceBadge[lead.leadSource] || 'bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}
                                                >
                                                    {lead.leadSource ? lead.leadSource.replace(/_/g, ' ') : 'Channel'}
                                                </span>
                                                {lead.priority === 'high' && (
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                                        <Flame className="w-3 h-3 fill-rose-500 text-rose-600" /> Hot
                                                    </span>
                                                )}
                                                <span
                                                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                                                        statusColors[lead.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}
                                                >
                                                    {lead.status ? lead.status.replace(/_/g, ' ') : 'new'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {lead.phone}
                                                </span>
                                                {lead.email && (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {lead.email}
                                                    </span>
                                                )}
                                                {lead.city && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {lead.city}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        {lead.status !== 'converted_to_student' && (
                                            <Button
                                                onClick={() => handleConvertLead(lead.id)}
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-md shadow-emerald-600/20 font-semibold rounded-xl"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" />
                                                Convert to Student File
                                            </Button>
                                        )}

                                        <Select
                                            value={lead.status}
                                            onValueChange={(val) => handleUpdateStatus(lead.id, val)}
                                        >
                                            <SelectTrigger className="w-44 bg-white border-slate-300 text-slate-800 text-xs h-9 rounded-xl">
                                                <SelectValue placeholder="Pipeline Stage" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="new">New Inquiry</SelectItem>
                                                <SelectItem value="contacted">Contacted</SelectItem>
                                                <SelectItem value="counseling_scheduled">Counseling Scheduled</SelectItem>
                                                <SelectItem value="documents_pending">Documents Pending</SelectItem>
                                                <SelectItem value="converted_to_student">Converted to Student</SelectItem>
                                                <SelectItem value="cold_lost">Cold / Dropped</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs">
                                    <div className="flex flex-wrap gap-4 text-slate-700">
                                        <span>
                                            <strong className="text-slate-500">Target: </strong>
                                            {lead.preferredCountry || 'Abroad'} ({lead.preferredDegree || 'Higher Ed'})
                                        </span>
                                        <span>
                                            <strong className="text-slate-500">Assigned Counselor: </strong>
                                            <span className="text-amber-700 font-semibold">{lead.assignedAgentName || 'Unassigned'}</span>
                                        </span>
                                    </div>
                                    <div className="text-emerald-700 font-bold">
                                        Potential Commission: ${Number(lead.estimatedCommission || 0).toLocaleString()}
                                    </div>
                                </div>

                                {lead.notes && (
                                    <div className="text-xs text-slate-600 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/80">
                                        <span className="font-semibold text-slate-800">Notes: </span>
                                        {lead.notes}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination Component */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl px-4 shadow-sm mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={leads.length}
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
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                            {selectedIds.length}
                        </span>
                        <span className="text-xs font-bold text-slate-900">Leads Selected</span>
                    </div>

                    {/* Bulk Status Select */}
                    <div className="flex items-center gap-1.5">
                        <Select onValueChange={handleBulkStatusChange} disabled={bulkUpdating}>
                            <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-300 w-40">
                                <SelectValue placeholder="Update Stage" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                <SelectItem value="new">New Inquiry</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="counseling_scheduled">Counseling Scheduled</SelectItem>
                                <SelectItem value="documents_pending">Documents Pending</SelectItem>
                                <SelectItem value="converted_to_student">Converted to Student</SelectItem>
                                <SelectItem value="cold_lost">Cold / Dropped</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bulk Counselor Assign */}
                    <div className="flex items-center gap-1.5">
                        <Select onValueChange={handleBulkAgentAssign} disabled={bulkUpdating}>
                            <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-300 w-40">
                                <SelectValue placeholder="Assign Counselor" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                {agents.map((ag) => (
                                    <SelectItem key={ag.id} value={ag.id}>
                                        {ag.name}
                                    </SelectItem>
                                ))}
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
