import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, MessageCircle, Share2, Check } from 'lucide-react'
import { api } from '../../services/api'

type PecaInfo = {
  id: string
  nome: string
  preco: string
  tamanho: string
  condicao: string
  categoria: string
  cor: string
  descricao: string
  imageUrl: string
  brechoId: string
  brechoNome: string
  brechoLocalizacao: string
  brechoRating: string
  brechoWhatsapp: string
}

export default function PecaDetalhes() {
  const { id } = useParams<{ id: string }>()
  const [peca, setPeca] = useState<PecaInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadPeca() {
      if (!id) return
      try {
        const { data } = await api.get(`/pecas`)
        // No futuro, adicionar endpoint GET /pecas/:id no backend
        const item = data.find((p: any) => p.id === id)
        if (item) {
          setPeca({
            id: item.id,
            nome: item.nome,
            preco: `R$ ${item.preco.toFixed(2).replace('.', ',')}`,
            tamanho: item.tamanho,
            condicao: item.condicao || 'Não informada',
            categoria: item.categoria || 'Outros',
            cor: item.cor || 'Não informada',
            descricao: item.descricao || 'Sem descrição',
            imageUrl: item.fotos && item.fotos.length > 0 ? item.fotos[0] : '',
            brechoId: item.brecho?.id || '',
            brechoNome: item.brecho?.nome || 'Brechó',
            brechoLocalizacao: item.brecho?.cidade ? `${item.brecho.cidade} - ${item.brecho.estado}` : 'Sem localização',
            brechoRating: 'Novo',
            brechoWhatsapp: item.brecho?.whatsapp || ''
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadPeca()
  }, [id])

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando peça...</div>
  if (!peca) return <div style={{ padding: '40px', textAlign: 'center' }}>Peça não encontrada!</div>

  const handleContactClick = () => {
    const message = encodeURIComponent(
      `Olá! Vi a peça *${peca.nome}* (${peca.preco}) no Breshop e gostaria de saber se ainda está disponível.`
    )
    window.open(`https://wa.me/${peca.brechoWhatsapp}?text=${message}`, '_blank')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="product-detail-page">
      {/* BREADCRUMB */}
      <nav className="breadcrumb" aria-label="Navegação de migalhas de pão">
        <Link to="/">Início</Link>
        <span className="separator">/</span>
        <Link to="/brechos">Brechós</Link>
        <span className="separator">/</span>
        <Link to={`/brechos/${peca.brechoId}`}>{peca.brechoNome}</Link>
        <span className="separator">/</span>
        <span className="current">{peca.nome}</span>
      </nav>

      {/* 2-COLUMN PRODUCT CONTAINER */}
      <div className="product-detail-card">
        {/* LEFT COLUMN: IMAGE */}
        <div className="product-detail-media">
          <img
            src={peca.imageUrl}
            alt={peca.nome}
            className="product-detail-img"
          />
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="product-detail-info">
          <div className="product-header">
            <span className="product-category">{peca.categoria}</span>
            <h1 className="product-title">{peca.nome}</h1>
            <p className="product-price">{peca.preco}</p>
          </div>

          <hr className="divider" />

          {/* SPECIFICATIONS GRID */}
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Tamanho:</span>
              <span className="spec-value highlight-badge">{peca.tamanho}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Condição:</span>
              <span className="spec-value">{peca.condicao}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Cor:</span>
              <span className="spec-value">{peca.cor}</span>
            </div>
          </div>

          <div className="product-description">
            <h3 className="section-subtitle">Descrição da peça</h3>
            <p>{peca.descricao}</p>
          </div>

          {/* STORE INFO CARD BOX */}
          <div className="seller-box">
            <div className="seller-box__info">
              <span className="seller-box__label">Vendido por</span>
              <Link
                to={`/brechos/${peca.brechoId}`}
                className="seller-box__name"
              >
                {peca.brechoNome}
              </Link>
              <p className="seller-box__location">
                <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {peca.brechoLocalizacao}
              </p>
            </div>
            <Link
              to={`/brechos/${peca.brechoId}`}
              className="btn btn-ghost btn-sm"
            >
              Ver perfil
            </Link>
          </div>

          {/* PRIMARY CTA: ENTRAR EM CONTATO */}
          <div className="cta-actions-group">
            <button
              type="button"
              className="btn btn-cyan-pill cta-contact-btn"
              onClick={handleContactClick}
            >
              <MessageCircle size={20} />
              Entrar em contato
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-share"
              onClick={handleShare}
            >
              {copied ? <Check size={18} /> : <Share2 size={18} />}
              {copied ? 'Link copiado!' : 'Compartilhar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
