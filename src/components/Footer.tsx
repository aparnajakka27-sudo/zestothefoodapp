import React from 'react'
import { Button } from './ui/Button'
import { Plus, Users, ArrowUpRight } from 'lucide-react'
import { ZestoLogo } from './ZestoLogo'
import { useRoomStore } from '../lib/roomStore'

export const Footer: React.FC = () => {
  const openSelector = useRoomStore((state) => state.openSelector)

  return (
    <footer className="relative bg-[#FAF7F2] pt-24 pb-12 px-6 border-t border-[#ECE6DD] overflow-hidden">
      
      {/* Glow highlight behind CTA */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF7A30] opacity-[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Final CTA Box */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <span className="text-4xl mb-4 select-none animate-bounce">🍜</span>
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-[#1E1E1E] mb-6">
            Ready to stop arguing?
          </h2>
          <p className="text-lg text-[#6D6D6D] font-semibold max-w-lg mb-10 leading-relaxed">
            Create a private session code in 3 seconds. Invite your friends and get eating. Free, fast, and no account needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button onClick={openSelector} variant="primary" size="lg" className="group cursor-pointer">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Create Room
            </Button>
            <Button onClick={openSelector} variant="glass" size="lg" className="group cursor-pointer">
              <Users className="w-5 h-5 text-[#6D6D6D] group-hover:text-[#FF7A30] transition-colors" />
              Join with Code
            </Button>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-[#ECE6DD] pb-12 text-left">
          
          <div>
            <span className="text-2xl font-black font-display tracking-tight text-[#1E1E1E] flex items-center gap-1.5 mb-6">
              <ZestoLogo className="w-8 h-8" />
              Zesto
            </span>
            <p className="text-xs text-[#6D6D6D] leading-relaxed font-semibold">
              Decide where to eat together.<br />
              Premium Gen Z food-tech social platform.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#1E1E1E] uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2 text-xs text-[#6D6D6D] font-semibold">
              <li><a href="#how-it-works" className="hover:text-[#FF7A30] transition-colors">How it Works</a></li>
              <li><a href="#demo" className="hover:text-[#FF7A30] transition-colors">Live Demo</a></li>
              <li><a href="#features" className="hover:text-[#FF7A30] transition-colors">Features</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#1E1E1E] uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2 text-xs text-[#6D6D6D] font-semibold">
              <li><a href="#" className="hover:text-[#FF7A30] transition-colors flex items-center gap-1">Docs <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="#" className="hover:text-[#FF7A30] transition-colors flex items-center gap-1">Privacy <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="#" className="hover:text-[#FF7A30] transition-colors flex items-center gap-1">Terms <ArrowUpRight className="w-3 h-3" /></a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#1E1E1E] uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2 text-xs text-[#6D6D6D] font-semibold">
              <li><a href="#" className="hover:text-[#FF7A30] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#FF7A30] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#FF7A30] transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and taglines */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#ECE6DD] text-[10px] text-[#6D6D6D]/60 font-bold uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} Zesto Inc. All rights reserved.</span>
          <span className="mt-2 sm:mt-0">Made for foodies everywhere 🍊</span>
        </div>

      </div>
    </footer>
  )
}
