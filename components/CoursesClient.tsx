'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Pagination from '@/components/Pagination';
import {
  FaMagnifyingGlass,
  FaClock,
  FaChevronRight,
  FaFilter,
  FaXmark,
  FaCopy,
  FaCheck,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { generateCourseShareText, copyToClipboard } from '@/lib/share';
import CountryFlag from '@/components/CountryFlag';
import { DESTINATIONS } from '@/lib/destinations';

function LevelBadge({ level }: { level: string }) {
  return (
    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#144272]/20 bg-[#F5F5F5] text-[#144272] whitespace-nowrap">
      {level}
    </span>
  );
}

const LEVELS = ['Certificate', 'Diploma', 'Advance Diploma', 'Foundation', 'Bachelor', 'Masters', 'PhD'];
const PAGE_SIZE = 12;

export default function CoursesClient({ initialCourses }: { initialCourses: any[] }) {
  const [allCourses] = useState<any[]>(initialCourses);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [copiedCourseId, setCopiedCourseId] = useState<string | null>(null);

  const handleCopyCourse = async (e: React.MouseEvent, course: any) => {
    e.preventDefault();
    e.stopPropagation();
    const text = generateCourseShareText(course);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedCourseId(course._id);
      toast.success(`Copied "${course.name}" details! Ready to paste into WhatsApp.`);
      setTimeout(() => setCopiedCourseId(null), 2500);
    } else {
      toast.error('Could not copy course details');
    }
  };

  const countries = useMemo(() => {
    const set = new Set<string>();
    allCourses.forEach((c) => {
      const country = c.university?.country;
      if (country) set.add(country);
    });
    return Array.from(set).sort();
  }, [allCourses]);

  const filtered = useMemo(() => {
    let result = allCourses;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.university?.name?.toLowerCase().includes(q)
      );
    }

    if (selectedLevel !== 'all') {
      result = result.filter((c) =>
        c.level?.toLowerCase().includes(selectedLevel.toLowerCase())
      );
    }

    if (selectedCountry !== 'all') {
      const target = selectedCountry.toLowerCase();
      result = result.filter((c) => {
        const uniCountry = (c.university?.country || '').toLowerCase();
        return uniCountry === target || uniCountry.includes(target) || target.includes(uniCountry);
      });
    }

    return result;
  }, [search, selectedLevel, selectedCountry, allCourses]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedLevel, selectedCountry]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const hasFilters = search.trim() || selectedLevel !== 'all' || selectedCountry !== 'all';

  const resetFilters = () => {
    setSearch('');
    setSelectedLevel('all');
    setSelectedCountry('all');
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-28 space-y-10 max-w-7xl">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight gradient-title">
          Degree Courses
        </h1>
        <p className="text-sm text-black/70">
          {allCourses.length}+ accredited Bachelor, Master&apos;s, and PhD programs.
        </p>

        {/* Destination Flags Quick Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCountry('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
              selectedCountry === 'all'
                ? 'bg-[#144272] text-[#FFD749] border-[#144272]'
                : 'bg-white text-[#144272] border-[#144272]/20 hover:border-[#3FC1C9]'
            }`}
          >
            All Countries
          </button>
          {DESTINATIONS.map((dest) => {
            const isActive = selectedCountry.toLowerCase() === dest.name.toLowerCase();
            return (
              <button
                key={dest.name}
                type="button"
                onClick={() => setSelectedCountry(isActive ? 'all' : dest.name)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
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

      {/* Filter Bar */}
      <div className="p-5 rounded-lg bg-white border border-[#144272]/15 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#144272] font-bold text-sm">
          <FaFilter className="h-4 w-4 text-[#3FC1C9]" />
          Search &amp; Filter
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs text-black/60 hover:text-[#144272] transition-colors flex items-center gap-1 font-medium"
            >
              <FaXmark className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#144272]/50 h-4 w-4" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, programs, universities..."
              className="pl-10 bg-white border-[#144272]/20 rounded-lg text-black"
            />
          </div>

          <div className="sm:col-span-3">
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="bg-white border-[#144272]/20 rounded-lg text-black">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-3">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="bg-white border-[#144272]/20 rounded-lg text-black">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-1 flex items-center justify-center">
            <span className="text-xs font-bold text-[#144272] bg-[#3FC1C9]/20 border border-[#3FC1C9]/50 px-3 py-2 rounded-lg whitespace-nowrap">
              {filtered.length}
            </span>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <FaMagnifyingGlass className="h-12 w-12 text-[#144272]/20 mx-auto" />
          <h3 className="text-lg font-bold text-[#144272]">No courses found</h3>
          <p className="text-sm text-black/60">Try adjusting your search or filters.</p>
          {hasFilters && (
            <button onClick={resetFilters} className="text-sm text-[#144272] hover:text-[#3FC1C9] hover:underline font-semibold">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginated.map((course: any) => (
              <Link
                key={course._id}
                href={`/courses/${encodeURIComponent(course._id)}`}
                className="group"
              >
                <GlassCard className="p-6 bg-white hover:border-[#3FC1C9] border-[#144272]/15 transition-all h-full flex flex-col justify-between gap-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {course.level && <LevelBadge level={course.level} />}
                      {course.duration && (
                        <span className="text-[10px] text-[#144272] flex items-center gap-1 bg-[#F5F5F5] border border-[#144272]/20 px-2 py-0.5 rounded-lg">
                          <FaClock className="h-2.5 w-2.5" />
                          {course.duration}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-[#144272] group-hover:text-[#3FC1C9] transition-colors leading-snug">
                        {course.name}
                      </h3>
                      <FaChevronRight className="h-4 w-4 text-[#144272]/40 group-hover:text-[#3FC1C9] flex-shrink-0 mt-0.5 transition-colors" />
                    </div>

                    {course.description && (
                      <p className="text-xs text-black/70 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#144272]/10">
                    {course.university?.name && (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#144272] text-[#FFD749] text-[10px] font-black flex-shrink-0">
                          {course.university.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#144272] truncate">
                            {course.university.name}
                          </p>
                          {course.university.country && (
                            <p className="text-[10px] text-black/60 flex items-center gap-1.5 mt-0.5">
                              <CountryFlag country={course.university.country} size="xs" />
                              <span>{course.university.country}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 gap-2">
                      {course.tuitionFee ? (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-black/50 block">
                            Tuition Fee
                          </span>
                          <span className="text-sm font-black text-[#144272]">
                            {course.tuitionFee}
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleCopyCourse(e, course)}
                        title="Copy course & university details for WhatsApp / Messaging"
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                          copiedCourseId === course._id
                            ? 'bg-[#3FC1C9] text-[#144272] shadow-xs'
                            : 'bg-[#F5F5F5] hover:bg-[#3FC1C9]/20 text-[#144272] border border-[#144272]/20'
                        }`}
                      >
                        {copiedCourseId === course._id ? (
                          <>
                            <FaCheck className="h-3 w-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <FaCopy className="h-3 w-3" />
                            <span>Copy Details</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>

          {filtered.length > pageSize && (
            <div className="pt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={pageSize}
                pageSizeOptions={[6, 12, 24, 48]}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 100, behavior: 'smooth' });
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
      )}
    </div>
  );
}
