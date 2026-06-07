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
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#ECE6DD',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)'
      }}
      className="w-full p-6 rounded-[28px] border text-[#1E1E1E] flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42]" />

      {!showManualInput ? (
        <>
          <div className="flex items-start gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] border border-[#FF7A30]/10 flex items-center justify-center text-[#FF7A30] shrink-0">
              <MapPin className="w-6 h-6" />
            </div>

            <div className="space-y-1 flex-1">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#1E1E1E]">
                📍 Enable Location
              </h3>
              <p className="text-xs text-[#6D6D6D] font-semibold leading-normal uppercase tracking-wider">
                Allow location to discover restaurants near you.
              </p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-[#E85D5D] text-[10px] font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E85D5D]" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.015, boxShadow: '0 8px 24px -5px rgba(255, 122, 48, 0.2)' }}
              whileTap={{ scale: 0.985 }}
              onClick={handleRequestGPS}
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 border-none transition-all font-sans"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding Location...
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  Allow Location
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: '#FAF7F2' }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowManualInput(true)}
              disabled={isLoading}
              className="py-3 px-5 bg-white border border-[#ECE6DD] text-[#6D6D6D] hover:text-[#1E1E1E] rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors"
            >
              Enter Manually
            </motion.button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 border-b border-[#ECE6DD]/40 pb-2 text-left">
            <button
              onClick={() => {
                setShowManualInput(false)
                onManualClick()
              }}
              className="p-1.5 hover:bg-[#FAF7F2] rounded-lg border border-[#ECE6DD] text-[#6D6D6D]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
              Manual Location Entry
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[9.5px] font-bold text-[#6D6D6D] uppercase tracking-wider">Enter your City / Area</label>
            <input
              type="text"
              placeholder="Ex: Madhapur, Hyderabad"
              value={manualArea}
              onChange={(e) => setManualArea(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DD] text-[#1E1E1E] font-bold text-xs focus:outline-none focus:border-[#FF7A30]"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={handleManualConfirm}
            disabled={!manualArea.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer border-none transition-all disabled:opacity-50 font-sans"
          >
            Confirm Location
          </motion.button>
        </>
      )}
    </motion.div>
  )
}
