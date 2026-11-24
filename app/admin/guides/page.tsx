'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CountryFlag from '@/components/CountryFlag';
import GuideContentRenderer from '@/components/GuideContentRenderer';
import {
  GuideArticle,
  GUIDE_CATEGORIES,
  GUIDE_COUNTRIES,
} from '@/lib/guides';
import toast from 'react-hot-toast';
import {
  FaBookOpen,
  FaPlus,
  FaTrash,
  FaPen,
  FaEye,
  FaImage,
  FaArrowUpRightFromSquare,
  FaMagnifyingGlass,
  FaUpload,
  FaXmark,
  FaFileLines,
} from 'react-icons/fa6';

function getAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gph_token') : null;
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra || {}),
  };
}

interface ArticleFormState {
  title: string;
  category: string;
  country: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverR2Key: string | null;
  images: Array<{ url: string; caption?: string }>;
  authorName: string;
  authorRole: string;
  readTime: string;
  featured: boolean;
  status: 'published' | 'draft';
}

const INITIAL_FORM: ArticleFormState = {
  title: '',
  category: 'Study Reality',
  country: 'Global',
  excerpt: '',
  content: '',
  coverImage: '',
  coverR2Key: null,
  images: [],
  authorName: 'GlobalPathwayHub Advisory',
  authorRole: 'Student Advisory Desk',
  readTime: '',
  featured: false,
  status: 'published',
};

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<GuideArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleFormState>(INITIAL_FORM);
  const [imageMode, setImageMode] = useState<'none' | 'upload' | 'url'>('none');
  const [extraImgUrl, setExtraImgUrl] = useState('');
  const [extraImgCaption, setExtraImgCaption] = useState('');
  const [editorView, setEditorView] = useState<'write' | 'preview'>('write');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const loadGuides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/guides?all=true', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setGuides(data);
      }
    } catch {
      toast.error('Failed to load guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuides();
  }, []);

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      if (statusFilter !== 'all' && g.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          (g.country || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [guides, search, statusFilter]);

  const handleResetForm = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setImageMode('none');
    setEditorView('write');
  };

  const handleEdit = (g: GuideArticle) => {
    setEditingId(g.id);
    setForm({
      title: g.title,
      category: g.category || 'Survival Guide',
      country: g.country || 'Global',
      excerpt: g.excerpt || '',
      content: g.content || '',
      coverImage: g.coverImage || '',
      coverR2Key: null,
      images: Array.isArray(g.images) ? g.images : [],
      authorName: g.authorName || 'GlobalPathwayHub Advisory',
      authorRole: g.authorRole || 'Student Advisory Desk',
      readTime: g.readTime || '',
      featured: Boolean(g.featured),
      status: g.status === 'draft' ? 'draft' : 'published',
    });
    setImageMode(g.coverImage ? 'url' : 'none');
    setEditorView('write');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImageFile = async (file: File): Promise<{ url: string; r2Key: string | null } | null> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/guides/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: fd,
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data.message || 'Upload failed');
    }
    return { url: data.url, r2Key: data.r2Key || null };
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const toastId = toast.loading('Uploading cover image...');
    try {
      const uploaded = await uploadImageFile(file);
      if (uploaded) {
        setForm((prev) => ({
          ...prev,
          coverImage: uploaded.url,
          coverR2Key: uploaded.r2Key,
        }));
        toast.success('Cover image attached!', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed', { id: toastId });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleExtraImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExtra(true);
    const toastId = toast.loading('Uploading article image...');
    try {
      const uploaded = await uploadImageFile(file);
      if (uploaded) {
        const caption = extraImgCaption.trim() || file.name.replace(/\.[^/.]+$/, '');
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { url: uploaded.url, caption }],
        }));
        setExtraImgCaption('');
        toast.success('Image added to article gallery!', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed', { id: toastId });
    } finally {
      setUploadingExtra(false);
    }
  };

  const handleAddExtraUrl = () => {
    if (!extraImgUrl.trim()) return;
    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { url: extraImgUrl.trim(), caption: extraImgCaption.trim() || undefined },
      ],
    }));
    setExtraImgUrl('');
    setExtraImgCaption('');
  };

  const handleInsertSnippet = (snippet: string) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content ? `${prev.content}\n\n${snippet}` : snippet,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Please enter both article title and body content.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(editingId ? 'Updating guide article...' : 'Publishing guide article...');

    try {
      const payload = {
        ...form,
        coverImage: imageMode === 'none' || !form.coverImage.trim() ? null : form.coverImage.trim(),
      };

      const url = editingId ? `/api/guides/${encodeURIComponent(editingId)}` : '/api/guides';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save guide');
      }

      toast.success(
        editingId
          ? 'Guide updated successfully!'
          : form.status === 'published'
            ? 'Guide published live on /guide!'
            : 'Saved as draft!',
        { id: toastId }
      );
      handleResetForm();
      loadGuides();
    } catch (err: any) {
      toast.error(err.message || 'Error saving guide', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (guide: GuideArticle) => {
    const nextStatus = guide.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/guides/${encodeURIComponent(guide.id)}`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast.success(`Moved "${guide.title}" to ${nextStatus}`);
        loadGuides();
      }
    } catch {
      toast.error('Could not update status');
    }
  };

  const handleDelete = async (guide: GuideArticle) => {
    if (!window.confirm(`Delete "${guide.title}" permanently?`)) return;
    try {
      const res = await fetch(`/api/guides/${encodeURIComponent(guide.id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        toast.success('Guide deleted');
        if (editingId === guide.id) handleResetForm();
        loadGuides();
      } else {
        toast.error('Delete failed');
      }
    } catch {
      toast.error('Network error while deleting');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
              <FaBookOpen className="w-6 h-6 text-[#144272]" />
              Student Guides &amp; Reality Blog Studio
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Publish survival guides, country realities, housing tips, and student advisories—with images or pure text.
            </p>
          </div>
          <Link href="/guide" target="_blank">
            <Button
              variant="outline"
              className="rounded-lg text-xs font-bold gap-2 border-[#144272]/30 text-[#144272]"
            >
              View Live /guide Page
              <FaArrowUpRightFromSquare className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Publisher / Editor Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <h2 className="text-lg font-black text-[#144272] flex items-center gap-2">
              {editingId ? <FaPen className="h-4 w-4" /> : <FaPlus className="h-4 w-4" />}
              {editingId ? 'Edit Existing Guide Article' : 'Write & Publish New Article'}
            </h2>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetForm}
                className="rounded-lg text-xs"
              >
                Cancel Editing
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Article Title *
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Surviving Your First Winter & Part-Time Job Hunt in Canada"
                required
                className="rounded-lg"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Category
              </label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm({ ...form, category: val })}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GUIDE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Target Country
              </label>
              <Select
                value={form.country}
                onValueChange={(val) => setForm({ ...form, country: val })}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GUIDE_COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Short Summary / Excerpt
            </label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Concise 1–2 sentence preview shown on the /guide cards..."
              rows={2}
              className="rounded-lg resize-none"
            />
          </div>

          {/* Optional Cover Image Mode (With or Without Images) */}
          <div className="p-4 rounded-lg bg-[#F5F5F5] border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#144272] block">
                  Cover Image Option (Optional)
                </span>
                <span className="text-xs text-slate-600">
                  Publish purely as a clean text guideline, or attach a cover photo.
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setImageMode('none');
                    setForm((prev) => ({ ...prev, coverImage: '', coverR2Key: null }));
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    imageMode === 'none'
                      ? 'bg-[#144272] text-[#FFD749] border-[#144272]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <FaFileLines className="h-3 w-3" />
                  No Image (Text-Only)
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    imageMode === 'upload'
                      ? 'bg-[#144272] text-[#FFD749] border-[#144272]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <FaUpload className="h-3 w-3" />
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    imageMode === 'url'
                      ? 'bg-[#144272] text-[#FFD749] border-[#144272]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <FaImage className="h-3 w-3" />
                  Image URL
                </button>
              </div>
            </div>

            {imageMode === 'upload' && (
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#144272] file:text-[#FFD749] file:font-bold file:cursor-pointer"
                />
                {uploadingCover && <span className="text-xs font-semibold text-[#144272]">Uploading...</span>}
              </div>
            )}

            {imageMode === 'url' && (
              <Input
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-white rounded-lg"
              />
            )}

            {imageMode !== 'none' && form.coverImage && (
              <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-slate-300 bg-white">
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="w-full h-36 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageMode('none');
                    setForm((prev) => ({ ...prev, coverImage: '', coverR2Key: null }));
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#144272] text-white hover:bg-rose-600"
                  title="Remove cover image"
                >
                  <FaXmark className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Article Body Editor + Live Preview Toggle */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Full Guideline / Blog Content *
              </label>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditorView('write')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    editorView === 'write'
                      ? 'bg-[#144272] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Write Content
                </button>
                <button
                  type="button"
                  onClick={() => setEditorView('preview')}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${
                    editorView === 'preview'
                      ? 'bg-[#144272] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FaEye className="h-3 w-3" />
                  Live Preview
                </button>
              </div>
            </div>

            {editorView === 'write' ? (
              <div className="space-y-2">
                {/* Quick Formatting Helper Bar */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet('## New Section Heading')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 border border-slate-200"
                  >
                    + Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet('### Subheading')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 border border-slate-200"
                  >
                    + Subheading
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet('- Key survival point here')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 border border-slate-200"
                  >
                    + Bullet Item
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet('1. Step one action')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 border border-slate-200"
                  >
                    + Numbered Step
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInsertSnippet('> **Reality Check:** Important warning or advice for students.')
                    }
                    className="px-2.5 py-1 rounded-lg bg-[#FFD749]/40 hover:bg-[#FFD749]/70 text-[11px] font-bold text-[#144272] border border-[#144272]/20"
                  >
                    + Reality Callout
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet('**highlighted insight**')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 border border-slate-200"
                  >
                    + Bold Text
                  </button>
                </div>

                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write detailed student advice, study abroad reality checks, budgeting numbers, survival strategies..."
                  rows={12}
                  required
                  className="rounded-lg font-mono text-xs sm:text-sm leading-relaxed"
                />
              </div>
            ) : (
              <div className="p-6 rounded-lg border border-slate-200 bg-white min-h-[260px]">
                {form.content.trim() ? (
                  <GuideContentRenderer content={form.content} />
                ) : (
                  <p className="text-xs text-slate-400 italic">Nothing written yet to preview.</p>
                )}
              </div>
            )}
          </div>

          {/* Optional Extra Inline / Gallery Images */}
          <div className="p-4 rounded-lg border border-slate-200 space-y-3 bg-white">
            <div className="text-xs font-bold uppercase tracking-wider text-[#144272]">
              Optional Extra Images (Insert Inside Article or Attach as Gallery)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <Input
                value={extraImgUrl}
                onChange={(e) => setExtraImgUrl(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="sm:col-span-5 rounded-lg text-xs"
              />
              <Input
                value={extraImgCaption}
                onChange={(e) => setExtraImgCaption(e.target.value)}
                placeholder="Optional caption"
                className="sm:col-span-4 rounded-lg text-xs"
              />
              <div className="sm:col-span-3 flex gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddExtraUrl}
                  className="flex-1 rounded-lg text-xs font-bold"
                >
                  Add URL
                </Button>
                <label className="cursor-pointer inline-flex items-center justify-center px-3 py-2 rounded-lg bg-[#144272] text-[#FFD749] text-xs font-bold">
                  {uploadingExtra ? '...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleExtraImageUpload}
                    disabled={uploadingExtra}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {form.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg border border-slate-200 bg-[#F5F5F5]"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || 'Attached image'}
                      className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-slate-800">
                        {img.caption || `Image ${idx + 1}`}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handleInsertSnippet(`![${img.caption || 'Guide Image'}](${img.url})`)
                        }
                        className="text-[11px] font-bold text-[#144272] hover:underline"
                      >
                        + Insert inline into article
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx),
                        }))
                      }
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <FaXmark className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Author, Featured & Publish Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-2 border-t border-slate-100">
            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-600">Author Name</label>
              <Input
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className="rounded-lg text-xs"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-600">Author Role / Title</label>
              <Input
                value={form.authorRole}
                onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                className="rounded-lg text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-600">Status</label>
              <Select
                value={form.status}
                onValueChange={(val: 'published' | 'draft') => setForm({ ...form, status: val })}
              >
                <SelectTrigger className="rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published (Live)</SelectItem>
                  <SelectItem value="draft">Draft (Hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pb-2">
              <input
                id="featured-guide"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-[#144272] rounded"
              />
              <label htmlFor="featured-guide" className="text-xs font-bold text-slate-700 cursor-pointer">
                Featured Story
              </label>
            </div>

            <div className="sm:col-span-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] font-black rounded-lg h-10 text-xs uppercase tracking-wider"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Guide' : 'Publish Guide'}
              </Button>
            </div>
          </div>
        </form>

        {/* Published & Draft Articles List */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-black text-slate-900">
              All Published &amp; Draft Articles ({filteredGuides.length})
            </h2>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <FaMagnifyingGlass className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter articles..."
                  className="pl-8 h-9 text-xs rounded-lg"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(val: 'all' | 'published' | 'draft') => setStatusFilter(val)}
              >
                <SelectTrigger className="w-32 h-9 text-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading articles...</div>
          ) : filteredGuides.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">No articles found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredGuides.map((g) => (
                <div
                  key={g.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {g.coverImage ? (
                      <img
                        src={g.coverImage}
                        alt={g.title}
                        className="w-20 h-14 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-14 rounded-lg bg-[#144272] text-[#FFD749] flex flex-col items-center justify-center text-[10px] font-black flex-shrink-0">
                        <FaFileLines className="h-4 w-4 mb-0.5" />
                        TEXT ONLY
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                            g.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {g.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                          {g.category}
                        </span>
                        {g.country && g.country !== 'Global' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#F5F5F5] text-[#144272] border border-slate-200">
                            <CountryFlag country={g.country} size="xs" />
                            <span>{g.country}</span>
                          </span>
                        )}
                        {g.featured && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-[#FFD749] text-[#144272]">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-black text-slate-900 truncate">{g.title}</h3>
                      <p className="text-xs text-slate-500">
                        By {g.authorName} · {g.readTime} · Slug: <code className="font-mono">/guide/{g.slug}</code>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    <Link href={`/guide/${encodeURIComponent(g.slug)}`} target="_blank">
                      <Button variant="outline" size="sm" className="rounded-lg text-xs h-8 gap-1">
                        <FaEye className="h-3 w-3" />
                        View
                      </Button>
                    </Link>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(g)}
                      className="rounded-lg text-xs h-8"
                    >
                      {g.status === 'published' ? 'Move to Draft' : 'Publish'}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(g)}
                      className="rounded-lg text-xs h-8 gap-1 border-[#144272]/30 text-[#144272]"
                    >
                      <FaPen className="h-3 w-3" />
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(g)}
                      className="rounded-lg text-xs h-8 text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      <FaTrash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
