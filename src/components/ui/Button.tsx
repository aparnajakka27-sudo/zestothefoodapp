import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'luxury'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyle = "relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 select-none overflow-hidden"
    
    const variants = {
      primary: "bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white hover:brightness-105 shadow-[0_4px_15px_rgba(255,122,48,0.25)] hover:shadow-[0_6px_22px_rgba(255,122,48,0.35)] border border-transparent",
      secondary: "bg-white text-[#1E1E1E] hover:bg-[#FAF7F2] border border-[#ECE6DD] shadow-[0_2px_8px_rgba(0,0,0,0.02)]",
      glass: "bg-white/60 border border-[#ECE6DD] text-[#1E1E1E] hover:bg-white/80 hover:border-[#ECE6DD]/80 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.02)]",
      ghost: "bg-transparent text-[#6D6D6D] hover:text-[#1E1E1E] hover:bg-[#F4EFE8]/50",
      luxury: "bg-[#FF7A30] text-white hover:bg-[#FF8C42] shadow-[0_4px_15px_rgba(255,122,48,0.25)] border border-transparent"
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        {...(props as any)}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
