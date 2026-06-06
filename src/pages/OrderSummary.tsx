import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Receipt, DollarSign, ArrowRight, CheckCircle2, AlertTriangle, Check, Ticket } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'

export const OrderSummary: React.FC = () => {
  const {
    dishes,
    selections,
    members,
    peopleCount,
    selectedRestaurant,
    splitType,
    setSplitType,
    customSplitShares,
    updateCustomSplitShare,
    appliedCoupon,
    applyCoupon,
    setScreen
  } = useRoomStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null)

  if (!selectedRestaurant) return null

  // 1. Calculate squad order summary
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

  // 2. Pricing Calculations
  const dishMap = new Map(dishes.map(d => [d.id, d]))
  let subtotal = 0
  Object.values(selections).flat().forEach(dId => {
    const dish = dishMap.get(dId)
    if (dish) {
      subtotal += parseInt(dish.price.replace(/[^\d]/g, '')) || 0
    }
  })

  const restaurantDiscount = Math.round(subtotal * 0.1) // 10% Restaurant discount

  // Calculate coupon discount
  let couponDiscount = 0
  if (appliedCoupon === 'SAVE100') couponDiscount = Math.min(subtotal - restaurantDiscount, 100)
  else if (appliedCoupon === 'SAVE50') couponDiscount = Math.min(subtotal - restaurantDiscount, 50)
  else if (appliedCoupon === 'ZESTO200') couponDiscount = Math.min(subtotal - restaurantDiscount, 200)
  else if (appliedCoupon === 'SQUAD300') couponDiscount = Math.min(subtotal - restaurantDiscount, 300)

  // GST (5%)
  const gst = Math.round((subtotal - restaurantDiscount - couponDiscount) * 0.05)
  const finalBill = subtotal - restaurantDiscount - couponDiscount + gst
  const equalShare = Math.round(finalBill / peopleCount)

  // 3. Custom Split calculation
  const customSum = Object.values(customSplitShares).reduce((a, b) => a + b, 0)
  const isBalanced = customSum === finalBill
  const difference = finalBill - customSum

  const handleCustomShareChange = (memberId: string, value: string) => {
    const num = parseInt(value) || 0
    updateCustomSplitShare(memberId, num)
  }

  const handleApplyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase()
    const validCoupons = ['SAVE50', 'SAVE100', 'ZESTO200', 'SQUAD300']
    
    if (validCoupons.includes(cleanCode)) {
      applyCoupon(cleanCode)
      setCouponSuccess(`Applied ${cleanCode} successfully!`)
      setCouponError(null)
      setTimeout(() => setCouponSuccess(null), 3000)
    } else {
      setCouponError('Invalid promo code')
      setCouponSuccess(null)
      setTimeout(() => setCouponError(null), 2500)
    }
    setCouponInput('')
  }

  const handleRemoveCoupon = () => {
    applyCoupon(null)
    setCouponSuccess(null)
    setCouponError(null)
  }

  const handleContinue = () => {
    if (splitType === 'custom' && !isBalanced) {
      if (difference !== 0) {
        updateCustomSplitShare('user', (customSplitShares['user'] || 0) + difference)
      }
    }
    setScreen('final_plan')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto px-4 py-6 text-left relative z-10 flex flex-col gap-6 text-[#1E1E1E]"
    >
      {/* Header */}
      <div className="flex justify-between items-center z-10 border-b border-[#ECE6DD] pb-3">
        <button
          onClick={() => setScreen('voting_round')}
          className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to voting
        </button>
        <span className="text-[#8B8B8B] text-[10px] font-bold tracking-wider">
          Consensus invoice tally
        </span>
      </div>

      <div className="z-10 space-y-1.5">
        <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider block">
          Step 5 of 5
        </span>
        <h1 className="text-2xl font-black text-[#1E1E1E] tracking-tight">
          Final squad order
        </h1>
        <p className="text-[11px] text-[#6D6D6D] font-medium">
          Verify final orders approved by the group and split payments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 z-10 items-start">
        
        {/* Left Column: Tally and Invoice */}
        <div className="md:col-span-6 flex flex-col gap-5">
          <span className="text-[10px] font-bold text-[#6D6D6D] tracking-wider pl-1">Squad order summary</span>

          {/* Selections list check ledger */}
          <div className="bg-[#FFFFFF] border border-[#ECE6DD] p-5 rounded-2xl flex flex-col gap-3 max-h-[220px] overflow-y-auto shadow-sm">
            {selectedDishesList.length === 0 ? (
              <div className="text-[#8B8B8B] text-xs font-medium text-center py-6">
                No items approved by the squad.
              </div>
            ) : (
              selectedDishesList.map(({ dish, count }) => (
                <div key={dish!.id} className="flex justify-between items-center text-xs font-bold border-b border-[#ECE6DD] border-dashed pb-2 last:border-0 last:pb-0 text-[#1E1E1E]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#4CAF50] font-black flex items-center gap-1">✔ {count}x</span>
                    <span className="truncate max-w-[180px] font-bold">{dish!.name}</span>
                  </div>
                  <span className="text-[#6D6D6D] font-sans">
                    ₹{(parseInt(dish!.price.replace(/[^\d]/g, '')) || 0) * count}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Discount Coupon System Widget */}
          <div className="bg-[#FFFFFF] border border-[#ECE6DD] p-5 rounded-2xl flex flex-col gap-3.5 shadow-sm">
            <span className="text-[10px] font-bold text-[#FF7A30] tracking-wider flex items-center gap-1">
              <Ticket className="w-4 h-4 text-[#FF7A30]" /> Discount & promo coupons
            </span>

            {/* Coupons suggestions */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-[#8B8B8B] font-bold tracking-wider block">Suggestions</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: 'SAVE50', label: '₹50 OFF' },
                  { code: 'SAVE100', label: '₹100 OFF' },
                  { code: 'ZESTO200', label: '₹200 OFF' },
                  { code: 'SQUAD300', label: '₹300 OFF' }
                ].map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleApplyCouponCode(c.code)}
                    className={`px-2 py-1 rounded-lg border text-[9px] font-bold tracking-wide cursor-pointer transition-all ${
                      appliedCoupon === c.code
                        ? 'bg-[#4CAF50]/10 border-[#4CAF50] text-[#4CAF50] font-black'
                        : 'bg-[#F4EFE8] border-[#ECE6DD] text-[#6D6D6D] hover:bg-[#ECE6DD] hover:text-[#1E1E1E]'
                    }`}
                  >
                    {c.code} ({c.label})
                  </button>
                ))}
              </div>
            </div>

            {/* Promo input field */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code..."
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#ECE6DD] text-[#1E1E1E] font-bold text-xs uppercase focus:outline-none focus:border-[#FF7A30] placeholder:opacity-40"
              />
              <button
                onClick={() => handleApplyCouponCode(couponInput)}
                className="px-4 py-2 bg-[#F4EFE8] hover:bg-[#ECE6DD] border border-[#ECE6DD] rounded-xl text-[10px] font-bold text-[#1E1E1E] cursor-pointer transition-all"
              >
                Apply
              </button>
            </div>

            <AnimatePresence>
              {couponSuccess && (
                <motion.div initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-2 bg-[#4CAF50]/10 border border-[#4CAF50]/25 rounded-lg text-[#4CAF50] text-[10px] font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#4CAF50] stroke-[3]" /> {couponSuccess}
                </motion.div>
              )}
              {couponError && (
                <motion.div initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-2 bg-[#E85D5D]/10 border border-[#E85D5D]/25 rounded-lg text-[#E85D5D] text-[10px] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#E85D5D]" /> {couponError}
                </motion.div>
              )}
            </AnimatePresence>

            {appliedCoupon && (
              <div className="flex justify-between items-center bg-[#4CAF50]/5 border border-[#4CAF50]/10 p-2.5 rounded-xl text-[10px] font-bold text-[#4CAF50] tracking-wide mt-1">
                <span>Applied: {appliedCoupon}</span>
                <button onClick={handleRemoveCoupon} className="text-[9px] text-[#6D6D6D] hover:text-[#1E1E1E] cursor-pointer underline">
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Invoice pricing breakdown */}
          <div className="bg-[#FFFFFF] border border-[#ECE6DD] p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
            <span className="text-[10px] font-bold text-[#FF7A30] tracking-wider border-b border-[#ECE6DD] pb-2">Premium invoice summary</span>

            <div className="flex justify-between items-center text-xs text-[#6D6D6D] font-bold">
              <span>Food total</span>
              <span className="text-[#1E1E1E] font-sans">₹{subtotal}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-[#6D6D6D] font-bold">
              <span>Restaurant discount (10%)</span>
              <span className="text-[#4CAF50] font-sans">- ₹{restaurantDiscount}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between items-center text-xs text-[#6D6D6D] font-bold">
                <span>Coupon discount ({appliedCoupon})</span>
                <span className="text-[#4CAF50] font-sans">- ₹{couponDiscount}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-[#6D6D6D] font-bold">
              <span>GST (5%)</span>
              <span className="text-[#1E1E1E] font-sans">₹{gst}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-black border-t border-[#ECE6DD] border-dashed pt-3 mt-1">
              <span className="text-[#1E1E1E] flex items-center gap-1.5"><Receipt className="w-4 h-4 text-[#FF7A30]" /> Final amount</span>
              <span className="text-[#FF7A30] font-sans text-base">₹{finalBill}</span>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#8B8B8B] font-bold pt-1 border-t border-[#ECE6DD]">
              <span>Per person split ({peopleCount} squad members)</span>
              <span className="text-[#1E1E1E] font-sans font-bold">₹{equalShare}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Split engine */}
        <div className="md:col-span-6 flex flex-col gap-5">
          <div className="flex justify-between items-center pl-1">
            <span className="text-[10px] font-bold text-[#6D6D6D] tracking-wider">Payment distribution</span>
            <span className="text-[9px] font-bold text-[#8B8B8B] tracking-wide">{peopleCount} friends sharing</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#ECE6DD] p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
            {/* Toggles Equal vs Custom */}
            <div className="grid grid-cols-2 gap-2 bg-[#F4EFE8] p-1.5 border border-[#ECE6DD] rounded-xl text-[10px] font-bold tracking-wide">
              <button
                onClick={() => setSplitType('equal')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  splitType === 'equal' ? 'bg-[#FF7A30] text-white shadow-sm' : 'text-[#6D6D6D] hover:text-[#1E1E1E]'
                }`}
              >
                Equal split
              </button>
              <button
                onClick={() => setSplitType('custom')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  splitType === 'custom' ? 'bg-[#FF7A30] text-white shadow-sm' : 'text-[#6D6D6D] hover:text-[#1E1E1E]'
                }`}
              >
                Custom split
              </button>
            </div>

            {/* EQUAL SPLIT SECTION */}
            {splitType === 'equal' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-3 text-center py-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF7A30]/10 border border-[#FF7A30]/20 flex items-center justify-center text-[#FF7A30] mx-auto mb-1">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#6D6D6D] text-[10px] font-bold block">Split per person</span>
                  <span className="text-2xl font-black text-[#1E1E1E] block mt-1 font-sans">₹{equalShare}</span>
                </div>
                <p className="text-[10px] text-[#6D6D6D] font-medium leading-relaxed px-4 text-center">
                  Each of the {peopleCount} squad members will pay an equal share towards the final bill.
                </p>
              </motion.div>
            )}

            {/* CUSTOM SPLIT SECTION */}
            {splitType === 'custom' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-3.5"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-[#8B8B8B] pb-1 border-b border-[#ECE6DD]">
                  <span>Squad member</span>
                  <span>Share amount</span>
                </div>

                {/* List of members inputs */}
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {members.map((m) => {
                    const share = customSplitShares[m.id] || 0
                    return (
                      <div key={m.id} className="flex items-center justify-between p-2 bg-[#FAF7F2] rounded-xl border border-[#ECE6DD]">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full text-[9px] font-bold text-white uppercase flex items-center justify-center border border-[#ECE6DD] ${m.avatarColor || 'bg-[#FF7A30]'}`}>
                            {m.name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-[#1E1E1E] truncate max-w-[120px]">{m.name}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[#6D6D6D] text-xs font-bold font-sans">₹</span>
                          <input
                            type="number"
                            value={share || ''}
                            onChange={(e) => handleCustomShareChange(m.id, e.target.value)}
                            placeholder="0"
                            className="w-16 text-right px-2 py-1 rounded-lg bg-white border border-[#ECE6DD] text-[#1E1E1E] font-bold text-xs focus:outline-none focus:border-[#FF7A30] font-sans"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Balanced/unbalanced notifications */}
                <div className="mt-2 pt-2 border-t border-[#ECE6DD] flex justify-between items-center text-[10px] font-bold">
                  <div>
                    <span className="text-[#8B8B8B] block">Split total</span>
                    <span className="text-[#1E1E1E] font-sans">₹{customSum} / ₹{finalBill}</span>
                  </div>

                  <div>
                    {isBalanced ? (
                      <span className="flex items-center gap-1 text-[#4CAF50] text-[9px] font-bold tracking-wider bg-[#4CAF50]/10 border border-[#4CAF50]/20 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border ${
                        difference > 0 
                          ? 'text-[#FF9800] bg-[#FF9800]/10 border-[#FF9800]/25' 
                          : 'text-[#E85D5D] bg-[#E85D5D]/10 border-[#E85D5D]/25'
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5" /> {difference > 0 ? `Remaining ₹${difference}` : `Over by ₹${Math.abs(difference)}`}
                      </span>
                    )}
                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full py-3.5 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.01] active:scale-[0.99] text-white border-none text-[11px] font-bold tracking-wider rounded-xl transition-all cursor-pointer font-sans shadow-md flex items-center justify-center gap-1"
          >
            Confirm & finalize plan <ArrowRight className="w-4 h-4 ml-1 text-white" />
          </button>

        </div>

      </div>

    </motion.div>
  )
}

export default OrderSummary
