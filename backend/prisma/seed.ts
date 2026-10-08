import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const SENHA = '123456'

const brechos = [
  { nome: 'Brechó Retrô AP', cidade: 'Macapá', bairro: 'Centro', rua: 'Rua Cândido Mendes', cep: '68900010', insta: '@retroap', entrega: true, retirada: true, negociacao: true, pagamento: ['Pix', 'Dinheiro', 'Cartão de crédito'] },
  { nome: 'Estilo Livre', cidade: 'Macapá', bairro: 'Jesus de Nazaré', rua: 'Av. Jovino Dinoá', cep: '68908000', insta: '@estilolivre.ap', entrega: true, retirada: false, negociacao: true, pagamento: ['Pix', 'Cartão de débito'] },
  { nome: 'Garimpo da Ana', cidade: 'Macapá', bairro: 'Santa Rita', rua: 'Rua Tiradentes', cep: '68901020', insta: '@garimpodaana', entrega: false, retirada: true, negociacao: false, pagamento: ['Pix', 'Dinheiro'] },
  { nome: 'Vintage do Norte', cidade: 'Macapá', bairro: 'Trem', rua: 'Av. FAB', cep: '68900073', insta: '@vintagedonorte', entrega: true, retirada: true, negociacao: false, pagamento: ['Pix', 'Cartão de crédito'] },
  { nome: 'Closet Amapá', cidade: 'Santana', bairro: 'Centro', rua: 'Av. Santana', cep: '68925000', insta: '@closetamapa', entrega: true, retirada: true, negociacao: true, pagamento: ['Pix', 'Dinheiro'] },
  { nome: 'Peças com História', cidade: 'Santana', bairro: 'Hospitalidade', rua: 'Rua Carlos Drummond', cep: '68928010', insta: '@pecascomhistoria', entrega: false, retirada: true, negociacao: true, pagamento: ['Pix'] },
  { nome: 'Brechó da Dona Lúcia', cidade: 'Santana', bairro: 'Fonte Nova', rua: 'Rua Manoel Vitorino', cep: '68927050', insta: '@donalucia.brecho', entrega: true, retirada: false, negociacao: false, pagamento: ['Pix', 'Dinheiro'] },
  { nome: 'Reuse Laranjal', cidade: 'Laranjal do Jari', bairro: 'Centro', rua: 'Av. Tancredo Neves', cep: '68920000', insta: '@reuselaranjal', entrega: false, retirada: true, negociacao: true, pagamento: ['Pix', 'Dinheiro'] },
  { nome: 'Moda Circular', cidade: 'Laranjal do Jari', bairro: 'Agreste', rua: 'Rua da Paz', cep: '68920120', insta: '@modacircular.ap', entrega: true, retirada: true, negociacao: false, pagamento: ['Pix', 'Cartão de débito'] },
  { nome: 'Achados do Equador', cidade: 'Macapá', bairro: 'Buritizal', rua: 'Rua Hildemar Maia', cep: '68902050', insta: '@achadosdoequador', entrega: true, retirada: true, negociacao: true, pagamento: ['Pix', 'Cartão de crédito', 'Dinheiro'] },
]

// [nome, categoria, tipo, tamanho, condicao, preco, descricao]
type P = [string, string, string, string, string, number, string]
const pecas: P[] = [
  ['Camiseta Banda Anos 90', 'Roupas', 'Camiseta', 'M', 'Usado', 35, 'Camiseta de algodão com estampa de banda, toque macio.'],
  ['Camiseta Básica Branca', 'Roupas', 'Camiseta', 'G', 'Seminovo', 25, 'Básica branca, sem manchas.'],
  ['Camiseta Oversized Preta', 'Roupas', 'Camiseta', 'GG', 'Novo', 45, 'Modelagem oversized, nunca usada.'],
  ['Camiseta Listrada', 'Roupas', 'Camiseta', 'P', 'Usado', 22, 'Listras azul e branco, estilo marinheiro.'],
  ['Camiseta Tie-Dye', 'Roupas', 'Camiseta', 'M', 'Seminovo', 30, 'Tingimento artesanal em tons de azul.'],
  ['Camisa Social Azul', 'Roupas', 'Camisa', 'M', 'Seminovo', 50, 'Camisa social de manga longa.'],
  ['Camisa Xadrez Flanelada', 'Roupas', 'Camisa', 'G', 'Usado', 40, 'Flanela xadrez vermelha e preta.'],
  ['Camisa Havaiana', 'Roupas', 'Camisa', 'M', 'Usado', 38, 'Estampa tropical, tecido leve.'],
  ['Camisa Jeans Desbotada', 'Roupas', 'Camisa', 'P', 'Usado', 55, 'Jeans lavado com aspecto vintage.'],
  ['Camisa de Linho Bege', 'Roupas', 'Camisa', 'GG', 'Novo', 70, 'Linho puro, ideal para o calor.'],
  ['Calça Jeans Reta', 'Roupas', 'Calça', 'M', 'Seminovo', 60, 'Jeans reto cintura alta.'],
  ['Calça Mom Azul Clara', 'Roupas', 'Calça', 'P', 'Usado', 55, 'Modelo mom, lavagem clara.'],
  ['Calça de Alfaiataria Preta', 'Roupas', 'Calça', 'G', 'Seminovo', 65, 'Alfaiataria com pregas.'],
  ['Calça Cargo Verde', 'Roupas', 'Calça', 'GG', 'Usado', 50, 'Cargo com bolsos laterais.'],
  ['Calça Pantalona Estampada', 'Roupas', 'Calça', 'M', 'Novo', 80, 'Pantalona fluida, estampa floral.'],
  ['Vestido Floral Midi', 'Roupas', 'Vestido', 'M', 'Seminovo', 75, 'Midi floral com botões frontais.'],
  ['Vestido Preto Básico', 'Roupas', 'Vestido', 'P', 'Usado', 45, 'Curto e versátil.'],
  ['Vestido Longo Vermelho', 'Roupas', 'Vestido', 'G', 'Novo', 120, 'Longo, para festas.'],
  ['Vestido Jeans', 'Roupas', 'Vestido', 'M', 'Usado', 58, 'Vestido jeans com cinto.'],
  ['Vestido Chemise Listrado', 'Roupas', 'Vestido', 'GG', 'Seminovo', 68, 'Chemise listrado, manga curta.'],
  ['Saia Plissada Rosa', 'Roupas', 'Saia', 'P', 'Seminovo', 42, 'Plissada na altura do joelho.'],
  ['Saia Jeans Curta', 'Roupas', 'Saia', 'M', 'Usado', 35, 'Jeans com botões frontais.'],
  ['Saia Longa Estampada', 'Roupas', 'Saia', 'G', 'Novo', 65, 'Estampa étnica, cintura elástica.'],
  ['Saia Lápis Preta', 'Roupas', 'Saia', 'M', 'Seminovo', 48, 'Corte lápis, cintura alta.'],
  ['Saia Midi de Couro Sintético', 'Roupas', 'Saia', 'P', 'Usado', 52, 'Visual moderno e confortável.'],
  ['Jaqueta Jeans Vintage', 'Roupas', 'Jaqueta', 'M', 'Usado', 80, 'Jaqueta jeans clássica dos anos 90.'],
  ['Jaqueta de Couro Preta', 'Roupas', 'Jaqueta', 'G', 'Seminovo', 150, 'Couro legítimo, forro intacto.'],
  ['Jaqueta Corta-Vento', 'Roupas', 'Jaqueta', 'GG', 'Usado', 70, 'Corta-vento colorido.'],
  ['Jaqueta Bomber Verde', 'Roupas', 'Jaqueta', 'M', 'Novo', 130, 'Bomber verde militar.'],
  ['Jaqueta de Sarja Caramelo', 'Roupas', 'Jaqueta', 'P', 'Seminovo', 85, 'Sarja grossa, forro de flanela.'],
  ['Short Jeans Cintura Alta', 'Roupas', 'Outros', 'M', 'Seminovo', 38, 'Short jeans com barra desfiada.'],
  ['Cardigã de Tricô Creme', 'Roupas', 'Outros', 'G', 'Usado', 55, 'Tricô feito à mão.'],
  ['Macacão Jeans', 'Roupas', 'Outros', 'M', 'Usado', 90, 'Macacão longo com bolsos.'],
  ['Moletom Cinza', 'Roupas', 'Outros', 'GG', 'Seminovo', 60, 'Moletom flanelado com capuz.'],
  ['Blazer Xadrez', 'Roupas', 'Outros', 'M', 'Seminovo', 95, 'Blazer estruturado, forro completo.'],
  ['Tênis Branco Clássico', 'Calçados', 'Tênis', 'Único', 'Seminovo', 110, 'Tênis branco, solado em ótimo estado.'],
  ['Tênis Cano Alto Preto', 'Calçados', 'Tênis', 'Único', 'Usado', 90, 'Cano alto, estilo skatista.'],
  ['Tênis Running Azul', 'Calçados', 'Tênis', 'Único', 'Seminovo', 130, 'Amortecimento ainda firme.'],
  ['Tênis Retrô Vermelho', 'Calçados', 'Tênis', 'Único', 'Usado', 85, 'Modelo retrô dos anos 80.'],
  ['Tênis Casual de Lona', 'Calçados', 'Tênis', 'Único', 'Novo', 75, 'Lona resistente, sem uso.'],
  ['Sandália de Couro Marrom', 'Calçados', 'Outros', 'Único', 'Usado', 55, 'Couro macio, tiras ajustáveis.'],
  ['Bota Coturno Preta', 'Calçados', 'Outros', 'Único', 'Seminovo', 120, 'Coturno com zíper lateral.'],
  ['Scarpin Nude', 'Calçados', 'Outros', 'Único', 'Seminovo', 70, 'Salto 8 cm, bico fino.'],
  ['Bolsa Tiracolo de Couro', 'Acessórios', 'Bolsa', 'Único', 'Seminovo', 85, 'Couro com fecho metálico.'],
  ['Bolsa de Palha', 'Acessórios', 'Bolsa', 'Único', 'Novo', 60, 'Palha natural com alça de couro.'],
  ['Mochila Jeans', 'Acessórios', 'Bolsa', 'Único', 'Usado', 45, 'Mochila jeans com bolso frontal.'],
  ['Bolsa Baguete Vintage', 'Acessórios', 'Bolsa', 'Único', 'Usado', 95, 'Formato baguete, estilo anos 2000.'],
  ['Cinto de Couro Trançado', 'Acessórios', 'Outros', 'Único', 'Seminovo', 30, 'Couro trançado, fivela dourada.'],
  ['Chapéu Panamá', 'Acessórios', 'Outros', 'Único', 'Novo', 50, 'Palha fina, aba média.'],
  ['Óculos de Sol Retrô', 'Acessórios', 'Outros', 'Único', 'Usado', 40, 'Armação redonda, lentes escuras.'],
  ['Lenço de Seda Estampado', 'Acessórios', 'Outros', 'Único', 'Seminovo', 28, 'Seda com estampa geométrica.'],
  ['Camiseta Infantil Dinossauro', 'Roupas', 'Camiseta', 'P', 'Seminovo', 20, 'Camiseta infantil com estampa divertida.'],
  ['Vestido Infantil Florido', 'Roupas', 'Vestido', 'PP', 'Usado', 32, 'Vestidinho leve para festas.'],
  ['Calça Jeans Infantil', 'Roupas', 'Calça', 'P', 'Seminovo', 35, 'Jeans com cintura elástica.'],
  ['Tênis Infantil Colorido', 'Calçados', 'Tênis', 'Único', 'Usado', 40, 'Tênis com velcro, bem conservado.'],
]

function publicoDe(nome: string): string {
  if (/infantil/i.test(nome)) return 'Infantil'
  if (/vestido|saia|scarpin|bolsa|mom|lenço|cardigã|baguete|plissada|pantalona|macacão|blazer xadrez/i.test(nome)) return 'Feminino'
  if (/social|havaiana|banda|oversized|coturno|cargo|running|moletom|bomber|panamá/i.test(nome)) return 'Masculino'
  return 'Unissex'
}

async function main() {
  const hash = await bcrypt.hash(SENHA, 10)

  const user = (email: string, name: string, role: 'CLIENTE' | 'PROPRIETARIO') =>
    prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, password: hash } })

  const clientes = await Promise.all([
    user('cliente@teste.com', 'Mariana Souza', 'CLIENTE'),
    user('cliente2@teste.com', 'João Pereira', 'CLIENTE'),
    user('cliente3@teste.com', 'Camila Ferreira', 'CLIENTE'),
  ])

  const brechoRecords = []
  for (const [i, b] of brechos.entries()) {
    const n = i + 1
    const dono = await user(`dono${n}@teste.com`, `Dono(a) ${b.nome}`, 'PROPRIETARIO')
    const data = {
      nome: b.nome,
      descricao: `${b.nome}: peças selecionadas com carinho, moda sustentável em ${b.cidade}.`,
      telefone: `9632${String(10000 + n * 111).slice(0, 5)}`.slice(0, 11),
      whatsapp: `96991${String(100000 + n * 4321).slice(0, 6)}`,
      emailContato: `contato${n}@teste.com`,
      instagram: b.insta,
      cep: b.cep,
      rua: b.rua,
      numero: String(100 + n * 17),
      bairro: b.bairro,
      cidade: b.cidade,
      estado: 'AP',
      horarios: 'Seg a Sex das 09:00 às 18:00 | Sáb: 09:00 às 13:00 | Dom: Fechado',
      formasPagamento: b.pagamento,
      atendimento: 'Presencial e online',
      entrega: b.entrega,
      retirada: b.retirada,
      negociacao: b.negociacao,
    }
    brechoRecords.push(
      await prisma.brecho.upsert({ where: { userId: dono.id }, update: {}, create: { ...data, userId: dono.id } })
    )
  }

  const pecaRecords = []
  for (const [i, p] of pecas.entries()) {
    const [nome, categoria, tipo, tamanho, condicao, preco, descricao] = p
    const brecho = brechoRecords[i % brechoRecords.length]
    const publico = publicoDe(nome)
    const existente = await prisma.peca.findFirst({ where: { nome, brechoId: brecho.id } })
    pecaRecords.push(
      (existente && (await prisma.peca.update({ where: { id: existente.id }, data: { publico, fotos: [] } }))) ||
        (await prisma.peca.create({
          data: {
            nome, categoria, tipo, publico, tamanho, condicao, preco, descricao,
            fotos: [],
            disponivel: i % 9 !== 8,
            brechoId: brecho.id,
          },
        }))
    )
  }

  const comentarios = ['Atendimento excelente!', 'Peças em ótimo estado.', 'Preços justos, voltarei.', 'Entrega rápida.', 'Gostei bastante.']
  for (const [ci, cliente] of clientes.entries()) {
    for (const [bi, brecho] of brechoRecords.entries()) {
      if ((bi + ci) % 2 !== 0) continue
      const nota = 3 + ((bi + ci * 2) % 3)
      await prisma.avaliacao.upsert({
        where: { userId_brechoId: { userId: cliente.id, brechoId: brecho.id } },
        update: {},
        create: { userId: cliente.id, brechoId: brecho.id, nota, comentario: comentarios[(bi + ci) % comentarios.length] },
      })
    }
    for (const peca of pecaRecords.filter((_, i) => (i + ci) % 7 === 0)) {
      await prisma.favorito.upsert({
        where: { userId_pecaId: { userId: cliente.id, pecaId: peca.id } },
        update: {},
        create: { userId: cliente.id, pecaId: peca.id },
      })
    }
  }

  // Uma conversa com proposta para testar o fluxo de negociação
  const alvo = pecaRecords.find((p, i) => p.disponivel && brechos[i % brechos.length].negociacao)
  if (alvo) {
    const jaExiste = await prisma.chat.findFirst({ where: { userId: clientes[0].id, pecaId: alvo.id } })
    if (!jaExiste) {
      const chat = await prisma.chat.create({
        data: { userId: clientes[0].id, brechoId: alvo.brechoId, pecaId: alvo.id },
      })
      const dono = await prisma.brecho.findUniqueOrThrow({ where: { id: alvo.brechoId } })
      await prisma.mensagem.createMany({
        data: [
          { chatId: chat.id, senderId: clientes[0].id, content: 'Olá! Essa peça ainda está disponível?' },
          { chatId: chat.id, senderId: dono.userId, content: 'Oi! Está sim, posso te ajudar com algo?' },
        ],
      })
      await prisma.proposta.create({
        data: { chatId: chat.id, pecaId: alvo.id, userId: clientes[0].id, valor: Math.round(alvo.preco * 0.85) },
      })
    }
  }

  console.log(`Seed concluído: ${brechoRecords.length} brechós, ${pecaRecords.length} peças.`)
  console.log(`Logins de teste (senha ${SENHA}): cliente@teste.com, dono1@teste.com ... dono10@teste.com`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
