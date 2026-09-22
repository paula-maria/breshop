export default function Cadastro() {
  return (
    <section className="page">
      <h1>Cadastro</h1>
      <p>Crie sua conta para começar a comprar e vender no BreShop.</p>
      <div className="page-card">
        <p>Nome</p>
        <input type="text" placeholder="Seu nome" />
        <p>Email</p>
        <input type="email" placeholder="seu@email.com" />
        <p>Senha</p>
        <input type="password" placeholder="********" />
        <button className="page-button">Cadastrar</button>
      </div>
    </section>
  )
}
