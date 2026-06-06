import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock client helper to simulate realtime behavior in landing page demo
export const mockRealtimeDb = {
  subscribeToRoom: (roomCode: string, onUpdate: (payload: any) => void) => {
    console.log(`[Mock Realtime] Subscribed to room: ${roomCode}`)
    const interval = setInterval(() => {
      // Simulate other users voting
      const mockVotes = [
        { user: 'Sam', vote: 'yes', timestamp: new Date() },
        { user: 'Maya', vote: 'yes', timestamp: new Date() },
        { user: 'Chloe', vote: 'no', timestamp: new Date() },
      ]
      onUpdate(mockVotes)
    }, 4000)

    return () => {
      console.log(`[Mock Realtime] Unsubscribed from room: ${roomCode}`)
      clearInterval(interval)
    }
  }
}
