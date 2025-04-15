# NestJs Boilerplate - Clean Architecture

## Descrição

Este é um boilerplate completo para iniciar novos projetos com **NestJS** com **Prisma**, já configurado com as melhores práticas de arquitetura e segurança. Ideal para começar um projeto rápido sem abrir mão de qualidade e escalabilidade.

## Principais Features

Arquitetura baseada em **Clean Architecture** e princípios **SOLID**

- **Autenticação** com JWT (incluindo refresh tokens e cache com Redis)
- **Cache de tokens** via **Redis**
- Criptografia de senhas com **bcrypt**
- Ambiente completo com **Docker** e **Docker compose**
- Testes com **Jest** já configurado
- **Prisma ORM** configurado com geração automática de tipos
- Proteção de rotas e fluxo completo de autenticação
- Configuração avançada com `@nestjs/config` para variáveis de ambiente

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [class-validator](https://github.com/typestack/class-validator)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [dotenv](https://github.com/motdotla/dotenv)
- [Swagger](https://swagger.io/)
- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [Jest](https://jestjs.io/)
- [Redis](https://redis.io/pt/)

## Pré-requisitos

- [Node.js](https://nodejs.org/) (>= 16.0)
- [npm](https://www.npmjs.com/) (>= 8.0) or [Yarn](https://yarnpkg.com/) (>= 1.22)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

## Instruções de Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/IosdanFerreira/nestjs-boilerplate.git
    cd nestjs-boilerplate
    ```

2.  **Configurar variáveis de ambiente:**

    - Crie um arquivo `.env` na pasta root do repositório.
    - Adicione as seguintes variáveis, ajustando os valores conforme sua configuração local:

    ```env
    ENV=development
    APP_PORT=3001
    DATABASE_URL="postgresql://postgres:clean-arch-secret@db:5432/clean-arch?schema=public"
    JWT_SECRET="jwt_secret"
    JWT_EXPIRES_IN_SECONDS=3600
    JWT_EXPIRES_IN_LITERAL_STRING_VALUE='1h'
    REFRESH_JWT_SECRET="refresh_jwt_secret"
    REFRESH_JWT_EXPIRES_IN_SECONDS=604800
    REFRESH_JWT_EXPIRES_IN_LITERAL_STRING_VALUE='7d'
    REDIS_HOST='redis'
    REDIS_PORT=6379
    ```

3.  **Conceda as permissões:**

    ```bash
    chmod +x .docker/entrypoint.sh
    ```

4.  **Rode os comando docker:**

    Construa a build

    ```bash
    docker compose build

    #Ou caso queira limpar o cache

    docker compose build --no-cache
    ```

    suba o container

    ```bash
    docker compose up
    ```

## Guia de uso

1.  **Acesse a aplicação:**

    Abra seu navegador e acesse `http://localhost:3001`.

2.  **Acesse a documentação do Swagger:**

    Navegue até `http://localhost:3001/api` para interagir com a documentação da API.

3.  **Autenticação:**

    - Utilize o endpoint `/auth/login` para autenticar-se e obter um access token e um refresh token. Forneça as credenciais (e-mail e senha) de um usuário previamente cadastrado.
    - O access token deve ser incluído no cabeçalho `Authorization` das requisições subsequentes a rotas protegidas, no formato `Bearer <token>`.
    - Para renovar o access token, utilize o endpoint `/auth/refresh` enviando um refresh token válido.
