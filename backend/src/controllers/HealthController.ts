import { Request, Response } from 'express'
import { prisma } from '../config/prisma'

export class HealthController {
  async check(req: Request, res: Response) {
    try {
      // Basic query to check DB connection
      await prisma.$queryRaw`SELECT 1`
      
      res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: 'Connected'
      })
    } catch (error) {
      console.error('Database connection failed', error)
      res.status(500).json({
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        database: 'Disconnected'
      })
    }
  }
}
