# Claro Fullstack Challenge

Monorepo do desafio fullstack para gerenciar times e tarefas.

## Projetos

- `apps/api`: API REST em NestJS, Prisma e SQLite.
- `apps/mobile`: aplicativo Expo/React Native com Expo Router.

## Requisitos de ambiente

Use Node.js 22 LTS. O repositório possui `.nvmrc` com a versão esperada:

```bash
nvm install
nvm use
```

Evite Node 25 ou superior. Algumas ferramentas do ecossistema Expo/Nest ainda não declaram suporte completo para essa versão.

Para build iOS nativo, também é necessário:

- Xcode instalado.
- CocoaPods instalado.
- Projeto clonado preferencialmente em um caminho sem espaços, por exemplo `~/Projects/claro-fullstack-challenge`.

## Rodando o backend

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

A API ficará disponível em:

```txt
http://localhost:3000/api
```

Validações úteis:

```bash
npm run test
npm run build
```

## Rodando o mobile

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
- Dispositivo físico: use o IP local da máquina, por exemplo `http://192.168.0.10:3000/api`

Para alterar a URL:

```bash
EXPO_PUBLIC_API_URL="http://192.168.0.10:3000/api" npm run start
```

## Rodando iOS nativo

```bash
cd apps/mobile
npm run ios
```

O primeiro build pode demorar alguns minutos porque o projeto está configurado para compilar o React Native a partir do código fonte no iOS. Essa configuração evita o erro de CocoaPods relacionado ao `React-Core-prebuilt`.

Se precisar rodar os pods manualmente:

```bash
cd apps/mobile/ios
pod install
```

## Ordem recomendada para avaliação

1. `nvm use` na raiz.
2. Subir a API em `apps/api`.
3. Rodar migrations e seed.
4. Iniciar o mobile em `apps/mobile`.
5. Testar listagem, filtro, criação, edição, status e exclusão de tarefas.

## Documentação detalhada

- Backend: `apps/api/README.md`
- Mobile: `apps/mobile/README.md`

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

Rode:

```bash
cd apps/mobile/ios
pod install --repo-update
```

Depois volte para `apps/mobile` e execute:

```bash
npm run ios
```
