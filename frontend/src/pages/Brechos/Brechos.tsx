import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CardBrecho, { type CardBrechoProps } from '../../components/CardBrecho/CardBrecho'

const allBrechosList: (CardBrechoProps & { tone?: 'teal' | 'navy' | 'cyan'; cidade: string })[] = [
  {
    id: '1',
    nome: 'Brechó da Maria',
    localizacao: 'Centro, Macapá - AP',
    cidade: 'Macapá',
    descricao: 'Peças femininas e masculinas com curadoria especial e preços acessíveis.',
    tone: 'teal',
  },
  {
    id: '2',
    nome: 'Brechó Aurora',
    localizacao: 'Centro, Macapá - AP',
    cidade: 'Macapá',
    descricao: 'Peças garimpadas com afeto e curadoria especial em Macapá.',
    tone: 'cyan',
  },
  {
    id: '3',
    nome: 'Brechó Vintage',
    localizacao: 'Trem, Macapá - AP',
    cidade: 'Macapá',
    descricao: 'O melhor do estilo retrô dos anos 80, 90 e 2000.',
    tone: 'navy',
  },
  {
    id: '4',
    nome: 'Brechó X',
    localizacao: 'Santana - AP',
    cidade: 'Santana',
    descricao: 'Roupas e acessórios únicos para renovar seu estilo sustentável.',
    tone: 'teal',
  },
  {
    id: '5',
    nome: 'Closet Retrô Santana',
    localizacao: 'Centro, Santana - AP',
    cidade: 'Santana',
    descricao: 'Moda circular selecionada a dedo no centro de Santana.',
    tone: 'cyan',
  },
  {
    id: '6',
    nome: 'Relíquia Shop',
    localizacao: 'Santa Rita, Macapá - AP',
    cidade: 'Macapá',
    descricao: 'Especializado em peças vintage raras e jaquetas dos anos 90.',
    tone: 'navy',
  },
]

export default function Brechos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cityParam = searchParams.get('cidade') || 'Todas'
  const [searchQuery, setSearchQuery] = useState('')

  const cities = ['Todas', 'Macapá', 'Santana']

  const handleCityChange = (city: string) => {
    if (city === 'Todas') {
      searchParams.delete('cidade')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ cidade: city })
    }
  }

  const filteredBrechos = allBrechosList.filter((brecho) => {
    const matchesCity = cityParam === 'Todas' || brecho.cidade === cityParam
    const matchesSearch =
      brecho.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brecho.localizacao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (brecho.descricao && brecho.descricao.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCity && matchesSearch
  })

  return (
    <div className="brechos-page">
      <div className="brechos-header-box">
        <span className="brechos-eyebrow">DIRETÓRIO DE LOJAS</span>
        <h1 className="brechos-title">Brechós Cadastrados</h1>
        <p className="brechos-subtitle">
          Encontre brechós próximos a você e descubra novos catálogos de moda sustentável.
        </p>

        {/* SEARCH & FILTER BAR */}
        <div className="brechos-toolbar">
          <input
            type="search"
            placeholder="Buscar brechó por nome ou localização..."
            className="brechos-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="city-pills">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                className={`city-pill-btn ${cityParam === city ? 'is-active' : ''}`}
                onClick={() => handleCityChange(city)}
              >
                {city === 'Todas' ? 'Todas as regiões' : city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BRECHÓS GRID */}
      {filteredBrechos.length > 0 ? (
        <div className="grid-3-cols">
          {filteredBrechos.map((brecho) => (
            <CardBrecho key={brecho.id} {...brecho} />
          ))}
        </div>
      ) : (
        <div className="empty-products-state">
          <p>Nenhum brechó encontrado para o filtro selecionado.</p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSearchQuery('')
              handleCityChange('Todas')
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}
