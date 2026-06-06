import React from 'react'
import { motion } from 'framer-motion'
import { Card } from './ui/Card'
import { Frown, Smile, MessageSquare, AlertCircle } from 'lucide-react'

export const FoodShowcase: React.FC = () => {
  return (
    <section id="match-story" className="py-24 md:py-32 px-6 bg-[#F4EFE8] overflow-hidden relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[#FF7A30] text-xs font-black tracking-widest uppercase mb-3 block">Comparison</span>
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-[#1E1E1E] mb-6">
            The decision timeline
          </h2>
          <p className="text-lg text-[#6D6D6D] font-semibold">
            Stop scrolling through Yelp lists and typing in group chats. Let's compare a standard Friday night.
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Column 1: The Old Way (Slides in from Left) */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
            className="h-full"
          >
            <Card className="p-8 border-rose-200 bg-white hoverable relative overflow-hidden flex flex-col justify-between h-full animate-gpu shadow-[0_4px_20px_rgba(0,0,0,0.02)]" hoverable={false}>
              <div className="absolute top-0 right-0 bg-rose-50 border-b border-l border-rose-100 px-4 py-1.5 rounded-bl-3xl text-rose-600 text-xs font-bold flex items-center gap-1.5">
                <Frown className="w-3.5 h-3.5" />
                The Old Way
              </div>

              <div>
                <h3 className="text-xl font-bold font-display text-[#1E1E1E] mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-rose-500" />
                  Endless Group Chat Arguments
                </h3>

                {/* Chat Simulation */}
                <div className="space-y-4 mb-8">
                  <div className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] text-[#6D6D6D] font-bold mb-1 ml-3">Sam</span>
                    <div className="bg-[#FAF7F2] text-[#1E1E1E] text-xs px-4 py-2.5 rounded-2xl rounded-tl-none font-semibold border border-[#ECE6DD]">
                      Hey, where are we eating tonight?
                    </div>
                  </div>

                  <div className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] text-[#6D6D6D] font-bold mb-1 ml-3">Maya</span>
                    <div className="bg-[#FAF7F2] text-[#1E1E1E] text-xs px-4 py-2.5 rounded-2xl rounded-tl-none font-semibold border border-[#ECE6DD]">
                      Ummm pizza? Or maybe sushi?
                    </div>
                  </div>

                  <div className="flex flex-col items-end ml-auto max-w-[85%]">
                    <span className="text-[10px] text-[#6D6D6D] font-bold mb-1 mr-3">You</span>
                    <div className="bg-[#FF7A30]/10 text-[#1E1E1E] text-xs px-4 py-2.5 rounded-2xl rounded-tr-none font-semibold border border-[#FF7A30]/20">
                      I had sushi yesterday. Pizza is fine I guess.
                    </div>
                  </div>

                  <div className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] text-[#6D6D6D] font-bold mb-1 ml-3">Chloe</span>
                    <div className="bg-[#FAF7F2] text-[#1E1E1E] text-xs px-4 py-2.5 rounded-2xl rounded-tl-none font-semibold border border-[#ECE6DD]">
                      No way, pizza is so heavy. Can we do salad or tacos?
                    </div>
                  </div>

                  <div className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] text-[#6D6D6D] font-bold mb-1 ml-3">Leo</span>
                    <div className="bg-[#FAF7F2] text-[#1E1E1E] text-xs px-4 py-2.5 rounded-2xl rounded-tl-none font-semibold border border-[#ECE6DD]">
                      I hate that taco place, always gives me stomach aches.
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="pt-6 border-t border-[#ECE6DD] flex justify-between items-center bg-rose-50 px-4 py-3 rounded-2xl border border-rose-100">
                <span className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Time wasted: 45+ minutes
                </span>
                <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                  Unresolved
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Column 2: The Zesto Way (Slides in from Right) */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
            className="h-full"
          >
            <Card className="p-8 border-[#FF7A30]/20 bg-white hoverable relative overflow-hidden flex flex-col justify-between h-full animate-gpu shadow-[0_4px_20px_rgba(0,0,0,0.02)]" hoverable={false}>
              <div className="absolute top-0 right-0 bg-[#FF7A30]/10 border-b border-l border-[#FF7A30]/20 px-4 py-1.5 rounded-bl-3xl text-[#FF7A30] text-xs font-bold flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5" />
                The Zesto Way
              </div>

              <div>
                <h3 className="text-xl font-bold font-display text-[#1E1E1E] mb-6 flex items-center gap-2">
                  <span className="text-[#FF7A30]">🍊</span>
                  Zesto Instant Decision
                </h3>

                {/* Zesto Step simulation */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 bg-[#FAF7F2] border border-[#ECE6DD] p-3 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-[#FF7A30] flex items-center justify-center font-bold text-xs text-white">
                      You
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#1E1E1E]">Created room ZESTO-884</div>
                      <div className="text-[10px] text-[#6D6D6D]">3 friends joined online instantly</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-[#FAF7F2] border border-[#ECE6DD] p-3 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs text-white">
                      S
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#1E1E1E]">Sam voted YES on Tokyo Ramen</div>
                      <div className="text-[10px] text-[#6D6D6D]">Realtime sync complete</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-[#FF7A30]/10 border border-[#FF7A30]/20 p-3.5 rounded-2xl shadow-[0_0_15px_rgba(255,122,48,0.05)]">
                    <div className="w-8 h-8 rounded-full bg-[#FF7A30] flex items-center justify-center text-sm text-white">
                      🍜
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-black text-[#1E1E1E]">Match Found: Tokyo Ramen Bar!</div>
                      <div className="text-[10px] text-[#FF7A30] font-bold uppercase tracking-wider">All 4 members matched</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="pt-6 border-t border-[#ECE6DD] flex justify-between items-center bg-[#FF7A30]/10 px-4 py-3 rounded-2xl border border-[#FF7A30]/20">
                <span className="text-xs text-[#FF7A30] font-bold flex items-center gap-1.5 animate-pulse">
                  <Smile className="w-4 h-4 shrink-0" />
                  Time to match: 28 seconds
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Resolved 🍜
                </span>
              </div>
            </Card>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
