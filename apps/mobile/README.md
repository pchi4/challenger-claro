# Mobile

Aplicativo mobile para gerenciar tarefas e times. O app consome a API REST do backend, lista tarefas globalmente e por time, permite filtros, criação, edição, alteração de status e exclusão de tarefas, além de criar, editar e remover times.

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- TanStack Query
- React Hook Form
- Zod

## Decisões arquiteturais

### Feature-based architecture

O código foi organizado por features em `src/features`, separando `tasks` e `teams`. Cada feature mantém seus próprios contratos, chamadas de API, hooks, componentes e telas, deixando o crescimento do app mais previsível.

### Separação entre API, hooks e UI

- `api`: funções responsáveis por chamar o backend.
- `hooks`: concentram server state, estado de tela, navegação e ações.
- `components` e `screens`: cuidam da renderização e interação visual.

Essa separação evita lógica de API dentro da UI e facilita manutenção.

### React Query para server state

TanStack Query foi usado para cache, loading/error states, invalidação de listas e mutations. A alteração de status usa atualização otimista quando possível.

### React Hook Form + Zod

Os formulários de tarefa usam React Hook Form para controle eficiente dos campos e Zod para validação tipada das regras de entrada.

### Offline-first com MMKV

O app mantém cache local de times e tarefas com `react-native-mmkv`, usa `@react-native-community/netinfo` para observar conectividade e sincroniza mutações pendentes quando a rede volta. Isso permite continuar navegando e criando dados essenciais mesmo offline.

### StyleSheet e tokens

O app usa `StyleSheet` com tokens compartilhados em `src/shared/theme`, em vez de `styled-components`. Isso mantém a UI simples, performática e consistente.

## Como rodar

Use Node.js 22 LTS:

```bash
nvm install
nvm use
```

```bash
cd apps/mobile
npm install
cp .env.example .env
```

Configure a URL da API quando quiser sobrescrever o padrão:

```bash
export EXPO_PUBLIC_API_URL="http://localhost:3000/api"
```

Sem `EXPO_PUBLIC_API_URL`, o app usa por padrão:

- iOS: `http://localhost:3000/api`
- Android Emulator: `http://10.0.2.2:3000/api`

Inicie o Metro para um development build:

```bash
npm run start
```

Para rodar o build nativo iOS:

```bash
npm run ios
```

O fluxo suportado para avaliação é com **development build**. O app depende de `react-native-mmkv`, que é um módulo nativo baseado em NitroModules e exige app compilado. Por isso, **Expo Go não é um alvo suportado** para validar a persistência offline real.

O primeiro build iOS pode demorar alguns minutos. O projeto está configurado para compilar o React Native a partir do código fonte no iOS, evitando o erro de CocoaPods relacionado ao `React-Core-prebuilt`.

Para reduzir problemas de scripts nativos, prefira clonar o repositório em um caminho sem espaços, por exemplo `~/Projects/claro-fullstack-challenge`.

## Como conectar com backend local

Use a URL adequada ao ambiente onde o app está rodando:

- iOS Simulator: `http://localhost:3000/api`
- Android Emulator: `http://10.0.2.2:3000/api`
- Dispositivo físico: use o IP local da máquina, por exemplo `http://192.168.0.10:3000/api`

Exemplo para dispositivo físico:

```bash
export EXPO_PUBLIC_API_URL="http://192.168.0.10:3000/api"
npm run start
```

O backend precisa estar rodando antes de usar o app:

```bash
cd apps/api
npm run start:dev
```

Para acesso a partir de dispositivo físico, o backend precisa aceitar conexões externas. Neste repositório ele sobe por padrão em `0.0.0.0`, então basta usar o IP local correto em `EXPO_PUBLIC_API_URL`.

## Troubleshooting

### Expo Go abre, mas o app falha com erro de NitroModules ou MMKV

Isso é esperado se tentar abrir o projeto no Expo Go. Nesse cenário, rode:

```bash
npm run ios
npm run start
```

Depois abra o app compilado no simulador ou dispositivo. Assim o módulo nativo do `react-native-mmkv` fica disponível e o comportamento offline funciona de forma completa.

## Fluxos implementados

- Listar tasks globalmente
- Filtrar tasks por status
- Filtrar tasks por time
- Criar task
- Editar task
- Alterar status da task
- Deletar task
- Listar times para filtro
- Criar time
- Editar time
- Deletar time
- Suporte offline-first para listagem e mutações principais

## O que faria diferente em produção

- Autenticação e autorização.
- Retry/backoff para chamadas instáveis.
- Logs de erro estruturados.
- Analytics de uso.
- Testes com Jest e React Native Testing Library.
