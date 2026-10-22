import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CardPeca, { type CardPecaProps } from '../../components/CardPeca/CardPeca'
import CardBrecho, { type CardBrechoProps } from '../../components/CardBrecho/CardBrecho'
import PageLayout from '../../components/PageLayout/PageLayout'
import { api } from '../../services/api'
import { Shirt, Footprints, Watch, ShoppingBag } from 'lucide-react'

const slideIcons: Record<string, typeof Shirt> = {
  Roupas: Shirt,
  Calçados: Footprints,
  Acessórios: Watch,
  Bolsas: ShoppingBag,
}

export default function Home() {
  const [featuredPecas, setFeaturedPecas] = useState<CardPecaProps[]>([])
  const [exploreBrechos, setExploreBrechos] = useState<(CardBrechoProps & { tone?: 'teal' | 'navy' | 'cyan' })[]>([])
  const [totals, setTotals] = useState({ pecas: 0, brechos: 0 })
  const [carouselIndex, setCarouselIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [pecasRes, brechosRes] = await Promise.all([
          api.get('/pecas', { params: { limit: 8 } }),
          api.get('/brechos', { params: { limit: 3 } })
        ])
        
        const mappedPecas = pecasRes.data.data.map((p: any) => ({
          id: p.id,
          nome: p.nome,
          brecho: p.brecho?.nome || 'Brechó',
          preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
          tamanho: `Tam. ${p.tamanho}`,
          categoria: p.categoria,
          statusTag: p.disponivel ? 'DISPONÍVEL' : 'VENDIDO',
          imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0] : '',
        }))
        setFeaturedPecas(mappedPecas)
        setTotals({ pecas: pecasRes.data.meta.total, brechos: brechosRes.data.meta.total })

        const tones: ('teal'|'navy'|'cyan')[] = ['teal', 'navy', 'cyan']
        const mappedBrechos = brechosRes.data.data.map((b: any, index: number) => ({
          id: b.id,
          nome: b.nome,
          localizacao: b.cidade ? `${b.cidade} - ${b.estado}` : 'Sem localização',
          descricao: b.descricao || 'Peças garimpadas com afeto e curadoria especial.',
          tone: tones[index % 3],
        }))
        setExploreBrechos(mappedBrechos)
      } catch (err) {
        console.error(err)
      }
    }
    loadData()
  }, [])

  // Carrossel automático
  const heroSlides = featuredPecas.slice(0, 5)
  useEffect(() => {
    if (heroSlides.length < 2) return
    timerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % heroSlides.length)
    }, 3500)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [heroSlides.length])

  const goToSlide = (index: number) => {
    setCarouselIndex(index)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % heroSlides.length)
    }, 3500)
  }

  const filteredPecas = featuredPecas.slice(0, 4)

  const currentSlide = heroSlides[carouselIndex]

  const heroSection = (
    <section className="hero-section">
      <div className="hero-section__content">
        
        <div className="hero-section__text-col">
          <h1 className="hero-section__title">
            Descubra Estilo Único e  
            <span className="hero-section__title-cyan"> Sustentável</span>
          </h1>
          <p className="hero-section__subtitle">
            Roupas e acessórios garimpados com preços acessíveis.<br/>
            Expresse sua identidade e ajude a reduzir o desperdício na moda.
          </p>


          {totals.pecas > 0 && (
            <div className="hero-section__social-proof">
              <span className="hero-section__proof-text">
                {totals.pecas} {totals.pecas === 1 ? 'peça' : 'peças'} em {totals.brechos}{' '}
                {totals.brechos === 1 ? 'brechó' : 'brechós'}
              </span>
            </div>
          )}
        </div>

        {/* CARROSSEL DE PEÇAS */}
        <div className="hero-section__image-col">
          {heroSlides.length > 0 && currentSlide ? (
            <Link to={`/pecas/${currentSlide.id}`} className="hero-carousel__slide">
              {(() => {
                const SlideIcon = slideIcons[currentSlide.categoria ?? ''] ?? Shirt
                return (
                  <SlideIcon
                    className="hero-carousel__bg-icon"
                    size={220}
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                )
              })()}
              {currentSlide.imageUrl && (
                <img
                  key={currentSlide.id}
                  src={currentSlide.imageUrl}
                  alt={currentSlide.nome}
                  className="hero-carousel__img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <div className="hero-carousel__info">
                <span className="hero-carousel__brecho">{currentSlide.brecho}</span>
                <span className="hero-carousel__nome">{currentSlide.nome}</span>
                <span className="hero-carousel__preco">{currentSlide.preco}</span>
              </div>
            </Link>
          ) : (
            <div className="hero-carousel__empty">
              <span>Peças em breve</span>
            </div>
          )}

          {/* DOTS */}
          {heroSlides.length > 1 && (
            <div className="hero-carousel__dots">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`hero-carousel__dot ${i === carouselIndex ? 'is-active' : ''}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  )


  return (
    <PageLayout showSidebar={true} heroSection={heroSection}>
      <div className="home-content">

      {/* PRODUCTS SECTION (Peças em destaque) */}
      <section className="catalog-products" style={{ padding: '2rem 1rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div className="catalog-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 className="catalog-header__title">Peças em destaque</h2>
            <p style={{ color: 'var(--text-muted)' }}>Explore nossa coleção de moda sustentável e única</p>
          </div>
          <Link to="/categorias" style={{ color: 'var(--cyan-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Ver todas as peças
          </Link>
        </div>



        <div className="grid-3-cols">
          {filteredPecas.map((peca) => (
            <CardPeca key={peca.id} {...peca} />
          ))}
        </div>
      </section>

      {/* EXPLORE BRECHÓS SECTION WITH VER MAIS LINK */}
      <section className="home-section explore-brechos-section">
        <div className="home-section__header-row">
          <h2 className="home-section__title">EXPLORE BRECHÓS</h2>
          <Link to="/brechos" className="see-more-link">
            Ver todos os brechós <span className="arrow">→</span>
          </Link>
        </div>

        <div className="grid-3-cols">
          {exploreBrechos.map((brecho) => (
            <CardBrecho key={brecho.id} {...brecho} />
          ))}
        </div>
      </section>

    </div>
    </PageLayout>
  )
}
