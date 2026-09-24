import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Store, MapPin, Clock, Plus, X, ExternalLink } from 'lucide-react'
import Toast, { type ToastType } from '../../components/Toast/Toast'
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'
import { api } from '../../services/api'
import { useNavigate, useLocation } from 'react-router-dom'

type ItemDashboard = {
  id: string
  nome: string
  preco: string
  tamanho: string
  categoria: string
  condicao: string
  status: 'DISPONÍVEL' | 'VENDIDO'
  imageUrl: string
}

type StoreInfo = {
  nome: string
  descricao?: string
  logoUrl?: string
  capaUrl?: string
  telefone?: string
  whatsapp: string
  emailContato?: string
  instagram?: string
  site?: string
  cep?: string
  rua?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  horarios?: string
  formasPagamento: string[]
  atendimento?: string
  entrega: boolean
  retirada: boolean
  negociacao: boolean
}

export default function Painel() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'pecas' | 'perfil'>('pecas')
  const [items, setItems] = useState<ItemDashboard[]>([])
  const [storeData, setStoreData] = useState<StoreInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStore() {
      try {
        const res = await api.get('/brechos/minha-loja')
        const data = res.data
        setStoreData({
          ...data
        })
        
        if (data.pecas) {
          const mappedItems = data.pecas.map((p: any) => ({
            id: p.id,
            nome: p.nome,
            preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
            tamanho: p.tamanho,
            categoria: p.categoria,
            condicao: p.condicao,
            status: p.disponivel ? 'DISPONÍVEL' : 'VENDIDO',
            imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0] : '/images/vintage_shirt.png'
          }))
          setItems(mappedItems)
        }
      } catch (err: any) {
        console.error('Erro ao carregar loja', err)
        if (err.response?.status === 404) {
          navigate('/onboarding-brecho')
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadStore()
  }, [navigate])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    nome: '',
    preco: '',
    tamanho: 'M',
    categoria: 'Roupas',
    condicao: 'Seminova',
    imageUrl: '/images/vintage_shirt.png',
    descricao: '',
  })

  const [filterQuery, setFilterQuery] = useState('')

  // Toast state
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: '',
    type: 'success',
  })

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ isOpen: true, message, type })
  }

  // ConfirmModal state
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null,
  })

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'DISPONÍVEL' ? 'VENDIDO' : 'DISPONÍVEL',
            }
          : item
      )
    )
  }

  useEffect(() => {
    if (location.state?.toastMessage) {
      showToast(location.state.toastMessage, 'success')
      window.history.replaceState({}, document.title)
    }
    if (location.state?.tab) {
      setActiveTab(location.state.tab)
    }
  }, [location.state])

  const handleDeleteClick = (id: string) => {
    setConfirmModal({ isOpen: true, itemId: id })
  }

  const handleConfirmDelete = () => {
    if (confirmModal.itemId) {
      setItems((prev) => prev.filter((item) => item.id !== confirmModal.itemId))
      showToast('Peça excluída do catálogo.', 'success')
    }
    setConfirmModal({ isOpen: false, itemId: null })
  }

  const handleCreateItemSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!newItem.nome || !newItem.preco) return

    const numericPrice = parseFloat(newItem.preco.replace('R$', '').replace(',', '.').trim())

    try {
      const res = await api.post('/pecas', {
        nome: newItem.nome,
        preco: isNaN(numericPrice) ? 0 : numericPrice,
        tamanho: newItem.tamanho,
        categoria: newItem.categoria,
        condicao: newItem.condicao,
        descricao: newItem.descricao,
        fotos: [newItem.imageUrl || '/images/vintage_shirt.png']
      })
      
      const p = res.data
      const created: ItemDashboard = {
        id: p.id,
        nome: p.nome,
        preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
        tamanho: p.tamanho,
        categoria: p.categoria,
        condicao: p.condicao,
        status: p.disponivel ? 'DISPONÍVEL' : 'VENDIDO',
        imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0] : '/images/vintage_shirt.png'
      }

      setItems((prev) => [created, ...prev])
      setIsModalOpen(false)
      showToast('Peça cadastrada com sucesso!', 'success')
      setNewItem({
        nome: '',
        preco: '',
        tamanho: 'M',
        categoria: 'Roupas',
        condicao: 'Seminova',
        imageUrl: '/images/vintage_shirt.png',
        descricao: '',
      })
    } catch (err) {
      showToast('Erro ao cadastrar peça.', 'error')
    }
  }

  const filteredItems = items.filter((item) =>
    item.nome.toLowerCase().includes(filterQuery.toLowerCase())
  )

  const activeCount = items.filter((i) => i.status === 'DISPONÍVEL').length

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Carregando dados da loja...</div>
  }

  if (!storeData) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Erro ao carregar loja.</div>
  }

  return (
    <div className="dashboard-page">
      {/* STORE DASHBOARD HEADER */}
      <div className="dashboard-header-card">
        <div className="dashboard-header-card__top">
          <div className="store-profile-meta">
            <div className="store-avatar-box">
              <Store size={24} />
            </div>
            <div>
              <div className="store-badge-status">
                <span className="dot" /> LOJA ATIVA
              </div>
              <h1 className="dashboard-store-name">{storeData.nome}</h1>
              <p className="dashboard-store-location">
                <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {storeData.cidade ? `${storeData.cidade} - ${storeData.estado}` : 'Localização pendente'} ·{' '}
                <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} />
                {storeData.horarios || 'Horários não definidos'}
              </p>
            </div>
          </div>

          <Link to="/brechos/1" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Ver minha loja pública <ExternalLink size={14} />
          </Link>
        </div>

        {/* KPI METRICS BAR */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-card__label">Peças Cadastradas</span>
            <span className="kpi-card__value">{items.length}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-card__label">Peças Ativas</span>
            <span className="kpi-card__value text-cyan">{activeCount}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-card__label">Contatos via WhatsApp</span>
            <span className="kpi-card__value">38</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-card__label">Visualizações no Mês</span>
            <span className="kpi-card__value">412</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div className="dashboard-tabs">
        <button
          type="button"
          className={`dashboard-tab-btn ${activeTab === 'pecas' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('pecas')}
        >
          Minhas Peças ({items.length})
        </button>
        <button
          type="button"
          className={`dashboard-tab-btn ${activeTab === 'perfil' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          Dados do Brechó
        </button>
      </div>

      {/* TAB 1: MINHAS PEÇAS */}
      {activeTab === 'pecas' && (
        <div className="dashboard-section">
          <div className="dashboard-section-toolbar">
            <div className="toolbar-search">
              <input
                type="text"
                placeholder="Buscar em minhas peças..."
                className="toolbar-search__input"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-cyan-pill"
              onClick={() => setIsModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Cadastrar Nova Peça
            </button>
          </div>

          {/* PRODUCTS LIST */}
          <div className="dashboard-items-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="dashboard-item-card">
                <div className="dashboard-item-card__media">
                  <img src={item.imageUrl} alt={item.nome} />
                  <span
                    className={`item-status-badge ${
                      item.status === 'VENDIDO' ? 'is-sold' : 'is-available'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="dashboard-item-card__body">
                  <span className="dashboard-item-category">{item.categoria}</span>
                  <h3 className="dashboard-item-title">{item.nome}</h3>

                  <div className="dashboard-item-specs">
                    <span>Tam. {item.tamanho}</span>
                    <span>·</span>
                    <span>{item.condicao}</span>
                  </div>

                  <p className="dashboard-item-price">{item.preco}</p>

                  <div className="dashboard-item-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleStatus(item.id)}
                    >
                      {item.status === 'DISPONÍVEL'
                        ? 'Marcar Vendido'
                        : 'Reativar Peça'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-danger"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DADOS DO BRECHÓ */}
      {activeTab === 'perfil' && (
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Informações do Brechó</h2>
            <button 
              className="btn btn-ghost" 
              onClick={() => navigate('/onboarding-brecho')}
            >
              Editar Dados
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* INFORMAÇÕES BÁSICAS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>NOME DO BRECHÓ</strong>
                <p style={{ marginTop: '6px', fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{storeData.nome}</p>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>WHATSAPP</strong>
                <p style={{ marginTop: '6px', fontSize: '1.1rem', color: '#0f172a' }}>{storeData.whatsapp}</p>
              </div>
              {storeData.descricao && (
                <div style={{ gridColumn: 'span 2' }}>
                  <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>DESCRIÇÃO</strong>
                  <p style={{ marginTop: '6px', color: '#334155', lineHeight: '1.6' }}>{storeData.descricao}</p>
                </div>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

            {/* CONTATOS SECUNDÁRIOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>E-MAIL CONTATO</strong>
                <p style={{ marginTop: '6px', color: '#334155' }}>{storeData.emailContato || '-'}</p>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>TELEFONE FIXO</strong>
                <p style={{ marginTop: '6px', color: '#334155' }}>{storeData.telefone || '-'}</p>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>INSTAGRAM</strong>
                <p style={{ marginTop: '6px', color: '#334155' }}>{storeData.instagram || '-'}</p>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>SITE OFICIAL</strong>
                <p style={{ marginTop: '6px', color: '#334155' }}>{storeData.site || '-'}</p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

            {/* ENDEREÇO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>ENDEREÇO E LOCALIZAÇÃO</strong>
                {storeData.rua ? (
                  <>
                    <p style={{ marginTop: '8px', fontSize: '1.1rem', color: '#0f172a' }}>
                      {storeData.rua}, {storeData.numero} {storeData.complemento ? `(${storeData.complemento})` : ''} - {storeData.bairro}
                    </p>
                    <p style={{ marginTop: '4px', color: '#64748b' }}>
                      {storeData.cidade} - {storeData.estado} | CEP: {storeData.cep}
                    </p>
                  </>
                ) : (
                  <p style={{ marginTop: '8px', color: '#94a3b8' }}>Nenhum endereço cadastrado</p>
                )}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

            {/* INFORMAÇÕES COMERCIAIS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>HORÁRIOS</strong>
                <p style={{ marginTop: '6px', color: '#334155' }}>{storeData.horarios || 'Não informados'}</p>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>FAZ ENTREGA?</strong>
                <p style={{ marginTop: '6px', color: '#334155', fontWeight: storeData.entrega ? 600 : 400, color: storeData.entrega ? '#10b981' : '#64748b' }}>
                  {storeData.entrega ? 'Sim' : 'Não'}
                </p>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>PERMITE RETIRADA?</strong>
                <p style={{ marginTop: '6px', color: '#334155', fontWeight: storeData.retirada ? 600 : 400, color: storeData.retirada ? '#10b981' : '#64748b' }}>
                  {storeData.retirada ? 'Sim' : 'Não'}
                </p>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.05em' }}>ACEITA NEGOCIAÇÃO?</strong>
                <p style={{ marginTop: '6px', color: '#334155', fontWeight: storeData.negociacao ? 600 : 400, color: storeData.negociacao ? '#10b981' : '#64748b' }}>
                  {storeData.negociacao ? 'Sim' : 'Não'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CADASTRAR NOVA PEÇA */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Cadastrar Nova Peça</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nome da Peça *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Vestido Floral Vintage"
                  required
                  value={newItem.nome}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, nome: e.target.value }))
                  }
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Preço (R$) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: 45,00"
                    required
                    value={newItem.preco}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, preco: e.target.value }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tamanho *</label>
                  <select
                    className="form-input"
                    value={newItem.tamanho}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        tamanho: e.target.value,
                      }))
                    }
                  >
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                    <option value="38">38</option>
                    <option value="40">40</option>
                    <option value="Único">Único</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select
                    className="form-input"
                    value={newItem.categoria}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        categoria: e.target.value,
                      }))
                    }
                  >
                    <option value="Roupas">Roupas</option>
                    <option value="Calçados">Calçados</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Condição</label>
                  <select
                    className="form-input"
                    value={newItem.condicao}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        condicao: e.target.value,
                      }))
                    }
                  >
                    <option value="Novo com etiqueta">Novo com etiqueta</option>
                    <option value="Excelente estado">Excelente estado</option>
                    <option value="Seminova">Seminova</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Imagem Demonstrativa</label>
                <select
                  className="form-input"
                  value={newItem.imageUrl}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                >
                  <option value="/images/vintage_shirt.png">
                    Camisa Vintage (Exemplo)
                  </option>
                  <option value="/images/denim_jacket.png">
                    Jaqueta Jeans (Exemplo)
                  </option>
                  <option value="/images/windbreaker_jacket.png">
                    Corta Vento (Exemplo)
                  </option>
                  <option value="/images/olive_jacket.png">
                    Jaqueta Olive (Exemplo)
                  </option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-cyan-pill">
                  Salvar e Publicar Peça
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Excluir Peça"
        message="Tem certeza que deseja excluir esta peça do seu catálogo?"
        confirmText="Excluir"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, itemId: null })}
      />
    </div>
  )
}
