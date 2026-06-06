import React from 'react'
import { motion } from 'framer-motion'
import { X, ArrowRight, ShieldCheck, CreditCard, Receipt, Heart } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import { ZestoLogo } from '../components/ZestoLogo'

export const Welcome: React.FC = () => {
  const { 
    signInWithGoogle, 
    setScreen, 
    closeFlow, 
    authLoading,
    onboardingNextScreen,
    pendingRoomCode,
    joinRoom
  } = useRoomStore()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // If user successfully logs in, the store auto-routes to landing.
      // But we should push them to their target destination:
      if (onboardingNextScreen === 'create_room') {
        setScreen('create_room')
      } else if (onboardingNextScreen === 'join_room') {
        if (pendingRoomCode) {
          await joinRoom(pendingRoomCode)
        } else {
          setScreen('join_room')
        }
      }
    } catch (err) {
      console.error('Google Sign In failed', err)
    }
  }

  const handleQuickStart = () => {
    setScreen('name_collection')
  }

  return (
    <div className="w-full max-w-xl mx-auto flex items-center justify-center p-2 md:p-6 min-h-[75vh]">
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full bg-[#FFFFFF] border border-[#ECE6DD] rounded-[28px] p-6 md:p-10 relative z-10 text-center shadow-md select-none"
      >
        
        {/* Close Button */}
        <button 
          onClick={closeFlow}
          className="absolute top-6 right-6 p-2 bg-[#FAF7F2] border border-[#ECE6DD] hover:bg-[#ECE6DD] rounded-full text-[#6D6D6D] hover:text-[#1E1E1E] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 pt-4">
          <ZestoLogo className="w-10 h-10 mb-4 animate-bounce" />
          <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight text-[#1E1E1E] mb-2 leading-none">
            Welcome to Zesto 🍽
          </h1>
          <p className="text-xs md:text-sm text-[#6D6D6D] font-semibold max-w-sm leading-relaxed">
            Plan meals with friends, vote together, and decide what to eat faster.
          </p>
        </div>

        {/* Onboarding Options Container */}
        <div className="space-y-4 mb-8">
          
          {/* OPTION 1: Google Auth */}
          <div className="relative border border-[#ECE6DD] hover:border-[#FF7A30]/40 rounded-[22px] p-5 text-left transition-all duration-300 bg-[#FFFFFF] hover:bg-[#FAF7F2]/30 group">
            
            {/* Recommended Tag */}
            <span className="absolute top-4 right-4 bg-[#FF7A30]/10 text-[#FF7A30] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
              Recommended
            </span>

            <h3 className="text-xs font-black uppercase tracking-widest text-[#FF7A30] mb-2">
              Option 1
            </h3>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#ECE6DD] py-3.5 px-6 rounded-[20px] text-sm font-semibold text-[#1E1E1E] cursor-pointer transition-colors shadow-sm mb-3"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-[#FF7A30]/30 border-t-[#FF7A30] rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </motion.button>
            <p className="text-[10px] text-[#6D6D6D] font-bold uppercase tracking-wider text-center lg:text-left">
              Save rooms, payments, food history, and favorites.
            </p>
          </div>

          {/* OPTION 2: Quick Start */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleQuickStart}
            disabled={authLoading}
            className="w-full border border-[#ECE6DD] hover:border-[#FF7A30]/40 rounded-[22px] p-5 text-left transition-all duration-300 bg-[#FFFFFF] hover:bg-[#FAF7F2]/50 cursor-pointer flex items-center justify-between group"
          >
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#6D6D6D] block">
                Option 2
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1E1E1E]">
                Quick Start
              </h3>
              <p className="text-[10px] text-[#8B8B8B] font-semibold leading-normal uppercase tracking-wider">
                Jump in instantly without signing in.
              </p>
              <p className="text-[9px] text-[#FF7A30] font-bold uppercase tracking-wider">
                Your activity won't be saved after leaving.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#ECE6DD] flex items-center justify-center text-[#6D6D6D] group-hover:text-[#FF7A30] group-hover:border-[#FF7A30]/20 transition-all">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.button>

        </div>

        {/* Why sign in card info */}
        <div className="bg-[#FAF7F2] border border-[#ECE6DD] p-5 rounded-[22px] text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#1E1E1E] mb-2">
            Why sign in?
          </h4>
          <p className="text-[10.5px] text-[#6D6D6D] font-semibold leading-relaxed mb-4">
            Sign in to save your rooms, payment history, bill splits, favorite restaurants, and food activity. Quick Start works instantly, but your data won't be saved after leaving.
          </p>
          
          {/* Quick list specs */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#ECE6DD]/60">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#1E1E1E] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF7A30] shrink-0" />
              <span>🍽 Rooms</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#1E1E1E] uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-[#FF7A30] shrink-0" />
              <span>💳 Payments</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#1E1E1E] uppercase tracking-wider">
              <Receipt className="w-3.5 h-3.5 text-[#FF7A30] shrink-0" />
              <span>🧾 Bill history</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#1E1E1E] uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-[#FF7A30] shrink-0" />
              <span>❤️ Favorites</span>
            </div>
          </div>
        </div>

      </motion.div>

    </div>
  )
}
