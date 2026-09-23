import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

type TokenPayload = {
  id: string
  role: 'CLIENTE' | 'PROPRIETARIO'
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload
    
    // Adiciona o id e role do usuário no req para os próximos middlewares/controllers usarem
    req.user = {
      id: decoded.id,
      role: decoded.role,
    }

    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
}
