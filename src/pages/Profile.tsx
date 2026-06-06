import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Edit3, ShieldAlert, Utensils, Flame, Trophy, 
  Wallet, Users, Calendar, ArrowRight, ShieldCheck, Heart, 
  Star, Lock, FileText, ChevronDown, ChevronUp, Zap 
} from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import { Button } from '../components/ui/Button'


export const Profile: React.FC = () => {
  const { user, guestName, previousScreen, setScreen, signOut } = useRoomStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || guestName || '')
  const [editUsername, setEditUsername] = useState(user?.username || 'foodie_squad')
  
  // Expanded bill accordion index tracking
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate save by updating local states & closing modal
    setIsEditing(false)
  }

  const isGuest = !user

  // Mock data for logged-in users
  const loggedInHistory = {
    stats: [
      { id: 'stat-1', label: 'Restaurants visited', value: '34', icon: <Utensils className="w-4 h-4 text-[#FF7A30]" />, bg: 'bg-[#FF7A30]/5' },
      { id: 'stat-2', label: 'Dishes voted on', value: '126', icon: <Flame className="w-4 h-4 text-[#FF8C42]" />, bg: 'bg-[#FF8C42]/5' },
      { id: 'stat-3', label: 'Most selected cuisine', value: 'Biryani', icon: <Trophy className="w-4 h-4 text-amber-500" />, bg: 'bg-amber-500/5' },
      { id: 'stat-4', label: 'Total spent', value: '₹12,450', icon: <Wallet className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-500/5' },
      { id: 'stat-5', label: 'Total bills split', value: '18', icon: <FileText className="w-4 h-4 text-indigo-500" />, bg: 'bg-indigo-500/5' },
      { id: 'stat-6', label: 'Rooms joined', value: '23', icon: <Users className="w-4 h-4 text-rose-500" />, bg: 'bg-rose-500/5' },
    ],
    visits: [
      {
        id: 'visit-1',
        name: 'Paradise Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
        date: '2 days ago',
        spent: '₹1,240',
        friends: 4,
        friendsList: ['Sam', 'Leo', 'Maya', 'Chloe'],
        dishes: 'Chicken Biryani, Coke, Raita',
      },
      {
        id: 'visit-2',
        name: 'The Golden Wok',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
        date: '1 week ago',
        spent: '₹1,850',
        friends: 3,
        friendsList: ['Rahul', 'Arjun', 'Neha'],
        dishes: 'Hakka Noodles, Spring Rolls, Chilli Chicken',
      },
      {
        id: 'visit-3',
        name: 'La Piazza Pizzeria',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
        date: '3 weeks ago',
        spent: '₹2,420',
        friends: 5,
        friendsList: ['Arjun', 'Kabir', 'Maya', 'Sam', 'Rahul'],
        dishes: 'Pepperoni Pizza, Garlic Bread, Pasta Alfredo',
      }
    ],
    bills: [
      {
        id: 'bill-1',
        restaurant: 'Paradise Biryani',
        date: 'June 04, 2026',
        friendsCount: 4,
        discountUsed: 'SQUAD300',
        totalBill: '₹1,240',
        yourShare: '₹310',
        status: 'Paid',
        breakdown: [
          { name: 'Chicken Biryani (Large) x2', price: '₹780' },
          { name: 'Double Cheese Margherita x1', price: '₹320' },
          { name: 'Coke Bottle 1L x1', price: '₹90' },
          { name: 'GST & Taxes', price: '₹50' }
        ]
      },
      {
        id: 'bill-2',
        restaurant: 'The Golden Wok',
        date: 'May 30, 2026',
        friendsCount: 3,
        discountUsed: 'SAVE100',
        totalBill: '₹1,850',
        yourShare: '₹616',
        status: 'Paid',
        breakdown: [
          { name: 'Hakka Noodles x2', price: '₹480' },
          { name: 'Chilli Chicken x1', price: '₹360' },
          { name: 'Veg Spring Rolls x2', price: '₹280' },
          { name: 'Mocktails Pitcher x1', price: '₹640' },
          { name: 'GST & Service Charge', price: '₹90' }
        ]
      },
      {
        id: 'bill-3',
        restaurant: 'Creamy Gelato Hub',
        date: 'May 22, 2026',
        friendsCount: 5,
        discountUsed: 'None',
        totalBill: '₹950',
        yourShare: '₹190',
        status: 'Pending',
        breakdown: [
          { name: 'Choco Fudge Sundae x2', price: '₹420' },
          { name: 'Waffle with Ice Cream x2', price: '₹380' },
          { name: 'Mango Gelato Scoop x1', price: '₹150' }
        ]
      }
    ],
    favorites: {
      restaurants: [
        { name: 'Paradise Biryani', cuisine: 'Mughlai', rating: 4.7, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=150&q=80' },
        { name: 'La Piazza Pizzeria', cuisine: 'Italian', rating: 4.8, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80' }
      ],
      dishes: [
        { name: 'Special Chicken Biryani', count: 14 },
        { name: 'Double Cheese Margherita', count: 9 },
        { name: 'Nutella Waffles', count: 7 }
      ]
    }
  }

  // Mock data for guests (temporary/limited view)
  const guestHistory = {
    stats: [
      { id: 'stat-1', label: 'Restaurants visited', value: '1', icon: <Utensils className="w-4 h-4 text-[#FF7A30]" />, bg: 'bg-[#FF7A30]/5' },
      { id: 'stat-2', label: 'Dishes voted on', value: '8', icon: <Flame className="w-4 h-4 text-[#FF8C42]" />, bg: 'bg-[#FF8C42]/5' },
      { id: 'stat-3', label: 'Most selected cuisine', value: 'Burger', icon: <Trophy className="w-4 h-4 text-amber-500" />, bg: 'bg-amber-500/5' },
      { id: 'stat-4', label: 'Total spent', value: '₹420', icon: <Wallet className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-500/5' },
      { id: 'stat-5', label: 'Total bills split', value: '0', icon: <FileText className="w-4 h-4 text-[#8B8B8B]" />, bg: 'bg-[#8B8B8B]/5' },
      { id: 'stat-6', label: 'Rooms joined', value: '1', icon: <Users className="w-4 h-4 text-[#8B8B8B]" />, bg: 'bg-[#8B8B8B]/5' },
    ],
    visits: [
      {
        id: 'visit-guest-1',
        name: 'The Burger Club (Active Session)',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        date: 'Today',
        spent: '₹420',
        friends: 2,
        friendsList: ['Sam', 'You'],
        dishes: 'Cheeseburger x1, Fries x1',
      }
    ],
    bills: [],
    favorites: {
      restaurants: [],
      dishes: []
    }
  }

  const activeHistory = isGuest ? guestHistory : loggedInHistory
  
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
          Zesto personal portal
        </span>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white border border-[#ECE6DD] rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm relative overflow-hidden">
        
        {/* Subtle grid and accent background overlay */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 grid-bg pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#FF7A30]/5 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 z-10 text-center md:text-left">
          {/* Avatar Container */}
          <div className="relative group">
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#FF7A30] object-cover shadow-sm bg-[#FAF7F2]" 
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#FF7A30] to-[#FF8C42] text-white flex items-center justify-center font-black text-2xl uppercase border-4 border-white shadow-md">
                {((user?.name || guestName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2))}
              </div>
            )}
            
            {!isGuest && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="absolute bottom-0 right-0 p-1.5 bg-[#FF7A30] text-white rounded-full hover:bg-[#FF8C42] border-2 border-white shadow-sm cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Text Identity Info */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#1E1E1E]">
                {user?.name || guestName || 'Anonymous Guest'}
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
              @{user ? editUsername : 'guest_member'}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-3.5 text-[10.5px] font-bold text-[#8B8B8B] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF7A30]" />
                Joined {user ? 'June 2026' : 'Today'}
              </span>
              <span className="hidden sm:inline text-[#ECE6DD]">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#FF7A30]" />
                {isGuest ? '1 room' : '23 food rooms'} joined
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
              className="w-full md:w-auto font-bold py-2.5 px-6 rounded-full text-white bg-[#FF7A30] shadow-sm border-none"
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

      {/* Grid: Stats & Activity Activity */}
      <div className="flex flex-col gap-3">
        <span className="text-[10.5px] font-black text-[#6D6D6D] uppercase tracking-wider pl-1">
          Your food activity
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {activeHistory.stats.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.015, y: -2 }}
              transition={{ duration: 0.2 }}
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

      {/* Split details section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
        
        {/* Left column: Visit history */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="text-[10.5px] font-black text-[#6D6D6D] uppercase tracking-wider pl-1">
            Restaurants you've visited
          </span>
          
          <div className="flex flex-col gap-4">
            {activeHistory.visits.map((v) => (
              <div 
                key={v.id} 
                className="bg-white border border-[#ECE6DD] p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start shadow-sm"
              >
                {/* Image */}
                <div className="w-full sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#ECE6DD] relative">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Information content */}
                <div className="flex-1 min-w-0 text-left flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#1E1E1E] tracking-tight">{v.name}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider mt-1.5 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#FF7A30]" /> {v.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#FF7A30]" /> {v.friends} friends
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 font-sans">Spent {v.spent}</span>
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

        {/* Right column: Past Bills Ledger & Favorites */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Section: Past Bills */}
          <div className="flex flex-col gap-3">
            <span className="text-[10.5px] font-black text-[#6D6D6D] uppercase tracking-wider pl-1">
              Past bills
            </span>
            
            {isGuest ? (
              /* Lock overlay for Guest accounts */
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
              /* Real bill accordion logic */
              <div className="flex flex-col gap-3">
                {activeHistory.bills.map((b) => {
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
                          b.status === 'Paid' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {b.status}
                        </span>
                        
                        <button 
                          onClick={() => setExpandedBillId(isExpanded ? null : b.id)}
                          className="text-[#6D6D6D] hover:text-[#1E1E1E] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {isExpanded ? (
                            <>Collapse <ChevronUp className="w-3.5 h-3.5" /></>
                          ) : (
                            <>View breakdown <ChevronDown className="w-3.5 h-3.5" /></>
                          )}
                        </button>
                      </div>

                      {/* Accordion content */}
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
                              {b.breakdown.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D]">
                                  <span>{item.name}</span>
                                  <span className="text-[#1E1E1E] font-sans">{item.price}</span>
                                </div>
                              ))}
                              {b.discountUsed !== 'None' && (
                                <div className="flex justify-between items-center text-[10px] font-black text-[#4CAF50] border-t border-[#ECE6DD] border-dashed pt-1.5">
                                  <span>Discount ({b.discountUsed})</span>
                                  <span>- 10%</span>
                                </div>
                              )}
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

          {/* Section: Favorites */}
          {!isGuest && (
            <div className="flex flex-col gap-3">
              <span className="text-[10.5px] font-black text-[#6D6D6D] uppercase tracking-wider pl-1">
                Favorites
              </span>
              
              <div className="bg-white border border-[#ECE6DD] p-4 rounded-2xl flex flex-col gap-4 shadow-sm">
                
                {/* Favorite Restaurants */}
                <div>
                  <span className="text-[8.5px] text-[#8B8B8B] font-black uppercase tracking-wider block mb-2.5">Fav Restaurants</span>
                  <div className="space-y-2">
                    {activeHistory.favorites.restaurants.map((r, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-[#ECE6DD] border-dashed pb-2 last:border-none last:pb-0">
                        <div className="flex items-center gap-2">
                          <img src={r.image} alt={r.name} className="w-8 h-8 rounded-lg object-cover border border-[#ECE6DD]" />
                          <div className="text-left">
                            <span className="text-[11px] font-black text-[#1E1E1E] block">{r.name}</span>
                            <span className="text-[9px] text-[#8B8B8B] font-bold block">{r.cuisine}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-lg border border-amber-500/10">
                          <Star className="w-3 h-3 fill-amber-500" /> {r.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Favorite Dishes */}
                <div className="border-t border-[#ECE6DD] pt-3">
                  <span className="text-[8.5px] text-[#8B8B8B] font-black uppercase tracking-wider block mb-2">Fav Dishes (Ordered count)</span>
                  <div className="flex flex-wrap gap-2">
                    {activeHistory.favorites.dishes.map((d, i) => (
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
