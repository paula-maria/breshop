const featuredItems = [
  { name: 'Jaqueta de couro', price: 'R$ 180,00', tone: 'warm' },
  { name: 'Tênis vintage', price: 'R$ 140,00', tone: 'sand' },
  { name: 'Bolsa de couro', price: 'R$ 210,00', tone: 'oak' },
]

const brechos = [
  { name: 'Brechó 1', city: 'Centro' },
  { name: 'Brechó 2', city: 'Vila Madalena' },
]

export default function Home() {
  return (
    <section className="home-page">
      <header className="home-header">
        <div className="home-header__brand">LOGO</div>

        <div className="home-header__search">
          <input type="text" placeholder="Buscar peças..." aria-label="Buscar peças" />
        </div>

        <button type="button" className="home-header__login">
          Entrar
        </button>
      </header>

      <section className="home-hero">
        <div className="home-hero__content">
          <h1>Encontre peças únicas</h1>
          <h2>em brechós da sua região</h2>
          <button type="button" className="home-hero__button">
            Buscar peças
          </button>
        </div>
      </section>

      <section className="home-section">
        <h3>Peças em destaque</h3>

        <div className="card-grid card-grid--items">
          {featuredItems.map((item) => (
            <article key={item.name} className={`mini-card mini-card--${item.tone}`}>
              <div className="mini-card__image">FOTO</div>
              <div className="mini-card__body">
                <p className="mini-card__name">{item.name}</p>
                <p className="mini-card__price">{item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--shops">
        <h3>Encontre um brechó</h3>

        <div className="card-grid card-grid--shops">
          {brechos.map((brecho) => (
            <article key={brecho.name} className="shop-card">
              <div className="shop-card__image">{brecho.name}</div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
