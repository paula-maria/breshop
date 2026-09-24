import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import Brechos from './pages/Brechos/Brechos'
import BrechoDetalhes from './pages/BrechoDetalhes/BrechoDetalhes'
import PecaDetalhes from './pages/PecaDetalhes/PecaDetalhes'
import Painel from './pages/Painel/Painel'
import CadastroBrecho from './pages/CadastroBrecho/CadastroBrecho'
import NotFound from './pages/NotFound/NotFound'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import PageLayout from './components/PageLayout/PageLayout'
import ClientLayout from './components/ClientLayout/ClientLayout'
import ClientDashboard from './pages/client/Dashboard/Dashboard'
import ClientProfile from './pages/client/Profile/Profile'
import ClientFavorites from './pages/client/Favorites/Favorites'
import ClientConversations from './pages/client/Conversations/Conversations'
import ClientProposals from './pages/client/Proposals/Proposals'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />

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

          {/* PROPRIETÁRIO ROUTES */}
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

          {/* CLIENT ROUTES — layout próprio com sidebar */}
          <Route
            path="/cliente"
            element={
              <ProtectedRoute requiredRole="CLIENTE">
                <ClientLayout>
                  <ClientDashboard />
                </ClientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/perfil"
            element={
              <ProtectedRoute requiredRole="CLIENTE">
                <ClientLayout>
                  <ClientProfile />
                </ClientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/favoritos"
            element={
              <ProtectedRoute requiredRole="CLIENTE">
                <ClientLayout>
                  <ClientFavorites />
                </ClientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/conversas"
            element={
              <ProtectedRoute requiredRole="CLIENTE">
                <ClientLayout>
                  <ClientConversations />
                </ClientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/propostas"
            element={
              <ProtectedRoute requiredRole="CLIENTE">
                <ClientLayout>
                  <ClientProposals />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
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
