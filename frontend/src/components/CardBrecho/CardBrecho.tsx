import { Link } from 'react-router-dom'
import { Store, MapPin } from 'lucide-react'

export type CardBrechoProps = {
  id: string | number
  nome: string
  localizacao: string
  descricao?: string
  imageUrl?: string
  itensCount?: number
  tone?: 'teal' | 'navy' | 'cyan'
}

export default function CardBrecho({
  id,
  nome,
  localizacao,
  descricao,
  imageUrl,
  tone = 'teal',
}: CardBrechoProps) {
  return (
    <article className="card card-brecho">
      <div className={`card-brecho__media card-brecho__media--${tone}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={nome} className="card-brecho__img" />
        ) : (
          <div className="card-brecho__banner-illustration">
            <div className="banner-icon-badge">
              <Store size={28} />
            </div>
            <span className="banner-store-tag">{nome.toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="card-brecho__content">
        <h4 className="card-brecho__title">{nome}</h4>
        <p className="card-brecho__location">
          <MapPin size={14} aria-hidden="true" />
          {localizacao}
        </p>
        {descricao && <p className="card-brecho__desc">{descricao}</p>}

        <Link to={`/brechos/${id}`} className="btn btn-ghost card-brecho__action">
          Ver brechó
        </Link>
      </div>
    </article>
  )
}
