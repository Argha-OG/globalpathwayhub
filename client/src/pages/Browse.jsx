import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchCountries, fetchUniversities, fetchCourses } from '@/lib/api';
import { Search, MapPin, BookOpen, School } from 'lucide-react';

const Browse = () => {
    const [countries, setCountries] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [courses, setCourses] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCountries()
            .then(data => setCountries(data || []))
            .catch(err => {
                console.error('Error fetching countries:', err);
                setCountries([]);
            });
        fetchUniversities()
            .then(data => setUniversities(data || []))
            .catch(err => {
                console.error('Error fetching universities:', err);
                setUniversities([]);
            });
        fetchCourses()
            .then(data => setCourses(data || []))
            .catch(err => {
                console.error('Error fetching courses:', err);
                setCourses([]);
            });
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            fetchUniversities(selectedCountry)
                .then(data => setUniversities(data || []))
                .catch(err => {
                    console.error('Error fetching universities:', err);
                    setUniversities([]);
                });
            setSelectedUniversity(''); // Reset university when country changes
        } else {
            fetchUniversities()
                .then(data => setUniversities(data || []))
                .catch(err => {
                    console.error('Error fetching universities:', err);
                    setUniversities([]);
                });
        }
    }, [selectedCountry]);

    useEffect(() => {
        fetchCourses(selectedUniversity, searchQuery)
            .then(data => setCourses(data || []))
            .catch(err => {
                console.error('Error fetching courses:', err);
                setCourses([]);
            });
    }, [selectedUniversity, searchQuery]);

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Browse Courses
                    </h1>
                    <p className="text-muted-foreground mt-2">Find your dream course in top universities.</p>
                </div>
                <div className="w-full md:w-1/3 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search courses..."
                        className="pl-10 bg-white/5 border-white/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <GlassCard className="md:col-span-1 h-fit space-y-6 sticky top-24">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" /> Filters
                        </h2>
                        <div className="h-1 w-full bg-gradient-to-r from-primary to-transparent rounded-full opacity-20" />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Country</label>
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="All Countries" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Countries</SelectItem>
                                    {Array.isArray(countries) && countries.map(c => c && c.id ? (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ) : null)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">University</label>
                            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="All Universities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Universities</SelectItem>
                                    {Array.isArray(universities) && universities.map(u => u && u.id ? (
                                        <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                    ) : null)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setSelectedCountry('');
                            setSelectedUniversity('');
                            setSearchQuery('');
                        }}
                    >
                        Reset Filters
                    </Button>
                </GlassCard>

                {/* Results Grid */}
                <div className="md:col-span-3 space-y-6">
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Showing {courses.length} courses</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {courses.map(course => (
                            <GlassCard key={course.id} className="group hover:border-primary/50 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                            {course.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <School className="h-4 w-4" /> {course.university?.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" /> {course.country?.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" /> {course.level}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 min-w-[120px]">
                                        <div className="text-right md:text-right">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Duration</span>
                                            <p className="font-semibold">{course.duration}</p>
                                        </div>
                                        <Button className="w-full mt-auto">Apply Now</Button>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}

                        {courses.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No courses found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Browse;
