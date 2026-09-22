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

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="home-layout">
      <Header />
      <main className="home-main app-content-wrapper">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PageLayout>
              <Login />
            </PageLayout>
          }
        />
        <Route
          path="/cadastro"
          element={
            <PageLayout>
              <Cadastro />
            </PageLayout>
          }
        />
        <Route
          path="/brechos"
          element={
            <PageLayout>
              <Brechos />
            </PageLayout>
          }
        />
        <Route
          path="/brechos/:id"
          element={
            <PageLayout>
              <BrechoDetalhes />
            </PageLayout>
          }
        />
        <Route
          path="/pecas/:id"
          element={
            <PageLayout>
              <PecaDetalhes />
            </PageLayout>
          }
        />
        <Route
          path="/painel"
          element={
            <PageLayout>
              <Painel />
            </PageLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
