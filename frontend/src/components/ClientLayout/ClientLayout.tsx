import { NavLink } from 'react-router-dom'
import { LayoutDashboard, User, Heart, MessageCircle, HandCoins, Compass, Store } from 'lucide-react'
import PageLayout from '../PageLayout/PageLayout'
import './ClientLayout.css'

interface Props {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const navItems = [
    { to: '/cliente', label: 'Início', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/cliente/perfil', label: 'Meu Perfil', icon: <User size={18} /> },
    { to: '/cliente/favoritos', label: 'Favoritos', icon: <Heart size={18} /> },
    { to: '/cliente/conversas', label: 'Conversas', icon: <MessageCircle size={18} /> },
    { to: '/cliente/propostas', label: 'Propostas', icon: <HandCoins size={18} /> },
  ]

  const exploreItems = [
    { to: '/brechos', label: 'Explorar Peças', icon: <Compass size={18} /> },
    { to: '/brechos?view=lojas', label: 'Brechós', icon: <Store size={18} /> },
  ]

  const ClientSidebar = () => (
    <div className="filter-sidebar client-custom-sidebar">
      <div className="client-custom-sidebar__group">
        <span className="client-custom-sidebar__label">MINHA CONTA</span>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `client-custom-sidebar__link ${isActive ? 'is-active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="client-custom-sidebar__group" style={{ marginTop: '2rem' }}>
        <span className="client-custom-sidebar__label">EXPLORAR</span>
        {exploreItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `client-custom-sidebar__link ${isActive ? 'is-active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )

  return (
    <PageLayout showSidebar={true} sidebar={<ClientSidebar />}>
      {children}
    </PageLayout>
  )
}
