'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import toast from 'react-hot-toast';
import {
    Users,
    Plus,
    UserCheck,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    Trophy,
    Percent,
    Shield,
    Edit,
    CheckCircle2,
    Briefcase,
    Search,
    CheckSquare,
    Square,
    Trash2,
    X,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Pagination from '@/components/Pagination';

export default function AgentsManagementPage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Search and filter states
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkUpdating, setBulkUpdating] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        branch: 'Dhaka Banani Branch',
        role: 'agent',
        commissionRate: 15.0,
        password: 'Agent@GPH2026!',
    });

    const [editingAgent, setEditingAgent] = useState<any>(null);
    const [openEditModal, setOpenEditModal] = useState(false);

    const loadAgents = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/agents').then((r) => r.json());
            if (res.success) setAgents(res.agents);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load counselor directory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAgents();
    }, []);

    // Filtered & Paginated Agents
    const filteredAgents = useMemo(() => {
        let list = agents;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (a) =>
                    a.name?.toLowerCase().includes(q) ||
                    a.email?.toLowerCase().includes(q) ||
                    a.phone?.toLowerCase().includes(q) ||
                    a.branch?.toLowerCase().includes(q)
            );
        }
        if (statusFilter !== 'all') {
            list = list.filter((a) => a.status === statusFilter);
        }
        return list;
    }, [agents, search, statusFilter]);

    const paginatedAgents = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredAgents.slice(start, start + pageSize);
    }, [filteredAgents, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAgents.length / pageSize) || 1;

    // Bulk selection helpers
    const allCurrentPageSelected = useMemo(() => {
        return (
            paginatedAgents.length > 0 &&
            paginatedAgents.every((a) => selectedIds.includes(a.id))
        );
    }, [paginatedAgents, selectedIds]);

    const handleToggleSelectAll = () => {
        if (allCurrentPageSelected) {
            const pageIds = new Set(paginatedAgents.map((a) => a.id));
            setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
        } else {
            const newSet = new Set([...selectedIds, ...paginatedAgents.map((a) => a.id)]);
            setSelectedIds(Array.from(newSet));
        }
    };

    const handleToggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkStatusChange = async (newStatus: string) => {
        if (!newStatus || selectedIds.length === 0) return;
        setBulkUpdating(true);
        const toastId = toast.loading(`Updating ${selectedIds.length} counselors...`);
        try {
            const res = await fetch('/api/agents/bulk', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds, status: newStatus }),
            }).then((r) => r.json());

            if (res.success) {
                toast.success(`Updated ${res.updatedCount || selectedIds.length} agents!`, {
                    id: toastId,
                });
                setSelectedIds([]);
                await loadAgents();
            } else {
                toast.error(res.message || 'Bulk update failed', { id: toastId });
            }
        } catch {
            toast.error('Network error during bulk update', { id: toastId });
        } finally {
            setBulkUpdating(false);
        }
    };

    const handleBulkDeactivate = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Deactivate ${selectedIds.length} counselor accounts?`)) return;
        setBulkUpdating(true);
        const toastId = toast.loading(`Deactivating ${selectedIds.length} counselors...`);
        try {
            const res = await fetch('/api/agents/bulk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds }),
            }).then((r) => r.json());

            if (res.success) {
                toast.success(`Deactivated ${res.deletedCount || selectedIds.length} agents!`, {
                    id: toastId,
                });
                setSelectedIds([]);
                await loadAgents();
            } else {
                toast.error(res.message || 'Deactivation failed', { id: toastId });
            }
        } catch {
            toast.error('Network error', { id: toastId });
        } finally {
            setBulkUpdating(false);
        }
    };

    const handleCreateAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Provisioning counselor account...');
        try {
            const res = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Agent account provisioned for ${form.name}`, { id: toastId });
                setOpenModal(false);
                setForm({
                    name: '',
                    email: '',
                    phone: '',
                    branch: 'Dhaka Banani Branch',
                    role: 'agent',
                    commissionRate: 15.0,
                    password: 'Agent@GPH2026!',
                });
                loadAgents();
            } else {
                toast.error(data.message || 'Failed to onboard agent', { id: toastId });
            }
        } catch {
            toast.error('Error creating agent', { id: toastId });
        }
    };

    const handleUpdateAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAgent) return;

        const toastId = toast.loading('Updating counselor terms...');
        try {
            const res = await fetch(`/api/agents/${editingAgent.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingAgent),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Terms updated successfully', { id: toastId });
                setOpenEditModal(false);
                loadAgents();
            } else {
                toast.error(data.message || 'Update failed', { id: toastId });
            }
        } catch {
            toast.error('Error updating agent', { id: toastId });
        }
    };

    const fUSD = (n: number) =>
        `$${Number(n || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <Users className="w-7 h-7 text-primary" />
                        Counselors &amp; Agent Network
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Manage education counselors, branch offices, automated commission splits, and sales performance.
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-xs gap-1.5 shadow-md shadow-primary/25 font-semibold">
                                <Plus className="w-4 h-4" />
                                Onboard New Counselor
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg bg-white border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                    <UserCheck className="w-5 h-5 text-primary" />
                                    Provision Agent Credentials
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleCreateAgent} className="space-y-3 pt-2">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Full Name *</Label>
                                    <Input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                        placeholder="Counselor Name"
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Work Email *</Label>
                                        <Input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                            placeholder="agent@globalpathwayhub.com"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Phone (WhatsApp)</Label>
                                        <Input
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="+880 1711-XXXXXX"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Branch Location</Label>
                                        <Input
                                            value={form.branch}
                                            onChange={(e) => setForm({ ...form, branch: e.target.value })}
                                            placeholder="e.g. Dhaka Banani"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Commission Rate (%)</Label>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            value={form.commissionRate}
                                            onChange={(e) =>
                                                setForm({ ...form, commissionRate: Number(e.target.value) })
                                            }
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-700">Initial Password</Label>
                                    <Input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setOpenModal(false)}
                                        className="text-xs"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold"
                                    >
                                        Create Account
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Performance Leaderboard Banner */}
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h2 className="font-bold text-sm text-slate-900">
                        Agency Counselor Rankings &amp; Payout Balance
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
                        <div className="text-slate-500 font-medium">Total Counselors</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                            {agents.length} Total ({agents.filter((a) => a.status === 'active').length} Active)
                        </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
                        <div className="text-slate-500 font-medium">Total Student Pipeline Assigned</div>
                        <div className="text-xl font-extrabold text-primary mt-0.5">
                            {agents.reduce((acc, a) => acc + (a.totalStudents || 0), 0)} Students
                        </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
                        <div className="text-slate-500 font-medium">Total Commission Generated for Agents</div>
                        <div className="text-xl font-extrabold text-emerald-600 mt-0.5">
                            {fUSD(agents.reduce((acc, a) => acc + (a.totalCommissionAccrued || 0), 0))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Selection Toolbar */}
            <div className="p-4 rounded-xl bg-white/80 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Filter counselors by name, email, branch..."
                            className="pl-8 bg-white border-slate-200 text-xs h-9 rounded-lg"
                        />
                    </div>

                    {/* Status filter */}
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => {
                            setStatusFilter(val);
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-36 h-9 bg-white border-slate-200 text-xs rounded-lg">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active Only</SelectItem>
                            <SelectItem value="inactive">Inactive / Suspended</SelectItem>
                        </SelectContent>
                    </Select>

                    {(search || statusFilter !== 'all') && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setStatusFilter('all');
                                setCurrentPage(1);
                            }}
                            className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
                        >
                            <X className="w-3 h-3" /> Clear
                        </button>
                    )}
                </div>

                {/* Select All on Current Page */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                    >
                        {allCurrentPageSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                        )}
                        <span>Select All on Page</span>
                        {selectedIds.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                                {selectedIds.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Agents Directory Grid */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                        Loading counselors directory...
                    </div>
                ) : filteredAgents.length === 0 ? (
                    <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 text-slate-400 text-xs font-medium">
                        No counselors found matching filters.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paginatedAgents.map((agent: any) => {
                            const isSelected = selectedIds.includes(agent.id);
                            return (
                                <div
                                    key={agent.id}
                                    onClick={() => handleToggleSelect(agent.id)}
                                    className={`p-5 rounded-2xl bg-white/90 backdrop-blur-xl border transition-all space-y-4 shadow-sm cursor-pointer ${
                                        isSelected
                                            ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                                            : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            {/* Checkbox */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleSelect(agent.id);
                                                }}
                                                className="text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0"
                                            >
                                                {isSelected ? (
                                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-slate-300" />
                                                )}
                                            </button>

                                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-base flex-shrink-0">
                                                {agent.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-base text-slate-900 flex items-center gap-2">
                                                    {agent.name}
                                                    <span
                                                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                                                            agent.status === 'active'
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                                        }`}
                                                    >
                                                        {agent.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                    {agent.branch || 'Head Office'}
                                                </div>
                                            </div>
                                        </div>

                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                onClick={() => {
                                                    setEditingAgent(agent);
                                                    setOpenEditModal(true);
                                                }}
                                                size="sm"
                                                variant="outline"
                                                className="border-slate-300 bg-white hover:bg-slate-50 text-xs text-slate-700 gap-1 rounded-xl"
                                            >
                                                <Edit className="w-3 h-3" />
                                                Configure
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-500 space-y-1">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-slate-400" /> {agent.email}
                                        </div>
                                        {agent.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-slate-400" /> {agent.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs">
                                        <div>
                                            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                                                Commission Split
                                            </div>
                                            <div className="font-bold text-amber-700 mt-0.5 flex items-center gap-0.5">
                                                <Percent className="w-3 h-3" />
                                                {agent.commissionRate}%
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                                                Student Files
                                            </div>
                                            <div className="font-bold text-slate-900 mt-0.5">
                                                {agent.totalStudents || 0} Dossiers
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                                                Commission Earned
                                            </div>
                                            <div className="font-bold text-emerald-600 mt-0.5">
                                                {fUSD(agent.totalCommissionAccrued || 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {filteredAgents.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredAgents.length}
                        pageSize={pageSize}
                        pageSizeOptions={[4, 6, 12, 24]}
                        onPageChange={(p) => setCurrentPage(p)}
                        onPageSizeChange={(s) => {
                            setPageSize(s);
                            setCurrentPage(1);
                        }}
                        className="bg-white/80 rounded-xl border border-slate-200 shadow-xs px-3"
                    />
                )}
            </div>

            {/* Floating Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-4 text-slate-800 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                            {selectedIds.length}
                        </span>
                        <span className="text-xs font-bold text-slate-900">Counselors Selected</span>
                    </div>

                    {/* Bulk Status Select */}
                    <div className="flex items-center gap-1.5">
                        <Select onValueChange={handleBulkStatusChange} disabled={bulkUpdating}>
                            <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-300 w-36">
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                <SelectItem value="active">Set Active</SelectItem>
                                <SelectItem value="inactive">Set Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bulk Deactivate Button */}
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleBulkDeactivate}
                        disabled={bulkUpdating}
                        className="h-8 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-sm"
                    >
                        {bulkUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Deactivate Selected
                    </Button>

                    <button
                        type="button"
                        onClick={() => setSelectedIds([])}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition-colors ml-auto"
                    >
                        <X className="w-3.5 h-3.5" /> Deselect All
                    </button>
                </div>
            )}

            {/* Edit Agent Modal */}
            <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
                <DialogContent className="max-w-md bg-white border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            Configure Agent Terms: {editingAgent?.name}
                        </DialogTitle>
                    </DialogHeader>

                    {editingAgent && (
                        <form onSubmit={handleUpdateAgent} className="space-y-3 pt-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-700">Branch Location</Label>
                                <Input
                                    value={editingAgent.branch || ''}
                                    onChange={(e) =>
                                        setEditingAgent({ ...editingAgent, branch: e.target.value })
                                    }
                                    className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-700">Commission Rate (%)</Label>
                                <Input
                                    type="number"
                                    value={editingAgent.commissionRate}
                                    onChange={(e) =>
                                        setEditingAgent({
                                            ...editingAgent,
                                            commissionRate: Number(e.target.value),
                                        })
                                    }
                                    className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-700">Account Status</Label>
                                <Select
                                    value={editingAgent.status}
                                    onValueChange={(val) =>
                                        setEditingAgent({ ...editingAgent, status: val })
                                    }
                                >
                                    <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 text-slate-800">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Suspended / Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setOpenEditModal(false)}
                                    className="text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold"
                                >
                                    Update Terms
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
