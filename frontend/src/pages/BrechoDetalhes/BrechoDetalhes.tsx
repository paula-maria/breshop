import { useParams } from 'react-router-dom'

export default function BrechoDetalhes() {
  const { id } = useParams()

  return (
    <section className="page">
      <h1>Detalhes do Brechó</h1>
      <div className="page-card">
        <p>ID do brechó: {id}</p>
        <h2>Brechó Vintage</h2>
        <p>Localizado em São Paulo, com foco em peças raras e premium.</p>
        <p>Itens disponíveis: 48</p>
      </div>
    </section>
  )
}
