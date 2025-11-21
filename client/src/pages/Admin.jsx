import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addCountry, addUniversity, addCourse, fetchCountries, fetchUniversities } from '@/lib/api';

const Admin = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [universities, setUniversities] = useState([]);

    // Form States
    const [countryForm, setCountryForm] = useState({ name: '', code: '' });
    const [uniForm, setUniForm] = useState({ name: '', countryId: '', location: '' });
    const [courseForm, setCourseForm] = useState({ name: '', universityId: '', level: '', duration: '' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        refreshData();
    }, [navigate]);

    const refreshData = () => {
        fetchCountries().then(setCountries);
        fetchUniversities().then(setUniversities);
    };

    const handleAddCountry = async (e) => {
        e.preventDefault();
        await addCountry(countryForm);
        setCountryForm({ name: '', code: '' });
        refreshData();
        alert('Country added!');
    };

    const handleAddUni = async (e) => {
        e.preventDefault();
        await addUniversity(uniForm);
        setUniForm({ name: '', countryId: '', location: '' });
        refreshData();
        alert('University added!');
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        await addCourse(courseForm);
        setCourseForm({ name: '', universityId: '', level: '', duration: '' });
        alert('Course added!');
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <Button variant="outline" onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/login');
                }}>Logout</Button>
            </div>

            <Tabs defaultValue="country" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5">
                    <TabsTrigger value="country">Add Country</TabsTrigger>
                    <TabsTrigger value="university">Add University</TabsTrigger>
                    <TabsTrigger value="course">Add Course</TabsTrigger>
                </TabsList>

                <TabsContent value="country">
                    <GlassCard>
                        <form onSubmit={handleAddCountry} className="space-y-4 max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-center mb-6">Add New Country</h2>
                            <div className="space-y-2">
                                <Label>Country Name</Label>
                                <Input
                                    value={countryForm.name}
                                    onChange={e => setCountryForm({ ...countryForm, name: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Country Code</Label>
                                <Input
                                    value={countryForm.code}
                                    onChange={e => setCountryForm({ ...countryForm, code: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <Button type="submit" className="w-full">Add Country</Button>
                        </form>
                    </GlassCard>
                </TabsContent>

                <TabsContent value="university">
                    <GlassCard>
                        <form onSubmit={handleAddUni} className="space-y-4 max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-center mb-6">Add New University</h2>
                            <div className="space-y-2">
                                <Label>University Name</Label>
                                <Input
                                    value={uniForm.name}
                                    onChange={e => setUniForm({ ...uniForm, name: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Select
                                    value={uniForm.countryId}
                                    onValueChange={val => setUniForm({ ...uniForm, countryId: val })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={uniForm.location}
                                    onChange={e => setUniForm({ ...uniForm, location: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <Button type="submit" className="w-full">Add University</Button>
                        </form>
                    </GlassCard>
                </TabsContent>

                <TabsContent value="course">
                    <GlassCard>
                        <form onSubmit={handleAddCourse} className="space-y-4 max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-center mb-6">Add New Course</h2>
                            <div className="space-y-2">
                                <Label>Course Name</Label>
                                <Input
                                    value={courseForm.name}
                                    onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>University</Label>
                                <Select
                                    value={courseForm.universityId}
                                    onValueChange={val => setCourseForm({ ...courseForm, universityId: val })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select University" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {universities.map(u => (
                                            <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Level</Label>
                                <Select
                                    value={courseForm.level}
                                    onValueChange={val => setCourseForm({ ...courseForm, level: val })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bachelors">Bachelors</SelectItem>
                                        <SelectItem value="Masters">Masters</SelectItem>
                                        <SelectItem value="PhD">PhD</SelectItem>
                                        <SelectItem value="Diploma">Diploma</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Duration</Label>
                                <Input
                                    value={courseForm.duration}
                                    onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                                    placeholder="e.g. 4 years"
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <Button type="submit" className="w-full">Add Course</Button>
                        </form>
                    </GlassCard>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Admin;
