import { useParams } from 'react-router-dom'

export default function PecaDetalhes() {
  const { id } = useParams()

  return (
    <section className="page">
      <h1>Detalhes da Peça</h1>
      <div className="page-card">
        <p>ID da peça: {id}</p>
        <h2>Jaqueta de Couro</h2>
        <p>Categoria: Vestuário</p>
        <p>Preço: R$ 180,00</p>
        <p>Condição: Muito boa</p>
      </div>
    </section>
  )
}
