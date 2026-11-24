import React from 'react';
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "bg-white border border-[#144272]/15 shadow-xs rounded-lg p-6 transition-all duration-200 hover:shadow-md hover:border-[#3FC1C9] hover:-translate-y-0.5",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
