# Plataforma de Gestão de Frota - Aivacol

API backend para gerenciamento de frota de veículos em NestJS.

**Stack:** NestJS 11 | TypeORM | SQL Server | Redis | RabbitMQ | MongoDB | Jest

---

## ⚡ Quick Start

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose

### 1. Clonar e instalar
```bash
git clone https://github.com/ygcristopher/Plataforma-de-Gestao-de-Frota---Aivacol.git
cd "Plataforma de Gestão de Frota · Aivacol"
npm install
```

### 2. Copiar ambiente
```bash
cp .env.example .env.development
cp .env.example .env.test
```

### 3. Iniciar Docker
```bash
docker-compose up -d
```

Verificar serviços:
```bash
docker-compose ps
```

### 4. Rodar aplicação
```bash
npm run start:dev
```

API estará disponível em: **http://localhost:3000**

---

## 📋 Verificação Rápida

```bash
# Lint
npm run lint          # 0 erros

# Testes unitários
npm test              # 7 passing

# Testes E2E
npm run test:e2e      # 2 passing

# Build
npm run build
```

---

## 🔐 Login de Teste

Registre um usuário:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@test.com",
    "password": "Test@123456"
  }'
```

Faça login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Test@123456"
  }'
```

Use o `access_token` para os outros endpoints:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/vehicles
```

---

## 📡 Endpoints Principais

### Autenticação
- `POST /auth/register` - Criar usuário
- `POST /auth/login` - Fazer login

### Veículos (requer autenticação)
- `POST /vehicles` - Criar
- `GET /vehicles` - Listar (com cache Redis)
- `GET /vehicles/:id` - Buscar por ID
- `PATCH /vehicles/:id` - Atualizar
- `DELETE /vehicles/:id` - Deletar

### Marcas
- `POST /brands` - Criar
- `GET /brands` - Listar
- `GET /brands/:id` - Buscar
- `PATCH /brands/:id` - Atualizar
- `DELETE /brands/:id` - Deletar

### Modelos
- `POST /models` - Criar
- `GET /models` - Listar
- `GET /models/:id` - Buscar
- `PATCH /models/:id` - Atualizar
- `DELETE /models/:id` - Deletar

---

## 🧪 Rodando Testes

```bash
# Testes unitários
npm test

# Testes E2E (com Docker)
npm run test:e2e

# Coverage
npm test -- --coverage
```

---

## 🐳 Docker Services

Todos os serviços são iniciados pelo `docker-compose up -d`:

- **app** (Port 3000) - NestJS API
- **sqlserver** (Port 1433) - SQL Server 2022
- **redis** (Port 6379) - Redis 7
- **rabbitmq** (Port 5672) - RabbitMQ 3.11
- **mongo** (Port 27017) - MongoDB 6

### Ver logs
```bash
docker-compose logs -f app
```

### Parar
```bash
docker-compose down
```

### Reset completo
```bash
docker-compose down -v
```

---

## ⚙️ Variáveis de Ambiente

Arquivo `.env.development` (já vem com valores padrão em `.env.example`):

```env
NODE_ENV=development
PORT=3000

DB_HOST=sqlserver
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourSecurePassword123!
DB_NAME=fleet_management

JWT_SECRET=secret-key-change-in-prod
JWT_EXPIRES_IN=24h

REDIS_HOST=redis
REDIS_PORT=6379

RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672

MONGODB_URI=mongodb://mongo:27017/fleet_audit
```

---

## 📁 Estrutura do Projeto

```
src/
├── auth/              # Autenticação JWT
├── vehicles/          # CRUD veículos + cache
├── brands/            # CRUD marcas
├── models/            # CRUD modelos
├── database/          # Entities e DataSource
├── messaging/         # RabbitMQ events
├── audit/             # MongoDB logging
├── common/            # Guards, decoradores
├── app.module.ts
└── main.ts
```

---

## ✅ Features Implementadas

- ✅ CRUD Veículos, Marcas, Modelos
- ✅ Autenticação JWT + bcrypt
- ✅ Cache Redis (veículos)
- ✅ Events RabbitMQ
- ✅ Auditoria MongoDB
- ✅ Validações robustas (DTOs)
- ✅ Testes unitários (Jest)
- ✅ Testes E2E (Supertest)
- ✅ HTTP Status Codes corretos (201, 204)
- ✅ ESLint clean (0 erros)
- ✅ Docker multistage + Compose

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Production
```bash
NODE_ENV=production npm start
```

---

## 📞 Troubleshooting

**Erro: "Connection refused" (SQL Server)**
```bash
docker-compose restart sqlserver
docker-compose logs sqlserver
```

**Erro: "EADDRINUSE: address already in use :3000"**
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

**Erro: "Cannot connect to Redis"**
```bash
docker-compose down -v
docker-compose up -d redis
```

---

## 📄 Arquivos Importantes

- `.env.example` - Template de variáveis
- `docker-compose.yml` - Configuração de services
- `Dockerfile` - Build multistage
- `seed_vehicles.json` - Dados de exemplo
- `STUDY_GUIDE.md` - Documentação detalhada

---

**Desenvolvido por:** Christopher | Aivacol 2026
