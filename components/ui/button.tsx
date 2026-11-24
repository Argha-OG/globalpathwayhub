"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3FC1C9] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#144272] text-white shadow-xs hover:bg-[#144272]/90 active:bg-[#144272] border border-[#144272]",
        destructive:
          "bg-[#144272] text-[#FFD749] shadow-xs hover:bg-[#144272]/90 border border-[#144272]",
        outline:
          "border border-[#144272]/30 bg-white text-[#144272] shadow-2xs hover:bg-[#F5F5F5] hover:border-[#3FC1C9] hover:text-[#144272]",
        secondary:
          "bg-[#3FC1C9] text-[#144272] font-bold shadow-xs hover:bg-[#34b0b8] border border-[#3FC1C9]",
        ghost: "hover:bg-[#F5F5F5] text-[#144272] hover:text-[#144272]",
        link: "text-[#144272] hover:text-[#3FC1C9] underline-offset-4 hover:underline",
        glow: "bg-[#144272] text-[#FFD749] shadow-md shadow-[#144272]/25 hover:bg-[#144272]/90 border border-[#3FC1C9]/50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-sm font-bold tracking-tight",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
