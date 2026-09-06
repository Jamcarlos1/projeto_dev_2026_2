# Patinhas em Casa

Sistema web de adoção responsável para uma ONG fictícia. Visitantes consultam animais disponíveis e enviam pedidos de adoção; a equipe administra os pedidos e o catálogo em um painel protegido.

## Stack

- API: AdonisJS, TypeScript, Lucid ORM e SQLite
- Frontend: React, TypeScript, Vite e Material UI
- Autenticação: access tokens Bearer do AdonisJS, armazenados e validados pelo backend
- Testes: Japa

## Pré-requisitos

- **Node.js 24 ou superior** (obrigatório — a execução de TypeScript nativo do Adonis depende de uma API introduzida nessa versão; ver [Troubleshooting](#troubleshooting) se estiver em uma versão anterior)
- npm
- Compilador C++ e Python 3 (necessários apenas na primeira instalação, para compilar o driver nativo do SQLite — ver [Troubleshooting](#troubleshooting))

## Configuração

### API

```bash
cd api
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
node ace db:seed
```

O `node ace generate:key` é obrigatório: ele substitui o placeholder de `APP_KEY` no `.env` por uma chave de criptografia real — sem esse passo a aplicação não inicia.

O seed cria o administrador e três animais de exemplo. As credenciais do admin vêm do próprio `.env` (variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD`), com os valores padrão do `.env.example`:

```text
E-mail: admin@patinhasemcasa.org
Senha: adota123
```

Para alterar as credenciais, edite `ADMIN_EMAIL`/`ADMIN_PASSWORD` no `.env` **antes** de rodar `node ace db:seed`.

### Frontend

```bash
cd web
npm install
cp .env.example .env
```

O `.env` do frontend deve apontar para a API:

```text
VITE_API_URL=http://localhost:3333/api/v1
```

## Executar

Em dois terminais:

```bash
cd api
npm run dev
```

```bash
cd web
npm run dev
```

A aplicação web estará em `http://localhost:5173` e a API em `http://localhost:3333`.

## Fluxos principais

- Página pública em `/`
- Login administrativo em `/admin/login`
- Painel em `/admin`
- Filtro público por espécie
- Pedido de adoção com validação frontend e backend
- Pedidos com status pendente, confirmado ou cancelado
- Busca, filtro e paginação no painel
- Contadores de pedidos por status e animais disponíveis no painel
- Proteção contra pedidos pendentes duplicados para o mesmo animal e e-mail
- Exportação CSV dos pedidos respeitando os filtros atuais
- Confirmação inativa o animal e cancela pedidos pendentes concorrentes
- Cadastro, edição, ativação/desativação e remoção de animais

## Testes e build

```bash
cd api
npm test
```

```bash
cd web
npm run build
```

Os testes cobrem autenticação e logout, criação e validação de pedidos, animal indisponível, proteção contra duplicidade, proteção de rotas, confirmação, cancelamento, cascata, resumo, exportação CSV, CRUD de animais e integridade na exclusão. Atualmente são 16 testes funcionais. O painel também disponibiliza `GET /api/v1/admin/adoption-requests/summary` para os contadores e `GET /api/v1/admin/adoption-requests/export` para exportar CSV; ambos exigem autenticação.

Os testes usam `api/tmp/db.test.sqlite3`, enquanto a aplicação usa `api/tmp/db.sqlite3`. Essa separação evita que a reversão automática das migrations da suíte de testes apague os dados usados no desenvolvimento.

## Estrutura

- `api/`: backend, migrations, seeders, models, controllers, validators e testes
- `web/`: SPA React, páginas públicas e administrativas, hooks e componentes
- `DECISOES.md`: decisões técnicas, casos-limite, escopo e uso de IA

## Troubleshooting

**`TypeError [ERR_UNKNOWN_FILE_EXTENSION]` ao rodar qualquer comando `node ace`**
Indica Node.js abaixo da versão 24. Confirme com `node -v`. Se estiver usando `nvm`, rode `nvm install 24 && nvm use 24` (o projeto já tem um `.nvmrc` apontando para essa versão) e reinstale as dependências (`rm -rf node_modules && npm install`).

**Erro do `node-gyp`/compilador durante o `npm install` da API**
O driver do SQLite (`better-sqlite3`) compila um módulo nativo na instalação. No Ubuntu/Debian, instale as ferramentas de build antes de tentar de novo:
```bash
sudo apt install -y python3 build-essential
```
No macOS, garanta que as Command Line Tools estejam instaladas (`xcode-select --install`).

**`SqliteError: no such table` ao rodar a API ou os testes**
As migrations não foram executadas no banco de desenvolvimento. Dentro de `api/`, rode `node ace migration:run` e `node ace db:seed` se as tabelas de dados estiverem vazias. Os testes preparam automaticamente o banco separado `tmp/db.test.sqlite3`.