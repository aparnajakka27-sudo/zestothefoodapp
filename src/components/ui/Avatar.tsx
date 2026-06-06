import React from 'react'
import { motion } from 'framer-motion'

interface AvatarProps {
  src?: string
  fallback: string
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  isActive?: boolean
  indicator?: 'yes' | 'no' | 'veto' | null
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  fallback,
  color = 'bg-neutral-800',
  size = 'md',
  className = '',
  isActive = false,
  indicator = null
}) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  }

  const indicatorColors = {
    yes: "bg-emerald-500 text-white border-2 border-white",
    no: "bg-rose-500 text-white border-2 border-white",
    veto: "bg-[#FF7A30] text-white border-2 border-white"
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        animate={isActive ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
        className={`rounded-full overflow-hidden flex items-center justify-center font-bold font-sans select-none border-2 ${isActive ? 'border-[#FF7A30] shadow-[0_0_12px_rgba(255,122,48,0.4)]' : 'border-[#ECE6DD]'} ${sizes[size]} ${color}`}
      >
        {src ? (
          <img src={src} alt={fallback} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white">{fallback}</span>
        )}
      </motion.div>
      
      {indicator && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`absolute -bottom-1 -right-1 rounded-full p-1 w-5 h-5 flex items-center justify-center text-[10px] font-black ${indicatorColors[indicator]}`}
        >
          {indicator === 'yes' && '✓'}
          {indicator === 'no' && '✗'}
          {indicator === 'veto' && '🚫'}
        </motion.div>
      )}
    </div>
  )
}

interface AvatarGroupProps {
  children: React.ReactNode
  className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex -space-x-3 items-center ${className}`}>
      {children}
    </div>
  )
}
