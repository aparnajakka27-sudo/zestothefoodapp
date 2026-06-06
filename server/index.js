import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || ''

// 1. Mongoose Schema Setup
let dbConnected = false
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas! 🍃')
      dbConnected = true
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message)
      console.warn('Running with local in-memory fallback databases!')
    })
} else {
  console.warn('No MONGO_URI configured in environment. Running with local in-memory fallback databases!')
}

const RoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  groupName: String,
  location: String,
  peopleCount: Number,
  cravings: [String],
  budget: String,
  distance: String,
  alreadySitting: Boolean,
  restaurantMode: String,
  members: [{
    id: String,
    name: String,
    isReady: Boolean,
    avatarColor: String
  }],
  selectedRestaurant: Object,
  dishes: [Object],
  votes: mongoose.Schema.Types.Mixed, // dishId -> { userId -> voteType }
  matchResult: Object,
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete room after 24 hours
})

const RoomModel = mongoose.models.Room || mongoose.model('Room', RoomSchema)

// Local storage fallback if DB is offline
const inMemoryRooms = new Map()

// Helper to retrieve/save rooms
const saveRoom = async (roomData) => {
  // Ensure votes object is initialized
  if (!roomData.votes) roomData.votes = {};
  
  if (dbConnected) {
    try {
      await RoomModel.findOneAndUpdate({ roomCode: roomData.roomCode }, roomData, { upsert: true, new: true })
    } catch (e) {
      console.error('Error saving to MongoDB, writing to local memory:', e.message)
      inMemoryRooms.set(roomData.roomCode, roomData)
    }
  } else {
    inMemoryRooms.set(roomData.roomCode, roomData)
  }
}

const getRoom = async (code) => {
  if (dbConnected) {
    try {
      const room = await RoomModel.findOne({ roomCode: code })
      if (room) {
        const obj = room.toObject()
        if (!obj.votes) obj.votes = {}
        return obj
      }
    } catch (e) {
      console.error('Error reading from MongoDB, fetching from local memory:', e.message)
    }
  }
  let localRoom = inMemoryRooms.get(code)
  if (localRoom && !localRoom.votes) localRoom.votes = {}
  return localRoom
}

// 2. HTTP Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', database: dbConnected ? 'MongoDB Atlas' : 'In-Memory fallback' })
})

app.post('/api/rooms', async (req, res) => {
  const { roomCode, groupName, location, peopleCount, cravings, budget, distance, alreadySitting, restaurantMode, selectedRestaurant } = req.body
  const newRoom = {
    roomCode,
    groupName,
    location,
    peopleCount,
    cravings,
    budget,
    distance,
    alreadySitting,
    restaurantMode,
    selectedRestaurant: selectedRestaurant || null,
    members: [],
    dishes: [],
    votes: {},
    matchResult: null
  }
  await saveRoom(newRoom)
  res.status(201).json(newRoom)
})

// 3. Real-Time Socket.IO Synchronization
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Host or Join Room Lobby
  socket.on('join-room', async ({ roomCode, member }) => {
    socket.join(roomCode)
    console.log(`Socket ${socket.id} joined room roomCode=${roomCode}`)

    let room = await getRoom(roomCode)
    if (!room) {
      // Auto-create room config if not found (fallback)
      room = {
        roomCode,
        groupName: 'Food Battle Squad',
        members: [],
        votes: {}
      }
    }

    // Check if player already exists
    const exists = room.members.some((m) => m.id === member.id)
    if (!exists) {
      room.members.push(member)
      await saveRoom(room)
    }

    // Broadcast update to everyone in lobby
    io.to(roomCode).emit('lobby-updated', room.members)
  })

  // Ready check status sync
  socket.on('set-ready', async ({ roomCode, userId, isReady }) => {
    const room = await getRoom(roomCode)
    if (room) {
      room.members = room.members.map((m) => 
        m.id === userId ? { ...m, isReady } : m
      )
      await saveRoom(room)
      io.to(roomCode).emit('lobby-updated', room.members)

      // If everyone is ready (and there's at least 1 member), let everyone know
      const allReady = room.members.every(m => m.isReady)
      if (allReady && room.members.length >= 1) {
        io.to(roomCode).emit('lobby-ready', room.members)
      }
    }
  })

  // Host confirms the restaurant and menu
  socket.on('confirm-restaurant', async ({ roomCode, selectedRestaurant, dishes }) => {
    const room = await getRoom(roomCode)
    if (room) {
      room.selectedRestaurant = selectedRestaurant
      room.dishes = dishes
      room.votes = {} // reset votes
      await saveRoom(room)
      io.to(roomCode).emit('start-menu-battle', { selectedRestaurant, dishes })
    }
  })

  // Cast dish vote
  socket.on('cast-dish-vote', async ({ roomCode, userId, dishId, voteType }) => {
    const room = await getRoom(roomCode)
    if (!room) return

    if (!room.votes) room.votes = {}
    if (!room.votes[dishId]) room.votes[dishId] = {}
    
    room.votes[dishId][userId] = voteType
    await saveRoom(room)

    // Notify other players in room about user's vote
    socket.to(roomCode).emit('member-voted', { userId, dishId })

    // Check if everyone has voted on this dish
    const voters = Object.keys(room.votes[dishId])
    const totalConnected = room.members.length
    
    if (voters.length >= totalConnected) {
      const votesForDish = room.votes[dishId]
      let loveCount = 0
      let mustEatCount = 0
      let skipCount = 0

      for (const uId of Object.keys(votesForDish)) {
        const vote = votesForDish[uId]
        if (vote === 'love') loveCount++
        else if (vote === 'must_eat') mustEatCount++
        else if (vote === 'skip') skipCount++
      }

      const compatibility = Math.round(((loveCount * 1.0 + mustEatCount * 0.6) / totalConnected) * 100)
      
      let rank = 'Weak Match'
      if (compatibility === 100) {
        rank = 'King Pick'
      } else if (compatibility >= 70) {
        rank = 'Strong Match'
      } else if (compatibility >= 30) {
        rank = 'Mixed Pick'
      } else {
        rank = 'Weak Match'
      }

      // Update dish stats
      room.dishes = room.dishes.map((dish) => {
        if (dish.id === dishId) {
          return {
            ...dish,
            loveCount,
            mustEatCount,
            skipCount,
            rank,
            compatibility
          }
        }
        return dish
      })
      await saveRoom(room)

      // Emit dish battle result to everyone
      io.to(roomCode).emit('dish-battle-result', { dishId, loveCount, mustEatCount, skipCount, rank, compatibility })

      // Check if all dishes have been voted on by everyone
      const allDishesVoted = room.dishes.every(d => room.votes[d.id] && Object.keys(room.votes[d.id]).length >= totalConnected)
      if (allDishesVoted) {
        let winningDishes = room.dishes.filter(d => d.rank === 'King Pick' || d.rank === 'Strong Match')
        if (winningDishes.length === 0) {
          winningDishes = room.dishes.filter(d => d.rank === 'Mixed Pick')
        }
        if (winningDishes.length === 0) {
          // Fallback to top rated dishes
          winningDishes = [...room.dishes].sort((a, b) => b.rating - a.rating).slice(0, 2)
        }

        const match = {
          restaurant: room.selectedRestaurant,
          winningDishes,
          timestamp: Date.now()
        }

        room.matchResult = match
        await saveRoom(room)
        io.to(roomCode).emit('match-found', match)
      }
    }
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Zesto Fullstack Server running on port ${PORT} 🚀`)
})

