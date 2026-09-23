import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Store, MapPin, Clock, Plus, X, ExternalLink } from 'lucide-react'

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

const initialItems: ItemDashboard[] = [
  {
    id: '101',
    nome: 'Camisa vintage',
    preco: 'R$ 45,00',
    tamanho: 'M',
    categoria: 'Roupas',
    condicao: 'Seminova',
    status: 'DISPONÍVEL',
    imageUrl: '/images/vintage_shirt.png',
  },
  {
    id: '1',
    nome: 'Jaqueta Jeans Bordada Vintage',
    preco: 'R$ 89,90',
    tamanho: 'M',
    categoria: 'Roupas',
    condicao: 'Excelente estado',
    status: 'DISPONÍVEL',
    imageUrl: '/images/denim_jacket.png',
  },
  {
    id: '2',
    nome: 'Corta Vento Retro 90s',
    preco: 'R$ 65,00',
    tamanho: 'M',
    categoria: 'Roupas',
    condicao: 'Seminova',
    status: 'DISPONÍVEL',
    imageUrl: '/images/windbreaker_jacket.png',
  },
  {
    id: '3',
    nome: 'Jaqueta Utility Verde Olive',
    preco: 'R$ 120,00',
    tamanho: 'G',
    categoria: 'Roupas',
    condicao: 'Excelente estado',
    status: 'DISPONÍVEL',
    imageUrl: '/images/olive_jacket.png',
  },
]

type StoreInfo = {
  nome: string
  localizacao: string
  whatsapp: string
  instagram: string
  horario: string
}

export default function Painel() {
  const [activeTab, setActiveTab] = useState<'pecas' | 'perfil'>('pecas')
  const [items, setItems] = useState<ItemDashboard[]>(() => {
    const saved = localStorage.getItem('breshop_dashboard_items')
    return saved ? JSON.parse(saved) : initialItems
  })

  const [storeData, setStoreData] = useState<StoreInfo>(() => {
    const savedStore = localStorage.getItem('breshop_user_store')
    if (savedStore) {
      try {
        return {
          nome: 'Brechó da Maria',
          localizacao: 'Centro, Macapá - AP',
          whatsapp: '(96) 99999-9999',
          instagram: '@brechodamaria',
          horario: 'Seg–Sáb · 09:00–18:00',
          ...JSON.parse(savedStore),
        }
      } catch (e) {
        console.error('Error parsing stored store data', e)
      }
    }
    return {
      nome: 'Brechó da Maria',
      localizacao: 'Centro, Macapá - AP',
      whatsapp: '(96) 99999-9999',
      instagram: '@brechodamaria',
      horario: 'Seg–Sáb · 09:00–18:00',
    }
  })

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

  useEffect(() => {
    localStorage.setItem('breshop_dashboard_items', JSON.stringify(items))
  }, [items])

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

  const handleDeleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta peça do seu catálogo?')) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleCreateItemSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!newItem.nome || !newItem.preco) return

    const created: ItemDashboard = {
      id: String(Date.now()),
      nome: newItem.nome,
      preco: newItem.preco.startsWith('R$') ? newItem.preco : `R$ ${newItem.preco}`,
      tamanho: newItem.tamanho,
      categoria: newItem.categoria,
      condicao: newItem.condicao,
      status: 'DISPONÍVEL',
      imageUrl: newItem.imageUrl || '/images/vintage_shirt.png',
    }

    setItems((prev) => [created, ...prev])
    setIsModalOpen(false)
    setNewItem({
      nome: '',
      preco: '',
      tamanho: 'M',
      categoria: 'Roupas',
      condicao: 'Seminova',
      imageUrl: '/images/vintage_shirt.png',
      descricao: '',
    })
  }

  const filteredItems = items.filter((item) =>
    item.nome.toLowerCase().includes(filterQuery.toLowerCase())
  )

  const activeCount = items.filter((i) => i.status === 'DISPONÍVEL').length

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
                {storeData.localizacao} ·{' '}
                <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} />
                {storeData.horario}
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
                      onClick={() => handleDeleteItem(item.id)}
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
          <div className="profile-edit-card">
            <h2 className="section-title">Informações do Brechó</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                localStorage.setItem('breshop_user_store', JSON.stringify(storeData))
                alert('Dados do brechó atualizados com sucesso!')
              }}
              className="auth-form"
            >
              <div className="form-group">
                <label className="form-label">Nome do Brechó</label>
                <input
                  type="text"
                  className="form-input"
                  value={storeData.nome}
                  onChange={(e) =>
                    setStoreData((prev) => ({ ...prev, nome: e.target.value }))
                  }
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Localização</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storeData.localizacao}
                    onChange={(e) =>
                      setStoreData((prev) => ({
                        ...prev,
                        localizacao: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp de Contato</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storeData.whatsapp}
                    onChange={(e) =>
                      setStoreData((prev) => ({
                        ...prev,
                        whatsapp: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Instagram</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storeData.instagram}
                    onChange={(e) =>
                      setStoreData((prev) => ({
                        ...prev,
                        instagram: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Horário de Funcionamento</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storeData.horario}
                    onChange={(e) =>
                      setStoreData((prev) => ({
                        ...prev,
                        horario: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-cyan-pill">
                Salvar Alterações
              </button>
            </form>
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
    </div>
  )
}
