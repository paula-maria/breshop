# Especificação de Requisitos

## 1. Requisitos Funcionais

### RF01 — Cadastro de comprador

O sistema deve permitir o cadastro de usuários do tipo comprador, possibilitando a criação de uma conta para utilização da plataforma.

**Ator:** Comprador
**Prioridade:** Essencial

---

### RF02 — Cadastro de proprietário

O sistema deve permitir o cadastro de usuários do tipo proprietário de brechó, possibilitando o gerenciamento do estabelecimento e de suas peças.

**Ator:** Proprietário do brechó
**Prioridade:** Essencial

---

### RF03 — Autenticação

O sistema deve permitir que usuários cadastrados realizem login para acessar as funcionalidades correspondentes ao seu perfil.

**Ator:** Comprador e Proprietário do brechó
**Prioridade:** Essencial

---

### RF04 — Gerenciamento de perfil

O sistema deve permitir que o usuário visualize e edite seus dados pessoais.

**Ator:** Comprador e Proprietário do brechó
**Prioridade:** Desejável

---

### RF05 — Cadastro de brechó

O sistema deve permitir que o proprietário cadastre seu brechó, informando nome, descrição, endereço, localização e contatos.

**Ator:** Proprietário do brechó
**Prioridade:** Essencial

---

### RF06 — Perfil público do brechó

O sistema deve disponibilizar um perfil público para cada brechó cadastrado, permitindo a consulta de suas informações.

**Ator:** Comprador
**Prioridade:** Essencial

---

### RF07 — Cadastro de peças

O sistema deve permitir que o proprietário cadastre roupas, calçados e acessórios vinculados ao seu brechó.

**Ator:** Proprietário do brechó
**Prioridade:** Essencial

---

### RF08 — Informações da peça

O sistema deve permitir que o proprietário informe fotos, preço, tamanho, categoria, condição e descrição para cada peça cadastrada.

**Ator:** Proprietário do brechó
**Prioridade:** Essencial

---

### RF09 — Status da peça

O sistema deve permitir que o proprietário atualize o status de uma peça entre disponível e vendido.

**Ator:** Proprietário do brechó
**Prioridade:** Essencial

---

### RF10 — Busca de peças

O sistema deve permitir que o comprador pesquise peças utilizando nome ou palavra-chave.

**Ator:** Comprador
**Prioridade:** Essencial

---

### RF11 — Filtros de busca

O sistema deve permitir que o comprador filtre peças por categoria, tamanho, preço, condição e localização.

**Ator:** Comprador
**Prioridade:** Desejável

---

### RF12 — Listagem de brechós

O sistema deve disponibilizar uma listagem dos brechós cadastrados para exploração pelos compradores.

**Ator:** Comprador
**Prioridade:** Essencial

---

### RF13 — Catálogo do brechó

O sistema deve permitir que o comprador visualize as peças disponíveis de um determinado brechó.

**Ator:** Comprador
**Prioridade:** Essencial

---

### RF14 — Visualização dos brechós em mapa

O sistema deverá permitir futuramente a visualização dos brechós cadastrados em um mapa.

**Ator:** Comprador
**Prioridade:** Futuro

---

### RF15 — Detalhes da peça

O sistema deve disponibilizar uma página contendo fotos e informações completas da peça selecionada.

**Ator:** Comprador
**Prioridade:** Essencial

---

### RF16 — Identificação do brechó

O sistema deve identificar o brechó responsável pela peça na página de detalhes.

**Ator:** Comprador
**Prioridade:** Essencial

---

### RF17 — Contato ou chat pela peça

O sistema deve permitir que o comprador acesse os contatos do brechó ou inicie uma conversa diretamente pela página da peça.

**Ator:** Comprador
**Prioridade:** Desejável

---

### RF18 — Conversas entre comprador e brechó

O sistema deve permitir a criação de conversas entre compradores e proprietários relacionadas a uma determinada peça.

**Ator:** Comprador e Proprietário do brechó
**Prioridade:** Essencial

---

### RF19 — Envio e recebimento de mensagens

O sistema deve permitir que compradores e proprietários enviem e recebam mensagens durante uma conversa.

**Ator:** Comprador e Proprietário do brechó
**Prioridade:** Essencial

---

### RF20 — Histórico de conversas

O sistema deve permitir que os usuários consultem o histórico das conversas realizadas anteriormente.

**Ator:** Comprador e Proprietário do brechó
**Prioridade:** Essencial

---

### RF21 — Proposta de preço

O sistema deve permitir que o comprador envie uma proposta de preço para uma peça disponível.

**Ator:** Comprador
**Prioridade:** Desejável

---

### RF22 — Gestão de propostas

O sistema deve permitir que o proprietário aceite, recuse ou envie uma contraproposta para uma proposta recebida.

**Ator:** Proprietário do brechó
**Prioridade:** Desejável

---

### RF23 — Painel de gerenciamento

O sistema deve fornecer um painel para que o proprietário gerencie as peças cadastradas em seu brechó.

**Ator:** Proprietário do brechó
**Prioridade:** Essencial

---

### RF24 — Atualização de disponibilidade

O sistema deve permitir que o proprietário atualize a disponibilidade das peças por meio do painel.

**Ator:** Proprietário do brechó
**Prioridade:** Essencial

---

### RF25 — Gerenciamento de conversas e propostas

O sistema deve permitir que o proprietário visualize e gerencie suas conversas e propostas por meio do painel.

**Ator:** Proprietário do brechó
**Prioridade:** Desejável

---

# 2. Requisitos Não Funcionais

### RNF01 — Responsividade

O sistema deve apresentar uma interface responsiva, permitindo sua utilização em dispositivos desktop e mobile.

**Ator:** Comprador e Proprietário do brechó
**Prioridade:** Essencial

---

### RNF02 — Segurança das credenciais

O sistema deve garantir a segurança das credenciais dos usuários, utilizando mecanismos adequados para o armazenamento seguro das senhas.

**Ator:** Sistema
**Prioridade:** Essencial

---

### RNF03 — Upload e armazenamento de imagens

O sistema deve permitir o upload e armazenamento de imagens associadas às peças cadastradas.

**Ator:** Proprietário do brechó e Sistema
**Prioridade:** Essencial

---

### RNF04 — Tempo de resposta

O sistema deve apresentar tempo de resposta adequado para operações de busca e filtragem, preferencialmente inferior a dois segundos em condições normais de uso.

**Ator:** Sistema
**Prioridade:** Desejável

---

### RNF05 — Persistência do histórico

O sistema deve garantir a persistência e o armazenamento confiável do histórico das conversas no banco de dados.

**Ator:** Sistema
**Prioridade:** Essencial
