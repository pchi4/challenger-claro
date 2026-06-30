# Claro Fullstack Challenge

Monorepo do desafio fullstack para gerenciamento de times e tarefas, com backend em NestJS e aplicativo mobile em React Native/Expo.

## Visão geral

O projeto entrega:

- `apps/api`: API REST em Node.js, NestJS, TypeScript, Prisma e SQLite.
- `apps/mobile`: app mobile em React Native, Expo Router e TypeScript.

Scripts na raiz do monorepo:

- `npm run start:api`
- `npm run start:mobile`
- `npm run lint`
- `npm run seed`
- `npm run test`
- `npm run test:mobile`
- `npm run build`
- `npm run typecheck`
- `npm run ci`

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

## Monorepo

O repositório está organizado como monorepo com `npm workspaces`, mantendo:

- `apps/api` para o backend
- `apps/mobile` para o aplicativo mobile

Os scripts da raiz funcionam como ponto de entrada único para validação e execução local.

As dependências são instaladas na raiz do repositório. Em um checkout limpo, não é necessário manter `package-lock.json` ou `node_modules` separados por app.

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

Depois de instalar as dependências na raiz, você pode usar os scripts abaixo:

```bash
npm run start:api
npm run start:mobile
npm run lint
npm run seed
npm run test
npm run build
npm run typecheck
npm run ci
```

## Instalação

Na raiz do projeto:

```bash
nvm use
npm install
```

O `postinstall` da raiz já regenera automaticamente o Prisma Client da API no layout de workspace.

## Backend

```bash
cp apps/api/.env.example apps/api/.env
npm run prisma:generate -w @task-teams/api
npm run prisma:migrate -w @task-teams/api
npm run prisma:seed -w @task-teams/api
npm run start:api
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
cp apps/mobile/.env.example apps/mobile/.env
npm run ios -w @task-teams/mobile
```

O app mobile foi configurado para uso com **development build**. O fluxo oficial de avaliação não usa Expo Go, porque o offline-first depende de `react-native-mmkv` nativo.

URLs de API por ambiente:

- iOS Simulator: `http://localhost:3000/api`
- Android Emulator: `http://10.0.2.2:3000/api`
- Dispositivo físico: usar o IP local da máquina, por exemplo `http://192.168.0.10:3000/api`

Para sobrescrever:

```bash
EXPO_PUBLIC_API_URL="http://192.168.0.10:3000/api" npm run start:mobile
```

Depois que o build nativo estiver instalado no simulador/dispositivo, inicie o bundler com:

```bash
npm run start:mobile
```

Para Android nativo:

```bash
npm run android -w @task-teams/mobile
```

Se precisar instalar pods manualmente:

```bash
cd apps/mobile/ios
pod install --repo-update
```

## Ordem recomendada para avaliação

1. `nvm use` na raiz
2. instalar dependências na raiz com `npm install`
3. rodar migration e seed
4. subir a API
5. compilar o app nativo
6. iniciar o bundler
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

- raiz: `npm run lint`
- raiz: `npm run test`
- raiz: `npm run build`
- raiz: `npm run typecheck`

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

### Expo tenta observar `node_modules` inexistente

O projeto usa monorepo com `npm workspaces` e um `metro.config.js` dedicado em `apps/mobile` para resolver módulos a partir da raiz e do app. Se aparecer erro parecido com `ENOENT ... watch '/.../node_modules'`, confirme:

```bash
nvm use
npm install
```

Depois reinicie o bundler.

### Expo Go abre, mas o app falha com `NitroModules`

Esse projeto usa `react-native-mmkv` 4.x para persistencia offline, o que exige modulo nativo disponivel no app compilado. Por isso, **Expo Go nao e o alvo suportado** para avaliacao funcional completa.

Use o fluxo abaixo:

```bash
npm run ios -w @task-teams/mobile
npm run start:mobile
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
