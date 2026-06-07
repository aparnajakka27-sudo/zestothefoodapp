import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Compass, AlertCircle, ArrowLeft } from 'lucide-react'
import { useLocation } from '../hooks/useLocation'

interface LocationPermissionProps {
  onManualClick: () => void
  onPermissionGranted: (area: string, lat: number, lon: number) => void
}

export const LocationPermission: React.FC<LocationPermissionProps> = ({
  onManualClick,
  onPermissionGranted
}) => {
  const { requestGPSLocation, isLoading, error } = useLocation()
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualArea, setManualArea] = useState('')

  const handleRequestGPS = async () => {
    const res = await requestGPSLocation()
    if (res.latitude && res.longitude && res.areaName) {
      onPermissionGranted(res.areaName, res.latitude, res.longitude)
    } else {
      setShowManualInput(true)
    }
  }

  const handleManualConfirm = () => {
    if (manualArea.trim()) {
      // Use fallback default coordinates (Hyderabad center)
      onPermissionGranted(manualArea.trim(), 17.4483, 78.3741)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 180 }}
      className="w-full p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[#1E1E1E] dark:text-white flex flex-col gap-3.5 relative overflow-hidden shadow-xl"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes radar-ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .animate-radar {
          animation: radar-ping 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }
      `}} />

      {/* Sleek top orange accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF7A30] to-[#FF8C42]" />

      {!showManualInput ? (
        <>
          <div className="flex items-center gap-3 text-left">
            {/* Pulsing Radar Geolocation Icon */}
            <div className="relative w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/50 dark:border-orange-900/30 flex items-center justify-center text-[#FF7A30] shrink-0">
              <span className="absolute inset-0 rounded-xl bg-[#FF7A30]/20 animate-radar pointer-events-none" />
              <span className="absolute inset-0 rounded-xl bg-[#FF7A30]/10 animate-radar pointer-events-none [animation-delay:0.7s]" />
              <MapPin className="w-5 h-5 relative z-10" />
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1E1E1E] dark:text-white flex items-center gap-1.5">
                📍 Enable Location
              </h3>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold leading-normal uppercase tracking-wide truncate">
                Find nearby food spots automatically
              </p>
            </div>
          </div>

          <p className="text-[10.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 text-left font-medium border-t border-b border-neutral-100/50 dark:border-neutral-800/40 py-2">
            Allow location access to match cuisines and find the perfect dining midpoint for your squad.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 rounded-xl text-[#E85D5D] dark:text-rose-400 text-[10px] font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#E85D5D] dark:text-rose-400" />
              <span className="leading-snug text-left">{error}</span>
            </motion.div>
          )}

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.015, boxShadow: '0 4px 12px -3px rgba(255, 122, 48, 0.3)' }}
              whileTap={{ scale: 0.985 }}
              onClick={handleRequestGPS}
              disabled={isLoading}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5 border-none transition-all font-sans"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" />
                  Allow Location
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(0,0,0,0.02)' }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowManualInput(true)}
              disabled={isLoading}
              className="py-2.5 px-4 bg-transparent border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-xl text-[9.5px] font-black uppercase tracking-widest cursor-pointer transition-colors"
            >
              Manual
            </motion.button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 border-b border-neutral-100/50 dark:border-neutral-800/40 pb-2 text-left">
            <button
              onClick={() => {
                setShowManualInput(false)
                onManualClick()
              }}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[#6D6D6D] dark:text-neutral-400 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[9.5px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Manual Location Entry
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Enter your City / Area</label>
            <input
              type="text"
              placeholder="Ex: Madhapur, Hyderabad"
              value={manualArea}
              onChange={(e) => setManualArea(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[#1E1E1E] dark:text-white font-bold text-xs focus:outline-none focus:border-[#FF7A30] transition-colors"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={handleManualConfirm}
            disabled={!manualArea.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest cursor-pointer border-none transition-all disabled:opacity-50 font-sans"
          >
            Confirm Location
          </motion.button>
        </>
      )}
    </motion.div>
  )
}
