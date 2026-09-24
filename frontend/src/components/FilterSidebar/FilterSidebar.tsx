import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './FilterSidebarDrawer.css'
import { ChevronLeft, RotateCcw, Filter, X } from 'lucide-react'

export default function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Helpers to deal with comma-separated values in URL
  const getArrayParam = (key: string) => {
    const val = searchParams.get(key)
    return val ? val.split(',') : []
  }

  const toggleArrayParam = (key: string, value: string) => {
    const current = getArrayParam(key)
    const newParams = new URLSearchParams(searchParams)
    
    if (current.includes(value)) {
      const updated = current.filter(item => item !== value)
      if (updated.length > 0) newParams.set(key, updated.join(','))
      else newParams.delete(key)
    } else {
      current.push(value)
      newParams.set(key, current.join(','))
    }
    setSearchParams(newParams)
  }

  const setSingleParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) newParams.set(key, value)
    else newParams.delete(key)
    setSearchParams(newParams)
  }

  const toggleBooleanParam = (key: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (newParams.get(key) === 'true') newParams.delete(key)
    else newParams.set(key, 'true')
    setSearchParams(newParams)
  }

  // Active params
  const activeCategorias = getArrayParam('categoria')
  const activeTipos = getArrayParam('tipo')
  const activeTamanhos = getArrayParam('tamanho')
  const activeCondicoes = getArrayParam('condicao')
  
  const minPrice = searchParams.get('minPreco') || ''
  const maxPrice = searchParams.get('maxPreco') || ''
  const localizacao = searchParams.get('localizacao') || ''
  const brechoBusca = searchParams.get('brecho') || ''
  const isDisponivel = searchParams.get('disponivel') === 'true'

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters = Array.from(searchParams.keys()).length > 0

  return (
    <>
      <button
        type="button"
        className="mobile-filter-toggle-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir filtros"
      >
        <Filter size={18} /> Filtros
      </button>

      {mobileOpen && (
        <div className="mobile-filter-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`filter-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
        <div className="filter-sidebar__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} className="text-cyan" />
            <h3 className="filter-sidebar__title">Filtros</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {hasActiveFilters && !collapsed && (
              <button
                type="button"
                className="filter-sidebar__reset-btn"
                onClick={handleClearFilters}
                title="Limpar filtros"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              type="button"
              className="filter-sidebar__toggle-btn desktop-only"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label="Alternar filtros"
            >
              <ChevronLeft
                size={18}
                style={{
                  transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
            <button
              type="button"
              className="mobile-close-btn mobile-only"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar filtros"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="filter-sidebar__body">
            
            {/* CATEGORIA */}
            <div className="filter-group">
              <h4 className="filter-group__label">CATEGORIA</h4>
              <div className="filter-group__list">
                {['Roupas', 'Calçados', 'Acessórios'].map((cat) => (
                  <label key={cat} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={activeCategorias.includes(cat)}
                      onChange={() => toggleArrayParam('categoria', cat)}
                    />
                    <span className="filter-checkbox__custom" />
                    <span className="filter-checkbox__text">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* TIPO DE PEÇA */}
            <div className="filter-group">
              <h4 className="filter-group__label">TIPO DE PEÇA</h4>
              <div className="filter-group__list">
                {['Camiseta', 'Camisa', 'Calça', 'Vestido', 'Saia', 'Jaqueta', 'Tênis', 'Bolsa', 'Outros'].map((tipo) => (
                  <label key={tipo} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={activeTipos.includes(tipo)}
                      onChange={() => toggleArrayParam('tipo', tipo)}
                    />
                    <span className="filter-checkbox__custom" />
                    <span className="filter-checkbox__text">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* TAMANHO */}
            <div className="filter-group">
              <h4 className="filter-group__label">TAMANHO</h4>
              <div className="filter-group__list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'].map((tam) => (
                  <label key={tam} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={activeTamanhos.includes(tam)}
                      onChange={() => toggleArrayParam('tamanho', tam)}
                    />
                    <span className="filter-checkbox__custom" />
                    <span className="filter-checkbox__text">{tam}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PREÇO */}
            <div className="filter-group">
              <h4 className="filter-group__label">PREÇO</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>R$</span>
                <input 
                  type="number" 
                  placeholder="Mín" 
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                  value={minPrice}
                  onChange={(e) => setSingleParam('minPreco', e.target.value)}
                />
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>até</span>
                <input 
                  type="number" 
                  placeholder="Máx" 
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                  value={maxPrice}
                  onChange={(e) => setSingleParam('maxPreco', e.target.value)}
                />
              </div>
            </div>

            {/* CONDIÇÃO */}
            <div className="filter-group">
              <h4 className="filter-group__label">CONDIÇÃO</h4>
              <div className="filter-group__list">
                {['Novo', 'Seminovo', 'Usado'].map((cond) => (
                  <label key={cond} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={activeCondicoes.includes(cond)}
                      onChange={() => toggleArrayParam('condicao', cond)}
                    />
                    <span className="filter-checkbox__custom" />
                    <span className="filter-checkbox__text">{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* LOCALIZAÇÃO */}
            <div className="filter-group">
              <h4 className="filter-group__label">LOCALIZAÇÃO</h4>
              <select 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                value={localizacao}
                onChange={(e) => setSingleParam('localizacao', e.target.value)}
              >
                <option value="">Todas as cidades</option>
                <option value="Macapá">Macapá</option>
                <option value="Santana">Santana</option>
                <option value="Laranjal do Jari">Laranjal do Jari</option>
              </select>
            </div>

            {/* BRECHÓ */}
            <div className="filter-group">
              <h4 className="filter-group__label">BRECHÓ</h4>
              <input 
                type="text" 
                placeholder="Nome do brechó..." 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                value={brechoBusca}
                onChange={(e) => setSingleParam('brecho', e.target.value)}
              />
            </div>

            {/* DISPONIBILIDADE */}
            <div className="filter-group" style={{ borderBottom: 'none' }}>
              <h4 className="filter-group__label">DISPONIBILIDADE</h4>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={isDisponivel}
                  onChange={() => toggleBooleanParam('disponivel')}
                />
                <span className="filter-checkbox__custom" />
                <span className="filter-checkbox__text">Apenas disponíveis</span>
              </label>
            </div>

          </div>
        )}
      </aside>
    </>
  )
}
