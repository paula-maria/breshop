import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export type CardPecaProps = {
  id: string | number
  nome: string
  brecho: string
  preco: string
  tamanho: string
  categoria?: string
  condicao?: string
  statusTag?: string // e.g. 'DISPONÍVEL', '-20%'
  imageUrl?: string
}

export default function CardPeca({
  id,
  nome,
  brecho,
  preco,
  tamanho,
  statusTag = 'DISPONÍVEL',
  imageUrl,
}: CardPecaProps) {
  const [liked, setLiked] = useState(false)

  return (
    <article className="featured-card">
      <div className="featured-card__media">
        {/* SHOP BADGE OVERLAY TOP-LEFT */}
        <span className="featured-card__shop-badge">{brecho.toUpperCase()}</span>

        {/* STATUS BADGE OVERLAY TOP-RIGHT */}
        <span
          className={`featured-card__status-badge ${
            statusTag.startsWith('-') ? 'is-discount' : ''
          }`}
        >
          {statusTag}
        </span>

        {/* PRODUCT IMAGE */}
        {imageUrl ? (
          <img src={imageUrl} alt={nome} className="featured-card__img" />
        ) : (
          <div className="featured-card__placeholder">
            <span>FOTO</span>
          </div>
        )}

        {/* FLOATING HEART ICON */}
        <button
          type="button"
          className={`featured-card__heart-btn ${liked ? 'is-liked' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setLiked((prev) => !prev)
          }}
          aria-label="Adicionar aos favoritos"
        >
          <Heart
            size={20}
            fill={liked ? '#ef4444' : 'none'}
            stroke={liked ? '#ef4444' : '#1e293b'}
          />
        </button>
      </div>

      <div className="featured-card__content">
        <div className="featured-card__meta-top">
          <span className="featured-card__size">{tamanho}</span>
        </div>
        <h3 className="featured-card__title">{nome}</h3>
        <div className="featured-card__footer">
          <span className="featured-card__price">{preco}</span>
          <Link to={`/pecas/${id}`} className="featured-card__link-btn">
            Ver peça
          </Link>
        </div>
      </div>
    </article>
  )
}
