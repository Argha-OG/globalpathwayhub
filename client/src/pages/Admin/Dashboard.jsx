import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addUniversity, addCourse, fetchCountries, fetchUniversities, fetchCourses, updateUniversity, deleteUniversity, updateCourse, deleteCourse } from '@/lib/api';
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ universities: 0, courses: 0 });

    // Data for selectors
    const [countries, setCountries] = useState([]);
    const [universities, setUniversities] = useState([]);

    // Forms
    const [uniForm, setUniForm] = useState({ name: '', country: '', location: '', website: '', image: null });
    const [courseForm, setCourseForm] = useState({ name: '', universityId: '', level: '', duration: '', tuitionFee: '', description: '' });

    const [editingUni, setEditingUni] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [allCourses, setAllCourses] = useState([]);

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
        const coursesData = await fetchCourses();
        setAllCourses(coursesData);
        setStats({
            universities: unisData.length,
            courses: coursesData.length
        });
    };

    const handleLogout = async () => {
        logoutUser();
        navigate('/admin/login');
    };

    const handleAddUni = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', uniForm.name);
        data.append('country', uniForm.country);
        data.append('location', uniForm.location);
        data.append('website', uniForm.website);
        if (uniForm.image) {
            data.append('image', uniForm.image);
        }

        let res;
        if (editingUni) {
            res = await updateUniversity(editingUni._id, data);
        } else {
            res = await addUniversity(data);
        }

        if (res.success) {
            alert(editingUni ? 'University updated!' : 'University added!');
            setUniForm({ name: '', country: '', location: '', website: '', image: null });
            setEditingUni(null);
            refreshData();
        } else {
            alert('Error: ' + res.message);
        }
    };

    const handleEditUni = (uni) => {
        setEditingUni(uni);
        setUniForm({
            name: uni.name,
            country: uni.country,
            location: uni.location,
            website: uni.website || '',
            image: null // Can't preset file input
        });
        // Switch tab if needed, but we are likely on the tab
    };

    const handleDeleteUni = async (id) => {
        if (!window.confirm("Are you sure? This will delete the university.")) return;
        const res = await deleteUniversity(id);
        if (res.success) {
            refreshData();
        } else {
            alert(res.message);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        let res;
        if (editingCourse) {
            res = await updateCourse(editingCourse._id, courseForm);
        } else {
            res = await addCourse(courseForm);
        }

        if (res.success) {
            alert(editingCourse ? 'Course updated!' : 'Course added!');
            setCourseForm({ name: '', universityId: '', level: '', duration: '', tuitionFee: '', description: '' });
            setEditingCourse(null);
            refreshData();
        } else {
            alert('Error: ' + res.message);
        }
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setCourseForm({
            name: course.name,
            universityId: course.universityId || course.university?._id || course.university, // Handle populated or raw ID
            level: course.level,
            duration: course.duration,
            tuitionFee: course.tuitionFee || '',
            description: course.description || ''
        });
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Are you sure? This will delete the course.")) return;
        const res = await deleteCourse(id);
        if (res.success) {
            refreshData();
        } else {
            alert(res.message);
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
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{editingUni ? 'Edit University' : 'New University Details'}</h2>
                                {editingUni && (
                                    <Button type="button" variant="ghost" onClick={() => {
                                        setEditingUni(null);
                                        setUniForm({ name: '', country: '', location: '', website: '', image: null });
                                    }}>Cancel Edit</Button>
                                )}
                            </div>
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>University Logo/Image</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setUniForm({ ...uniForm, image: e.target.files[0] })}
                                        className="bg-white/5 border-white/10 text-foreground file:text-foreground"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4">{editingUni ? 'Update University' : 'Save University'}</Button>
                        </form>

                        <div className="mt-12">
                            <h3 className="text-lg font-bold mb-4">Existing Universities</h3>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {universities.map(uni => (
                                    <Card key={uni._id} className="bg-white/5 border-white/10">
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold">{uni.name}</h4>
                                                <p className="text-sm text-gray-400">{uni.country}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-blue-400 border-blue-400/20" onClick={() => handleEditUni(uni)}>Edit</Button>
                                                <Button size="sm" variant="outline" className="text-red-400 border-red-400/20" onClick={() => handleDeleteUni(uni._id)}>Delete</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </TabsContent>

                <TabsContent value="course">
                    <GlassCard>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{editingCourse ? 'Edit Course' : 'New Course Details'}</h2>
                                {editingCourse && (
                                    <Button type="button" variant="ghost" onClick={() => {
                                        setEditingCourse(null);
                                        setCourseForm({ name: '', universityId: '', level: '', duration: '', tuitionFee: '', description: '' });
                                    }}>Cancel Edit</Button>
                                )}
                            </div>
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
                                <div className="space-y-2">
                                    <Label>Tuition Fee</Label>
                                    <Input
                                        value={courseForm.tuitionFee}
                                        onChange={e => setCourseForm({ ...courseForm, tuitionFee: e.target.value })}
                                        placeholder="e.g. $10,000/year"
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={courseForm.description}
                                        onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                                        placeholder="Brief course description"
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4">{editingCourse ? 'Update Course' : 'Save Course'}</Button>
                        </form>

                        <div className="mt-12">
                            <h3 className="text-lg font-bold mb-4">Existing Courses</h3>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {allCourses.map(course => (
                                    <Card key={course._id} className="bg-white/5 border-white/10">
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold">{course.name}</h4>
                                                <p className="text-sm text-gray-400">{course.university?.name || 'Unknown University'} - {course.level}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-blue-400 border-blue-400/20" onClick={() => handleEditCourse(course)}>Edit</Button>
                                                <Button size="sm" variant="outline" className="text-red-400 border-red-400/20" onClick={() => handleDeleteCourse(course._id)}>Delete</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;
