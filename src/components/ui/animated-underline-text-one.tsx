import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedUnderlineTextProps {
  text: string
  className?: string
  colorStart?: string
  colorEnd?: string
  as?: 'h1' | 'h2' | 'h3'
}

export const AnimatedUnderlineText: React.FC<AnimatedUnderlineTextProps> = ({
  text,
  className = '',
  colorStart = '#3B82F6',
  colorEnd = '#8B5CF6',
  as = 'h2'
}) => {
  const Component = as

  return (
    <div className={`relative inline-block ${className}`}>
      <Component className="relative z-15 font-black font-display text-white pb-2 leading-tight">
        {text}
      </Component>
      
      {/* Animated glowing gradient underline */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '100%', opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 h-1.5 rounded-full z-0"
        style={{
          background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
          boxShadow: `0 0 10px ${colorStart}80`
        }}
      />
    </div>
  )
}

export default AnimatedUnderlineText
