import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, User } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import { Button } from '../components/ui/Button'

export const NameCollection: React.FC = () => {
  const { 
    setGuestName, 
    setScreen,
    onboardingNextScreen,
    pendingRoomCode,
    joinRoom
  } = useRoomStore()

  const [name, setName] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [showError, setShowError] = useState(false)

  // Validate Name: min 2 characters, and not numbers-only
  useEffect(() => {
    if (name.trim().length === 0) {
      setIsValid(false)
      setShowError(false)
      return
    }

    const hasMinLength = name.trim().length >= 2
    const isNotNumbersOnly = /[a-zA-Z]/.test(name)

    const valid = hasMinLength && isNotNumbersOnly
    setIsValid(valid)
    setShowError(!valid)
  }, [name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    const trimmedName = name.trim()
    setGuestName(trimmedName)

    // Route to original target screen
    if (onboardingNextScreen === 'create_room') {
      setScreen('create_room')
    } else if (onboardingNextScreen === 'join_room') {
      if (pendingRoomCode) {
        await joinRoom(pendingRoomCode)
      } else {
        setScreen('join_room')
      }
    } else {
      setScreen('landing')
    }
  }

  // Derive dynamic initials from name input
  const initials = name.trim()
    ? name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : ''

  // Fun list of food emojis for the empty state
  const foodEmojis = ['🍕', '🍔', '🌮', '🍜', '🥟', '🍱', '🍩']
  const [emptyEmoji, setEmptyEmoji] = useState('🍕')

  useEffect(() => {
    if (!name.trim()) {
      const interval = setInterval(() => {
        setEmptyEmoji(prev => {
          const nextIndex = (foodEmojis.indexOf(prev) + 1) % foodEmojis.length
          return foodEmojis[nextIndex]
        })
      }, 2500)
      return () => clearInterval(interval)
    }
  }, [name])

  return (
    <div className="w-full max-w-lg mx-auto flex items-center justify-center p-4 min-h-[75vh]">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.35, type: 'spring', stiffness: 90, damping: 15 }}
        className="w-full bg-[#FFFFFF] border border-[#ECE6DD] rounded-[32px] p-10 md:p-12 relative z-10 text-left shadow-[0_15px_40px_rgba(0,0,0,0.02)] select-none overflow-hidden"
      >
        {/* Soft background visual flares inside card */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-[#FF7A30]/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />

        {/* Back button */}
        <button 
          onClick={() => setScreen('welcome')}
          className="absolute top-8 left-8 p-2.5 bg-[#FAF7F2] border border-[#ECE6DD] hover:bg-[#ECE6DD] rounded-full text-[#6D6D6D] hover:text-[#1E1E1E] transition-all cursor-pointer shadow-sm z-20"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-10 pt-8">
          
          {/* Creative Live Avatar Preview */}
          <div className="relative mb-6">
            <motion.div
              key={initials ? 'initials' : 'emoji'}
              initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md border-4 border-white ${
                initials 
                  ? 'bg-gradient-to-tr from-[#FF7A30] to-[#FF8C42]' 
                  : 'bg-[#FAF7F2] border-[#ECE6DD]'
              }`}
            >
              {initials ? (
                <span>{initials}</span>
              ) : (
                <motion.span 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="text-3xl select-none"
                >
                  {emptyEmoji}
                </motion.span>
              )}
            </motion.div>
            
            {/* Soft decorative shadow element */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-2 bg-[#1E1E1E]/5 rounded-full blur-sm -z-10" />
          </div>

          <h1 className="text-xl md:text-2xl font-black font-display tracking-tight text-[#1E1E1E] mb-2 leading-tight">
            What should friends call you?
          </h1>
          <p className="text-xs text-[#6D6D6D] font-semibold max-w-xs leading-normal">
            This name will appear in rooms and voting.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="text-left">
            <label className="text-xs font-bold text-[#1E1E1E] mb-2 block">Your Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#6D6D6D]">
                <User className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="Ex: Rohit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-4 py-3.5 bg-[#FAF7F2] border border-[#ECE6DD] rounded-2xl text-sm font-semibold text-[#1E1E1E] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] transition-all duration-300 focus:shadow-[0_0_12px_rgba(255,122,48,0.12)]"
              />
            </div>
            
            {/* Validations and Cues */}
            {showError && (
              <motion.span 
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-bold text-rose-500 mt-2 block text-left"
              >
                Please enter a valid name.
              </motion.span>
            )}
            <span className="text-[9.5px] text-[#6D6D6D] font-bold uppercase tracking-wider mt-2.5 block text-left">
              A name helps friends know who joined.
            </span>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValid}
            className="w-full justify-center group cursor-pointer text-white bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] border-none shadow-md font-bold py-4 rounded-full"
          >
            Continue
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>

        </form>

      </motion.div>

    </div>
  )
}
export default NameCollection
