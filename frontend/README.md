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

* React
* TypeScript
* HTML5
* CSS3

### Backend

* Python
* FastAPI

### Banco de Dados

* PostgreSQL

### Comunicação com a API

* REST API
* JSON

### Controle de Versão

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

## Status do Projeto

Em desenvolvimento.

A documentação do projeto está organizada em:

* `README.md` — contexto, problema, objetivo e visão geral do projeto;
* `docs/requisitos.md` — especificação dos requisitos funcionais e não funcionais;
* `docs/user-stories.md` — temas, épicos e User Stories.
