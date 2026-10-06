# 🔍 Mapeamento de Brechas e Problemas de Fluidez — Breshop

Análise completa do backend e frontend do sistema.

---

## 🔴 CRÍTICO — Segurança

### 1. Upload sem validação de tipo de arquivo
**Arquivo:** [uploadMiddleware.ts](file:///home/paula/Downloads/breshop/backend/src/middlewares/uploadMiddleware.ts)

Qualquer tipo de arquivo pode ser enviado (`.exe`, `.php`, `.sh`, scripts maliciosos). Não há filtro de extensão nem verificação de MIME type.

```diff
 const storage = multer.diskStorage({ ... })
-export const uploadMiddleware = multer({ storage })
+export const uploadMiddleware = multer({
+  storage,
+  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máx
+  fileFilter: (req, file, cb) => {
+    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
+    if (allowed.includes(file.mimetype)) cb(null, true)
+    else cb(new Error('Apenas imagens são permitidas'))
+  }
+})
```

### 2. CORS permite qualquer origem
**Arquivo:** [app.ts](file:///home/paula/Downloads/breshop/backend/src/app.ts#L12-L17)

O `origin: function(origin, callback) { callback(null, true) }` aceita requisições de **qualquer domínio**. Combinado com `credentials: true`, isso significa que qualquer site pode fazer requisições autenticadas no nome do usuário.

```diff
 app.use(cors({
-  origin: function (origin, callback) {
-    callback(null, true);
-  },
+  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
   credentials: true,
 }))
```

### 3. Socket.IO CORS aberto (`origin: '*'`)
**Arquivo:** [socket.ts](file:///home/paula/Downloads/breshop/backend/src/config/socket.ts#L8-L11)

Mesmo problema do item anterior, mas no Socket.IO.

### 4. Rota PUT `/auth/me` não existe no backend
**Arquivo:** [routes/index.ts](file:///home/paula/Downloads/breshop/backend/src/routes/index.ts)

O frontend chama `api.put('/auth/me', { name, phone })` em [Profile.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/client/Profile/Profile.tsx#L18), mas essa rota **não existe** no backend. A edição de perfil do cliente simplesmente não funciona — o erro é silenciado pelo `catch` vazio.

### 5. Campo `disponivel` bypassando validação Zod
**Arquivo:** [PecaController.ts](file:///home/paula/Downloads/breshop/backend/src/controllers/PecaController.ts#L92-L95)

```ts
if (req.body.disponivel !== undefined) {
  data.disponivel = req.body.disponivel
}
```

Qualquer campo não validado poderia ser injetado no `data` dessa forma. O `data as any` na linha 99 remove toda segurança de tipo.

### 6. JWT_SECRET sem requisito de complexidade
**Arquivo:** [env.ts](file:///home/paula/Downloads/breshop/backend/src/config/env.ts#L9)

`JWT_SECRET: z.string()` aceita qualquer string, até `"a"`. Deveria exigir mínimo de caracteres:
```diff
-JWT_SECRET: z.string(),
+JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
```

---

## 🟠 ALTO — Bugs Funcionais

### 7. PecaDetalhes busca TODAS as peças para encontrar uma
**Arquivo:** [PecaDetalhes.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/PecaDetalhes/PecaDetalhes.tsx#L33-L35)

```ts
const { data } = await api.get(`/pecas`)
const item = data.find((p: any) => p.id === id)
```

Busca **todas** as peças do banco inteiro e filtra no frontend. Além de lento, não escala. Falta a rota `GET /pecas/:id` no backend.

### 8. Favoritos salvos apenas no localStorage
**Arquivo:** [Favorites.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/client/Favorites/Favorites.tsx#L11)

O banco tem modelo `Favorito` com relação User ↔ Peca, mas o frontend usa `localStorage`. Isso significa:
- Favoritos se perdem ao trocar de navegador/dispositivo
- Favoritos não são vinculados ao usuário logado
- Dois usuários no mesmo navegador compartilham favoritos

### 9. Link para `/favoritos` vai para 404
**Arquivo:** [Header.tsx](file:///home/paula/Downloads/breshop/frontend/src/components/Header/Header.tsx#L135)

O Header tem um link para `/favoritos`, mas essa rota não existe em [App.tsx](file:///home/paula/Downloads/breshop/frontend/src/App.tsx). A rota real é `/cliente/favoritos` (que requer login como CLIENTE).

### 10. Link para `/cart` vai para 404
**Arquivo:** [Header.tsx](file:///home/paula/Downloads/breshop/frontend/src/components/Header/Header.tsx#L166)

O ícone de carrinho aponta para `/cart`, mas essa rota não existe no app. Carrinho não é implementado.

### 11. SearchBar do Header não funciona
**Arquivo:** [Header.tsx](file:///home/paula/Downloads/breshop/frontend/src/components/Header/Header.tsx#L128-L133)

O input de busca no header é puramente visual — sem `onSubmit`, sem `onChange` conectado a navegação. Digitar algo e apertar Enter não faz nada.

### 12. Logout não limpa o cookie no lado do cliente
**Arquivo:** [AuthContext.tsx](file:///home/paula/Downloads/breshop/frontend/src/contexts/AuthContext.tsx#L46-L55)

Se a chamada `api.post('/auth/logout')` falhar (backend fora do ar), o cookie `token` persiste no navegador mas o `user` é zerado. Na próxima visita, `checkAuth` vai restaurar a sessão do cookie antigo.

### 13. Dados de avaliação são hardcoded
**Arquivo:** [BrechoDetalhes.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/BrechoDetalhes/BrechoDetalhes.tsx#L36-L37)

```ts
rating: '5,0',
reviewsCount: 1,
```
Todo brechó mostra "5,0 ★ (1 avaliação)" mesmo sem avaliações. Existe o model `Avaliacao` no Prisma mas não é usado.

---

## 🟡 MÉDIO — Problemas de Fluidez / UX

### 14. Cadastro de brechó: proprietário recém-cadastrado não vai para o onboarding
**Arquivo:** [Cadastro.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/Cadastro/Cadastro.tsx#L50-L57)

Após a correção anterior, o proprietário vai direto para `/painel`. Mas o `/painel` detecta que não há loja e redireciona para `/onboarding-brecho` (linha 85 do Painel.tsx). Isso gera um **duplo redirecionamento** desnecessário (Cadastro → Painel → Onboarding).

> [!TIP]
> Redirecionar direto para `/onboarding-brecho` quando `accountType === 'brecho'` no cadastro é o caminho mais fluido.

### 15. Profile do cliente: erro silenciado, sem feedback de falha
**Arquivo:** [Profile.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/client/Profile/Profile.tsx#L21-L25)

Se o `PUT /auth/me` falha (e vai falhar, pois a rota não existe — item #4), o `catch` ignora e o `setTimeout` redireciona como se tivesse dado certo.

### 16. Cidades hardcoded na listagem de brechós
**Arquivo:** [Brechos.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/Brechos/Brechos.tsx#L65)

```ts
const cities = ['Todas', 'Macapá', 'Santana', 'Laranjal do Jari']
```
Se um brechó de outra cidade se cadastrar, não aparecerá nos filtros de cidade. As cidades deveriam ser extraídas dinamicamente dos dados.

### 17. Números sociais fabricados na Hero
**Arquivo:** [Home.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/Home/Home.tsx#L101-L108)

"1200+ clientes satisfeitos" com avatares estáticos de cores sólidas. Isso pode gerar desconfiança se o sistema tiver poucos usuários.

### 18. WhatsApp sem código de país consistente
**Arquivo:** [BrechoDetalhes.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/BrechoDetalhes/BrechoDetalhes.tsx#L95-L99) vs [PecaDetalhes.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/PecaDetalhes/PecaDetalhes.tsx#L70)

- `BrechoDetalhes`: adiciona `55` ao número → `wa.me/55${wppNumber}`
- `PecaDetalhes`: NÃO adiciona → `wa.me/${peca.brechoWhatsapp}`

Se o número salvo no banco não tiver `55`, o link do `PecaDetalhes` vai gerar um WhatsApp inválido.

### 19. Sem paginação em nenhuma listagem
Todas as rotas (`GET /pecas`, `GET /brechos`) retornam **todos** os registros. Com 1000+ peças, a performance vai degradar significativamente.

### 20. `Painel.tsx` — Edição perde a descrição original da peça
**Arquivo:** [Painel.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/Painel/Painel.tsx#L210)

```ts
descricao: '',  // sempre vazio ao editar
```
Ao abrir o modal de edição, a descrição é sempre resetada para `''` em vez de carregar o valor atual.

---

## 🔵 BAIXO — Melhorias Recomendadas

### 21. API base URL hardcoded
**Arquivo:** [api.ts](file:///home/paula/Downloads/breshop/frontend/src/services/api.ts#L4)

`baseURL: 'http://localhost:3333/api'` deveria usar variável de ambiente para deploy.

### 22. Sem rate limiting no backend
Não há proteção contra brute force no login, spam de cadastro ou abuso de upload.

### 23. Sem tratamento de token expirado no frontend
Quando o JWT expira (7 dias), o usuário vê erros genéricos em vez de ser redirecionado ao login. Falta um interceptor Axios para 401.

### 24. Brecho: `GET /brechos/:id` não retorna dados de WhatsApp
**Arquivo:** [PecaDetalhes.tsx](file:///home/paula/Downloads/breshop/frontend/src/pages/PecaDetalhes/PecaDetalhes.tsx#L51)

O `brecho` que vem via `include` na rota `GET /pecas` só seleciona `{ nome, cidade, estado }` ([PecaController.ts:60](file:///home/paula/Downloads/breshop/backend/src/controllers/PecaController.ts#L59-L61)). Então `brechoWhatsapp` é sempre `''`, e o botão "Entrar em contato" abre um link WhatsApp quebrado.

### 25. Sem validação de senha forte no cadastro
**Arquivo:** [AuthService.ts](file:///home/paula/Downloads/breshop/backend/src/services/AuthService.ts#L10)

`password: z.string().min(6)` — aceita `"aaaaaa"`. Sem exigência de número, maiúscula ou caractere especial.

---

## 📊 Resumo por Prioridade

| Prioridade | Qtd | Itens |
|---|---|---|
| 🔴 Crítico | 6 | Upload sem filtro, CORS aberto, rota inexistente, Zod bypass, JWT fraco, Socket CORS |
| 🟠 Alto | 7 | Busca ineficiente, favoritos localStorage, rotas 404, search inoperante, logout, avaliações fake |
| 🟡 Médio | 7 | Redirecionamento duplo, erros silenciados, cidades hardcoded, WhatsApp inconsistente, sem paginação |
| 🔵 Baixo | 5 | URL hardcoded, rate limiting, token expirado, select incompleto, senha fraca |

> [!IMPORTANT]
> Os itens **#1** (upload), **#2** (CORS), **#4** (rota inexistente) e **#7** (busca ineficiente) devem ser corrigidos antes de qualquer deploy em produção.
