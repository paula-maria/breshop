import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import './Categorias.css'

type Pec = { categoria: string; tipo?: string | null; publico?: string | null; fotos?: string[] }

type CategoriaCard = {
  nome: string
  query: string
  match: (p: Pec) => boolean
}

const CARDS: CategoriaCard[] = [
  { nome: 'Roupas', query: 'categoria=Roupas', match: (p) => p.categoria === 'Roupas' },
  { nome: 'Calçados', query: 'categoria=Calçados', match: (p) => p.categoria === 'Calçados' },
  { nome: 'Acessórios', query: 'categoria=Acessórios', match: (p) => p.categoria === 'Acessórios' },
  { nome: 'Feminino', query: 'publico=Feminino', match: (p) => p.publico === 'Feminino' },
  { nome: 'Masculino', query: 'publico=Masculino', match: (p) => p.publico === 'Masculino' },
  { nome: 'Infantil', query: 'publico=Infantil', match: (p) => p.publico === 'Infantil' },
  { nome: 'Bolsas', query: 'tipo=Bolsa', match: (p) => p.tipo === 'Bolsa' },
  { nome: 'Outros', query: 'tipo=Outros', match: (p) => p.tipo === 'Outros' },
]

const EXPLORAR = [
  { nome: 'Peças novas', sort: 'recentes' },
  { nome: 'Menor preço', sort: 'menor-preco' },
  { nome: 'Mais procuradas', sort: 'mais-procuradas' },
]

export default function Categorias() {
  const [pecas, setPecas] = useState<Pec[]>([])

  // Usa a foto de uma peça real de cada categoria como capa do card
  useEffect(() => {
    api.get('/pecas', { params: { limit: 100 } })
      .then((res) => setPecas(res.data.data))
      .catch(() => {})
  }, [])

  return (
    <div className="categorias-page">
      <header className="categorias-page__header">
        <h1>Categorias</h1>
        <p>Encontre peças do seu estilo</p>
      </header>

      <div className="categorias-grid">
        {CARDS.map((card) => {
          const foto = pecas.find((p) => card.match(p) && p.fotos && p.fotos.length > 0)?.fotos?.[0]
          return (
            <Link key={card.nome} to={`/brechos?view=pecas&${card.query}`} className="categoria-card">
              {foto && <img src={foto} alt={card.nome} loading="lazy" />}
              <span className="categoria-card__overlay" />
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
