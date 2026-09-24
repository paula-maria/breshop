# Plataforma de Brechós

## Sobre o Projeto

A Plataforma de Brechós é uma aplicação web desenvolvida para conectar compradores a brechós, permitindo a divulgação de peças disponíveis para venda e facilitando a descoberta, comunicação e negociação entre compradores e proprietários.

A plataforma centraliza os catálogos dos brechós em um único ambiente, permitindo que compradores encontrem peças, visualizem suas informações, conheçam o brechó responsável e entrem em contato para tirar dúvidas ou negociar.

Para os proprietários, o sistema oferece ferramentas para cadastrar o brechó, gerenciar peças, controlar sua disponibilidade e interagir com compradores por meio de conversas e propostas.

---

## Problema

Pequenos brechós podem utilizar diferentes canais para divulgar seus produtos, como redes sociais e aplicativos de mensagens. Essa fragmentação pode dificultar a organização do catálogo, a atualização da disponibilidade das peças e o contato com potenciais compradores.

Para os compradores, a ausência de uma plataforma centralizada pode tornar mais difícil encontrar peças específicas, comparar diferentes brechós e obter informações sobre os produtos disponíveis.

Diante desse cenário, o projeto propõe uma plataforma que reúna brechós e seus catálogos em um único sistema, facilitando a descoberta de peças e a comunicação entre compradores e proprietários.

---

## Objetivo

Desenvolver uma plataforma web que permita:

* Centralizar brechós e seus catálogos;
* Facilitar a busca e descoberta de peças;
* Permitir que proprietários gerenciem seus brechós e produtos;
* Facilitar a comunicação entre compradores e proprietários;
* Permitir negociações de preço;
* Manter o histórico das conversas;
* Fornecer uma experiência responsiva em diferentes dispositivos.

---

## Público-alvo

### Compradores

Usuários interessados em encontrar e adquirir roupas, calçados e acessórios disponíveis em brechós.

A plataforma permite que compradores:

* Criem uma conta;
* Pesquisem peças;
* Utilizem filtros;
* Conheçam diferentes brechós;
* Visualizem detalhes das peças;
* Entrem em contato com proprietários;
* Enviem propostas de preço;
* Acompanhem suas conversas.

### Proprietários de Brechós

Responsáveis por cadastrar e administrar seus estabelecimentos e respectivos catálogos.

A plataforma permite que proprietários:

* Cadastrem seus brechós;
* Criem e gerenciem peças;
* Adicionem fotos e informações dos produtos;
* Atualizem a disponibilidade;
* Conversem com compradores;
* Recebam propostas;
* Aceitem, recusem ou façam contrapropostas.

---

## Principais Funcionalidades

### Contas e Autenticação

* Cadastro de compradores;
* Cadastro de proprietários;
* Login;
* Gerenciamento de perfil.

### Gestão de Brechós

* Cadastro do brechó;
* Perfil público;
* Informações de contato;
* Listagem de brechós;
* Catálogo de peças por brechó.

### Gestão de Peças

* Cadastro de roupas, calçados e acessórios;
* Upload de fotos;
* Cadastro de preço;
* Cadastro de tamanho;
* Cadastro de categoria;
* Cadastro de condição;
* Descrição da peça;
* Controle de disponibilidade.

### Busca e Descoberta

* Busca por nome ou palavra-chave;
* Filtros por categoria;
* Filtros por tamanho;
* Filtros por preço;
* Filtros por condição;
* Filtros por localização;
* Visualização de detalhes da peça.

### Comunicação e Negociação

* Chat entre comprador e proprietário;
* Conversas relacionadas a peças;
* Envio e recebimento de mensagens;
* Histórico de conversas;
* Envio de propostas;
* Contrapropostas;
* Aceite ou recusa de propostas.

### Painel do Brechó

* Gerenciamento de peças;
* Atualização de disponibilidade;
* Gerenciamento de conversas;
* Gerenciamento de propostas.

---

## Stack Tecnológica

### Frontend

* **React 19**
* **TypeScript**
* **Vite** (Build Tool & Dev Server)
* **React Router DOM v7** (Roteamento e navegação)
* **HTML5 & Vanilla CSS3** (Design System responsivo, glassmorphism e paleta HSL/Tailored)

### Backend

* **Node.js**
* **Express** (ou NestJS) / **TypeScript**

### Banco de Dados

* **PostgreSQL**

### Comunicação com a API

* **REST API**
* **JSON**

### Ferramentas & Controle de Versão

* Git
* GitHub

### Desenvolvimento e Infraestrutura

* Docker
* Docker Compose

A stack pode ser ajustada durante o desenvolvimento de acordo com as necessidades identificadas no projeto.


---

## Requisitos Técnicos

O sistema deverá possuir:

* Interface responsiva para desktop e dispositivos móveis;
* Autenticação segura;
* Armazenamento seguro de senhas;
* Upload e armazenamento de imagens;
* Persistência dos dados em banco de dados;
* Persistência do histórico de conversas;
* Busca e filtros com tempo de resposta adequado.

---

## MVP

A primeira versão do sistema terá como foco as funcionalidades essenciais:

1. Cadastro de compradores;
2. Cadastro de proprietários;
3. Login;
4. Cadastro de brechós;
5. Perfil público dos brechós;
6. Cadastro e gerenciamento de peças;
7. Upload de imagens;
8. Controle de disponibilidade;
9. Busca de peças;
10. Listagem de brechós;
11. Catálogo dos brechós;
12. Página de detalhes das peças;
13. Chat entre compradores e proprietários;
14. Histórico de conversas;
15. Painel de gerenciamento do brechó.

Funcionalidades de filtros avançados, negociação de preços e visualização em mapa poderão ser implementadas de forma incremental.

---

## Como Executar o Projeto

Siga o passo a passo abaixo para rodar o projeto localmente em sua máquina.

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou `yarn` / `pnpm`
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (Para o banco de dados)

---

### Passo a Passo

#### 1. Clonar o repositório
```bash
git clone https://github.com/paula-maria/breshop.git
cd breshop
```

#### 2. Configurar e rodar o Backend (API e Banco de Dados)

O backend depende de um banco de dados PostgreSQL, que está configurado para rodar via Docker.

```bash
# Entre na pasta do backend
cd backend

# criar um .env a partir do .env.example
cp .env.example .env

# preencha esses elementos com suas credenciais:
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/seu schema"]
JWT_SECRET="troque-por-um-segredo-aleatorio-longo"

Para gerar um segredo forte no terminal, rode:
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"

# Inicie o PostgreSQL:
   docker compose up -d ou com db no final

# Gere o cliente Prisma e aplique as migrações:
   npx prisma generate
   npx prisma migrate dev

4. Inicie o backend:
   npm run dev

```
O servidor da API estará rodando em `http://localhost:3333`.

#### 3. Configurar e rodar o Frontend

Em um **novo terminal**, na raiz do projeto:

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento do React
npm run dev
```

Após rodar o comando acima, abra o seu navegador e acesse a URL exibida no terminal (por padrão: `http://localhost:5173`). O frontend já está configurado para se conectar à API no localhost.

---

### Scripts Disponíveis

Dentro do diretório `frontend`, você pode executar os seguintes comandos:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento Vite com *Live Reload*. |
| `npm run build` | Compila o projeto com TypeScript (`tsc`) e gera o bundle de produção na pasta `dist/`. |
| `npm run lint` | Executa a verificação de regras de código utilizando o ESLint. |
| `npm run preview` | Servidor local para visualizar a versão compilada de produção (`dist/`). |

---

## Status do Projeto

Em desenvolvimento.

A documentação do projeto está organizada em:

* `README.md` — contexto, problema, objetivo, tutorial de execução e visão geral do projeto;
* `docs/requisitos.md` — especificação dos requisitos funcionais e não funcionais;
* `docs/user-stories.md` — temas, épicos e User Stories.

