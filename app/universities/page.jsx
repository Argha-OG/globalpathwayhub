'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    FaLocationDot,
    FaCircleCheck,
    FaDollarSign,
    FaChevronDown,
    FaChevronUp,
    FaMagnifyingGlass,
    FaFilter,
} from 'react-icons/fa6';
import Pagination from '@/components/Pagination';

const Universities = () => {
    const [universities, setUniversities] = useState([]);
    const [displayItems, setDisplayItems] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedOfferTypes, setSelectedOfferTypes] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [expandedUniversities, setExpandedUniversities] = useState(new Set());
    const [selectedCategories, setSelectedCategories] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    useEffect(() => {
        Promise.all([
            fetch('/api/universities').then(r => r.json()),
            fetch('/api/courses').then(r => r.json())
        ]).then(([unis, courses]) => {
            const combined = (unis || []).map(u => {
                const uniCourses = (courses || []).filter(c =>
                    c.universityId === u._id || c.university?._id === u._id || c.university === u._id
                );
                const programs = uniCourses.map(c => {
                    const feeString = c.tuitionFee || '0';
                    const feeMatch = feeString.match(/[\d,]+/);
                    const fee = feeMatch ? parseInt(feeMatch[0].replace(/,/g, '')) : 0;
                    return { title: c.name, category: c.level, fee, feeString: c.tuitionFee };
                });
                return { ...u, programs };
            });
            setUniversities(combined);
            setDisplayItems(combined.map(u => ({ type: 'university', data: u })));
        }).catch(() => {});
    }, []);

    const locations = ['all', ...new Set(universities.map(u => u.location?.split(',')[1]?.trim() || u.location))];

    const levels = ['Certificate', 'Diploma', 'Advance Diploma', 'Foundation', 'Bachelor', 'Masters', 'PhD'];

    const handleLevelChange = (level) => {
        setSelectedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
    };

    const handleOfferTypeChange = (type) => {
        setSelectedOfferTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const toggleExpand = (id) => {
        setExpandedUniversities(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    useEffect(() => {
        let results = [];
        universities.forEach(uni => {
            let matchesUni = true;
            if (selectedLevels.length > 0 && (!uni.levels || !uni.levels.some(l => selectedLevels.includes(l)))) matchesUni = false;
            if (selectedLocation !== 'all' && !uni.location?.includes(selectedLocation)) matchesUni = false;
            if (selectedOfferTypes.length > 0) {
                let typeMatch = false;
                if (selectedOfferTypes.includes('Free Offer Letter') && uni.offerLetterFee === 'Free') typeMatch = true;
                if (selectedOfferTypes.includes('Offer Letter Fees Apply') && uni.offerLetterFee === 'Paid') typeMatch = true;
                if (!typeMatch) matchesUni = false;
            }
            if (matchesUni) {
                const query = searchQuery.toLowerCase();
                const minPrice = priceRange.min ? parseInt(priceRange.min) : 0;
                const maxPrice = priceRange.max ? parseInt(priceRange.max) : Infinity;
                const uniNameMatch = uni.name?.toLowerCase().includes(query);
                const uniLocationMatch = uni.location?.toLowerCase().includes(query);
                const matchingCourses = (uni.programs || []).filter(p => p.title?.toLowerCase().includes(query) && p.fee >= minPrice && p.fee <= maxPrice);
                if (searchQuery) {
                    if (matchingCourses.length > 0) matchingCourses.forEach(course => results.push({ type: 'course', data: uni, course }));
                    else if (uniNameMatch || uniLocationMatch) results.push({ type: 'university', data: uni });
                } else {
                    if (priceRange.min || priceRange.max) {
                        (uni.programs || []).filter(p => p.fee >= minPrice && p.fee <= maxPrice).forEach(course => results.push({ type: 'course', data: uni, course }));
                    } else {
                        results.push({ type: 'university', data: uni });
                    }
                }
            }
        });
        setDisplayItems(results);
        setCurrentPage(1);
    }, [searchQuery, selectedLevels, selectedLocation, selectedOfferTypes, priceRange, universities]);

    const totalPages = Math.ceil(displayItems.length / pageSize) || 1;
    const paginatedItems = displayItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="container mx-auto px-4 py-12 pt-24">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-1/4 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <GlassCard className="p-6 space-y-6 border-white/40 bg-white/50 backdrop-blur-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FaFilter className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Filters</h2>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Search</label>
                                <Input
                                    placeholder="University or Course..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/40 border-white/20 focus:bg-white/60 transition-all rounded-xl"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Course Price (RM)</label>
                                <div className="flex items-center gap-2">
                                    <Input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))} className="bg-white/40 border-white/20 rounded-xl" />
                                    <span className="text-muted-foreground">-</span>
                                    <Input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))} className="bg-white/40 border-white/20 rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Level of Interest</label>
                                <div className="space-y-2">
                                    {levels.map((level) => (
                                        <div key={level} className="flex items-center space-x-3 group cursor-pointer">
                                            <Checkbox id={level} checked={selectedLevels.includes(level)} onCheckedChange={() => handleLevelChange(level)} className="border-primary/30 data-[state=checked]:bg-primary" />
                                            <label htmlFor={level} className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">{level}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Location</label>
                                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                    <SelectTrigger className="bg-white/40 border-white/20 rounded-xl">
                                        <SelectValue placeholder="All Locations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map(loc => (
                                            <SelectItem key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Offer Letter</label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3 group cursor-pointer">
                                        <Checkbox id="free-offer" checked={selectedOfferTypes.includes('Free Offer Letter')} onCheckedChange={() => handleOfferTypeChange('Free Offer Letter')} className="border-primary/30" />
                                        <label htmlFor="free-offer" className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">Free Offer Letter</label>
                                    </div>
                                    <div className="flex items-center space-x-3 group cursor-pointer">
                                        <Checkbox id="paid-offer" checked={selectedOfferTypes.includes('Offer Letter Fees Apply')} onCheckedChange={() => handleOfferTypeChange('Offer Letter Fees Apply')} className="border-primary/30" />
                                        <label htmlFor="paid-offer" className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">Offer Letter Fees Apply</label>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full lg:w-3/4 space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{displayItems.length} {displayItems.length === 1 ? 'Result' : 'Results'} Found</h2>
                        <div className="text-sm text-muted-foreground">Showing best matches for you</div>
                    </div>

                    <div className="space-y-6">
                        {paginatedItems.map((item, index) => {
                            const university = item.data;
                            const isCourse = item.type === 'course';
                            const course = item.course;
                            const isExpanded = expandedUniversities.has(university._id);

                            return (
                                <GlassCard key={`${university._id}-${index}`} className="p-0 overflow-hidden hover:shadow-2xl transition-all duration-500 group border-white/40">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative z-10 bg-white/40 backdrop-blur-md">
                                        <div className="w-full md:w-auto flex justify-center md:justify-start flex-shrink-0">
                                            <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-white rounded-2xl shadow-sm p-4 group-hover:scale-105 transition-transform duration-500">
                                                <img
                                                    src={university.logo}
                                                    alt={`${university.name} logo`}
                                                    className="max-w-full max-h-full object-contain"
                                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(university.name)}&size=200&background=random&color=fff&bold=true`; }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 w-full">
                                            <div>
                                                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{university.name}</h3>
                                                {isCourse && <div className="text-lg font-semibold text-primary mt-1">{course.title}</div>}
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center px-3 py-1 rounded-full bg-white/50 border border-white/20">
                                                    <FaLocationDot className="h-3.5 w-3.5 mr-2 text-primary" />{university.location}
                                                </div>
                                                <div className="flex items-center px-3 py-1 rounded-full bg-white/50 border border-white/20">
                                                    <FaCircleCheck className="h-3.5 w-3.5 mr-2 text-green-500" />
                                                    <span>Offer Letter: </span>
                                                    <span className="ml-1 font-semibold">{university.offerLetterFee === 'Free' ? 'Free' : 'Paid'}</span>
                                                </div>
                                                {isCourse && (
                                                    <div className="flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
                                                        <FaDollarSign className="h-3.5 w-3.5 mr-1" />RM {course.fee?.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>

                                            {!isCourse && (
                                                <div className="flex items-center text-primary font-medium cursor-pointer mt-2 hover:text-primary/80 transition-colors w-fit group/toggle" onClick={() => toggleExpand(university._id)}>
                                                    {isExpanded ? 'Hide Courses' : 'View Available Courses'}
                                                    {isExpanded ? <FaChevronUp className="h-3.5 w-3.5 ml-1" /> : <FaChevronDown className="h-3.5 w-3.5 ml-1" />}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[140px]">
                                            <Link href={`/apply/${university._id}`}>
                                                <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-12 rounded-xl text-base">Apply Now</Button>
                                            </Link>
                                            <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/5 h-12 rounded-xl text-base" onClick={() => window.open(university.website, '_blank')}>
                                                Visit Website
                                            </Button>
                                        </div>
                                    </div>

                                    {!isCourse && isExpanded && (
                                        <div className="bg-white/30 backdrop-blur-md border-t border-white/20 p-6 md:p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                                <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />Available Programs
                                                </h4>
                                                <Select defaultValue="all" onValueChange={(value) => setSelectedCategories(prev => ({ ...prev, [university._id]: value }))}>
                                                    <SelectTrigger className="w-[200px] bg-white/50 border-white/30 rounded-xl">
                                                        <SelectValue placeholder="Filter by Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Categories</SelectItem>
                                                        <SelectItem value="Certificate">Certificate</SelectItem>
                                                        <SelectItem value="Diploma">Diploma</SelectItem>
                                                        <SelectItem value="Advance Diploma">Advance Diploma</SelectItem>
                                                        <SelectItem value="Foundation">Foundation</SelectItem>
                                                        <SelectItem value="Bachelor">Bachelor Degree</SelectItem>
                                                        <SelectItem value="Masters">Masters Degree</SelectItem>
                                                        <SelectItem value="PhD">PhD / Doctorate</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {(university.programs || [])
                                                    .filter(p => {
                                                        const cat = selectedCategories[university._id] || 'all';
                                                        return cat === 'all' || p.category === cat;
                                                    })
                                                    .map((program, idx) => (
                                                        <div key={idx} className="flex justify-between items-center p-4 bg-white/40 rounded-xl border border-white/20 hover:bg-white/60 hover:border-primary/30 transition-all cursor-default group/course">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-foreground group-hover/course:text-primary transition-colors">{program.title}</span>
                                                                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{program.category}</span>
                                                            </div>
                                                            <span className="text-primary font-bold bg-primary/5 px-3 py-1 rounded-lg">RM {program.fee?.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </GlassCard>
                            );
                        })}

                        {displayItems.length === 0 && (
                            <div className="text-center py-20">
                                <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-white/10 mb-4 text-slate-400">
                                    <FaMagnifyingGlass className="w-9 h-9" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">No matches found</h3>
                                <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
                            </div>
                        )}

                        {displayItems.length > 0 && (
                            <div className="pt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={displayItems.length}
                                    pageSize={pageSize}
                                    pageSizeOptions={[3, 6, 12, 24]}
                                    onPageChange={(page) => {
                                        setCurrentPage(page);
                                        window.scrollTo({ top: 100, behavior: 'smooth' });
                                    }}
                                    onPageSizeChange={(newSize) => {
                                        setPageSize(newSize);
                                        setCurrentPage(1);
                                    }}
                                    className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 p-4 shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Universities;
