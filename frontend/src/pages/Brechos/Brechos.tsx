import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import CardBrecho, { type CardBrechoProps } from '../../components/CardBrecho/CardBrecho'
import CardPeca, { type CardPecaProps } from '../../components/CardPeca/CardPeca'
import { api } from '../../services/api'

export default function Brechos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const catParam = searchParams.get('cat')
  const viewParam = searchParams.get('view')
  const cityParam = searchParams.get('cidade') || 'Todas'
  const queryParam = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(queryParam)

  const [allBrechosList, setAllBrechosList] = useState<(CardBrechoProps & { tone?: 'teal' | 'navy' | 'cyan'; cidade: string })[]>([])
  const [allPecasCatalog, setAllPecasCatalog] = useState<(CardPecaProps & { genero?: string, categoria?: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [brechosRes, pecasRes] = await Promise.all([
          api.get('/brechos'),
          api.get('/pecas')
        ])

        const tones: ('teal' | 'navy' | 'cyan')[] = ['teal', 'navy', 'cyan']

        const mappedBrechos = brechosRes.data.map((b: any, index: number) => ({
          id: b.id,
          nome: b.nome,
          localizacao: b.cidade ? `${b.bairro || ''}, ${b.cidade} - ${b.estado || ''}`.replace(/^, /, '') : 'Localização não informada',
          cidade: b.cidade || '',
          descricao: b.descricao || 'Sem descrição',
          tone: tones[index % tones.length]
        }))

        const mappedPecas = pecasRes.data.map((p: any) => ({
          id: p.id,
          nome: p.nome,
          brecho: p.brecho.nome,
          preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
          tamanho: `Tam. ${p.tamanho}`,
          categoria: p.categoria,
          statusTag: p.disponivel ? 'DISPONÍVEL' : 'VENDIDO',
          genero: 'todas', // backend doesnt have genero explicitly yet, but we have categoria
          imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0] : '/images/vintage_shirt.png'
        }))

        setAllBrechosList(mappedBrechos)
        setAllPecasCatalog(mappedPecas)
      } catch (err) {
        console.error('Erro ao buscar dados', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Determine active view tab: 'feminino' | 'masculino' | 'todas' | 'lojas'
  const activeTab = catParam || (viewParam === 'pecas' ? 'todas' : 'lojas')

  const cities = ['Todas', 'Macapá', 'Santana', 'Laranjal do Jari']

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
    const matchesCity = cityParam === 'Todas' || (brecho.cidade && brecho.cidade.toLowerCase() === cityParam.toLowerCase())
    const matchesSearch =
      brecho.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brecho.localizacao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (brecho.descricao && brecho.descricao.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCity && matchesSearch
  })

  // Leitura dos filtros avançados da URL
  const searchCatParams = searchParams.get('categoria') ? searchParams.get('categoria')!.split(',') : []
  const searchTipoParams = searchParams.get('tipo') ? searchParams.get('tipo')!.split(',') : []
  const searchTamanhoParams = searchParams.get('tamanho') ? searchParams.get('tamanho')!.split(',') : []
  const searchCondicaoParams = searchParams.get('condicao') ? searchParams.get('condicao')!.split(',') : []
  const disponivelFilter = searchParams.get('disponivel') === 'true'

  // Filter peças catalog list
  const filteredPecas = allPecasCatalog.filter((peca) => {
    // Para simplificar no MVP, ignoramos 'feminino' e 'masculino' estritos se o banco não tem gênero definido,
    // a menos que queiramos forçar categorias a gêneros. No momento 'todas' inclui tudo.
    const matchesSearch =
      peca.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peca.brecho.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (peca.categoria && peca.categoria.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesAvail = !disponivelFilter || peca.statusTag === 'DISPONÍVEL'
    
    // Filtros complexos (sidebar)
    const matchesCat = searchCatParams.length === 0 || (peca.categoria && searchCatParams.includes(peca.categoria))
    const matchesTipo = searchTipoParams.length === 0 || true // tipo n existe no bd de forma estrita além da categoria
    const matchesTamanho = searchTamanhoParams.length === 0 || (peca.tamanho && searchTamanhoParams.some(t => peca.tamanho.includes(t)))

    return matchesSearch && matchesAvail && matchesCat && matchesTipo && matchesTamanho
  })

  const getTitle = () => {
    if (activeTab === 'feminino') return 'Peças Femininas'
    if (activeTab === 'masculino') return 'Peças Masculinas'
    if (activeTab === 'todas') return 'Todas as Peças Garimpadas'
    return 'Brechós Cadastrados'
  }

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center' }}>Carregando catálogo oficial...</div>
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
          <p>Nenhuma peça encontrada para os filtros selecionados.</p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSearchQuery('')
              setSearchParams(new URLSearchParams())
            }}
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  )
}
