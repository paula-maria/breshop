import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { routes } from './routes'
import path from 'path'
import fs from 'fs'
import { HealthController } from './controllers/HealthController'

const app = express()

const healthController = new HealthController()

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true); // Permite qualquer origem
  },
  credentials: true, // Permite envio de cookies
}))
app.use(express.json())
app.use(cookieParser())

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

const publicDir = path.join(__dirname, '..', 'public')
const hasFrontend = fs.existsSync(publicDir)

if (!hasFrontend) app.get('/', healthController.check.bind(healthController))

app.use('/api', routes)

// Em produção (Docker) o backend também serve o frontend compilado
if (hasFrontend) {
  app.use(express.static(publicDir))
  app.get(/^\/(?!api|uploads).*/, (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })
}

// Global Error Handler básico
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

export { app }
