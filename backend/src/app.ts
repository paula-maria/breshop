import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { routes } from './routes'
import path from 'path'
import { HealthController } from './controllers/HealthController'

const app = express()

const healthController = new HealthController()

app.use(cors({
  origin: 'http://localhost:5173', // Frontend do Vite
  credentials: true, // Permite envio de cookies
}))
app.use(express.json())
app.use(cookieParser())

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('/', healthController.check.bind(healthController))

app.use('/api', routes)

// Global Error Handler básico
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

export { app }
