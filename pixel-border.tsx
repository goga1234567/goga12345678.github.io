import React, { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface PixelBorderProps extends HTMLAttributes<HTMLDivElement> {}

export const PixelBorder = forwardRef<HTMLDivElement, PixelBorderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pixel-border", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PixelBorder.displayName = "PixelBorder";
