'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AgentsManagementPage() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const [editingAgent, setEditingAgent] = useState(null);
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

    const handleCreateAgent = async (e) => {
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

    const handleUpdateAgent = async (e) => {
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

    const fUSD = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <Users className="w-7 h-7 text-primary" />
                        Counselors & Agent Network
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
                                        <Label className="text-xs text-slate-700">Branch / Office</Label>
                                        <Input
                                            value={form.branch}
                                            onChange={(e) => setForm({ ...form, branch: e.target.value })}
                                            placeholder="Dhaka, Chittagong, Sylhet, London"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Commission Share (%)</Label>
                                        <Input
                                            type="number"
                                            value={form.commissionRate}
                                            onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })}
                                            placeholder="15.0"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Account Role</Label>
                                        <Select
                                            value={form.role}
                                            onValueChange={(val) => setForm({ ...form, role: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="agent">Counselor / Agent</SelectItem>
                                                <SelectItem value="admin">Branch Administrator</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpenModal(false)} className="text-xs">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold">
                                        Provision Account
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
                    <h2 className="font-bold text-sm text-slate-900">Agency Counselor Rankings & Payout Balance</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
                        <div className="text-slate-500 font-medium">Total Partner Counselors</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-0.5">{agents.length} Active</div>
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

            {/* Agents Directory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <div className="col-span-2 text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                        Loading counselors directory...
                    </div>
                ) : (
                    agents.map((agent) => (
                        <div
                            key={agent.id}
                            className="p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all space-y-4 shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-base">
                                        {agent.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-base text-slate-900 flex items-center gap-2">
                                            {agent.name}
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 capitalize">
                                                {agent.role}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            {agent.branch || 'Head Office'}
                                        </div>
                                    </div>
                                </div>

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
                                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Commission Split</div>
                                    <div className="font-bold text-amber-700 mt-0.5 flex items-center gap-0.5">
                                        <Percent className="w-3 h-3" />
                                        {agent.commissionRate}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Student Files</div>
                                    <div className="font-bold text-slate-900 mt-0.5">
                                        {agent.totalStudents || 0} Dossiers
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Commission Earned</div>
                                    <div className="font-bold text-emerald-600 mt-0.5">
                                        {fUSD(agent.totalCommissionAccrued || 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Agent Modal */}
            <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
                <DialogContent className="max-w-md bg-white border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Configure Agent Terms: {editingAgent?.name}</DialogTitle>
                    </DialogHeader>

                    {editingAgent && (
                        <form onSubmit={handleUpdateAgent} className="space-y-3 pt-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-700">Branch Location</Label>
                                <Input
                                    value={editingAgent.branch || ''}
                                    onChange={(e) => setEditingAgent({ ...editingAgent, branch: e.target.value })}
                                    className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-700">Commission Rate (%)</Label>
                                <Input
                                    type="number"
                                    value={editingAgent.commissionRate}
                                    onChange={(e) => setEditingAgent({ ...editingAgent, commissionRate: Number(e.target.value) })}
                                    className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-700">Account Status</Label>
                                <Select
                                    value={editingAgent.status}
                                    onValueChange={(val) => setEditingAgent({ ...editingAgent, status: val })}
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
                                <Button type="button" variant="ghost" onClick={() => setOpenEditModal(false)} className="text-xs">
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold">
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
