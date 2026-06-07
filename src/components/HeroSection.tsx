import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Sparkles, Plus, Users, Play } from 'lucide-react'
import { Button } from './ui/Button'
import { Avatar } from './ui/Avatar'
import { useRoomStore } from '../lib/roomStore'

// Canvas particle drawer for GPU-friendly animated background motion (no heavy videos)
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const particles: Array<{
      x: number
      y: number
      r: number
      vx: number
      vy: number
      alpha: number
    }> = []

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.4 + 0.1,
      })
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 90, 54, ${p.alpha})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-10 select-none will-change-transform" 
    />
  )
}

export const HeroSection: React.FC = () => {
  const [loopState, setLoopState] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { openSelector, setIsDemoOpen } = useRoomStore()

  // GPU-Accelerated Mouse Tilt Coordinates (stiffness/damping tuned for premium Apple-level lag-free transitions)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 25 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 25 })

  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-80, 80]), { stiffness: 150, damping: 25 })
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-80, 80]), { stiffness: 150, damping: 25 })

  // High-performance 3-second loop animation
  // State 0 (0s-1s): Swiping active, votes syncing.
  // State 1 (1s-2s): Winner card selected, progress bar syncs, confetti blast.
  // State 2 (2s-3s): MATCH FOUND, glowing, haptic shake, resets.
  useEffect(() => {
    const timer = setInterval(() => {
      setLoopState((prev) => (prev + 1) % 3)
    }, 3200)
    return () => clearInterval(timer)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  // Floating Avatars base offsets surrounding the phone mockup
  const friends = [
    { id: 'sam', name: 'Sam', fallback: 'S', color: 'bg-rose-500', x: -180, y: -160, baseAngle: 0 },
    { id: 'maya', name: 'Maya', fallback: 'M', color: 'bg-[#FF5A36]', x: 180, y: -120, baseAngle: Math.PI / 2 },
    { id: 'leo', name: 'Leo', fallback: 'L', color: 'bg-indigo-500', x: -190, y: 85, baseAngle: Math.PI },
    { id: 'chloe', name: 'Chloe', fallback: 'C', color: 'bg-emerald-500', x: 180, y: 55, baseAngle: (3 * Math.PI) / 2 },
  ]

  // Micro Emojis reactions triggered by loop states
  const getAvatarReaction = (friendId: string) => {
    if (loopState === 0) {
      if (friendId === 'sam') return '👍'
      if (friendId === 'maya') return '🍣'
      if (friendId === 'chloe') return '❤️'
    }
    if (loopState === 1) {
      return '🎉'
    }
    if (loopState === 2) {
      if (friendId === 'sam') return '🔥'
      if (friendId === 'maya') return '🍜'
      if (friendId === 'leo') return '😋'
      if (friendId === 'chloe') return '❤️'
    }
    return null
  }

  // Get active indicator rings or checkmarks
  const getAvatarIndicator = (friendId: string) => {
    if (loopState === 0) {
      if (friendId === 'sam') return 'yes'
      if (friendId === 'maya') return 'yes'
      if (friendId === 'leo') return 'no'
    }
    if (loopState >= 1) return 'yes'
    return null
  }

  // Haptic vibrate simulation values (GPU accelerated translate3d)
  const getPhoneJitter = () => {
    if (loopState === 2) {
      return {
        x: [0, -3, 3, -3, 3, -2, 2, 0],
        y: [0, 2, -2, 2, -2, 1, -1, 0],
        transition: { duration: 0.4 }
      }
    }
    return { x: 0, y: 0 }
  }

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center pt-28 pb-16 px-6 md:px-12 overflow-hidden bg-[#FAF7F2] dark:bg-[#111827] select-none z-0 transition-colors duration-300"
    >
      
      {/* 1. GPU-Accelerated Particle Canvas Backdrop */}
      <ParticleCanvas />

      {/* 2. Fluttering Grain overlay */}
      <div className="film-grain-active pointer-events-none z-10 animate-fade-in" style={{ transform: 'translate3d(0,0,0)' }} />

      {/* 3. Light overlays & Vignette borders */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 dark:from-[#0F172A]/95 via-transparent to-[#FAF7F2]/95 dark:to-[#0F172A]/95 pointer-events-none z-10 transition-colors duration-300" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/90 dark:from-[#0F172A]/90 via-transparent to-[#FAF7F2]/90 dark:to-[#0F172A]/90 pointer-events-none z-10 transition-colors duration-300" />

      {/* 4. Layered breathing lights (GPU accelerated with transform translate3d) - HIDDEN IN DARK MODE FOR SOLID SURFACE */}
      <motion.div 
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.25, 0.35, 0.25],
          x: [0, 15, 0],
          y: [0, -15, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FF7A30] filter blur-[140px] pointer-events-none z-10 translate-3d dark:hidden"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.18, 0.28, 0.18],
          x: [0, -20, 0],
          y: [0, 15, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#FF8C42] filter blur-[150px] pointer-events-none z-10 translate-3d dark:hidden"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* 5. Center-aligned 2-Column Premium Layout (Left copy -> Right product) */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-20 relative">
        
        {/* LEFT COLUMN: Headings & magnetic CTAs */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#ECE6DD] text-[#FF7A30] text-[10px] font-black tracking-widest uppercase mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Decide where to eat together
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-[#1E1E1E] mb-6 leading-[1.05]"
          >
            Stop arguing.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A30] via-[#FF8C42] to-[#FFB38A] text-glow">
              Start eating.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#6D6D6D] font-semibold max-w-lg mb-10 leading-relaxed"
          >
            Create a room, swipe restaurants together, vote live, veto bad picks, and decide food in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button onClick={openSelector} variant="primary" size="lg" className="group shadow-md relative overflow-hidden px-8 cursor-pointer text-white bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] border-none font-bold">
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-20deg] translate-x-[-150%] animate-shimmer" />
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Create Room
            </Button>
            <Button onClick={() => setIsDemoOpen(true)} variant="glass" size="lg" className="group border-[#ECE6DD] hover:bg-[#F4EFE8] text-[#1E1E1E] font-bold px-8 flex items-center gap-2 shadow-sm">
              <Play className="w-4 h-4 text-[#FF7A30] fill-current" />
              Watch Live Demo
            </Button>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: iPhone Live Demo with GPU Parallax tilt (occupies 45-55% width) */}
        <div className="lg:col-span-6 flex justify-center items-center relative min-h-[550px] w-full py-8">
          <div className="scale-[0.72] xs:scale-[0.8] sm:scale-[0.9] md:scale-[0.95] lg:scale-[0.85] xl:scale-100 origin-center transition-transform duration-300 relative flex items-center justify-center">
            <motion.div
              style={{ 
                rotateX, 
                rotateY, 
                transformStyle: 'preserve-3d', 
                perspective: 1000 
              }}
              className="relative flex items-center justify-center pointer-events-auto"
            >
              
              {/* Liquid-glass backplate */}
              <div className="absolute -inset-10 rounded-[56px] bg-[#FFFFFF]/30 backdrop-blur-3xl border border-[#ECE6DD] shadow-sm -z-10" />

              {/* Orbiting Friend Avatars with Parallax */}
              {friends.map((friend) => {
                const isActive = getAvatarIndicator(friend.id) !== null
                const indicatorVal = getAvatarIndicator(friend.id)
                const reactionEmoji = getAvatarReaction(friend.id)

                return (
                  <motion.div
                    key={friend.id}
                    style={{ 
                      position: 'absolute', 
                      zIndex: 30,
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{
                      // Floating orbit calculation + mouse position translations
                      x: friend.x + Math.cos(Date.now() / 2500 + friend.baseAngle) * 8,
                      y: friend.y + Math.sin(Date.now() / 2000 + friend.baseAngle) * 8,
                      z: isActive ? 35 : 15,
                      scale: isActive ? 1.15 : 1
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 16 }}
                  >
                    <Avatar
                      fallback={friend.fallback}
                      color={friend.color}
                      size="lg"
                      isActive={isActive}
                      indicator={indicatorVal}
                      className="shadow-md border-[#ECE6DD]"
                    />
                    
                    {/* Floating reactions */}
                    <AnimatePresence>
                      {reactionEmoji && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0, y: 15 }}
                          animate={{ 
                            scale: [1, 1.2, 1], 
                            opacity: 1, 
                            y: -35 
                          }}
                          exit={{ opacity: 0, scale: 0.5, y: -50 }}
                          transition={{ duration: 0.8, type: "spring" }}
                          className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#FFFFFF] border border-[#ECE6DD] text-xs px-2.5 py-1 rounded-full shadow-md z-40 font-bold text-[#1E1E1E]"
                        >
                          {reactionEmoji}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}

              {/* iPhone Frame */}
              <motion.div 
                animate={getPhoneJitter()}
                className="relative w-[320px] h-[640px] bg-[#FFFFFF] border-[6px] border-[#ECE6DD] rounded-[44px] shadow-lg overflow-hidden"
                style={{ transform: 'translateZ(30px)', willChange: 'transform' }}
              >
                
                {/* Parallax glass reflection shift */}
                <motion.div
                  style={{
                    x: glareX,
                    y: glareY,
                    willChange: 'transform'
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.15] to-white/0 pointer-events-none z-30 mix-blend-overlay rotate-[32deg] scale-[1.6]"
                />

                {/* Dynamic Island Screen Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-3xl z-40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 absolute right-4" />
                </div>

                {/* In-App mock screen */}
                <div className="w-full h-full bg-[#FAF7F2] flex flex-col justify-between pt-10 px-4 pb-6 relative z-10">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#8B8B8B] uppercase tracking-widest font-bold leading-none">Session Code</span>
                      <span className="text-[11px] text-[#1E1E1E] font-bold tracking-wider font-display">ZESTO - 884</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#ECE6DD] px-2 py-0.5 rounded-full shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-[#6D6D6D]">4 Online</span>
                    </div>
                  </div>

                  {/* Live App Demo Card Deck */}
                  <div className="relative flex-1 flex justify-center items-center my-4 overflow-hidden">
                    <AnimatePresence mode="wait">
                      
                      {/* STATE 0: Swiping Active & Votes Syncing */}
                      {loopState === 0 && (
                        <motion.div
                          key="state-swipe"
                          initial={{ opacity: 0, x: -100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 300, rotate: 18 }}
                          transition={{ type: "spring", stiffness: 200, damping: 18 }}
                          className="absolute w-full h-[300px] rounded-[28px] border border-[#ECE6DD] flex flex-col justify-between overflow-hidden shadow-sm z-10 bg-[#FFFFFF]"
                        >
                          <div 
                            className="h-28 w-full p-4 flex flex-col justify-between"
                            style={{ background: "linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)" }}
                          >
                            <span className="text-3xl self-end select-none">🍣</span>
                            <span className="bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-black text-white self-start">
                              ⭐ 4.9
                            </span>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between bg-[#FFFFFF] text-left">
                            <div>
                              <div className="flex justify-between items-start mb-0.5">
                                <h4 className="text-sm font-bold text-[#1E1E1E] font-display leading-tight truncate">Sushi House</h4>
                                <span className="text-[10px] text-[#8B8B8B] font-semibold">$$$</span>
                              </div>
                              <p className="text-[10px] text-[#6D6D6D] font-medium leading-none">Japanese • Premium Rolls</p>
                            </div>
                            
                            <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1.5 rounded-xl border border-[#ECE6DD]">
                              <Users className="w-3.5 h-3.5 text-[#8B8B8B]" />
                              <span className="text-[9px] text-[#6D6D6D] font-medium">Maya and Sam are voting...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STATE 1: Restaurant selected & Vote Syncing + Confetti */}
                      {loopState === 1 && (
                        <motion.div
                          key="state-selected"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute w-full h-[300px] rounded-[28px] border border-[#FF7A30]/20 flex flex-col justify-between overflow-hidden shadow-sm z-10 bg-[#FFFFFF]"
                        >
                          <div 
                            className="h-28 w-full p-4 flex flex-col justify-between"
                            style={{ background: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)" }}
                          >
                            <span className="text-3xl self-end select-none">🍜</span>
                            <span className="bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-black text-white self-start">
                              ⭐ 4.8
                            </span>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between bg-[#FFFFFF] text-left">
                            <div>
                              <div className="flex justify-between items-start mb-0.5">
                                <h4 className="text-sm font-bold text-[#1E1E1E] font-display leading-tight truncate">Tokyo Ramen Bar</h4>
                                <span className="text-[10px] text-[#8B8B8B] font-semibold">$$</span>
                              </div>
                              <p className="text-[10px] text-[#6D6D6D] font-medium leading-none">Japanese • Ramen</p>
                            </div>
                            
                            {/* Real-time progress sync animation */}
                            <div className="flex flex-col gap-1 w-full bg-[#FAF7F2] p-2 rounded-xl border border-[#ECE6DD] mt-1">
                              <div className="flex justify-between text-[8px] font-bold text-[#6D6D6D]">
                                <span>Consensus syncing...</span>
                                <span className="text-[#FF7A30] animate-pulse">4/4 Match!</span>
                              </div>
                              <div className="w-full bg-[#ECE6DD] h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: "10%" }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-[#FF7A30] to-[#FF8C42]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Confetti micro-interaction */}
                          <div className="absolute inset-0 pointer-events-none z-30">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <motion.span
                                key={i}
                                initial={{ 
                                  x: 140, 
                                  y: 220, 
                                  scale: Math.random() * 0.5 + 0.5,
                                  opacity: 1 
                                }}
                                animate={{ 
                                  x: Math.random() * 260 - 20, 
                                  y: Math.random() * 150 + 20, 
                                  opacity: 0, 
                                  rotate: Math.random() * 360 
                                }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="absolute w-1.5 h-1.5 rounded-full"
                                style={{ 
                                  backgroundColor: i % 2 === 0 ? '#FF7A30' : '#FF8C42',
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* STATE 2: MATCH FOUND Winner celebration */}
                      {loopState === 2 && (
                        <motion.div
                          key="state-match"
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.85 }}
                          transition={{ type: "spring", stiffness: 280, damping: 20 }}
                          className="absolute inset-0 flex flex-col justify-center items-center bg-[#FFF5F0] border border-[#FF7A30]/30 px-3 text-center z-20 shadow-sm"
                        >
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                            className="text-4xl mb-3"
                          >
                            🍜
                          </motion.div>
                          <span className="text-[#FF7A30] text-[9px] font-bold tracking-wider uppercase mb-0.5">Winner Chosen</span>
                          <h3 className="text-lg font-bold font-display text-[#1E1E1E] mb-1.5 leading-tight">Tokyo Ramen Bar</h3>
                          <p className="text-[10px] text-[#6D6D6D] mb-4 max-w-[180px]">Hot, steamy ramen matches everyone's taste profile!</p>
                          
                          <div className="w-full bg-[#ECE6DD] h-2 rounded-full overflow-hidden mb-4">
                            <div className="h-full w-full bg-gradient-to-r from-[#FF7A30] to-[#FF8C42]" />
                          </div>
                          
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-[10px] text-white font-bold bg-[#FF7A30] px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider"
                          >
                            MATCH FOUND 🍜
                          </motion.div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                  {/* Footer app control panel mockup */}
                  <div className="flex flex-col gap-3 z-30">
                    
                    <div className="flex justify-between items-center bg-[#FFFFFF] border border-[#ECE6DD] px-3 py-2 rounded-full shadow-sm">
                      <span className="text-[9px] text-[#6D6D6D] font-medium flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#FF7A30]" />
                        Lobby votes:
                      </span>
                      <span className="text-[9px] font-bold text-[#1E1E1E]">
                        {loopState === 0 ? "2/4 Agree" : loopState === 1 ? "4/4 Match!" : "Finished!"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center px-2">
                      <button className="w-9 h-9 rounded-full bg-[#FF7A30]/10 border border-[#FF7A30]/25 flex items-center justify-center text-[#FF7A30] hover:bg-[#FF7A30]/20 transition-colors">
                        🚫
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[#E85D5D]/10 border border-[#E85D5D]/25 flex items-center justify-center text-[#E85D5D] hover:bg-[#E85D5D]/20 transition-colors">
                        ✗
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/25 flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50]/20 transition-colors">
                        ✓
                      </button>
                      <button className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#ECE6DD] flex items-center justify-center text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors">
                        ℹ
                      </button>
                    </div>

                  </div>

                </div>

              </motion.div>

              {/* Backglow spotlight shadow */}
              <div className="absolute inset-0 bg-radial-gradient from-[#FF7A30]/10 via-transparent to-transparent rounded-full blur-2xl -z-20 pointer-events-none" />

            </motion.div>

          </div>
        </div>

      </div>

    </section>
  )
}
