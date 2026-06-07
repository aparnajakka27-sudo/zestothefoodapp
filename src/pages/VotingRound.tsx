import React, { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionValueEvent } from 'framer-motion'
import { ChevronLeft, Flame, X, Users, CheckCircle } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import type { Dish } from '../types'

// SwipeCard Sub-component for Tinder-like swiping
const SwipeCard: React.FC<{
  dish: Dish
  onSwipe: (id: string, vote: 'continue' | 'skip') => void
  choosers: string[]
}> = ({ dish, onSwipe, choosers }) => {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5])
  const [swipeDirection, setSwipeDirection] = useState<'right' | 'left' | null>(null)
  
  // Local animation control for button clicks
  const [exitX, setExitX] = useState<number | null>(null)

  useMotionValueEvent(x, "change", (latest) => {
    if (latest > 50) setSwipeDirection('right')
    else if (latest < -50) setSwipeDirection('left')
    else setSwipeDirection(null)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (_event: any, info: any) => {
    if (info.offset.x > 120) {
      onSwipe(dish.id, 'continue')
    } else if (info.offset.x < -120) {
      onSwipe(dish.id, 'skip')
    }
  }

  const handleBtnClick = (dir: 'continue' | 'skip') => {
    setExitX(dir === 'continue' ? 300 : -300)
    setTimeout(() => {
      onSwipe(dish.id, dir)
    }, 200)
  }

  return (
    <motion.div
      style={{ x: exitX !== null ? exitX : x, rotate, opacity }}
      drag={exitX !== null ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== null ? { x: exitX, opacity: 0, scale: 0.95 } : { x: 0, rotate: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute inset-0 bg-white border border-[#ECE6DD] rounded-[28px] p-6 flex flex-col justify-between shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] cursor-grab active:cursor-grabbing text-left select-none overflow-hidden"
    >
      {/* Visual Direction Labels overlay */}
      <AnimatePresence>
        {swipeDirection === 'right' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 right-8 border-4 border-emerald-500 text-emerald-500 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl rotate-12 z-20"
          >
            Let's order this 🔥
          </motion.div>
        )}
        {swipeDirection === 'left' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 left-8 border-4 border-rose-500 text-rose-500 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl -rotate-12 z-20"
          >
            Skip this
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dish Image section */}
      <div className="w-full h-[180px] rounded-2xl overflow-hidden border border-[#ECE6DD] relative">
        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white/95 border border-[#ECE6DD] py-1 px-3 rounded-xl text-xs font-black text-[#FF7A30] font-sans shadow-sm">
          {dish.price}
        </div>
      </div>

      {/* Dish Meta details */}
      <div className="flex-1 mt-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-black text-[#1E1E1E] tracking-tight">{dish.name}</h3>
            {dish.isVeg ? (
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">Veg</span>
            ) : (
              <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">Non-Veg</span>
            )}
          </div>
          
          <p className="text-[10.5px] text-[#6D6D6D] mt-1.5 font-medium leading-relaxed">
            Selected by: <span className="text-[#FF7A30] font-bold">
              {choosers.length === 1 
                ? choosers[0] 
                : `${choosers[0]} + ${choosers.length - 1} friend${choosers.length - 1 > 1 ? 's' : ''}`
              }
            </span>
          </p>
          
          <p className="text-[10px] text-[#8B8B8B] font-semibold mt-1 leading-normal italic">
            {dish.description || 'A delicious crowd favorite selected for your food squad session.'}
          </p>
        </div>

        {/* Action Buttons panel */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#ECE6DD]">
          <button
            onClick={() => handleBtnClick('skip')}
            className="py-2.5 rounded-full border border-[#ECE6DD] bg-[#FAF7F2] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 text-[#6D6D6D] text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-rose-500" /> Skip dish
          </button>
          <button
            onClick={() => handleBtnClick('continue')}
            className="py-2.5 rounded-full border border-none bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Flame className="w-4 h-4 text-white" /> Approve dish
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export const VotingRound: React.FC = () => {
  const {
    dishes,
    selections,
    members,
    dishVotes,
    voteStatusLogs,
    castGroupVote,
    confirmVotingRound,
    resetRound
  } = useRoomStore()

  // Get list of all selected dishes by at least one squad member
  const allSelectedDishIds = Array.from(new Set(Object.values(selections).flat()))
  const selectedDishes = dishes.filter(d => allSelectedDishIds.includes(d.id))

  // Find who chose each dish
  const getChoosers = (dishId: string): string[] => {
    const choosers: string[] = []
    Object.entries(selections).forEach(([memberId, dishIds]) => {
      if (dishIds.includes(dishId)) {
        const member = members.find(m => m.id === memberId)
        if (member) choosers.push(member.name)
      }
    })
    return choosers
  }

  // Calculate vote counts for each dish
  const getVoteCounts = (dishId: string) => {
    const votes = dishVotes[dishId] || {}
    let continueCount = 0
    let skipCount = 0
    let totalCount = 0

    members.forEach(member => {
      const v = votes[member.id]
      if (v) {
        totalCount++
        if (v === 'continue') continueCount++
        else skipCount++
      }
    })

    return { continueCount, skipCount, totalCount }
  }

  // derive what dishes the user still needs to swipe
  const unvotedDishes = selectedDishes.filter(dish => !dishVotes[dish.id]?.['user'])
  const swipedCount = selectedDishes.length - unvotedDishes.length

  // Filter squad approved dishes (continue votes >= skip votes) vs rejected dishes
  const approvedDishes: Dish[] = []
  const rejectedDishes: Dish[] = []

  selectedDishes.forEach(dish => {
    const { continueCount, skipCount } = getVoteCounts(dish.id)
    if (continueCount >= skipCount) {
      approvedDishes.push(dish)
    } else {
      rejectedDishes.push(dish)
    }
  })

  // Calculate global group progress
  const totalPossibleVotes = selectedDishes.length * members.length
  let totalCastVotes = 0
  selectedDishes.forEach(dish => {
    const { totalCount } = getVoteCounts(dish.id)
    totalCastVotes += totalCount
  })
  const progressPercent = totalPossibleVotes > 0 ? Math.round((totalCastVotes / totalPossibleVotes) * 100) : 0
  const membersVotedCount = members.filter(m => {
    // Member has voted if they have cast a vote on all selected dishes
    return selectedDishes.every(dish => dishVotes[dish.id]?.[m.id])
  }).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-xl mx-auto px-4 py-4 text-left relative z-10 flex flex-col gap-5 text-[#1E1E1E]"
    >
      {/* Header */}
      <div className="flex justify-between items-center z-10 border-b border-[#ECE6DD] pb-3">
        <button
          onClick={resetRound}
          className="flex items-center gap-1.5 text-[11px] font-black tracking-wider text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer uppercase"
        >
          <ChevronLeft className="w-4 h-4" /> Cancel session
        </button>
        <span className="text-[#FF7A30] text-[10px] font-black tracking-wider uppercase bg-[#FF7A30]/5 px-2.5 py-0.5 rounded border border-[#FF7A30]/10">
          Step 4 of 5
        </span>
      </div>

      {/* Swipe ballot Header */}
      <div className="z-10 space-y-1.5">
        <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider block uppercase">
          Step 4 of 5 • Squad Voting
        </span>
        <h1 className="text-2xl font-black text-[#1E1E1E] tracking-tight leading-none">
          Vote with your squad 🍽
        </h1>
        <p className="text-[11px] text-[#6D6D6D] font-semibold leading-relaxed">
          You and your friends selected these dishes. Vote to finalize them.
        </p>
        <p className="text-[9.5px] text-[#8B8B8B] font-medium leading-normal italic">
          Approve dishes you want. Skip dishes you don't want. Higher voted dishes get finalized.
        </p>
      </div>

      {/* Live Voting Progress Bar */}
      {selectedDishes.length > 0 && (
        <div className="bg-white border border-[#ECE6DD] p-3.5 rounded-2xl shadow-sm z-10 space-y-2 text-left">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#FF7A30]" /> 
              {membersVotedCount} / {members.length} friends voted
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          
          <div className="w-full h-1.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#ECE6DD]/60">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#FF7A30] to-[#FF8C42]" 
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Quick Avatar list indicators */}
          <div className="flex gap-1.5 pt-1 items-center">
            <span className="text-[9px] text-[#8B8B8B] font-bold uppercase tracking-wider mr-1">Voters:</span>
            {members.map(m => {
              const hasFinished = selectedDishes.every(dish => dishVotes[dish.id]?.[m.id])
              return (
                <div 
                  key={m.id} 
                  title={`${m.name} (${hasFinished ? 'Voted' : 'Voting...'})`}
                  className={`w-5 h-5 rounded-full text-[8px] font-black text-white uppercase flex items-center justify-center border transition-all ${
                    hasFinished ? 'bg-[#4CAF50] border-[#4CAF50] scale-105' : `${m.avatarColor || 'bg-[#FF7A30]'} border-[#ECE6DD] opacity-65`
                  }`}
                >
                  {hasFinished ? '✓' : m.name.charAt(0)}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Center Action Zone: Swiper Deck OR Waiting/Success Area */}
      <div className="z-10 relative flex justify-center items-center">
        {selectedDishes.length === 0 ? (
          <div className="bg-white border border-[#ECE6DD] p-10 rounded-[28px] w-full text-center text-[#8B8B8B] text-xs font-semibold shadow-sm">
            No dishes were chosen by the group.
          </div>
        ) : unvotedDishes.length > 0 ? (
          /* ACTIVE TINDER DECK */
          <div className="w-full max-w-sm h-[430px] relative">
            {unvotedDishes.slice(0, 3).reverse().map((dish, idx, arr) => {
              // Create offset stack layers
              const stackIndex = arr.length - 1 - idx
              return (
                <div 
                  key={dish.id} 
                  className="absolute inset-0"
                  style={{
                    transform: `translateY(${stackIndex * 10}px) scale(${1 - stackIndex * 0.045})`,
                    zIndex: 50 - stackIndex,
                    pointerEvents: stackIndex === 0 ? 'auto' : 'none',
                    opacity: 1 - stackIndex * 0.25,
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <SwipeCard 
                    dish={dish} 
                    onSwipe={castGroupVote} 
                    choosers={getChoosers(dish.id)} 
                  />
                </div>
              )
            })}
          </div>
        ) : (
          /* WAITING FOR OTHERS TO FINISH OR SUCCESS READY */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white border border-[#ECE6DD] p-8 rounded-[28px] shadow-sm text-center relative overflow-hidden"
          >
            {progressPercent < 100 ? (
              <div className="space-y-4 py-6">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-[#FF7A30]/30 border-t-[#FF7A30] animate-spin" />
                </div>
                <h3 className="text-sm font-black text-[#1E1E1E] uppercase tracking-wider">
                  Waiting for squad to finish voting...
                </h3>
                <p className="text-[10.5px] text-[#6D6D6D] leading-relaxed max-w-xs mx-auto">
                  You've swiped all the dishes! Other squad members are still voting on the group choices in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-6">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 text-xl font-bold animate-bounce">
                    🎉
                  </div>
                </div>
                <h3 className="text-sm font-black text-[#1E1E1E] uppercase tracking-wider">
                  All squad votes cast!
                </h3>
                <p className="text-[10.5px] text-[#6D6D6D] leading-relaxed max-w-xs mx-auto">
                  Consensus has been reached. Proceed to view the final squad dishes and start splitting the bill.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Swipe Cards Indicators Guide */}
      {unvotedDishes.length > 0 && (
        <div className="z-10 flex justify-between items-center text-[9.5px] font-bold text-[#8B8B8B] px-4 uppercase tracking-wider select-none">
          <span>← Swipe Left to Skip</span>
          <span>Card {swipedCount + 1} of {selectedDishes.length}</span>
          <span>Swipe Right to Add →</span>
        </div>
      )}

      {/* Real-time status logs activity feed */}
      <div className="z-10 bg-[#FFFFFF] border border-[#ECE6DD] p-4 rounded-2xl flex flex-col gap-2 shadow-sm">
        <span className="text-[9px] font-bold text-[#8B8B8B] tracking-wider flex items-center gap-1 border-b border-[#ECE6DD] pb-1">
          <Users className="w-3.5 h-3.5 text-[#FF7A30]" /> Live ballot activity feed
        </span>
        <div className="flex flex-col gap-1.5 max-h-[85px] overflow-y-auto pr-1 select-none font-mono text-[9px] font-medium text-[#6D6D6D]">
          <AnimatePresence>
            {voteStatusLogs.slice(-4).map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 uppercase tracking-wider"
              >
                <span className="text-[#FF7A30] shrink-0">&gt;</span>
                <span>{log}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Continue CTA */}
      <div className="z-10">
        {progressPercent < 100 ? (
          <button
            onClick={confirmVotingRound}
            className="w-full py-3.5 border-none font-bold tracking-wider text-[11px] uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 font-sans text-white bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.01] active:scale-[0.99]"
          >
            Skip wait & view results anyway
          </button>
        ) : (
          <button
            onClick={confirmVotingRound}
            className="w-full py-3.5 border-none font-bold tracking-wider text-[11px] uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 font-sans text-white bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99]"
          >
            <CheckCircle className="w-4.5 h-4.5 text-white" /> View Consensus Results
          </button>
        )}
      </div>

    </motion.div>
  )
}

export default VotingRound
