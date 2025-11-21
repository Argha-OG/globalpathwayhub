import React from 'react';
import { cn } from "@/lib/utils"

const GlassCard = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:bg-white/70 hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
