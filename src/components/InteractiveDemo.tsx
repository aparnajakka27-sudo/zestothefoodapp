import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar } from './ui/Avatar'
import { Heart, X, Ban, Sparkles, RefreshCw } from 'lucide-react'

interface Restaurant {
  name: string
  cuisine: string
  rating: number
  price: string
  emoji: string
  image: string
}

const DEMO_RESTAURANTS: Restaurant[] = [
  { name: "Panda Garden", cuisine: "Chinese • Dumplings", rating: 4.6, price: "$$", emoji: "🥟", image: "linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)" },
  { name: "Burger Beast", cuisine: "American • Diner", rating: 4.4, price: "$", emoji: "🍔", image: "linear-gradient(135deg, #FF5E62 0%, #FF9966 100%)" },
  { name: "Taco Loco", cuisine: "Mexican • Street Food", rating: 4.7, price: "$", emoji: "🌮", image: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  { name: "Tokyo Ramen", cuisine: "Japanese • Noodles", rating: 4.9, price: "$$", emoji: "🍜", image: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)" }
]

export const InteractiveDemo: React.FC = () => {
  const [index, setIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'veto' | null>(null)
  const [showMatch, setShowMatch] = useState(false)
  const [friendStatus, setFriendStatus] = useState<string>("Sam & Maya are swiping...")

  const handleSwipe = (direction: 'left' | 'right' | 'veto') => {
    if (showMatch) return
    setSwipeDirection(direction)
    
    // Set mock responses
    if (direction === 'right') {
      setFriendStatus("Maya & Chloe voted YES! Syncing...")
      setTimeout(() => {
        setShowMatch(true)
      }, 800)
    } else if (direction === 'veto') {
      setFriendStatus("Veto used! Skipping restaurant...")
      setTimeout(() => {
        nextCard()
      }, 1000)
    } else {
      setFriendStatus("Sam swiped left. Searching next...")
      setTimeout(() => {
        nextCard()
      }, 1000)
    }
  }

  const nextCard = () => {
    setSwipeDirection(null)
    setIndex((prev) => (prev + 1) % DEMO_RESTAURANTS.length)
    setFriendStatus("Waiting for your vote...")
  }

  const resetDemo = () => {
    setIndex(0)
    setSwipeDirection(null)
    setShowMatch(false)
    setFriendStatus("Sam & Maya are ready to eat!")
  }

  const current = DEMO_RESTAURANTS[index]

  return (
    <section id="demo" className="relative py-24 md:py-32 px-6 bg-[#FFFFFF] overflow-hidden bottom-gradient-bg">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#FF7A30] text-xs font-black tracking-widest uppercase mb-3 block">Playground</span>
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-[#1E1E1E] mb-6">
            Try the swiping app
          </h2>
          <p className="text-lg text-[#6D6D6D] font-medium">
            See how fast a match happens. Swipe right to approve, left to skip, or use a veto to override.
          </p>
        </div>

        {/* Demo Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* Left Panel: Lobby Details */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-card rounded-3xl p-8 border border-[#ECE6DD] bg-[#FFFFFF] shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#ECE6DD]">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#1E1E1E]">Lobby Status</h3>
                  <span className="text-[10px] font-bold text-[#FF7A30] tracking-wider uppercase">Room: ZESTO-XYZ</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#FF7A30]/10 border border-[#FF7A30]/20 text-[10px] font-bold text-[#FF7A30]">
                  Live
                </div>
              </div>

              {/* Members */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar fallback="Y" color="bg-[#FF7A30]" size="md" />
                    <div>
                      <div className="text-xs font-bold text-[#1E1E1E]">You</div>
                      <div className="text-[10px] text-[#8B8B8B]">Host</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6D6D6D] bg-[#FAF7F2] px-2 py-0.5 rounded-full font-bold border border-[#ECE6DD]">
                    {swipeDirection === 'right' ? '✓ Voted' : swipeDirection === 'left' ? '✗ Skip' : swipeDirection === 'veto' ? '🚫 Veto' : 'Swiping...'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar fallback="S" color="bg-rose-500" size="md" indicator={showMatch ? 'yes' : swipeDirection === 'left' ? 'no' : null} />
                    <div>
                      <div className="text-xs font-bold text-[#1E1E1E]">Sam</div>
                      <div className="text-[10px] text-[#8B8B8B]">Friend</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6D6D6D] font-bold">
                    {showMatch ? '✓ Voted' : 'Swiping...'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar fallback="M" color="bg-indigo-500" size="md" indicator={showMatch ? 'yes' : null} />
                    <div>
                      <div className="text-xs font-bold text-[#1E1E1E]">Maya</div>
                      <div className="text-[10px] text-[#8B8B8B]">Friend</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6D6D6D] font-bold">
                    {showMatch ? '✓ Voted' : 'Swiping...'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar fallback="C" color="bg-emerald-500" size="md" indicator={showMatch ? 'yes' : null} />
                    <div>
                      <div className="text-xs font-bold text-[#1E1E1E]">Chloe</div>
                      <div className="text-[10px] text-[#8B8B8B]">Friend</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6D6D6D] font-bold">
                    {showMatch ? '✓ Voted' : 'Swiping...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Live Alert Status */}
            <div className="mt-8 pt-6 border-t border-[#ECE6DD]">
              <div className="text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider mb-1">Real-time Feed</div>
              <div className="text-xs font-bold text-[#FF7A30] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {friendStatus}
              </div>
            </div>
          </div>

          {/* Right Panel: The Interactive Tinder Card */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 glass-card rounded-3xl border border-[#ECE6DD] relative min-h-[420px] shadow-sm">
            
            <AnimatePresence mode="wait">
              {showMatch ? (
                
                /* MATCH OVERLAY VIEW */
                <motion.div
                  key="match"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="absolute inset-6 flex flex-col justify-center items-center text-center bg-[#FFF5F0] rounded-2xl border border-[#FF7A30]/30 p-6 z-20 shadow-sm"
                >
                  <Sparkles className="w-12 h-12 text-[#FF7A30] mb-4 animate-bounce" />
                  <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider uppercase mb-1">Success</span>
                  <h3 className="text-2xl font-black font-display text-[#1E1E1E] mb-2">Match Found! {current.emoji}</h3>
                  <p className="text-xs text-[#6D6D6D] mb-6 max-w-[240px]">
                    Everyone wants {current.name}. Let's head over and grab dinner.
                  </p>
                  
                  <div className="flex gap-4">
                    <button onClick={resetDemo} className="px-5 py-2.5 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white border-none rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer">
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                </motion.div>
              ) : (
                
                /* CARD INTERACTION VIEW */
                <motion.div
                  key={index}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    x: swipeDirection === 'right' ? 300 : swipeDirection === 'left' ? -300 : 0,
                    y: swipeDirection === 'veto' ? 150 : 0,
                    rotate: swipeDirection === 'right' ? 15 : swipeDirection === 'left' ? -15 : 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-full max-w-[280px] h-[340px] rounded-3xl border border-[#ECE6DD] flex flex-col justify-between overflow-hidden shadow-md bg-[#FFFFFF] z-10"
                >
                  <div 
                    className="h-32 w-full p-4 flex flex-col justify-between relative"
                    style={{ background: current.image }}
                  >
                    <span className="text-4xl absolute right-4 bottom-3 select-none">{current.emoji}</span>
                    <span className="bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-white self-start">
                      ⭐ {current.rating}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between bg-[#FFFFFF]">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-lg font-bold font-display text-[#1E1E1E] leading-tight">
                          {current.name}
                        </h4>
                        <span className="text-xs text-[#8B8B8B] font-semibold">{current.price}</span>
                      </div>
                      <p className="text-xs text-[#6D6D6D] font-medium">{current.cuisine}</p>
                    </div>

                    {/* Action Panel Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-[#ECE6DD]">
                      
                      {/* Veto Button */}
                      <button 
                        onClick={() => handleSwipe('veto')}
                        className="w-10 h-10 rounded-full bg-[#FF7A30]/10 border border-[#FF7A30]/25 flex items-center justify-center text-[#FF7A30] hover:bg-[#FF7A30]/20 transition-colors cursor-pointer"
                        title="Use your 1 Veto"
                      >
                        <Ban className="w-4 h-4" />
                      </button>

                      {/* No / Skip Button */}
                      <button 
                        onClick={() => handleSwipe('left')}
                        className="w-12 h-12 rounded-full bg-[#E85D5D]/10 border border-[#E85D5D]/25 flex items-center justify-center text-[#E85D5D] hover:bg-[#E85D5D]/20 transition-colors cursor-pointer"
                        title="Skip restaurant"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Yes / Like Button */}
                      <button 
                        onClick={() => handleSwipe('right')}
                        className="w-12 h-12 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/25 flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50]/20 transition-colors cursor-pointer"
                        title="Vouch restaurant"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  )
}
