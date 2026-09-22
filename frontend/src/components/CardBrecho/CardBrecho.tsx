type CardBrechoProps = {
  nome: string
  cidade: string
  itens: number
  destaque?: string
}

export default function CardBrecho({ nome, cidade, itens, destaque }: CardBrechoProps) {
  return (
    <article className="card card-brecho">
      <div className="card__body">
        <span className="card__tag">Brechó</span>
        <h3>{nome}</h3>
        <p>{cidade}</p>
        <p>{itens} itens disponíveis</p>
        {destaque && <p className="card__meta">{destaque}</p>}
      </div>
    </article>
  )
}
