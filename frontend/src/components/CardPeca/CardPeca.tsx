type CardPecaProps = {
  nome: string
  preco: string
  categoria: string
  condicao: string
  imageUrl?: string
}

export default function CardPeca({
  nome,
  preco,
  categoria,
  condicao,
  imageUrl,
}: CardPecaProps) {
  return (
    <article className="card card-peca">
      <div className="card-peca__image" aria-label={nome}>
        {imageUrl ? <img src={imageUrl} alt={nome} /> : <span>Peça</span>}
      </div>

      <div className="card__body">
        <span className="card__tag">{categoria}</span>
        <h3>{nome}</h3>
        <p className="card__price">{preco}</p>
        <p className="card__meta">Condição: {condicao}</p>
      </div>
    </article>
  )
}
