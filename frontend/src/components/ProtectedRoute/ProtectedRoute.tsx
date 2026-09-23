import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  requiredRole?: 'CLIENTE' | 'PROPRIETARIO'
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>
  }

  // Se não tem usuário logado, vai pro login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Se uma role foi exigida, mas o usuário não possui a role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  // Caso tudo esteja correto, renderiza o componente filho
  return <Outlet />
}

export default ProtectedRoute
