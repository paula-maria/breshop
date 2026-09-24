import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await api.post('/auth/login', { email, password: senha })
      login(response.data.user)
      
      if (response.data.user.role === 'PROPRIETARIO') {
        navigate('/painel')
      } else {
        navigate('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Credenciais inválidas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__eyebrow">BEM-VINDO DE VOLTA</span>
          <h1 className="auth-card__title">Acessar sua conta</h1>
          <p className="auth-card__subtitle">
            Acompanhe seu catálogo, mensagens e peças cadastradas
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <a href="#recuperar" className="forgot-link">
                Esqueceu a senha?
              </a>
            </div>
            <input
              type="password"
              id="senha"
              className="form-input"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-cyan-pill w-full auth-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro">Cadastrar meu brechó</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
