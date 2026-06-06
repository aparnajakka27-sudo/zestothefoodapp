import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRoomStore } from '../lib/roomStore'

// Pages
import { CreateOrJoin } from '../pages/CreateOrJoin'
import { CreateRoom } from '../pages/CreateRoom'
import { RestaurantChoice } from '../pages/RestaurantChoice'
import { JoinRoom } from '../pages/JoinRoom'
import { Lobby } from '../pages/Lobby'
import { FoodSelection } from '../pages/FoodSelection'
import { VotingRound } from '../pages/VotingRound'
import { OrderSummary } from '../pages/OrderSummary'
import { FinalPlan } from '../pages/FinalPlan'
import { Login } from '../pages/Login'
import { Signup } from '../pages/Signup'
import { ForgotPassword } from '../pages/ForgotPassword'
import { Welcome } from '../pages/Welcome'
import { NameCollection } from '../pages/NameCollection'

export const RoomFlow: React.FC = () => {
  const { screen, joinRoom } = useRoomStore()

  // Listen for invite link in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('room')
    if (code && screen === 'landing') {
      joinRoom(code)
    }
  }, [screen, joinRoom])

  if (screen === 'landing') return null

  // Page transitions: fade + slight blur as requested by the user
  const pageVariants = {
    initial: {
      opacity: 0,
      filter: 'blur(4px)',
      scale: 0.99
    },
    animate: {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.25,
        ease: 'easeOut' as const
      }
    },
    exit: {
      opacity: 0,
      filter: 'blur(4px)',
      scale: 0.99,
      transition: {
        duration: 0.2,
        ease: 'easeIn' as const
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-[#FAF7F2] flex justify-center items-start py-8 px-4 select-none text-[#1E1E1E]">
        
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-[#FF7A30]/5 via-transparent to-transparent opacity-40 pointer-events-none" />

        <motion.div
          key={screen}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full flex justify-center items-start my-auto relative z-10"
        >
          {screen === 'selector' && <CreateOrJoin />}
          {screen === 'create_room' && <CreateRoom />}
          {screen === 'restaurant_choice' && <RestaurantChoice />}
          {screen === 'join_room' && <JoinRoom />}
          {screen === 'lobby' && <Lobby />}
          {screen === 'food_selection' && <FoodSelection />}
          {screen === 'voting_round' && <VotingRound />}
          {screen === 'order_summary' && <OrderSummary />}
          {screen === 'final_plan' && <FinalPlan />}
          {screen === 'login' && <Login />}
          {screen === 'signup' && <Signup />}
          {screen === 'forgot_password' && <ForgotPassword />}
          {screen === 'welcome' && <Welcome />}
          {screen === 'name_collection' && <NameCollection />}
        </motion.div>

      </div>
    </AnimatePresence>
  )
}

export default RoomFlow
