# Claro Fullstack Challenge

Monorepo do desafio fullstack para gerenciamento de times e tarefas, com backend em NestJS e aplicativo mobile em React Native/Expo.

## Visão geral

O projeto entrega:

- `apps/api`: API REST em Node.js, NestJS, TypeScript, Prisma e SQLite.
- `apps/mobile`: app mobile em React Native, Expo Router e TypeScript.

Scripts na raiz do monorepo:

- `npm run start:api`
- `npm run start:mobile`
- `npm run seed`
- `npm run test`
- `npm run build`
- `npm run typecheck`

O fluxo principal cobre:

- CRUD de times
- CRUD de tarefas
- associação de tarefas com zero ou mais times
- filtros por time, status e busca textual
- alteração rápida de status
- seed inicial com massa de avaliação
- suporte offline-first no mobile

## Stack

### Backend

- NestJS
- TypeScript
- Prisma
- SQLite
- Zod
- Jest

### Mobile

- Expo
- React Native
- TypeScript
- Expo Router
- TanStack Query
- React Hook Form
- Zod
- `react-native-mmkv`
- `@react-native-community/netinfo`

## Decisões arquiteturais

### Banco de dados

Escolhi SQLite para o desafio porque ele reduz atrito de setup local e evita dependências externas para avaliação. O avaliador consegue clonar o projeto, rodar migration, seed e testar sem precisar subir containers ou serviços adicionais.

Em produção, eu migraria para Postgres por concorrência, observabilidade e flexibilidade operacional.

### Modelagem das entidades

O domínio foi modelado com três entidades:

- `Team`: representa um time
- `Task`: representa uma tarefa
- `TaskTeam`: tabela de junção para o relacionamento muitos-para-muitos

Uma tarefa pode pertencer a zero, um ou vários times. Um time pode aparecer em várias tarefas.

### Organização do backend

O backend está organizado por módulos de domínio:

- `src/modules/teams`
- `src/modules/tasks`
- `src/modules/prisma`
- `src/common`

Cada módulo separa controller, service, repository, schemas e types.

Usei essa divisão para deixar claras as responsabilidades:

- controller: contrato HTTP
- service: regras de negócio
- repository: persistência
- schemas: validação com Zod

### Organização do mobile

O mobile usa arquitetura orientada a features em `src/features`, separando `teams` e `tasks`. Dentro de cada feature, a estrutura distingue:

- `api`
- `hooks`
- `components`
- `screens`
- `schemas`

Isso evita misturar navegação, UI, fetch e validação no mesmo arquivo.

### React Query e estado

Usei TanStack Query para server state, cache, invalidação, estados de loading/erro e mutations. Isso simplifica sincronização entre telas e reduz estado manual.

O estado local foi mantido enxuto e usado apenas onde faz sentido para filtros, navegação e formulários.

### Formulários

Os formulários usam `react-hook-form` com `zod`, garantindo validação tipada e regras explícitas, como tamanho mínimo de título e formato de `colorHex`.

### Offline-first

Como diferencial, o app mobile foi estruturado com estratégia offline-first usando:

- `react-native-mmkv` para cache persistente
- `@react-native-community/netinfo` para monitorar conectividade
- fila de mutações pendentes com sincronização quando a rede volta

Isso permite continuar navegando e executando mutações principais mesmo sem conexão.

## Modelo de dados

### Team

Campos principais:

- `id`
- `name`
- `colorHex`
- `description`
- `createdAt`
- `updatedAt`

### Task

Campos principais:

- `id`
- `title`
- `description`
- `status`
- `dueDate`
- `createdAt`
- `updatedAt`

Status suportados:

- `PENDING`
- `IN_PROGRESS`
- `DONE`

### TaskTeam

Tabela de relacionamento:

- `taskId`
- `teamId`

Chave composta:

- `taskId + teamId`

## Como rodar o projeto

## Requisitos de ambiente

Use Node.js 22 LTS. O repositório possui `.nvmrc` com a versão esperada.

```bash
nvm install
nvm use
```

Evite Node 25 ou superior.

Para iOS nativo, também é necessário:

- Xcode
- CocoaPods

Se possível, clone o projeto em um caminho sem espaços, por exemplo `~/Projects/claro-fullstack-challenge`.

## Scripts de atalho na raiz

Depois de configurar cada app ao menos uma vez, você também pode usar os scripts da raiz:

```bash
npm run start:api
npm run start:mobile
npm run seed
npm run test
npm run build
npm run typecheck
```

## Backend

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

API disponível em:

```txt
http://localhost:3000/api
```

O backend sobe em `0.0.0.0`, então também pode ser acessado por emuladores e dispositivos físicos na rede local.

Scripts úteis:

```bash
npm run build
npm run test
npm run seed
```

## Mobile

Em outro terminal:

```bash
cd apps/mobile
nvm use
npm install
cp .env.example .env
npm run start
```

URLs de API por ambiente:

- iOS Simulator: `http://localhost:3000/api`
- Android Emulator: `http://10.0.2.2:3000/api`
- Dispositivo físico: usar o IP local da máquina, por exemplo `http://192.168.0.10:3000/api`

Para sobrescrever:

```bash
EXPO_PUBLIC_API_URL="http://192.168.0.10:3000/api" npm run start
```

Para rodar iOS nativo:

```bash
cd apps/mobile
npm run ios
```

Se precisar instalar pods manualmente:

```bash
cd apps/mobile/ios
pod install --repo-update
```

## Ordem recomendada para avaliação

1. `nvm use` na raiz
2. instalar dependências da API
3. rodar migration e seed
4. subir a API
5. instalar dependências do mobile
6. iniciar o app
7. validar fluxos de times, tarefas, filtros, edição, status e deleção

## Seeds e reprodutibilidade local

O projeto inclui seed para avaliação rápida:

- 3 times
- 10 tarefas

Arquivo:

- [apps/api/prisma/seed.ts](/Users/sistemas/challenger-claro/apps/api/prisma/seed.ts)

Reprodutibilidade local:

- schema Prisma versionado
- migration inicial versionada
- script de seed explícito
- SQLite local para evitar dependências externas

Comandos:

```bash
cd apps/api
npm run prisma:migrate
npm run prisma:seed
```

## Contratos e exemplos de requests

### Teams

```bash
curl "http://localhost:3000/api/teams?limit=10&offset=0&search=Mobile"
```

```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile",
    "colorHex": "#E30613",
    "description": "Time responsável pelo app"
  }'
```

```bash
curl -X PUT http://localhost:3000/api/teams/team-mobile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile Platform",
    "colorHex": "#E30613",
    "description": "Time responsável pelo app mobile"
  }'
```

```bash
curl -X DELETE http://localhost:3000/api/teams/team-mobile
```

### Tasks

```bash
curl "http://localhost:3000/api/tasks?teamId=team-mobile&status=IN_PROGRESS&search=api&limit=10&offset=0&sort=dueDate:asc"
```

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

```bash
curl -X PUT http://localhost:3000/api/tasks/task-criar-api-tarefas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Criar API de tarefas",
    "description": "Atualizar implementação",
    "status": "IN_PROGRESS",
    "teamIds": ["team-backend"]
  }'
```

```bash
curl -X PATCH http://localhost:3000/api/tasks/task-criar-api-tarefas/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DONE"
  }'
```

```bash
curl -X DELETE http://localhost:3000/api/tasks/task-criar-api-tarefas
```

### Envelope de resposta

Sucesso:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "limit": 10,
    "offset": 0
  }
}
```

Erro:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": []
  }
}
```

## Requisitos atendidos

- backend Node.js com API REST
- frontend React Native + TypeScript consumindo a API
- formulários com `react-hook-form` + `zod`
- React Query para server state
- estilização sem `styled-components`
- CRUD de times e tarefas
- listagem com filtros por `teamId`, `status`, `search`, `sort`, `limit` e `offset`
- metadata nas listagens
- alteração rápida de status com atualização de UI
- chips/labels de time nas tarefas
- seed para avaliação
- documentação de execução local

## Testes e validações executadas

Validações principais do projeto:

- `apps/api`: `npm test`
- `apps/api`: `npm run build`
- `apps/mobile`: `npm run typecheck`

## O que faria diferente em produção

- migraria SQLite para Postgres
- adicionaria autenticação e autorização
- incluiria logs estruturados e observabilidade
- adicionaria rate limiting
- configuraria CI/CD com lint, testes e build
- adicionaria testes de componente no mobile
- adicionaria testes e2e mobile
- avaliaria cache e paginação cursor-based na API
- empacotaria backend com Docker

## Documentação complementar

- Backend: [apps/api/README.md](/Users/sistemas/challenger-claro/apps/api/README.md)
- Mobile: [apps/mobile/README.md](/Users/sistemas/challenger-claro/apps/mobile/README.md)

## Troubleshooting

### `Unsupported engine` ou erros estranhos no install

Confirme a versão do Node:

```bash
node -v
```

Use Node 22 LTS:

```bash
nvm use
```

### Mobile não conecta no backend

Confirme que a API está rodando em `http://localhost:3000/api`.

No Android Emulator, use:

```bash
EXPO_PUBLIC_API_URL="http://10.0.2.2:3000/api" npm run start
```

Em dispositivo físico, use o IP local da máquina.

### CocoaPods falha no iOS

```bash
cd apps/mobile/ios
pod install --repo-update
```
