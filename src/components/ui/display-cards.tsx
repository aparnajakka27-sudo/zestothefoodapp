import React from 'react'
import { motion } from 'framer-motion'

interface DisplayCardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  glowColor?: string // e.g. '#C9A227'
  isSelected?: boolean
}

export const DisplayCard: React.FC<DisplayCardProps> = ({
  children,
  onClick,
  className = '',
  glowColor = '#C9A227',
  isSelected = false
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ 
        y: -6, 
        scale: 1.02, 
        boxShadow: isSelected 
          ? `0 20px 40px -15px ${glowColor}50, 0 0 0 1px ${glowColor}` 
          : `0 15px 35px -15px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)`
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      style={{
        borderColor: isSelected ? glowColor : 'rgba(255,255,255,0.05)',
        boxShadow: isSelected 
          ? `0 10px 30px -10px ${glowColor}30, inset 0 1px 1px rgba(255,255,255,0.1)` 
          : `0 10px 30px -10px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.03)`
      }}
      className={`relative rounded-3xl border bg-gradient-to-b from-[#161622]/95 to-[#0D0D15]/98 backdrop-blur-2xl p-5 cursor-pointer overflow-hidden transition-all duration-300 ${
        isSelected ? 'bg-gradient-to-b from-[#1E1E2D]/95 to-[#0E0E18]/98' : 'hover:from-[#1E1E2D]/80 hover:to-[#0F0F1A]/90'
      } ${className}`}
    >
      {/* Background glow radial layer */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 60%)`
        }}
      />
      {/* Premium accent light sweep on hover */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
      {children}
    </motion.div>
  )
}

interface StackedCardsProps {
  children: React.ReactNode[]
  className?: string
}

export const StackedCards: React.FC<StackedCardsProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`relative flex items-center justify-center min-h-[360px] w-full ${className}`}>
      {children.map((child, index) => {
        // Shift each card slightly for a stacked deck aesthetic
        const rotation = (index - (children.length - 1) / 2) * 3
        const yOffset = index * 8
        const scaleOffset = 0.96 + (index * 0.02)
        return (
          <motion.div
            key={index}
            style={{
              zIndex: index,
              transformOrigin: 'bottom center'
            }}
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            animate={{ 
              opacity: 1, 
              y: yOffset, 
              rotate: rotation,
              scale: scaleOffset
            }}
            whileHover={{ 
              scale: scaleOffset + 0.03, 
              y: yOffset - 15, 
              zIndex: 100, 
              rotate: 0,
              transition: { type: 'spring', stiffness: 300, damping: 15 } 
            }}
            className="absolute w-full max-w-[340px]"
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}

export default DisplayCard
