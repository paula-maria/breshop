import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, Store, CheckCircle2 } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export default function Cadastro() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [accountType, setAccountType] = useState<'comprador' | 'brecho'>('brecho')
  const [successMsg, setSuccessMsg] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    nomeResponsavel: '',
    email: '',
    senha: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Cadastra no Banco de Dados Real via API
      await api.post('/auth/register', {
        name: formData.nomeResponsavel,
        email: formData.email,
        password: formData.senha,
        role: accountType === 'brecho' ? 'PROPRIETARIO' : 'CLIENTE'
      })

      // 2. Faz o Login automático para setar o Cookie HttpOnly e o Contexto
      const loginRes = await api.post('/auth/login', {
        email: formData.email,
        password: formData.senha
      })

      login(loginRes.data.user)
      
      setSuccessMsg(true)

      setTimeout(() => {
        if (accountType === 'brecho') {
          navigate('/onboarding-brecho')
        } else {
          navigate('/')
        }
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__eyebrow">CADASTRO BRESHOP</span>
          <h1 className="auth-card__title">Crie sua conta</h1>
          <p className="auth-card__subtitle">
            Selecione o seu perfil para começar na plataforma
          </p>
        </div>

        {successMsg ? (
          <div className="auth-success-box">
            <div className="auth-success-icon">
              <CheckCircle2 size={40} />
            </div>
            <h3>Cadastro realizado com sucesso!</h3>
            <p>Redirecionando para a próxima etapa...</p>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              {/* ACCOUNT TYPE SELECTOR */}
              <div className="account-type-grid">
                <button
                  type="button"
                  className={`account-type-card ${
                    accountType === 'comprador' ? 'is-selected' : ''
                  }`}
                  onClick={() => setAccountType('comprador')}
                >
                  <div className="account-type-icon">
                    <ShoppingBag size={28} />
                  </div>
                  <div className="account-type-title">Quero Comprar</div>
                  <div className="account-type-desc">
                    Descobrir peças e entrar em contato com brechós
                  </div>
                </button>

                <button
                  type="button"
                  className={`account-type-card ${
                    accountType === 'brecho' ? 'is-selected' : ''
                  }`}
                  onClick={() => setAccountType('brecho')}
                >
                  <div className="account-type-icon">
                    <Store size={28} />
                  </div>
                  <div className="account-type-title">Tenho um Brechó</div>
                  <div className="account-type-desc">
                    Divulgar meu catálogo e receber contatos no WhatsApp
                  </div>
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="nomeResponsavel" className="form-label">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nomeResponsavel"
                  name="nomeResponsavel"
                  className="form-input"
                  required
                  value={formData.nomeResponsavel}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  className="form-input"
                  required
                  value={formData.senha}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-cyan-pill w-full auth-btn" disabled={loading}>
                {loading 
                  ? 'Aguarde...' 
                  : accountType === 'brecho' ? 'Continuar para dados da loja →' : 'Criar Conta'}
              </button>
            </form>
          </>
        )}

        <div className="auth-card__footer">
          <p>
            Já possui uma conta? <Link to="/login">Fazer Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
