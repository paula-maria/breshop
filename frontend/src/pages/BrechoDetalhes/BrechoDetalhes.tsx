import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Star, MapPin, Clock, Camera, MessageCircle, Map } from 'lucide-react'
import CardPeca, { type CardPecaProps } from '../../components/CardPeca/CardPeca'
import { api } from '../../services/api'

type BrechoInfo = {
  id: string
  nome: string
  rating: string
  reviewsCount: number
  localizacao: string
  horario: string
  bannerUrl: string
  instagram: string
  whatsapp: string
  addressMaps: string
  pecas: CardPecaProps[]
}

export default function BrechoDetalhes() {
  const { id } = useParams<{ id: string }>()
  const [brecho, setBrecho] = useState<BrechoInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todas')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    async function fetchBrecho() {
      try {
        const res = await api.get(`/brechos/${id}`)
        const b = res.data
        const mappedBrecho: BrechoInfo = {
          id: b.id,
          nome: b.nome,
          rating: '5,0',
          reviewsCount: 1,
          localizacao: b.cidade ? `${b.bairro || ''}, ${b.cidade} - ${b.estado || ''}`.replace(/^, /, '') : 'Localização não informada',
          horario: b.horarios || 'Horários não informados',
          bannerUrl: b.capaUrl || '/images/brecho_maria.png',
          instagram: b.instagram || '',
          whatsapp: b.whatsapp || '',
          addressMaps: `https://maps.google.com/?q=${encodeURIComponent(`${b.rua || ''}, ${b.numero || ''}, ${b.cidade || ''}`)}`,
          pecas: b.pecas ? b.pecas.map((p: any) => ({
            id: p.id,
            nome: p.nome,
            brecho: b.nome,
            preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
            tamanho: `Tam. ${p.tamanho}`,
            categoria: p.categoria,
            condicao: p.condicao,
            statusTag: p.disponivel ? 'DISPONÍVEL' : 'VENDIDO',
            imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0] : ''
          })) : []
        }
        setBrecho(mappedBrecho)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchBrecho()
  }, [id])

  const categories = ['Todas', 'Roupas', 'Calçados', 'Acessórios']

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Carregando perfil oficial do brechó...</div>
  if (!brecho) return <div style={{ padding: 60, textAlign: 'center' }}>Brechó não encontrado.</div>

  // Leitura dos filtros da sidebar
  const searchCatParams = searchParams.get('categoria') ? searchParams.get('categoria')!.split(',') : []
  const searchTipoParams = searchParams.get('tipo') ? searchParams.get('tipo')!.split(',') : []
  const searchTamanhoParams = searchParams.get('tamanho') ? searchParams.get('tamanho')!.split(',') : []
  const searchCondicaoParams = searchParams.get('condicao') ? searchParams.get('condicao')!.split(',') : []
  const disponivelFilter = searchParams.get('disponivel') === 'true'

  const filteredPecas = brecho.pecas.filter((p) => {
    const matchesLocalCat = activeCategoryFilter === 'Todas' || p.categoria === activeCategoryFilter
    
    // Filtros complexos (sidebar)
    const matchesCat = searchCatParams.length === 0 || (p.categoria && searchCatParams.includes(p.categoria))
    const matchesTipo = searchTipoParams.length === 0 || searchTipoParams.some(tipo => p.nome.toLowerCase().includes(tipo.toLowerCase()))
    const matchesCondicao = searchCondicaoParams.length === 0 || (p.condicao && searchCondicaoParams.includes(p.condicao))
    // O backend ou mapeamento retorna o tamanho puro ou já com Tam.? 
    // Em BrechoDetalhes o backend retorna a p.tamanho diretamente (ex: M). A interface local mapeia depois.
    // Vamos garantir que a comparação inclua tanto M quanto Tam. M.
    const matchesTamanho = searchTamanhoParams.length === 0 || searchTamanhoParams.some(t => p.tamanho === t || p.tamanho === `Tam. ${t}`)
    const matchesAvail = !disponivelFilter || (p as any).disponivel === true || (p as any).statusTag === 'DISPONÍVEL' || p.statusTag === 'DISPONÍVEL'
    
    return matchesLocalCat && matchesCat && matchesTipo && matchesCondicao && matchesTamanho && matchesAvail
  })

  const handleWhatsappClick = () => {
    const wppNumber = brecho.whatsapp.replace(/\D/g, '')
    const message = encodeURIComponent(
      `Olá! Encontrei o ${brecho.nome} no Breshop e gostaria de tirar algumas dúvidas.`
    )
    window.open(`https://wa.me/55${wppNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="store-detail-page">
      {/* STORE COVER PHOTO BANNER */}
      <div className="store-banner">
        <img
          src={brecho.bannerUrl}
          alt={brecho.nome}
          className="store-banner__img"
        />
        <div className="store-banner__overlay" />
      </div>

      {/* STORE INFO HEADER */}
      <div className="store-info-card">
        <div className="store-info-card__header">
          <div className="store-info-card__title-area">
            <h1 className="store-info-card__name">{brecho.nome}</h1>
            <div className="store-info-card__rating">
              <span className="stars" style={{ display: 'inline-flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" stroke="#f59e0b" />
                ))}
              </span>
              <span className="rating-score">{brecho.rating}</span>
              <span className="reviews-count">({brecho.reviewsCount} avaliações)</span>
            </div>
          </div>
        </div>

        <div className="store-info-card__meta">
          <div className="meta-item">
            <MapPin size={18} />
            <span>{brecho.localizacao}</span>
          </div>

          <div className="meta-item">
            <Clock size={18} />
            <span>{brecho.horario}</span>
          </div>
        </div>

        {/* STORE SOCIAL & ACTION BUTTONS */}
        <div className="store-info-card__actions">
          {brecho.instagram && (
            <a
              href={brecho.instagram.startsWith('http') ? brecho.instagram : `https://instagram.com/${brecho.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost store-action-btn"
            >
              <Camera size={18} />
              Instagram
            </a>
          )}

          <button
            type="button"
            className="btn btn-primary store-action-btn"
            onClick={handleWhatsappClick}
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>

          <a
            href={brecho.addressMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost store-action-btn"
          >
            <Map size={18} />
            Como chegar
          </a>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <section className="store-products-section">
        <div className="store-products-section__header">
          <h2 className="store-products-section__title">Peças disponíveis</h2>
          <span className="store-products-section__count">
            {filteredPecas.length} peças encontradas
          </span>
        </div>

        {/* CATEGORY TABS */}
        <div className="store-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-tab-btn ${
                activeCategoryFilter === cat ? 'is-active' : ''
              }`}
              onClick={() => setActiveCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        {filteredPecas.length > 0 ? (
          <div className="grid-3-cols">
            {filteredPecas.map((peca) => (
              <CardPeca key={peca.id} {...peca} />
            ))}
          </div>
        ) : (
          <div className="empty-products-state">
            <p>Nenhuma peça encontrada nesta categoria no momento.</p>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveCategoryFilter('Todas')}
            >
              Ver todas as peças
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
