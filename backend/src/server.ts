import http from 'http'
import { app } from './app'
import { env } from './config/env'
import { initSocket } from './config/socket'

const server = http.createServer(app)

initSocket(server)

server.listen(env.PORT, () => {
  console.log(`Server rodando na porta ${env.PORT}`)
})
