
# MovieFinder 🎬

> Uma aplicação React moderna para busca e visualização de filmes, consumindo dados da TMDB API, com design responsivo, experiência de usuário aprimorada e código escalável.

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Demonstração](#demonstração)
- [Diferenciais](#diferenciais)
- [Autor](#autor)

---

## Sobre o Projeto

O **MovieFinder** é uma aplicação web desenvolvida em React + Vite, que permite ao usuário buscar filmes, visualizar detalhes completos, e navegar por uma interface responsiva e moderna. O projeto consome dados da [TMDB API](https://www.themoviedb.org/documentation/api) e foi desenvolvido com foco em boas práticas de UI/UX, componentização e escalabilidade.

---

## Funcionalidades

- **Busca de Filmes:** Campo de busca por título, com resultados em tempo real.
- **Listagem de Resultados:** Exibe pôster, nome, ano e nota dos filmes.
- **Página de Detalhes:** Ao clicar em um filme, mostra sinopse, gêneros, data de lançamento, nota e pôster ampliado.
- **Responsividade:** Layout adaptável para mobile, tablet e desktop.
- **Feedback Visual:** Loader animado durante requisições e mensagens de erro amigáveis (ex: filme não encontrado).
- **Navegação Protegida:** Rotas privadas para páginas que exigem autenticação.
- **Autenticação:** Telas de login, registro e perfil de usuário.
- **Componentização:** Componentes reutilizáveis para Navbar, Loader, Filtros, etc.

---

## Tecnologias Utilizadas

- **React** (com Vite)
- **TypeScript**
- **Tailwind CSS** (estilização e responsividade)
- **Axios** (requisições HTTP)
- **React Router DOM** (navegação entre páginas)
- **Context API** (gerenciamento de autenticação)
- **TMDB API** (fonte de dados de filmes)

---

## Como Rodar o Projeto

1. **Clone o repositório:**
   ```sh
   git clone <url-do-repo>
   cd movies-guide
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   ```
3. **Configure a API Key da TMDB:**
   - Crie um arquivo `.env` na raiz do projeto e adicione sua chave:
     ```env
     VITE_TMDB_API_KEY=your_tmdb_api_key
     ```
4. **Inicie o projeto:**
   ```sh
   npm run dev
   ```
5. **Acesse no navegador:**
   - [http://localhost:5173](http://localhost:5173)

---

## Estrutura de Pastas

```
src/
  assets/         # Imagens e ícones
  components/     # Componentes reutilizáveis (Navbar, Loader, Filter, etc)
  contexts/       # Contextos globais (ex: AuthContext)
  hooks/          # Custom hooks (ex: useFetchUser)
  pages/          # Páginas principais (Home, Detalhes, Login, etc)
  routes/         # Definição de rotas e rotas privadas
  services/       # Serviços de API (ex: api.ts)
  types/          # Tipagens TypeScript
index.css         # Estilos globais
main.tsx          # Ponto de entrada da aplicação
```

---

## Demonstração

<p align="center">
  <img src="public/vite.svg" alt="MovieFinder Demo" width="120" />
</p>

---

## Diferenciais

- Deploy pronto para Vercel/Netlify
- Paginação e scroll infinito
- Filtros por categoria (ação, comédia, etc)
- Armazenamento em cache/localStorage
- Componentização escalável
- Testes com React Testing Library (estrutura preparada)
- Animações com Framer Motion (estrutura preparada)

---

## Autor

Desenvolvido por **joão tambue**

---

## Licença

Este projeto está sob a licença MIT.
