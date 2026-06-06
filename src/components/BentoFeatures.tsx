import React from 'react'
import { Card } from './ui/Card'
import { Shield, Zap, Receipt, Flame } from 'lucide-react'

export const BentoFeatures: React.FC = () => {
  return (
    <section id="features" className="py-24 md:py-32 px-6 bg-[#FAF7F2] grid-bg relative">
      
      {/* Visual top and bottom gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[#ECE6DD] to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[#ECE6DD] to-transparent" />

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Header */}
        <div className="max-w-3xl mb-20 text-center md:text-left">
          <span className="text-[#FF7A30] text-xs font-black tracking-widest uppercase mb-3 block">Product Capabilities</span>
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-[#1E1E1E] mb-6">
            Intentionally built to solve food arguments
          </h2>
          <p className="text-lg text-[#6D6D6D] font-medium max-w-xl">
            We skipped the enterprise bloat. Zesto is optimized for speed, fun, and getting your friend group fed.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1: Real-time Subscriptions (Col span 2) */}
          <div className="md:col-span-2">
            <Card className="h-full flex flex-col justify-between p-8 hoverable min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FF7A30]/10 border border-[#FF7A30]/20 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-[#FF7A30]" />
                </div>
                <h3 className="text-2xl font-black font-display text-[#1E1E1E] mb-3">Supabase Realtime Sync</h3>
                <p className="text-sm text-[#6D6D6D] leading-relaxed font-semibold max-w-md">
                  Powered by Supabase PostgreSQL WebSockets. See votes, vetoes, and active room members instantly. Watch the group status update in milliseconds without lag.
                </p>
              </div>
              
              {/* Graphical illustration */}
              <div className="flex items-center gap-2 mt-8 bg-[#FAF7F2] border border-[#ECE6DD] px-4 py-2.5 rounded-full self-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs text-[#6D6D6D] font-bold">12ms Latency connected to postgres-db</span>
              </div>
            </Card>
          </div>

          {/* Box 2: Veto Rule (Col span 1) */}
          <div className="md:col-span-1">
            <Card className="h-full flex flex-col justify-between p-8 hoverable min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                  <Flame className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-2xl font-black font-display text-[#1E1E1E] mb-3">The Single Veto Rule</h3>
                <p className="text-sm text-[#6D6D6D] leading-relaxed font-semibold">
                  Every user gets exactly one veto per session. Use it to immediately eliminate a restaurant you absolutely hate, preventing stalemates.
                </p>
              </div>
              <span className="text-xs font-black uppercase text-[#FF7A30] tracking-widest mt-8 block">
                Rule: Overrides all yes votes
              </span>
            </Card>
          </div>

          {/* Box 3: Smart Splitting (Col span 1) */}
          <div className="md:col-span-1">
            <Card className="h-full flex flex-col justify-between p-8 hoverable min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FF7A30]/10 border border-[#FF7A30]/20 flex items-center justify-center mb-6">
                  <Receipt className="w-6 h-6 text-[#FF7A30]" />
                </div>
                <h3 className="text-2xl font-black font-display text-[#1E1E1E] mb-3">Smart Bill Splitter</h3>
                <p className="text-sm text-[#6D6D6D] leading-relaxed font-semibold">
                  No more messy math after the meal. Estimate, calculate, and split bills among the group directly inside Zesto before ordering.
                </p>
              </div>
              <span className="text-xs font-black uppercase text-[#FF7A30] tracking-widest mt-8 block">
                Integration: Splitwise compatible
              </span>
            </Card>
          </div>

          {/* Box 4: Security & RLS (Col span 2) */}
          <div className="md:col-span-2">
            <Card className="h-full flex flex-col justify-between p-8 hoverable min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-[#4CAF50]" />
                </div>
                <h3 className="text-2xl font-black font-display text-[#1E1E1E] mb-3">Row Level Security (RLS)</h3>
                <p className="text-sm text-[#6D6D6D] leading-relaxed font-semibold max-w-lg">
                  Every voting room operates inside isolated Postgres schemas protected by Supabase Row Level Security policies. Your group's restaurant choices and votes stay completely private and auto-expire after 24 hours.
                </p>
              </div>
              
              {/* Policy tag list */}
              <div className="flex flex-wrap gap-2 mt-8">
                <span className="text-[10px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 border border-[#4CAF50]/20 px-3 py-1 rounded-full">
                  auth.uid() Verified
                </span>
                <span className="text-[10px] font-bold text-[#6D6D6D] bg-[#FAF7F2] border border-[#ECE6DD] px-3 py-1 rounded-full">
                  Auto-Cleanup (Cron Job)
                </span>
                <span className="text-[10px] font-bold text-[#6D6D6D] bg-[#FAF7F2] border border-[#ECE6DD] px-3 py-1 rounded-full">
                  SSL Encrypted
                </span>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </section>
  )
}
