import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__content">
          <div className="site-footer__column">
            <section className="site-footer__group" aria-label="Sobre a BRESHOP">
              <Link to="/" className="site-footer__logo">
                BRESHOP
              </Link>
              <p className="site-footer__description">
                Moda circular, novas possibilidades. Descubra brechós e encontre
                peças que combinam com você.
              </p>
            </section>

            <nav className="site-footer__group" aria-label="Links institucionais">
              <h2 className="site-footer__heading">Institucional</h2>
              <a href="#sobre" className="site-footer__link">Sobre nós</a>
              <a href="#contato" className="site-footer__link">Contato</a>
              <a href="#termos" className="site-footer__link">Termos de uso</a>
              <a href="#privacidade" className="site-footer__link">Privacidade</a>
            </nav>
          </div>

          <div className="site-footer__column">
            <nav className="site-footer__group" aria-label="Explore">
              <h2 className="site-footer__heading">Explore</h2>
              <Link to="/" className="site-footer__link">Início</Link>
              <Link to="/brechos?view=pecas" className="site-footer__link">Loja</Link>
              <Link to="/categorias" className="site-footer__link">Categorias</Link>
              <Link to="/brechos?view=lojas" className="site-footer__link">Brechós</Link>
            </nav>

            <section className="site-footer__group">
              <h2 className="site-footer__heading">Tem um brechó?</h2>
              <p className="site-footer__description">
                Cadastre sua loja e divulgue suas peças na plataforma.
              </p>
              <Link to="/cadastro" className="site-footer__register">
                Cadastrar brechó <span aria-hidden="true">→</span>
              </Link>
            </section>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 BRESHOP. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
