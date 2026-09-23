import { prisma } from '../config/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['CLIENTE', 'PROPRIETARIO']).default('CLIENTE')
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export class AuthService {
  async register(data: z.infer<typeof registerSchema>) {
    const parsed = registerSchema.parse(data)

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email }
    })

    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10)

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashedPassword,
        role: parsed.role,
      }
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }

  async login(data: z.infer<typeof loginSchema>) {
    const parsed = loginSchema.parse(data)

    const user = await prisma.user.findUnique({
      where: { email: parsed.email }
    })

    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    const isValidPassword = await bcrypt.compare(parsed.password, user.password)

    if (!isValidPassword) {
      throw new Error('Credenciais inválidas')
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' } // Expira em 7 dias
    )

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }
  }
}
