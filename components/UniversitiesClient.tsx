'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FaLocationDot,
  FaCircleCheck,
  FaMagnifyingGlass,
  FaFilter,
  FaBuildingColumns,
  FaGraduationCap,
  FaCopy,
  FaCheck,
  FaWhatsapp,
  FaRotateLeft,
  FaChevronRight,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import Pagination from '@/components/Pagination';
import { generateUniversityShareText, copyToClipboard } from '@/lib/share';
import CountryFlag from '@/components/CountryFlag';
import { DESTINATIONS } from '@/lib/destinations';
import { SITE_URL } from '@/lib/seo';

function UniversityInitialsBadge({ name }: { name: string }) {
  const initials = (name || 'UN')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg bg-[#144272] text-[#FFD749] border border-[#3FC1C9]/30 font-black text-xl sm:text-2xl shadow-xs flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
      {initials || 'UN'}
    </div>
  );
}

function UniversitiesContent({ initialUniversities }: { initialUniversities: any[] }) {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCountry = searchParams.get('country') || 'all';

  const [universities] = useState<any[]>(initialUniversities);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCountry, setSelectedCountry] = useState(urlCountry);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedOfferTypes, setSelectedOfferTypes] = useState<string[]>([]);
  const [copiedUniId, setCopiedUniId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    setSearchQuery(urlSearch);
    setSelectedCountry(urlCountry || 'all');
  }, [urlSearch, urlCountry]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    universities.forEach((u: any) => {
      if (u.country) set.add(u.country);
    });
    return ['all', ...Array.from(set).sort()];
  }, [universities]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    universities.forEach((u: any) => {
      if (u.location) {
        const parts = u.location.split(',');
        const city = parts[0]?.trim();
        if (city) set.add(city);
      }
    });
    return ['all', ...Array.from(set).sort()];
  }, [universities]);

  const levels = ['Bachelor', 'Masters', 'PhD', 'Diploma', 'Certificate'];

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
    setCurrentPage(1);
  };

  const handleOfferTypeChange = (type: string) => {
    setSelectedOfferTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedLevels([]);
    setSelectedCountry('all');
    setSelectedLocation('all');
    setSelectedOfferTypes([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const filteredUniversities = useMemo(() => {
    return universities.filter((uni: any) => {
      if (selectedCountry !== 'all') {
        const c1 = (uni.country || '').toLowerCase();
        const c2 = selectedCountry.toLowerCase();
        if (c1 !== c2 && !c1.includes(c2) && !c2.includes(c1)) {
          return false;
        }
      }

      if (selectedLocation !== 'all') {
        if (!uni.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      if (selectedLevels.length > 0) {
        const uniLevels = (uni.levels || []).map((l: string) =>
          l.toLowerCase().trim().replace(/s$/, '')
        );
        const hasMatch = selectedLevels.some((sel) => {
          const normSel = sel.toLowerCase().trim().replace(/s$/, '');
          return uniLevels.some((ul: string) => ul.includes(normSel) || normSel.includes(ul));
        });
        if (!hasMatch) return false;
      }

      if (selectedOfferTypes.length > 0) {
        const feeStatus = uni.offerLetterFee || 'Paid';
        const wantFree = selectedOfferTypes.includes('Free Offer Letter');
        const wantPaid = selectedOfferTypes.includes('Offer Letter Fees Apply');
        if (wantFree && !wantPaid && feeStatus !== 'Free') return false;
        if (wantPaid && !wantFree && feeStatus === 'Free') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = uni.name?.toLowerCase().includes(q);
        const countryMatch = uni.country?.toLowerCase().includes(q);
        const locMatch = uni.location?.toLowerCase().includes(q);
        const courseMatch = (uni.programs || []).some((p: any) =>
          p.title?.toLowerCase().includes(q)
        );
        if (!nameMatch && !countryMatch && !locMatch && !courseMatch) {
          return false;
        }
      }

      return true;
    });
  }, [universities, selectedCountry, selectedLocation, selectedLevels, selectedOfferTypes, searchQuery]);

  const totalPages = Math.ceil(filteredUniversities.length / pageSize) || 1;
  const paginatedUniversities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUniversities.slice(start, start + pageSize);
  }, [filteredUniversities, currentPage, pageSize]);

  const handleCopyUniversity = async (e: React.MouseEvent, uni: any) => {
    e.preventDefault();
    e.stopPropagation();
    const uniUrl = `${window.location.origin}/universities/${encodeURIComponent(uni._id || uni.id)}`;
    const text = generateUniversityShareText(uni, uniUrl);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedUniId(uni._id || uni.id);
      toast.success(`Copied "${uni.name}" details! Ready to paste into WhatsApp.`);
      setTimeout(() => setCopiedUniId(null), 2500);
    } else {
      toast.error('Could not copy university details');
    }
  };

  const hasActiveFilters =
    selectedLevels.length > 0 ||
    selectedCountry !== 'all' ||
    selectedLocation !== 'all' ||
    selectedOfferTypes.length > 0 ||
    searchQuery.trim().length > 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto space-y-3 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight gradient-title">
          Universities Directory
        </h1>
        <p className="text-xs sm:text-sm text-black/70 max-w-xl mx-auto">
          Partner institutions in Malaysia, Canada, Australia, the UK, and France.
        </p>

        {/* Quick Destination Filter Bar with Flags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCountry('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              selectedCountry === 'all'
                ? 'bg-[#144272] text-[#FFD749] border-[#144272]'
                : 'bg-white text-[#144272] border-[#144272]/20 hover:border-[#3FC1C9]'
            }`}
          >
            All Countries
          </button>
          {DESTINATIONS.map((dest) => {
            const isActive =
              selectedCountry.toLowerCase() === dest.name.toLowerCase() ||
              selectedCountry.toLowerCase() === dest.shortName.toLowerCase();
            return (
              <button
                key={dest.name}
                type="button"
                onClick={() => {
                  setSelectedCountry(isActive ? 'all' : dest.name);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isActive
                    ? 'bg-[#144272] text-[#FFD749] border-[#144272]'
                    : 'bg-white text-[#144272] border-[#144272]/20 hover:border-[#3FC1C9]'
                }`}
              >
                <CountryFlag country={dest.name} size="xs" />
                <span>{dest.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <div className="sticky top-28 space-y-6">
            <GlassCard className="p-6 space-y-6 border-[#144272]/15 shadow-sm bg-white">
              <div className="flex items-center justify-between pb-4 border-b border-[#144272]/10">
                <div className="flex items-center space-x-2 text-[#144272] font-bold">
                  <FaFilter className="h-4 w-4 text-[#3FC1C9]" />
                  <span>Filter Institutions</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-[#144272]/70 hover:text-[#144272] transition-colors font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <FaRotateLeft className="h-3 w-3" />
                    Reset All
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#144272]">Search Partner</label>
                <div className="relative">
                  <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#144272]/50 h-4 w-4" />
                  <Input
                    placeholder="Institution, country, or course..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 bg-white border-[#144272]/20 rounded-lg text-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#144272]">Country</label>
                <Select
                  value={selectedCountry}
                  onValueChange={(val) => {
                    setSelectedCountry(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="bg-white border-[#144272]/20 rounded-lg text-black">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === 'all' ? 'All Countries' : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#144272]">City / Region</label>
                <Select
                  value={selectedLocation}
                  onValueChange={(val) => {
                    setSelectedLocation(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="bg-white border-[#144272]/20 rounded-lg text-black">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc === 'all' ? 'All Cities' : loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#144272]">Level of Interest</label>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center space-x-3 group cursor-pointer">
                      <Checkbox
                        id={level}
                        checked={selectedLevels.includes(level)}
                        onCheckedChange={() => handleLevelChange(level)}
                        className="border-[#144272]/40 data-[state=checked]:bg-[#144272] rounded-lg"
                      />
                      <label
                        htmlFor={level}
                        className="text-sm font-medium text-black/70 group-hover:text-[#144272] transition-colors cursor-pointer"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#144272]">Offer Letter</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox
                      id="free-offer"
                      checked={selectedOfferTypes.includes('Free Offer Letter')}
                      onCheckedChange={() => handleOfferTypeChange('Free Offer Letter')}
                      className="border-[#144272]/40 data-[state=checked]:bg-[#144272] rounded-lg"
                    />
                    <label
                      htmlFor="free-offer"
                      className="text-sm font-medium text-black/70 group-hover:text-[#144272] transition-colors cursor-pointer"
                    >
                      Free Offer Letter
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox
                      id="paid-offer"
                      checked={selectedOfferTypes.includes('Offer Letter Fees Apply')}
                      onCheckedChange={() => handleOfferTypeChange('Offer Letter Fees Apply')}
                      className="border-[#144272]/40 data-[state=checked]:bg-[#144272] rounded-lg"
                    />
                    <label
                      htmlFor="paid-offer"
                      className="text-sm font-medium text-black/70 group-hover:text-[#144272] transition-colors cursor-pointer"
                    >
                      Offer Letter Fees Apply
                    </label>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#144272]">
                {filteredUniversities.length} {filteredUniversities.length === 1 ? 'University' : 'Universities'} Found
              </h2>
              <p className="text-xs sm:text-sm text-black/60">
                Click any card to open the university detail page and courses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#144272] font-medium">Per Page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-24 h-8 text-xs bg-white border-[#144272]/20 rounded-lg text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="50">All 50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {paginatedUniversities.map((university: any) => {
              const uniTargetUrl = `/universities/${encodeURIComponent(university._id || university.id)}`;
              const shareUrl = `${SITE_URL}${uniTargetUrl}`;
              const shareText = generateUniversityShareText(university, shareUrl);
              const waHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
              const isCopied = copiedUniId === (university._id || university.id);

              return (
                <Link
                  key={university._id || university.id}
                  href={uniTargetUrl}
                  className="block group"
                >
                  <GlassCard className="p-0 overflow-hidden hover:shadow-md hover:border-[#3FC1C9] transition-all duration-200 border-[#144272]/15 bg-white rounded-lg cursor-pointer">
                    <div className="p-6 md:p-7 flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">
                      <div className="w-full md:w-auto flex justify-center md:justify-start flex-shrink-0">
                        <UniversityInitialsBadge name={university.name} />
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] border border-[#144272]/20 uppercase tracking-wider">
                            <CountryFlag country={university.country} size="xs" />
                            <span>{university.country || 'International'}</span>
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFD749] text-black border border-[#144272]/20 flex items-center gap-1">
                            <FaCircleCheck className="h-3 w-3 text-[#144272]" />
                            Verified Partner
                          </span>
                          {university.offerLetterFee && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] border border-[#144272]/20">
                              Offer Letter: {university.offerLetterFee}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg sm:text-xl font-black text-[#144272] group-hover:text-[#3FC1C9] transition-colors flex items-center justify-between">
                            <span>{university.name}</span>
                            <FaChevronRight className="h-3.5 w-3.5 text-[#144272]/40 group-hover:text-[#3FC1C9] transition-transform group-hover:translate-x-1" />
                          </h3>
                          <p className="text-xs text-black/60 mt-1 flex items-center gap-1.5 font-medium">
                            <FaLocationDot className="h-3.5 w-3.5 text-[#144272] flex-shrink-0" />
                            {university.location || university.country}
                          </p>
                        </div>

                        {university.description && (
                          <p className="text-xs text-black/70 line-clamp-2 leading-relaxed">
                            {university.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#3FC1C9]/15 text-[#144272] font-bold border border-[#3FC1C9]/40 text-xs">
                            <FaGraduationCap className="h-3.5 w-3.5 text-[#144272]" />
                            {university.courseCount || university.programs?.length || 0} Degree Programs
                          </span>

                          {university.levels && university.levels.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {university.levels.slice(0, 4).map((lvl: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] font-semibold text-xs border border-[#144272]/20"
                                >
                                  {lvl}
                                </span>
                              ))}
                              {university.levels.length > 4 && (
                                <span className="text-xs text-black/40 font-medium self-center">
                                  +{university.levels.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-44 flex-shrink-0 pt-2 md:pt-0">
                        <Button
                          type="button"
                          className="w-full bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] shadow-xs h-9 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                        >
                          <FaBuildingColumns className="h-3 w-3" />
                          View Details
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => handleCopyUniversity(e, university)}
                          className={`w-full text-xs font-bold rounded-lg h-9 flex items-center justify-center gap-1.5 transition-colors ${
                            isCopied
                              ? 'border-[#3FC1C9] bg-[#3FC1C9] text-[#144272] font-bold'
                              : 'border-[#144272]/30 text-[#144272] hover:bg-[#F5F5F5]'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <FaCheck className="h-3 w-3 text-[#144272]" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <FaCopy className="h-3 w-3 text-[#144272]" />
                              Copy Details
                            </>
                          )}
                        </Button>

                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-[#3FC1C9] text-[#144272] bg-[#3FC1C9]/20 hover:bg-[#3FC1C9]/40 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 h-9"
                          >
                            <FaWhatsapp className="h-3.5 w-3.5 text-[#144272]" />
                            Share on WhatsApp
                          </Button>
                        </a>

                        <Link
                          href={`/apply/${encodeURIComponent(university._id || university.id)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-[#144272] hover:text-[#144272] hover:bg-[#FFD749]/30 text-xs h-8 font-semibold rounded-lg"
                          >
                            Apply Now →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}

            {filteredUniversities.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border border-dashed border-[#144272]/20 p-8 space-y-4 shadow-xs">
                <div className="inline-flex p-4 rounded-lg bg-[#F5F5F5] text-[#144272]">
                  <FaBuildingColumns className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#144272]">
                    {searchQuery || selectedCountry !== 'all' ? 'No universities match your search criteria' : 'No universities currently listed'}
                  </h3>
                  <p className="text-xs sm:text-sm text-black/60 mt-1 max-w-md mx-auto">
                    {searchQuery || selectedCountry !== 'all'
                      ? 'Try adjusting your search terms or clearing filters to view available institutions.'
                      : 'University profiles and program information are being updated. Check back shortly or contact our counseling team for direct university inquiries.'}
                  </p>
                </div>
                {hasActiveFilters ? (
                  <Button
                    onClick={handleResetFilters}
                    className="bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] font-bold text-xs rounded-lg px-4 py-2 shadow-xs flex items-center gap-2 mx-auto"
                  >
                    <FaRotateLeft className="h-3 w-3" />
                    Reset Search Filters
                  </Button>
                ) : (
                  <Link href="/contact">
                    <Button className="bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] font-bold text-xs rounded-lg px-5 py-2.5 shadow-xs mx-auto">
                      Contact Advisory Office
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {filteredUniversities.length > 0 && (
              <div className="pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredUniversities.length}
                  pageSize={pageSize}
                  pageSizeOptions={[6, 12, 24, 50]}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  className="bg-white rounded-lg border border-[#144272]/15 p-4 shadow-xs"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UniversitiesClient({ initialUniversities }: { initialUniversities: any[] }) {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12" />}>
      <UniversitiesContent initialUniversities={initialUniversities} />
    </Suspense>
  );
}
