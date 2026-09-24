import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { z } from 'zod'

const createBrechoSchema = z.object({
  // 01 - Informações Básicas
  nome: z.string().min(2),
  descricao: z.string().optional(),
  logoUrl: z.string().optional(),
  capaUrl: z.string().optional(),

  // 02 - Contatos
  telefone: z.string().optional(),
  whatsapp: z.string().min(8),
  emailContato: z.string().email().optional().or(z.literal('')),
  instagram: z.string().optional(),
  site: z.string().optional(),

  // 03 - Endereço
  cep: z.string().min(8, 'CEP é obrigatório'),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),

  // 05 - Funcionamento
  horarios: z.string().optional(),

  // 06 - Comercial
  formasPagamento: z.array(z.string()).default([]),
  atendimento: z.string().optional(),
  entrega: z.boolean().default(false),
  retirada: z.boolean().default(false),
  negociacao: z.boolean().default(false),
})

export class BrechoController {
  async create(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'PROPRIETARIO') {
        res.status(403).json({ error: 'Apenas proprietários podem criar um brechó' })
        return
      }

      const data = createBrechoSchema.parse(req.body)

      const brecho = await prisma.brecho.upsert({
        where: { userId: req.user.id },
        update: { ...data },
        create: {
          ...data,
          userId: req.user.id,
        }
      })

      res.status(200).json(brecho)
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Erro ao criar brechó' })
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { cidade } = req.query
      
      const brechos = await prisma.brecho.findMany({
        where: cidade ? {
          cidade: {
            contains: cidade as string,
            mode: 'insensitive'
          }
        } : undefined,
        include: {
          pecas: {
            take: 4 // Traz as últimas 4 peças de cada brechó para a vitrine
          }
        }
      })

      res.status(200).json(brechos)
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar brechós' })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const brecho = await prisma.brecho.findUnique({
        where: { id },
        include: { pecas: true }
      })

      if (!brecho) {
        res.status(404).json({ error: 'Brechó não encontrado' })
        return
      }

      res.status(200).json(brecho)
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar brechó' })
    }
  }

  async myStore(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'PROPRIETARIO') {
        res.status(403).json({ error: 'Acesso negado' })
        return
      }

      const brecho = await prisma.brecho.findUnique({
        where: { userId: req.user.id },
        include: { pecas: { orderBy: { createdAt: 'desc' } } }
      })

      if (!brecho) {
        res.status(404).json({ error: 'Você ainda não possui um brechó cadastrado' })
        return
      }

      res.status(200).json(brecho)
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar dados do brechó' })
    }
  }
}
