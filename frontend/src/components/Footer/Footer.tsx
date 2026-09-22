import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__top">
          <Link to="/" className="site-footer__logo">
            <span className="site-footer__logo-tag">BRESHOP</span>
          </Link>

          <nav className="site-footer__links" aria-label="Links úteis">
            <a href="#sobre" className="site-footer__link">
              Sobre
            </a>
            <a href="#termos" className="site-footer__link">
              Termos
            </a>
            <a href="#privacidade" className="site-footer__link">
              Privacidade
            </a>
            <a href="#contato" className="site-footer__link">
              Contato
            </a>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 Plataforma de Brechós. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
