import { create } from 'zustand'
import type { RoomScreen, Member, Restaurant, Dish, Message } from '../types'
import { fetchRestaurants, fetchRestaurantMenu } from '../services/googleMaps'
import { connectSocket, getSocket } from '../services/socket'
import { authService } from './authService'
import type { AuthUser } from './authService'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

interface RoomState {
  // Screen state
  screen: RoomScreen
  previousScreen: RoomScreen | null
  validationError: string | null

  // Room creation input details
  groupName: string
  peopleCount: number // Range 2-20
  restaurantMode: 'already_chose' | 'help_decide'

  // Option A (already chosen) details
  searchQuery: string // Search input
  selectedRestaurant: Restaurant | null

  // Option B (help us decide) details
  city: string
  cravings: string[]
  budgetVal: number // Range 200 to 3000
  radiusVal: number // Range 1 to 20

  // Location / GPS Details
  latitude: number | null
  longitude: number | null
  locationPermission: 'prompt' | 'requesting' | 'granted' | 'denied'
  detectedAreaName: string | null

  // Optional Authentication
  user: AuthUser | null
  authLoading: boolean
  authError: string | null
  guestName: string | null
  onboardingNextScreen: 'create_room' | 'join_room' | null
  pendingRoomCode: string | null
  setGuestName: (name: string) => void
  setPendingRoomCode: (code: string | null) => void

  // Group Chat & Profile Activity
  chatMessages: Message[]
  chatDrawerOpen: boolean
  isFriendTyping: string | null
  unreadChatCount: number
  sendChatMessage: (text?: string, sticker?: string) => void
  toggleChatDrawer: (val?: boolean) => void
  simulateFriendChatActivity: () => void

  // Lobby code & sharing
  roomCode: string
  inviteLink: string
  members: Member[]
  isMultiplayer: boolean

  // Choice options
  restaurants: Restaurant[] // maximum 50, minimum rating 4.0+

  // Menu Selection UI
  showFoodOnboarding: boolean
  dishes: Dish[] // Auto filtered menu based on group preferences
  selections: Record<string, string[]> // memberId -> Array of dishIds
  
  // Group Voting Round
  dishVotes: Record<string, Record<string, 'continue' | 'skip'>> // dishId -> { userId -> 'continue' | 'skip' }
  voteStatusLogs: string[]

  // Bill Split Engine
  splitType: 'equal' | 'custom'
  customSplitShares: Record<string, number> // memberId -> amount in Rupees
  appliedCoupon: string | null

  // Actions
  setScreen: (screen: RoomScreen) => void
  openSelector: () => void
  closeFlow: () => void
  startCreateRoom: () => void
  startJoinRoom: () => void
  setGroupName: (name: string) => void
  setPeopleCount: (count: number) => void
  setRestaurantMode: (mode: 'already_chose' | 'help_decide') => void
  setSearchQuery: (query: string) => void
  setSelectedRestaurant: (restaurant: Restaurant | null) => void
  setCity: (city: string) => void
  toggleCraving: (craving: string) => void
  setBudgetVal: (val: number) => void
  setRadiusVal: (val: number) => void
  createRoom: () => Promise<void>
  joinRoom: (code: string) => Promise<void>
  setReady: (userId: string, isReady: boolean) => void
  startFoodSelection: () => void
  toggleDishSelection: (memberId: string, dishId: string) => void
  setShowFoodOnboarding: (val: boolean) => void
  castGroupVote: (dishId: string, vote: 'continue' | 'skip') => void
  confirmVotingRound: () => void
  setSplitType: (type: 'equal' | 'custom') => void
  updateCustomSplitShare: (memberId: string, amount: number) => void
  applyCoupon: (code: string | null) => void
  confirmFoodSelections: () => void
  resetRound: () => void

  // Simulation helpers
  simulateFriendJoin: () => void
  simulateFriendReady: () => void
  simulateFriendVotes: () => void
  signUpWithEmail: (fullName: string, email: string, password: string, username?: string) => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  requestLocation: () => Promise<void>
}

const FRIEND_NAMES = ['Rahul', 'Sam', 'Arjun', 'Maya', 'Leo', 'Chloe', 'Neha', 'Kabir']
const FRIEND_COLORS = [
  'bg-rose-500',
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-cyan-500',
]

const setupSocketListeners = (socket: any, set: any, get: any) => {
  socket.off('lobby-updated')
  socket.off('lobby-ready')
  socket.off('start-menu-battle')

  socket.on('lobby-updated', (members: Member[]) => {
    const currentUserId = 'user'
    const mapped = members.map(m => ({
      ...m,
      isUser: m.id === currentUserId
    }))
    set({ members: mapped })
  })

  socket.on('lobby-ready', () => {
    // Automatically signal readiness in multiplayer if everyone is ready
  })

  socket.on('start-menu-battle', ({ selectedRestaurant, dishes }: { selectedRestaurant: Restaurant, dishes: Dish[] }) => {
    const groupPreferences = get().cravings
    
    // Auto filter menu based on preference tags
    const filtered = dishes.filter(dish => {
      // Show if dish matches cravings (veg, non-veg, specific tag matching, or is popular)
      const matchesCravings = groupPreferences.some((pref: string) => 
        dish.name.toLowerCase().includes(pref.toLowerCase()) ||
        (pref === 'Veg' && dish.isVeg) ||
        (pref === 'Non Veg' && !dish.isVeg) ||
        (pref === 'Spicy' && (dish.spiceLevel === 'Hot' || dish.spiceLevel === 'Insane'))
      )
      // Fallback: show popular items if there are no exact cravings matches
      return matchesCravings || dish.popularTag
    }).slice(0, 10) // Limit to top 10 recommended dishes

    set({
      screen: 'food_selection',
      selectedRestaurant,
      dishes: filtered.length > 0 ? filtered : dishes.slice(0, 8),
      selections: { user: [] }
    })
  })
}

export const useRoomStore = create<RoomState>((set, get) => ({
  screen: 'landing',
  previousScreen: null,
  validationError: null,

  groupName: '',
  peopleCount: 4,
  restaurantMode: 'already_chose',

  searchQuery: '',
  selectedRestaurant: null,

  city: 'Hyderabad',
  cravings: [],
  budgetVal: 800,
  radiusVal: 5,

  latitude: null,
  longitude: null,
  locationPermission: 'prompt',
  detectedAreaName: null,
  user: authService.getCurrentUser(),
  authLoading: false,
  authError: null,
  guestName: localStorage.getItem('zesto_guest_name') || null,
  onboardingNextScreen: null,
  pendingRoomCode: null,

  // Group Chat initial state
  chatMessages: [
    {
      id: 'system-1',
      senderId: 'system',
      senderName: 'System',
      avatarColor: 'bg-[#FF7A30]',
      text: 'Food Squad lobby created! Start adding dishes to decide what to eat.',
      timestamp: new Date().toISOString(),
      isSystem: true
    }
  ],
  chatDrawerOpen: false,
  isFriendTyping: null,
  unreadChatCount: 0,

  roomCode: '',
  inviteLink: '',
  members: [],
  isMultiplayer: false,

  restaurants: [],
  showFoodOnboarding: true,
  dishes: [],
  selections: {},
  
  dishVotes: {},
  voteStatusLogs: [],

  splitType: 'equal',
  customSplitShares: {},
  appliedCoupon: null,

  setScreen: (screen) => set((state) => {
    const wasAuth = state.screen === 'login' || state.screen === 'signup' || state.screen === 'forgot_password'
    return {
      previousScreen: wasAuth ? state.previousScreen : state.screen,
      screen
    }
  }),
  setGuestName: (guestName) => {
    localStorage.setItem('zesto_guest_name', guestName)
    set({ guestName })
  },
  setPendingRoomCode: (pendingRoomCode) => set({ pendingRoomCode }),
  
  toggleChatDrawer: (val) => set((state) => {
    const nextVal = val !== undefined ? val : !state.chatDrawerOpen
    return { 
      chatDrawerOpen: nextVal, 
      unreadChatCount: nextVal ? 0 : state.unreadChatCount 
    }
  }),

  sendChatMessage: (text, sticker) => {
    const state = get()
    const currentUser = state.user
    const guest = state.guestName
    
    if (!currentUser && !guest) return
    
    const senderName = currentUser ? currentUser.name : guest || 'You'
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName,
      avatarColor: 'bg-[#FF7A30]',
      text,
      sticker,
      timestamp: new Date().toISOString()
    }
    
    set((state) => ({
      chatMessages: [...state.chatMessages, newMessage],
      unreadChatCount: 0
    }))
    
    // Auto simulate friend responses after user message
    setTimeout(() => {
      get().simulateFriendChatActivity()
    }, 1500)
  },

  simulateFriendChatActivity: () => {
    const state = get()
    if (state.screen === 'landing') return
    
    const activeMembers = state.members.filter(m => !m.isUser)
    if (activeMembers.length === 0) return
    
    const randomFriend = activeMembers[Math.floor(Math.random() * activeMembers.length)]
    
    // Trigger typing indicator
    set({ isFriendTyping: `${randomFriend.name} is typing...` })
    
    setTimeout(() => {
      const phrases = [
        "Bro order this Chicken Biryani, I'm starving! 🤤",
        "Must try the Butter Chicken from Mehfil!",
        "Skip the soup guys, let's get main course.",
        "Too expensive? I have a coupon SQUAD300!",
        "Order more naans, 4 naans won't be enough.",
        "Paneer is fine for me, but let's add some non-veg too.",
        "Is anyone veg? Let's check.",
        "I'm okay with anything, you guys decide!"
      ]
      
      const stickers = [
        '🍗 "Bro order this"',
        '🔥 "Must try"',
        '😭 "Too expensive"',
        '🤤 "Looks tasty"',
        '🍽 "I’m hungry"',
        '😤 "Stop changing dishes"',
        '😂 "Anything is fine"'
      ]
      
      const sendSticker = Math.random() > 0.6
      const randomText = sendSticker ? undefined : phrases[Math.floor(Math.random() * phrases.length)]
      const randomSticker = sendSticker ? stickers[Math.floor(Math.random() * stickers.length)] : undefined
      
      const friendMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: randomFriend.id,
        senderName: randomFriend.name,
        avatarColor: randomFriend.avatarColor,
        text: randomText,
        sticker: randomSticker,
        timestamp: new Date().toISOString()
      }
      
      set((state) => ({
        chatMessages: [...state.chatMessages, friendMessage],
        isFriendTyping: null,
        unreadChatCount: state.chatDrawerOpen ? 0 : state.unreadChatCount + 1
      }))
    }, 1500 + Math.random() * 1000)
  },
  openSelector: () => set({ screen: 'selector', validationError: null }),
  closeFlow: () => set({ screen: 'landing', validationError: null }),
  startCreateRoom: () => {
    const state = get()
    if (state.user || state.guestName) {
      set({ screen: 'create_room', validationError: null })
    } else {
      set({ screen: 'welcome', onboardingNextScreen: 'create_room', validationError: null })
    }
  },
  startJoinRoom: () => {
    const state = get()
    if (state.user || state.guestName) {
      set({ screen: 'join_room', validationError: null })
    } else {
      set({ screen: 'welcome', onboardingNextScreen: 'join_room', validationError: null })
    }
  },

  setGroupName: (groupName) => set({ groupName, validationError: null }),
  setPeopleCount: (peopleCount) => set({ peopleCount, validationError: null }),
  setRestaurantMode: (restaurantMode) => set({ restaurantMode, selectedRestaurant: null, validationError: null }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedRestaurant: (selectedRestaurant) => set({ selectedRestaurant, validationError: null }),
  setCity: (city) => set({ city, validationError: null }),
  
  toggleCraving: (craving) => set((state) => {
    const isSelected = state.cravings.includes(craving)
    const newCravings = isSelected 
      ? state.cravings.filter((c) => c !== craving) 
      : [...state.cravings, craving]
    return { cravings: newCravings, validationError: null }
  }),

  setBudgetVal: (budgetVal) => set({ budgetVal }),
  setRadiusVal: (radiusVal) => set({ radiusVal }),

  createRoom: async () => {
    const state = get()
    if (!state.groupName.trim()) {
      set({ validationError: 'Group name is required' })
      return
    }
    if (!state.peopleCount) {
      set({ validationError: 'Number of friends is required' })
      return
    }

    // Generate room code and link
    const code = 'ZT' + Math.floor(100 + Math.random() * 900) + 'P'
    const link = `${window.location.origin}${window.location.pathname}?room=${code}`

    const hostName = state.user 
      ? `${state.user.name} (Host)` 
      : state.guestName 
        ? `${state.guestName} (Host)` 
        : 'You (Host)'
    set({
      roomCode: code,
      inviteLink: link,
      members: [{ id: 'user', name: hostName, isReady: false, avatarColor: 'bg-[#FF7A30]', isUser: true }],
      validationError: null
    })

    // OPTION A: Already chose
    if (state.restaurantMode === 'already_chose') {
      if (!state.selectedRestaurant) {
        set({ validationError: 'Please search and select a restaurant' })
        return
      }
      
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

      set({ screen: 'lobby', isMultiplayer: connected })

      if (connected && socket) {
        setupSocketListeners(socket, set, get)
        socket.emit('join-room', {
          roomCode: code,
          member: { id: 'user', name: 'You (Host)', isReady: false, avatarColor: 'bg-[#FF7E40]' }
        })
      } else {
        get().simulateFriendJoin()
      }
    } 
    // OPTION B: Help choose
    else {
      // Transition to Restaurant Choice Grid Screen
      // Fetch matching restaurants
      const results = await fetchRestaurants(
        state.latitude,
        state.longitude,
        state.radiusVal,
        state.cravings,
        state.budgetVal <= 500 ? '₹' : state.budgetVal <= 1500 ? '₹₹' : '₹₹₹',
        state.city
      )

      // Filter: only show restaurants with rating >= 4.0
      const filteredResults = results.filter(r => r.rating >= 4.0)
      
      set({
        restaurants: filteredResults.length > 0 ? filteredResults : results,
        screen: 'restaurant_choice'
      })
    }
  },

  joinRoom: async (code) => {
    const state = get()
    if (!state.user && !state.guestName) {
      set({ pendingRoomCode: code.toUpperCase(), onboardingNextScreen: 'join_room', screen: 'welcome' })
      return
    }

    const cleanedCode = code.toUpperCase()
    const link = `${window.location.origin}${window.location.pathname}?room=${cleanedCode}`
    
    const currentUser = get().user
    const currentGuest = get().guestName
    const uName = currentUser ? currentUser.name : currentGuest ? currentGuest : 'You'
    set({
      roomCode: cleanedCode,
      inviteLink: link,
      screen: 'lobby',
      groupName: 'Food Squad',
      peopleCount: 4,
      members: [
        { id: 'user', name: uName, isReady: false, avatarColor: 'bg-[#FF7A30]', isUser: true },
      ],
      restaurants: [],
      selectedRestaurant: {
        id: 'rest-join-1',
        name: 'The Premium Kitchen',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        rating: 4.7,
        reviewsCount: 1200,
        price: '₹₹',
        distance: '2.5 km away',
        description: 'A beautiful dining setup for food squads.',
        tags: ['Cafe', 'Mid Range'],
        matchPercentage: 92,
        loveCount: 0,
        fineCount: 0,
        preferNotCount: 0,
        hardPassCount: 0,
        isEliminated: false,
        discounts: '20% OFF'
      },
      isMultiplayer: false
    })

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

    if (connected && socket) {
      set({ isMultiplayer: true })
      setupSocketListeners(socket, set, get)
      socket.emit('join-room', {
        roomCode: cleanedCode,
        member: { id: 'user', name: uName, isReady: false, avatarColor: 'bg-[#FF7A30]' }
      })
    } else {
      set({
        members: [
          { id: 'creator', name: 'Sam (Host)', isReady: true, avatarColor: 'bg-emerald-500', isUser: false },
          { id: 'user', name: uName, isReady: false, avatarColor: 'bg-[#FF7A30]', isUser: true },
        ]
      })
      get().simulateFriendJoin()
    }
  },

  setReady: (userId, isReady) => {
    const state = get()
    if (state.isMultiplayer) {
      const socket = getSocket()
      if (socket) {
        socket.emit('set-ready', { roomCode: state.roomCode, userId, isReady })
      }
    } else {
      set((state) => {
        const updatedMembers = state.members.map((m) => 
          m.id === userId ? { ...m, isReady } : m
        )
        return { members: updatedMembers }
      })
    }
  },

  startFoodSelection: () => {
    const state = get()
    if (!state.selectedRestaurant) return

    const menu = fetchRestaurantMenu(state.selectedRestaurant.name)
    
    if (state.isMultiplayer) {
      const socket = getSocket()
      if (socket) {
        socket.emit('confirm-restaurant', {
          roomCode: state.roomCode,
          selectedRestaurant: state.selectedRestaurant,
          dishes: menu
        })
      }
    } else {
      // Local simulation
      const groupPreferences = state.cravings
      const filtered = menu.filter(dish => {
        const matchesCravings = groupPreferences.some(pref => 
          dish.name.toLowerCase().includes(pref.toLowerCase()) ||
          (pref === 'Veg' && dish.isVeg) ||
          (pref === 'Non Veg' && !dish.isVeg) ||
          (pref === 'Spicy' && (dish.spiceLevel === 'Hot' || dish.spiceLevel === 'Insane'))
        )
        return matchesCravings || dish.popularTag
      }).slice(0, 10)

      set({
        screen: 'food_selection',
        dishes: filtered.length > 0 ? filtered : menu.slice(0, 8),
        selections: { user: [] }
      })
    }
  },

  toggleDishSelection: (memberId, dishId) => {
    set((state) => {
      const current = state.selections[memberId] || []
      const updated = current.includes(dishId)
        ? current.filter(id => id !== dishId)
        : [...current, dishId]
      
      return {
        selections: {
          ...state.selections,
          [memberId]: updated
        }
      }
    })
  },

  setShowFoodOnboarding: (showFoodOnboarding) => set({ showFoodOnboarding }),

  castGroupVote: (dishId, vote) => {
    set((state) => {
      const currentVotes = state.dishVotes[dishId] || {}
      const updatedVotes = { ...currentVotes, user: vote }
      const newDishVotes = { ...state.dishVotes, [dishId]: updatedVotes }
      
      const dishName = state.dishes.find(d => d.id === dishId)?.name || 'Dish'
      const newLogs = [...state.voteStatusLogs, `You voted to ${vote === 'continue' ? 'Keep' : 'Skip'} "${dishName}"`]
      return { dishVotes: newDishVotes, voteStatusLogs: newLogs }
    })
    
    // Broadcast via socket if multiplayer
    const state = get()
    if (state.isMultiplayer) {
      const socket = getSocket()
      if (socket) {
        socket.emit('cast-group-dish-vote', { roomCode: state.roomCode, userId: 'user', dishId, vote })
      }
    } else {
      // Simulate other members voting shortly after
      setTimeout(() => {
        get().simulateFriendVotes()
      }, 400)
    }
  },

  confirmVotingRound: () => {
    const state = get()
    const allSelectedDishes = Object.values(state.selections).flat()
    const uniqueSelectedDishes = Array.from(new Set(allSelectedDishes))
    
    const approvedDishIds: string[] = []
    uniqueSelectedDishes.forEach(dishId => {
      const votes = state.dishVotes[dishId] || {}
      let continueCount = 0
      let skipCount = 0
      
      state.members.forEach(member => {
        const v = votes[member.id] || 'continue' // Default to continue
        if (v === 'continue') continueCount++
        else skipCount++
      })
      
      if (continueCount >= skipCount) {
        approvedDishIds.push(dishId)
      }
    })

    // Update selections to only contain approved dishes
    const updatedSelections: Record<string, string[]> = {}
    Object.entries(state.selections).forEach(([memberId, dishIds]) => {
      updatedSelections[memberId] = dishIds.filter(id => approvedDishIds.includes(id))
    })

    // Setup initial custom splitting amounts equally
    const allSelectedDishesList = Object.values(updatedSelections).flat()
    const dishMap = new Map(state.dishes.map(d => [d.id, d]))
    
    let subtotal = 0
    allSelectedDishesList.forEach(dId => {
      const dish = dishMap.get(dId)
      if (dish) {
        subtotal += parseInt(dish.price.replace(/[^\d]/g, '')) || 0
      }
    })

    const finalBill = subtotal
    const equalShare = Math.round(finalBill / state.peopleCount)

    const initialCustomShares: Record<string, number> = {}
    state.members.forEach(m => {
      initialCustomShares[m.id] = equalShare
    })

    set({
      selections: updatedSelections,
      customSplitShares: initialCustomShares,
      screen: 'order_summary'
    })
  },

  setSplitType: (splitType) => set({ splitType }),

  updateCustomSplitShare: (memberId, amount) => {
    set((state) => ({
      customSplitShares: {
        ...state.customSplitShares,
        [memberId]: amount
      }
    }))
  },

  applyCoupon: (appliedCoupon) => set({ appliedCoupon }),

  confirmFoodSelections: () => {
    // Generate simulated food selections for other friends who joined the lobby
    const state = get()
    const updatedSelections = { ...state.selections }
    
    state.members.forEach(member => {
      if (member.id !== 'user') {
        const count = Math.floor(1 + Math.random() * 2.5)
        const chosen: string[] = []
        for (let i = 0; i < count; i++) {
          const randomDish = state.dishes[Math.floor(Math.random() * state.dishes.length)]
          if (randomDish && !chosen.includes(randomDish.id)) {
            chosen.push(randomDish.id)
          }
        }
        updatedSelections[member.id] = chosen
      }
    })

    // Auto-approve user's own picks initially in dishVotes
    const initialDishVotes: Record<string, Record<string, 'continue' | 'skip'>> = {}
    const allSelectedDishes = Object.values(updatedSelections).flat()
    const uniqueSelectedDishes = Array.from(new Set(allSelectedDishes))
    
    uniqueSelectedDishes.forEach(dishId => {
      initialDishVotes[dishId] = {
        user: state.selections['user']?.includes(dishId) ? 'continue' : 'continue'
      }
    })

    set({
      selections: updatedSelections,
      dishVotes: initialDishVotes,
      voteStatusLogs: ['Voting round started! Cast your votes.'],
      screen: 'voting_round'
    })

    // Start simulating friend votes
    setTimeout(() => {
      get().simulateFriendVotes()
    }, 1000)
  },

  resetRound: () => {
    set({
      screen: 'landing',
      validationError: null,
      groupName: '',
      peopleCount: 4,
      restaurantMode: 'already_chose',
      searchQuery: '',
      selectedRestaurant: null,
      city: 'Hyderabad',
      cravings: [],
      budgetVal: 800,
      radiusVal: 5,
      latitude: null,
      longitude: null,
      locationPermission: 'prompt',
      detectedAreaName: null,
      roomCode: '',
      inviteLink: '',
      members: [],
      isMultiplayer: false,
      restaurants: [],
      showFoodOnboarding: true,
      dishes: [],
      selections: {},
      dishVotes: {},
      voteStatusLogs: [],
      splitType: 'equal',
      customSplitShares: {},
      appliedCoupon: null,
      chatMessages: [
        {
          id: 'system-1',
          senderId: 'system',
          senderName: 'System',
          avatarColor: 'bg-[#FF7A30]',
          text: 'Food Squad lobby created! Start adding dishes to decide what to eat.',
          timestamp: new Date().toISOString(),
          isSystem: true
        }
      ],
      chatDrawerOpen: false,
      isFriendTyping: null,
      unreadChatCount: 0
    })
  },

  simulateFriendJoin: () => {
    const currentMembers = get().members
    const totalTarget = get().peopleCount
    
    if (currentMembers.length >= totalTarget) {
      setTimeout(() => {
        get().simulateFriendReady()
      }, 1000)
      return
    }

    const availableNames = FRIEND_NAMES.filter(
      (name) => !currentMembers.some((m) => m.name.includes(name))
    )
    if (availableNames.length === 0) return

    const name = availableNames[Math.floor(Math.random() * availableNames.length)]
    const color = FRIEND_COLORS[Math.floor(Math.random() * FRIEND_COLORS.length)]

    setTimeout(() => {
      if (get().screen !== 'lobby') return

      const friendId = `friend-${Date.now()}`
      const newFriend = { id: friendId, name, isReady: false, avatarColor: color, isUser: false }
      
      const joinMessage: Message = {
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'System',
        avatarColor: color,
        text: `${name} joined the food squad lobby! 👋`,
        timestamp: new Date().toISOString(),
        isSystem: true
      }

      set((state) => ({
        members: [...state.members, newFriend],
        chatMessages: [...state.chatMessages, joinMessage]
      }))

      // Send a random welcome chat text from this friend after a slight delay
      setTimeout(() => {
        const welcomeTexts = [
          "Hey everyone! 🍕 What are we ordering today?",
          "Hey guys! Let's get something sweet too 🤤",
          "Yo! Let's get food quickly, I have to go in 30 mins",
          "What's up squads! Let's order some heavy main course 🍛",
          "Hey squad! Veg or Non-veg today?"
        ]
        const welcomeMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: friendId,
          senderName: name,
          avatarColor: color,
          text: welcomeTexts[Math.floor(Math.random() * welcomeTexts.length)],
          timestamp: new Date().toISOString()
        }
        set((state) => ({
          chatMessages: [...state.chatMessages, welcomeMessage],
          unreadChatCount: state.chatDrawerOpen ? 0 : state.unreadChatCount + 1
        }))
      }, 800)

      get().simulateFriendJoin()
    }, 1000 + Math.random() * 600)
  },

  simulateFriendReady: () => {
    const checkAndReady = () => {
      const state = get()
      if (state.screen !== 'lobby') return

      const unreadyFriends = state.members.filter((m) => !m.isUser && !m.isReady)
      if (unreadyFriends.length === 0) return

      const targetFriend = unreadyFriends[Math.floor(Math.random() * unreadyFriends.length)]

      setTimeout(() => {
        get().setReady(targetFriend.id, true)
        checkAndReady()
      }, 800 + Math.random() * 800)
    }

    checkAndReady()
  },

  simulateFriendVotes: () => {
    const state = get()
    if (state.screen !== 'voting_round') return

    const allSelectedDishes = Object.values(state.selections).flat()
    const uniqueSelectedDishes = Array.from(new Set(allSelectedDishes))
    
    let targetDishId = ''
    let unvotedFriend: Member | null = null
    
    for (const dId of uniqueSelectedDishes) {
      const votes = state.dishVotes[dId] || {}
      const unvoted = state.members.filter(m => !m.isUser && !votes[m.id])
      if (unvoted.length > 0) {
        targetDishId = dId
        unvotedFriend = unvoted[Math.floor(Math.random() * unvoted.length)]
        break
      }
    }
    
    if (targetDishId && unvotedFriend) {
      const friend = unvotedFriend
      const dishId = targetDishId
      const randomVote = (Math.random() > 0.2 ? 'continue' : 'skip') as 'continue' | 'skip'
      
      set((state) => {
        const currentVotes = state.dishVotes[dishId] || {}
        const updatedVotes = { ...currentVotes, [friend.id]: randomVote }
        const newDishVotes = { ...state.dishVotes, [dishId]: updatedVotes }
        
        const dishName = state.dishes.find(d => d.id === dishId)?.name || 'Dish'
        const newLogs = [...state.voteStatusLogs, `${friend.name} voted to ${randomVote === 'continue' ? 'Keep' : 'Skip'} "${dishName}"`]
        
        return { dishVotes: newDishVotes, voteStatusLogs: newLogs }
      })
      
      setTimeout(() => {
        get().simulateFriendVotes()
      }, 800 + Math.random() * 700)
    }
  },

  signUpWithEmail: async (fullName, email, password, username) => {
    set({ authLoading: true, authError: null })
    try {
      const user = await authService.signUpWithEmail(fullName, email, password, username)
      
      const nextScreen = get().onboardingNextScreen
      if (nextScreen === 'create_room') {
        set({ user, screen: 'create_room', onboardingNextScreen: null })
      } else if (nextScreen === 'join_room') {
        const code = get().pendingRoomCode
        if (code) {
          set({ user, onboardingNextScreen: null, pendingRoomCode: null })
          await get().joinRoom(code)
        } else {
          set({ user, screen: 'join_room', onboardingNextScreen: null })
        }
      } else {
        set({ user, screen: 'landing' })
      }
    } catch (err: any) {
      set({ authError: err.message || 'Error creating account' })
      throw err
    } finally {
      set({ authLoading: false })
    }
  },

  signInWithEmail: async (email, password) => {
    set({ authLoading: true, authError: null })
    try {
      const user = await authService.signInWithEmail(email, password)
      
      const nextScreen = get().onboardingNextScreen
      if (nextScreen === 'create_room') {
        set({ user, screen: 'create_room', onboardingNextScreen: null })
      } else if (nextScreen === 'join_room') {
        const code = get().pendingRoomCode
        if (code) {
          set({ user, onboardingNextScreen: null, pendingRoomCode: null })
          await get().joinRoom(code)
        } else {
          set({ user, screen: 'join_room', onboardingNextScreen: null })
        }
      } else {
        set({ user, screen: 'landing' })
      }
    } catch (err: any) {
      set({ authError: err.message || 'Error signing in' })
      throw err
    } finally {
      set({ authLoading: false })
    }
  },

  sendPasswordReset: async (email) => {
    set({ authLoading: true, authError: null })
    try {
      await authService.sendPasswordReset(email)
    } catch (err: any) {
      set({ authError: err.message || 'Error sending password reset email' })
      throw err
    } finally {
      set({ authLoading: false })
    }
  },

  signInWithGoogle: async () => {
    set({ authLoading: true, authError: null })
    try {
      const user = await authService.signInWithGoogle()
      
      const nextScreen = get().onboardingNextScreen
      if (nextScreen === 'create_room') {
        set({ user, screen: 'create_room', onboardingNextScreen: null })
      } else if (nextScreen === 'join_room') {
        const code = get().pendingRoomCode
        if (code) {
          set({ user, onboardingNextScreen: null, pendingRoomCode: null })
          await get().joinRoom(code)
        } else {
          set({ user, screen: 'join_room', onboardingNextScreen: null })
        }
      } else {
        set({ user, screen: 'landing' })
      }
    } catch (err: any) {
      set({ authError: err.message || 'Error signing in with Google' })
      throw err
    } finally {
      set({ authLoading: false })
    }
  },

  signOut: async () => {
    set({ authLoading: true })
    try {
      await authService.signOut()
      localStorage.removeItem('zesto_guest_name')
      set({ user: null, guestName: null, screen: 'landing' })
    } catch (err: any) {
      console.error('Sign out failed', err)
    } finally {
      set({ authLoading: false })
    }
  },

  requestLocation: async () => {
    set({ locationPermission: 'requesting', validationError: null })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          set({
            latitude: lat,
            longitude: lon,
            locationPermission: 'granted',
            detectedAreaName: 'Detecting Area Name...'
          })
          
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
            const data = await response.json()
            const area = data.address.suburb || data.address.neighbourhood || data.address.village || data.address.town || data.address.city || 'My Coordinates'
            set({ detectedAreaName: area })
          } catch (e) {
            set({ detectedAreaName: 'Nearby Location' })
          }
        },
        (error) => {
          console.error(error)
          set({ locationPermission: 'denied', validationError: 'Allow location access to find restaurants near you.' })
        }
      )
    } else {
      set({ locationPermission: 'denied', validationError: 'Geolocation is not supported by your browser.' })
    }
  }
}))

// Synchronize Firebase Auth changes automatically with the Zustand state
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    const email = firebaseUser.email || ''
    const name = firebaseUser.displayName || email.split('@')[0] || 'User'
    const username = email.split('@')[0] || ''
    const avatarUrl = firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF7A30&color=fff&bold=true&size=128`

    const user: AuthUser = {
      uid: firebaseUser.uid,
      name,
      email,
      username,
      avatarUrl
    }
    useRoomStore.setState({ user })
  } else {
    useRoomStore.setState({ user: null })
  }
})
