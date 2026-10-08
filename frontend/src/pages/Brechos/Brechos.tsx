import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import CardBrecho, { type CardBrechoProps } from '../../components/CardBrecho/CardBrecho'
import CardPeca, { type CardPecaProps } from '../../components/CardPeca/CardPeca'
import { api } from '../../services/api'

const PAGE_SIZE = 12
const TONES: ('teal' | 'navy' | 'cyan')[] = ['teal', 'navy', 'cyan']

type BrechoItem = CardBrechoProps & { tone?: 'teal' | 'navy' | 'cyan'; cidade: string }
type PecaItem = CardPecaProps & { genero?: string; categoria?: string }

export default function Brechos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const catParam = searchParams.get('cat')
  const viewParam = searchParams.get('view')
  const cityParam = searchParams.get('cidade') || 'Todas'
  const queryParam = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(queryParam)
  const [debouncedQuery, setDebouncedQuery] = useState(queryParam)

  const [brechos, setBrechos] = useState<BrechoItem[]>([])
  const [pecas, setPecas] = useState<PecaItem[]>([])
  const [cities, setCities] = useState<string[]>(['Todas'])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Determine active view tab: 'feminino' | 'masculino' | 'todas' | 'lojas'
  const activeTab = catParam || (viewParam === 'pecas' ? 'todas' : 'lojas')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    api.get('/brechos/cidades')
      .then((res) => setCities(['Todas', ...res.data]))
      .catch(() => {})
  }, [])

  // Filtros enviados ao backend; mudar qualquer um reinicia a listagem na página 1
  const categoria = searchParams.get('categoria') || ''
  const tipo = searchParams.get('tipo') || ''
  const tamanho = searchParams.get('tamanho') || ''
  const condicao = searchParams.get('condicao') || ''
  const disponivel = searchParams.get('disponivel') === 'true'
  const minPreco = searchParams.get('minPreco') || ''
  const maxPreco = searchParams.get('maxPreco') || ''
  const localizacao = searchParams.get('localizacao') || ''
  const brechoFiltro = searchParams.get('brecho') || ''

  const fetchPage = useCallback(async (pageToLoad: number) => {
    const base = { page: pageToLoad, limit: PAGE_SIZE, q: debouncedQuery || undefined }
    if (activeTab === 'lojas') {
      const res = await api.get('/brechos', {
        params: { ...base, cidade: cityParam === 'Todas' ? undefined : cityParam },
      })
      const mapped: BrechoItem[] = res.data.data.map((b: any, index: number) => ({
        id: b.id,
        nome: b.nome,
        localizacao: b.cidade ? `${b.bairro || ''}, ${b.cidade} - ${b.estado || ''}`.replace(/^, /, '') : 'Localização não informada',
        cidade: b.cidade || '',
        descricao: b.descricao || 'Sem descrição',
        tone: TONES[(index + (pageToLoad - 1) * PAGE_SIZE) % TONES.length],
      }))
      return { items: mapped, totalPages: res.data.meta.totalPages, isBrecho: true as const }
    }

    const res = await api.get('/pecas', {
      params: {
        ...base,
        categoria: categoria || undefined,
        tipo: tipo || undefined,
        tamanho: tamanho || undefined,
        condicao: condicao || undefined,
        disponivel: disponivel || undefined,
        minPreco: minPreco || undefined,
        maxPreco: maxPreco || undefined,
        localizacao: localizacao || undefined,
        brecho: brechoFiltro || undefined,
      },
    })
    const mapped: PecaItem[] = res.data.data.map((p: any) => ({
      id: p.id,
      nome: p.nome,
      brecho: p.brecho.nome,
      preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
      tamanho: `Tam. ${p.tamanho}`,
      categoria: p.categoria,
      condicao: p.condicao,
      statusTag: p.disponivel ? 'DISPONÍVEL' : 'VENDIDO',
      genero: 'todas', // backend doesnt have genero explicitly yet, but we have categoria
      imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0] : ''
    }))
    return { items: mapped, totalPages: res.data.meta.totalPages, isBrecho: false as const }
  }, [activeTab, cityParam, debouncedQuery, categoria, tipo, tamanho, condicao, disponivel, minPreco, maxPreco, localizacao, brechoFiltro])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPage(1)
      .then((r) => {
        if (cancelled) return
        if (r.isBrecho) setBrechos(r.items)
        else setPecas(r.items)
        setPage(1)
        setTotalPages(r.totalPages)
      })
      .catch((err) => console.error('Erro ao buscar dados', err))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [fetchPage])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    try {
      const r = await fetchPage(page + 1)
      if (r.isBrecho) setBrechos((prev) => [...prev, ...r.items])
      else setPecas((prev) => [...prev, ...r.items])
      setPage(page + 1)
      setTotalPages(r.totalPages)
    } catch (err) {
      console.error('Erro ao carregar mais', err)
    } finally {
      setLoadingMore(false)
    }
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
      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>Carregando catálogo oficial...</div>
      ) : activeTab === 'lojas' ? (
        brechos.length > 0 ? (
          <div className="grid-3-cols">
            {brechos.map((brecho) => (
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
      ) : pecas.length > 0 ? (
        <div className="grid-3-cols">
          {pecas.map((peca) => (
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

      {!loading && page < totalPages && (
        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          <button type="button" className="btn btn-ghost" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </div>
  )
}
