import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  className?: string
  children: React.ReactNode
  hoverable?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ 
  className = '', 
  children, 
  hoverable = true,
  onClick 
}) => {
  const baseStyle = "glass-card rounded-3xl p-6 text-[#1E1E1E] transition-colors duration-300 relative overflow-hidden"
  const hoverStyle = hoverable ? "glass-card-hover cursor-pointer" : ""

  if (hoverable || onClick) {
    return (
      <motion.div
        whileHover={{ y: hoverable ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={onClick}
        className={`${baseStyle} ${hoverStyle} ${className}`}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={`${baseStyle} ${className}`}>
      {children}
    </div>
  )
}
