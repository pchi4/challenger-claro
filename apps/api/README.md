# API

API REST para gerenciar Times e Tarefas. O backend permite criar, listar, atualizar e remover times, além de gerenciar tarefas com relacionamento muitos-para-muitos com times.

## Stack

- NestJS
- TypeScript
- Prisma
- SQLite
- Zod
- Jest

## Decisões arquiteturais

### Por que NestJS

NestJS foi escolhido por oferecer uma estrutura modular, previsível e adequada para APIs REST em TypeScript. A separação nativa entre módulos, controllers, providers e injeção de dependência ajuda a manter o projeto organizado conforme o domínio cresce.

### Por que Prisma

Prisma simplifica o acesso ao banco com tipagem forte, migrations e uma API declarativa para queries. Ele reduz código repetitivo de persistência e deixa o modelo de dados explícito no `schema.prisma`.

### Por que SQLite no teste/desafio

SQLite é simples de rodar localmente e não exige serviços externos, o que facilita avaliação rápida do desafio. Para testes automatizados desta API, os fluxos de integração usam um Prisma mockado em memória para validar controllers, pipes, services, repositories e envelopes sem depender de migration ou estado local.

### Organização da arquitetura

O projeto está organizado por módulos de domínio:

- `src/common`: tipos compartilhados, filtro global de erro, pipe de validação Zod e helpers de envelope.
- `src/modules/prisma`: `PrismaService` exportável para acesso ao banco.
- `src/modules/teams`: CRUD de times.
- `src/modules/tasks`: CRUD de tarefas, filtros e vínculos com times.

### Controllers, services e repositories

- Controllers cuidam da camada HTTP: rotas, parâmetros, body, query e envelope de resposta.
- Services concentram regras de negócio, como validar existência de entidades relacionadas.
- Repositories encapsulam acesso ao Prisma e isolam detalhes de persistência.

Essa separação facilita testes, manutenção e evolução da API.

### Por que Zod

Zod foi usado para validação explícita de `body`, `query` e `params`, com schemas próximos aos módulos que os utilizam. Isso evita depender de decorators em DTOs e mantém transformação/validação em um ponto claro.

## Modelo de dados

### Team

Representa um time de trabalho.

Campos principais:

- `id`
- `name`
- `colorHex`
- `description`
- `createdAt`
- `updatedAt`

### Task

Representa uma tarefa do sistema.

Campos principais:

- `id`
- `title`
- `description`
- `status`: `PENDING`, `IN_PROGRESS` ou `DONE`
- `dueDate`
- `createdAt`
- `updatedAt`

### TaskTeam

Tabela de junção entre `Task` e `Team`.

Campos:

- `taskId`
- `teamId`

### Relacionamento muitos-para-muitos

Uma tarefa pode estar associada a zero, um ou múltiplos times. Um time também pode estar associado a várias tarefas. Esse relacionamento é modelado pela tabela `TaskTeam`, que usa chave composta `taskId + teamId`.

## Como rodar

```bash
cd apps/api
nvm use
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

O script `prisma:migrate` aplica a migration SQLite inicial versionada em `prisma/migrations/0001_init/migration.sql` e em seguida executa `prisma generate`.

Por padrão, a API sobe em:

```txt
http://localhost:3000/api
```

## Scripts disponíveis

```bash
npm run start
npm run start:dev
npm run build
npm run lint
npm run test
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run seed
```

## Exemplos de requests

### Criar team

```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile",
    "colorHex": "#E30613",
    "description": "Time responsável pelo app"
  }'
```

### Listar teams

```bash
curl "http://localhost:3000/api/teams?limit=10&offset=0&search=Mobile"
```

### Criar task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Criar tela de tarefas",
    "description": "Implementar listagem e filtros",
    "status": "PENDING",
    "dueDate": "2026-06-20T00:00:00.000Z",
    "teamIds": ["team-mobile", "team-backend"]
  }'
```

### Listar tasks com filtro teamId

```bash
curl "http://localhost:3000/api/tasks?teamId=team-mobile&limit=10&offset=0"
```

### Listar tasks com filtro status

```bash
curl "http://localhost:3000/api/tasks?status=IN_PROGRESS&sort=dueDate:asc"
```

### Alterar status

```bash
curl -X PATCH http://localhost:3000/api/tasks/task-criar-api-tarefas/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DONE"
  }'
```

### Deletar task

```bash
curl -X DELETE http://localhost:3000/api/tasks/task-criar-api-tarefas
```

## O que faria diferente em produção

- Usaria Postgres em vez de SQLite.
- Implementaria autenticação e autorização.
- Adicionaria rate limiting.
- Usaria logs estruturados.
- Configuraria observabilidade com métricas, traces e alertas.
- Avaliaria cache para leituras frequentes.
- Configuraria CI/CD com lint, testes, build e migrations.
- Empacotaria a aplicação com Docker.
- Usaria paginação cursor-based para alto volume de dados.
