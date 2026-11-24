'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CountryFlag from '@/components/CountryFlag';
import { GuideArticle, GUIDE_CATEGORIES, GUIDE_COUNTRIES, isBanglaGuide } from '@/lib/guides';
import { FaMagnifyingGlass, FaArrowRight, FaWhatsapp, FaXmark } from 'react-icons/fa6';

function formatGuideDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function GuideClient({ initialGuides }: { initialGuides: GuideArticle[] }) {
  const [guides] = useState<GuideArticle[]>(initialGuides);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<'all' | 'bn' | 'en'>('all');

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      if (selectedLang === 'bn' && !isBanglaGuide(g)) return false;
      if (selectedLang === 'en' && isBanglaGuide(g)) return false;
      if (selectedCategory !== 'all' && g.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (
        selectedCountry !== 'all' &&
        (g.country || 'Global').toLowerCase() !== selectedCountry.toLowerCase()
      ) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const hit =
          g.title.toLowerCase().includes(q) ||
          g.excerpt.toLowerCase().includes(q) ||
          g.content.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          (g.country || '').toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [guides, selectedCategory, selectedCountry, selectedLang, search]);

  const featuredGuide = useMemo(() => {
    if (search.trim() || selectedCategory !== 'all' || selectedCountry !== 'all') {
      return null;
    }
    return filteredGuides.find((g) => g.featured) || filteredGuides[0] || null;
  }, [filteredGuides, search, selectedCategory, selectedCountry]);

  const gridGuides = useMemo(() => {
    if (!featuredGuide) return filteredGuides;
    return filteredGuides.filter((g) => g.id !== featuredGuide.id);
  }, [filteredGuides, featuredGuide]);

  const hasFilters =
    search.trim().length > 0 ||
    selectedCategory !== 'all' ||
    selectedCountry !== 'all' ||
    selectedLang !== 'all';

  return (
    <div className="container mx-auto px-4 py-10 pt-28 max-w-7xl space-y-10 pb-24" style={{ color: '#000000' }}>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight gradient-title">
          Student Guide &amp; Reality Blog
        </h1>
        <p className="text-sm sm:text-base text-black/75">
          Practical guides on housing, part-time jobs, budgets, and surviving abroad.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#144272]/20 rounded-lg p-5 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <FaMagnifyingGlass className="h-4 w-4 text-[#144272]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles on housing, jobs, CAF, PGWP, budgets..."
              className="pl-10 bg-[#F5F5F5] border-[#144272]/20 rounded-lg text-sm text-black"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#F5F5F5] p-1 rounded-lg border border-[#144272]/15">
            {[
              { id: 'all', label: 'All' },
              { id: 'bn', label: 'বাংলা' },
              { id: 'en', label: 'English' },
            ].map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setSelectedLang(lang.id as 'all' | 'bn' | 'en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedLang === lang.id
                    ? 'bg-[#144272] text-[#FFD749]'
                    : 'text-[#144272] hover:bg-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedCountry('all');
                setSelectedLang('all');
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#F5F5F5] text-[#144272] border border-[#144272]/25 hover:border-[#3FC1C9] transition-colors"
            >
              <FaXmark className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-black/55 mr-1">
            Topics:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#144272] text-[#FFD749] border-[#144272]'
                : 'bg-[#F5F5F5] text-[#144272] border-[#144272]/15 hover:border-[#3FC1C9]'
            }`}
          >
            All Guides
          </button>
          {GUIDE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(active ? 'all' : cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  active
                    ? 'bg-[#144272] text-[#FFD749] border-[#144272]'
                    : 'bg-[#F5F5F5] text-[#144272] border-[#144272]/15 hover:border-[#3FC1C9]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Country Filters with Flags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#144272]/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-black/55 mr-1 pt-2">
            Region:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <button
              type="button"
              onClick={() => setSelectedCountry('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                selectedCountry === 'all'
                  ? 'bg-[#3FC1C9] text-[#144272] border-[#144272]'
                  : 'bg-white text-[#144272] border-[#144272]/15 hover:border-[#3FC1C9]'
              }`}
            >
              All Regions
            </button>
            {GUIDE_COUNTRIES.map((c) => {
              const active = selectedCountry === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCountry(active ? 'all' : c)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    active
                      ? 'bg-[#3FC1C9] text-[#144272] border-[#144272]'
                      : 'bg-white text-[#144272] border-[#144272]/15 hover:border-[#3FC1C9]'
                  }`}
                >
                  {c !== 'Global' && <CountryFlag country={c} size="xs" />}
                  <span>{c === 'United Kingdom' ? 'UK' : c === 'United States' ? 'USA' : c}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredGuides.length === 0 ? (
        <div className="bg-white border border-dashed border-[#144272]/25 rounded-lg p-12 text-center space-y-4">
          <h3 className="text-lg font-black text-[#144272]">No matching articles found</h3>
          <p className="text-sm text-black/65 max-w-md mx-auto">
            Try clearing your search or selecting another country or survival topic.
          </p>
          {hasFilters && (
            <Button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedCountry('all');
                setSelectedLang('all');
              }}
              className="bg-[#144272] text-[#FFD749] rounded-lg text-xs font-bold uppercase tracking-wider px-5 h-9"
            >
              Show All Articles
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Article Banner */}
          {featuredGuide && (
            <Link href={`/guide/${encodeURIComponent(featuredGuide.slug)}`} className="block group">
              <div
                className={`rounded-lg border border-[#144272]/20 hover:border-[#3FC1C9] overflow-hidden shadow-sm transition-all ${
                  featuredGuide.coverImage
                    ? 'bg-white grid grid-cols-1 lg:grid-cols-12'
                    : 'bg-[#144272] text-white p-7 sm:p-10'
                }`}
              >
                {featuredGuide.coverImage && (
                  <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[240px] bg-[#F5F5F5]">
                    <img
                      src={featuredGuide.coverImage}
                      alt={featuredGuide.title}
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#FFD749] text-[#144272] text-[10px] font-black uppercase tracking-wider border border-[#144272]/20">
                      Featured Brief
                    </span>
                  </div>
                )}

                <div
                  className={`${
                    featuredGuide.coverImage ? 'lg:col-span-7 p-6 sm:p-8' : ''
                  } flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {!featuredGuide.coverImage && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#FFD749] text-[#144272] text-[10px] font-black uppercase tracking-wider">
                          Featured Brief
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                          featuredGuide.coverImage
                            ? 'bg-[#3FC1C9]/20 text-[#144272] border-[#3FC1C9]/40'
                            : 'bg-[#3FC1C9] text-[#144272] border-[#3FC1C9]'
                        }`}
                      >
                        {featuredGuide.category}
                      </span>
                      {featuredGuide.country && featuredGuide.country !== 'Global' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#F5F5F5] text-[#144272] border border-[#144272]/20">
                          <CountryFlag country={featuredGuide.country} size="xs" />
                          <span>{featuredGuide.country}</span>
                        </span>
                      )}
                      <span
                        className={`text-xs font-mono ${
                          featuredGuide.coverImage ? 'text-black/55' : 'text-[#F5F5F5]/75'
                        }`}
                      >
                        {featuredGuide.readTime}
                      </span>
                    </div>

                    <h2
                      className={`text-2xl sm:text-3xl font-black leading-tight ${
                        featuredGuide.coverImage
                          ? 'text-[#144272] group-hover:text-[#3FC1C9]'
                          : 'text-white group-hover:text-[#FFD749]'
                      } transition-colors`}
                    >
                      {featuredGuide.title}
                    </h2>

                    <p
                      className={`text-sm leading-relaxed ${
                        featuredGuide.coverImage ? 'text-black/75' : 'text-[#F5F5F5]/85'
                      }`}
                    >
                      {featuredGuide.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-current/10">
                    <div className="text-xs">
                      <span
                        className={`font-bold ${
                          featuredGuide.coverImage ? 'text-[#144272]' : 'text-[#FFD749]'
                        }`}
                      >
                        {featuredGuide.authorName}
                      </span>
                      <span
                        className={`ml-2 ${
                          featuredGuide.coverImage ? 'text-black/50' : 'text-[#F5F5F5]/65'
                        }`}
                      >
                        • {formatGuideDate(featuredGuide.createdAt)}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${
                        featuredGuide.coverImage ? 'text-[#144272]' : 'text-[#3FC1C9]'
                      }`}
                    >
                      Read Full Guide
                      <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridGuides.map((guide) => {
              const hasImage = Boolean(guide.coverImage);
              return (
                <Link
                  key={guide.id}
                  href={`/guide/${encodeURIComponent(guide.slug)}`}
                  className="block group h-full"
                >
                  <article className="h-full bg-white border border-[#144272]/20 hover:border-[#3FC1C9] rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      {hasImage ? (
                        <div className="relative aspect-[16/9] bg-[#F5F5F5] overflow-hidden border-b border-[#144272]/15">
                          <img
                            src={guide.coverImage!}
                            alt={guide.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-[#144272] text-[#FFD749] text-[10px] font-bold uppercase tracking-wider">
                            {guide.category}
                          </span>
                        </div>
                      ) : (
                        <div className="bg-[#144272] px-5 py-3 flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-[#FFD749] text-[#144272] text-[10px] font-black uppercase tracking-wider">
                            {guide.category}
                          </span>
                          <span className="text-[11px] font-mono text-[#3FC1C9] font-bold">
                            Text Guideline • {guide.readTime}
                          </span>
                        </div>
                      )}

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            {guide.country && guide.country !== 'Global' ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] font-bold border border-[#144272]/15">
                                <CountryFlag country={guide.country} size="xs" />
                                <span>{guide.country}</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] font-bold border border-[#144272]/15">
                                Global
                              </span>
                            )}
                            {isBanglaGuide(guide) && (
                              <span className="px-2 py-0.5 rounded-lg bg-[#FFD749] text-[#144272] font-black">
                                বাংলা
                              </span>
                            )}
                          </div>
                          <span className="text-black/50 font-mono">
                            {formatGuideDate(guide.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-[#144272] group-hover:text-[#3FC1C9] transition-colors leading-snug">
                          {guide.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-black/75 leading-relaxed line-clamp-3">
                          {guide.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-[#F5F5F5] border-t border-[#144272]/10 flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#144272] truncate">
                        {guide.authorName}
                      </span>
                      <span className="inline-flex items-center gap-1 font-black text-[#144272] group-hover:text-[#3FC1C9] uppercase tracking-wider flex-shrink-0">
                        Read
                        <FaArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Counselor CTA Banner */}
      <div className="bg-[#144272] text-white rounded-lg p-7 sm:p-10 border border-[#3FC1C9]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FFD749]">
            Personalized Advice
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Have Questions About Living Costs or Visa Reality?
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F5]/85 leading-relaxed">
            Speak directly with our advisory desk for transparent country budgeting, housing prep, and legal work guidelines before you apply.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <a
            href="https://api.whatsapp.com/send?phone=8801410555054"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-[#FFD749] hover:bg-[#FFD749]/90 text-[#144272] font-black rounded-lg h-10 px-5 text-xs uppercase tracking-wider gap-2">
              <FaWhatsapp className="h-4 w-4" />
              WhatsApp Advisory
            </Button>
          </a>
          <Link href="/contact">
            <Button className="bg-[#3FC1C9] hover:bg-[#34b0b8] text-[#144272] font-bold rounded-lg h-10 px-5 text-xs uppercase tracking-wider">
              Book Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
