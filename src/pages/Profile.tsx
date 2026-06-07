import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Edit3, ShieldAlert, Utensils, Flame, Trophy, 
  Wallet, Users, Calendar, ArrowRight, ShieldCheck, Heart, 
  Star, Lock, FileText, ChevronDown, ChevronUp
} from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import { Button } from '../components/ui/Button'

interface DetailedBill {
  id: string
  restaurant: string
  date: string
  friendsCount: number
  couponUsed: string
  discountApplied: string
  totalBill: string
  yourShare: string
  status: 'Paid' | 'Pending'
  breakdown: {
    foodSubtotal: string
    discounts: string
    couponSavings: string
    gst: string
    finalTotal: string
    perPerson: string
  }
}

export const Profile: React.FC = () => {
  const { user, guestName, previousScreen, setScreen, signOut, createRoom, setSelectedRestaurant, setGroupName, setPeopleCount, setRestaurantMode } = useRoomStore()
  const avatarUrl = user?.avatarUrl || (guestName ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(guestName)}` : `https://api.dicebear.com/7.x/lorelei/svg?seed=Guest`)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || guestName || 'Aparna Jakka')
  const [editUsername, setEditUsername] = useState(user?.username || 'aparnajakka')
  
  // Expanded bill breakdown modal tracking
  const [activeDetailBill, setActiveDetailBill] = useState<DetailedBill | null>(null)
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  const isGuest = !user

  // Visual level badge
  const foodLevelBadge = "🍽 Food Explorer"

  // Exact mock stats requested by the user
  const activeStats = [
    { id: 'stat-1', label: 'Restaurants visited', value: '43', icon: <Utensils className="w-4 h-4 text-[#FF7A30]" />, bg: 'bg-[#FF7A30]/5' },
    { id: 'stat-2', label: 'Dishes voted on', value: '124', icon: <Flame className="w-4 h-4 text-[#FF8C42]" />, bg: 'bg-[#FF8C42]/5' },
    { id: 'stat-3', label: 'Favorite cuisine', value: 'Biryani', icon: <Trophy className="w-4 h-4 text-amber-500" />, bg: 'bg-amber-500/5' },
    { id: 'stat-4', label: 'Money spent', value: '₹18,450', icon: <Wallet className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-500/5' },
    { id: 'stat-5', label: 'Bills split', value: '32', icon: <FileText className="w-4 h-4 text-indigo-500" />, bg: 'bg-indigo-500/5' },
    { id: 'stat-6', label: 'Rooms joined', value: '28', icon: <Users className="w-4 h-4 text-rose-500" />, bg: 'bg-rose-500/5' },
  ]

  // Mock visits with distance badge as requested
  const visitedHistory = [
    {
      id: 'visit-1',
      name: 'Paradise Biryani',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
      date: '2 days ago',
      spent: '₹1,240',
      distance: '2.5 km away',
      friends: 4,
      friendsList: ['Sam', 'Leo', 'Maya', 'Chloe'],
      dishes: 'Chicken Biryani, Coke, Raita',
      lat: 17.4483,
      lon: 78.3915
    },
    {
      id: 'visit-2',
      name: 'The Golden Wok',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
      date: '1 week ago',
      spent: '₹1,850',
      distance: '1.8 km away',
      friends: 3,
      friendsList: ['Rahul', 'Arjun', 'Neha'],
      dishes: 'Hakka Noodles, Spring Rolls, Chilli Chicken',
      lat: 17.4412,
      lon: 78.3821
    },
    {
      id: 'visit-3',
      name: 'La Piazza Pizzeria',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
      date: '3 weeks ago',
      spent: '₹2,420',
      distance: '3.1 km away',
      friends: 5,
      friendsList: ['Arjun', 'Kabir', 'Maya', 'Sam', 'Rahul'],
      dishes: 'Pepperoni Pizza, Garlic Bread, Pasta Alfredo',
      lat: 17.4325,
      lon: 78.4012
    }
  ]

  // Detailed mock bills for breakdown accordion/modal
  const billsHistory: DetailedBill[] = [
    {
      id: 'bill-1',
      restaurant: 'Paradise Biryani',
      date: 'June 04, 2026',
      friendsCount: 4,
      discountApplied: '10%',
      couponUsed: 'SAVE100',
      totalBill: '₹1,084',
      yourShare: '₹271',
      status: 'Paid',
      breakdown: {
        foodSubtotal: '₹1,260',
        discounts: '₹126',
        couponSavings: '₹100',
        gst: '₹50',
        finalTotal: '₹1,084',
        perPerson: '₹271'
      }
    },
    {
      id: 'bill-2',
      restaurant: 'The Golden Wok',
      date: 'May 30, 2026',
      friendsCount: 3,
      discountApplied: '10%',
      couponUsed: 'SAVE100',
      totalBill: '₹1,655',
      yourShare: '₹551',
      status: 'Paid',
      breakdown: {
        foodSubtotal: '₹1,850',
        discounts: '₹185',
        couponSavings: '₹100',
        gst: '₹90',
        finalTotal: '₹1,655',
        perPerson: '₹551'
      }
    },
    {
      id: 'bill-3',
      restaurant: 'Creamy Gelato Hub',
      date: 'May 22, 2026',
      friendsCount: 5,
      discountApplied: 'None',
      couponUsed: 'None',
      totalBill: '₹995',
      yourShare: '₹199',
      status: 'Pending',
      breakdown: {
        foodSubtotal: '₹950',
        discounts: '₹0',
        couponSavings: '₹0',
        gst: '₹45',
        finalTotal: '₹995',
        perPerson: '₹199'
      }
    }
  ]

  // Payments timeline tracking Paid, Pending, Upcoming splits
  const paymentsTimeline = [
    { id: 'pay-1', restaurant: 'Paradise Biryani', amount: '₹271', date: 'June 04, 2026', type: 'Paid', bg: 'border-emerald-500 text-emerald-600', iconBg: 'bg-emerald-50 text-emerald-600' },
    { id: 'pay-2', restaurant: 'The Golden Wok', amount: '₹551', date: 'May 30, 2026', type: 'Paid', bg: 'border-emerald-500 text-emerald-600', iconBg: 'bg-emerald-50 text-emerald-600' },
    { id: 'pay-3', restaurant: 'Creamy Gelato Hub', amount: '₹199', date: 'May 22, 2026', type: 'Pending', bg: 'border-amber-500 text-amber-600', iconBg: 'bg-amber-50 text-amber-600' },
    { id: 'pay-4', restaurant: 'Pizza Squad Social', amount: 'Est: ₹350', date: 'Scheduled June 10', type: 'Upcoming split', bg: 'border-indigo-400 text-indigo-600', iconBg: 'bg-indigo-50 text-indigo-600' }
  ]

  // Favorites board and quick reorder lists
  const favoritesRestaurants = [
    { name: 'Paradise Biryani', cuisine: 'Mughlai', rating: 4.7, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=150&q=80', description: 'Legendary clay-pot charcoal biryanis.', tags: ['Biryani', 'Mughlai'] },
    { name: 'La Piazza Pizzeria', cuisine: 'Italian', rating: 4.8, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80', description: 'Wood-fired oven neapolitan pizzas.', tags: ['Pizza', 'Italian'] }
  ]

  const favoritesDishes = [
    { name: 'Special Chicken Biryani', count: 14 },
    { name: 'Double Cheese Margherita', count: 9 },
    { name: 'Nutella Waffles', count: 7 }
  ]

  // Quick Reorder action configuration
  const handleQuickReorder = async (restName: string) => {
    // Prefill Zesto store and launch squad room configuration immediately
    setGroupName(`${restName} Squad 🍗`)
    setPeopleCount(4)
    setRestaurantMode('already_chose')
    
    // Set selected restaurant matching the favorite
    const matchingRest = favoritesRestaurants.find(r => r.name === restName)
    setSelectedRestaurant({
      id: `fav-rest-${Date.now()}`,
      name: restName,
      image: matchingRest?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      rating: matchingRest?.rating || 4.5,
      reviewsCount: 150,
      price: '₹₹',
      distance: '2.5 km away',
      description: matchingRest?.description || 'Your neighborhood favorite.',
      tags: matchingRest?.tags || ['Cafe'],
      matchPercentage: 98,
      loveCount: 0,
      fineCount: 0,
      preferNotCount: 0,
      hardPassCount: 0,
      isEliminated: false
    })
    
    await createRoom()
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-4 py-4 text-left relative z-10 flex flex-col gap-6 text-[#1E1E1E]">
      
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center z-10 border-b border-[#ECE6DD] pb-3">
        <button
          onClick={() => setScreen(previousScreen || 'landing')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer bg-white py-1.5 px-3.5 rounded-full border border-[#ECE6DD] shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <span className="text-[#8B8B8B] text-[10px] font-black tracking-wider uppercase">
          Zesto Personal Portal
        </span>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white border border-[#ECE6DD] rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 grid-bg pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#FF7A30]/5 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 z-10 text-center md:text-left">
          {/* Avatar Container */}
          <div className="relative group">
            <img 
              src={avatarUrl} 
              alt={user?.name || guestName || 'User'} 
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#FF7A30] object-cover shadow-sm bg-white transition-transform duration-300 group-hover:scale-105" 
            />
            
            {!isGuest && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="absolute bottom-0 right-0 p-1.5 bg-[#FF7A30] text-white rounded-full hover:bg-[#FF8C42] border-2 border-white shadow-sm cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Text Identity Info */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#1E1E1E]">
                {user?.name || guestName || 'Aparna Jakka'}
              </h2>
              {isGuest ? (
                <span className="bg-[#FAF7F2] text-[#6D6D6D] border border-[#ECE6DD] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Guest
                </span>
              ) : (
                <span className="bg-[#FF7A30]/10 text-[#FF7A30] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#FF7A30] stroke-[2.5]" /> Verified
                </span>
              )}
            </div>
            
            <p className="text-xs font-semibold text-[#6D6D6D]">
              @{user ? editUsername : 'aparnajakka'}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-3.5 text-[10.5px] font-bold text-[#8B8B8B] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF7A30]" />
                Joined {user ? 'June 2026' : 'Today'}
              </span>
              <span className="hidden sm:inline text-[#ECE6DD]">•</span>
              <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-100 font-black">
                {foodLevelBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Action triggers */}
        <div className="z-10 w-full md:w-auto flex flex-col gap-2.5">
          {isGuest ? (
            <Button 
              onClick={() => setScreen('login')}
              variant="primary" 
              size="md" 
              className="w-full md:w-auto font-bold py-2.5 px-6 rounded-full text-white bg-[#FF7A30] shadow-sm border-none transition-transform hover:scale-[1.02]"
            >
              Log In / Save Data
            </Button>
          ) : (
            <Button 
              onClick={signOut}
              variant="ghost" 
              size="sm" 
              className="w-full md:w-auto font-bold py-2 border-[#ECE6DD] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-full transition-all text-xs"
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>

      {/* Guest Limited Stats Warning Alert Banner */}
      {isGuest && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-50 border border-amber-100 rounded-[20px] flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-sm"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#FF7A30] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#1E1E1E]">Temporary Guest Session</h4>
              <p className="text-[10px] text-[#6D6D6D] font-medium leading-relaxed mt-0.5">
                Your statistics, rooms, and split histories will be deleted when you close this window. Continue with Google to keep a permanent history ledger.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setScreen('welcome')}
            className="flex items-center gap-1 text-[10px] font-black text-[#FF7A30] hover:text-[#FF8C42] shrink-0 uppercase tracking-wider transition-colors cursor-pointer"
          >
            Sign in now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Grid: Food Activity Stats */}
      <div className="flex flex-col gap-3">
        <span className="text-[10.5px] font-black text-[#6D6D6D] uppercase tracking-wider pl-1">
          Your Food Activity
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {activeStats.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-white border border-[#ECE6DD] p-4 rounded-2xl flex items-center gap-3.5 shadow-sm relative overflow-hidden"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-[#8B8B8B] font-bold block uppercase tracking-wider truncate">
                  {s.label}
                </span>
                <span className="text-base font-black text-[#1E1E1E] font-sans block mt-0.5">
                  {s.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Restaurant History Cards with details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
        
        {/* Left column: Visited history list */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="text-[10.5px] font-black text-[#6D6D6D] uppercase tracking-wider pl-1">
            Restaurants you've visited
          </span>
          
          <div className="flex flex-col gap-4">
            {visitedHistory.map((v) => (
              <div 
                key={v.id} 
                className="bg-white border border-[#ECE6DD] p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start shadow-sm hover:border-[#FF7A30]/20 transition-all"
              >
                <div className="w-full sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#ECE6DD] relative">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 bg-white/95 border border-[#ECE6DD] py-0.5 px-1.5 rounded-lg text-[8.5px] font-black text-[#FF7A30] shadow-sm">
                    {v.distance}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 text-left flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-black text-[#1E1E1E] tracking-tight">{v.name}</h3>
                      <button 
                        onClick={() => {
                          const detailedBillObj = billsHistory.find(b => b.restaurant === v.name)
                          if (detailedBillObj) {
                            setActiveDetailBill(detailedBillObj)
                          }
                        }}
                        className="text-[10px] font-black text-[#FF7A30] hover:text-[#FF8C42] transition-colors cursor-pointer border border-[#FF7A30]/20 hover:border-[#FF7A30]/40 rounded-full px-3 py-1 bg-[#FF7A30]/5 shadow-sm"
                      >
                        View Details
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider mt-1.5 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#FF7A30]" /> {v.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#FF7A30]" /> {v.friends} friends
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 font-sans font-bold">Spent {v.spent}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#ECE6DD] border-dashed text-[10px] text-[#6D6D6D] font-medium leading-relaxed">
                    Favorite dishes: <strong className="text-[#1E1E1E] font-bold">{v.dishes}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Past Bills Ledger, Payments timeline, and Favorites */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Section: Past Bills list */}
          <div className="flex flex-col gap-3">
            <span className="text-[10.5px] font-black text-[#6D6D6D] uppercase tracking-wider pl-1">
              Bill history
            </span>
            
            {isGuest ? (
              <div className="bg-[#FFFFFF]/60 backdrop-blur-[1.5px] border border-[#ECE6DD] p-8 rounded-2xl text-center flex flex-col items-center justify-center min-h-[180px] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] grid-bg" />
                <div className="w-10 h-10 rounded-full bg-[#ECE6DD] flex items-center justify-center text-[#6D6D6D] mb-3">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-[#1E1E1E] mb-1">Split Ledger Locked</h4>
                <p className="text-[9.5px] text-[#6D6D6D] font-semibold leading-relaxed max-w-[200px] mb-3 uppercase tracking-wide">
                  Sign in to view transaction history and bill split receipts.
                </p>
                <button 
                  onClick={() => setScreen('login')}
                  className="text-[10px] font-black text-[#FF7A30] hover:text-[#FF8C42] underline cursor-pointer"
                >
                  Create account
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {billsHistory.map((b) => {
                  const isExpanded = expandedBillId === b.id
                  return (
                    <div 
                      key={b.id} 
                      className={`bg-white border rounded-2xl p-4 shadow-sm transition-all duration-200 ${
                        isExpanded ? 'border-[#FF7A30]/30 bg-[#FF7A30]/[0.01]' : 'border-[#ECE6DD]'
                      }`}
                    >
                      <div 
                        onClick={() => setExpandedBillId(isExpanded ? null : b.id)}
                        className="flex justify-between items-start cursor-pointer select-none"
                      >
                        <div className="text-left min-w-0">
                          <h4 className="text-xs font-black text-[#1E1E1E] truncate max-w-[150px]">{b.restaurant}</h4>
                          <span className="text-[9px] text-[#8B8B8B] font-bold block mt-0.5">{b.date} • {b.friendsCount} friends</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-[#FF7A30] font-sans block">You paid: {b.yourShare}</span>
                          <span className="text-[8.5px] text-[#8B8B8B] font-bold block mt-0.5">Total bill: {b.totalBill}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-[#ECE6DD] border-dashed text-[9px] font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          b.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {b.status}
                        </span>
                        
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveDetailBill(b)
                            }}
                            className="text-[#FF7A30] hover:text-[#FF8C42] hover:underline text-[9.5px] font-black uppercase cursor-pointer"
                          >
                            View bill
                          </button>
                          <span className="text-[#ECE6DD] font-medium">|</span>
                          <button 
                            onClick={() => setExpandedBillId(isExpanded ? null : b.id)}
                            className="text-[#6D6D6D] hover:text-[#1E1E1E] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {isExpanded ? (
                              <>Collapse <ChevronUp className="w-3.5 h-3.5" /></>
                            ) : (
                              <>Quick breakdown <ChevronDown className="w-3.5 h-3.5" /></>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Accordion breakdown */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-3 pt-3 border-t border-[#ECE6DD]"
                          >
                            <div className="space-y-1.5 bg-[#FAF7F2] p-3 rounded-xl border border-[#ECE6DD] text-left">
                              <span className="text-[8.5px] text-[#8B8B8B] font-black uppercase tracking-wider block border-b border-[#ECE6DD] pb-1">Ledger Details</span>
                              <div className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
                                <span>Subtotal</span>
                                <span className="text-[#1E1E1E] font-sans">{b.breakdown.foodSubtotal}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold text-rose-500">
                                <span>Discounts ({b.discountApplied})</span>
                                <span className="font-sans">-{b.breakdown.discounts}</span>
                              </div>
                              {b.couponUsed !== 'None' && (
                                <div className="flex justify-between items-center text-[10px] font-bold text-emerald-600">
                                  <span>Coupon ({b.couponUsed})</span>
                                  <span className="font-sans">-{b.breakdown.couponSavings}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
                                <span>GST & service charges</span>
                                <span className="text-[#1E1E1E] font-sans">{b.breakdown.gst}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-black text-[#1E1E1E] border-t border-[#ECE6DD] border-dashed pt-1.5">
                                <span>Final Total bill</span>
                                <span className="font-sans text-[#FF7A30]">{b.breakdown.finalTotal}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Section: Payments ledger timeline */}
          <div className="flex flex-col gap-3">
            <span className="text-[10.5px] font-black text-[#6D6D6D] uppercase tracking-wider pl-1">
              Payments
            </span>
            <div className="bg-white border border-[#ECE6DD] p-4 rounded-2xl shadow-sm text-left">
              <div className="relative border-l border-[#ECE6DD] ml-3.5 pl-5 space-y-4">
                {paymentsTimeline.map((item) => (
                  <div key={item.id} className="relative">
                    {/* Circle icon marker */}
                    <div className="absolute -left-[30px] top-0.5 w-5 h-5 rounded-full border border-[#ECE6DD] bg-white flex items-center justify-center shadow-sm">
                      <div className={`w-2 h-2 rounded-full ${item.type === 'Paid' ? 'bg-emerald-500' : item.type === 'Pending' ? 'bg-amber-500' : 'bg-indigo-400'}`} />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[11px] font-black text-[#1E1E1E] leading-tight">{item.restaurant}</h4>
                        <span className="text-[9px] text-[#8B8B8B] font-bold block mt-0.5">{item.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-sans font-black text-[#1E1E1E] block">{item.amount}</span>
                        <span className={`text-[8px] font-black uppercase tracking-wider block mt-0.5 ${item.type === 'Paid' ? 'text-emerald-500' : item.type === 'Pending' ? 'text-amber-500' : 'text-indigo-400'}`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Favorites board */}
          {!isGuest && (
            <div className="flex flex-col gap-3">
              <span className="text-[10.5px] font-black text-[#6D6D6D] uppercase tracking-wider pl-1">
                Favorites
              </span>
              
              <div className="bg-white border border-[#ECE6DD] p-4 rounded-2xl flex flex-col gap-4 shadow-sm">
                
                {/* Favorite Restaurants list with quick reorder button */}
                <div>
                  <span className="text-[8.5px] text-[#8B8B8B] font-black uppercase tracking-wider block mb-2.5">Fav Restaurants</span>
                  <div className="space-y-3.5">
                    {favoritesRestaurants.map((r, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-[#ECE6DD] border-dashed pb-3 last:border-none last:pb-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={r.image} alt={r.name} className="w-9 h-9 rounded-xl object-cover border border-[#ECE6DD]" />
                          <div className="text-left min-w-0">
                            <span className="text-[11px] font-black text-[#1E1E1E] block truncate">{r.name}</span>
                            <span className="text-[9px] text-[#8B8B8B] font-bold block mt-0.5">{r.cuisine}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[8.5px] font-black text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded-lg border border-amber-500/10">
                            <Star className="w-3 h-3 fill-amber-500" /> {r.rating}
                          </div>
                          <button
                            onClick={() => handleQuickReorder(r.name)}
                            className="bg-[#FF7A30] hover:bg-[#FF8C42] border-none text-white text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer shadow-sm transition-transform hover:scale-105"
                          >
                            Reorder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Favorite Dishes tag board */}
                <div className="border-t border-[#ECE6DD] pt-3">
                  <span className="text-[8.5px] text-[#8B8B8B] font-black uppercase tracking-wider block mb-2">Fav Dishes (Ordered count)</span>
                  <div className="flex flex-wrap gap-2">
                    {favoritesDishes.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl text-[10px] font-bold text-[#1E1E1E] shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                        <Heart className="w-3 h-3 text-[#FF7A30] fill-[#FF7A30]" />
                        <span>{d.name}</span>
                        <span className="text-[#FF7A30] text-[9px] font-black bg-[#FF7A30]/10 px-1 rounded">{d.count}x</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bill Breakdown Overlay Modal */}
      <AnimatePresence>
        {activeDetailBill && (
          <div className="fixed inset-0 z-[110] flex justify-center items-center p-4 bg-black/45 backdrop-blur-[2px]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white border border-[#ECE6DD] rounded-[28px] p-6 text-left shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42]" />
              
              <div className="flex justify-between items-start mb-3 mt-1.5">
                <div>
                  <h3 className="text-base font-black text-[#1E1E1E] leading-tight">{activeDetailBill.restaurant}</h3>
                  <span className="text-[10px] text-[#8B8B8B] font-bold block mt-0.5">{activeDetailBill.date}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  activeDetailBill.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {activeDetailBill.status}
                </span>
              </div>

              {/* Detailed Breakdown receipt */}
              <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#ECE6DD] mt-4 font-sans text-xs">
                <span className="text-[8.5px] text-[#8B8B8B] font-black uppercase tracking-wider block border-b border-[#ECE6DD]/80 pb-1.5 mb-2.5">Detailed Receipt Split</span>
                
                <div className="flex justify-between items-center text-[#6D6D6D] font-medium">
                  <span>Food Subtotal</span>
                  <span className="text-[#1E1E1E] font-bold">{activeDetailBill.breakdown.foodSubtotal}</span>
                </div>
                
                <div className="flex justify-between items-center text-rose-500 font-medium">
                  <span>Discounts ({activeDetailBill.discountApplied})</span>
                  <span className="font-bold">-{activeDetailBill.breakdown.discounts}</span>
                </div>

                {activeDetailBill.couponUsed !== 'None' && (
                  <div className="flex justify-between items-center text-emerald-600 font-medium">
                    <span>Coupon Savings ({activeDetailBill.couponUsed})</span>
                    <span className="font-bold">-{activeDetailBill.breakdown.couponSavings}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#6D6D6D] font-medium">
                  <span>GST & Service Charge</span>
                  <span className="text-[#1E1E1E] font-bold">{activeDetailBill.breakdown.gst}</span>
                </div>

                <div className="border-t border-[#ECE6DD] border-dashed pt-3 mt-1.5 flex justify-between items-center text-[#1E1E1E] font-black text-sm">
                  <span>Final Total</span>
                  <span className="text-[#FF7A30]">{activeDetailBill.breakdown.finalTotal}</span>
                </div>

                <div className="border-t border-[#ECE6DD] border-dashed pt-3 mt-1.5 flex justify-between items-center text-[#6D6D6D] font-bold text-xs">
                  <span>Per Person share ({activeDetailBill.friendsCount} friends)</span>
                  <span className="text-[#1E1E1E] font-black text-sm">{activeDetailBill.breakdown.perPerson}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5 pt-1">
                <Button 
                  onClick={() => setActiveDetailBill(null)}
                  variant="primary" 
                  size="sm" 
                  className="font-bold px-5 py-2 text-white bg-[#FF7A30] border-none rounded-full shadow-sm cursor-pointer"
                >
                  Close Receipt
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal Dialog */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-black/35 backdrop-blur-[2px]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white border border-[#ECE6DD] rounded-[28px] p-6 text-left shadow-lg"
            >
              <h3 className="text-base font-black text-[#1E1E1E] mb-1.5">Edit Profile</h3>
              <p className="text-[10px] text-[#6D6D6D] font-semibold leading-relaxed mb-4 uppercase tracking-wide">
                Update your Zesto profile handle.
              </p>
              
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="text-left">
                  <label className="text-[10px] font-black text-[#1E1E1E] block mb-1 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl text-xs font-bold text-[#1E1E1E] focus:outline-none focus:border-[#FF7A30]"
                  />
                </div>
                
                <div className="text-left">
                  <label className="text-[10px] font-black text-[#1E1E1E] block mb-1 uppercase tracking-wider">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#6D6D6D] font-bold text-xs">@</span>
                    <input 
                      type="text" 
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      required
                      className="w-full pl-7 pr-3 py-2.5 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl text-xs font-bold text-[#1E1E1E] focus:outline-none focus:border-[#FF7A30]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-[#ECE6DD] rounded-full text-[10px] font-bold text-[#6D6D6D] hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-[#FF7A30] hover:bg-[#FF8C42] border-none rounded-full text-[10px] font-bold text-white shadow-sm cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Profile
