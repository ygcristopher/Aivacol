# Plataforma de Gestao de Frota - Aivacol

API backend em NestJS para gerenciamento de frota, com autenticacao JWT, CRUD de marcas/modelos/veiculos, cache em Redis, eventos em RabbitMQ e auditoria.

Stack principal: NestJS 11, TypeORM, SQL Server, Redis, RabbitMQ, MongoDB, Jest.

## Sumario

1. Visao Geral
2. Arquitetura e Componentes
3. Requisitos
4. Configuracao de Ambiente
5. Executando com Docker
6. Executando local (Node)
7. Fluxo de uso da API (Postman/cURL)
8. Collection do Postman (OBS)
9. Endpoints e Contratos
10. Testes
11. Scripts disponiveis
12. Troubleshooting
13. Estrutura do projeto

## Visao Geral

Esta API oferece:

- Cadastro e autenticacao de usuarios.
- CRUD completo de marcas (`brands`).
- CRUD completo de modelos (`models`) com relacionamento com marca.
- CRUD completo de veiculos (`vehicles`) com relacionamento com modelo.
- Cache da listagem de veiculos em Redis.
- Publicacao de eventos de veiculo em RabbitMQ.
- Registro de auditoria em MongoDB.

## Arquitetura e Componentes

- SQL Server: persistencia principal (usuarios, marcas, modelos, veiculos).
- Redis: cache de leitura para `GET /vehicles`.
- RabbitMQ: eventos de dominio (`vehicle.created`, `vehicle.updated`, `vehicle.removed`).
- MongoDB: armazenamento de trilha de auditoria.
- JWT Guard global: todas as rotas sao protegidas por token, exceto as marcadas como publicas (`/auth/register` e `/auth/login`).

Observacoes importantes:

- RabbitMQ neste projeto atua como produtor de eventos de veiculos (`vehicle.created`, `vehicle.updated`, `vehicle.removed`) apos operacoes de escrita.
- No estado atual, nao ha consumidor interno desses eventos neste mesmo repositorio; a fila fica pronta para integracoes/consumidores externos.
- MongoDB e usado para auditoria aplicacional: cada evento de veiculo e registrado na colecao `vehicle_audit` com evento, payload e timestamp.

## Requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose

## Configuracao de Ambiente

Arquivos de ambiente deste projeto:

| Arquivo | Deve existir? | Uso |
| --- | --- | --- |
| `.env.example` | Sim, versionado no repositorio | Template oficial com todas as variaveis necessarias para subir a aplicacao. |
| `.env` | Sim, na maquina local | Ambiente principal usado pelo Docker Compose, pela aplicacao em desenvolvimento e pelos scripts TypeORM/seed. |
| `.env.test` | Recomendado para testes e2e | Ambiente especifico carregado quando `NODE_ENV=test` no bootstrap da aplicacao. |

Fluxo recomendado:

1. Mantenha `.env.example` como fonte de verdade versionada.
2. Crie `.env` a partir dele para desenvolvimento local e Docker.
3. Crie `.env.test` quando quiser rodar `npm run test:e2e` com endpoints locais (`localhost`) e isolamento das configuracoes de teste.

Copie o arquivo de exemplo para `.env`:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Variaveis esperadas (exemplo):

```env
APP_HOST=0.0.0.0
PORT=3000

DB_HOST=sqlserver
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=SuaSenhaForte
DB_NAME=fleet_management
DB_ENCRYPT=false
DB_TRUST_CERT=true
DB_LOGGING=false

MONGODB_URL=mongodb://mongo:27017
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

JWT_SECRET=supersecret_jwt_key_change_me
JWT_EXPIRES_IN=1d

REDIS_HOST=redis
REDIS_PORT=6379
CACHE_TTL=60

SEED_ADMIN_USERNAME=aivacol
SEED_ADMIN_EMAIL=aivacol@local.test
SEED_ADMIN_PASSWORD=Aivacol@123

MSSQL_SA_PASSWORD=SuaSenhaForte
```

Conteudo recomendado para `.env.example`:

- Deve conter todas as chaves obrigatorias abaixo, sem segredos reais de producao.
- Valores de host voltados ao Docker Compose:
  - `DB_HOST=sqlserver`
  - `REDIS_HOST=redis`
  - `RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672`
  - `MONGODB_URL=mongodb://mongo:27017`

Conteudo recomendado para `.env`:

- Mesmo conjunto de variaveis do `.env.example`.
- Quando usar Docker Compose, mantenha os hosts internos dos containers (`sqlserver`, `redis`, `rabbitmq`, `mongo`).
- Quando rodar a API direto no host com `npm run start:dev`, ajuste os hosts para `localhost` se os servicos estiverem expostos na maquina.

Conteudo recomendado para `.env.test`:

```env
APP_HOST=0.0.0.0
PORT=3000

DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=Passw0rd123456
DB_NAME=fleet_management
DB_ENCRYPT=false
DB_TRUST_CERT=true
DB_LOGGING=false

RABBITMQ_URL=amqp://guest:guest@localhost:5672
MONGODB_URL=mongodb://localhost:27017

JWT_SECRET=supersecret_jwt_key_change_me
JWT_EXPIRES_IN=1d

REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_TTL=60

SEED_ADMIN_USERNAME=aivacol
SEED_ADMIN_EMAIL=aivacol@local.test
SEED_ADMIN_PASSWORD=Aivacol@123

MSSQL_SA_PASSWORD=Passw0rd123456
```

Como a aplicacao resolve os arquivos:

- O bootstrap principal carrega primeiro `.env.${NODE_ENV}` e depois `.env`.
- Na pratica:
  - `npm run start:dev` usa `.env`.
  - `npm run test:e2e` executa com `NODE_ENV=test`, entao a aplicacao tenta carregar `.env.test` antes de cair no fallback para `.env`.
- O TypeORM CLI (`npm run typeorm`, `migration:run`, `migration:revert`, `migration:show`) usa `src/database/data-source.ts`, que hoje carrega explicitamente apenas `.env`.

Importante:

- `DB_PASSWORD` e `MSSQL_SA_PASSWORD` devem ser iguais quando usar Docker Compose.
- Se alterar senha ou nome de banco apos primeira subida, geralmente sera necessario resetar volumes.

## Executando com Docker

Subir stack completa:

```bash
docker compose up -d
```

Ver status:

```bash
docker compose ps
```

Ver logs da API:

```bash
docker compose logs -f app
```

Parar stack:

```bash
docker compose down
```

Reset total (containers + volumes, limpa banco):

```bash
docker compose down -v
```

Observacao sobre inicializacao do app no Compose:

- O servico `app` executa automaticamente:
1. `npm run migration:run`
2. `npm run seed:user`
3. `npm run start:dev`

Se o banco ainda nao existir, crie manualmente dentro do SQL Server:

```bash
docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "SUA_SENHA" -C -Q "CREATE DATABASE fleet_management"
```

Depois suba novamente o app:

```bash
docker compose up -d app
```

## Executando local (Node)

Instalar dependencias:

```bash
npm install
```

Rodar API localmente:

```bash
npm run start:dev
```

Endereco padrao:

- `http://localhost:3000`

## Fluxo de uso da API (Postman/cURL)

Documentacao da collection do Postman: [API Aivacol](https://documenter.getpostman.com/view/32179264/2sBXwqq9wN#81bcbb82-513b-4db8-8d7e-a04e12248cf1)

### 1) Registrar usuario

`POST /auth/register`

Body:

```json
{
  "username": "tester",
  "email": "tester@example.com",
  "password": "123456"
}
```

### 2) Fazer login

`POST /auth/login`

Body:

```json
{
  "username": "tester",
  "password": "123456"
}
```

Resposta retorna:

```json
{
  "access_token": "..."
}
```

### 3) Usar token nas rotas protegidas

Header:

```text
Authorization: Bearer <access_token>
```

## Collection do Postman (OBS)

- E recomendado manter no repositorio uma collection com as rotas prontas, organizada por modulo (`auth`, `brands`, `models`, `vehicles`).
- A collection deve incluir variaveis de ambiente como `baseUrl` e `token` para facilitar validacao rapida da API.
- Fluxo sugerido na collection:
1. `Auth - Register`
2. `Auth - Login` (captura `access_token`)
3. Requests autenticadas de CRUD (`brands`, `models`, `vehicles`)
4. Requests para validar cache (`GET /vehicles` repetido + `PATCH/POST/DELETE /vehicles` para invalidacao)

Se voce ja tem a collection pronta no Postman, exporte em formato v2.1 e versiona junto no repositorio para facilitar avaliacao tecnica.

## Endpoints e Contratos

Base URL: `http://localhost:3000`

### Auth

- `POST /auth/register` (publica)
- `POST /auth/login` (publica)

### Brands

- `POST /brands`
- `GET /brands`
- `GET /brands/:id`
- `PATCH /brands/:id`
- `DELETE /brands/:id`

Payloads:

- Criar/Atualizar `brand`:

```json
{
  "name": "Honda"
}
```

### Models

- `POST /models`
- `GET /models`
- `GET /models/:id`
- `PATCH /models/:id`
- `DELETE /models/:id`

Payloads:

- Criar `model`:

```json
{
  "name": "Civic",
  "brandId": "1272433E-F36B-1410-863F-00A96C8E07D3"
}
```

- Atualizar `model`:

```json
{
  "name": "Civic Touring",
  "brandId": "1272433E-F36B-1410-863F-00A96C8E07D3"
}
```

Observacoes:

- `brandId` e opcional.
- A API valida `brandId` como UUID valido (inclui UUID sequencial do SQL Server).

### Vehicles

- `POST /vehicles`
- `GET /vehicles`
- `GET /vehicles/:id`
- `PATCH /vehicles/:id`
- `DELETE /vehicles/:id`

Payloads:

- Criar `vehicle`:

```json
{
  "plate": "ABC1234",
  "chassis": "9BWZZZ3CZ24046123",
  "renavam": "12345678901",
  "yearManufacture": 2022,
  "modelId": "3D60433E-F36B-1410-8641-00A96C8E07D3"
}
```

- Atualizar `vehicle` (exemplo parcial):

```json
{
  "plate": "DEF5678",
  "yearManufacture": 2023
}
```

Regras relevantes de validacao:

- `plate`: formato `ABC1234`.
- `renavam`: exatamente 11 digitos.
- `yearManufacture`: inteiro entre 1900 e 2100.
- `modelId`: UUID valido.

### Codigos de resposta comuns

- `201 Created`: criacao bem-sucedida.
- `200 OK`: consulta/atualizacao bem-sucedida.
- `204 No Content`: remocao bem-sucedida.
- `400 Bad Request`: erro de validacao.
- `401 Unauthorized`: sem token ou token invalido.
- `404 Not Found`: recurso nao encontrado.
- `409 Conflict`: violacao de unicidade/relacao em uso.

## Testes

Unitarios:

```bash
npm test
```

E2E:

```bash
npm run test:e2e
```

Coverage:

```bash
npm run test:cov
```

Observacao:

- O bootstrap dos testes e2e usa `.env.test` quando `NODE_ENV=test`; se o arquivo nao existir, cai para `.env`.
- O `data-source` do TypeORM continua lendo apenas `.env`.
- Antes dos e2e, confirme que SQL Server, Redis, RabbitMQ e MongoDB estao acessiveis com os hosts definidos em `.env.test`.

## Scripts disponiveis

- `npm run build`: build da aplicacao.
- `npm run start`: start padrao.
- `npm run start:dev`: start com watch.
- `npm run start:prod`: start de build.
- `npm run lint`: lint (com fix automatico).
- `npm run test`: testes unitarios.
- `npm run test:e2e`: testes end-to-end.
- `npm run typeorm`: comando base TypeORM.
- `npm run migration:run`: aplica migrations.
- `npm run migration:revert`: reverte migration.
- `npm run migration:show`: lista status de migrations.
- `npm run seed:user`: cria usuario admin inicial.

## Troubleshooting

### 1) Erro `Login failed for user 'sa'`

Verifique:

- `DB_PASSWORD` e `MSSQL_SA_PASSWORD` iguais no `.env`.
- SQL Server foi recriado apos trocar senha.

Comandos uteis:

```bash
docker compose down -v
docker compose up -d sqlserver
docker compose logs --tail 100 sqlserver
```

### 2) Erro `Failed to open the explicitly specified database 'fleet_management'`

Crie o banco manualmente:

```bash
docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "SUA_SENHA" -C -Q "CREATE DATABASE fleet_management"
```

### 3) 404 ao atualizar recurso (`Model not found`, `Brand not found`, etc.)

- Confirme que o `id` na URL e o `id` do recurso correto.
- Exemplo: ao atualizar `model`, use `PATCH /models/{modelId}` (nao o `brandId`).

### 4) 400 em UUID

- Garanta formato UUID valido (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
- Para `models` e `vehicles`, o DTO aceita UUID valido incluindo sequencial do SQL Server.

### 5) Porta em uso

Windows:

```powershell
netstat -ano | findstr :3000
```

Linux/macOS:

```bash
lsof -i :3000
```

### 6) Como monitorar o Redis (CLI e interface visual)

Opcao 1 - CLI (tempo real):

```bash
docker compose exec redis redis-cli MONITOR
```

Depois dispare `GET /vehicles` para observar `GET/SET` da chave de cache.

Opcao 2 - RedisInsight (interface visual):

- Conecte no Redis e busque por `vehicles:list:v1`.
- Valide o comportamento esperado:
1. `GET /vehicles` cria (ou atualiza) a chave.
2. `PATCH/POST/DELETE /vehicles` invalida a chave.
3. Novo `GET /vehicles` recria a chave com novo TTL.

## Estrutura do projeto

```text
src/
  audit/          # Servico de auditoria
  auth/           # Registro/login e estrategia JWT
  brands/         # CRUD de marcas
  common/         # Guard JWT e decoradores
  database/       # Entities, migrations, data source, seeds
  messaging/      # Integracao RabbitMQ
  models/         # CRUD de modelos
  users/          # Servico de usuarios
  vehicles/       # CRUD de veiculos + cache + eventos/auditoria
  main.ts
```

## Autor

Christopher - Aivacol (2026)
