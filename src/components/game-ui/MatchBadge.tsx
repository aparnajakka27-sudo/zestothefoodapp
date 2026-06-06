import React from 'react'
import { motion } from 'framer-motion'

interface MatchBadgeProps {
  rank: 'King Pick' | 'Strong Match' | 'Mixed Pick' | 'Weak Match'
  name: string
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ rank, name }) => {
  const configs = {
    'King Pick': {
      emoji: '★',
      tag: '100% GROUP AGREEMENT',
      title: 'King Pick',
      description: `"${name} is unanimously liked by everyone in the room!"`,
      colors: 'from-amber-500/10 to-transparent border-amber-500/30 text-amber-400'
    },
    'Strong Match': {
      emoji: '✦',
      tag: 'MAJORITY SUPPORTED',
      title: 'Strong Match',
      description: `"${name} has strong backing from your group!"`,
      colors: 'from-emerald-500/10 to-transparent border-emerald-500/30 text-emerald-400'
    },
    'Mixed Pick': {
      emoji: '◆',
      tag: 'SPLIT OPINIONS',
      title: 'Mixed Pick',
      description: `"${name} generated split votes but is a viable choice!"`,
      colors: 'from-indigo-500/10 to-transparent border-indigo-500/30 text-indigo-400'
    },
    'Weak Match': {
      emoji: '■',
      tag: 'LOW COMPATIBILITY',
      title: 'Weak Match',
      description: `"${name} has very little support in this room."`,
      colors: 'from-red-500/10 to-transparent border-red-500/30 text-red-500'
    }
  }

  const active = configs[rank] || configs['Weak Match']

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: [1, 1.05, 1], opacity: 1 }}
      className={`flex flex-col items-center justify-center p-6 bg-gradient-to-b border rounded-[32px] text-center shadow-2xl relative overflow-hidden ${active.colors}`}
    >
      {/* Background glow circle */}
      <div className="absolute -top-12 w-24 h-24 bg-current opacity-10 rounded-full blur-xl pointer-events-none" />

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="text-5xl mb-3 select-none"
      >
        {active.emoji}
      </motion.div>

      <span className="text-[10px] font-black tracking-widest uppercase mb-1 opacity-70">
        {active.tag}
      </span>
      <h3 className="text-xl font-black font-display tracking-tight text-white mb-1 leading-none">
        {active.title}
      </h3>
      <p className="text-xs text-white/55 font-medium max-w-[200px] mt-1 leading-relaxed">
        {active.description}
      </p>
    </motion.div>
  )
}

export default MatchBadge
