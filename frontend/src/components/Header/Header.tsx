import { Link } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Brechós', to: '/brechos' },
  { label: 'Login', to: '/login' },
  { label: 'Cadastro', to: '/cadastro' },
]

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          BreShop
        </Link>

        <nav className="site-nav" aria-label="Menu principal">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
