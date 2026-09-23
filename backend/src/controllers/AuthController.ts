import { Request, Response } from 'express'
import { AuthService } from '../services/AuthService'

const authService = new AuthService()

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body)
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Erro ao registrar usuário' })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { user, token } = await authService.login(req.body)

      // Define o cookie HttpOnly
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
      })

      res.status(200).json({ user })
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Erro ao fazer login' })
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('token')
    res.status(200).json({ message: 'Logout realizado com sucesso' })
  }

  async me(req: Request, res: Response) {
    // Essa rota será protegida pelo middleware, então req.user sempre existirá
    res.status(200).json({ user: req.user })
  }
}
