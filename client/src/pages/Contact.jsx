import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const Contact = () => {
    useDocumentTitle('Contact Us');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Email Us",
            details: ["globalpathwayhub@gmail.com"],
            color: "primary"
        },
        {
            icon: <Phone className="h-6 w-6" />,
            title: "Call Us",
            details: ["+880 1410-555054"],
            color: "secondary"
        },
        {
            icon: <MapPin className="h-6 w-6" />,
            title: "Visit Us",
            details: ["Dhaka, Bangladesh"],
            color: "accent"
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Website",
            details: ["globalpathwayhub.com"],
            color: "primary"
        }
    ];

    const faqs = [
        {
            question: "How do I apply to a university?",
            answer: "Browse our universities page, select your preferred institution, and click 'Apply Now'. We'll guide you through the application process."
        },
        {
            question: "Is your consultation service free?",
            answer: "Yes! We offer free initial consultation to help you choose the right university and program."
        },
        {
            question: "Can you help with scholarship applications?",
            answer: "Absolutely! We provide information about available scholarships and assist with the application process."
        },
        {
            question: "How long does the application process take?",
            answer: "The timeline varies by university, but typically takes 2-4 weeks from application submission to admission decision."
        }
    ];

    return (
        <div className="space-y-16 pb-20">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Get In Touch
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Have questions? We're here to help you find the perfect university
                </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((info, index) => (
                    <GlassCard
                        key={index}
                        className="p-6 space-y-4 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/20 group cursor-pointer"
                    >
                        <div className={`text-${info.color} group-hover:scale-110 transition-transform`}>
                            {info.icon}
                        </div>
                        <h3 className="font-bold text-lg">{info.title}</h3>
                        <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                                <p key={idx} className="text-muted-foreground text-sm">
                                    {detail}
                                </p>
                            ))}
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Contact Form and Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <GlassCard className="p-8 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Send Us a Message</h2>
                        <p className="text-muted-foreground">
                            Fill out the form below and we'll get back to you within 24 hours
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name *</label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address *</label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+60 12-345 6789"
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject *</label>
                            <Input
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="How can we help you?"
                                required
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message *</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us more about your inquiry..."
                                required
                                rows={5}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 group"
                        >
                            <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                            Send Message
                        </Button>
                    </form>
                </GlassCard>

                {/* Quick Links and Social */}
                <div className="space-y-6">
                    <GlassCard className="p-8 space-y-6">
                        <h3 className="text-2xl font-bold">Connect With Us</h3>
                        <p className="text-muted-foreground">
                            Follow us on social media for the latest updates on universities, programs, and scholarships
                        </p>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                className="hover:bg-blue-500/20 hover:border-blue-500 hover:text-blue-500 transition-all"
                            >
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <a href="https://instagram.com/globalpathwayhub" target="_blank" rel="noopener noreferrer">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="hover:bg-pink-500/20 hover:border-pink-500 hover:text-pink-500 transition-all"
                                >
                                    <Instagram className="h-5 w-5" />
                                </Button>
                            </a>
                            <Button
                                variant="outline"
                                size="icon"
                                className="hover:bg-blue-600/20 hover:border-blue-600 hover:text-blue-600 transition-all"
                            >
                                <Linkedin className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="hover:bg-sky-500/20 hover:border-sky-500 hover:text-sky-500 transition-all"
                            >
                                <Twitter className="h-5 w-5" />
                            </Button>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="h-6 w-6 text-primary" />
                            <h3 className="text-2xl font-bold">Live Chat</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Need immediate assistance? Our live chat support is available during office hours.
                        </p>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                            Start Live Chat
                        </Button>
                    </GlassCard>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">
                        Quick answers to common questions
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqs.map((faq, index) => (
                        <GlassCard
                            key={index}
                            className="p-6 space-y-3 hover:border-primary/50 transition-all group cursor-pointer"
                        >
                            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {faq.question}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contact;
