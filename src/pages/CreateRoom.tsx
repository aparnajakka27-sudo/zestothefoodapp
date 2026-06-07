import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, AlertCircle, ChevronDown, Plus, Minus, Star, MapPin, LogIn, LogOut, Loader2 } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import { Button } from '../components/ui/Button'
import { CITIES } from '../constants/foodData'
import { searchSittingRestaurants } from '../services/googleMaps'
import type { Restaurant } from '../types'
import { LocationPermission } from '../components/LocationPermission'
import { RestaurantLoader } from '../components/RestaurantLoader'

const PREFERENCE_OPTIONS = [
  'South Indian', 'North Indian', 'Pizza', 'Biryani', 'BBQ',
  'Chinese', 'Cafe', 'Desserts', 'Veg', 'Non Veg'
]

export const CreateRoom: React.FC = () => {
  const {
    groupName,
    setGroupName,
    peopleCount,
    setPeopleCount,
    restaurantMode,
    setRestaurantMode,
    selectedRestaurant,
    setSelectedRestaurant,
    city,
    setCity,
    cravings,
    toggleCraving,
    budgetVal,
    setBudgetVal,
    radiusVal,
    setRadiusVal,
    createRoom,
    setScreen,
    validationError,
    user,
    signOut,
    locationPermission,
    detectedAreaName,
    requestLocation,
    latitude,
    longitude
  } = useRoomStore()

  const [formError, setFormError] = useState<string | null>(null)
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false)
  const [loaderStage, setLoaderStage] = useState<'gps' | 'nominatim' | 'overpass' | 'filtering' | 'complete'>('gps')
  
  // Restaurant Search (Option A)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Restaurant[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Dropdown for City (Option B)
  const [cityOpen, setCityOpen] = useState(false)

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true)
      const delayDebounce = setTimeout(async () => {
        const results = await searchSittingRestaurants(searchQuery, latitude, longitude, city)
        setSearchResults(results)
        setIsSearching(false)
      }, 300)
      return () => clearTimeout(delayDebounce)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, latitude, longitude, city])

  const handleContinue = async () => {
    if (!groupName.trim()) {
      setFormError('Group Name is required')
      return
    }
    if (!peopleCount || peopleCount < 2 || peopleCount > 20) {
      setFormError('Please select squad size (2-20)')
      return
    }
    if (restaurantMode === 'already_chose' && !selectedRestaurant) {
      setFormError('Please select your dining restaurant')
      return
    }
    if (restaurantMode === 'help_decide') {
      if (locationPermission !== 'granted') {
        setFormError('Location permission is required to search restaurants near you.')
        return
      }
      if (cravings.length === 0) {
        setFormError('Please choose at least one preference')
        return
      }
      setIsLoadingRestaurants(true)
      setLoaderStage('overpass')
      setTimeout(() => setLoaderStage('filtering'), 1200)
    }

    setFormError(null)
    try {
      await createRoom()
    } catch (e) {
      setFormError('Failed to create room. Please try again.')
    } finally {
      setIsLoadingRestaurants(false)
    }
  }

  const handleSelectMode = (mode: 'already_chose' | 'help_decide') => {
    setRestaurantMode(mode)
  }

  const adjustPeopleCount = (amount: number) => {
    const nextVal = peopleCount + amount
    if (nextVal >= 2 && nextVal <= 20) {
      setPeopleCount(nextVal)
    }
  }

  if (isLoadingRestaurants) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white border border-[#ECE6DD] rounded-[28px] p-8 shadow-md"
      >
        <RestaurantLoader stage={loaderStage} />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-xl relative z-10 bg-[#FFFFFF] border border-[#ECE6DD] rounded-[28px] p-6 md:p-8 shadow-md text-left flex flex-col gap-6 text-[#1E1E1E]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ECE6DD] pb-3">
        <button
          onClick={() => setScreen('selector')}
          className="p-2 bg-[#F4EFE8] border border-[#ECE6DD] hover:bg-[#ECE6DD] rounded-full text-[#6D6D6D] hover:text-[#1E1E1E] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[#8B8B8B] text-[9.5px] font-black uppercase tracking-widest">
          Create food room
        </span>
      </div>

      {/* Optional Google Auth banner */}
      <div className="bg-[#FAF7F2] border border-[#ECE6DD] p-4 rounded-2xl flex items-center justify-between text-xs gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} className="w-8 h-8 rounded-full object-cover border border-[#FF7A30]/30" alt={user.name} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#FF7A30] text-white flex items-center justify-center font-bold text-xs">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <div className="text-left">
                <span className="text-[#1E1E1E] font-bold block">{user.name}</span>
                <span className="text-[10px] text-[#6D6D6D] block">{user.email}</span>
              </div>
            </div>
            <button onClick={signOut} className="text-[#FF7A30] hover:text-[#FF8C42] font-black uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </>
        ) : (
          <>
            <p className="text-[#6D6D6D] leading-normal font-semibold uppercase tracking-wider text-[9.5px]">
              Decide faster by signing in, or continue as guest.
            </p>
            <button onClick={() => setScreen('login')} className="bg-[#FF7A30] hover:bg-[#FF8C42] text-white px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0 transition-all shadow-sm">
              <LogIn className="w-3.5 h-3.5 text-white" /> Sign In
            </button>
          </>
        )}
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#1E1E1E]">Create food room 🍽</h1>
        <p className="text-[#6D6D6D] text-xs font-semibold uppercase tracking-wider mt-1">
          Plan meals with friends in minutes.
        </p>
      </div>

      {/* Errors display */}
      <AnimatePresence>
        {(formError || validationError) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-red-50 border border-red-200 text-[#E85D5D] text-xs font-bold rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-[#E85D5D]" />
            <span>{formError || validationError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-5">
        
        {/* Section 1: Basic Parameters */}
        <div className="space-y-4">
          <span className="text-[8.5px] font-black text-[#8B8B8B] tracking-wider uppercase block">
            1. Group Details
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Group Name input */}
            <div className="md:col-span-7 flex flex-col gap-1.5">
              <label className="text-[9.5px] font-bold text-[#6D6D6D] uppercase tracking-wider">Group Name</label>
              <input
                type="text"
                placeholder="Ex: Chicken Lovers"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DD] text-[#1E1E1E] font-bold text-xs focus:outline-none focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] transition-all"
              />
            </div>

            {/* Stepper squad count */}
            <div className="md:col-span-5 flex flex-col gap-1.5">
              <label className="text-[9.5px] font-bold text-[#6D6D6D] uppercase tracking-wider">Squad Size</label>
              <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#ECE6DD] px-3 py-1.5 rounded-xl justify-between">
                <button
                  type="button"
                  onClick={() => adjustPeopleCount(-1)}
                  className="p-1.5 bg-[#FFFFFF] border border-[#ECE6DD] rounded-lg text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-[#1E1E1E] font-sans">{peopleCount}</span>
                <button
                  type="button"
                  onClick={() => adjustPeopleCount(1)}
                  className="p-1.5 bg-[#FFFFFF] border border-[#ECE6DD] rounded-lg text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Mode Selector */}
        <div className="space-y-3 pt-3 border-t border-[#ECE6DD]">
          <span className="text-[8.5px] font-black text-[#8B8B8B] tracking-wider uppercase block">
            2. Dining Mode
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSelectMode('already_chose')}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                restaurantMode === 'already_chose'
                  ? 'bg-[#FF7A30]/5 border-[#FF7A30] text-[#1E1E1E]'
                  : 'bg-[#FFFFFF] border-[#ECE6DD] text-[#6D6D6D] hover:border-[#ECE6DD] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className={`text-xs font-black uppercase tracking-wide ${restaurantMode === 'already_chose' ? 'text-[#FF7A30]' : 'text-[#1E1E1E]'}`}>We already picked a place</span>
              <span className="text-[9.5px] leading-normal text-[#6D6D6D] font-semibold uppercase tracking-wider">We know where we’re eating.</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('help_decide')}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                restaurantMode === 'help_decide'
                  ? 'bg-[#FF7A30]/5 border-[#FF7A30] text-[#1E1E1E]'
                  : 'bg-[#FFFFFF] border-[#ECE6DD] text-[#6D6D6D] hover:border-[#ECE6DD] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className={`text-xs font-black uppercase tracking-wide ${restaurantMode === 'help_decide' ? 'text-[#FF7A30]' : 'text-[#1E1E1E]'}`}>Help us decide nearby</span>
              <span className="text-[9.5px] leading-normal text-[#6D6D6D] font-semibold uppercase tracking-wider">Find restaurants near your group.</span>
            </button>
          </div>
        </div>

        {/* ================= BRANCH A: ALREADY CHOSE ================= */}
        {restaurantMode === 'already_chose' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 pt-3 border-t border-[#ECE6DD]"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-bold text-[#6D6D6D] uppercase tracking-wider">Search Restaurant</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search dining venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#FAF7F2] border border-[#ECE6DD] text-[#1E1E1E] font-bold text-xs focus:outline-none focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]"
                />
                <Search className="w-4 h-4 text-[#8B8B8B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Suggestions list */}
            {searchQuery.trim().length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#ECE6DD] rounded-xl p-2 max-h-[160px] overflow-y-auto flex flex-col gap-1.5 shadow-sm">
                {isSearching ? (
                  <span className="text-[9.5px] font-black uppercase text-[#8B8B8B] p-2 block">Searching...</span>
                ) : searchResults.length > 0 ? (
                  searchResults.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setSelectedRestaurant(r)
                        setSearchQuery('')
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#FAF7F2] text-left border border-transparent hover:border-[#ECE6DD] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img src={r.image} alt={r.name} className="w-8 h-8 object-cover rounded-lg shrink-0 border border-[#ECE6DD]" />
                        <div>
                          <h4 className="text-xs font-bold text-[#1E1E1E] uppercase truncate max-w-[180px]">{r.name}</h4>
                          <span className="text-[9.5px] text-[#6D6D6D] font-semibold block">{r.tags.join(' • ')}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#FF7A30] shrink-0 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {r.rating}
                      </span>
                    </button>
                  ))
                ) : (
                  <span className="text-[9.5px] font-black uppercase text-[#8B8B8B] p-2 block">No results matched</span>
                )}
              </div>
            )}

            {/* Selected detail card (friendly image-left layout) */}
            {selectedRestaurant && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#FFFFFF] border border-[#ECE6DD] rounded-2xl p-4 flex gap-4 text-left items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-14 h-14 object-cover rounded-xl border border-[#ECE6DD] shrink-0" />
                  <div>
                    <h3 className="text-xs font-black text-[#1E1E1E] uppercase tracking-wide truncate max-w-[200px]">{selectedRestaurant.name}</h3>
                    <p className="text-[9.5px] text-[#6D6D6D] font-semibold uppercase tracking-wider mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[#FF7A30] flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {selectedRestaurant.rating}
                      </span>
                      <span>({selectedRestaurant.reviewsCount} reviews)</span>
                      <span className="text-[#ECE6DD]">•</span>
                      <span>{selectedRestaurant.distance}</span>
                    </p>
                  </div>
                </div>
                {selectedRestaurant.discounts && (
                  <span className="text-[#FF7A30] text-[8.5px] font-black uppercase tracking-widest bg-[#FF7A30]/5 border border-[#FF7A30]/10 px-2 py-1 rounded shrink-0">
                    {selectedRestaurant.discounts}
                  </span>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ================= BRANCH B: HELP US DECIDE ================= */}
        {restaurantMode === 'help_decide' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 pt-3 border-t border-[#ECE6DD] text-left"
          >
            {/* GPS Geolocation Flow */}
            <div className="flex flex-col gap-3">
              {locationPermission === 'prompt' && (
                <LocationPermission 
                  onManualClick={() => useRoomStore.setState({ locationPermission: 'denied' })}
                  onPermissionGranted={(area, lat, lon) => {
                    useRoomStore.setState({ 
                      detectedAreaName: area, 
                      latitude: lat, 
                      longitude: lon, 
                      locationPermission: 'granted' 
                    })
                  }}
                />
              )}

              {locationPermission === 'requesting' && (
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', borderColor: 'rgba(236, 230, 221, 0.6)' }} className="p-6 rounded-3xl border flex items-center gap-3.5 shadow-sm text-xs font-bold uppercase tracking-wider text-[#1E1E1E]">
                  <Loader2 className="w-5 h-5 text-[#FF7A30] animate-spin" />
                  <span>Detecting your GPS location...</span>
                </div>
              )}

              {locationPermission === 'denied' && (
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', borderColor: 'rgba(236, 230, 221, 0.6)' }} className="p-6 rounded-3xl border flex flex-col gap-3.5 shadow-sm">
                  <div className="flex items-center gap-2 text-[#E85D5D] text-xs font-black uppercase tracking-wider">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>Location access denied / manual override</span>
                  </div>
                  <p className="text-[10px] text-[#6D6D6D] font-bold uppercase tracking-wider leading-normal">
                    Select a city manually below to fetch restaurants, or retry permission.
                  </p>
                  <Button
                    type="button"
                    variant="glass"
                    onClick={requestLocation}
                    className="w-full justify-center bg-[#FFFFFF] border-[#ECE6DD] text-[#6D6D6D] hover:text-[#1E1E1E] uppercase py-2.5 cursor-pointer shadow-sm text-[9px] font-black"
                  >
                    Retry GPS Auto Detection
                  </Button>
                </div>
              )}

              {locationPermission === 'granted' && (
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', borderColor: 'rgba(236, 230, 221, 0.6)' }} className="p-6 rounded-3xl border flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold border-b border-[#ECE6DD]/40 pb-3">
                    <span className="text-neutral-400 text-[9px] uppercase tracking-wider">📍 Detected Location</span>
                    <span className="text-[#FF7A30] font-black text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#FF7A30]" /> {detectedAreaName}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9.5px] font-bold text-[#6D6D6D] uppercase tracking-wider">Search Radius</label>
                    <div className="grid grid-cols-4 gap-1.5 bg-neutral-100/50 border border-neutral-200/20 p-1 rounded-xl">
                      {[2, 5, 10, 20].map((km) => (
                        <button
                          key={km}
                          type="button"
                          onClick={() => setRadiusVal(km)}
                          className={`py-2 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            radiusVal === km
                              ? 'bg-[#FF7A30] text-white font-extrabold shadow-sm'
                              : 'bg-transparent text-[#6D6D6D] hover:text-[#1E1E1E]'
                          }`}
                        >
                          {km} KM
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* City Dropdown */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[9.5px] font-bold text-[#6D6D6D] uppercase tracking-wider">Fallback / Location City</label>
              <button
                type="button"
                onClick={() => setCityOpen(!cityOpen)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#ECE6DD] text-[#1E1E1E] font-bold text-xs flex justify-between items-center cursor-pointer shadow-sm hover:bg-[#FAF7F2]"
              >
                <span>{city}</span>
                <ChevronDown className="w-4 h-4 text-[#8B8B8B]" />
              </button>

              {cityOpen && (
                <div className="absolute top-[65px] left-0 right-0 z-50 bg-[#FFFFFF] border border-[#ECE6DD] p-2.5 rounded-xl shadow-md flex flex-wrap gap-1">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCity(c)
                        setCityOpen(false)
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border text-[9.5px] font-bold uppercase tracking-wider cursor-pointer ${
                        city === c
                          ? 'bg-[#FF7A30]/10 border-[#FF7A30] text-[#FF7A30]'
                          : 'bg-[#FAF7F2] border-[#ECE6DD] text-[#6D6D6D] hover:text-[#1E1E1E]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Food preferences chips */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-bold text-[#6D6D6D] uppercase tracking-wider">Cravings & Preference</label>
              <div className="flex flex-wrap gap-1 max-h-[110px] overflow-y-auto pr-1">
                {PREFERENCE_OPTIONS.map((opt) => {
                  const isSelected = cravings.includes(opt)
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleCraving(opt)}
                      className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FF7A30] border-transparent text-white font-extrabold shadow-sm'
                          : 'bg-[#FAF7F2] border-[#ECE6DD] text-[#6D6D6D] hover:bg-[#ECE6DD] hover:text-[#1E1E1E]'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Budget per person */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex justify-between items-center text-[9.5px] font-bold uppercase text-[#6D6D6D] tracking-wider">
                <span>Budget Per Person</span>
                <span className="text-[#FF7A30] font-black">₹{budgetVal}</span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="100"
                value={budgetVal}
                onChange={(e) => setBudgetVal(parseInt(e.target.value) || 200)}
                className="w-full h-1 bg-[#F4EFE8] rounded-lg appearance-none cursor-pointer accent-[#FF7A30]"
              />
              <div className="flex justify-between text-[8px] text-[#8B8B8B] font-bold">
                <span>₹200</span>
                <span>₹3000</span>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Footer controls */}
      <div className="flex items-center gap-3 border-t border-[#ECE6DD] pt-4">
        <Button
          variant="glass"
          size="sm"
          onClick={() => setScreen('selector')}
          className="flex-1 justify-center bg-[#F4EFE8] border-none text-[#1E1E1E] hover:bg-[#ECE6DD] text-[10px] font-black uppercase tracking-widest cursor-pointer py-3.5 shadow-sm active:scale-[0.98] transition-all"
        >
          Cancel
        </Button>
        <button
          onClick={handleContinue}
          className="flex-1 justify-center bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] text-white border-none text-[10px] font-black uppercase tracking-widest cursor-pointer py-3.5 rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-center font-sans"
        >
          Create Room
        </button>
      </div>

    </motion.div>
  )
}

export default CreateRoom
