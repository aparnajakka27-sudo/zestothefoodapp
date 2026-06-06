import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, X, Plus, Key } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'

export const CreateOrJoin: React.FC = () => {
  const { startCreateRoom, startJoinRoom, closeFlow } = useRoomStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-2xl bg-[#FFFFFF] border border-[#ECE6DD] rounded-[28px] p-8 md:p-10 relative z-10 text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-md"
    >
      {/* Close button */}
      <button 
        onClick={closeFlow}
        className="absolute top-6 right-6 p-2 bg-[#F4EFE8] border border-[#ECE6DD] hover:bg-[#ECE6DD] rounded-full text-[#6D6D6D] hover:text-[#1E1E1E] transition-all cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Heading - Left Column */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="md:col-span-5 space-y-3"
      >
        <span className="text-[#FF7A30] text-[9px] font-black uppercase tracking-widest block">
          Welcome to Zesto
        </span>
        <h1 className="text-3xl font-bold font-display tracking-tight text-[#1E1E1E] leading-tight">
          Decide faster.<br/>Eat together.
        </h1>
        <p className="text-[#6D6D6D] text-xs font-semibold leading-relaxed uppercase tracking-wider">
          Coordinate dining with friends, pick menu dishes, and split invoices without the friction.
        </p>
      </motion.div>

      {/* Options - Right Column */}
      <div className="md:col-span-7 flex flex-col gap-4">
        {/* Create Room */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 100, damping: 15 }}
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={startCreateRoom}
          className="group w-full p-6 bg-[#FFFFFF] border border-[#ECE6DD] hover:border-[#FF7A30]/40 rounded-2xl text-left transition-colors duration-200 cursor-pointer hover:bg-[#FAF7F2] shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#ECE6DD] flex items-center justify-center text-[#FF7A30] shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1E1E1E] flex items-center gap-1.5">
                Create food room
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#FF7A30]" />
              </h3>
              <p className="text-xs text-[#8B8B8B] font-semibold leading-normal uppercase tracking-wider">
                Start a room, select menu cuisines, and invite friends.
              </p>
            </div>
          </div>
        </motion.button>

        {/* Join Room */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, type: 'spring', stiffness: 100, damping: 15 }}
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={startJoinRoom}
          className="group w-full p-6 bg-[#FFFFFF] border border-[#ECE6DD] hover:border-[#FF7A30]/40 rounded-2xl text-left transition-colors duration-200 cursor-pointer hover:bg-[#FAF7F2] shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#ECE6DD] flex items-center justify-center text-[#FF7A30] shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1E1E1E] flex items-center gap-1.5">
                Join active room
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#FF7A30]" />
              </h3>
              <p className="text-xs text-[#8B8B8B] font-semibold leading-normal uppercase tracking-wider">
                Enter an invitation code to sync with your squad.
              </p>
            </div>
          </div>
        </motion.button>
      </div>

    </motion.div>
  )
}

export default CreateOrJoin
