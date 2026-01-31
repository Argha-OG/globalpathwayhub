import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { GraduationCap, Globe, Users, Award, BookOpen, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const Home = () => {
    useDocumentTitle('Home');
    const features = [
        {
            icon: <GraduationCap className="h-12 w-12" />,
            title: "20+ Top Universities",
            description: "Access to Malaysia's leading public and private universities"
        },
        {
            icon: <BookOpen className="h-12 w-12" />,
            title: "100+ Programs",
            description: "Wide range of courses from engineering to business and arts"
        },
        {
            icon: <Users className="h-12 w-12" />,
            title: "Expert Guidance",
            description: "Professional counseling to help you make the right choice"
        },
        {
            icon: <Award className="h-12 w-12" />,
            title: "Scholarship Info",
            description: "Information on scholarships and financial aid opportunities"
        }
    ];

    const steps = [
        { number: "01", title: "Explore Universities", description: "Browse through our comprehensive list of Malaysian universities" },
        { number: "02", title: "Choose Your Program", description: "Find the perfect course that matches your career goals" },
        { number: "03", title: "Get Expert Advice", description: "Consult with our education counselors for personalized guidance" },
        { number: "04", title: "Apply & Succeed", description: "Submit your application and start your academic journey" }
    ];

    const stats = [
        { value: "20+", label: "Universities" },
        { value: "100+", label: "Programs" },
        { value: "50K+", label: "Students" },
        { value: "95%", label: "Success Rate" }
    ];

    return (
        <div className="space-y-32 pb-20 pt-10">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center">
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-in slide-in-from-left duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-sm font-semibold text-primary shadow-sm">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            Your Future Starts Here
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1]">
                            Global
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary">
                                PathwayHub
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                            Connect with Malaysia's top universities. Explore programs, compare institutions, and take the first step towards your academic success with our expert guidance.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/universities">
                                <Button size="lg" variant="glow" className="text-lg px-8 py-6 rounded-full">
                                    Explore Universities
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-white/50">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>

                        {/* Floating Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative hidden lg:block animate-in slide-in-from-right duration-700 delay-200">
                        <div className="relative z-10 grid grid-cols-2 gap-6">
                            <GlassCard className="mt-12 animate-float delay-700">
                                <GraduationCap className="h-12 w-12 text-primary mb-4" />
                                <div className="text-4xl font-bold">20+</div>
                                <div className="text-sm text-muted-foreground">Partner Universities</div>
                            </GlassCard>
                            <GlassCard className="animate-float delay-1000">
                                <Users className="h-12 w-12 text-secondary mb-4" />
                                <div className="text-4xl font-bold">50K+</div>
                                <div className="text-sm text-muted-foreground">Students Helped</div>
                            </GlassCard>
                            <GlassCard className="col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-full shadow-lg">
                                        <Globe className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">Global Reach</div>
                                        <div className="text-sm text-muted-foreground">Connecting you to world-class education</div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Decorative blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-[80px] -z-10" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold">Why Choose GlobalPathwayHub?</h2>
                    <p className="text-xl text-muted-foreground">
                        We provide comprehensive support for your higher education journey with a personalized approach.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <GlassCard
                            key={index}
                            className={`p-8 space-y-4 group cursor-pointer hover:bg-white/80 ${index % 2 === 0 ? 'lg:translate-y-8' : ''}`}
                        >
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <div className="text-primary">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="space-y-16 py-20">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">Your Journey Starts Here</h2>
                    <p className="text-xl text-muted-foreground">
                        4 simple steps to your dream university
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 -translate-y-1/2 hidden lg:block" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative group">
                                <GlassCard className="p-8 space-y-4 relative z-10 h-full hover:border-primary/50">
                                    <div className="text-6xl font-black text-primary/10 absolute top-4 right-4 group-hover:text-primary/20 transition-colors">
                                        {step.number}
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold pt-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </GlassCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* University Categories */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">Explore Categories</h2>
                    <p className="text-xl text-muted-foreground">
                        Find the institution that fits your needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <GlassCard className="p-10 space-y-8 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-colors" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-secondary/20 rounded-2xl">
                                    <GraduationCap className="h-10 w-10 text-secondary" />
                                </div>
                                <h3 className="text-3xl font-bold">Public Universities</h3>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-lg">
                                    <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0" />
                                    <span>Affordable tuition fees (RM 700 - RM 5,000/year)</span>
                                </li>
                                <li className="flex items-center gap-3 text-lg">
                                    <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0" />
                                    <span>Government-funded facilities</span>
                                </li>
                                <li className="flex items-center gap-3 text-lg">
                                    <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0" />
                                    <span>Top research institutions</span>
                                </li>
                            </ul>

                            <Link to="/universities">
                                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-14 text-lg rounded-xl shadow-lg shadow-secondary/20">
                                    View Public Universities
                                </Button>
                            </Link>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-10 space-y-8 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-primary/20 rounded-2xl">
                                    <Globe className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold">Private Universities</h3>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-lg">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                    <span>Flexible programs & intakes</span>
                                </li>
                                <li className="flex items-center gap-3 text-lg">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                    <span>International partnerships</span>
                                </li>
                                <li className="flex items-center gap-3 text-lg">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                    <span>Modern campus facilities</span>
                                </li>
                            </ul>

                            <Link to="/universities">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg rounded-xl shadow-lg shadow-primary/20">
                                    View Private Universities
                                </Button>
                            </Link>
                        </div>
                    </GlassCard>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative">
                <GlassCard className="p-16 text-center space-y-8 overflow-hidden relative border-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
                    <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to Start Your Journey?</h2>
                        <p className="text-xl md:text-2xl text-muted-foreground">
                            Join thousands of students who have found their perfect university through GlobalPathwayHub
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                            <Link to="/universities">
                                <Button size="lg" variant="glow" className="text-xl px-12 py-8 rounded-full h-auto">
                                    Explore Universities Now
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button size="lg" variant="outline" className="text-xl px-12 py-8 rounded-full h-auto border-2">
                                    Get Free Consultation
                                </Button>
                            </Link>
                        </div>
                    </div>
                </GlassCard>
            </section>
        </div>
    );
};

export default Home;
