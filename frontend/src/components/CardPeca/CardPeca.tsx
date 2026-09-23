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
  categoria,
  condicao,
  statusTag = 'DISPONÍVEL',
  imageUrl,
}: CardPecaProps) {
  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem('breshop_favoritos')
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.some((item: any) => item.id === id)
    }
    return false
  })

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newLiked = !liked
    setLiked(newLiked)

    const saved = localStorage.getItem('breshop_favoritos')
    let favorites = saved ? JSON.parse(saved) : []

    if (newLiked) {
      favorites.push({ id, nome, brecho, preco, tamanho, categoria, condicao, statusTag, imageUrl })
    } else {
      favorites = favorites.filter((item: any) => item.id !== id)
    }

    localStorage.setItem('breshop_favoritos', JSON.stringify(favorites))
    window.dispatchEvent(new Event('favoritesUpdated'))
  }

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
          onClick={toggleLike}
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
