import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'

export const FinalDishes: React.FC = () => {
  const {
    dishes,
    approvedDishIds,
    rejectedDishIds,
    dishVotes,
    members,
    proceedToBillSplit,
    selectedRestaurant
  } = useRoomStore()

  if (!selectedRestaurant) return null

  const approvedDishes = dishes.filter(d => approvedDishIds.includes(d.id))
  const rejectedDishes = dishes.filter(d => rejectedDishIds.includes(d.id))

  const getVotersForDish = (dishId: string) => {
    const votes = dishVotes[dishId] || {}
    return members.filter(m => votes[m.id] === 'continue')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-xl mx-auto px-4 py-6 text-left relative z-10 flex flex-col gap-6 text-[#1E1E1E]"
    >
      {/* Header */}
      <div className="z-10 space-y-1.5 border-b border-[#ECE6DD] pb-4">
        <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider uppercase block">
          Step 5 of 5 • Consensus Results
        </span>
        <h1 className="text-2xl font-black text-[#1E1E1E] tracking-tight">
          Consensus Results 🔥
        </h1>
        <p className="text-[11px] text-[#6D6D6D] font-medium leading-relaxed">
          Dishes with majority support are approved. Rejected dishes are skipped.
        </p>
      </div>

      {/* Approved Dishes */}
      <div className="flex flex-col gap-3.5 z-10">
        <div className="flex justify-between items-center pl-1">
          <span className="text-[10px] font-bold text-[#6D6D6D] tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved ({approvedDishes.length})
          </span>
        </div>

        {approvedDishes.length === 0 ? (
          <div className="bg-white border border-[#ECE6DD] p-8 rounded-2xl text-center text-[#8B8B8B] text-xs font-bold shadow-sm">
            No dishes approved by the squad. Try choosing new dishes!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {approvedDishes.map(dish => {
              const voters = getVotersForDish(dish.id)
              return (
                <motion.div
                  key={dish.id}
                  variants={cardVariants}
                  className="p-4 bg-white border border-emerald-100 hover:border-emerald-200 rounded-2xl flex gap-4 transition-all duration-200 relative shadow-sm"
                >
                  {/* Left highlight strip */}
                  <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-emerald-500 rounded-r-md" />

                  {/* Image */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative border border-[#ECE6DD]">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-[#1E1E1E] tracking-wide truncate">
                        {dish.name}
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 font-sans shrink-0">{dish.price}</span>
                    </div>

                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-[#ECE6DD]/40">
                      {/* Voters avatars list */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-[#8B8B8B] font-bold uppercase tracking-wider">Kept by:</span>
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {voters.map(v => (
                            <div
                              key={v.id}
                              className={`w-5 h-5 rounded-full border border-white text-[8px] font-bold text-white uppercase flex items-center justify-center ${v.avatarColor || 'bg-[#FF7A30]'}`}
                              title={v.name}
                            >
                              {v.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Approved
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Rejected Dishes */}
      {rejectedDishes.length > 0 && (
        <div className="flex flex-col gap-3 z-10 opacity-75">
          <div className="flex justify-between items-center pl-1">
            <span className="text-[10px] font-bold text-[#6D6D6D] tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Skipped ({rejectedDishes.length})
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {rejectedDishes.map(dish => {
              return (
                <motion.div
                  key={dish.id}
                  variants={cardVariants}
                  className="p-3 bg-white border border-[#ECE6DD] rounded-2xl flex gap-4 transition-all duration-200 relative shadow-sm"
                >
                  {/* Left highlight strip */}
                  <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-rose-400 rounded-r-md" />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="text-xs font-bold text-[#6D6D6D] tracking-wide truncate">
                        {dish.name}
                      </h4>
                      <span className="text-xs font-bold text-[#8B8B8B] font-sans shrink-0">{dish.price}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-[#ECE6DD]/40">
                      <span className="text-[9px] text-[#8B8B8B] font-medium">Majority voted to skip</span>
                      <span className="text-[9px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <X className="w-2.5 h-2.5" /> Skipped
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Submit Action */}
      <div className="flex flex-col gap-3.5 z-10 pt-2">
        <button
          onClick={proceedToBillSplit}
          className="w-full py-4 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.01] active:scale-[0.99] text-white border-none text-[11px] font-bold tracking-wider rounded-xl transition-all cursor-pointer font-sans shadow-md flex items-center justify-center gap-1.5"
        >
          Proceed to Bill Split <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  )
}

export default FinalDishes
