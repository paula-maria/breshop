import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SearchBar from '../../components/SearchBar/SearchBar'
import CardPeca, { type CardPecaProps } from '../../components/CardPeca/CardPeca'
import CardBrecho, { type CardBrechoProps } from '../../components/CardBrecho/CardBrecho'
import PageLayout from '../../components/PageLayout/PageLayout'
import { api } from '../../services/api'
import { useEffect } from 'react'



const trendingTags = ['Jaquetas 90s', 'Bolsas Y2K', 'Jeans vintage']

export default function Home() {
  const navigate = useNavigate()
  const [selectedGender, setSelectedGender] = useState<'todos' | 'feminino' | 'masculino'>('todos')
  
  const [featuredPecas, setFeaturedPecas] = useState<(CardPecaProps & { genero: 'feminino' | 'masculino' })[]>([])
  const [exploreBrechos, setExploreBrechos] = useState<(CardBrechoProps & { tone?: 'teal' | 'navy' | 'cyan' })[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [pecasRes, brechosRes] = await Promise.all([
          api.get('/pecas'),
          api.get('/brechos')
        ])
        
        const mappedPecas = pecasRes.data.map((p: any) => ({
          id: p.id,
          nome: p.nome,
          brecho: p.brecho?.nome || 'Brechó',
          preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
          tamanho: `Tam. ${p.tamanho}`,
          categoria: p.categoria,
          statusTag: p.disponivel ? 'DISPONÍVEL' : 'VENDIDO',
          genero: p.categoria.toLowerCase().includes('masculina') ? 'masculino' : 'feminino', // mockado, ideal ter no DB
          imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0] : '/images/vintage_shirt.png',
        }))
        setFeaturedPecas(mappedPecas)

        const tones: ('teal'|'navy'|'cyan')[] = ['teal', 'navy', 'cyan']
        const mappedBrechos = brechosRes.data.slice(0, 3).map((b: any, index: number) => ({
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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/brechos?q=${encodeURIComponent(query)}`)
    }
  }

  const handleTagClick = (tag: string) => {
    navigate(`/brechos?q=${encodeURIComponent(tag)}`)
  }

  const filteredPecas = featuredPecas.filter(
    (p) => selectedGender === 'todos' || p.genero === selectedGender
  ).slice(0, 4)

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


          <div className="hero-section__social-proof">
            <div className="hero-section__avatars">
              <div className="avatar"></div>
              <div className="avatar" style={{ background: '#aaa' }}></div>
              <div className="avatar" style={{ background: '#888' }}></div>
            </div>
            <span className="hero-section__proof-text">1200+ clientes satisfeitos</span>
          </div>
        </div>

        <div className="hero-section__image-col">
          <div className="hero-section__badge">
            ATÉ<br />
            <span style={{ fontSize: '1.4rem', color: 'var(--navy-dark)', letterSpacing: 0 }}>70% OFF</span>
          </div>
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
          <Link to="/brechos" style={{ color: 'var(--cyan-primary)', fontWeight: 600, textDecoration: 'none' }}>
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

      {/* CTA PARA PROPRIETÁRIOS */}
      <section className="owner-cta-section">
        <div className="owner-cta-card">
          <h2 className="owner-cta-title">
            TEM UM BRECHÓ? DIVULGUE SUAS PEÇAS
          </h2>
          <p className="owner-cta-subtitle">
            Cadastre seu brechó e alcance novos compradores em todo o Brasil.
          </p>
          <button
            type="button"
            className="btn btn-cyan-pill owner-cta-btn"
            onClick={() => navigate('/cadastro')}
          >
            Cadastrar brechó
          </button>
        </div>
      </section>
    </div>
    </PageLayout>
  )
}
