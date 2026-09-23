import 'express'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: 'CLIENTE' | 'PROPRIETARIO'
      }
    }
  }
}
