import React from 'react'
import { motion } from 'framer-motion'

interface GamerAvatarProps {
  name: string
  avatarColor: string
  isReady?: boolean
  isOnline?: boolean
  isCreator?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const GamerAvatar: React.FC<GamerAvatarProps> = ({
  name,
  avatarColor,
  isReady = false,
  isOnline = true,
  isCreator = false,
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl"
  }

  const borderGlow = isReady
    ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
    : isOnline
    ? 'border-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.4)] animate-pulse'
    : 'border-neutral-700/50'

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Glow outer ring */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        className={`rounded-full overflow-hidden flex items-center justify-center font-black border-2 transition-all ${sizes[size]} ${avatarColor} ${borderGlow}`}
      >
        <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-display uppercase">
          {name.charAt(0)}
        </span>
      </motion.div>

      {/* Online indicator */}
      {isOnline && (
        <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-neutral-950 ${isReady ? 'bg-emerald-400' : 'bg-[#C9A227]'}`} />
      )}

      {/* Role tag overlays */}
      {isCreator && (
        <div className="absolute -top-3 bg-[#C9A227] border border-white/20 text-neutral-950 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md shadow-md">
          HOST
        </div>
      )}
    </div>
  )
}
export default GamerAvatar
