import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { X, ChevronRight, ArrowLeft, RotateCcw, Sparkles, Heart, ThumbsDown, Flame } from 'lucide-react'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateRoom: () => void
}

type StepId = 1 | 2 | 3 | 4

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onCreateRoom }) => {
  const [step, setStep] = useState<StepId>(1)
  
  // Intro text state for Phase 1 inside Step 1
  const [introTextState, setIntroTextState] = useState<'question' | 'slogan'>('question')

  // Step 1: Room Creation States
  const [samJoined, setSamJoined] = useState(false)
  const [mikeJoined, setMikeJoined] = useState(false)
  const [claraJoined, setClaraJoined] = useState(false)

  // Step 2: Food Preferences States
  const [userSelections, setUserSelections] = useState<string[]>([])
  const [samSelected, setSamSelected] = useState<string[]>([])
  const [mikeSelected, setMikeSelected] = useState<string[]>([])
  const [claraSelected, setClaraSelected] = useState<string[]>([])
  const [isFiltering, setIsFiltering] = useState(false)

  // Step 3: Voting States
  const [activeRestaurantIndex, setActiveRestaurantIndex] = useState(0)
  const [samVote, setSamVote] = useState<'like' | 'pass' | null>(null)
  const [mikeVote, setMikeVote] = useState<'like' | 'pass' | null>(null)
  const [claraVote, setClaraVote] = useState<'like' | 'pass' | null>(null)
  const [userVote, setUserVote] = useState<'like' | 'pass' | 'veto' | null>(null)
  
  // Tinder Card swipe variables
  const dragX = useMotionValue(0)
  const cardRotate = useTransform(dragX, [-200, 200], [-15, 15])
  const cardOpacity = useTransform(dragX, [-200, -150, 0, 150, 200], [0.6, 1, 1, 1, 0.6])

  // ESC close support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      resetDemo()
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Reset all steps to initial states
  const resetDemo = () => {
    setStep(1)
    setIntroTextState('question')
    setSamJoined(false)
    setMikeJoined(false)
    setClaraJoined(false)
    setUserSelections([])
    setSamSelected([])
    setMikeSelected([])
    setClaraSelected([])
    setIsFiltering(false)
    setActiveRestaurantIndex(0)
    setSamVote(null)
    setMikeVote(null)
    setClaraVote(null)
    setUserVote(null)
  }

  // STEP 1 Trigger
  useEffect(() => {
    if (isOpen && step === 1) {
      setIntroTextState('question')
      setSamJoined(false)
      setMikeJoined(false)
      setClaraJoined(false)

      const introTimer = setTimeout(() => {
        setIntroTextState('slogan')
      }, 2000)

      const t1 = setTimeout(() => setSamJoined(true), 2800)
      const t2 = setTimeout(() => setMikeJoined(true), 3600)
      const t3 = setTimeout(() => setClaraJoined(true), 4400)

      return () => {
        clearTimeout(introTimer)
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [isOpen, step])

  // STEP 2 Trigger
  useEffect(() => {
    if (isOpen && step === 2) {
      setSamSelected([])
      setMikeSelected([])
      setClaraSelected([])
      setIsFiltering(false)

      const t1 = setTimeout(() => setSamSelected(['Pizza']), 600)
      const t2 = setTimeout(() => setMikeSelected(['Ramen']), 1200)
      const t3 = setTimeout(() => setClaraSelected(['Mexican']), 1800)
      const t4 = setTimeout(() => {
        setIsFiltering(true)
      }, 2500)
      const t5 = setTimeout(() => {
        setStep(3)
      }, 4500)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        clearTimeout(t5)
      }
    }
  }, [isOpen, step])

  // STEP 3 Trigger
  useEffect(() => {
    if (isOpen && step === 3) {
      setSamVote(null)
      setMikeVote(null)
      setClaraVote(null)
      setUserVote(null)

      const t1 = setTimeout(() => setSamVote('like'), 700)
      const t2 = setTimeout(() => setMikeVote('pass'), 1400)
      const t3 = setTimeout(() => setClaraVote('like'), 2100)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [isOpen, step])

  const handleDragEnd = (_event: any, info: any) => {
    if (info.offset.x > 120) {
      // Swiped right -> Like
      triggerVoteAction('like')
    } else if (info.offset.x < -120) {
      // Swiped left -> Pass
      triggerVoteAction('pass')
    }
  }

  const triggerVoteAction = (type: 'like' | 'pass' | 'veto') => {
    setUserVote(type)
    if (activeRestaurantIndex < 2) {
      setTimeout(() => {
        setActiveRestaurantIndex(prev => prev + 1)
        setUserVote(null)
        setSamVote(null)
        setMikeVote(null)
        setClaraVote(null)
        
        // Trigger next card voters
        setTimeout(() => setSamVote(type === 'like' ? 'pass' : 'like'), 500)
        setTimeout(() => setClaraVote('like'), 1000)
      }, 800)
    } else {
      // Transition to Step 4
      setTimeout(() => setStep(4), 1000)
    }
  }

  const foods = [
    { label: 'Pizza', emoji: '🍕' },
    { label: 'Ramen', emoji: '🍜' },
    { label: 'Burgers', emoji: '🍔' },
    { label: 'Mexican', emoji: '🌮' },
    { label: 'Indian', emoji: '🍛' },
    { label: 'BBQ', emoji: '🍗' },
    { label: 'Healthy', emoji: '🥗' }
  ]

  const restaurants = [
    { name: 'Tokyo Ramen', rating: '4.9', category: 'Japanese • $$', emoji: '🍜' },
    { name: 'Burger House', rating: '4.7', category: 'American • $', emoji: '🍔' },
    { name: 'Taco Fiesta', rating: '4.6', category: 'Mexican • $', emoji: '🌮' }
  ]

  const toggleUserSelection = (label: string) => {
    setUserSelections(prev =>
      prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
    )
  }

  const triggerCreateRoom = () => {
    onClose()
    onCreateRoom()
  }

  if (!isOpen) return null

  // Force Light Mode colors strictly via inline styles to bypass `.dark` parent overrides
  const modalStyle = {
    backgroundColor: 'rgba(252, 250, 247, 0.82)', // soft warm cream base with glass transparency
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    borderColor: 'rgba(255, 255, 255, 0.65)',
    color: '#1E1E1E',
    boxShadow: '0 30px 70px -15px rgba(120, 70, 40, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.6) inset, 0 1px 3px rgba(0, 0, 0, 0.03)'
  }

  // Common interactive properties for right cards
  const interactiveCardProps = {
    whileHover: { 
      y: -4, 
      scale: 1.01,
      boxShadow: '0 12px 30px -5px rgba(255, 122, 48, 0.15), 0 8px 16px -6px rgba(0, 0, 0, 0.04)',
      borderColor: 'rgba(255, 122, 48, 0.35)',
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }
    },
    whileTap: { 
      scale: 0.98,
      y: -1,
      transition: { duration: 0.1, ease: 'easeOut' as const }
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-hidden">
        {/* Backdrop overlay with premium warm blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#14120F]/45 backdrop-blur-[12px] z-0"
        />

        {/* Ambient Warm Gradient Glows behind modal (Apple Keynote Lighting effect) */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,122,48,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="absolute w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(255,235,215,0.15)_0%,transparent_70%)] -top-20 pointer-events-none z-0" />

        {/* 2-Column Desktop Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 25 }}
          transition={{ type: 'spring', damping: 26, stiffness: 210 }}
          style={modalStyle}
          className="relative w-full max-w-lg md:max-w-[1080px] border rounded-[32px] flex flex-col justify-between overflow-hidden z-10 h-[85vh] md:h-auto min-h-[580px] text-[#1E1E1E]"
        >
          {/* Subtle Warm Overlay within the modal */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,248,242,0.4),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(255,122,48,0.03),transparent_40%)] pointer-events-none z-0" />

          {/* Floating food icons for ambient food identity - slow, subtle blur, low opacity */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {[
              { emoji: '🍕', top: '15%', left: '8%', delay: 0 },
              { emoji: '🍜', top: '75%', left: '12%', delay: 1.5 },
              { emoji: '🍔', top: '22%', right: '10%', delay: 0.8 },
              { emoji: '🌮', top: '80%', right: '15%', delay: 2.2 }
            ].map((item, index) => (
              <motion.span
                key={index}
                animate={{
                  y: [0, -12, 0],
                  x: [0, index % 2 === 0 ? 8 : -8, 0],
                  rotate: [0, 4, -4, 0]
                }}
                transition={{
                  duration: 8 + index * 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: item.delay
                }}
                className="absolute text-xl opacity-[0.05] filter blur-[1.5px] select-none"
                style={{
                  top: item.top,
                  left: item.left,
                  right: item.right
                }}
              >
                {item.emoji}
              </motion.span>
            ))}
          </div>

          {/* Header Panel */}
          <div className="px-8 py-5 border-b border-[#ECE6DD]/30 bg-white/10 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black tracking-widest text-[#FF7A30] bg-[#FF7A30]/10 px-3 py-1 rounded-full uppercase">
                Step {step} / 4
              </span>
              <div className="w-24 bg-neutral-200/50 h-1 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-[#FF7A30] to-[#FF8C42]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {step < 4 && (
                <button
                  onClick={onClose}
                  className="text-xs font-black uppercase tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                >
                  Skip
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-all border border-neutral-200/50 cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main 2-Column Body content */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 p-8 md:p-12 items-center overflow-y-auto relative z-10">
            
            {/* Left Column: Animated Headlines & Description (40% width) */}
            <div className="md:col-span-5 flex flex-col justify-center text-center md:text-left h-full min-h-[140px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="left-step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <span className="text-[#FF7A30] text-xs font-black tracking-widest uppercase block mb-1">
                      Welcome to Zesto
                    </span>
                    <div className="min-h-[90px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {introTextState === 'question' ? (
                          <motion.h2
                            key="text-q"
                            initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="text-3xl md:text-[38px] font-black font-display text-neutral-800 tracking-tight leading-tight"
                          >
                            Tired of food arguments?
                          </motion.h2>
                        ) : (
                          <motion.h2
                            key="text-s"
                            initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="text-3xl md:text-[38px] font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] tracking-tight leading-tight"
                          >
                            Decide faster.<br />Eat together.
                          </motion.h2>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-sm text-neutral-500 font-semibold leading-relaxed max-w-sm mx-auto md:mx-0">
                      Create a shared lobby room in seconds. Invite your friends using a single link.
                    </p>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="left-step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <span className="text-[#FF7A30] text-xs font-black tracking-widest uppercase block mb-1">
                      Taste Profiling
                    </span>
                    <h2 className="text-3xl md:text-[38px] font-black font-display text-neutral-800 tracking-tight leading-tight">
                      Everyone picks what they're willing to eat
                    </h2>
                    <p className="text-sm text-neutral-500 font-semibold leading-relaxed">
                      Select your cravings. Zesto automatically cross-references and matches intersecting choices.
                    </p>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="left-step3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <span className="text-[#FF7A30] text-xs font-black tracking-widest uppercase block mb-1">
                      Multiplayer Swiping
                    </span>
                    <h2 className="text-3xl md:text-[38px] font-black font-display text-neutral-800 tracking-tight leading-tight">
                      Swipe restaurants together
                    </h2>
                    <p className="text-sm text-neutral-500 font-semibold leading-relaxed">
                      Vote in real-time. No more endless group chat debates.
                    </p>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="left-step4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <span className="text-emerald-600 text-xs font-black tracking-widest uppercase block mb-1">
                      Consensus Reached
                    </span>
                    <h2 className="text-3xl md:text-[38px] font-black font-display text-neutral-800 tracking-tight leading-tight">
                      🎉 Match Found
                    </h2>
                    <p className="text-sm text-neutral-500 font-semibold leading-relaxed">
                      No arguments. Just food. Ready to try for real?
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Interactive Animations (60% width) */}
            <div className="md:col-span-7 flex items-center justify-center w-full min-h-[340px] bg-white/20 rounded-[28px] p-6 border border-white/40 shadow-inner">
              <AnimatePresence mode="wait">
                
                {/* STEP 1 VISUAL: Room Setup & Joins */}
                {step === 1 && (
                  <motion.div
                    key="right-step1"
                    initial={{ scale: 0.97, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.97, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="w-full max-w-sm flex flex-col gap-4"
                  >
                    {/* Room Header Card - Styled to match screenshot / upgrade it */}
                    <motion.div 
                      {...interactiveCardProps}
                      style={{ backgroundColor: '#ffffff', borderColor: '#ECE6DD' }} 
                      className="p-5 rounded-2xl border shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex justify-between items-center"
                    >
                      <div>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Session Code</span>
                        <span className="text-lg font-black text-neutral-800 tracking-wider">ZESTO884</span>
                      </div>
                      <span className="bg-[#FF7A30]/10 text-[#FF7A30] text-[10px] font-black px-3 py-1 rounded-full border border-[#FF7A30]/20 tracking-wider uppercase">
                        Active Lobby
                      </span>
                    </motion.div>

                    {/* Staggered joining list */}
                    <div className="space-y-2.5">
                      <motion.div 
                        {...interactiveCardProps}
                        style={{ backgroundColor: '#ffffff', borderColor: '#ECE6DD' }} 
                        className="flex items-center justify-between px-4 py-3 rounded-2xl border shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#FF7A30] text-white flex items-center justify-center text-[10px] font-black shadow-sm">Y</div>
                          <span className="text-xs font-bold text-neutral-800">You (Host)</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">Ready</span>
                      </motion.div>

                      {samJoined && (
                        <motion.div
                          initial={{ x: -15, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ type: 'spring', damping: 20 }}
                          {...interactiveCardProps}
                          style={{ backgroundColor: '#ffffff', borderColor: '#ECE6DD' }}
                          className="flex items-center justify-between px-4 py-3 rounded-2xl border shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black shadow-sm">S</div>
                            <span className="text-xs font-bold text-neutral-800">Sam joined</span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">Joined ✅</span>
                        </motion.div>
                      )}

                      {mikeJoined && (
                        <motion.div
                          initial={{ x: -15, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ type: 'spring', damping: 20 }}
                          {...interactiveCardProps}
                          style={{ backgroundColor: '#ffffff', borderColor: '#ECE6DD' }}
                          className="flex items-center justify-between px-4 py-3 rounded-2xl border shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black shadow-sm">M</div>
                            <span className="text-xs font-bold text-neutral-800">Mike joined</span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">Joined ✅</span>
                        </motion.div>
                      )}

                      {claraJoined && (
                        <motion.div
                          initial={{ x: -15, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ type: 'spring', damping: 20 }}
                          {...interactiveCardProps}
                          style={{ backgroundColor: '#ffffff', borderColor: '#ECE6DD' }}
                          className="flex items-center justify-between px-4 py-3 rounded-2xl border shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shadow-sm">C</div>
                            <span className="text-xs font-bold text-neutral-800">Clara joined</span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">Joined ✅</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 VISUAL: Interactive Food cards & Friends selections */}
                {step === 2 && (
                  <motion.div
                    key="right-step2"
                    initial={{ scale: 0.97, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.97, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="w-full max-w-sm flex flex-col gap-5"
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {foods.slice(0, 6).map((food) => {
                        const isSelected = userSelections.includes(food.label)
                        
                        // Check if friend selected this food type
                        const whoSelected: string[] = []
                        if (food.label === 'Pizza' && samSelected.length > 0) whoSelected.push('S')
                        if (food.label === 'Ramen' && mikeSelected.length > 0) whoSelected.push('M')
                        if (food.label === 'Mexican' && claraSelected.length > 0) whoSelected.push('C')
                        if (isSelected) whoSelected.push('Y')

                        return (
                          <motion.button
                            key={food.label}
                            {...interactiveCardProps}
                            onClick={() => toggleUserSelection(food.label)}
                            style={{ 
                              backgroundColor: isSelected ? '#FFF5F0' : '#ffffff',
                              borderColor: isSelected ? '#FF7A30' : '#ECE6DD',
                              color: isSelected ? '#FF7A30' : '#374151'
                            }}
                            className="relative flex flex-col items-center justify-center p-4 rounded-2xl border text-xs font-bold shadow-sm cursor-pointer aspect-square"
                          >
                            <span className="text-2xl mb-1.5 select-none">{food.emoji}</span>
                            <span className="tracking-wide">{food.label}</span>

                            {/* Floating friend indicator dots */}
                            <div className="absolute -bottom-1 flex -space-x-1 justify-center">
                              <AnimatePresence>
                                {whoSelected.map((initial) => (
                                  <motion.div
                                    key={initial}
                                    initial={{ scale: 0, y: 4 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0, y: 4 }}
                                    className={`w-4.5 h-4.5 rounded-full border-2 border-white text-[7px] text-white font-black flex items-center justify-center ${
                                      initial === 'Y' ? 'bg-[#FF7A30]' : initial === 'S' ? 'bg-rose-500' : initial === 'M' ? 'bg-indigo-500' : 'bg-emerald-500'
                                    }`}
                                  >
                                    {initial}
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>

                    <div className="min-h-[44px] flex items-center justify-center">
                      {isFiltering && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ backgroundColor: '#FFF5F0', color: '#FF7A30', borderColor: '#FFE4E6' }} 
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-black shadow-sm"
                        >
                          <div className="w-3.5 h-3.5 border-2 border-[#FF7A30] border-t-transparent rounded-full animate-spin" />
                          Shortlisting common match...
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 VISUAL: Tinder Voting Deck */}
                {step === 3 && (
                  <motion.div
                    key="right-step3"
                    initial={{ scale: 0.97, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.97, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="w-full max-w-sm flex flex-col items-center gap-5"
                  >
                    <div className="relative w-64 h-[240px]">
                      <motion.div
                        style={{ x: dragX, rotate: cardRotate, opacity: cardOpacity, backgroundColor: '#ffffff' }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        {...interactiveCardProps}
                        className="absolute inset-0 border border-neutral-200/80 rounded-3xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex flex-col justify-between text-left cursor-grab active:cursor-grabbing"
                      >
                        <div className="h-28 bg-gradient-to-br from-orange-400 to-[#FF7A2F] p-4 flex flex-col justify-between text-white relative">
                          <span className="bg-black/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black self-start">
                            ⭐ {restaurants[activeRestaurantIndex]?.rating}
                          </span>
                          <span className="text-4xl absolute bottom-3 right-4 select-none">
                            {restaurants[activeRestaurantIndex]?.emoji}
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-base font-black text-neutral-800 font-display">
                              {restaurants[activeRestaurantIndex]?.name}
                            </h4>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                              {restaurants[activeRestaurantIndex]?.category}
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-[9px] font-bold text-neutral-400 border-t border-neutral-100 pt-2.5">
                            <span>Swipe or use buttons below</span>
                            <span className="text-[#FF7A30] font-black">
                              {userVote ? '4/4' : '3/4'} voted
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-5 items-center">
                      <motion.button
                        whileHover={{ scale: 1.1, boxShadow: '0 8px 20px rgba(239, 68, 68, 0.15)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => triggerVoteAction('pass')}
                        style={{ backgroundColor: '#ffffff' }}
                        className="w-11 h-11 rounded-full border border-neutral-200 flex items-center justify-center text-red-500 shadow-sm transition-all cursor-pointer"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, boxShadow: '0 8px 20px rgba(255, 122, 48, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => triggerVoteAction('veto')}
                        style={{ backgroundColor: '#FFF5F0', borderColor: '#FF7A30' }}
                        className="w-11 h-11 rounded-full border flex items-center justify-center text-[#FF7A30] shadow-sm transition-all cursor-pointer"
                      >
                        <Flame className="w-4 h-4 fill-current animate-pulse" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, boxShadow: '0 8px 20px rgba(244, 63, 94, 0.15)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => triggerVoteAction('like')}
                        style={{ backgroundColor: '#ffffff' }}
                        className="w-11 h-11 rounded-full border border-neutral-200 flex items-center justify-center text-rose-500 shadow-sm transition-all cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </motion.button>
                    </div>

                    {/* Live responses */}
                    <div className="flex gap-2">
                      {[
                        { name: 'Sam', vote: samVote, icon: '❤️', color: 'bg-rose-50 border-rose-100 text-rose-600' },
                        { name: 'Mike', vote: mikeVote, icon: '❌', color: 'bg-red-50 border-red-100 text-red-500' },
                        { name: 'Clara', vote: claraVote, icon: '❤️', color: 'bg-rose-50 border-rose-100 text-rose-600' }
                      ].map((item, idx) => (
                        <motion.span 
                          key={idx}
                          animate={item.vote ? { scale: [1, 1.1, 1] } : {}}
                          className={`px-3 py-1 rounded-full text-[9px] font-black border transition-all ${
                            item.vote ? item.color : 'bg-neutral-50 text-neutral-400 border-neutral-100'
                          }`}
                        >
                          {item.name} {item.vote ? item.icon : '..'}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 VISUAL: Perfect Match */}
                {step === 4 && (
                  <motion.div
                    key="right-step4"
                    initial={{ scale: 0.97, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.97, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="w-full max-w-sm flex flex-col items-center gap-5 text-center"
                  >
                    <motion.div 
                      {...interactiveCardProps}
                      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #FFFDFB 100%)', borderColor: '#FF7A30' }}
                      className="w-full border-2 rounded-3xl p-5 flex gap-4 items-center shadow-[0_10px_30px_rgba(255,122,48,0.1)] text-left relative overflow-hidden"
                    >
                      <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-[#FF7A2F] rounded-2xl flex items-center justify-center text-3xl text-white shadow-md shrink-0 select-none">
                        🍜
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-[#FF7A30] uppercase tracking-widest block mb-0.5">
                          100% Match
                        </span>
                        <h4 className="text-base font-black text-neutral-800 font-display">Tokyo Ramen Bar</h4>
                        <p className="text-xs text-neutral-400 font-semibold">Matched in 1.4 minutes</p>
                      </div>
                    </motion.div>

                    <div className="w-full flex flex-col gap-2.5">
                      <motion.button
                        whileHover={{ scale: 1.01, boxShadow: '0 8px 24px rgba(255, 122, 48, 0.25)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={triggerCreateRoom}
                        className="w-full bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white text-xs font-black uppercase tracking-wider py-4 px-6 rounded-2xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Create Your Own Room
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderColor: 'rgba(255, 122, 48, 0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={resetDemo}
                        style={{ backgroundColor: '#ffffff', color: '#4B5563', borderColor: '#ECE6DD' }}
                        className="w-full border text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Replay Demo
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

          {/* Bottom Controls / Back / Next buttons */}
          <div 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', borderTop: '1px solid #ECE6DD/20' }}
            className="px-8 py-5 flex items-center justify-between sticky bottom-0 z-20 backdrop-blur-md"
          >
            <button
              onClick={() => {
                if (step > 1) {
                  setStep((prev) => (prev - 1) as StepId)
                }
              }}
              style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
              className="text-xs font-black text-neutral-500 hover:text-neutral-800 transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-1 border-none bg-transparent"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            {step < 4 ? (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#1E1E1E', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep((prev) => (prev + 1) as StepId)}
                className="bg-[#1E1E1E] text-white hover:bg-neutral-800 text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
              >
                Continue
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#1E1E1E', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="bg-[#1E1E1E] text-white hover:bg-neutral-800 text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Finish
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
