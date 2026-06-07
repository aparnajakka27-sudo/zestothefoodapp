import React, { useEffect, useState } from 'react'
import { MapPin, Compass, Loader2, Search, CheckCircle2 } from 'lucide-react'

interface RestaurantLoaderProps {
  stage: 'gps' | 'nominatim' | 'overpass' | 'filtering' | 'complete'
}

export const RestaurantLoader: React.FC<RestaurantLoaderProps> = ({ stage }) => {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    switch (stage) {
      case 'gps':
        setActiveStep(0)
        break
      case 'nominatim':
        setActiveStep(1)
        break
      case 'overpass':
        setActiveStep(2)
        break
      case 'filtering':
        setActiveStep(3)
        break
      case 'complete':
        setActiveStep(4)
        break
    }
  }, [stage])

  const steps = [
    { label: 'Acquiring GPS coordinates...', icon: Compass },
    { label: 'Converting to area name...', icon: MapPin },
    { label: 'Searching OpenStreetMap Overpass API...', icon: Search },
    { label: 'Cross-referencing preferences...', icon: Loader2 }
  ]

  return (
    <div className="w-full flex flex-col gap-6 text-[#1E1E1E]">
      {/* Visual Loading Cards */}
      <div 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(236, 230, 221, 0.6)',
          boxShadow: '0 10px 30px -10px rgba(120, 70, 40, 0.08)'
        }}
        className="w-full p-6 md:p-8 rounded-3xl border flex flex-col gap-5 text-left relative overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-[#ECE6DD]/40 pb-3">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4.5 h-4.5 text-[#FF7A30] animate-spin" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
              Detecting Local Restaurants
            </span>
          </div>
          <span className="text-[10px] font-black text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            FREE / ₹0 Cost API
          </span>
        </div>

        {/* Steps display list */}
        <div className="space-y-3.5">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const isCompleted = activeStep > idx
            const isActive = activeStep === idx
            
            return (
              <div 
                key={idx}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-50/45 border-emerald-100/50 text-emerald-800' 
                    : isActive 
                      ? 'bg-[#FFF5F0]/60 border-[#FF7A30]/30 text-[#1E1E1E] shadow-sm'
                      : 'bg-white/30 border-transparent text-neutral-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
                    isCompleted
                      ? 'bg-emerald-100/50 border-emerald-200/50 text-emerald-600'
                      : isActive
                        ? 'bg-[#FF7A30]/10 border-[#FF7A30]/20 text-[#FF7A30]'
                        : 'bg-neutral-100/50 border-neutral-200/50 text-neutral-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    ) : (
                      <Icon className={`w-4.5 h-4.5 ${isActive && idx === 0 ? 'animate-spin-slow' : isActive && idx === 3 ? 'animate-spin' : ''}`} />
                    )}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {step.label}
                  </span>
                </div>

                {isActive && (
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-[#FF7A30] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#FF7A30] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#FF7A30] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Skeletons to create professional startup loading aesthetics */}
      <div className="space-y-4">
        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block pl-1">
          Generating nearby match list...
        </span>
        {[1, 2].map((i) => (
          <div 
            key={i} 
            className="w-full bg-white border border-[#ECE6DD]/60 rounded-3xl p-4 flex gap-4 items-center shadow-sm relative overflow-hidden"
          >
            {/* Confetti-like skeleton gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />

            <div className="w-16 h-16 bg-neutral-100 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3 bg-neutral-100 rounded-full w-2/3" />
              <div className="h-2 bg-neutral-50 rounded-full w-1/2" />
              <div className="h-2 bg-neutral-50 rounded-full w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
