import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

type PecaInfo = {
  id: string
  nome: string
  preco: string
  tamanho: string
  condicao: string
  categoria: string
  cor: string
  descricao: string
  imageUrl: string
  brechoId: string
  brechoNome: string
  brechoLocalizacao: string
  brechoRating: string
  brechoWhatsapp: string
}

const mockPecasData: Record<string, PecaInfo> = {
  '101': {
    id: '101',
    nome: 'Camisa vintage',
    preco: 'R$ 45,00',
    tamanho: 'M',
    condicao: 'Seminova',
    categoria: 'Roupas / Camisas',
    cor: 'Estampada Étnica Retro',
    descricao:
      'Camisa estampada vintage em ótimo estado de conservação, tecido leve e fluido com padronagem retrô exclusiva dos anos 90.',
    imageUrl: '/images/vintage_shirt.png',
    brechoId: '1',
    brechoNome: 'Brechó da Maria',
    brechoLocalizacao: 'Centro, Macapá - AP',
    brechoRating: '4.8',
    brechoWhatsapp: '5596999999999',
  },
  '1': {
    id: '1',
    nome: 'Jaqueta Jeans Bordada Vintage',
    preco: 'R$ 89,90',
    tamanho: 'M',
    condicao: 'Excelente estado',
    categoria: 'Casacos & Jaquetas',
    cor: 'Jeans Azul Clássico',
    descricao:
      'Jaqueta jeans vintage estruturada com bordados florais artesanais no colarinho e nos bolsos. Peça única com excelente vestibilidade.',
    imageUrl: '/images/denim_jacket.png',
    brechoId: '1',
    brechoNome: 'Brechó da Maria',
    brechoLocalizacao: 'Centro, Macapá - AP',
    brechoRating: '4.8',
    brechoWhatsapp: '5596999999999',
  },
  '2': {
    id: '2',
    nome: 'Corta Vento Retro 90s',
    preco: 'R$ 65,00',
    tamanho: 'M',
    condicao: 'Seminova',
    categoria: 'Casacos & Jaquetas',
    cor: 'Azul Pastel & Branco',
    descricao:
      'Jaqueta corta-vento original dos anos 90 com zíper frontal e detalhes em blocos de cor pastel.',
    imageUrl: '/images/windbreaker_jacket.png',
    brechoId: '1',
    brechoNome: 'Brechó da Maria',
    brechoLocalizacao: 'Centro, Macapá - AP',
    brechoRating: '4.8',
    brechoWhatsapp: '5596999999999',
  },
  '3': {
    id: '3',
    nome: 'Jaqueta Utility Verde Olive',
    preco: 'R$ 120,00',
    tamanho: 'G',
    condicao: 'Excelente estado',
    categoria: 'Casacos & Jaquetas',
    cor: 'Verde Militar / Olive',
    descricao:
      'Jaqueta estilo militar utility em algodão encorpado com múltiplos bolsos frontais e ajuste na cintura.',
    imageUrl: '/images/olive_jacket.png',
    brechoId: '1',
    brechoNome: 'Brechó da Maria',
    brechoLocalizacao: 'Centro, Macapá - AP',
    brechoRating: '4.8',
    brechoWhatsapp: '5596999999999',
  },
}

// Default fallback item
const defaultPeca: PecaInfo = mockPecasData['101']

export default function PecaDetalhes() {
  const { id } = useParams<{ id: string }>()
  const peca = (id && mockPecasData[id]) || defaultPeca
  const [copied, setCopied] = useState(false)

  const handleContactClick = () => {
    const message = encodeURIComponent(
      `Olá! Vi a peça *${peca.nome}* (${peca.preco}) no Breshop e gostaria de saber se ainda está disponível.`
    )
    window.open(`https://wa.me/${peca.brechoWhatsapp}?text=${message}`, '_blank')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="product-detail-page">
      {/* BREADCRUMB */}
      <nav className="breadcrumb" aria-label="Navegação de migalhas de pão">
        <Link to="/">Início</Link>
        <span className="separator">/</span>
        <Link to="/brechos">Brechós</Link>
        <span className="separator">/</span>
        <Link to={`/brechos/${peca.brechoId}`}>{peca.brechoNome}</Link>
        <span className="separator">/</span>
        <span className="current">{peca.nome}</span>
      </nav>

      {/* 2-COLUMN PRODUCT CONTAINER */}
      <div className="product-detail-card">
        {/* LEFT COLUMN: IMAGE */}
        <div className="product-detail-media">
          <img
            src={peca.imageUrl}
            alt={peca.nome}
            className="product-detail-img"
          />
          <span className="product-detail-badge">DISPONÍVEL</span>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="product-detail-info">
          <div className="product-header">
            <span className="product-category">{peca.categoria}</span>
            <h1 className="product-title">{peca.nome}</h1>
            <p className="product-price">{peca.preco}</p>
          </div>

          <hr className="divider" />

          {/* SPECIFICATIONS GRID */}
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Tamanho:</span>
              <span className="spec-value highlight-badge">{peca.tamanho}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Condição:</span>
              <span className="spec-value">{peca.condicao}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Cor:</span>
              <span className="spec-value">{peca.cor}</span>
            </div>
          </div>

          <div className="product-description">
            <h3 className="section-subtitle">Descrição da peça</h3>
            <p>{peca.descricao}</p>
          </div>

          {/* STORE INFO CARD BOX */}
          <div className="seller-box">
            <div className="seller-box__info">
              <span className="seller-box__label">Vendido por</span>
              <Link
                to={`/brechos/${peca.brechoId}`}
                className="seller-box__name"
              >
                {peca.brechoNome}
              </Link>
              <p className="seller-box__location">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {peca.brechoLocalizacao}
              </p>
            </div>
            <Link
              to={`/brechos/${peca.brechoId}`}
              className="btn btn-ghost btn-sm"
            >
              Ver perfil
            </Link>
          </div>

          {/* PRIMARY CTA: ENTRAR EM CONTATO */}
          <div className="cta-actions-group">
            <button
              type="button"
              className="btn btn-cyan-pill cta-contact-btn"
              onClick={handleContactClick}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Entrar em contato
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-share"
              onClick={handleShare}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {copied ? 'Link copiado!' : 'Compartilhar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
