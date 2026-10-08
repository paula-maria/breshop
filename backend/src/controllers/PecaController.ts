import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { CATEGORIAS, CONDICOES, PUBLICOS, TAMANHOS, TIPOS_POR_CATEGORIA } from '../constants/pecas'
import { paginated, parsePagination, queryList, queryString } from '../utils/query'

const baseSchema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  preco: z.number().positive(),
  tamanho: z.enum(TAMANHOS),
  categoria: z.enum(CATEGORIAS),
  tipo: z.string().min(1),
  publico: z.enum(PUBLICOS).optional(),
  condicao: z.enum(CONDICOES),
  fotos: z.array(z.string()).default([]),
})

function validateTipo(data: { categoria?: (typeof CATEGORIAS)[number]; tipo?: string }, ctx: z.RefinementCtx) {
  if (data.categoria && data.tipo && !TIPOS_POR_CATEGORIA[data.categoria].includes(data.tipo)) {
    ctx.addIssue({ code: 'custom', path: ['tipo'], message: `Tipo inválido para a categoria ${data.categoria}` })
  }
}

const createPecaSchema = baseSchema.superRefine(validateTipo)
const updatePecaSchema = baseSchema.partial().superRefine(validateTipo)

export class PecaController {
  async create(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'PROPRIETARIO') {
        res.status(403).json({ error: 'Apenas proprietários podem criar peças' })
        return
      }

      const brecho = await prisma.brecho.findUnique({
        where: { userId: req.user.id }
      })

      if (!brecho) {
        res.status(404).json({ error: 'Brechó não encontrado para este usuário' })
        return
      }

      const data = createPecaSchema.parse(req.body)

      const peca = await prisma.peca.create({
        data: {
          ...data,
          publico: data.publico ?? 'Unissex',
          brechoId: brecho.id
        }
      })

      res.status(201).json(peca)
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Erro ao criar peça' })
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { page, limit, skip } = parsePagination(req.query)
      const categorias = queryList(req.query.categoria).filter((c) => c.toLowerCase() !== 'todas')
      const tamanhos = queryList(req.query.tamanho)
      const condicoes = queryList(req.query.condicao)
      const tipos = queryList(req.query.tipo)
      const publicos = queryList(req.query.publico)
      const sort = queryString(req.query.sort)
      const q = queryString(req.query.q)

      const and: Prisma.PecaWhereInput[] = []
      if (categorias.length) {
        and.push({ OR: categorias.map((c) => ({ categoria: { equals: c, mode: 'insensitive' as const } })) })
      }
      if (publicos.length) and.push({ publico: { in: publicos } })
      if (tamanhos.length) and.push({ tamanho: { in: tamanhos } })
      if (condicoes.length) and.push({ condicao: { in: condicoes } })
      if (tipos.length) {
        // Peças antigas sem tipo continuam encontráveis pelo nome
        and.push({
          OR: [
            { tipo: { in: tipos } },
            ...tipos.map((t) => ({ tipo: null, nome: { contains: t, mode: 'insensitive' as const } })),
          ],
        })
      }
      const minPreco = Number(req.query.minPreco)
      const maxPreco = Number(req.query.maxPreco)
      if (queryString(req.query.minPreco) && !isNaN(minPreco)) and.push({ preco: { gte: minPreco } })
      if (queryString(req.query.maxPreco) && !isNaN(maxPreco)) and.push({ preco: { lte: maxPreco } })
      const localizacao = queryString(req.query.localizacao)
      if (localizacao) and.push({ brecho: { cidade: { equals: localizacao, mode: 'insensitive' } } })
      const brechoNome = queryString(req.query.brecho)
      if (brechoNome) and.push({ brecho: { nome: { contains: brechoNome, mode: 'insensitive' } } })
      if (req.query.disponivel === 'true') and.push({ disponivel: true })
      if (q) {
        and.push({
          OR: [
            { nome: { contains: q, mode: 'insensitive' } },
            { categoria: { contains: q, mode: 'insensitive' } },
            { brecho: { nome: { contains: q, mode: 'insensitive' } } },
          ],
        })
      }
      const where: Prisma.PecaWhereInput = and.length ? { AND: and } : {}

      const [pecas, total] = await Promise.all([
        prisma.peca.findMany({
          where,
          include: { brecho: { select: { nome: true, cidade: true, estado: true } } },
          orderBy: sort === 'menor-preco'
            ? [{ preco: 'asc' }, { createdAt: 'desc' }]
            : sort === 'mais-procuradas'
              ? [{ favoritos: { _count: 'desc' } }, { createdAt: 'desc' }]
              : { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.peca.count({ where }),
      ])

      res.status(200).json(paginated(pecas, total, page, limit))
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar peças' })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const peca = await prisma.peca.findUnique({
        where: { id: String(req.params.id) },
        include: {
          brecho: { select: { id: true, nome: true, cidade: true, estado: true, whatsapp: true } },
        },
      })

      if (!peca) {
        res.status(404).json({ error: 'Peça não encontrada' })
        return
      }

      res.status(200).json(peca)
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar peça' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!req.user || req.user.role !== 'PROPRIETARIO') {
        res.status(403).json({ error: 'Acesso negado' })
        return
      }

      const data = updatePecaSchema.parse(req.body)

      const peca = await prisma.peca.findUnique({
        where: { id },
        include: { brecho: true }
      })

      if (!peca || peca.brecho.userId !== req.user.id) {
        res.status(404).json({ error: 'Peça não encontrada' })
        return
      }
      
      const categoriaFinal = (data.categoria ?? peca.categoria) as (typeof CATEGORIAS)[number]
      const tipoFinal = data.tipo ?? peca.tipo
      if (tipoFinal && !TIPOS_POR_CATEGORIA[categoriaFinal]?.includes(tipoFinal)) {
        res.status(400).json({ error: `Tipo inválido para a categoria ${categoriaFinal}` })
        return
      }

      // permitimos update de 'disponivel' também, que não está no schema principal
      if (req.body.disponivel !== undefined) {
        data.disponivel = req.body.disponivel
      }

      const updatedPeca = await prisma.peca.update({
        where: { id },
        data: data as any
      })

      res.status(200).json(updatedPeca)
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Erro ao atualizar peça' })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!req.user || req.user.role !== 'PROPRIETARIO') {
        res.status(403).json({ error: 'Acesso negado' })
        return
      }

      const peca = await prisma.peca.findUnique({
        where: { id },
        include: { brecho: true }
      })

      if (!peca || peca.brecho.userId !== req.user.id) {
        res.status(404).json({ error: 'Peça não encontrada' })
        return
      }

      await prisma.peca.delete({
        where: { id }
      })

      res.status(200).json({ success: true })
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao excluir peça' })
    }
  }
}
