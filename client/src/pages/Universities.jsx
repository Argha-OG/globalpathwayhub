import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchUniversities, fetchCourses } from '@/lib/api';
import { MapPin, CheckCircle, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const Universities = () => {
    useDocumentTitle('Universities');
    const [universities, setUniversities] = useState([]);
    const [displayItems, setDisplayItems] = useState([]);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedOfferTypes, setSelectedOfferTypes] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // Expanded State for Dropdown
    const [expandedUniversities, setExpandedUniversities] = useState(new Set());
    const [selectedCategories, setSelectedCategories] = useState({});

    useEffect(() => {
        Promise.all([fetchUniversities(), fetchCourses()]).then(([unis, courses]) => {
            // Join courses to universities and normalize data
            const combined = unis.map(u => {
                const uniCourses = courses.filter(c => c.universityId === u._id || c.university?._id === u._id || c.university === u._id);
                // Map course fields to expected UI format
                const programs = uniCourses.map(c => {
                    // Extract numeric fee from string (e.g. "$15,000/year" -> 15000)
                    const feeString = c.tuitionFee || "0";
                    const feeMatch = feeString.match(/[\d,]+/);
                    const fee = feeMatch ? parseInt(feeMatch[0].replace(/,/g, '')) : 0;

                    return {
                        title: c.name,
                        category: c.level,
                        fee: fee,
                        feeString: c.tuitionFee // keep original string if needed
                    };
                });
                return { ...u, programs };
            });

            setUniversities(combined || []);
            setDisplayItems(combined.map(u => ({ type: 'university', data: u })) || []);
        });
    }, []);

    // Extract unique locations for dropdown
    const locations = ['all', ...new Set(universities.map(u => u.location.split(',')[1]?.trim() || u.location))];

    const levels = [
        "Certificate",
        "Diploma",
        "Advance Diploma",
        "Foundation",
        "Bachelor",
        "Masters",
        "PhD"
    ];

    const handleLevelChange = (level) => {
        setSelectedLevels(prev =>
            prev.includes(level)
                ? prev.filter(l => l !== level)
                : [...prev, level]
        );
    };

    const handleOfferTypeChange = (type) => {
        setSelectedOfferTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const toggleExpand = (id) => {
        setExpandedUniversities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    useEffect(() => {
        let results = [];

        universities.forEach(uni => {
            let matchesUni = true;

            // Level filter
            if (selectedLevels.length > 0) {
                if (!uni.levels || !uni.levels.some(level => selectedLevels.includes(level))) {
                    matchesUni = false;
                }
            }

            // Location filter
            if (selectedLocation !== 'all') {
                if (!uni.location.includes(selectedLocation)) {
                    matchesUni = false;
                }
            }

            // Offer Type filter
            if (selectedOfferTypes.length > 0) {
                let typeMatch = false;
                if (selectedOfferTypes.includes('Free Offer Letter') && uni.offerLetterFee === 'Free') typeMatch = true;
                if (selectedOfferTypes.includes('Offer Letter Fees Apply') && uni.offerLetterFee === 'Paid') typeMatch = true;
                if (!typeMatch) matchesUni = false;
            }

            if (matchesUni) {
                // Search & Price Filter Logic
                const query = searchQuery.toLowerCase();
                const minPrice = priceRange.min ? parseInt(priceRange.min) : 0;
                const maxPrice = priceRange.max ? parseInt(priceRange.max) : Infinity;

                // Check if university matches search
                const uniNameMatch = uni.name.toLowerCase().includes(query);
                const uniLocationMatch = uni.location.toLowerCase().includes(query);

                // Check matching courses
                const matchingCourses = uni.programs.filter(program => {
                    const titleMatch = program.title.toLowerCase().includes(query);
                    const priceMatch = program.fee >= minPrice && program.fee <= maxPrice;
                    return titleMatch && priceMatch;
                });

                // If search query is present
                if (searchQuery) {
                    // If courses match, add them as separate items
                    if (matchingCourses.length > 0) {
                        matchingCourses.forEach(course => {
                            results.push({
                                type: 'course',
                                data: uni,
                                course: course
                            });
                        });
                    }
                    // If university matches name/location (and no specific course search or generic search), add university
                    else if (uniNameMatch || uniLocationMatch) {
                        results.push({ type: 'university', data: uni });
                    }
                } else {
                    // No search query: Filter by price only
                    if (priceRange.min || priceRange.max) {
                        // Show courses that match price
                        const priceMatchingCourses = uni.programs.filter(program =>
                            program.fee >= minPrice && program.fee <= maxPrice
                        );
                        priceMatchingCourses.forEach(course => {
                            results.push({
                                type: 'course',
                                data: uni,
                                course: course
                            });
                        });
                    } else {
                        // Default: Show university
                        results.push({ type: 'university', data: uni });
                    }
                }
            }
        });

        setDisplayItems(results);
    }, [searchQuery, selectedLevels, selectedLocation, selectedOfferTypes, priceRange, universities]);

    return (
        <div className="container mx-auto px-4 py-12 pt-24">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-1/4 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <GlassCard className="p-6 space-y-6 border-white/40 bg-white/50 backdrop-blur-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Filters</h2>
                            </div>

                            {/* Search by Name */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Search</label>
                                <div className="relative">
                                    <Input
                                        placeholder="University or Course..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-white/40 border-white/20 focus:bg-white/60 transition-all rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Course Price (RM)</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                        className="bg-white/40 border-white/20 rounded-xl"
                                    />
                                    <span className="text-muted-foreground">-</span>
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                        className="bg-white/40 border-white/20 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Level of Interest */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Level of Interest</label>
                                <div className="space-y-2">
                                    {levels.map((level) => (
                                        <div key={level} className="flex items-center space-x-3 group cursor-pointer">
                                            <Checkbox
                                                id={level}
                                                checked={selectedLevels.includes(level)}
                                                onCheckedChange={() => handleLevelChange(level)}
                                                className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                            />
                                            <label
                                                htmlFor={level}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground group-hover:text-primary transition-colors cursor-pointer"
                                            >
                                                {level}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Search by Location */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Location</label>
                                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                    <SelectTrigger className="bg-white/40 border-white/20 rounded-xl">
                                        <SelectValue placeholder="All Locations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map(loc => (
                                            <SelectItem key={loc} value={loc}>
                                                {loc === 'all' ? 'All Locations' : loc}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Offer Letter Type */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/80">Offer Letter</label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3 group cursor-pointer">
                                        <Checkbox
                                            id="free-offer"
                                            checked={selectedOfferTypes.includes('Free Offer Letter')}
                                            onCheckedChange={() => handleOfferTypeChange('Free Offer Letter')}
                                            className="border-primary/30"
                                        />
                                        <label htmlFor="free-offer" className="text-sm font-medium leading-none text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                                            Free Offer Letter
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-3 group cursor-pointer">
                                        <Checkbox
                                            id="paid-offer"
                                            checked={selectedOfferTypes.includes('Offer Letter Fees Apply')}
                                            onCheckedChange={() => handleOfferTypeChange('Offer Letter Fees Apply')}
                                            className="border-primary/30"
                                        />
                                        <label htmlFor="paid-offer" className="text-sm font-medium leading-none text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {displayItems.length} {displayItems.length === 1 ? 'Result' : 'Results'} Found
                        </h2>
                        <div className="text-sm text-muted-foreground">
                            Showing best matches for you
                        </div>
                    </div>

                    <div className="space-y-6">
                        {displayItems.map((item, index) => {
                            const university = item.data;
                            const isCourse = item.type === 'course';
                            const course = item.course;
                            const isExpanded = expandedUniversities.has(university.id);

                            return (
                                <GlassCard key={`${university.id}-${index}`} className="p-0 overflow-hidden hover:shadow-2xl transition-all duration-500 group border-white/40">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative z-10 bg-white/40 backdrop-blur-md">
                                        {/* Logo */}
                                        <div className="w-full md:w-auto flex justify-center md:justify-start flex-shrink-0">
                                            <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-white rounded-2xl shadow-sm p-4 group-hover:scale-105 transition-transform duration-500">
                                                <img
                                                    src={university.logo}
                                                    alt={`${university.name} logo`}
                                                    className="max-w-full max-h-full object-contain"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(university.name)}&size=200&background=random&color=fff&bold=true`;
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-4 w-full">
                                            <div>
                                                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{university.name}</h3>
                                                {isCourse && (
                                                    <div className="text-lg font-semibold text-primary mt-1">
                                                        {course.title}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center px-3 py-1 rounded-full bg-white/50 border border-white/20">
                                                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                                                    {university.location}
                                                </div>
                                                <div className="flex items-center px-3 py-1 rounded-full bg-white/50 border border-white/20">
                                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                                    <span>Offer Letter: </span>
                                                    <span className="ml-1 font-semibold">
                                                        {university.offerLetterFee === 'Free' ? 'Free' : 'Paid'}
                                                    </span>
                                                </div>
                                                {isCourse && (
                                                    <div className="flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                        RM {course.fee.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Dropdown Toggle for University Cards */}
                                            {!isCourse && (
                                                <div
                                                    className="flex items-center text-primary font-medium cursor-pointer mt-2 hover:text-primary/80 transition-colors w-fit group/toggle"
                                                    onClick={() => toggleExpand(university.id)}
                                                >
                                                    {isExpanded ? 'Hide Courses' : 'View Available Courses'}
                                                    {isExpanded ?
                                                        <ChevronUp className="h-4 w-4 ml-1 group-hover/toggle:-translate-y-1 transition-transform" /> :
                                                        <ChevronDown className="h-4 w-4 ml-1 group-hover/toggle:translate-y-1 transition-transform" />
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[140px]">
                                            <Link to={`/apply/${university.id}`}>
                                                <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-12 rounded-xl text-base">
                                                    Apply Now
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                className="w-full border-primary/30 text-primary hover:bg-primary/5 h-12 rounded-xl text-base"
                                                onClick={() => window.open(university.website, '_blank')}
                                            >
                                                Visit Website
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Expanded Course List */}
                                    {!isCourse && isExpanded && (
                                        <div className="bg-white/30 backdrop-blur-md border-t border-white/20 p-6 md:p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                                <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    Available Programs
                                                </h4>
                                                <Select
                                                    defaultValue="all"
                                                    onValueChange={(value) => {
                                                        setSelectedCategories(prev => ({ ...prev, [university.id]: value }));
                                                    }}
                                                >
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
                                                {university.programs
                                                    .filter(program => {
                                                        const category = selectedCategories[university.id] || 'all';
                                                        return category === 'all' || program.category === category || (category === 'PhD' && program.category === 'Doctoral Degree (PhD)');
                                                    })
                                                    .map((program, idx) => (
                                                        <div key={idx} className="flex justify-between items-center p-4 bg-white/40 rounded-xl border border-white/20 hover:bg-white/60 hover:border-primary/30 transition-all cursor-default group/course">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-foreground group-hover/course:text-primary transition-colors">{program.title}</span>
                                                                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{program.category}</span>
                                                            </div>
                                                            <span className="text-primary font-bold bg-primary/5 px-3 py-1 rounded-lg">
                                                                RM {program.fee.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                {university.programs.filter(program => {
                                                    const category = selectedCategories[university.id] || 'all';
                                                    return category === 'all' || program.category === category;
                                                }).length === 0 && (
                                                        <div className="col-span-2 text-center py-8 text-muted-foreground bg-white/20 rounded-xl border border-dashed border-white/30">
                                                            No programs found for this category.
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </GlassCard>
                            );
                        })}

                        {displayItems.length === 0 && (
                            <div className="text-center py-20">
                                <div className="inline-flex p-6 rounded-full bg-white/30 mb-4">
                                    <div className="text-4xl">🔍</div>
                                </div>
                                <h3 className="text-xl font-bold text-foreground">No matches found</h3>
                                <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Universities;
