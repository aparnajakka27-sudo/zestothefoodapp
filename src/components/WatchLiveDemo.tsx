import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { X, RotateCcw, Sparkles, Flame, Check, Heart } from 'lucide-react'

interface WatchLiveDemoProps {
  isOpen: boolean
  onClose: () => void
  onCreateRoom: () => void
}

type Phase = 'intro' | 'lobby' | 'preferences' | 'voting' | 'match'

export const WatchLiveDemo: React.FC<WatchLiveDemoProps> = ({ isOpen, onClose, onCreateRoom }) => {
  const [phase, setPhase] = useState<Phase>('intro')
  const [introStep, setIntroStep] = useState(0)
  
  // Phase 2 states
  const [joinedFriends, setJoinedFriends] = useState<{ name: string; joined: boolean; color: string }[]>([
    { name: 'Sam', joined: false, color: 'bg-rose-500' },
    { name: 'Mike', joined: false, color: 'bg-indigo-500' },
    { name: 'Clara', joined: false, color: 'bg-emerald-500' },
  ])

  // Phase 3 states
  const [prefSelections, setPrefSelections] = useState<{ name: string; items: string[]; emoji: string; color: string }[]>([])
  const [isFiltering, setIsFiltering] = useState(false)

  // Phase 4 states
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [liveVotes, setLiveVotes] = useState<{ name: string; type: 'like' | 'reject' | 'superlike' }[]>([])
  const [matchMeter, setMatchMeter] = useState(30)
  
  // Framer Motion drag values for tinder card
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5])

  // ESC key handler for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      startIntroSequence()
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Reset and restart intro sequence
  const startIntroSequence = () => {
    setPhase('intro')
    setIntroStep(0)
    setIsFiltering(false)
    setActiveCardIndex(0)
    setLiveVotes([])
    setMatchMeter(30)
    setJoinedFriends([
      { name: 'Sam', joined: false, color: 'bg-rose-500' },
      { name: 'Mike', joined: false, color: 'bg-indigo-500' },
      { name: 'Clara', joined: false, color: 'bg-emerald-500' },
    ])
    setPrefSelections([])
  }

  // Phase 1 Intro sequencer
  useEffect(() => {
    if (phase !== 'intro' || !isOpen) return

    const t1 = setTimeout(() => setIntroStep(1), 1800) // Meet Zesto
    const t2 = setTimeout(() => setIntroStep(2), 3400) // Decide where to eat together
    const t3 = setTimeout(() => {
      setPhase('lobby')
    }, 5200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [phase, isOpen])

  // Phase 2 Friends lobby sequencers
  useEffect(() => {
    if (phase !== 'lobby') return

    const t1 = setTimeout(() => {
      setJoinedFriends(prev => prev.map((f, i) => i === 0 ? { ...f, joined: true } : f))
    }, 800)
    const t2 = setTimeout(() => {
      setJoinedFriends(prev => prev.map((f, i) => i === 1 ? { ...f, joined: true } : f))
    }, 1600)
    const t3 = setTimeout(() => {
      setJoinedFriends(prev => prev.map((f, i) => i === 2 ? { ...f, joined: true } : f))
    }, 2400)
    const t4 = setTimeout(() => {
      setPhase('preferences')
    }, 4000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [phase])

  // Phase 3 Preferences selection simulation
  useEffect(() => {
    if (phase !== 'preferences') return

    const t1 = setTimeout(() => {
      setPrefSelections(prev => [...prev, { name: 'Sam', items: ['🍕 Pizza'], emoji: '🍕', color: 'bg-rose-500' }])
    }, 600)
    const t2 = setTimeout(() => {
      setPrefSelections(prev => [...prev, { name: 'Mike', items: ['🍜 Ramen'], emoji: '🍜', color: 'bg-indigo-500' }])
    }, 1300)
    const t3 = setTimeout(() => {
      setPrefSelections(prev => [...prev, { name: 'Clara', items: ['🌮 Mexican'], emoji: '🌮', color: 'bg-emerald-500' }])
    }, 2000)
    const t4 = setTimeout(() => {
      setPrefSelections(prev => [...prev, { name: 'You', items: ['🍕 Pizza', '🍜 Ramen'], emoji: '🍜', color: 'bg-orange-500' }])
    }, 2700)
    const t5 = setTimeout(() => {
      setIsFiltering(true)
    }, 3600)
    const t6 = setTimeout(() => {
      setPhase('voting')
    }, 5600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
    }
  }, [phase])

  // Phase 4 Swipe / Vote Simulation
  useEffect(() => {
    if (phase !== 'voting') return

    // Card index 0: Tokyo Ramen Bar (the winner)
    if (activeCardIndex === 0) {
      const t1 = setTimeout(() => {
        setLiveVotes(prev => [...prev, { name: 'Sam', type: 'like' }])
        setMatchMeter(55)
      }, 700)
      const t2 = setTimeout(() => {
        setLiveVotes(prev => [...prev, { name: 'Mike', type: 'like' }])
        setMatchMeter(75)
      }, 1400)
      const t3 = setTimeout(() => {
        setLiveVotes(prev => [...prev, { name: 'Clara', type: 'superlike' }])
        setMatchMeter(95)
      }, 2100)
      const t4 = setTimeout(() => {
        setLiveVotes(prev => [...prev, { name: 'You', type: 'like' }])
        setMatchMeter(100)
      }, 2800)
      const t5 = setTimeout(() => {
        // Automatically swipe to match phase after final vote
        setPhase('match')
      }, 3800)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        clearTimeout(t5)
      }
    }
  }, [phase, activeCardIndex])

  const handleDragEnd = (_event: any, info: any) => {
    if (info.offset.x > 120) {
      // Swipe right (Like)
      setLiveVotes(prev => [...prev, { name: 'You', type: 'like' }])
      setMatchMeter(100)
      setTimeout(() => setPhase('match'), 800)
    } else if (info.offset.x < -120) {
      // Swipe left (Reject)
      setLiveVotes(prev => [...prev, { name: 'You', type: 'reject' }])
      // Re-trigger/reset this card for demo purposes or proceed
      setTimeout(() => setPhase('match'), 800)
    }
  }

  const triggerCreateRoom = () => {
    onClose()
    onCreateRoom()
  }

  if (!isOpen) return null

  // Interactive cards for preferences step
  const preferenceCards = [
    { id: 'pizza', label: 'Pizza', emoji: '🍕', gradient: 'from-[#FF9A9E] to-[#FECFEF]' },
    { id: 'ramen', label: 'Ramen', emoji: '🍜', gradient: 'from-[#F6D365] to-[#FDA085]' },
    { id: 'burgers', label: 'Burgers', emoji: '🍔', gradient: 'from-[#84FAB0] to-[#8FD3F4]' },
    { id: 'mexican', label: 'Mexican', emoji: '🌮', gradient: 'from-[#A1C4FD] to-[#C2E9FB]' },
    { id: 'bbq', label: 'BBQ', emoji: '🍗', gradient: 'from-[#CFD9DF] to-[#E2EBE0]' }
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
        {/* Immersive backdrop darkening with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0A0705]/80 backdrop-blur-xl z-0"
        />

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center Container - Premium Glassmorphic Shell */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: 'spring', damping: 26, stiffness: 190 }}
          className="relative w-full max-w-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-[38px] shadow-[0_32px_64px_rgba(0,0,0,0.6)] overflow-hidden z-10 flex flex-col justify-center min-h-[460px] md:min-h-[500px]"
        >
          {/* Subtle Ambient Glow behind card */}
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-[#FF7A2F]/15 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-orange-600/10 blur-[100px] pointer-events-none" />

          <div className="p-6 md:p-10 flex flex-col justify-center items-center h-full text-center relative z-10">
            
            {/* PHASE 1: CINEMATIC ENTRY */}
            {phase === 'intro' && (
              <div className="relative w-full min-h-[200px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {introStep === 0 && (
                    <motion.h2
                      key="intro0"
                      initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="text-3xl md:text-5xl font-black font-display text-white tracking-tight leading-tight max-w-lg"
                    >
                      Dinner plans shouldn't be this hard.
                    </motion.h2>
                  )}

                  {introStep === 1 && (
                    <motion.h2
                      key="intro1"
                      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="text-4xl md:text-7xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] tracking-tight leading-none"
                    >
                      Meet Zesto.
                    </motion.h2>
                  )}

                  {introStep === 2 && (
                    <motion.h2
                      key="intro2"
                      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="text-3xl md:text-5xl font-black font-display text-white tracking-tight leading-tight max-w-md"
                    >
                      Decide where to eat together.
                    </motion.h2>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* PHASE 2: FRIEND ROOM MAGIC */}
            {phase === 'lobby' && (
              <div className="w-full flex flex-col items-center gap-8 py-4">
                <div className="space-y-2">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-orange-300 uppercase tracking-widest"
                  >
                    Phase 1: Lobby Setup
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-4xl font-black font-display text-white"
                  >
                    Create a room dynamically
                  </motion.h3>
                </div>

                {/* Simulated dynamic entry of room card */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/15 p-6 rounded-3xl text-left relative overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase tracking-widest font-black block mb-0.5">Session Code</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-black text-white tracking-wider font-display"
                      >
                        ZESTO884
                      </motion.span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FF7A2F] text-white flex items-center justify-center font-bold text-xs">Y</div>
                        <span className="text-sm font-bold text-white">You (Host)</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Ready</span>
                    </div>

                    {/* Friends sequential entries */}
                    <AnimatePresence>
                      {joinedFriends.map((f) => f.joined && (
                        <motion.div
                          key={f.name}
                          initial={{ opacity: 0, x: -30, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                          className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${f.color} text-white flex items-center justify-center font-bold text-xs`}>
                              {f.name[0]}
                            </div>
                            <span className="text-sm font-bold text-white">{f.name} joined</span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                            Joined <Check className="w-3 h-3" />
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Sub-label state indicator */}
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-xs text-white/55 font-bold"
                >
                  {joinedFriends.filter(f => f.joined).length === 3 ? '🎉 3 friends joined. Ready!' : 'Waiting for friends...'}
                </motion.span>
              </div>
            )}

            {/* PHASE 3: LIVE FOOD PREFERENCE SELECTION */}
            {phase === 'preferences' && (
              <div className="w-full flex flex-col items-center gap-6 py-2">
                <div className="space-y-2">
                  <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-orange-300 uppercase tracking-widest">
                    Phase 2: Preferences
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black font-display text-white">
                    Everyone picks their cravings
                  </h3>
                </div>

                {/* 3D Floating Food Cards */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3.5 my-4 w-full max-w-xl">
                  {preferenceCards.map((card) => {
                    // Find selections matching this card
                    const selectors = prefSelections.filter(sel => sel.items.some(it => it.includes(card.label)))
                    
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center gap-2.5 aspect-square justify-center shadow-lg group hover:bg-white/10 transition-colors"
                      >
                        <span className="text-3xl select-none animate-pulse">{card.emoji}</span>
                        <span className="text-xs font-bold text-white/95">{card.label}</span>

                        {/* Avatars overlay representing selections */}
                        <div className="absolute -bottom-2 flex -space-x-1.5 justify-center">
                          <AnimatePresence>
                            {selectors.map((sel) => (
                              <motion.div
                                key={sel.name}
                                initial={{ scale: 0, y: 5 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0 }}
                                title={`${sel.name} selected ${card.label}`}
                                className={`w-5 h-5 rounded-full border border-black/45 text-[8px] font-black text-white flex items-center justify-center ${sel.color}`}
                              >
                                {sel.name[0]}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Auto filter transition status */}
                <div className="min-h-[48px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isFiltering ? (
                      <motion.div
                        key="filtering"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 bg-[#FF7A2F]/20 border border-[#FF7A2F]/30 px-6 py-2 rounded-full text-sm font-black text-orange-300"
                      >
                        <span className="w-3.5 h-3.5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        Finding options everyone likes...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="joining"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col gap-1.5"
                      >
                        {prefSelections.map((sel) => (
                          <div key={sel.name} className="text-xs text-white/70 font-semibold">
                            <span className="font-black text-[#FF7A2F]">{sel.name}</span> selected{' '}
                            <span className="text-white font-bold">{sel.items.join(', ')}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* PHASE 4: TINDER-LIKE VOTING */}
            {phase === 'voting' && (
              <div className="w-full flex flex-col items-center gap-6 py-2 relative">
                <div className="space-y-2">
                  <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-orange-300 uppercase tracking-widest">
                    Phase 3: Live Swiping
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black font-display text-white">
                    Swipe restaurants in real-time
                  </h3>
                </div>

                {/* Live Match Meter */}
                <div className="w-full max-w-sm bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Group Harmony</span>
                    <span className="text-sm font-black text-white">Consensus Match Meter</span>
                  </div>
                  <div className="flex items-center gap-3 w-1/2 justify-end">
                    <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        animate={{ width: `${matchMeter}%` }}
                        transition={{ type: 'spring', stiffness: 80 }}
                        className="h-full bg-gradient-to-r from-orange-400 to-[#FF7A2F]"
                      />
                    </div>
                    <span className="text-xs font-black text-orange-300">{matchMeter}%</span>
                  </div>
                </div>

                {/* Tinder Floating Card */}
                <div className="relative w-64 h-[250px] my-2 cursor-grab active:cursor-grabbing">
                  <motion.div
                    style={{ x, rotate, opacity }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 bg-[#151210] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between text-left"
                  >
                    <div className="h-28 bg-gradient-to-br from-[#FF7A2F] to-[#E85D5D] p-5 flex flex-col justify-between text-white relative">
                      <span className="bg-black/30 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black self-start">
                        ⭐ 4.9
                      </span>
                      <span className="text-3xl absolute bottom-3 right-4 select-none">🍜</span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-black text-white font-display">Tokyo Ramen Bar</h4>
                        <p className="text-[11px] text-white/55 font-bold uppercase tracking-wider">
                          Premium Ramen • $$
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-[11px] font-bold text-white/35 border-t border-white/5 pt-2.5">
                        <span>Swipe Right to Like</span>
                        <span>4 Online</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Real-time Multiplayer Reactions */}
                <div className="h-10 flex gap-2 justify-center items-center">
                  <AnimatePresence>
                    {liveVotes.map((vote, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow"
                      >
                        <span className="text-white/50">{vote.name}</span>
                        {vote.type === 'like' && <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />}
                        {vote.type === 'reject' && <span className="text-red-400">❌</span>}
                        {vote.type === 'superlike' && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                        <span className="text-[10px] uppercase font-black tracking-wider text-white/70">
                          {vote.type === 'like' ? 'Liked' : vote.type === 'reject' ? 'Skipped' : 'Super Liked!'}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* PHASE 5: SATISFYING MATCH REVEAL */}
            {phase === 'match' && (
              <div className="w-full flex flex-col items-center gap-6 py-4 relative">
                {/* Embedded confetti particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: '50%', y: '60%', scale: Math.random() * 0.6 + 0.4 }}
                      animate={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 80}%`,
                        opacity: [1, 1, 0],
                        rotate: Math.random() * 360,
                      }}
                      transition={{ duration: 2.2, ease: 'easeOut', repeat: Infinity }}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: i % 3 === 0 ? '#FF7A2F' : i % 3 === 1 ? '#FCD34D' : '#10B981',
                      }}
                    />
                  ))}
                </div>

                <div className="space-y-1">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                    className="w-16 h-16 bg-[#FF7A2F]/15 border border-[#FF7A2F]/30 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner mb-3"
                  >
                    🎉
                  </motion.div>
                  <h3 className="text-3xl md:text-5xl font-black font-display text-white tracking-tight">
                    Perfect Match Found!
                  </h3>
                  <p className="text-sm text-white/60 font-semibold">
                    Everyone agreed in 1.4 minutes.
                  </p>
                </div>

                {/* Zoomed Final Restaurant Card */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="w-full max-w-sm bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-[#FF7A2F]/30 p-6 rounded-3xl flex gap-5 items-center relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-[#FF7A2F]/5 pointer-events-none" />
                  
                  {/* Glowing Spotlight effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A2F]/20 rounded-full blur-3xl pointer-events-none" />

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A2F] to-orange-600 text-white flex items-center justify-center text-3xl shadow-lg shrink-0 select-none">
                    🍜
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-0.5">
                      4/4 matched
                    </span>
                    <h4 className="text-lg font-black text-white font-display truncate">Tokyo Ramen Bar</h4>
                    <p className="text-xs text-white/50 font-semibold truncate">Consensus food match</p>
                  </div>
                </motion.div>

                {/* Interactive CTAs */}
                <div className="w-full max-w-md flex flex-col sm:flex-row gap-3.5 mt-4">
                  <button
                    onClick={triggerCreateRoom}
                    className="flex-1 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white text-xs font-black uppercase tracking-widest py-4 px-6 rounded-2xl shadow-[0_10px_20px_rgba(255,122,47,0.3)] hover:shadow-[0_15px_30px_rgba(255,122,47,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Start Your Own Room
                  </button>
                  <button
                    onClick={startIntroSequence}
                    className="border border-white/15 hover:bg-white/5 text-white/80 hover:text-white text-xs font-black uppercase tracking-widest py-4 px-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Replay Demo
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Indicator navigation */}
          {phase !== 'intro' && (
            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-white/40">
              <div className="flex gap-1">
                {(['lobby', 'preferences', 'voting', 'match'] as Phase[]).map((p) => (
                  <div
                    key={p}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      phase === p ? 'w-6 bg-[#FF7A2F]' : 'w-1.5 bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={onClose}
                className="hover:text-white transition-colors cursor-pointer text-[10px] uppercase font-black tracking-widest"
              >
                Exit Demo
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
