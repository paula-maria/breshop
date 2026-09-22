export default function Login() {
  return (
    <section className="page">
      <h1>Login</h1>
      <p>Acesse sua conta para acompanhar suas compras e vendas.</p>
      <div className="page-card">
        <p>Email</p>
        <input type="email" placeholder="seu@email.com" />
        <p>Senha</p>
        <input type="password" placeholder="********" />
        <button className="page-button">Entrar</button>
      </div>
    </section>
  )
}
