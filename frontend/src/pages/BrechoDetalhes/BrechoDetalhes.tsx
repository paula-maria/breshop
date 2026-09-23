import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, MapPin, Clock, Camera, MessageCircle, Map } from 'lucide-react'
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
              <span className="stars" style={{ display: 'inline-flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" stroke="#f59e0b" />
                ))}
              </span>
              <span className="rating-score">{brecho.rating}</span>
              <span className="reviews-count">({brecho.reviewsCount} avaliações)</span>
            </div>
          </div>
        </div>

        <div className="store-info-card__meta">
          <div className="meta-item">
            <MapPin size={18} />
            <span>{brecho.localizacao}</span>
          </div>

          <div className="meta-item">
            <Clock size={18} />
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
            <Camera size={18} />
            Instagram
          </a>

          <button
            type="button"
            className="btn btn-primary store-action-btn"
            onClick={handleWhatsappClick}
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>

          <a
            href={brecho.addressMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost store-action-btn"
          >
            <Map size={18} />
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
