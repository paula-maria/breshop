import { Request, Response } from 'express'
import { z } from 'zod'
import QRCode from 'qrcode'
import { prisma } from '../config/prisma'

const criarPedidoSchema = z.object({
  pecaIds: z.array(z.string().uuid()).min(1).max(30),
}).refine(({ pecaIds }) => new Set(pecaIds).size === pecaIds.length, {
  message: 'O carrinho contém peças repetidas',
})

const simulacaoSchema = z.object({
  resultado: z.enum(['APROVADO', 'RECUSADO']),
})

function pagamentoPublico(pagamento: { id: string; status: string; valorCentavos: number; codigoPix: string; qrCodeDataUrl: string }) {
  return {
    id: pagamento.id,
    status: pagamento.status,
    valorCentavos: pagamento.valorCentavos,
    codigoPix: pagamento.codigoPix,
    qrCodeDataUrl: pagamento.qrCodeDataUrl,
    demonstracao: true,
    aviso: 'QR Code demonstrativo. Não é uma cobrança Pix válida e não transfere dinheiro.',
  }
}

export class PedidoController {
  async criar(req: Request, res: Response) {
    if (!req.user || req.user.role !== 'CLIENTE') {
      res.status(403).json({ error: 'Apenas clientes podem criar pedidos' })
      return
    }

    try {
      const { pecaIds } = criarPedidoSchema.parse(req.body)
      const resultado = await prisma.$transaction(async (tx) => {
        const pecas = await tx.peca.findMany({
          where: { id: { in: pecaIds }, disponivel: true },
          select: { id: true, preco: true },
        })
        if (pecas.length !== pecaIds.length) throw new Error('INDISPONIVEL')

        const itens = pecas.map((peca) => ({ pecaId: peca.id, precoCentavos: Math.round(peca.preco * 100) }))
        const totalCentavos = itens.reduce((total, item) => total + item.precoCentavos, 0)
        const pedido = await tx.pedido.create({
          data: {
            userId: req.user!.id,
            totalCentavos,
            itens: { create: itens },
          },
        })

        // Marca as peças como reservadas dentro da mesma transação. A condição evita
        // que dois pedidos simultâneos reservem a mesma peça única.
        const reserva = await tx.peca.updateMany({
          where: { id: { in: pecaIds }, disponivel: true },
          data: { disponivel: false },
        })
        if (reserva.count !== pecaIds.length) throw new Error('INDISPONIVEL')

        const codigoPix = `BRESHOP-PIX-DEMO|${pedido.id}|${totalCentavos}`
        const qrCodeDataUrl = await QRCode.toDataURL(codigoPix, { errorCorrectionLevel: 'M', margin: 2, width: 280 })
        const pagamento = await tx.pagamento.create({
          data: { pedidoId: pedido.id, valorCentavos: totalCentavos, codigoPix, qrCodeDataUrl },
        })
        return { pedido, pagamento }
      })

      res.status(201).json({
        id: resultado.pedido.id,
        status: resultado.pedido.status,
        totalCentavos: resultado.pedido.totalCentavos,
        pagamento: pagamentoPublico(resultado.pagamento),
      })
    } catch (error: any) {
      if (error?.message === 'INDISPONIVEL') {
        res.status(409).json({ error: 'Uma ou mais peças não estão mais disponíveis' })
        return
      }
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues[0]?.message ?? 'Dados inválidos' })
        return
      }
      console.error(error)
      res.status(500).json({ error: 'Não foi possível criar o pedido' })
    }
  }

  async simularPagamento(req: Request, res: Response) {
    if (!req.user || req.user.role !== 'CLIENTE') {
      res.status(403).json({ error: 'Apenas clientes podem simular o pagamento' })
      return
    }

    try {
      const { resultado } = simulacaoSchema.parse(req.body)
      const pedidoId = String(req.params.id)
      const pagamento = await prisma.$transaction(async (tx) => {
        const pedido = await tx.pedido.findFirst({
          where: { id: pedidoId, userId: req.user!.id },
          include: { pagamento: true, itens: true },
        })
        if (!pedido || !pedido.pagamento) throw new Error('NAO_ENCONTRADO')
        const processamento = await tx.pagamento.updateMany({
          where: { id: pedido.pagamento.id, status: 'PENDENTE' },
          data: { status: resultado },
        })
        if (processamento.count !== 1) throw new Error('JA_PROCESSADO')
        if (resultado === 'APROVADO') {
          await tx.pedido.update({ where: { id: pedido.id }, data: { status: 'PAGO' } })
        } else {
          await tx.pedido.update({ where: { id: pedido.id }, data: { status: 'CANCELADO' } })
          await tx.peca.updateMany({
            where: { id: { in: pedido.itens.map((item) => item.pecaId) } },
            data: { disponivel: true },
          })
        }
        return tx.pagamento.findUniqueOrThrow({ where: { id: pedido.pagamento.id } })
      })
      res.status(200).json({ pagamento: pagamentoPublico(pagamento) })
    } catch (error: any) {
      if (error?.message === 'NAO_ENCONTRADO') {
        res.status(404).json({ error: 'Pedido não encontrado' })
        return
      }
      if (error?.message === 'JA_PROCESSADO') {
        res.status(409).json({ error: 'Este pagamento já foi processado' })
        return
      }
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues[0]?.message ?? 'Dados inválidos' })
        return
      }
      console.error(error)
      res.status(500).json({ error: 'Não foi possível simular o pagamento' })
    }
  }
}
