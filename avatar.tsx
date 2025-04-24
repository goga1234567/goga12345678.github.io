"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ASCII text-based avatar component
interface TextAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  textAvatar?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TextAvatar = React.forwardRef<
  HTMLDivElement,
  TextAvatarProps
>(({ className, textAvatar = "(⌐□_□)", name, size = 'md', ...props }, ref) => {
  // Generate a fallback if no textAvatar provided
  const defaultAvatar = name 
    ? name.slice(0, 2).toUpperCase() 
    : "(⌐□_□)";
  
  const displayAvatar = textAvatar || defaultAvatar;
  
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-muted border border-retro-yellow",
        "flex items-center justify-center font-mono",
        sizeClasses[size],
        className
      )}
      title={name}
      {...props}
    >
      <span className="animate-pulse-slow">
        {displayAvatar}
      </span>
    </div>
  )
})
TextAvatar.displayName = "TextAvatar"

export { TextAvatar as Avatar }
