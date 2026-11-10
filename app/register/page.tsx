'use client';

import React from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { FaShieldHalved, FaArrowLeft, FaRightToBracket } from 'react-icons/fa6';

const Register = () => {
    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 pt-24">
            <GlassCard className="w-full max-w-lg space-y-6 p-8 text-center border-amber-500/20 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                    <FaShieldHalved className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Staff & Agent Access Only</h1>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                        Public self-registration is closed. GlobalPathwayHub management provisions credentials directly for verified counselors, administrators, and partner agents.
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left text-xs space-y-2 text-muted-foreground">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Are you an Education Agent or Counselor?
                    </div>
                    <p>
                        To request partner agency onboarding or obtain staff portal credentials, contact head office management at <span className="text-primary font-medium">globalpathwayhub@gmail.com</span> or call <span className="text-primary font-medium">+880 1410-555054</span>.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link href="/admin" className="flex-1">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2">
                            <FaRightToBracket className="w-4 h-4" />
                            Staff & Agent Login
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full border-white/20 flex items-center justify-center gap-2">
                            <FaArrowLeft className="w-4 h-4" />
                            Back to Website
                        </Button>
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
};

export default Register;
