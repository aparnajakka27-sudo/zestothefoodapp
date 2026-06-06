import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'

export const JoinRoom: React.FC = () => {
  const { joinRoom, setScreen } = useRoomStore()
  const [inputCode, setInputCode] = useState('')
  const [shakeInput, setShakeInput] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = inputCode.trim().toUpperCase()
    
    // Validate Room Code format
    if (cleaned.length === 6) {
      if (cleaned.startsWith('ZT') && cleaned.endsWith('P')) {
        joinRoom(cleaned)
      } else {
        setErrorMessage('Room not found')
        setShakeInput(true)
        setTimeout(() => {
          setShakeInput(false)
          setErrorMessage(null)
        }, 3000)
      }
    } else {
      setShakeInput(true)
      setErrorMessage('Code must be exactly 6 characters')
      setTimeout(() => {
        setShakeInput(false)
        setErrorMessage(null)
      }, 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-md relative z-10 text-center px-4"
    >
      <div className="bg-[#FFFFFF] border border-[#ECE6DD] rounded-[28px] p-8 shadow-md relative">
        <button 
          onClick={() => setScreen('selector')}
          className="absolute top-6 left-6 p-2 bg-[#F4EFE8] border border-[#ECE6DD] hover:bg-[#ECE6DD] rounded-full text-[#6D6D6D] hover:text-[#1E1E1E] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="mt-8 mb-6">
          <h2 className="text-2xl font-black text-[#1E1E1E] leading-none mb-2">
            Enter room code
          </h2>
          <p className="text-[#6D6D6D] font-medium text-xs">
            Enter the 6-character invitation code (e.g. ZT915P) to join your group lobby.
          </p>
        </div>

        {/* Error alert toast */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1, 1.05, 1], opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-[#E85D5D] text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.input
            animate={shakeInput ? { x: [-10, 10, -10, 10, 0] } : {}}
            type="text"
            placeholder="ZT915P"
            maxLength={6}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full text-center tracking-widest text-3xl font-bold py-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DD] text-[#FF7A30] uppercase focus:outline-none focus:border-[#FF7A30] placeholder:opacity-40 shadow-inner"
          />
          <button 
            type="submit" 
            className="w-full py-3.5 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.01] active:scale-[0.99] text-white border-none text-[11px] font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer font-sans shadow-md"
          >
            Join lobby <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default JoinRoom
