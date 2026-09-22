import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

type HeaderProps = {
  isLoggedIn?: boolean
  userName?: string
}

export default function Header({ isLoggedIn = false, userName }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [brechoDropdownOpen, setBrechoDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBrechoDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            to="/"
            className={`site-header__link ${isActive('/') && !location.search ? 'is-active' : ''}`}
          >
            Início
          </Link>

          {/* BRECHÓS DROPDOWN */}
          <div
            className="header-dropdown-wrapper"
            ref={dropdownRef}
            onMouseEnter={() => setBrechoDropdownOpen(true)}
            onMouseLeave={() => setBrechoDropdownOpen(false)}
          >
            <button
              type="button"
              className={`site-header__link dropdown-trigger-btn ${
                isActive('/brechos') ? 'is-active' : ''
              }`}
              onClick={() => setBrechoDropdownOpen((prev) => !prev)}
              aria-expanded={brechoDropdownOpen}
            >
              Brechós
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: brechoDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* DROPDOWN MENU */}
            {brechoDropdownOpen && (
              <div className="header-dropdown-menu">
                <Link
                  to="/brechos"
                  className="dropdown-item"
                  onClick={() => setBrechoDropdownOpen(false)}
                >
                  <span className="dropdown-item__icon">🏪</span>
                  <div className="dropdown-item__content">
                    <span className="dropdown-item__title">Todos os Brechós</span>
                    <span className="dropdown-item__desc">Explorar lista completa</span>
                  </div>
                </Link>

                <Link
                  to="/brechos?cidade=Macapá"
                  className="dropdown-item"
                  onClick={() => setBrechoDropdownOpen(false)}
                >
                  <span className="dropdown-item__icon">📍</span>
                  <div className="dropdown-item__content">
                    <span className="dropdown-item__title">Brechós em Macapá</span>
                    <span className="dropdown-item__desc">Ver lojas na capital</span>
                  </div>
                </Link>

                <Link
                  to="/brechos?cidade=Santana"
                  className="dropdown-item"
                  onClick={() => setBrechoDropdownOpen(false)}
                >
                  <span className="dropdown-item__icon">📍</span>
                  <div className="dropdown-item__content">
                    <span className="dropdown-item__title">Brechós em Santana</span>
                    <span className="dropdown-item__desc">Ver lojas na região</span>
                  </div>
                </Link>

                <div className="dropdown-divider" />

                <Link
                  to="/cadastro"
                  className="dropdown-item is-highlight"
                  onClick={() => setBrechoDropdownOpen(false)}
                >
                  <span className="dropdown-item__icon">✨</span>
                  <div className="dropdown-item__content">
                    <span className="dropdown-item__title">Cadastrar meu Brechó</span>
                    <span className="dropdown-item__desc">Divulgue seu catálogo</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/brechos?cat=feminino"
            className={`site-header__link ${location.search.includes('feminino') ? 'is-active' : ''}`}
          >
            Feminino
          </Link>

          <Link
            to="/brechos?cat=masculino"
            className={`site-header__link ${location.search.includes('masculino') ? 'is-active' : ''}`}
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
                Criar loja
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
            Início
          </Link>

          <Link
            to="/brechos"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Todos os Brechós
          </Link>

          <Link
            to="/brechos?cidade=Macapá"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Brechós em Macapá
          </Link>

          <Link
            to="/brechos?cidade=Santana"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Brechós em Santana
          </Link>

          <Link
            to="/cadastro"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Vender / Cadastrar Brechó
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
              Criar loja
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
