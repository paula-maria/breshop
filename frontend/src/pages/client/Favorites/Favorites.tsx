import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardPeca, { type CardPecaProps } from '../../../components/CardPeca/CardPeca'
import { Heart, ShoppingBag } from 'lucide-react'

export default function ClientFavorites() {
  const [favorites, setFavorites] = useState<CardPecaProps[]>([])

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('breshop_favoritos')
      setFavorites(saved ? JSON.parse(saved) : [])
    }
    load()
    window.addEventListener('favoritesUpdated', load)
    return () => window.removeEventListener('favoritesUpdated', load)
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          Meus Favoritos
        </h1>
        <p style={{ color: '#64748b', margin: 0 }}>
          {favorites.length > 0 ? `${favorites.length} peça${favorites.length > 1 ? 's' : ''} salva${favorites.length > 1 ? 's' : ''}` : 'Nenhuma peça salva ainda.'}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="client-empty-state">
          <Heart size={48} />
          <h3>Você ainda não tem favoritos</h3>
          <p>Explore os brechós e salve as peças que você mais curtir.</p>
          <Link to="/brechos" className="btn btn-cyan-pill" style={{ marginTop: '1rem', display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
            <ShoppingBag size={18} /> Explorar Brechós
          </Link>
        </div>
      ) : (
        <div className="grid-3-cols">
          {favorites.map((item) => (
            <CardPeca key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}
