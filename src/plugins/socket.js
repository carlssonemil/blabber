import { io } from 'socket.io-client'

const socket = io(
  import.meta.env.DEV
    ? 'http://localhost:5000'
    : 'https://blabber-application.herokuapp.com/',
  { transports: ['websocket'] }
)

export const socketPlugin = {
  install(app) {
    app.config.globalProperties.$socket = socket
  }
}

export { socket }
