import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { Heart, MessageCircle, HandCoins } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../../../services/api'
import CardPeca, { type CardPecaProps } from '../../../components/CardPeca/CardPeca'
import '../../../components/ClientLayout/ClientLayout.css'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [recentPecas, setRecentPecas] = useState<CardPecaProps[]>([])
  const favoritesCount = JSON.parse(localStorage.getItem('breshop_favoritos') || '[]').length

  useEffect(() => {
    api.get('/pecas').then((res) => {
      const mapped = res.data.slice(0, 4).map((p: any) => ({
        id: p.id,
        nome: p.nome,
        brecho: p.brecho?.nome || 'Brechó',
        preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
        tamanho: `Tam. ${p.tamanho}`,
        categoria: p.categoria,
        statusTag: p.disponivel ? 'DISPONÍVEL' : 'VENDIDO',
        imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0] : '/images/vintage_shirt.png',
      }))
      setRecentPecas(mapped)
    }).catch(() => {})
  }, [])

  const summaryCards = [
    {
      to: '/cliente/favoritos',
      icon: <Heart size={20} />,
      iconClass: 'client-summary-card__icon--pink',
      label: 'Favoritos',
      count: favoritesCount,
    },
    {
      to: '/cliente/conversas',
      icon: <MessageCircle size={20} />,
      iconClass: 'client-summary-card__icon--blue',
      label: 'Conversas',
      count: 0,
    },
    {
      to: '/cliente/propostas',
      icon: <HandCoins size={20} />,
      iconClass: 'client-summary-card__icon--green',
      label: 'Propostas',
      count: 0,
    },
  ]

  return (
    <div className="client-dashboard">
      {/* GREETING */}
      <div className="client-dashboard__greeting">
        <h1 className="client-dashboard__hello">Olá, {user?.name?.split(' ')[0]}!</h1>
        <p className="client-dashboard__sub">Encontre peças que combinam com você.</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="client-summary-cards">
        {summaryCards.map((card) => (
          <Link key={card.to} to={card.to} className="client-summary-card">
            <div className={`client-summary-card__icon ${card.iconClass}`}>
              {card.icon}
            </div>
            <div>
              <div className="client-summary-card__label">{card.label}</div>
              <div className="client-summary-card__count">{card.count}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* RECENT PIECES */}
      <h2 className="client-recent-title">Peças Recentes</h2>
      {recentPecas.length > 0 ? (
        <div className="grid-3-cols">
          {recentPecas.map((peca) => (
            <CardPeca key={peca.id} {...peca} />
          ))}
        </div>
      ) : (
        <div className="client-empty-state">
          <p>Nenhuma peça disponível ainda.</p>
        </div>
      )}
    </div>
  )
}
