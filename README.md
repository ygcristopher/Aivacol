# Plataforma de Gestao de Frota - Aivacol

API backend em NestJS para autenticacao e gestao de frota.

## Configuracao rapida

```bash
npm install
```

Opcionalmente copie o exemplo para criar seu arquivo local:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Rodando com Docker (recomendado para avaliacao)

```bash
docker compose up -d --build
```

API esperada em `http://localhost:3000`.

## Rodando local sem Docker

Necessita SQL Server e Redis locais, com valores compativeis no `.env`.

```bash
npm run start:dev
```

## Scripts uteis

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
npm run migration:run
npm run seed:user
```

## Endpoints principais (Dia 1 + Dia 2)

- `POST /auth/register`
- `POST /auth/login`
- `GET /` (health)
- `GET/POST/PATCH/DELETE /models`
- `GET/POST/PATCH/DELETE /vehicles`

## Observacoes para o teste tecnico

- O arquivo `.env.example` documenta todas as variaveis necessarias.
- `.env` e `.env.test` existem para garantir execucao previsivel em runtime e testes.
- A separacao de ambientes foi intencional para evitar falhas de conexao por host (`sqlserver` vs `localhost`).
