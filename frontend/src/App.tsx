import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import Brechos from './pages/Brechos/Brechos'
import BrechoDetalhes from './pages/BrechoDetalhes/BrechoDetalhes'
import PecaDetalhes from './pages/PecaDetalhes/PecaDetalhes'
import Painel from './pages/Painel/Painel'

const menuItems = [
  { label: 'Home', to: '/' },
  { label: 'Login', to: '/login' },
  { label: 'Cadastro', to: '/cadastro' },
  { label: 'Brechós', to: '/brechos' },
  { label: 'Painel', to: '/painel' },
]

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="app-nav" aria-label="Navegação principal">
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/brechos" element={<Brechos />} />
            <Route path="/brechos/:id" element={<BrechoDetalhes />} />
            <Route path="/pecas/:id" element={<PecaDetalhes />} />
            <Route path="/painel" element={<Painel />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
