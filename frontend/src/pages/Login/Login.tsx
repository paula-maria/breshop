import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/painel')
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

        <form onSubmit={handleLoginSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="seu@email.com"
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
              placeholder="••••••••"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-cyan-pill w-full auth-btn">
            Entrar na Conta
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
