import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="not-found-simple-page">
      <h1 className="not-found-big-404">404</h1>
      <h2 className="not-found-simple-title">Página não encontrada</h2>
      <p className="not-found-simple-desc">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Link to="/" className="btn btn-cyan-pill not-found-home-btn">
        <ArrowLeft size={18} /> Voltar para o Início
      </Link>
    </div>
  )
}
