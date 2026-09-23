import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'

export let io: Server

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // Ajuste conforme necessário para produção
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Novo cliente conectado: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`)
    })
  })

  return io
}
