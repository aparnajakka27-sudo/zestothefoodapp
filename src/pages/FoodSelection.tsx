import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Star, Check } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'

export const FoodSelection: React.FC = () => {
  const {
    selectedRestaurant,
    dishes,
    selections,
    toggleDishSelection,
    confirmFoodSelections,
    resetRound,
    cravings,
    showFoodOnboarding,
    setShowFoodOnboarding
  } = useRoomStore()

  const [activeCategory, setActiveCategory] = useState<'All' | 'Starters' | 'Main Course' | 'Rice & Biryani' | 'Drinks' | 'Desserts'>('All')

  const userSelections = selections['user'] || []

  const handleDishToggle = (dishId: string) => {
    toggleDishSelection('user', dishId)
  }

  if (!selectedRestaurant) return null

  // Onboarding Screen
  if (showFoodOnboarding) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-xl mx-auto px-4 py-6 text-left relative z-10 flex flex-col gap-6"
      >
        <div className="bg-[#FFFFFF] border border-[#ECE6DD] rounded-3xl p-6 md:p-8 shadow-md flex flex-col gap-6">
          <div className="text-center space-y-2">
            <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider bg-[#FF7A30]/5 px-3 py-1 rounded-full border border-[#FF7A30]/10 inline-block">
              Group dining flow
            </span>
            <h1 className="text-2xl font-black text-[#1E1E1E] tracking-tight">
              How food voting works 🍽
            </h1>
            <p className="text-xs text-[#6D6D6D] leading-relaxed max-w-sm mx-auto font-medium">
              Before voting starts, everyone chooses the dishes they personally want to eat.
            </p>
            <p className="text-[11px] text-[#8B8B8B] leading-normal max-w-sm mx-auto font-medium">
              After everyone selects dishes, your group votes together to decide the final order. This makes food planning faster and avoids confusion.
            </p>
          </div>

          {/* Visual Steps */}
          <div className="flex flex-col gap-3">
            {[
              { num: '1', title: 'Choose dishes you like', desc: 'Browse the menu and pick whatever you want to eat.' },
              { num: '2', title: 'Wait for friends to finish', desc: 'See who is ready and who is still selecting in real time.' },
              { num: '3', title: 'Vote together as a group', desc: 'Vote Keep or Skip on the combined squad favorites.' },
              { num: '4', title: 'Final dishes get selected', desc: 'Dishes with majority support are added to the squad order.' },
              { num: '5', title: 'Bill gets split automatically', desc: 'Calculate payment shares instantly without the math stress.' }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 p-3 bg-[#FAF7F2] border border-[#ECE6DD] rounded-2xl hover:border-[#FF7A30]/25 transition-colors"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FF7A30]/10 border border-[#FF7A30]/20 flex items-center justify-center text-[#FF7A30] font-bold text-xs shrink-0 font-sans">
                  {step.num}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#1E1E1E] tracking-wide">{step.title}</h4>
                  <p className="text-[10px] text-[#6D6D6D] font-medium leading-normal">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setShowFoodOnboarding(false)}
            className="w-full py-3.5 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.01] active:scale-[0.99] text-white border-none text-[11px] font-bold tracking-wider rounded-xl transition-all cursor-pointer font-sans shadow-md"
          >
            Start choosing dishes
          </button>
        </div>
      </motion.div>
    )
  }

  // Filter dishes by category
  const categoriesList: typeof activeCategory[] = ['All', 'Starters', 'Main Course', 'Rice & Biryani', 'Drinks', 'Desserts']
  
  const filteredDishes = dishes.filter(dish => {
    if (activeCategory === 'All') return true
    
    // Custom mapping of category search query since templates tags can differ
    const cat = activeCategory.toLowerCase()
    const name = dish.name.toLowerCase()
    
    if (cat === 'starters') {
      return name.includes('kebab') || name.includes('wings') || name.includes('bread') || name.includes('paneer 65') || name.includes('roll') || name.includes('tikka') || name.includes('crispy') || name.includes('starter')
    }
    if (cat === 'main course') {
      return name.includes('curry') || name.includes('naan') || name.includes('roti') || name.includes('paneer butter') || name.includes('dal') || name.includes('masala')
    }
    if (cat === 'rice & biryani') {
      return name.includes('biryani') || name.includes('rice') || name.includes('pulao')
    }
    if (cat === 'drinks') {
      return name.includes('coffee') || name.includes('coke') || name.includes('pepsi') || name.includes('drink') || name.includes('mocktail') || name.includes('soda') || name.includes('water')
    }
    if (cat === 'desserts') {
      return name.includes('muffin') || name.includes('brownie') || name.includes('waffle') || name.includes('dessert') || name.includes('jamun') || name.includes('meetha') || name.includes('cream')
    }
    return true
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-xl mx-auto px-4 py-6 text-left relative z-10 flex flex-col gap-6 text-[#1E1E1E]"
    >
      {/* Header */}
      <div className="flex justify-between items-center z-10 border-b border-[#ECE6DD] pb-3">
        <button
          onClick={resetRound}
          className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Exit room
        </button>
        <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider bg-[#FF7A30]/5 px-2 py-0.5 rounded border border-[#FF7A30]/10">
          {selectedRestaurant.name}
        </span>
      </div>

      <div className="z-10 space-y-1.5">
        <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider block">
          Menu picks selection
        </span>
        <h1 className="text-2xl font-black text-[#1E1E1E] tracking-tight">
          Choose what you want to eat
        </h1>
        <p className="text-[11px] text-[#6D6D6D] font-medium leading-relaxed">
          Preferences: <span className="text-[#1E1E1E] font-bold">{cravings.join(', ') || 'Any'}</span>
        </p>
      </div>

      {/* Category Tabs */}
      <div className="z-10 flex gap-1.5 overflow-x-auto pb-1.5 pr-2 scrollbar-hide shrink-0">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-wide cursor-pointer whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#FF7A30] border-transparent text-white shadow-sm'
                : 'bg-[#F4EFE8] border-[#ECE6DD] text-[#6D6D6D] hover:text-[#1E1E1E] hover:bg-[#ECE6DD]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dishes List */}
      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 z-10">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-10 text-[#8B8B8B] text-xs font-medium">
            No dishes found in this category.
          </div>
        ) : (
          filteredDishes.map((dish) => {
            const isSelected = userSelections.includes(dish.id)
            
            return (
              <motion.div
                key={dish.id}
                layoutId={`dish-card-${dish.id}`}
                className={`p-3 bg-[#FFFFFF] border rounded-2xl flex gap-4 transition-all duration-200 relative shadow-sm ${
                  isSelected ? 'border-[#FF7A30] bg-[#FF7A30]/5' : 'border-[#ECE6DD]'
                }`}
              >
                {/* Left highlight border strip */}
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#FF7A30] rounded-r-md" />
                )}

                {/* Dish Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative border border-[#ECE6DD]">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${
                    dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                  }`} title={dish.isVeg ? 'Veg' : 'Non-Veg'} />
                </div>

                {/* Item Details */}
                <div className="flex-1 text-left flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-xs font-bold text-[#1E1E1E] tracking-wide truncate max-w-[190px]">
                        {dish.name}
                      </h4>
                      <span className="text-xs font-bold text-[#FF7A30] font-sans">{dish.price}</span>
                    </div>

                    <p className="text-[10px] text-[#6D6D6D] leading-normal font-medium mb-2">
                      {dish.description || 'Delicious gourmet chef pick.'}
                    </p>

                    <div className="flex items-center gap-1.5">
                      {dish.popularTag && (
                        <span className="text-[9px] font-bold bg-[#FF7A30]/10 border border-[#FF7A30]/20 text-[#FF7A30] px-2 py-0.5 rounded">
                          {dish.popularTag}
                        </span>
                      )}
                      <span className="text-[9px] text-[#8B8B8B] font-medium">
                        Spice: {dish.spiceLevel}
                      </span>
                    </div>
                  </div>

                  {/* Add / Selected Actions */}
                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-[#ECE6DD]">
                    <span className="text-[9px] text-[#8B8B8B] font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#FF7A30] fill-current" /> {dish.rating || '4.5'} Rating
                    </span>

                    <button
                      onClick={() => handleDishToggle(dish.id)}
                      className={`px-3.5 py-1 rounded-lg border text-[9px] font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#FF7A30] border-transparent text-white shadow-sm'
                          : 'bg-[#F4EFE8] border-[#ECE6DD] hover:bg-[#ECE6DD] text-[#6D6D6D] hover:text-[#1E1E1E]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3 text-white stroke-[3]" /> Selected
                        </>
                      ) : (
                        'Add to my picks'
                      )}
                    </button>
                  </div>

                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Tally Ticker and Submit */}
      <div className="flex flex-col gap-3.5 z-10">
        <div className="bg-[#FFFFFF] border border-[#ECE6DD] p-4 rounded-xl flex justify-between items-center text-xs font-bold text-[#6D6D6D] shadow-sm">
          <span>Your selection tally</span>
          <span className="text-[#1E1E1E] font-black">{userSelections.length} dishes chosen</span>
        </div>

        <button
          onClick={confirmFoodSelections}
          disabled={userSelections.length === 0}
          className={`w-full py-3.5 border-none font-bold tracking-wider text-[11px] rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center font-sans ${
            userSelections.length > 0 
              ? 'bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white hover:scale-[1.01] active:scale-[0.99]' 
              : 'bg-[#ECE6DD] text-[#8B8B8B] pointer-events-none'
          }`}
        >
          Confirm food choices
        </button>
      </div>
    </motion.div>
  )
}

export default FoodSelection
