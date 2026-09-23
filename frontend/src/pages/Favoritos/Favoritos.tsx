import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartCrack, ShoppingBag } from 'lucide-react'
import CardPeca, { type CardPecaProps } from '../../components/CardPeca/CardPeca'
import './Favoritos.css'

export default function Favoritos() {
  const [favorites, setFavorites] = useState<CardPecaProps[]>([])

  useEffect(() => {
    const loadFavorites = () => {
      const saved = localStorage.getItem('breshop_favoritos')
      if (saved) {
        setFavorites(JSON.parse(saved))
      }
    }

    loadFavorites()

    // Listen to updates from other tabs or components
    window.addEventListener('favoritesUpdated', loadFavorites)
    return () => window.removeEventListener('favoritesUpdated', loadFavorites)
  }, [])

  return (
    <div className="favoritos-page">
      <div className="favoritos-header">
        <h1 className="favoritos-title">Meus Favoritos</h1>
        <p className="favoritos-subtitle">As peças que você mais amou, todas em um só lugar.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="favoritos-empty">
          <div className="favoritos-empty-icon">
            <HeartCrack size={48} />
          </div>
          <h2>Você ainda não tem favoritos</h2>
          <p>Explore as novidades e garimpos incríveis nos nossos brechós parceiros e comece a salvar suas peças favoritas.</p>
          <Link to="/brechos" className="btn btn-cyan-pill" style={{ marginTop: '24px', display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
            <ShoppingBag size={18} /> Explorar Brechós
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {favorites.map((item) => (
            <CardPeca key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}
