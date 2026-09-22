import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

type HeaderProps = {
  isLoggedIn?: boolean
  userName?: string
}

export default function Header({ isLoggedIn = false, userName }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev)

  return (
    <header className="site-header">
      <div className="site-header__container">
        {/* LOGO */}
        <Link to="/" className="site-header__logo" aria-label="Home BRESHOP">
          <span className="site-header__logo-text">BRESHOP</span>
        </Link>

        {/* CENTER NAVIGATION */}
        <nav className="site-header__nav" aria-label="Navegação principal">
          <Link
            to="/#novidades"
            className={`site-header__link ${isActive('/#novidades') ? 'is-active' : ''}`}
          >
            Novidades
          </Link>
          <Link
            to="/brechos?cat=brechos"
            className={`site-header__link ${isActive('/brechos?cat=brechos') ? 'is-active' : ''}`}
          >
            Brechós
          </Link>
          <Link
            to="/brechos?cat=masculino"
            className={`site-header__link ${isActive('/brechos?cat=masculino') ? 'is-active' : ''}`}
          >
            Masculino
          </Link>
          <Link
            to="/cadastro"
            className={`site-header__link ${isActive('/cadastro') ? 'is-active' : ''}`}
          >
            Vender
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="site-header__actions">
          {isLoggedIn ? (
            <Link to="/painel" className="btn btn-ghost btn-sm">
              {userName ? `Olá, ${userName}` : 'Meu Painel'}
            </Link>
          ) : (
            <>
              <Link to="/login" className="site-header__login-link">
                Entrar
              </Link>
              <Link to="/cadastro" className="btn btn-dark-pill">
                Criar Conta
              </Link>
            </>
          )}

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            className="site-header__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Abrir menu de navegação"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <nav className="site-header__mobile-menu" aria-label="Menu mobile">
          <Link
            to="/"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Novidades
          </Link>
          <Link
            to="/brechos?cat=feminino"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Feminino
          </Link>
          <Link
            to="/brechos?cat=masculino"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Masculino
          </Link>
          <Link
            to="/cadastro"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Vender
          </Link>

          <div className="site-header__mobile-actions">
            <Link
              to="/login"
              className="btn btn-ghost w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="btn btn-dark-pill w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Criar Conta
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
