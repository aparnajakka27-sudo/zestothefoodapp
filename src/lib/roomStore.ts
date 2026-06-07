import { create } from 'zustand'
import type { RoomScreen, Member, Restaurant, Dish, Message } from '../types'
import { fetchRestaurants, fetchRestaurantMenu } from '../services/googleMaps'
import { connectSocket, getSocket } from '../services/socket'
import { authService } from './authService'
import type { AuthUser } from './authService'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { calculateMidpoint, reverseGeocodeNominatim } from '../services/location'

interface RoomState {
  // Screen state
  screen: RoomScreen
  previousScreen: RoomScreen | null
  validationError: string | null
  midpointAreaName: string | null

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
  pinnedMessage: Message | null
  chatReplyMessage: Message | null
  linkedDishDiscuss: Dish | null
  sendChatMessage: (
    text?: string, 
    sticker?: string, 
    gif?: string, 
    mediaUrl?: string, 
    voiceDuration?: number, 
    voiceWaveform?: number[],
    replyTo?: Message['replyTo'], 
    linkedDish?: Message['linkedDish']
  ) => void
  toggleChatDrawer: (val?: boolean) => void
  reactToMessage: (messageId: string, emoji: string) => void
  pinMessage: (messageId: string) => void
  unpinMessage: () => void
  setChatReplyMessage: (msg: Message | null) => void
  setLinkedDishDiscuss: (dish: Dish | null) => void
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

  // Theme & New States
  theme: 'light' | 'dark'
  hasCompletedSplit: boolean
  approvedDishIds: string[]
  rejectedDishIds: string[]
  finishedSelecting: Record<string, boolean>

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
  toggleTheme: () => void
  setFinishedSelecting: (memberId: string, isFinished: boolean) => void
  proceedToBillSplit: () => void
  setHasCompletedSplit: (val: boolean) => void

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
  isDemoOpen: boolean
  setIsDemoOpen: (val: boolean) => void
}

const FRIEND_NAMES = ['Aman', 'Rohit', 'Karthik', 'Sam', 'Arjun', 'Maya', 'Neha', 'Leo']
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

const getSessionItem = (key: string, defaultValue: any) => {
  try {
    const val = sessionStorage.getItem(key)
    return val ? JSON.parse(val) : defaultValue
  } catch (e) {
    return defaultValue
  }
}

export const useRoomStore = create<RoomState>((set, get) => ({
  screen: getSessionItem('zesto_screen', 'landing'),
  previousScreen: getSessionItem('zesto_previousScreen', null),
  validationError: null,

  groupName: getSessionItem('zesto_groupName', ''),
  peopleCount: getSessionItem('zesto_peopleCount', 4),
  restaurantMode: getSessionItem('zesto_restaurantMode', 'already_chose'),

  searchQuery: '',
  selectedRestaurant: getSessionItem('zesto_selectedRestaurant', null),

  city: getSessionItem('zesto_city', 'Hyderabad'),
  cravings: getSessionItem('zesto_cravings', []),
  budgetVal: getSessionItem('zesto_budgetVal', 800),
  radiusVal: getSessionItem('zesto_radiusVal', 5),

  latitude: localStorage.getItem('zesto_latitude') ? parseFloat(localStorage.getItem('zesto_latitude')!) : null,
  longitude: localStorage.getItem('zesto_longitude') ? parseFloat(localStorage.getItem('zesto_longitude')!) : null,
  locationPermission: (localStorage.getItem('zesto_location_permission') as any) || 'prompt',
  detectedAreaName: localStorage.getItem('zesto_area_name') || null,
  midpointAreaName: null,
  user: authService.getCurrentUser(),
  authLoading: true,
  authError: null,
  guestName: localStorage.getItem('zesto_guest_name') || null,
  onboardingNextScreen: null,
  pendingRoomCode: null,

  chatMessages: [],
  chatDrawerOpen: false,
  isFriendTyping: null,
  unreadChatCount: 0,
  pinnedMessage: null,
  chatReplyMessage: null,
  linkedDishDiscuss: null,

  roomCode: getSessionItem('zesto_roomCode', ''),
  inviteLink: getSessionItem('zesto_inviteLink', ''),
  members: getSessionItem('zesto_members', []),
  isMultiplayer: getSessionItem('zesto_isMultiplayer', false),

  restaurants: getSessionItem('zesto_restaurants', []),
  showFoodOnboarding: getSessionItem('zesto_showFoodOnboarding', true),
  dishes: getSessionItem('zesto_dishes', []),
  selections: getSessionItem('zesto_selections', {}),
  
  dishVotes: getSessionItem('zesto_dishVotes', {}),
  voteStatusLogs: getSessionItem('zesto_voteStatusLogs', []),

  splitType: getSessionItem('zesto_splitType', 'equal'),
  customSplitShares: getSessionItem('zesto_customSplitShares', {}),
  appliedCoupon: getSessionItem('zesto_appliedCoupon', null),

  theme: (localStorage.getItem('zesto_theme') as 'light' | 'dark') || 'light',
  hasCompletedSplit: getSessionItem('zesto_hasCompletedSplit', false),
  approvedDishIds: getSessionItem('zesto_approvedDishIds', []),
  rejectedDishIds: getSessionItem('zesto_rejectedDishIds', []),
  finishedSelecting: getSessionItem('zesto_finishedSelecting', {}),
  isDemoOpen: false,
  setIsDemoOpen: (val) => set({ isDemoOpen: val }),

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

  sendChatMessage: (text, sticker, gif, mediaUrl, voiceDuration, voiceWaveform, replyTo, linkedDish) => {
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
      gif,
      mediaUrl,
      voiceDuration,
      voiceWaveform,
      replyTo,
      linkedDish,
      timestamp: new Date().toISOString(),
      seenStatus: 'sent'
    }
    
    set((state) => ({
      chatMessages: [...state.chatMessages, newMessage],
      unreadChatCount: 0,
      chatReplyMessage: null, // Clear active reply context on send
      linkedDishDiscuss: null  // Clear active linked dish context
    }))
    
    // Simulate WhatsApp-style delivery tick updates
    setTimeout(() => {
      set((state) => ({
        chatMessages: state.chatMessages.map(m => m.id === newMessage.id ? { ...m, seenStatus: 'delivered' as const } : m)
      }))
    }, 800)
    
    setTimeout(() => {
      set((state) => ({
        chatMessages: state.chatMessages.map(m => m.id === newMessage.id ? { ...m, seenStatus: 'read' as const } : m)
      }))
    }, 1800)
  },

  reactToMessage: (messageId, emoji) => {
    set((state) => ({
      chatMessages: state.chatMessages.map((msg) => {
        if (msg.id === messageId) {
          const currentReactions = msg.reactions || {}
          return {
            ...msg,
            reactions: {
              ...currentReactions,
              user: emoji
            }
          }
        }
        return msg
      })
    }))
  },

  pinMessage: (messageId) => {
    const msg = get().chatMessages.find(m => m.id === messageId)
    if (msg) {
      set((state) => ({
        pinnedMessage: msg,
        chatMessages: state.chatMessages.map(m => m.id === messageId ? { ...m, isPinned: true } : { ...m, isPinned: false })
      }))
    }
  },

  unpinMessage: () => {
    set({ pinnedMessage: null })
  },

  setChatReplyMessage: (chatReplyMessage) => {
    set({ chatReplyMessage })
  },

  setLinkedDishDiscuss: (linkedDishDiscuss) => {
    set({ linkedDishDiscuss })
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
        "Must try the Butter Naan guys, trust me! 🔥",
        "Skip the soup, let's get main course.",
        "Too expensive? Apply coupon SAVE100!",
        "Order more cokes, 1 bottle won't be enough.",
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
        '😂 "Anything is fine"',
        '🤦 "You always pick biryani"',
        '😎 "Trust me bro"'
      ]

      const gifs = [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2o0eDZpMzh3Ympyb2NrdnQ4OGdzbjlyeDY4eW9pYTd4Z29zYWltdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12uXi1GXGpCrcc/giphy.gif', // Pizza
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hxdW05NXRzYWgwa3phZzcycTVoZjB4NzA1aXhldHN3NHpldWZ2YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZgYAz3qrg1wti/giphy.gif'  // Burger
      ]
      
      const roll = Math.random()
      
      let randomText: string | undefined = undefined
      let randomSticker: string | undefined = undefined
      let randomGif: string | undefined = undefined
      let voiceDuration: number | undefined = undefined
      let voiceWaveform: number[] | undefined = undefined
      let replyTo: Message['replyTo'] = undefined

      if (roll < 0.45) {
        // Standard text
        randomText = phrases[Math.floor(Math.random() * phrases.length)]
        
        // 30% chance to make it a reply to the user's last message
        const lastUserMessage = state.chatMessages.filter(m => m.senderId === 'user').slice(-1)[0]
        if (lastUserMessage && Math.random() > 0.7) {
          replyTo = {
            messageId: lastUserMessage.id,
            senderName: lastUserMessage.senderName,
            text: lastUserMessage.text,
            sticker: lastUserMessage.sticker
          }
        }
      } else if (roll < 0.7) {
        // Sticker
        randomSticker = stickers[Math.floor(Math.random() * stickers.length)]
      } else if (roll < 0.85) {
        // Simulated voice note
        voiceDuration = Math.floor(5 + Math.random() * 15)
        voiceWaveform = Array.from({ length: 15 }, () => Math.floor(10 + Math.random() * 80))
      } else {
        // GIF
        randomGif = gifs[Math.floor(Math.random() * gifs.length)]
        randomText = "Look at this! 🤤"
      }
      
      const friendMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: randomFriend.id,
        senderName: randomFriend.name,
        avatarColor: randomFriend.avatarColor,
        text: randomText,
        sticker: randomSticker,
        gif: randomGif,
        voiceDuration,
        voiceWaveform,
        replyTo,
        timestamp: new Date().toISOString()
      }
      
      // Also, 40% chance the friend reacts to the last user message instead of or in addition to sending a message
      const lastUserMsg = state.chatMessages.filter(m => m.senderId === 'user').slice(-1)[0]
      let updatedMessages = [...state.chatMessages, friendMessage]
      
      if (lastUserMsg && Math.random() > 0.6) {
        const emojis = ['🔥', '❤️', '😂', '👍', '😭']
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        updatedMessages = updatedMessages.map((msg) => {
          if (msg.id === lastUserMsg.id) {
            const currentReactions = msg.reactions || {}
            return {
              ...msg,
              reactions: {
                ...currentReactions,
                [randomFriend.id]: randomEmoji
              }
            }
          }
          return msg
        })
      }
      
      set((state) => ({
        chatMessages: updatedMessages,
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
          { id: 'user', name: uName, isReady: false, avatarColor: 'bg-[#FF7A30]', isUser: true },
        ]
      })
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
    }
  },

  confirmVotingRound: () => {
    const state = get()
    const allSelectedDishes = Object.values(state.selections).flat()
    const uniqueSelectedDishes = Array.from(new Set(allSelectedDishes))
    
    const approvedDishIds: string[] = []
    const rejectedDishIds: string[] = []
    
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
      } else {
        rejectedDishIds.push(dishId)
      }
    })

    set({
      approvedDishIds,
      rejectedDishIds,
      screen: 'final_dishes'
    })
  },

  proceedToBillSplit: () => {
    const state = get()
    
    // Filter selections to only approved dishes
    const updatedSelections: Record<string, string[]> = {}
    Object.entries(state.selections).forEach(([memberId, dishIds]) => {
      updatedSelections[memberId] = dishIds.filter(id => state.approvedDishIds.includes(id))
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

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('zesto_theme', nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    set({ theme: nextTheme })
  },

  setFinishedSelecting: (memberId, isFinished) => {
    set((state) => ({
      finishedSelecting: {
        ...state.finishedSelecting,
        [memberId]: isFinished
      }
    }))
  },

  setHasCompletedSplit: (hasCompletedSplit) => set({ hasCompletedSplit }),

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
    const state = get()
    const updatedSelections = { ...state.selections }
    
    // Set up empty initial dishVotes so all combined dishes must be swiped by the user
    const initialDishVotes: Record<string, Record<string, 'continue' | 'skip'>> = {}
    const allSelectedDishes = Object.values(updatedSelections).flat()
    const uniqueSelectedDishes = Array.from(new Set(allSelectedDishes))
    
    uniqueSelectedDishes.forEach(dishId => {
      initialDishVotes[dishId] = {}
    })

    set({
      selections: updatedSelections,
      dishVotes: initialDishVotes,
      voteStatusLogs: ['Voting round started! Cast your votes.'],
      screen: 'voting_round'
    })


  },

  resetRound: () => {
    try {
      sessionStorage.clear()
    } catch (e) {}
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
      hasCompletedSplit: false,
      approvedDishIds: [],
      rejectedDishIds: [],
      finishedSelecting: {},
      chatMessages: [],
      chatDrawerOpen: false,
      isFriendTyping: null,
      unreadChatCount: 0,
      pinnedMessage: null,
      chatReplyMessage: null,
      linkedDishDiscuss: null
    })
  },

  simulateFriendJoin: () => {
    const currentMembers = get().members
    const totalTarget = get().peopleCount
    
    if (currentMembers.length >= totalTarget) {
      // Calculate geographic midpoint of coordinates for all squad members
      const finalCoords = get().members.map((m) => {
        if (m.isUser) return { latitude: get().latitude || 17.4483, longitude: get().longitude || 78.3741 }
        return { latitude: (m as any).latitude || 17.4483, longitude: (m as any).longitude || 78.3741 }
      })
      const finalMid = calculateMidpoint(finalCoords)
      if (finalMid) {
        reverseGeocodeNominatim(finalMid.latitude, finalMid.longitude).then(async (area) => {
          set({ midpointAreaName: area })
          // Fetch restaurants near the geographic midpoint
          const results = await fetchRestaurants(
            finalMid.latitude,
            finalMid.longitude,
            get().radiusVal,
            get().cravings,
            get().budgetVal <= 500 ? '₹' : get().budgetVal <= 1500 ? '₹₹' : '₹₹₹',
            get().city
          )
          const filteredResults = results.filter((r) => r.rating >= 4.0)
          set({ restaurants: filteredResults.length > 0 ? filteredResults : results })
        })
      }

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
      
      // Assign mock coordinates around the host coordinate
      const baseLat = get().latitude || 17.4483
      const baseLon = get().longitude || 78.3741
      const offsetLat = (Math.random() - 0.5) * 0.02
      const offsetLon = (Math.random() - 0.5) * 0.02

      const newFriend = { 
        id: friendId, 
        name, 
        isReady: false, 
        avatarColor: color, 
        isUser: false,
        latitude: baseLat + offsetLat,
        longitude: baseLon + offsetLon
      }
      
      set((state) => ({
        members: [...state.members, newFriend]
      }))

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
        const logText = randomVote === 'continue'
          ? `${friend.name} approved ${dishName} 🔥`
          : `${friend.name} skipped ${dishName}`
        const newLogs = [...state.voteStatusLogs, logText]
        
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
        set({ user, screen: 'create_room' })
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
        set({ user, screen: 'create_room' })
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
        set({ user, screen: 'create_room' })
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
          localStorage.setItem('zesto_latitude', String(lat))
          localStorage.setItem('zesto_longitude', String(lon))
          localStorage.setItem('zesto_location_permission', 'granted')
          
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
            const data = await response.json()
            const area = data.address.suburb || data.address.neighbourhood || data.address.village || data.address.town || data.address.city || 'My Coordinates'
            set({ detectedAreaName: area })
            localStorage.setItem('zesto_area_name', area)
          } catch (e) {
            set({ detectedAreaName: 'Nearby Location' })
            localStorage.setItem('zesto_area_name', 'Nearby Location')
          }
        },
        (error) => {
          console.error(error)
          set({ locationPermission: 'denied', validationError: 'Allow location access to find restaurants near you.' })
          localStorage.setItem('zesto_location_permission', 'denied')
        }
      )
    } else {
      set({ locationPermission: 'denied', validationError: 'Geolocation is not supported by your browser.' })
      localStorage.setItem('zesto_location_permission', 'denied')
    }
  }
}))

// Synchronize Firebase Auth changes automatically with the Zustand state
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    const email = firebaseUser.email || ''
    const name = firebaseUser.displayName || email.split('@')[0] || 'User'
    const username = email.split('@')[0] || ''
    const avatarUrl = firebaseUser.photoURL || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(name)}`

    const user: AuthUser = {
      uid: firebaseUser.uid,
      name,
      email,
      username,
      avatarUrl
    }
    const store = useRoomStore.getState()
    const isAuthScreen = ['welcome', 'login', 'signup'].includes(store.screen)
    useRoomStore.setState({ 
      user,
      screen: isAuthScreen ? 'create_room' : store.screen,
      authLoading: false
    })
  } else {
    useRoomStore.setState({ user: null, authLoading: false })
  }
})

// Subscribe to store updates to persist screen and room details across tab refreshes
if (typeof window !== 'undefined') {
  useRoomStore.subscribe((state) => {
    try {
      sessionStorage.setItem('zesto_screen', JSON.stringify(state.screen))
      sessionStorage.setItem('zesto_previousScreen', JSON.stringify(state.previousScreen))
      sessionStorage.setItem('zesto_groupName', JSON.stringify(state.groupName))
      sessionStorage.setItem('zesto_peopleCount', JSON.stringify(state.peopleCount))
      sessionStorage.setItem('zesto_restaurantMode', JSON.stringify(state.restaurantMode))
      sessionStorage.setItem('zesto_selectedRestaurant', JSON.stringify(state.selectedRestaurant))
      sessionStorage.setItem('zesto_city', JSON.stringify(state.city))
      sessionStorage.setItem('zesto_cravings', JSON.stringify(state.cravings))
      sessionStorage.setItem('zesto_budgetVal', JSON.stringify(state.budgetVal))
      sessionStorage.setItem('zesto_radiusVal', JSON.stringify(state.radiusVal))
      sessionStorage.setItem('zesto_roomCode', JSON.stringify(state.roomCode))
      sessionStorage.setItem('zesto_inviteLink', JSON.stringify(state.inviteLink))
      sessionStorage.setItem('zesto_members', JSON.stringify(state.members))
      sessionStorage.setItem('zesto_isMultiplayer', JSON.stringify(state.isMultiplayer))
      sessionStorage.setItem('zesto_restaurants', JSON.stringify(state.restaurants))
      sessionStorage.setItem('zesto_showFoodOnboarding', JSON.stringify(state.showFoodOnboarding))
      sessionStorage.setItem('zesto_dishes', JSON.stringify(state.dishes))
      sessionStorage.setItem('zesto_selections', JSON.stringify(state.selections))
      sessionStorage.setItem('zesto_dishVotes', JSON.stringify(state.dishVotes))
      sessionStorage.setItem('zesto_voteStatusLogs', JSON.stringify(state.voteStatusLogs))
      sessionStorage.setItem('zesto_splitType', JSON.stringify(state.splitType))
      sessionStorage.setItem('zesto_customSplitShares', JSON.stringify(state.customSplitShares))
      sessionStorage.setItem('zesto_appliedCoupon', JSON.stringify(state.appliedCoupon))
      sessionStorage.setItem('zesto_hasCompletedSplit', JSON.stringify(state.hasCompletedSplit))
      sessionStorage.setItem('zesto_approvedDishIds', JSON.stringify(state.approvedDishIds))
      sessionStorage.setItem('zesto_rejectedDishIds', JSON.stringify(state.rejectedDishIds))
      sessionStorage.setItem('zesto_finishedSelecting', JSON.stringify(state.finishedSelecting))
    } catch (e) {}
  })
}
