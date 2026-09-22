import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar'
import CardPeca, { type CardPecaProps } from '../../components/CardPeca/CardPeca'
import CardBrecho, { type CardBrechoProps } from '../../components/CardBrecho/CardBrecho'
import Footer from '../../components/Footer/Footer'

const featuredPecas: CardPecaProps[] = [
  {
    id: '1',
    nome: 'Jaqueta Jeans Bordada Vintage',
    brecho: 'Brechó Olinda',
    preco: 'R$ 89,90',
    tamanho: 'Tam. M',
    categoria: 'Jaqueta',
    statusTag: 'DISPONÍVEL',
    imageUrl: '/images/denim_jacket.png',
  },
  {
    id: '2',
    nome: 'Corta Vento Retro 90s',
    brecho: 'Relíquia Shop',
    preco: 'R$ 65,00',
    tamanho: 'Tam. M',
    categoria: 'Jaqueta',
    statusTag: '-20%',
    imageUrl: '/images/windbreaker_jacket.png',
  },
  {
    id: '3',
    nome: 'Jaqueta Utility Verde Olive',
    brecho: 'Curadoria SP',
    preco: 'R$ 120,00',
    tamanho: 'Tam. G',
    categoria: 'Jaqueta',
    statusTag: 'DISPONÍVEL',
    imageUrl: '/images/olive_jacket.png',
  },
]

const exploreBrechos: CardBrechoProps[] = [
  {
    id: '1',
    nome: 'Brechó Aurora',
    localizacao: 'Macapá - AP',
    descricao: 'Peças garimpadas com afeto e curadoria especial.',
  },
  {
    id: '2',
    nome: 'Brechó Vintage',
    localizacao: 'Macapá - AP',
    descricao: 'O melhor do estilo retrô dos anos 80, 90 e 2000.',
  },
  {
    id: '3',
    nome: 'Brechó X',
    localizacao: 'Santana - AP',
    descricao: 'Roupas e acessórios únicos para renovar seu estilo.',
  },
]

const trendingTags = ['Jaquetas 90s', 'Bolsas Y2K', 'Jeans vintage']

export default function Home() {
  const navigate = useNavigate()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/brechos?q=${encodeURIComponent(query)}`)
    }
  }

  const handleTagClick = (tag: string) => {
    navigate(`/brechos?q=${encodeURIComponent(tag)}`)
  }

  return (
    <div className="home-layout">
      <Header />

      <main className="home-main">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-section__content">
            <span className="hero-section__eyebrow">MODA CIRCULAR BRASILEIRA</span>

            <h1 className="hero-section__title">
              Moda com história, <br />
              <span className="hero-section__title-cyan">curadoria brasileira.</span>
            </h1>

            <p className="hero-section__subtitle">
              Descubra peças únicas selecionadas por brechós de todo o Brasil.
            </p>

            <div className="hero-section__search">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* TRENDING TAGS */}
            <div className="hero-section__trending">
              <span className="trending-label">Em alta:</span>
              <div className="trending-pills">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="trending-pill"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN TWO-COLUMN SECTION WITH FILTER SIDEBAR */}
        <div className="catalog-container">
          {/* LEFT SIDEBAR */}
          <FilterSidebar />

          {/* RIGHT PRODUCTS AREA */}
          <section className="catalog-products">
            <div className="catalog-header">
              <span className="catalog-header__eyebrow">SELEÇÃO DA SEMANA</span>
              <h2 className="catalog-header__title">Peças em destaque</h2>
              <p className="catalog-header__count">128 resultados para "Jaquetas"</p>
            </div>

            <div className="grid-3-cols">
              {featuredPecas.map((peca) => (
                <CardPeca key={peca.id} {...peca} />
              ))}
            </div>
          </section>
        </div>

        {/* EXPLORE BRECHÓS */}
        <section className="home-section explore-brechos-section">
          <div className="home-section__header">
            <h2 className="home-section__title">EXPLORE BRECHÓS</h2>
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
      </main>

      <Footer />
    </div>
  )
}
