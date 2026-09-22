import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Cadastro() {
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState<'comprador' | 'brecho'>('brecho')
  const [step, setStep] = useState<1 | 2>(1)
  const [successMsg, setSuccessMsg] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    nomeResponsavel: '',
    email: '',
    senha: '',
    nomeBrecho: '',
    localizacao: 'Centro, Macapá - AP',
    whatsapp: '(96) 99999-9999',
    instagram: '@brechodamaria',
    horario: 'Seg–Sáb · 09:00–18:00',
    descricao: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault()
    if (accountType === 'comprador') {
      handleSubmitFinal()
    } else {
      setStep(2)
    }
  }

  const handleSubmitFinal = (e?: FormEvent) => {
    if (e) e.preventDefault()
    setSuccessMsg(true)

    // Save mock store info to localStorage
    if (accountType === 'brecho') {
      const storeData = {
        nome: formData.nomeBrecho || 'Brechó da Maria',
        localizacao: formData.localizacao,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        horario: formData.horario,
        descricao: formData.descricao,
      }
      localStorage.setItem('breshop_user_store', JSON.stringify(storeData))
    }

    setTimeout(() => {
      navigate('/painel')
    }, 1500)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__eyebrow">CADASTRO BRESHOP</span>
          <h1 className="auth-card__title">Crie sua conta</h1>
          <p className="auth-card__subtitle">
            {step === 1
              ? 'Selecione o seu perfil para começar na plataforma'
              : 'Preencha os dados do seu brechó para criar sua loja'}
          </p>
        </div>

        {/* STEP INDICATOR */}
        {accountType === 'brecho' && (
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'is-active' : ''}`}>1</div>
            <div className="step-line" />
            <div className={`step-dot ${step === 2 ? 'is-active' : ''}`}>2</div>
          </div>
        )}

        {successMsg ? (
          <div className="auth-success-box">
            <div className="auth-success-icon">✓</div>
            <h3>Cadastro realizado com sucesso!</h3>
            <p>Redirecionando para o seu painel de controle...</p>
          </div>
        ) : (
          <>
            {step === 1 ? (
              <form onSubmit={handleNextStep} className="auth-form">
                {/* ACCOUNT TYPE SELECTOR */}
                <div className="account-type-grid">
                  <button
                    type="button"
                    className={`account-type-card ${
                      accountType === 'comprador' ? 'is-selected' : ''
                    }`}
                    onClick={() => setAccountType('comprador')}
                  >
                    <div className="account-type-icon">🛍️</div>
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
                    <div className="account-type-icon">🏪</div>
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
                    placeholder="Seu nome completo"
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
                    placeholder="seu@email.com"
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
                    placeholder="••••••••"
                    required
                    value={formData.senha}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-cyan-pill w-full auth-btn">
                  {accountType === 'brecho' ? 'Continuar para dados da loja →' : 'Criar Conta'}
                </button>
              </form>
            ) : (
              /* STEP 2: BRECHÓ DETAILS */
              <form onSubmit={handleSubmitFinal} className="auth-form">
                <div className="form-group">
                  <label htmlFor="nomeBrecho" className="form-label">
                    Nome do Brechó *
                  </label>
                  <input
                    type="text"
                    id="nomeBrecho"
                    name="nomeBrecho"
                    className="form-input"
                    placeholder="Ex: Brechó da Maria"
                    required
                    value={formData.nomeBrecho}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="localizacao" className="form-label">
                      Localização (Bairro, Cidade - UF) *
                    </label>
                    <input
                      type="text"
                      id="localizacao"
                      name="localizacao"
                      className="form-input"
                      placeholder="Ex: Centro, Macapá - AP"
                      required
                      value={formData.localizacao}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="whatsapp" className="form-label">
                      WhatsApp para Contato *
                    </label>
                    <input
                      type="text"
                      id="whatsapp"
                      name="whatsapp"
                      className="form-input"
                      placeholder="(96) 99999-9999"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="instagram" className="form-label">
                      Instagram do Brechó
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      className="form-input"
                      placeholder="@seu.brecho"
                      value={formData.instagram}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="horario" className="form-label">
                      Horário de Funcionamento
                    </label>
                    <input
                      type="text"
                      id="horario"
                      name="horario"
                      className="form-input"
                      placeholder="Ex: Seg–Sáb · 09:00–18:00"
                      value={formData.horario}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="descricao" className="form-label">
                    Descrição do Brechó
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    className="form-textarea"
                    rows={3}
                    placeholder="Conte sobre o estilo do brechó, curadoria ou peças em destaque..."
                    value={formData.descricao}
                    onChange={handleChange}
                  />
                </div>

                <div className="auth-form-buttons">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setStep(1)}
                  >
                    ← Voltar
                  </button>
                  <button type="submit" className="btn btn-cyan-pill flex-1">
                    Concluir e Abrir Minha Loja
                  </button>
                </div>
              </form>
            )}
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
