import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { routes } from './routes'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173', // Frontend do Vite
  credentials: true, // Permite envio de cookies
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api', routes)

// Global Error Handler básico
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

export { app }
