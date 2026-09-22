export default function Brechos() {
  const brechos = [
    { id: '1', nome: 'Brechó Vintage', cidade: 'São Paulo' },
    { id: '2', nome: 'Moda Retrô', cidade: 'Rio de Janeiro' },
    { id: '3', nome: 'Loop Closet', cidade: 'Belo Horizonte' },
  ]

  return (
    <section className="page">
      <h1>Brechós</h1>
      <div className="page-list">
        {brechos.map((brecho) => (
          <div key={brecho.id} className="page-card">
            <h3>{brecho.nome}</h3>
            <p>{brecho.cidade}</p>
            <a className="page-button secondary" href={`/brechos/${brecho.id}`}>
              Ver detalhes
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
