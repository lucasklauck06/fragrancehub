# Fragrance Hub

Este projeto consiste em uma plataforma para fragrâncias e perfumes.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

1. **Frontend (React + Vite)**: Aplicativo interativo, estruturado e com design moderno.
2. **Backend (Node.js + Express + TypeScript)**: API para gerenciamento de perfis, autenticação de usuários (Login/Cadastro) utilizando Prisma com Supabase (PostgreSQL).

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- Conta no [Supabase](https://supabase.com/) (para o banco de dados PostgreSQL)

## Variáveis de Ambiente

Para o backend funcionar corretamente, você precisa configurar as variáveis de ambiente. Na pasta `backend`, crie um arquivo chamado `.env` (você pode copiar o conteúdo do arquivo `.env.example` que já está disponível na mesma pasta) e preencha-o com suas informações.

O arquivo de exemplo (`backend/.env.example`) contém:
```env
# URL de conexão via pooler (usado pela aplicação)
DATABASE_URL="postgresql://user:password@host:6543/database?pgbouncer=true"

# URL de conexão direta (usado pelo Prisma para migrations)
DIRECT_URL="postgresql://user:password@host:5432/database"

# Chave secreta para assinatura dos tokens JWT
JWT_SECRET="sua_chave_secreta_aqui"

# Porta onde o servidor backend irá rodar (opcional, padrão: 3000)
PORT=3000
```

> [!IMPORTANT]  
> **Nota sobre o Supabase e Prisma**: O Prisma precisa da conexão direta (`DIRECT_URL` na porta 5432) para conseguir realizar as migrations (`npx prisma db push`). Para a comunicação da aplicação (`DATABASE_URL`), utilize a porta do connection pooler (geralmente 6543) acompanhada de `?pgbouncer=true`.

## Instalação e Execução

### 1. Configurando e rodando o Backend

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Certifique-se de que o arquivo `.env` foi criado corretamente com suas credenciais do banco de dados (conforme detalhado na seção acima).

4. Sincronize o banco de dados (isso criará as tabelas necessárias baseadas no seu *schema* Prisma):
   ```bash
   npx prisma db push
   ```

5. Inicie o servidor:
   ```bash
   npx nodemon src/index.ts
   ```
   > O servidor backend deverá iniciar e ficar escutando na porta configurada (padrão: `3000`).

### 2. Configurando e rodando o Frontend

1. Abra um novo terminal e certifique-se de estar na **raiz do projeto** (`fragrancehub/`). Se preferir, vá para a pasta raiz:
   ```bash
   cd ..
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie a aplicação Vite em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   > O frontend estará acessível no navegador (geralmente em `http://localhost:5173`). O sistema já está configurado para apontar as requisições da API para o backend rodando em `localhost:3000`.

## Funcionalidades Implementadas

- **Backend API**:
  - `POST /api/auth/register`: Cadastro de usuários.
  - `POST /api/auth/login`: Autenticação e geração do Token JWT.
  - `GET /api/auth/profile`: Visualizar dados do próprio usuário autenticado.
  - `PUT /api/auth/profile`: Atualizar dados do usuário.
- **Frontend**:
  - Telas de Login e Rotas Protegidas (Ex.: Área administrativa `/admin` que só pode ser acessada por usuários autenticados via componente `<ProtectedRoute>`).
- **Banco de Dados**: Configurado para funcionar nativamente com Supabase (PostgreSQL) utilizando o **Prisma ORM 6**.
