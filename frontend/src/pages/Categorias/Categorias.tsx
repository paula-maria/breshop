import { Link } from 'react-router-dom'
import { Shirt, Footprints, Watch, User, UserRound, Baby, ShoppingBag, Tag } from 'lucide-react'
import './Categorias.css'

type CategoriaCard = {
  nome: string
  query: string
  Icon: typeof Shirt
}

const CARDS: CategoriaCard[] = [
  { nome: 'Roupas', query: 'categoria=Roupas', Icon: Shirt },
  { nome: 'Calçados', query: 'categoria=Calçados', Icon: Footprints },
  { nome: 'Acessórios', query: 'categoria=Acessórios', Icon: Watch },
  { nome: 'Feminino', query: 'publico=Feminino', Icon: UserRound },
  { nome: 'Masculino', query: 'publico=Masculino', Icon: User },
  { nome: 'Infantil', query: 'publico=Infantil', Icon: Baby },
  { nome: 'Bolsas', query: 'tipo=Bolsa', Icon: ShoppingBag },
  { nome: 'Outros', query: 'tipo=Outros', Icon: Tag },
]

const EXPLORAR = [
  { nome: 'Peças novas', sort: 'recentes' },
  { nome: 'Menor preço', sort: 'menor-preco' },
  { nome: 'Mais procuradas', sort: 'mais-procuradas' },
]

export default function Categorias() {
  return (
    <div className="categorias-page">
      <header className="categorias-page__header">
        <h1>Categorias</h1>
        <p>Encontre peças do seu estilo</p>
      </header>

      <div className="categorias-grid">
        {CARDS.map((card) => {
          const { Icon } = card
          return (
            <Link key={card.nome} to={`/brechos?view=pecas&${card.query}`} className="categoria-card">
              <Icon className="categoria-card__icon" size={48} strokeWidth={1.5} aria-hidden="true" />
              <span className="categoria-card__name">{card.nome}</span>
            </Link>
          )
        })}
      </div>

      <section className="categorias-explore">
        <h2>Explore também</h2>
        <div className="categorias-explore__chips">
          {EXPLORAR.map((e) => (
            <Link key={e.sort} to={`/brechos?view=pecas&sort=${e.sort}`} className="btn btn-ghost">
              {e.nome}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
