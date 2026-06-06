export type RoomScreen = 
  | 'landing' 
  | 'selector' 
  | 'create_room' 
  | 'restaurant_choice'
  | 'join_room' 
  | 'lobby' 
  | 'food_selection' 
  | 'voting_round'
  | 'order_summary' 
  | 'final_plan'
  | 'login'
  | 'signup'
  | 'forgot_password'
  | 'welcome'
  | 'name_collection'

export interface Member {
  id: string
  name: string
  isReady: boolean
  avatarColor: string
  isUser: boolean
  hasVoted?: boolean
}

export interface Dish {
  id: string
  name: string
  image: string
  price: string
  discount: string
  restaurantName: string
  isVeg: boolean
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Insane'
  popularTag?: string
  rating: number
  loveCount: number
  mustEatCount: number
  skipCount: number
  rank?: 'King Pick' | 'Strong Match' | 'Mixed Pick' | 'Weak Match'
  compatibility?: number
  votes?: Record<string, 'love' | 'must_eat' | 'skip' | 'done'>
  description?: string
}

export interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  reviewsCount: number
  price: string
  distance: string
  description: string
  tags: string[]
  matchPercentage: number
  loveCount: number
  fineCount: number
  preferNotCount: number
  hardPassCount: number
  isEliminated: boolean
  discounts?: string
  popularDishes?: string[]
  isOpen?: boolean
}

export interface RoomConfig {
  location: string
  groupName: string
  peopleCount: number
  cravings: string[]
  budget: string
  distance: string
  alreadySitting: boolean
  restaurantMode: 'manual' | 'zesto'
}

export interface HistoryDecision {
  id: string
  restaurantName: string
  restaurantImage: string
  date: string
  budget: string
  matchPercentage: number
  location: string
  friendsCount: number
  cravings: string[]
  vibe: string[]
}
