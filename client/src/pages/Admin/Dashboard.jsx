import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addUniversity, addCourse, fetchCountries, fetchUniversities } from '@/lib/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ universities: 0, courses: 0 });

    // Data for selectors
    const [countries, setCountries] = useState([]);
    const [universities, setUniversities] = useState([]);

    // Forms
    const [uniForm, setUniForm] = useState({ name: '', country: '', location: '', website: '' });
    const [courseForm, setCourseForm] = useState({ name: '', universityId: '', level: '', duration: '', tuitionFee: '' });

    useEffect(() => {
        const userStr = localStorage.getItem('admin_user');
        if (userStr) {
            setUser(JSON.parse(userStr));
            refreshData();
        } else {
            navigate('/admin/login');
        }
    }, [navigate]);

    const refreshData = async () => {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
        const unisData = await fetchUniversities();
        setUniversities(unisData);
        setStats({
            universities: unisData.length,
            courses: 0 // need to fetch total courses if desired, or skip
        });
    };

    const handleLogout = async () => {
        logoutUser();
        navigate('/admin/login');
    };

    const handleAddUni = async (e) => {
        e.preventDefault();
        const res = await addUniversity(uniForm);
        if (res.success) {
            alert('University added successfully!');
            setUniForm({ name: '', country: '', location: '', website: '' });
            refreshData();
        } else {
            alert('Error: ' + res.message);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        const res = await addCourse(courseForm);
        if (res.success) {
            alert('Course added successfully!');
            setCourseForm({ name: '', universityId: '', level: '', duration: '', tuitionFee: '' });
        } else {
            alert('Error: ' + res.message);
        }
    };

    if (!user) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400">Welcome, {user.email}</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/50">
                    Logout
                </Button>
            </div>

            <Tabs defaultValue="university" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-8">
                    <TabsTrigger value="university">Add University</TabsTrigger>
                    <TabsTrigger value="course">Add Course</TabsTrigger>
                </TabsList>

                <TabsContent value="university">
                    <GlassCard>
                        <form onSubmit={handleAddUni} className="space-y-4">
                            <h2 className="text-xl font-bold mb-4">New University Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <Label>Location</Label>
                                    <Input
                                        value={uniForm.location}
                                        onChange={e => setUniForm({ ...uniForm, location: e.target.value })}
                                        required
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Country</Label>
                                    <Select
                                        value={uniForm.country}
                                        onValueChange={val => setUniForm({ ...uniForm, country: val })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map(c => (
                                                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Website (Optional)</Label>
                                    <Input
                                        value={uniForm.website}
                                        onChange={e => setUniForm({ ...uniForm, website: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4">Save University</Button>
                        </form>
                    </GlassCard>
                </TabsContent>

                <TabsContent value="course">
                    <GlassCard>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <h2 className="text-xl font-bold mb-4">New Course Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>
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
                                        placeholder="e.g. 3 years"
                                        required
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4">Save Course</Button>
                        </form>
                    </GlassCard>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;
