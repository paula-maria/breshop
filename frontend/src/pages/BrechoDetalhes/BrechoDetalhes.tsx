import { useState } from 'react'
import { useParams } from 'react-router-dom'
import CardPeca, { type CardPecaProps } from '../../components/CardPeca/CardPeca'

type BrechoInfo = {
  id: string
  nome: string
  rating: string
  reviewsCount: number
  localizacao: string
  horario: string
  bannerUrl: string
  instagram: string
  whatsapp: string
  addressMaps: string
  pecas: CardPecaProps[]
}

const mockBrechosData: Record<string, BrechoInfo> = {
  '1': {
    id: '1',
    nome: 'Brechó da Maria',
    rating: '4,8',
    reviewsCount: 124,
    localizacao: 'Centro, Macapá - AP',
    horario: 'Seg–Sáb · 09:00–18:00',
    bannerUrl: '/images/brecho_maria.png',
    instagram: 'https://instagram.com',
    whatsapp: '5596999999999',
    addressMaps: 'https://maps.google.com',
    pecas: [
      {
        id: '101',
        nome: 'Camisa vintage',
        brecho: 'Brechó da Maria',
        preco: 'R$ 45,00',
        tamanho: 'Tam. M',
        categoria: 'Roupas',
        condicao: 'Seminova',
        statusTag: 'DISPONÍVEL',
        imageUrl: '/images/vintage_shirt.png',
      },
      {
        id: '1',
        nome: 'Jaqueta Jeans Bordada Vintage',
        brecho: 'Brechó da Maria',
        preco: 'R$ 89,90',
        tamanho: 'Tam. M',
        categoria: 'Roupas',
        condicao: 'Excelente estado',
        statusTag: 'DISPONÍVEL',
        imageUrl: '/images/denim_jacket.png',
      },
      {
        id: '2',
        nome: 'Corta Vento Retro 90s',
        brecho: 'Brechó da Maria',
        preco: 'R$ 65,00',
        tamanho: 'Tam. M',
        categoria: 'Roupas',
        condicao: 'Seminova',
        statusTag: '-20%',
        imageUrl: '/images/windbreaker_jacket.png',
      },
      {
        id: '3',
        nome: 'Jaqueta Utility Verde Olive',
        brecho: 'Brechó da Maria',
        preco: 'R$ 120,00',
        tamanho: 'Tam. G',
        categoria: 'Roupas',
        condicao: 'Excelente estado',
        statusTag: 'DISPONÍVEL',
        imageUrl: '/images/olive_jacket.png',
      },
    ],
  },
}

// Fallback for default display if route ID is different
const defaultBrecho: BrechoInfo = mockBrechosData['1']

export default function BrechoDetalhes() {
  const { id } = useParams<{ id: string }>()
  const brecho = (id && mockBrechosData[id]) || defaultBrecho
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todas')

  const categories = ['Todas', 'Roupas', 'Calçados', 'Acessórios']

  const filteredPecas =
    activeCategoryFilter === 'Todas'
      ? brecho.pecas
      : brecho.pecas.filter((p) => p.categoria === activeCategoryFilter)

  const handleWhatsappClick = () => {
    const message = encodeURIComponent(
      `Olá! Encontrei o ${brecho.nome} no Breshop e gostaria de tirar algumas dúvidas.`
    )
    window.open(`https://wa.me/${brecho.whatsapp}?text=${message}`, '_blank')
  }

  return (
    <div className="store-detail-page">
      {/* STORE COVER PHOTO BANNER */}
      <div className="store-banner">
        <img
          src={brecho.bannerUrl}
          alt={brecho.nome}
          className="store-banner__img"
        />
        <div className="store-banner__overlay" />
      </div>

      {/* STORE INFO HEADER */}
      <div className="store-info-card">
        <div className="store-info-card__header">
          <div className="store-info-card__title-area">
            <h1 className="store-info-card__name">{brecho.nome}</h1>
            <div className="store-info-card__rating">
              <span className="stars">★★★★★</span>
              <span className="rating-score">{brecho.rating}</span>
              <span className="reviews-count">({brecho.reviewsCount} avaliações)</span>
            </div>
          </div>
        </div>

        <div className="store-info-card__meta">
          <div className="meta-item">
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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{brecho.localizacao}</span>
          </div>

          <div className="meta-item">
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{brecho.horario}</span>
          </div>
        </div>

        {/* STORE SOCIAL & ACTION BUTTONS */}
        <div className="store-info-card__actions">
          <a
            href={brecho.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost store-action-btn"
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
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Instagram
          </a>

          <button
            type="button"
            className="btn btn-primary store-action-btn"
            onClick={handleWhatsappClick}
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
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp
          </button>

          <a
            href={brecho.addressMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost store-action-btn"
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
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            Como chegar
          </a>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <section className="store-products-section">
        <div className="store-products-section__header">
          <h2 className="store-products-section__title">Peças disponíveis</h2>
          <span className="store-products-section__count">
            {filteredPecas.length} peças encontradas
          </span>
        </div>

        {/* CATEGORY TABS */}
        <div className="store-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-tab-btn ${
                activeCategoryFilter === cat ? 'is-active' : ''
              }`}
              onClick={() => setActiveCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        {filteredPecas.length > 0 ? (
          <div className="grid-3-cols">
            {filteredPecas.map((peca) => (
              <CardPeca key={peca.id} {...peca} />
            ))}
          </div>
        ) : (
          <div className="empty-products-state">
            <p>Nenhuma peça encontrada nesta categoria no momento.</p>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveCategoryFilter('Todas')}
            >
              Ver todas as peças
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
