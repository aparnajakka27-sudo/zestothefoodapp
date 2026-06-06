import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket | null => {
  return socket
}

export const connectSocket = (url = 'http://localhost:5000'): Socket | null => {
  if (socket) return socket

  try {
    socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 2,
      timeout: 3000
    })
    
    socket.on('connect', () => {
      console.log('Connected to Zesto fullstack Socket server 🚀')
    })

    socket.on('connect_error', () => {
      console.warn('Socket server unreachable. Running in high-fidelity local simulation mode 🎮')
    })
  } catch (err) {
    console.error('Socket initialization error:', err)
  }
  return socket
}

export default connectSocket
