import React from 'react'
import { motion } from 'framer-motion'
import { Card } from './ui/Card'
import { Sparkles, Share2, Vote, Flame } from 'lucide-react'

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Create a Room",
      description: "Tap 'Create Room' to spin up a session instantly. No sign-up or tedious setup required to get started.",
      icon: <Sparkles className="w-6 h-6 text-[#FF7A30]" />,
      color: "from-orange-500/10 to-transparent"
    },
    {
      number: "02",
      title: "Invite the Crew",
      description: "Copy the 6-digit session code. Friends join with a single click, popping onto your live online user lobby.",
      icon: <Share2 className="w-6 h-6 text-indigo-500" />,
      color: "from-indigo-500/10 to-transparent"
    },
    {
      number: "03",
      title: "Swipe & Cast Votes",
      description: "Browse curated restaurants. Swipe right to vote yes, left to pass, or drop your one Veto to kill a choice completely.",
      icon: <Vote className="w-6 h-6 text-rose-500" />,
      color: "from-rose-500/10 to-transparent"
    },
    {
      number: "04",
      title: "Instant Match Found",
      description: "When the group converges on a spot, the screen flashes. Grab details, get directions, and start eating.",
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      color: "from-amber-500/10 to-transparent"
    }
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  }

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 px-6 bg-[#FAF7F2] overflow-hidden">
      
      {/* Background visual accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF7A30]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#FF7A30] text-xs font-black tracking-widest uppercase mb-3 block">Process</span>
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-[#1E1E1E] mb-6">
            How Zesto works
          </h2>
          <p className="text-lg text-[#6D6D6D] font-medium">
            Deciding where to eat shouldn't be a part-time job. We streamlined the group discussion down to four simple, satisfying steps.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full flex flex-col justify-between p-8 hoverable relative group">
                
                {/* Glowing border card element */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10`} />

                <div>
                  <div className="flex items-center justify-between mb-8">
                    {/* Step Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DD] flex items-center justify-center">
                      {step.icon}
                    </div>
                    {/* Step number label */}
                    <span className="text-3xl font-black font-display text-[#ECE6DD] select-none group-hover:text-[#FF7A30]/20 transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-[#1E1E1E] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#6D6D6D] leading-relaxed font-semibold">
                    {step.description}
                  </p>
                </div>
                
                {/* Step hover connector line */}
                <div className="w-full h-0.5 bg-[#ECE6DD] group-hover:bg-[#FF7A30]/20 transition-colors duration-300 mt-8 rounded-full" />
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
