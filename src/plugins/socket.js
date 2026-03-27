import { io } from 'socket.io-client'

const socket = io(
  import.meta.env.VITE_API_URL || 'http://localhost:5000',
  { transports: ['polling', 'websocket'] }
)

export const socketPlugin = {
  install(app) {
    app.config.globalProperties.$socket = socket
  }
}

export { socket }
