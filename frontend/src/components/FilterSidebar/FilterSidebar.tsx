import { useState } from 'react'

export default function FilterSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Casacos & Jaquetas',
  ])
  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [selectedCondition, setSelectedCondition] = useState<string>(
    'Excelente estado'
  )

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  return (
    <aside className={`filter-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="filter-sidebar__header">
        <h3 className="filter-sidebar__title">Filtros</h3>
        <button
          type="button"
          className="filter-sidebar__toggle-btn"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label="Alternar filtros"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="filter-sidebar__body">
          {/* CATEGORIAS */}
          <div className="filter-group">
            <h4 className="filter-group__label">CATEGORIAS</h4>
            <div className="filter-group__list">
              {['Acessórios', 'Casacos & Jaquetas', 'Calçados', 'Vestidos'].map(
                (cat) => {
                  const isChecked = selectedCategories.includes(cat)
                  return (
                    <label key={cat} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat)}
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
                  className={`size-btn ${selectedSize === size ? 'is-active' : ''}`}
                  onClick={() => setSelectedSize(size)}
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
              {['Novo com etiqueta', 'Excelente estado'].map((cond) => (
                <label key={cond} className="filter-radio">
                  <input
                    type="radio"
                    name="condicao"
                    checked={selectedCondition === cond}
                    onChange={() => setSelectedCondition(cond)}
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
  )
}
