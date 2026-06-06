import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ThumbsUp, ThumbsDown, Users, CheckCircle, Clock } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'

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

  // Check if all votes have been cast
  const isVotingComplete = selectedDishes.every(dish => {
    const { totalCount } = getVoteCounts(dish.id)
    return totalCount >= members.length
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-xl mx-auto px-4 py-6 text-left relative z-10 flex flex-col gap-6 text-[#1E1E1E]"
    >
      {/* Header */}
      <div className="flex justify-between items-center z-10 border-b border-[#ECE6DD] pb-3">
        <button
          onClick={resetRound}
          className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Cancel session
        </button>
        <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider bg-[#FF7A30]/5 px-2.5 py-0.5 rounded border border-[#FF7A30]/10">
          Step 4 of 5
        </span>
      </div>

      <div className="z-10 space-y-1.5">
        <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider block">
          Multiplayer ballot
        </span>
        <h1 className="text-2xl font-black text-[#1E1E1E] tracking-tight">
          Vote with your friends
        </h1>
        <p className="text-[11px] text-[#6D6D6D] font-medium">
          Continue or remove dishes together.
        </p>
      </div>

      {/* List of Dishes for Voting */}
      <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1 z-10">
        {selectedDishes.length === 0 ? (
          <div className="text-center py-10 text-[#8B8B8B] text-xs font-medium">
            No dishes were chosen by the group.
          </div>
        ) : (
          selectedDishes.map((dish) => {
            const votes = dishVotes[dish.id] || {}
            const userVote = votes['user']
            const choosers = getChoosers(dish.id)
            const { continueCount, skipCount, totalCount } = getVoteCounts(dish.id)

            return (
              <motion.div
                key={dish.id}
                layoutId={`voting-card-${dish.id}`}
                className={`p-4 bg-[#FFFFFF] border rounded-2xl flex flex-col gap-3.5 relative transition-all duration-200 shadow-sm ${
                  userVote === 'continue' ? 'border-[#4CAF50]/30 bg-[#4CAF50]/5' : userVote === 'skip' ? 'border-[#E85D5D]/30 bg-[#E85D5D]/5' : 'border-[#ECE6DD]'
                }`}
              >
                {/* Top: Image + Info */}
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#ECE6DD]">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold text-[#1E1E1E] tracking-wide truncate pr-1">
                        {dish.name}
                      </h3>
                      <span className="text-xs font-bold text-[#FF7A30] font-sans shrink-0">{dish.price}</span>
                    </div>

                    <p className="text-[10px] text-[#6D6D6D] leading-relaxed mt-0.5 mb-1.5 font-medium">
                      Chosen by: <span className="text-[#FF7A30] font-bold">{choosers.join(', ')}</span>
                    </p>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#8B8B8B]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{totalCount} / {members.length} members voted</span>
                      <span className="text-[#ECE6DD]">•</span>
                      <span className="text-[#4CAF50]">{continueCount} Keep</span>
                      <span className="text-[#ECE6DD]">•</span>
                      <span className="text-[#E85D5D]">{skipCount} Skip</span>
                    </div>
                  </div>
                </div>

                {/* Bottom: 👍/👎 Action Buttons */}
                <div className="grid grid-cols-2 gap-3 border-t border-[#ECE6DD] pt-3">
                  <button
                    onClick={() => castGroupVote(dish.id, 'skip')}
                    className={`py-2 rounded-xl border text-[10px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userVote === 'skip'
                        ? 'bg-[#E85D5D]/10 border-[#E85D5D]/30 text-[#E85D5D]'
                        : 'bg-[#F4EFE8] border-[#ECE6DD] text-[#6D6D6D] hover:bg-[#E85D5D]/5 hover:text-[#E85D5D] hover:border-[#E85D5D]/30 shadow-sm'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" /> Skip
                  </button>

                  <button
                    onClick={() => castGroupVote(dish.id, 'continue')}
                    className={`py-2 rounded-xl border text-[10px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userVote === 'continue'
                        ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#4CAF50]'
                        : 'bg-[#F4EFE8] border-[#ECE6DD] text-[#6D6D6D] hover:bg-[#4CAF50]/5 hover:text-[#4CAF50] hover:border-[#4CAF50]/30 shadow-sm'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> Keep
                  </button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Real-time sync logs feed */}
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

      {/* Continue trigger */}
      <div className="z-10">
        <button
          onClick={confirmVotingRound}
          className={`w-full py-3.5 border-none font-bold tracking-wider text-[11px] rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 font-sans text-white ${
            isVotingComplete 
              ? 'bg-[#4CAF50] hover:bg-[#45a049]' 
              : 'bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isVotingComplete ? (
            <>
              <CheckCircle className="w-4 h-4 text-white" /> View final squad order
            </>
          ) : (
            'Continue to bill split anyway'
          )}
        </button>
      </div>

    </motion.div>
  )
}

export default VotingRound
