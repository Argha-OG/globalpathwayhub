'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/Pagination';
import toast from 'react-hot-toast';
import {
    GraduationCap,
    Plus,
    Search,
    FileText,
    Upload,
    CheckCircle2,
    Clock,
    AlertCircle,
    UserCheck,
    Globe,
    BookOpen,
    Eye,
    Trash2,
    ExternalLink,
    Filter,
    CheckSquare,
    Square,
    Users,
    Layers,
    X,
    ChevronDown,
    Mail,
    Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const statusColors = {
    counseling: 'bg-blue-50 text-blue-700 border-blue-200',
    documents_pending: 'bg-amber-50 text-amber-700 border-amber-200',
    applied: 'bg-purple-50 text-purple-700 border-purple-200',
    conditional_offer: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    unconditional_offer: 'bg-teal-50 text-teal-700 border-teal-200',
    cas_issued: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    visa_lodged: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    visa_approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    enrolled: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function StudentManagementPage() {
    const [students, setStudents] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
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
        fullName: '',
        email: '',
        phone: '',
        passportNumber: '',
        targetCountry: 'United Kingdom',
        targetUniversity: '',
        targetCourse: '',
        targetIntake: 'September 2026',
        englishTest: 'IELTS',
        englishScore: '',
        highestEducation: '',
        gpa: '',
        assignedAgentId: '',
        notes: '',
    });

    // Document Modal state
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentDocs, setStudentDocs] = useState([]);
    const [openDocsModal, setOpenDocsModal] = useState(false);
    const [docFile, setDocFile] = useState(null);
    const [docTitle, setDocTitle] = useState('');
    const [docType, setDocType] = useState('passport');
    const [uploadingDoc, setUploadingDoc] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

            const [stuRes, agtRes] = await Promise.all([
                fetch(`/api/students?${params.toString()}`).then((r) => r.json()),
                fetch('/api/agents').then((r) => r.json()),
            ]);

            if (stuRes.success) setStudents(stuRes.students);
            if (agtRes.success) setAgents(agtRes.agents);
        } catch (err) {
            console.error('Error fetching student data:', err);
            toast.error('Failed to load student dossiers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        setCurrentPage(1);
        setSelectedIds([]);
    }, [statusFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadData();
        setCurrentPage(1);
        setSelectedIds([]);
    };

    // Client-side pagination slice
    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return students.slice(start, start + pageSize);
    }, [students, currentPage, pageSize]);

    const totalPages = Math.ceil(students.length / pageSize) || 1;

    // Bulk selection helpers
    const isAllCurrentPageSelected =
        paginatedStudents.length > 0 &&
        paginatedStudents.every((s) => selectedIds.includes(s.id));

    const toggleSelectAll = () => {
        if (isAllCurrentPageSelected) {
            // Deselect current page items
            const pageIds = new Set(paginatedStudents.map((s) => s.id));
            setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
        } else {
            // Select all current page items
            const newSet = new Set([...selectedIds, ...paginatedStudents.map((s) => s.id)]);
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

    // Bulk action: Status update
    const handleBulkStatusChange = async (newStatus) => {
        if (!newStatus || selectedIds.length === 0) return;
        const toastId = toast.loading(`Updating ${selectedIds.length} student files...`);
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/students/bulk', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds, status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Successfully updated ${data.updatedCount} students to ${newStatus.replace(/_/g, ' ')}`, { id: toastId });
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

    // Bulk action: Agent Assignment
    const handleBulkAgentAssign = async (agentId) => {
        if (!agentId || selectedIds.length === 0) return;
        const agentObj = agents.find((a) => a.id === agentId);
        const toastId = toast.loading(`Assigning ${selectedIds.length} files to ${agentObj?.name || 'Agent'}...`);
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/students/bulk', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds, assignedAgentId: agentId }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Assigned ${data.updatedCount} dossiers to ${agentObj?.name || 'Counselor'}`, { id: toastId });
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

    // Bulk action: Delete
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} student dossiers permanently?`)) return;

        const toastId = toast.loading(`Deleting ${selectedIds.length} dossiers...`);
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/students/bulk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Deleted ${data.deletedCount} dossiers successfully`, { id: toastId });
                setSelectedIds([]);
                loadData();
            } else {
                toast.error(data.message || 'Bulk delete failed', { id: toastId });
            }
        } catch {
            toast.error('Network error during deletion', { id: toastId });
        } finally {
            setBulkUpdating(false);
        }
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Creating student dossier profile...');
        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Dossier created for ${form.fullName}`, { id: toastId });
                setOpenModal(false);
                setForm({
                    fullName: '',
                    email: '',
                    phone: '',
                    passportNumber: '',
                    targetCountry: 'United Kingdom',
                    targetUniversity: '',
                    targetCourse: '',
                    targetIntake: 'September 2026',
                    englishTest: 'IELTS',
                    englishScore: '',
                    highestEducation: '',
                    gpa: '',
                    assignedAgentId: '',
                    notes: '',
                });
                loadData();
            } else {
                toast.error(data.message || 'Failed to create student dossier', { id: toastId });
            }
        } catch {
            toast.error('Error creating student', { id: toastId });
        }
    };

    const handleUpdateStatus = async (studentId, newStatus) => {
        const toastId = toast.loading('Updating stage...');
        try {
            const res = await fetch(`/api/students/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Stage updated', { id: toastId });
                loadData();
            } else {
                toast.error(data.message || 'Update failed', { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error('Error updating stage', { id: toastId });
        }
    };

    const openDocumentsVault = async (student) => {
        setSelectedStudent(student);
        setOpenDocsModal(true);
        try {
            const res = await fetch(`/api/students/${student.id}`).then((r) => r.json());
            if (res.success) {
                setStudentDocs(res.documents || []);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load document vault');
        }
    };

    const handleUploadDoc = async (e) => {
        e.preventDefault();
        if (!docFile || !selectedStudent) return;

        setUploadingDoc(true);
        const toastId = toast.loading(`Uploading ${docFile.name} to Cloudflare R2...`);
        const data = new FormData();
        data.append('file', docFile);
        data.append('title', docTitle || docFile.name);
        data.append('documentType', docType);

        try {
            const res = await fetch(`/api/students/${selectedStudent.id}/documents`, {
                method: 'POST',
                body: data,
            });
            const result = await res.json();
            if (result.success) {
                toast.success('File uploaded and verified in R2', { id: toastId });
                setDocFile(null);
                setDocTitle('');
                // Refresh docs
                const updated = await fetch(`/api/students/${selectedStudent.id}`).then((r) => r.json());
                if (updated.success) setStudentDocs(updated.documents || []);
            } else {
                toast.error(result.message || 'Upload failed', { id: toastId });
            }
        } catch {
            toast.error('Upload error', { id: toastId });
        } finally {
            setUploadingDoc(false);
        }
    };

    const handleDeleteDoc = async (docId) => {
        if (!window.confirm('Delete this document from Cloudflare R2?')) return;
        const toastId = toast.loading('Removing file from R2...');
        try {
            const res = await fetch(`/api/students/${selectedStudent.id}/documents?documentId=${docId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Document deleted', { id: toastId });
                const updated = await fetch(`/api/students/${selectedStudent.id}`).then((r) => r.json());
                if (updated.success) setStudentDocs(updated.documents || []);
            } else {
                toast.error(data.message || 'Failed to delete document', { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error('Error deleting document', { id: toastId });
        }
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <GraduationCap className="w-7 h-7 text-primary" />
                        Student File & Dossier Vault
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        End-to-end student lifecycle: KYC, academic credentials, Cloudflare R2 document storage, and visa status.
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-xs gap-1.5 shadow-md shadow-primary/25 font-semibold">
                                <Plus className="w-4 h-4" />
                                Create Student Dossier
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto shadow-2xl rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                    New Student Dossier Profile
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleCreateStudent} className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Full Legal Name *</Label>
                                        <Input
                                            value={form.fullName}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                            required
                                            placeholder="As on passport"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Student Email *</Label>
                                        <Input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                            placeholder="student@example.com"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Phone (WhatsApp)</Label>
                                        <Input
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="+880 1700-000000"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Passport Number</Label>
                                        <Input
                                            value={form.passportNumber}
                                            onChange={(e) => setForm({ ...form, passportNumber: e.target.value })}
                                            placeholder="A01234567"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Target Country</Label>
                                        <Select
                                            value={form.targetCountry}
                                            onValueChange={(val) => setForm({ ...form, targetCountry: val })}
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
                                                <SelectItem value="Sweden">Sweden</SelectItem>
                                                <SelectItem value="Malaysia">Malaysia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Target Intake</Label>
                                        <Select
                                            value={form.targetIntake}
                                            onValueChange={(val) => setForm({ ...form, targetIntake: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="September 2026">September / Fall 2026</SelectItem>
                                                <SelectItem value="January 2027">January / Spring 2027</SelectItem>
                                                <SelectItem value="May 2027">May / Summer 2027</SelectItem>
                                                <SelectItem value="September 2027">September 2027</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Target University</Label>
                                        <Input
                                            value={form.targetUniversity}
                                            onChange={(e) => setForm({ ...form, targetUniversity: e.target.value })}
                                            placeholder="e.g. University of Manchester"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Intended Program</Label>
                                        <Input
                                            value={form.targetCourse}
                                            onChange={(e) => setForm({ ...form, targetCourse: e.target.value })}
                                            placeholder="e.g. M.Sc Data Science"
                                            className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">English Test & Score</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={form.englishTest}
                                                onChange={(e) => setForm({ ...form, englishTest: e.target.value })}
                                                placeholder="IELTS"
                                                className="bg-white border-slate-300 text-slate-800 text-xs w-28"
                                            />
                                            <Input
                                                value={form.englishScore}
                                                onChange={(e) => setForm({ ...form, englishScore: e.target.value })}
                                                placeholder="Score (e.g. 7.0)"
                                                className="bg-white border-slate-300 text-slate-800 text-xs flex-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-700">Assigned Counselor / Agent</Label>
                                        <Select
                                            value={form.assignedAgentId}
                                            onValueChange={(val) => setForm({ ...form, assignedAgentId: val })}
                                        >
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                                <SelectValue placeholder="Select Counselor" />
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
                                    <Label className="text-xs text-slate-700">Counseling Notes</Label>
                                    <Input
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        placeholder="Special requirements, scholarship requests, etc."
                                        className="bg-white border-slate-300 text-slate-800 text-xs focus:border-primary"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpenModal(false)} className="text-xs">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white text-xs">
                                        Save Dossier
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filter and Selection Header Bar */}
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80">
                    <div className="relative w-full">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <Input
                            placeholder="Search student code, name, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 bg-slate-50 border-slate-300 text-slate-800 text-xs rounded-xl focus:border-primary focus:bg-white"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="ghost" className="text-xs text-primary font-semibold hover:bg-primary/10">
                        Filter
                    </Button>
                </form>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Select All on Page Button */}
                    {paginatedStudents.length > 0 && (
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
                            <span>Select Page ({paginatedStudents.length})</span>
                        </button>
                    )}

                    <div className="flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-52 bg-white border-slate-300 text-slate-800 text-xs rounded-xl">
                                <SelectValue placeholder="Status Filter" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                <SelectItem value="all">All Statuses ({students.length})</SelectItem>
                                <SelectItem value="counseling">In Counseling</SelectItem>
                                <SelectItem value="documents_pending">Documents Pending</SelectItem>
                                <SelectItem value="applied">Application Submitted</SelectItem>
                                <SelectItem value="conditional_offer">Conditional Offer</SelectItem>
                                <SelectItem value="unconditional_offer">Unconditional Offer</SelectItem>
                                <SelectItem value="cas_issued">CAS / I-20 Issued</SelectItem>
                                <SelectItem value="visa_lodged">Visa Lodged</SelectItem>
                                <SelectItem value="visa_approved">Visa Approved</SelectItem>
                                <SelectItem value="enrolled">Enrolled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Students Dossiers List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                        Loading student dossiers...
                    </div>
                ) : paginatedStudents.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl bg-white/80 border border-slate-200 text-slate-500 text-xs">
                        No student dossiers found matching your criteria.
                    </div>
                ) : (
                    paginatedStudents.map((student) => {
                        const isSelected = selectedIds.includes(student.id);
                        return (
                            <div
                                key={student.id}
                                className={`p-5 rounded-2xl border transition-all space-y-4 shadow-sm ${
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
                                            onClick={() => toggleSelect(student.id)}
                                            className="mt-0.5 sm:mt-0 text-slate-400 hover:text-primary transition-colors"
                                            title={isSelected ? 'Deselect student' : 'Select student for bulk actions'}
                                        >
                                            {isSelected ? (
                                                <CheckSquare className="w-5 h-5 text-primary fill-blue-50" />
                                            ) : (
                                                <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                                            )}
                                        </button>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-bold border border-primary/20">
                                                    {student.studentCode || 'GPH-FILE'}
                                                </span>
                                                <h3 className="font-bold text-base text-slate-900">{student.fullName}</h3>
                                                <span
                                                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                                                        statusColors[student.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}
                                                >
                                                    {student.status ? student.status.replace(/_/g, ' ') : 'counseling'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {student.email}</span>
                                                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {student.phone || 'No phone'}</span>
                                                {student.passportNumber && <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400" /> Passport: {student.passportNumber}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <Button
                                            onClick={() => openDocumentsVault(student)}
                                            size="sm"
                                            variant="outline"
                                            className="border-primary/40 text-primary hover:bg-primary/10 text-xs gap-1.5 font-medium rounded-xl"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            Document Vault (R2)
                                        </Button>

                                        <Select
                                            value={student.status}
                                            onValueChange={(val) => handleUpdateStatus(student.id, val)}
                                        >
                                            <SelectTrigger className="w-40 bg-white border-slate-300 text-slate-800 text-xs h-9 rounded-xl">
                                                <SelectValue placeholder="Update Stage" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                                <SelectItem value="counseling">Counseling</SelectItem>
                                                <SelectItem value="documents_pending">Documents Pending</SelectItem>
                                                <SelectItem value="applied">Application Lodged</SelectItem>
                                                <SelectItem value="conditional_offer">Conditional Offer</SelectItem>
                                                <SelectItem value="unconditional_offer">Unconditional Offer</SelectItem>
                                                <SelectItem value="cas_issued">CAS / I-20</SelectItem>
                                                <SelectItem value="visa_lodged">Visa Lodged</SelectItem>
                                                <SelectItem value="visa_approved">Visa Approved</SelectItem>
                                                <SelectItem value="enrolled">Enrolled</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Academic & Target Pathway Details */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs">
                                    <div>
                                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Destination & Intake</div>
                                        <div className="font-semibold text-slate-800 mt-0.5">
                                            {student.targetCountry || 'Abroad'} • {student.targetIntake || '2026'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">University & Program</div>
                                        <div className="font-semibold text-slate-800 mt-0.5 truncate">
                                            {student.targetUniversity || 'Pending selection'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">English & Academics</div>
                                        <div className="font-semibold text-slate-800 mt-0.5">
                                            {student.englishTest}: {student.englishScore || 'N/A'} (GPA: {student.gpa || 'N/A'})
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Assigned Counselor</div>
                                        <div className="font-semibold text-amber-700 mt-0.5">
                                            {student.assignedAgentName || 'Head Office Counselor'}
                                        </div>
                                    </div>
                                </div>

                                {student.notes && (
                                    <div className="text-xs text-slate-600 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/80">
                                        <span className="font-semibold text-slate-800">File Notes: </span>
                                        {student.notes}
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
                    totalItems={students.length}
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
                        <span className="text-xs font-bold text-slate-900">Selected</span>
                    </div>

                    {/* Bulk Status Select */}
                    <div className="flex items-center gap-1.5">
                        <Select onValueChange={handleBulkStatusChange} disabled={bulkUpdating}>
                            <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-300 w-40">
                                <SelectValue placeholder="Update Stage" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-800">
                                <SelectItem value="counseling">Counseling</SelectItem>
                                <SelectItem value="documents_pending">Documents Pending</SelectItem>
                                <SelectItem value="applied">Application Lodged</SelectItem>
                                <SelectItem value="conditional_offer">Conditional Offer</SelectItem>
                                <SelectItem value="unconditional_offer">Unconditional Offer</SelectItem>
                                <SelectItem value="cas_issued">CAS / I-20</SelectItem>
                                <SelectItem value="visa_lodged">Visa Lodged</SelectItem>
                                <SelectItem value="visa_approved">Visa Approved</SelectItem>
                                <SelectItem value="enrolled">Enrolled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bulk Agent Assign */}
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

            {/* Cloudflare R2 Document Vault Modal */}
            <Dialog open={openDocsModal} onOpenChange={setOpenDocsModal}>
                <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900 max-h-[85vh] overflow-y-auto shadow-2xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center justify-between text-slate-900">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Document Vault: {selectedStudent?.fullName}
                            </div>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {selectedStudent?.studentCode}
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Upload New Document Form */}
                    <form onSubmit={handleUploadDoc} className="p-4 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3 mt-2">
                        <div className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                            <Upload className="w-4 h-4 text-primary" />
                            Upload New File to Cloudflare R2 Storage
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <Input
                                placeholder="Document Title (e.g. Passport Bio)"
                                value={docTitle}
                                onChange={(e) => setDocTitle(e.target.value)}
                                className="bg-white border-slate-300 text-slate-800 text-xs"
                            />
                            <Select value={docType} onValueChange={setDocType}>
                                <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-xs">
                                    <SelectValue placeholder="Doc Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-800">
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="transcript">Academic Transcript</SelectItem>
                                    <SelectItem value="ielts">IELTS / English Score</SelectItem>
                                    <SelectItem value="sop">Statement of Purpose (SOP)</SelectItem>
                                    <SelectItem value="offer_letter">University Offer Letter</SelectItem>
                                    <SelectItem value="cas_i20">CAS / I-20</SelectItem>
                                    <SelectItem value="visa">Visa Approval Stamp</SelectItem>
                                    <SelectItem value="bank_statement">Bank Solvency</SelectItem>
                                    <SelectItem value="other">Other Document</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type="file"
                                onChange={(e) => setDocFile(e.target.files[0])}
                                required
                                className="bg-white border-slate-300 text-slate-800 text-xs file:text-xs file:bg-slate-100 file:border-0 file:rounded-md file:px-2 file:py-1"
                            />
                        </div>

                        <Button type="submit" disabled={uploadingDoc} size="sm" className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold">
                            {uploadingDoc ? 'Uploading to R2...' : 'Securely Upload Document'}
                        </Button>
                    </form>

                    {/* Existing Documents List */}
                    <div className="space-y-2 mt-4">
                        <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                            Verified Files on Record ({studentDocs.length})
                        </div>

                        {studentDocs.length === 0 ? (
                            <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                                No documents uploaded yet for this student.
                            </div>
                        ) : (
                            studentDocs.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-50/80 shadow-sm"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-slate-900 truncate">{doc.title}</div>
                                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                                <span className="capitalize text-amber-700 font-semibold">
                                                    {doc.document_type ? doc.document_type.replace(/_/g, ' ') : 'General'}
                                                </span>
                                                <span>• {doc.file_size || 'File'}</span>
                                                <span className="text-emerald-600 flex items-center gap-1 font-medium">
                                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <a
                                            href={doc.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                            title="View in Cloudflare R2"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                        <button
                                            onClick={() => handleDeleteDoc(doc.id)}
                                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                                            title="Delete Document"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
