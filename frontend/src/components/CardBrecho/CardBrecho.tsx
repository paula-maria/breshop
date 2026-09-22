import { Link } from 'react-router-dom'

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
            <div className="banner-icon-badge">🏪</div>
            <span className="banner-store-tag">{nome.toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="card-brecho__content">
        <h4 className="card-brecho__title">{nome}</h4>
        <p className="card-brecho__location">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
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
