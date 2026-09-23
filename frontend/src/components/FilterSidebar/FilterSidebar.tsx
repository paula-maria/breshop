import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './FilterSidebarDrawer.css'
import { ChevronLeft, RotateCcw, Filter, Shirt, X } from 'lucide-react'

export default function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // URL State values
  const catParam = searchParams.get('cat') || ''
  const sizeParam = searchParams.get('tamanho') || ''
  const conditionParam = searchParams.get('condicao') || ''

  const handleGenderChange = (gender: 'feminino' | 'masculino' | 'todas') => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('cat', gender)
    setSearchParams(newParams)
  }

  const handleCategoryToggle = (category: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (catParam === category) {
      newParams.delete('cat')
    } else {
      newParams.set('cat', category)
    }
    setSearchParams(newParams)
  }

  const handleSizeToggle = (size: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (sizeParam === size) {
      newParams.delete('tamanho')
    } else {
      newParams.set('tamanho', size)
    }
    setSearchParams(newParams)
  }

  const handleConditionToggle = (cond: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (conditionParam === cond) {
      newParams.delete('condicao')
    } else {
      newParams.set('condicao', cond)
    }
    setSearchParams(newParams)
  }

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('cat')
    newParams.delete('tamanho')
    newParams.delete('condicao')
    setSearchParams(newParams)
  }

  const hasActiveFilters = Boolean(catParam || sizeParam || conditionParam)

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
          {/* GÊNERO / OPÇÃO PRINCIPAL */}
          <div className="filter-group">
            <h4 className="filter-group__label">OPÇÕES</h4>
            <div className="filter-gender-grid">
              <button
                type="button"
                className={`gender-filter-btn ${catParam === 'feminino' ? 'is-active' : ''}`}
                onClick={() => handleGenderChange('feminino')}
              >
                <Shirt size={14} /> Feminino
              </button>
              <button
                type="button"
                className={`gender-filter-btn ${catParam === 'masculino' ? 'is-active' : ''}`}
                onClick={() => handleGenderChange('masculino')}
              >
                <Shirt size={14} /> Masculino
              </button>
              <button
                type="button"
                className={`gender-filter-btn ${catParam === 'todas' || !catParam ? 'is-active' : ''}`}
                onClick={() => handleGenderChange('todas')}
              >
                Todos
              </button>
            </div>
          </div>

          {/* CATEGORIAS */}
          <div className="filter-group">
            <h4 className="filter-group__label">CATEGORIAS</h4>
            <div className="filter-group__list">
              {['Jaquetas', 'Vestidos', 'Camisas', 'Calçados', 'Acessórios'].map(
                (cat) => {
                  const isChecked = catParam.toLowerCase() === cat.toLowerCase()
                  return (
                    <label key={cat} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCategoryToggle(cat)}
                      />
                      <span className="filter-checkbox__custom" />
                      <span className="filter-checkbox__text">{cat}</span>
                    </label>
                  )
                }
              )}
            </div>
          </div>

          {/* TAMANHOS */}
          <div className="filter-group">
            <h4 className="filter-group__label">TAMANHOS</h4>
            <div className="filter-size-grid">
              {['P', 'M', 'G', 'GG', '38', '40'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn ${sizeParam === size ? 'is-active' : ''}`}
                  onClick={() => handleSizeToggle(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CONDIÇÃO */}
          <div className="filter-group">
            <h4 className="filter-group__label">CONDIÇÃO</h4>
            <div className="filter-group__list">
              {['Novo com etiqueta', 'Excelente estado', 'Seminova'].map((cond) => (
                <label key={cond} className="filter-radio">
                  <input
                    type="radio"
                    name="condicao"
                    checked={conditionParam === cond}
                    onChange={() => handleConditionToggle(cond)}
                  />
                  <span className="filter-radio__custom" />
                  <span className="filter-radio__text">{cond}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
    </>
  )
}
