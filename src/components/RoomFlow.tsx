import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, X } from 'lucide-react'
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
import { Profile } from '../pages/Profile'

export const RoomFlow: React.FC = () => {
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { 
    screen, 
    joinRoom,
    chatMessages, 
    chatDrawerOpen, 
    isFriendTyping, 
    unreadChatCount, 
    sendChatMessage, 
    toggleChatDrawer, 
    members 
  } = useRoomStore()

  // Listen for invite link in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('room')
    if (code && screen === 'landing') {
      joinRoom(code)
    }
  }, [screen, joinRoom])

  // Automatically scroll chat to bottom
  useEffect(() => {
    if (chatDrawerOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, chatDrawerOpen, isFriendTyping])

  if (screen === 'landing') return null

  // Page transitions
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    sendChatMessage(inputText.trim())
    setInputText('')
  }

  const handleSendSuggestion = (phrase: string) => {
    sendChatMessage(phrase)
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
          {screen === 'profile' && <Profile />}
        </motion.div>

        {/* FLOATING CHAT WIDGET LAUNCHER */}
        {['lobby', 'food_selection', 'voting_round'].includes(screen) && (
          <button
            onClick={() => toggleChatDrawer()}
            className="fixed bottom-6 right-6 z-40 p-4 bg-[#FF7A30] hover:bg-[#FF8C42] text-white rounded-full shadow-lg hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center transition-all border-2 border-white"
          >
            <MessageSquare className="w-6 h-6 text-white" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </button>
        )}

        {/* GROUP CHAT DRAWER */}
        <AnimatePresence>
          {chatDrawerOpen && (
            <>
              {/* Drawer Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                onClick={() => toggleChatDrawer(false)}
                className="fixed inset-0 bg-black z-[60]"
              />
              
              {/* Drawer Content */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[#ECE6DD] shadow-2xl z-[70] flex flex-col justify-between overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-4 border-b border-[#ECE6DD] flex justify-between items-center bg-[#FAF7F2]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FF7A30]/10 border border-[#FF7A30]/20 flex items-center justify-center text-[#FF7A30]">
                      <MessageSquare className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-[#1E1E1E] leading-none">Food Squad Chat</h3>
                      <span className="text-[9px] text-[#8B8B8B] font-bold block mt-1 uppercase tracking-wider">
                        {members.length} members online
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleChatDrawer(false)}
                    className="p-1.5 rounded-full hover:bg-[#ECE6DD]/40 text-[#6D6D6D] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Message list area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
                  {chatMessages.map((msg) => {
                    if (msg.isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <span className="bg-[#FAF7F2] border border-[#ECE6DD] text-[9.5px] font-bold text-[#6D6D6D] px-3 py-1 rounded-full uppercase tracking-wider text-center max-w-[85%]">
                            {msg.text}
                          </span>
                        </div>
                      )
                    }
                    
                    const isMe = msg.senderId === 'user'
                    
                    return (
                      <div key={msg.id} className={`flex gap-3 items-start ${isMe ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full text-xs font-bold text-white uppercase flex items-center justify-center shrink-0 ${msg.avatarColor}`}>
                          {msg.senderName.charAt(0)}
                        </div>
                        
                        {/* Message content */}
                        <div className="max-w-[70%] text-left">
                          <span className="text-[9.5px] text-[#8B8B8B] font-bold block mb-0.5 pl-1">{msg.senderName}</span>
                          {msg.text && (
                            <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                              isMe 
                                ? 'bg-[#FF7A30] text-white rounded-tr-none shadow-sm' 
                                : 'bg-[#FAF7F2] text-[#1E1E1E] border border-[#ECE6DD] rounded-tl-none shadow-sm'
                            }`}>
                              {msg.text}
                            </div>
                          )}
                          
                          {msg.sticker && (
                            <div className="bg-amber-50/40 border border-amber-100/50 p-2.5 rounded-2xl text-xs font-black text-[#FF7A30] shadow-[0_2px_8px_rgba(0,0,0,0.01)] inline-block mt-0.5 animate-bounce">
                              {msg.sticker}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Typing Indicator */}
                  {isFriendTyping && (
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-[#ECE6DD] text-[#6D6D6D] flex items-center justify-center font-bold text-xs uppercase animate-pulse">
                        ...
                      </div>
                      <div className="bg-[#FAF7F2] border border-[#ECE6DD] py-2 px-4 rounded-full text-[10px] font-bold text-[#6D6D6D] flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-[#6D6D6D] rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-[#6D6D6D] rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-[#6D6D6D] rounded-full animate-bounce [animation-delay:0.4s]" />
                        <span className="ml-1 truncate max-w-[120px]">{isFriendTyping}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Footer Controls & Suggestions */}
                <div className="p-4 border-t border-[#ECE6DD] bg-[#FAF7F2] flex flex-col gap-3">
                  
                  {/* Suggestions Carousel */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none select-none shrink-0">
                    {[
                      "Bro order this! 🤤",
                      "Skip this one ❌",
                      "Too expensive 💸",
                      "I'm fine with anything 🍕"
                    ].map((phrase, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendSuggestion(phrase)}
                        className="px-3 py-1.5 bg-white border border-[#ECE6DD] rounded-xl text-[10px] font-bold text-[#6D6D6D] hover:text-[#1E1E1E] hover:border-[#FF7A30]/30 transition-colors shrink-0 cursor-pointer shadow-sm"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>

                  {/* Sticker Pack Grid */}
                  <div className="border-t border-[#ECE6DD]/60 pt-2.5">
                    <span className="text-[8.5px] text-[#8B8B8B] font-black uppercase tracking-wider block mb-2 text-left">Food Meme Stickers</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        '🍗 "Order this"',
                        '🔥 "Must try"',
                        '🤤 "Tasty"',
                        '😭 "Expensive"',
                        '😤 "Stop it"',
                        '😂 "Anything"',
                        '🍽 "Hungry"',
                        '🍕 "Pizza time"'
                      ].map((sticker) => (
                        <button
                          key={sticker}
                          type="button"
                          onClick={() => sendChatMessage(undefined, sticker)}
                          className="py-1.5 px-2 bg-white hover:bg-amber-50/30 border border-[#ECE6DD] hover:border-[#FF7A30]/30 rounded-lg text-[9.5px] font-black text-[#FF7A30] transition-colors cursor-pointer text-center truncate shadow-sm"
                        >
                          {sticker.split(' ')[0]} {sticker.split('"')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Form Box */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-[#ECE6DD]/60 pt-3 mt-1">
                    <input
                      type="text"
                      placeholder="Message your squad..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#ECE6DD] text-[#1E1E1E] font-bold text-xs focus:outline-none focus:border-[#FF7A30] placeholder:opacity-45"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-2.5 bg-[#FF7A30] disabled:bg-[#ECE6DD] disabled:text-[#8B8B8B] text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm border-none shrink-0"
                    >
                      <Send className="w-4.5 h-4.5 text-white" />
                    </button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </AnimatePresence>
  )
}

export default RoomFlow
