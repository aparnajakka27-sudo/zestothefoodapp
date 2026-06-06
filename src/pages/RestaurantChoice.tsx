import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ChevronLeft, Check, X, Star } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import { Button } from '../components/ui/Button'
import { connectSocket } from '../services/socket'
import { fetchRestaurants } from '../services/googleMaps'

export const RestaurantChoice: React.FC = () => {
  const {
    restaurants,
    setSelectedRestaurant,
    setScreen,
    simulateFriendJoin,
    radiusVal,
    setRadiusVal,
    latitude,
    longitude,
    cravings,
    budgetVal,
    city
  } = useRoomStore()

  const [isLoading, setIsLoading] = useState(true)
  const [skippedIds, setSkippedIds] = useState<string[]>([])

  // Simulate skeleton loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const visibleRestaurants = restaurants.filter(r => !skippedIds.includes(r.id))

  const handleSelect = async (restaurant: any) => {
    setSelectedRestaurant(restaurant)

    // Generate room code and link
    const code = 'ZT' + Math.floor(100 + Math.random() * 900) + 'P'
    const link = `${window.location.origin}${window.location.pathname}?room=${code}`

    useRoomStore.setState({
      roomCode: code,
      inviteLink: link,
      members: [{ id: 'user', name: 'You (Host)', isReady: false, avatarColor: 'bg-[#FF7A30]', isUser: true }]
    })

    // Attempt Socket connection
    const socket = connectSocket('http://localhost:5000')
    let connected = false

    if (socket) {
      await new Promise<void>((resolve) => {
        const check = () => {
          if (socket.connected) {
            connected = true
            resolve()
          } else {
            setTimeout(resolve, 600)
          }
        }
        check()
      })
    }

    useRoomStore.setState({ screen: 'lobby', isMultiplayer: connected })

    if (connected && socket) {
      socket.emit('join-room', {
        roomCode: code,
        member: { id: 'user', name: 'You (Host)', isReady: false, avatarColor: 'bg-[#FF7A30]' }
      })
    } else {
      simulateFriendJoin()
    }
  }

  const handleSkip = (id: string) => {
    setSkippedIds(prev => [...prev, id])
  }

  const handleTryBiggerRadius = async () => {
    setIsLoading(true)
    let nextRadius = 5
    if (radiusVal === 2) nextRadius = 5
    else if (radiusVal === 5) nextRadius = 10
    else if (radiusVal === 10) nextRadius = 20
    else nextRadius = 20

    setRadiusVal(nextRadius)

    try {
      const results = await fetchRestaurants(
        latitude,
        longitude,
        nextRadius,
        cravings,
        budgetVal <= 500 ? '₹' : budgetVal <= 1500 ? '₹₹' : '₹₹₹',
        city
      )
      const filtered = results.filter(r => r.rating >= 4.0)
      useRoomStore.setState({ restaurants: filtered.length > 0 ? filtered : results })
    } catch (e) {
      console.error(e)
    }

    setTimeout(() => {
      setIsLoading(false)
      setSkippedIds([])
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto px-4 py-6 text-left relative z-10 flex flex-col gap-6 text-[#1E1E1E]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ECE6DD] pb-3">
        <button
          onClick={() => setScreen('create_room')}
          className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to config
        </button>
        <span className="text-[#8B8B8B] text-[10px] font-bold tracking-wider">
          Choose restaurant ({isLoading ? 'loading' : `${visibleRestaurants.length} matches`})
        </span>
      </div>

      <div>
        <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider block mb-1">
          Lobby search choice
        </span>
        <h1 className="text-2xl font-black text-[#1E1E1E] tracking-tight">
          Select restaurant for your squad
        </h1>
        <p className="text-[12px] text-[#6D6D6D] mt-2 font-medium">
          Choose a restaurant to lock the choice and start your lobby.
        </p>
      </div>

      {isLoading ? (
        // Premium Warm Loading Skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-[#FFFFFF] border border-[#ECE6DD] rounded-[24px] overflow-hidden h-[340px] flex flex-col justify-between animate-pulse shadow-sm">
              <div>
                <div className="h-40 bg-[#F4EFE8] w-full" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-[#F4EFE8] rounded w-1/2" />
                    <div className="h-4 bg-[#F4EFE8] rounded w-12" />
                  </div>
                  <div className="h-3 bg-[#F4EFE8] rounded w-3/4" />
                  <div className="h-3 bg-[#F4EFE8] rounded w-1/3 mt-2" />
                </div>
              </div>
              <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                <div className="h-9 bg-[#F4EFE8] rounded-xl" />
                <div className="h-9 bg-[#F4EFE8] rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : visibleRestaurants.length === 0 ? (
        // Empty State
        <div className="text-center py-16 bg-[#FFFFFF] border border-[#ECE6DD] rounded-[24px] flex flex-col items-center justify-center p-6 shadow-sm">
          <p className="text-[#6D6D6D] text-sm font-semibold mb-4">
            No restaurants found in this radius.
          </p>
          <button
            onClick={handleTryBiggerRadius}
            className="px-6 py-3 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.01] active:scale-[0.99] text-white border-none text-[11px] font-bold tracking-wider cursor-pointer shadow-md rounded-xl transition-all font-sans"
          >
            Try a bigger distance
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleRestaurants.map((r) => (
            <motion.div
              key={r.id}
              layout
              className="bg-[#FFFFFF] border border-[#ECE6DD] rounded-[24px] overflow-hidden shadow-sm flex flex-col justify-between hover:scale-[1.005] hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Cover Image */}
                <div className="h-40 w-full overflow-hidden border-b border-[#ECE6DD] relative">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-[#FF7A30] text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
                    {r.tags[0] || 'Food'}
                  </span>
                </div>

                {/* Content - Image Left Details Center */}
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-[#1E1E1E] tracking-wide truncate max-w-[200px]">{r.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#FF7A30]">
                      <Star className="w-3.5 h-3.5 fill-current" /> {r.rating} <span className="text-[10px] text-[#6D6D6D] font-normal">({r.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6D6D6D] leading-relaxed font-medium">
                    {r.description}
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold text-[#8B8B8B] mt-2 items-center">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF7A30]" /> {r.distance}
                    </span>
                    <span>•</span>
                    <span>{r.price} per person</span>
                    <span>•</span>
                    <span className={r.isOpen ? 'text-[#4CAF50]' : 'text-[#E85D5D]'}>
                      {r.isOpen ? 'Open now' : 'Closed'}
                    </span>
                  </div>

                  {/* Coupon Indicator */}
                  {r.discounts && (
                    <div className="mt-2.5 p-2 bg-[#FF7A30]/5 border border-[#FF7A30]/10 rounded-lg text-left text-[10px] font-bold text-[#FF7A30] tracking-wide flex items-center gap-1">
                      <span>🔥 {r.discounts}</span>
                    </div>
                  )}

                  {/* Popular items */}
                  {r.popularDishes && (
                    <div className="mt-3 pt-3 border-t border-[#ECE6DD] flex flex-wrap gap-1 items-center">
                      <span className="text-[9px] text-[#8B8B8B] font-bold tracking-wider mr-1">Famous dishes:</span>
                      {r.popularDishes.map((dish: string) => (
                        <span key={dish} className="text-[9px] font-medium text-[#6D6D6D] bg-[#F4EFE8] border border-[#ECE6DD] px-2 py-0.5 rounded">
                          {dish}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => handleSkip(r.id)}
                  className="justify-center bg-[#F4EFE8] hover:bg-[#ECE6DD] border-none text-[10px] font-bold tracking-wider text-[#6D6D6D] hover:text-[#1E1E1E] cursor-pointer shadow-sm active:scale-[0.98] transition-all py-2 rounded-xl"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Skip
                </Button>
                <button
                  onClick={() => handleSelect(r)}
                  className="justify-center py-2 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.02] active:scale-[0.98] text-white border-none text-[10px] font-bold tracking-wider cursor-pointer shadow-md rounded-xl transition-all flex items-center gap-1 font-sans"
                >
                  <Check className="w-3.5 h-3.5 text-white" /> Select
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </motion.div>
  )
}

export default RestaurantChoice
