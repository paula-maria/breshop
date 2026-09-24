import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { z } from 'zod'

const createPecaSchema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  preco: z.number().positive(),
  tamanho: z.string().min(1),
  categoria: z.string().min(2),
  condicao: z.string().min(2),
  fotos: z.array(z.string()).default([]),
})

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
      const { categoria } = req.query
      
      const pecas = await prisma.peca.findMany({
        where: categoria && categoria !== 'todas' ? {
          categoria: {
            equals: categoria as string,
            mode: 'insensitive'
          }
        } : undefined,
        include: {
          brecho: {
            select: { nome: true, cidade: true, estado: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json(pecas)
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar peças' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!req.user || req.user.role !== 'PROPRIETARIO') {
        res.status(403).json({ error: 'Acesso negado' })
        return
      }

      const data = createPecaSchema.partial().parse(req.body)

      const peca = await prisma.peca.findUnique({
        where: { id },
        include: { brecho: true }
      })

      if (!peca || peca.brecho.userId !== req.user.id) {
        res.status(404).json({ error: 'Peça não encontrada' })
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
