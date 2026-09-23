import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CardBrecho, { type CardBrechoProps } from '../../components/CardBrecho/CardBrecho'
import CardPeca, { type CardPecaProps } from '../../components/CardPeca/CardPeca'

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

const allPecasCatalog: (CardPecaProps & { genero: 'feminino' | 'masculino' })[] = [
  {
    id: 'f1',
    nome: 'Jaqueta Jeans Bordada Vintage',
    brecho: 'Brechó Aurora',
    preco: 'R$ 89,90',
    tamanho: 'Tam. M',
    categoria: 'Jaquetas',
    statusTag: 'DISPONÍVEL',
    genero: 'feminino',
    imageUrl: '/images/denim_jacket.png',
  },
  {
    id: 'f2',
    nome: 'Vestido Floral Estampado 90s',
    brecho: 'Brechó da Maria',
    preco: 'R$ 75,00',
    tamanho: 'Tam. P',
    categoria: 'Vestidos',
    statusTag: 'DISPONÍVEL',
    genero: 'feminino',
    imageUrl: '/images/vintage_shirt.png',
  },
  {
    id: 'f3',
    nome: 'Corta Vento Retro Pastel',
    brecho: 'Closet Retrô Santana',
    preco: 'R$ 68,00',
    tamanho: 'Tam. M',
    categoria: 'Jaquetas',
    statusTag: '-15%',
    genero: 'feminino',
    imageUrl: '/images/windbreaker_jacket.png',
  },
  {
    id: 'f4',
    nome: 'Blazer Alfaiataria Verde Olive',
    brecho: 'Brechó Vintage',
    preco: 'R$ 110,00',
    tamanho: 'Tam. G',
    categoria: 'Casacos',
    statusTag: 'DISPONÍVEL',
    genero: 'feminino',
    imageUrl: '/images/olive_jacket.png',
  },
  {
    id: 'm1',
    nome: 'Corta Vento Retro 90s Streetwear',
    brecho: 'Relíquia Shop',
    preco: 'R$ 65,00',
    tamanho: 'Tam. M',
    categoria: 'Jaquetas',
    statusTag: '-20%',
    genero: 'masculino',
    imageUrl: '/images/windbreaker_jacket.png',
  },
  {
    id: 'm2',
    nome: 'Jaqueta Utility Verde Olive',
    brecho: 'Brechó X',
    preco: 'R$ 120,00',
    tamanho: 'Tam. G',
    categoria: 'Jaquetas',
    statusTag: 'DISPONÍVEL',
    genero: 'masculino',
    imageUrl: '/images/olive_jacket.png',
  },
  {
    id: 'm3',
    nome: 'Camisa Vintage Estampa Étnica',
    brecho: 'Brechó da Maria',
    preco: 'R$ 45,00',
    tamanho: 'Tam. M',
    categoria: 'Camisas',
    statusTag: 'DISPONÍVEL',
    genero: 'masculino',
    imageUrl: '/images/vintage_shirt.png',
  },
  {
    id: 'm4',
    nome: 'Jaqueta Jeans Trucker Vintage',
    brecho: 'Relíquia Shop',
    preco: 'R$ 95,00',
    tamanho: 'Tam. GG',
    categoria: 'Jaquetas',
    statusTag: 'DISPONÍVEL',
    genero: 'masculino',
    imageUrl: '/images/denim_jacket.png',
  },
]

export default function Brechos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const catParam = searchParams.get('cat')
  const viewParam = searchParams.get('view')
  const cityParam = searchParams.get('cidade') || 'Todas'
  const queryParam = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(queryParam)

  // Determine active view tab: 'feminino' | 'masculino' | 'todas' | 'lojas'
  const activeTab = catParam || (viewParam === 'lojas' ? 'lojas' : 'todas')

  const cities = ['Todas', 'Macapá', 'Santana']

  const handleTabChange = (tab: 'feminino' | 'masculino' | 'todas' | 'lojas') => {
    const newParams = new URLSearchParams(searchParams)
    if (tab === 'lojas') {
      newParams.delete('cat')
      newParams.set('view', 'lojas')
    } else {
      newParams.delete('view')
      newParams.set('cat', tab)
    }
    setSearchParams(newParams)
  }

  const handleCityChange = (city: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (city === 'Todas') {
      newParams.delete('cidade')
    } else {
      newParams.set('cidade', city)
    }
    setSearchParams(newParams)
  }

  // Filter brechós list
  const filteredBrechos = allBrechosList.filter((brecho) => {
    const matchesCity = cityParam === 'Todas' || brecho.cidade === cityParam
    const matchesSearch =
      brecho.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brecho.localizacao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (brecho.descricao && brecho.descricao.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCity && matchesSearch
  })

  // Filter peças catalog list
  const filteredPecas = allPecasCatalog.filter((peca) => {
    const matchesGender =
      activeTab === 'todas' || peca.genero === activeTab
    const matchesSearch =
      peca.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peca.brecho.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (peca.categoria && peca.categoria.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesGender && matchesSearch
  })

  const getTitle = () => {
    if (activeTab === 'feminino') return 'Peças Femininas'
    if (activeTab === 'masculino') return 'Peças Masculinas'
    if (activeTab === 'todas') return 'Todas as Peças Garimpadas'
    return 'Brechós Cadastrados'
  }

  return (
    <div className="brechos-page">
      <div className="brechos-top-nav">
        <h1 className="brechos-title-simple">{getTitle()}</h1>

        {/* SEARCH & FILTER BAR */}
        <div className="brechos-toolbar">
          <input
            type="search"
            placeholder={
              activeTab === 'lojas'
                ? 'Buscar brechó por nome ou localização...'
                : 'Buscar peças por nome, categoria ou loja...'
            }
            className="brechos-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {activeTab === 'lojas' && (
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
          )}
        </div>
      </div>

      {/* RENDER PRODUCTS OR BRECHÓS GRID BASED ON ACTIVE SWITCH */}
      {activeTab === 'lojas' ? (
        filteredBrechos.length > 0 ? (
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
        )
      ) : filteredPecas.length > 0 ? (
        <div className="grid-3-cols">
          {filteredPecas.map((peca) => (
            <CardPeca key={peca.id} {...peca} />
          ))}
        </div>
      ) : (
        <div className="empty-products-state">
          <p>Nenhuma peça encontrada para o filtro selecionado.</p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSearchQuery('')
              handleTabChange('todas')
            }}
          >
            Ver todas as peças
          </button>
        </div>
      )}
    </div>
  )
}
