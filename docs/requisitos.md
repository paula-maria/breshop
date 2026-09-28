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

### RF26 — Criação de pedido
O sistema deve permitir que o comprador inicie um pedido de compra a partir de uma peça disponível, registrando a peça, o comprador, o brechó e o valor da compra.
**Ator:** Comprador
**Prioridade:** Essencial

---

### RF27 — Seleção da forma de pagamento
O sistema deve permitir que o comprador selecione uma forma de pagamento disponível para concluir o pedido.
**Ator:** Comprador
**Prioridade:** Essencial

---

### RF28 — Processamento do pagamento
O sistema deve permitir o processamento do pagamento por meio de um serviço de pagamento integrado à plataforma.
**Ator:** Comprador e Sistema
**Prioridade:** Essencial

---

### RF29 — Status do pagamento
O sistema deve permitir o acompanhamento do status do pagamento, identificando situações como pendente, aprovado, recusado, cancelado ou reembolsado.
**Ator:** Comprador e Proprietário do brechó
**Prioridade:** Essencial

---

### RF30 — Confirmação do pagamento
O sistema deve registrar a confirmação do pagamento e atualizar o pedido após a aprovação da transação.
**Ator:** Sistema
**Prioridade:** Essencial

---

### RF31 — Histórico de pagamentos
O sistema deve permitir que o comprador consulte o histórico de pagamentos e os respectivos pedidos.
**Ator:** Comprador
**Prioridade:** Desejável

---

### RF32 — Gerenciamento de pedidos
O sistema deve permitir que o proprietário visualize os pedidos realizados para suas peças e acompanhe o status dos pagamentos.
**Ator:** Proprietário do brechó
**Prioridade:** Essencial

---

### RF33 — Atualização da disponibilidade após pagamento
O sistema deve atualizar a disponibilidade da peça após a confirmação do pagamento, impedindo que a mesma peça seja vendida novamente.
**Ator:** Sistema
**Prioridade:** Essencial

---

## 2. Requisitos Não Funcionais

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

---

### RNF06 — Segurança das transações
O sistema deve utilizar mecanismos seguros para comunicação e processamento das informações relacionadas aos pagamentos, evitando o armazenamento indevido de dados sensíveis.
**Ator:** Sistema
**Prioridade:** Essencial

---

### RNF07 — Integração com serviço de pagamento
O sistema deve permitir a integração com um serviço externo de processamento de pagamentos por meio de uma API segura.
**Ator:** Sistema
**Prioridade:** Essencial

---

## 3. Priorização dos Requisitos
Os requisitos foram classificados de acordo com sua importância para a primeira versão da plataforma.

### 3.1 Requisitos Essenciais — MVP
Os requisitos essenciais constituem o núcleo funcional do sistema e devem estar presentes na primeira versão do produto. São eles:

- RF01 — Cadastro de comprador
- RF02 — Cadastro de proprietário
- RF03 — Autenticação
- RF05 — Cadastro de brechó
- RF06 — Perfil público do brechó
- RF07 — Cadastro de peças
- RF08 — Informações das peças
- RF09 — Status da peça
- RF10 — Busca de peças
- RF12 — Listagem de brechós
- RF13 — Catálogo do brechó
- RF15 — Detalhes da peça
- RF16 — Identificação do brechó
- RF18 — Conversas
- RF19 — Mensagens
- RF20 — Histórico de conversas
- RF23 — Painel do brechó
- RF24 — Atualização de disponibilidade
- RF26 — Criação de pedido
- RF27 — Seleção da forma de pagamento
- RF28 — Processamento do pagamento
- RF29 — Status do pagamento
- RF30 — Confirmação do pagamento
- RF32 — Gerenciamento de pedidos
- RF33 — Atualização da disponibilidade após pagamento
- RNF01 — Responsividade
- RNF02 — Segurança das credenciais
- RNF03 — Upload de imagens
- RNF05 — Persistência do histórico
- RNF06 — Segurança das transações
- RNF07 — Integração com serviço de pagamento

### 3.2 Requisitos Desejáveis
Os requisitos desejáveis representam funcionalidades que podem ser incorporadas após a implementação do núcleo do sistema:

- RF04 — Gerenciamento de perfil
- RF11 — Filtros de busca
- RF17 — Contato e chat pela página da peça
- RF21 — Proposta de preço
- RF22 — Contraproposta
- RF25 — Gerenciamento de conversas e propostas
- RF31 — Histórico de pagamentos
- RNF04 — Tempo de resposta

### 3.3 Requisitos Futuros
Como funcionalidade futura, está prevista:

- RF14 — Visualização dos brechós em mapa

## 4. Rastreabilidade
A rastreabilidade estabelece a relação entre os requisitos funcionais e as User Stories definidas para o projeto. Essa relação permite acompanhar a implementação das funcionalidades desde sua especificação até o desenvolvimento.
A correspondência estabelecida é:

- US01 → RF01 — Cadastro de comprador
- US02 → RF02 — Cadastro de proprietário
- US03 → RF03 — Autenticação
- US04 → RF04 — Gerenciamento de perfil
- US05 → RF05 — Cadastro de brechó
- US06 → RF06 — Perfil público do brechó
- US07 → RF07 — Cadastro de peças
- US08 → RF08 — Informações da peça
- US09 → RF09 — Status da peça
- US10 → RF10 — Busca de peças
- US11 → RF11 — Filtros de busca
- US12 → RF12 — Listagem de brechós
- US13 → RF13 — Catálogo do brechó
- US14 → RF14 — Mapa de brechós
- US15 → RF15 — Detalhes da peça
- US16 → RF16 — Identificação do brechó
- US17 → RF17 — Contato e chat
- US18 → RF18 — Conversas
- US19 → RF19 — Envio e recebimento de mensagens
- US20 → RF20 — Histórico de conversas
- US21 → RF21 — Proposta de preço
- US22 → RF22 — Gestão de propostas
- US23 → RF23 — Painel de gerenciamento
- US24 → RF24 — Atualização de disponibilidade
- US25 → RF25 — Gerenciamento de conversas e propostas
- US26 → RF26 — Criação de pedido
- US27 → RF27 — Seleção da forma de pagamento
- US28 → RF28 — Processamento do pagamento
- US29 → RF29 — Status de pagamento
- US30 → RF30 — Confirmação do pagamento
- US31 → RF31 — Histórico de pagamentos
- US32 → RF32 — Gerenciamento de pedidos
- US33 → RF33 — Atualização da disponibilidade após pagamento

## 5. Escopo do MVP
O MVP da plataforma será composto pelos requisitos classificados como essenciais. O escopo inicial contempla o cadastro e autenticação de usuários, cadastro e gerenciamento de brechós, cadastro e gerenciamento de peças, busca de produtos, visualização de catálogos, detalhamento das peças, comunicação entre compradores e proprietários, histórico de conversas e painel de gerenciamento.

Também fazem parte do MVP os requisitos relacionados à responsividade da aplicação, segurança das credenciais, upload de imagens, persistência das informações, segurança das transações e integração com serviço de pagamento.

As funcionalidades classificadas como desejáveis poderão ser implementadas em versões posteriores, conforme a evolução do projeto e a priorização do backlog. A visualização dos brechós em mapa será tratada como uma funcionalidade futura.
