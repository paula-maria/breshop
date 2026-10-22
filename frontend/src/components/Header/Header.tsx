import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Store, MapPin, ChevronDown, Menu, X, Heart, LogOut, User, ShoppingCart, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getCart, subscribeToCart } from '../../utils/cart'

export default function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [brechoDropdownOpen, setBrechoDropdownOpen] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [cartCount, setCartCount] = useState(() => getCart().length)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  useEffect(() => subscribeToCart(() => setCartCount(getCart().length)), [])

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchText.trim()
    if (!q) return
    navigate(`/brechos?view=pecas&q=${encodeURIComponent(q)}`)
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
            to="/categorias"
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
        <div className="site-header__actions">
          <form className="header-search hide-on-mobile" role="search" onSubmit={handleSearch}>
            <button type="submit" className="header-search__btn" aria-label="Buscar">
              <Search size={16} />
            </button>
            <input
              type="text"
              placeholder="Buscar peças..."
              aria-label="Buscar peças"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </form>

          <div className="header-icons">
            <Link to="/favoritos" className="header-icon-btn hide-on-mobile" aria-label="Favoritos">
              <Heart size={20} />
              {favoritesCount > 0 && <span className="header-icon-btn__badge">{favoritesCount}</span>}
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'PROPRIETARIO' ? '/painel' : '/cliente'}
                  className="header-icon-btn hide-on-mobile"
                  aria-label="Minha conta"
                >
                  <User size={20} />
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="header-icon-btn header-icon-btn--danger hide-on-mobile"
                  title="Sair"
                  aria-label="Sair"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="header-icon-btn hide-on-mobile" aria-label="Entrar">
                <User size={20} />
              </Link>
            )}

            {/* Carrinho: somente para clientes compradores */}
            {(!user || user.role === 'CLIENTE') && (
              <Link to="/cart" className="header-icon-btn" aria-label="Carrinho">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="header-icon-btn__badge">{cartCount}</span>}
              </Link>
            )}
          </div>

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
            to="/categorias"
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
