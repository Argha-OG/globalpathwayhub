'use client';

import React from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { FaShieldHalved, FaArrowLeft, FaRightToBracket } from 'react-icons/fa6';

const Register = () => {
    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 pt-24">
            <GlassCard className="w-full max-w-lg space-y-6 p-8 text-center bg-white border border-[#144272]/15 shadow-sm rounded-lg">
                <div className="w-16 h-16 rounded-lg bg-[#FFD749] border border-[#144272]/20 flex items-center justify-center mx-auto text-black shadow-xs">
                    <FaShieldHalved className="w-8 h-8 text-[#144272]" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black tracking-tight text-[#144272]">Staff &amp; Agent Access Only</h1>
                    <p className="text-black/70 text-sm max-w-sm mx-auto">
                        Public self-registration is closed. GlobalPathwayHub management provisions credentials directly for verified counselors, administrators, and partner agents.
                    </p>
                </div>

                <div className="bg-[#F5F5F5] border border-[#144272]/15 rounded-lg p-4 text-left text-xs space-y-2 text-black/70">
                    <div className="font-bold text-[#144272] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-lg bg-[#3FC1C9]"></span>
                        Are you an Education Agent or Counselor?
                    </div>
                    <p>
                        To request partner agency onboarding or obtain staff portal credentials, contact head office management at <span className="text-[#144272] font-bold">globalpathwayhub@gmail.com</span> or call <span className="text-[#144272] font-bold">+880 1410-555054</span>.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link href="/contact" className="flex-1">
                        <Button className="w-full bg-[#144272] hover:bg-[#144272]/90 text-[#FFD749] flex items-center justify-center gap-2 rounded-lg font-bold text-xs uppercase tracking-wider h-10">
                            <FaRightToBracket className="w-4 h-4" />
                            Contact Head Office
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full border-[#144272]/30 text-[#144272] hover:bg-[#F5F5F5] flex items-center justify-center gap-2 rounded-lg font-bold text-xs h-10">
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
