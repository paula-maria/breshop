# 🔍 Mapeamento de Brechas e Problemas de Fluidez — Breshop

Atualizado após as correções recentes. Este documento lista apenas o que **ainda está pendente**; os itens já resolvidos estão no final.

---

## 🔴 CRÍTICO — Segurança

### 1. Upload sem validação de tipo de arquivo
**Arquivo:** [uploadMiddleware.ts](../backend/src/middlewares/uploadMiddleware.ts)

Qualquer tipo de arquivo pode ser enviado e não há limite de tamanho. Falta `fileFilter` (MIME) e `limits.fileSize`.

```diff
-export const uploadMiddleware = multer({ storage })
+export const uploadMiddleware = multer({
+  storage,
+  limits: { fileSize: 5 * 1024 * 1024 },
+  fileFilter: (req, file, cb) => {
+    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
+    if (allowed.includes(file.mimetype)) cb(null, true)
+    else cb(new Error('Apenas imagens são permitidas'))
+  }
+})
```

### 2. CORS permite qualquer origem
**Arquivo:** [app.ts](../backend/src/app.ts)

O `origin` aceita qualquer domínio e, com `credentials: true`, qualquer site pode fazer requisições autenticadas em nome do usuário. Restringir a `process.env.FRONTEND_URL`.

### 3. Socket.IO com CORS aberto (`origin: '*'`)
**Arquivo:** [socket.ts](../backend/src/config/socket.ts)

Mesmo problema do item anterior.

### 4. Rota `PUT /auth/me` não existe
**Arquivo:** [routes/index.ts](../backend/src/routes/index.ts)

Só existe `GET /auth/me`. O frontend chama `api.put('/auth/me', ...)` em [Profile.tsx](../frontend/src/pages/client/Profile/Profile.tsx), portanto a edição de perfil do cliente não funciona.

### 5. Campo `disponivel` fora da validação Zod
**Arquivo:** [PecaController.ts](../backend/src/controllers/PecaController.ts)

`req.body.disponivel` é copiado direto para `data` sem validação. Incluir o campo no schema Zod.

### 6. `JWT_SECRET` sem requisito de complexidade
**Arquivo:** [env.ts](../backend/src/config/env.ts)

`JWT_SECRET: z.string()` aceita qualquer valor. Exigir `.min(32)`.

---

## 🟠 ALTO — Bugs Funcionais

### 8. Favoritos salvos apenas no `localStorage`
O banco tem o modelo `Favorito` (User ↔ Peca), mas o frontend usa `localStorage`: os favoritos se perdem ao trocar de dispositivo e são compartilhados entre usuários do mesmo navegador. O carrinho segue o mesmo padrão, o que é aceitável por ora.

### 9. Link `/favoritos` vai para 404
O Header aponta para `/favoritos`, mas o [App.tsx](../frontend/src/App.tsx) só tem `/cliente/favoritos` (exige login de CLIENTE). Criar a rota pública ou ajustar o link.

### 11. Busca do Header não funciona
**Arquivo:** [Header.tsx](../frontend/src/components/Header/Header.tsx)

O input é apenas visual, sem `onSubmit` nem navegação para `/brechos?q=...`.

### 12. Logout não limpa a sessão se a chamada falhar
**Arquivo:** [AuthContext.tsx](../frontend/src/contexts/AuthContext.tsx)

Se `POST /auth/logout` falhar, o cookie `token` permanece e `checkAuth` restaura a sessão na próxima visita.

---

## 🟡 MÉDIO — Fluidez / UX

### 15. Profile do cliente: erro silenciado
**Arquivo:** [Profile.tsx](../frontend/src/pages/client/Profile/Profile.tsx)

O `catch` ignora a falha e redireciona como se tivesse salvo. Mostrar feedback de erro (depende do item #4).

---

## 🔵 BAIXO — Melhorias Recomendadas

### 22. Sem rate limiting no backend
Sem proteção contra força bruta no login, spam de cadastro ou abuso de upload.

### 23. Sem tratamento de token expirado
Falta um interceptor Axios para 401 que redirecione ao login.

### 25. Sem validação de senha forte
**Arquivo:** [AuthService.ts](../backend/src/services/AuthService.ts)

`password: z.string().min(6)` aceita `"aaaaaa"`.

---

## ✅ Resolvido

| # | Item |
|---|---|
| 7 | `GET /pecas/:id` criado; `PecaDetalhes` não busca mais todas as peças |
| 10 | Rota `/cart` e página de carrinho implementadas |
| 13 | Avaliações reais (`Avaliacao`), sem valores fixos |
| 16 | Cidades dinâmicas na listagem de brechós |
| 17 | Números fabricados removidos da Hero (agora usa totais reais) |
| 18 | DDI do WhatsApp padronizado (`utils/whatsapp.ts`) |
| 19 | Paginação em `GET /pecas` e `GET /brechos` |
| 20 | Edição carrega a descrição da peça |
| 21 | URL da API via `VITE_API_URL` |
| 24 | `GET /pecas/:id` retorna o WhatsApp do brechó |

## 📊 Resumo do que falta

| Prioridade | Qtd | Itens |
|---|---|---|
| 🔴 Crítico | 6 | #1, #2, #3, #4, #5, #6 |
| 🟠 Alto | 4 | #8, #9, #11, #12 |
| 🟡 Médio | 1 | #15 |
| 🔵 Baixo | 3 | #22, #23, #25 |

> [!IMPORTANT]
> Os itens **#1** (upload), **#2** (CORS) e **#4** (rota inexistente) devem ser corrigidos antes de qualquer deploy em produção.
