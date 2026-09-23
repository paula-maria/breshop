import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import Brechos from './pages/Brechos/Brechos'
import BrechoDetalhes from './pages/BrechoDetalhes/BrechoDetalhes'
import PecaDetalhes from './pages/PecaDetalhes/PecaDetalhes'
import Painel from './pages/Painel/Painel'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import FilterSidebar from './components/FilterSidebar/FilterSidebar'

function PageLayout({
  children,
  showSidebar = true,
}: {
  children: React.ReactNode
  showSidebar?: boolean
}) {
  return (
    <div className="home-layout">
      <Header />
      <div className="app-main-layout-container">
        {showSidebar && (
          <aside className="app-sidebar-column">
            <FilterSidebar />
          </aside>
        )}
        <main className="home-main app-content-wrapper">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PageLayout showSidebar={true}>
              <Home />
            </PageLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PageLayout showSidebar={false}>
              <Login />
            </PageLayout>
          }
        />
        <Route
          path="/cadastro"
          element={
            <PageLayout showSidebar={false}>
              <Cadastro />
            </PageLayout>
          }
        />
        <Route
          path="/brechos"
          element={
            <PageLayout showSidebar={true}>
              <Brechos />
            </PageLayout>
          }
        />
        <Route
          path="/brechos/:id"
          element={
            <PageLayout showSidebar={true}>
              <BrechoDetalhes />
            </PageLayout>
          }
        />
        <Route
          path="/pecas/:id"
          element={
            <PageLayout showSidebar={true}>
              <PecaDetalhes />
            </PageLayout>
          }
        />
        <Route
          path="/painel"
          element={
            <PageLayout showSidebar={false}>
              <Painel />
            </PageLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
