import React from 'react'
import { motion } from 'framer-motion'

export const ConfettiRain: React.FC = () => {
  const colors = ['#3B82F6', '#FBBF24', '#34D399', '#60A5FA', '#F472B6']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
            y: -20,
            scale: Math.random() * 0.5 + 0.5,
            rotate: Math.random() * 360,
          }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
            rotate: Math.random() * 720 + 360,
          }}
          transition={{
            duration: Math.random() * 2 + 1.2,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}
export default ConfettiRain
