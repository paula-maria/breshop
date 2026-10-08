import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { paginated, parsePagination, queryString } from '../utils/query'

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
      const { page, limit, skip } = parsePagination(req.query)
      const cidade = queryString(req.query.cidade)
      const q = queryString(req.query.q)

      const and: Prisma.BrechoWhereInput[] = []
      if (cidade) and.push({ cidade: { equals: cidade, mode: 'insensitive' } })
      if (q) {
        and.push({
          OR: [
            { nome: { contains: q, mode: 'insensitive' } },
            { descricao: { contains: q, mode: 'insensitive' } },
            { bairro: { contains: q, mode: 'insensitive' } },
            { cidade: { contains: q, mode: 'insensitive' } },
          ],
        })
      }
      const where: Prisma.BrechoWhereInput = and.length ? { AND: and } : {}

      const [brechos, total] = await Promise.all([
        prisma.brecho.findMany({
          where,
          include: {
            pecas: {
              take: 4 // Traz as últimas 4 peças de cada brechó para a vitrine
            }
          },
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          skip,
          take: limit,
        }),
        prisma.brecho.count({ where }),
      ])

      res.status(200).json(paginated(brechos, total, page, limit))
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar brechós' })
    }
  }

  async cidades(req: Request, res: Response) {
    try {
      const rows = await prisma.brecho.findMany({
        where: { cidade: { not: null } },
        select: { cidade: true },
        distinct: ['cidade'],
        orderBy: { cidade: 'asc' },
      })
      res.status(200).json(rows.map((r) => r.cidade).filter(Boolean))
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar cidades' })
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

      const stats = await prisma.avaliacao.aggregate({
        where: { brechoId: brecho.id },
        _avg: { nota: true },
        _count: true,
      })

      res.status(200).json({
        ...brecho,
        avaliacaoMedia: stats._avg?.nota ?? null,
        avaliacaoTotal: stats._count ?? 0,
      })
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar brechó' })
    }
  }

  async minhaAvaliacao(req: Request, res: Response) {
    try {
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { userId_brechoId: { userId: req.user!.id, brechoId: String(req.params.id) } },
        select: { nota: true, comentario: true },
      })
      res.status(200).json(avaliacao)
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar avaliação' })
    }
  }

  async avaliar(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'CLIENTE') {
        res.status(403).json({ error: 'Apenas clientes podem avaliar brechós' })
        return
      }

      const nota = Number(req.body.nota)
      const comentario = typeof req.body.comentario === 'string' && req.body.comentario.trim()
        ? req.body.comentario.trim()
        : null

      if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
        res.status(400).json({ error: 'A nota deve ser um inteiro de 1 a 5' })
        return
      }

      const brechoId = String(req.params.id)
      const brecho = await prisma.brecho.findUnique({ where: { id: brechoId }, select: { id: true } })
      if (!brecho) {
        res.status(404).json({ error: 'Brechó não encontrado' })
        return
      }

      const avaliacao = await prisma.avaliacao.upsert({
        where: { userId_brechoId: { userId: req.user.id, brechoId } },
        create: { nota, comentario, userId: req.user.id, brechoId },
        update: { nota, comentario },
        select: { nota: true, comentario: true },
      })

      res.status(200).json(avaliacao)
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao salvar avaliação' })
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
