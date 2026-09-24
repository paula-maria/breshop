import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import Brechos from './pages/Brechos/Brechos'
import BrechoDetalhes from './pages/BrechoDetalhes/BrechoDetalhes'
import PecaDetalhes from './pages/PecaDetalhes/PecaDetalhes'
import Painel from './pages/Painel/Painel'
import CadastroBrecho from './pages/CadastroBrecho/CadastroBrecho'
import Favoritos from './pages/Favoritos/Favoritos'
import NotFound from './pages/NotFound/NotFound'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import FilterSidebar from './components/FilterSidebar/FilterSidebar'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

import PageLayout from './components/PageLayout/PageLayout'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route
          path="/"
          element={<Home />}
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
            <ProtectedRoute requiredRole="PROPRIETARIO">
              <PageLayout showSidebar={false}>
                <Painel />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding-brecho"
          element={
            <ProtectedRoute requiredRole="PROPRIETARIO">
              <PageLayout showSidebar={false}>
                <CadastroBrecho />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute>
              <PageLayout showSidebar={false}>
                <Favoritos />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <PageLayout showSidebar={false}>
              <NotFound />
            </PageLayout>
          }
        />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
