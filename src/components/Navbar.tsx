import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from './ui/Button'
import { ZestoLogo } from './ZestoLogo'
import { useRoomStore } from '../lib/roomStore'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const openSelector = useRoomStore((state) => state.openSelector)
  const user = useRoomStore((state) => state.user)
  const guestName = useRoomStore((state) => state.guestName)
  const signOut = useRoomStore((state) => state.signOut)
  const setScreen = useRoomStore((state) => state.setScreen)

  const menuItems = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Live Demo', href: '#demo' },
    { name: 'Features', href: '#features' },
    { name: 'Match Story', href: '#match-story' },
  ]

  return (
    <>
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
      >
        <nav className="w-full max-w-5xl glass-card rounded-full px-6 py-3.5 flex items-center justify-between pointer-events-auto relative shadow-sm border-[#ECE6DD]">
          
          {/* Glass glare effect inside navbar */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group select-none relative z-10">
            <ZestoLogo className="w-8 h-8 group-hover:scale-105 transition-transform duration-300" />
            <span className="text-xl font-black font-display tracking-tight text-[#1E1E1E] ml-1">
              Zesto
            </span>
            <span className="hidden lg:inline-block h-4 w-px bg-[#ECE6DD] mx-2" />
            <span className="hidden lg:inline-block text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider">
              Decide where to eat together
            </span>
          </a>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-8 relative z-10">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#6D6D6D] hover:text-[#1E1E1E] text-xs font-semibold tracking-wide uppercase transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4 relative z-10">
            {user || guestName ? (
              <div className="relative group">
                <button className="flex items-center gap-2 cursor-pointer focus:outline-none">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-[#FF7A30] object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FF7A30] text-white flex items-center justify-center font-bold text-xs uppercase">
                      {(user?.name || guestName || '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <span className="text-[#1E1E1E] text-xs font-bold hidden lg:inline-block max-w-[100px] truncate">
                    {user?.name || `${guestName} (Guest)`}
                  </span>
                </button>
                
                {/* Dropdown Menu on hover/click */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#ECE6DD] rounded-2xl shadow-md p-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="px-2 py-1.5 border-b border-[#ECE6DD] mb-1.5 text-left">
                    <p className="text-[#1E1E1E] text-xs font-bold truncate">{user?.name || guestName}</p>
                    <p className="text-[#6D6D6D] text-[10px] truncate">{user?.email || 'Quick Start Session'}</p>
                  </div>
                  <button onClick={() => setScreen('profile')} className="w-full text-left px-2 py-1.5 text-xs text-[#1E1E1E] hover:bg-[#FAF7F2] rounded-lg font-semibold cursor-pointer transition-colors mb-1">
                    My Profile
                  </button>
                  {guestName && !user && (
                    <button onClick={() => setScreen('login')} className="w-full text-left px-2 py-1.5 text-xs text-[#FF7A30] hover:bg-[#FF7A30]/5 rounded-lg font-semibold cursor-pointer transition-colors mb-1">
                      Sign In to Save Data
                    </button>
                  )}
                  <button onClick={signOut} className="w-full text-left px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold cursor-pointer transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setScreen('login')} variant="ghost" size="sm" className="text-[#6D6D6D] hover:text-[#1E1E1E] text-xs py-1.5 font-bold">
                Sign In
              </Button>
            )}
            <Button onClick={openSelector} variant="primary" size="sm" className="group text-xs py-1.5 px-4 cursor-pointer font-bold text-white bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] border-none shadow-sm">
              Get Started <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#6D6D6D] hover:text-[#1E1E1E] relative z-10"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </nav>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-6 top-24 z-40 glass-card rounded-3xl p-6 md:hidden border border-[#ECE6DD] shadow-md"
          >
            <div className="flex flex-col gap-5">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[#6D6D6D] hover:text-[#1E1E1E] text-base font-bold py-2 border-b border-[#ECE6DD]"
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-2">
                {user || guestName ? (
                  <div className="flex flex-col gap-2 p-3 bg-[#FAF7F2] border border-[#ECE6DD] rounded-2xl">
                    <div className="flex items-center gap-3">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full border border-[#FF7A30] object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#FF7A30] text-white flex items-center justify-center font-bold text-sm uppercase">
                          {(user?.name || guestName || '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-[#1E1E1E] text-sm font-bold truncate leading-tight">{user?.name || `${guestName} (Guest)`}</p>
                        <p className="text-[#6D6D6D] text-[10px] truncate leading-tight">{user?.email || 'Quick Start Session'}</p>
                      </div>
                    </div>
                    <button onClick={() => { setIsOpen(false); setScreen('profile'); }} className="w-full text-center mt-1.5 py-1.5 text-xs text-[#1E1E1E] hover:bg-[#FAF7F2] rounded-xl font-bold border border-[#ECE6DD] cursor-pointer bg-white transition-colors">
                      My Profile
                    </button>
                    {guestName && !user && (
                      <button onClick={() => { setIsOpen(false); setScreen('login'); }} className="w-full text-center mt-1 py-1.5 text-xs text-[#FF7A30] hover:bg-[#FF7A30]/5 rounded-xl font-bold border border-[#FF7A30]/20 cursor-pointer bg-white transition-colors">
                        Sign In to Save Data
                      </button>
                    )}
                    <button onClick={() => { setIsOpen(false); signOut(); }} className="w-full text-center mt-2 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold border border-rose-100 cursor-pointer transition-colors bg-white">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Button onClick={() => { setIsOpen(false); setScreen('login'); }} variant="glass" size="md" className="w-full justify-center text-[#1E1E1E] border-[#ECE6DD]">
                    Sign In
                  </Button>
                )}
                <Button onClick={() => { setIsOpen(false); openSelector(); }} variant="primary" size="md" className="w-full justify-center group cursor-pointer text-white bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] border-none shadow-sm font-bold">
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
