import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Store, MapPin, Sparkles, ChevronDown, Menu, X, Heart, LogOut, User, ShoppingCart, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [brechoDropdownOpen, setBrechoDropdownOpen] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem('breshop_favoritos')
      if (saved) {
        setFavoritesCount(JSON.parse(saved).length)
      } else {
        setFavoritesCount(0)
      }
    }
    updateCount()
    window.addEventListener('favoritesUpdated', updateCount)
    return () => window.removeEventListener('favoritesUpdated', updateCount)
  }, [])

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
        <div style={{ flex: 1, display: 'flex' }}>
          <Link to="/" className="site-header__logo" aria-label="Home BRESHOP" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="site-header__logo-text" style={{ color: 'var(--cyan-primary)' }}>BRESHOP</span>
          </Link>
        </div>

        {/* CENTER NAVIGATION */}
        <nav className="site-header__nav" aria-label="Navegação principal">
          <Link
            to="/"
            className={`site-header__link ${isActive('/') && !location.search ? 'is-active' : ''}`}
          >
            Início
          </Link>

          <Link
            to="/brechos"
            className={`site-header__link ${isActive('/brechos') ? 'is-active' : ''}`}
          >
            Loja
          </Link>

          <Link
            to="/brechos"
            className="site-header__link"
          >
            Categorias
          </Link>

          <div className="header-dropdown-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className={`site-header__link dropdown-trigger-btn site-header__dropdown-toggle ${brechoDropdownOpen ? 'is-active' : ''}`}
              onClick={() => setBrechoDropdownOpen(!brechoDropdownOpen)}
            >
              Brechós <ChevronDown size={14} />
            </button>

            {brechoDropdownOpen && (
              <div className="header-dropdown-menu">
                <Link
                  to="/brechos?cat=todas"
                  className="dropdown-item"
                  onClick={() => setBrechoDropdownOpen(false)}
                >
                  <div className="dropdown-item__icon">
                    <Store size={18} />
                  </div>
                  <div className="dropdown-item__content">
                    <span className="dropdown-item__title">Todas as Peças</span>
                    <span className="dropdown-item__desc">Explorar catálogo</span>
                  </div>
                </Link>

                <div className="dropdown-divider"></div>

                <Link
                  to="/brechos?view=lojas"
                  className="dropdown-item"
                  onClick={() => setBrechoDropdownOpen(false)}
                >
                  <div className="dropdown-item__icon">
                    <MapPin size={18} />
                  </div>
                  <div className="dropdown-item__content">
                    <span className="dropdown-item__title">Todos os Brechós</span>
                    <span className="dropdown-item__desc">Ver lojas cadastradas</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="site-header__actions" style={{ flex: 1, justifyContent: 'flex-end' }}>
          
          {/* Header Search (Desktop) */}
          <div className="header-search hide-on-mobile" style={{ position: 'relative', display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: '4px', padding: '10px 16px', minWidth: '350px' }}>
            <span style={{ color: '#8a8a8a', display: 'flex', alignItems: 'center', marginRight: '8px' }}>
              <Search size={16} />
            </span>
            <input type="text" placeholder="Buscar peças..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '100%' }} />
          </div>

          <Link to="/favoritos" className="header-favorites-btn hide-on-mobile" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--color-text)' }} aria-label="Favoritos">
            <Heart size={20} />
            {favoritesCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '999px' }}>
                {favoritesCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to={user.role === 'PROPRIETARIO' ? '/painel' : '/cliente'} style={{ color: 'var(--navy-dark)' }}>
                <User size={20} />
              </Link>
              <button 
                type="button" 
                onClick={logout} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-danger)' }}
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hide-on-mobile" style={{ color: 'var(--navy-dark)' }}>
              <User size={20} />
            </Link>
          )}

          {/* Carrinho: somente para clientes compradores */}
          {(!user || user.role === 'CLIENTE') && (
            <Link to="/cart" style={{ color: 'var(--navy-dark)' }}>
              <ShoppingCart size={20} />
            </Link>
          )}

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            className="site-header__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            Categorias
          </Link>

          <Link
            to="/brechos?cat=todas"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Todas as Peças
          </Link>

          <Link
            to="/brechos?view=lojas"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Todos os Brechós
          </Link>

          <Link
            to="/favoritos"
            className="site-header__mobile-link"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)' }}
          >
            <Heart size={18} /> Meus Favoritos
          </Link>

          <div className="site-header__mobile-actions">
            {user ? (
              <>
                <Link
                  to={user.role === 'PROPRIETARIO' ? '/painel' : '/cliente'}
                  className="btn btn-dark-pill w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user.role === 'PROPRIETARIO' ? 'Meu Painel' : 'Minha Conta'}
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  style={{ color: 'var(--color-danger)' }}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
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
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
