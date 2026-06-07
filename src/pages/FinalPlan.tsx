import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Copy, RefreshCw, Star, MapPin, Check, Award } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import { Button } from '../components/ui/Button'
import { ZestoLogo } from '../components/ZestoLogo'

export const FinalPlan: React.FC = () => {
  const {
    selectedRestaurant,
    peopleCount,
    dishes,
    selections,
    members,
    splitType,
    customSplitShares,
    resetRound,
    appliedCoupon,
    setScreen,
    setHasCompletedSplit
  } = useRoomStore()

  const [copiedText, setCopiedText] = useState(false)

  // Mark split as complete to unlock Profile access
  React.useEffect(() => {
    setHasCompletedSplit(true)
  }, [setHasCompletedSplit])

  if (!selectedRestaurant) return null

  // Calculations
  const dishCounts: Record<string, number> = {}
  Object.values(selections).forEach(dishIds => {
    dishIds.forEach(id => {
      dishCounts[id] = (dishCounts[id] || 0) + 1
    })
  })

  const selectedDishesList = Object.entries(dishCounts).map(([id, count]) => {
    const dish = dishes.find(d => d.id === id)
    return { dish, count }
  }).filter(item => item.dish !== undefined)

  const dishMap = new Map(dishes.map(d => [d.id, d]))
  let subtotal = 0
  Object.values(selections).flat().forEach(dId => {
    const dish = dishMap.get(dId)
    if (dish) {
      subtotal += parseInt(dish.price.replace(/[^\d]/g, '')) || 0
    }
  })

  const restaurantDiscount = Math.round(subtotal * 0.1)
  
  let couponDiscount = 0
  if (appliedCoupon === 'SAVE100') couponDiscount = Math.min(subtotal - restaurantDiscount, 100)
  else if (appliedCoupon === 'SAVE50') couponDiscount = Math.min(subtotal - restaurantDiscount, 50)
  else if (appliedCoupon === 'ZESTO200') couponDiscount = Math.min(subtotal - restaurantDiscount, 200)
  else if (appliedCoupon === 'SQUAD300') couponDiscount = Math.min(subtotal - restaurantDiscount, 300)

  const gst = Math.round((subtotal - restaurantDiscount - couponDiscount) * 0.05)
  const finalBill = subtotal - restaurantDiscount - couponDiscount + gst
  const equalShare = Math.round(finalBill / peopleCount)

  // Message builder for copy / share (removing all emojis)
  const buildPlanSummaryText = () => {
    const dishSummary = selectedDishesList.map(item => `* ${item.dish!.name} x ${item.count}`).join('\n')
    const splitSummary = splitType === 'equal'
      ? `* Share Per Person: INR ${equalShare} (Equal)`
      : members.map(m => `* ${m.name}: INR ${customSplitShares[m.id] || 0}`).join('\n')

    const promoAppliedText = appliedCoupon ? `Promo Applied: ${appliedCoupon} (-INR ${couponDiscount})` : 'No Promo Applied'
    return `ZESTO PLAN LOCKED\n\nDining at: ${selectedRestaurant.name}\nLocation: ${selectedRestaurant.distance}\n\nSquad Orders:\n${dishSummary}\n\nSubtotal: INR ${subtotal}\nRestaurant Offer: -INR ${restaurantDiscount}\n${promoAppliedText}\nGST (5%): INR ${gst}\nTotal Due: INR ${finalBill}\n\nIndividual Splits:\n${splitSummary}\n\nLet's head over!`
  }

  const handleCopySummary = () => {
    navigator.clipboard.writeText(buildPlanSummaryText())
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const text = buildPlanSummaryText()
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto px-4 py-6 text-left relative z-10 flex flex-col gap-6 text-[#1E1E1E]"
    >
      {/* Header */}
      <div className="text-center relative z-10 mb-2">
        <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider block mb-1">
          Locked consensus
        </span>
        <h1 className="text-2xl font-black text-[#1E1E1E] tracking-tight">
          Final squad plan
        </h1>
      </div>

      {/* Handcrafted Digital Ticket Pass */}
      <motion.div
        whileHover={{ y: -1 }}
        className="relative bg-[#FFFFFF] border border-[#ECE6DD] rounded-3xl p-6 shadow-md flex flex-col gap-5 z-10"
      >
        {/* Top Header */}
        <div className="flex justify-between items-center border-b border-[#ECE6DD] pb-3">
          <ZestoLogo className="h-4 text-[#FF7A30]" />
          <span className="text-[10px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 border border-[#4CAF50]/20 px-2.5 py-0.5 rounded tracking-wide">
            Plan complete
          </span>
        </div>

        {/* Restaurant Banner Summary */}
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#ECE6DD]">
            <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-[#1E1E1E] tracking-wide truncate">{selectedRestaurant.name}</h3>
            <p className="text-[10px] text-[#6D6D6D] font-medium mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-[#FF7A30] font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 text-[#FF7A30] fill-current" /> {selectedRestaurant.rating}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-[#8B8B8B]" /> {selectedRestaurant.distance}
              </span>
            </p>
          </div>
        </div>

        {/* Dashed Perforation Divider with Ticket Cutouts */}
        <div className="relative my-2 select-none pointer-events-none">
          <div className="absolute left-[-32px] top-1/2 -translate-y-1/2 w-4 h-8 rounded-r-full bg-[#FAF7F2] border-r border-t border-b border-[#ECE6DD]" />
          <div className="absolute right-[-32px] top-1/2 -translate-y-1/2 w-4 h-8 rounded-l-full bg-[#FAF7F2] border-l border-t border-b border-[#ECE6DD]" />
          <div className="border-t border-dashed border-[#ECE6DD] w-full" />
        </div>

        {/* Squad Orders */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] text-[#8B8B8B] font-bold tracking-wider block mb-0.5">Squad orders</span>
          <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
            {selectedDishesList.map(item => (
              <div key={item.dish!.id} className="flex justify-between items-center text-[11px] font-bold text-[#1E1E1E]">
                <span className="truncate max-w-[200px]">{item.dish!.name} <span className="text-[#6D6D6D] font-sans font-medium text-[10px] lowercase">x{item.count}</span></span>
                <span className="text-[#6D6D6D] font-sans">₹{(parseInt(item.dish!.price.replace(/[^\d]/g, '')) || 0) * item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing List */}
        <div className="border-t border-[#ECE6DD] pt-3.5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
            <span>Subtotal</span>
            <span className="text-[#1E1E1E] font-sans">₹{subtotal}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
            <span>Restaurant discount (10%)</span>
            <span className="text-[#4CAF50] font-sans">- ₹{restaurantDiscount}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
              <span>Coupon discount ({appliedCoupon})</span>
              <span className="text-[#4CAF50] font-sans">- ₹{couponDiscount}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
            <span>GST (5%)</span>
            <span className="text-[#1E1E1E] font-sans">₹{gst}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-black border-t border-[#ECE6DD] pt-2.5 mt-1">
            <span className="text-[#1E1E1E]">Total bill</span>
            <span className="text-[#FF7A30] font-sans text-sm">₹{finalBill}</span>
          </div>
        </div>

        {/* Splits Details List */}
        <div className="bg-[#FAF7F2] border border-[#ECE6DD] rounded-2xl p-4 flex flex-col gap-2.5 text-left">
          <span className="text-[10px] text-[#FF7A30] font-bold tracking-wider block border-b border-[#ECE6DD] pb-1.5 mb-1">Individual payment shares</span>
          
          <div className="flex flex-col gap-2 max-h-[120px] overflow-y-auto pr-1">
            {splitType === 'equal' ? (
              members.map(m => (
                <div key={m.id} className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
                  <span>{m.name}</span>
                  <span className="text-[#1E1E1E] font-sans">₹{equalShare}</span>
                </div>
              ))
            ) : (
              members.map(m => (
                <div key={m.id} className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
                  <span>{m.name}</span>
                  <span className="text-[#1E1E1E] font-sans">₹{customSplitShares[m.id] || 0}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Barcode Invite Footer */}
        <div className="border-t border-[#ECE6DD] pt-4 flex justify-between items-center text-[11px] font-medium font-mono text-[#8B8B8B] select-none">
          <span>||||| ||| |||| || |||</span>
          <span className="text-[9px] font-bold text-right uppercase tracking-wider">Zesto invoice pass</span>
        </div>

      </motion.div>

      {/* Action triggers */}
      <div className="flex flex-col gap-2.5 z-10">
        <button
          onClick={() => setScreen('profile')}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.01] active:scale-[0.99] text-white border-none text-[11px] font-bold tracking-wider rounded-xl transition-all cursor-pointer font-sans shadow-md flex items-center justify-center gap-1.5"
        >
          <Award className="w-4 h-4 text-white" />
          View Food Journey & history
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="w-full py-4 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.01] active:scale-[0.99] text-white border-none text-[11px] font-bold tracking-wider rounded-xl transition-all cursor-pointer font-sans shadow-md flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-4 h-4 text-white" />
          Share plan via WhatsApp
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="glass"
            size="md"
            onClick={handleCopySummary}
            className="justify-center bg-white border border-[#ECE6DD] hover:bg-[#FAF7F2] py-3 text-[10px] font-bold tracking-wider cursor-pointer text-[#6D6D6D] hover:text-[#1E1E1E] rounded-xl"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-[#4CAF50] animate-pulse" />
                Copied summary
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy summary
              </>
            )}
          </Button>

          <Button
            variant="glass"
            size="md"
            onClick={resetRound}
            className="justify-center bg-white border border-[#ECE6DD] hover:bg-[#FAF7F2] py-3 text-[10px] font-bold tracking-wider cursor-pointer text-[#6D6D6D] hover:text-[#1E1E1E] rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            New session
          </Button>
        </div>
      </div>

    </motion.div>
  )
}

export default FinalPlan
