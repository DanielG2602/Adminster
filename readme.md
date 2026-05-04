<div align="center">
# 🏢 Adminster
 
**Sistema de Gestão Administrativa de Funcionários**
 
[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)](https://kafka.apache.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)](https://grafana.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)
 
> Plataforma web para gerenciamento de funcionários, controle de cargos, departamentos, jornadas e histórico administrativo de empresas — construída para alta escala e preparada para microsserviços.
 
</div>
---
 
## 📋 Sumário
 
- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Stack Completa](#-stack-completa)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Setup & Instalação](#-setup--instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
- [Kafka — Tópicos e Eventos](#-kafka--tópicos-e-eventos)
- [Redis — Estratégia de Cache](#-redis--estratégia-de-cache)
- [Observabilidade](#-observabilidade)
- [Docker & Deploy](#-docker--deploy)
- [Documentação](#-documentação)
- [Git Flow & Contribuição](#-git-flow--contribuição)
- [ADRs](#-adrs)
---
 
## 💡 Sobre o Projeto
 
O **Adminster** é uma solução fullstack de alta escala para gestão administrativa de pessoas em empresas. Centraliza o controle de:
 
- Cadastro e gestão de funcionários
- Departamentos e cargos
- Jornadas de trabalho e escalas
- Histórico completo de alterações (auditoria via Kafka)
- Notificações assíncronas (email, push)
- Controle de acesso por perfis (RH, Gestor, Admin)
---
 
## 🏗 Arquitetura
 
```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│              Next.js 14 · TypeScript · Tailwind · ShadCN        │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────────┐
│                       API GATEWAY                               │
│              Nginx · Rate Limit · SSL Termination               │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    BACKEND (Spring Boot 3)                       │
│   Spring Security · JWT · JPA · MapStruct · Actuator · Micrometer│
└───────┬──────────────────────┬──────────────────────┬───────────┘
        │                      │                      │
┌───────▼───────┐   ┌──────────▼──────────┐  ┌───────▼────────┐
│  Apache Kafka │   │        Redis         │  │  PostgreSQL 16 │
│               │   │                      │  │                │
│ audit-events  │   │  JWT blacklist        │  │ Flyway schema  │
│ notificacoes  │   │  Rate limiting        │  │ versionado     │
│ integracoes   │   │  Cache queries        │  │                │
└───────┬───────┘   └──────────────────────┘  └────────────────┘
        │
   ┌────┴────────────────┐
   │                     │
┌──▼──────────┐  ┌───────▼──────────┐
│ Audit       │  │ Notif. Service   │
│ Service     │  │ Email · Push     │
│ Histórico   │  │                  │
└─────────────┘  └──────────────────┘
 
┌─────────────────────────────────────────────────────────────────┐
│                      OBSERVABILIDADE                            │
│                                                                 │
│  Prometheus ──┐                                                 │
│  Loki ────────┼──► Grafana  (dashboards · alerting)            │
│  Tempo/Jaeger ┘                                                 │
└─────────────────────────────────────────────────────────────────┘
```
 
---
 
## 🛠 Stack Completa
 
| Camada | Tecnologia | Uso |
|--------|-----------|-----|
| Frontend | Next.js 14, TypeScript, Tailwind, ShadCN | Interface web |
| API Gateway | Nginx | Proxy reverso, SSL, rate limit |
| Backend | Spring Boot 3, Java 17+ | API REST principal |
| Segurança | Spring Security, JWT + Redis blacklist | Autenticação/autorização |
| Banco | PostgreSQL 16 + Flyway | Persistência e migrações |
| Mensageria | Apache Kafka + Zookeeper | Eventos assíncronos |
| Cache | Redis | Blacklist JWT, rate limit, cache |
| Métricas | Prometheus + Micrometer | Coleta de métricas |
| Logs | Loki + Logback | Logs centralizados |
| Tracing | Tempo / Jaeger | Distributed tracing |
| Dashboards | Grafana | Visualização e alertas |
| Documentação | Swagger, AsyncAPI, Javadoc, ADRs | Docs técnicas |
 
---
 
## 📁 Estrutura de Pastas
 
```
adminster/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/adminster/
│   │   │   │   ├── config/             # Beans, Security, CORS, Kafka, Redis
│   │   │   │   ├── controller/         # REST Controllers
│   │   │   │   ├── domain/             # Entities JPA
│   │   │   │   ├── dto/                # Request / Response DTOs
│   │   │   │   ├── event/              # Eventos Kafka (producers)
│   │   │   │   ├── exception/          # Handlers globais
│   │   │   │   ├── mapper/             # MapStruct interfaces
│   │   │   │   ├── repository/         # Spring Data repositories
│   │   │   │   └── service/            # Regras de negócio
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-local.yml
│   │   │       └── db/migration/       # Flyway migrations (V1__, V2__...)
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
│
├── consumers/
│   ├── audit-service/                  # Consumer: audit-events → Postgres
│   └── notification-service/           # Consumer: notificacoes → email/push
│
├── frontend/
│   ├── src/
│   │   ├── app/                        # Next.js App Router
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/                        # Axios, utils
│   │   ├── services/                   # Chamadas à API
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
│
├── docker/
│   ├── nginx/
│   │   └── nginx.conf
│   ├── postgres/
│   │   └── init.sql
│   ├── grafana/
│   │   └── provisioning/
│   │       ├── dashboards/             # JSONs dos dashboards
│   │       └── datasources/            # Prometheus, Loki, Tempo
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── loki/
│       └── loki-config.yml
│
├── docs/
│   ├── adr/                            # Architecture Decision Records
│   │   ├── ADR-001-kafka-para-auditoria.md
│   │   ├── ADR-002-redis-jwt-blacklist.md
│   │   └── ADR-003-stack-observabilidade.md
│   └── asyncapi.yml                    # Documentação dos tópicos Kafka
│
├── docker-compose.yml                  # Dev: todos os serviços
├── docker-compose.prod.yml             # Prod: sem volumes locais
└── README.md
```
 
---
 
## ⚙️ Pré-requisitos
 
| Ferramenta | Versão mínima |
|------------|---------------|
| Java (JDK) | 17+ |
| Maven | 3.9+ |
| Node.js | 20+ |
| Docker | 24+ |
| Docker Compose | 2.x |
 
> Em desenvolvimento, todos os serviços de infraestrutura (Postgres, Kafka, Redis, Grafana...) rodam via Docker Compose. Não é necessário instalar nada além de Java, Node e Docker.
 
---
 
## 🚀 Setup & Instalação
 
### 1. Clonar o repositório
 
```bash
git clone https://github.com/DanielG2602/Adminster.git
cd Adminster
```
 
### 2. Configurar variáveis de ambiente
 
```bash
cp backend/src/main/resources/application-local.yml.example \
   backend/src/main/resources/application-local.yml
 
cp frontend/.env.example frontend/.env.local
```
 
### 3. Subir toda a infra com Docker
 
```bash
# Sobe: Postgres, Kafka, Zookeeper, Redis, Prometheus, Loki, Tempo, Grafana
docker compose up -d
```
 
### 4. Rodar o backend
 
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```
 
API disponível em: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`
 
### 5. Rodar o frontend
 
```bash
cd frontend
npm install
npm run dev
```
 
Frontend disponível em: `http://localhost:3000`
 
### 6. Acessar os painéis
 
| Serviço | URL | Credenciais |
|---------|-----|-------------|
| Grafana | `http://localhost:3001` | admin / admin |
| Kafka UI | `http://localhost:8090` | — |
| Prometheus | `http://localhost:9090` | — |
| Swagger | `http://localhost:8080/swagger-ui.html` | — |
 
---
 
## 🔑 Variáveis de Ambiente
 
### Backend (`application-local.yml`)
 
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/adminster
    username: adminster_user
    password: sua_senha_aqui
 
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: adminster-backend
 
  data:
    redis:
      host: localhost
      port: 6379
      password: sua_senha_redis
 
jwt:
  secret: seu_secret_jwt_minimo_256bits
  expiration: 86400000       # 24h
  refresh-expiration: 604800000  # 7 dias
 
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
```
 
### Frontend (`.env.local`)
 
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_APP_NAME=Adminster
```
 
---
 
## 📡 Endpoints da API
 
Base URL: `http://localhost:8080/api/v1`
 
### 🔐 Auth
 
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/login` | Login → JWT + refresh token | ❌ |
| `POST` | `/auth/refresh` | Renovar access token | ✅ |
| `POST` | `/auth/logout` | Invalida token (blacklist Redis) | ✅ |
 
### 👤 Funcionários
 
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/funcionarios` | Listar (paginado + filtros) | ✅ |
| `GET` | `/funcionarios/{id}` | Buscar por ID | ✅ |
| `POST` | `/funcionarios` | Cadastrar | ✅ Admin/RH |
| `PUT` | `/funcionarios/{id}` | Atualizar | ✅ Admin/RH |
| `DELETE` | `/funcionarios/{id}` | Desativar | ✅ Admin |
 
### 🏬 Departamentos
 
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/departamentos` | Listar | ✅ |
| `POST` | `/departamentos` | Criar | ✅ Admin |
| `PUT` | `/departamentos/{id}` | Editar | ✅ Admin |
| `DELETE` | `/departamentos/{id}` | Remover | ✅ Admin |
 
### 💼 Cargos
 
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/cargos` | Listar | ✅ |
| `POST` | `/cargos` | Criar | ✅ Admin |
| `PUT` | `/cargos/{id}` | Editar | ✅ Admin |
 
> Documentação interativa completa: `http://localhost:8080/swagger-ui.html`
 
---
 
## 📨 Kafka — Tópicos e Eventos
 
Documentação completa dos contratos em [`docs/asyncapi.yml`](./docs/asyncapi.yml).
 
### Tópicos
 
| Tópico | Producer | Consumers | Descrição |
|--------|----------|-----------|-----------|
| `audit-events` | Backend | Audit Service | Toda alteração de funcionário, cargo, salário |
| `notificacoes` | Backend | Notification Service | Disparos de email e push |
| `integracoes` | Backend | Sistemas externos | Eventos para integração futura |
 
### Exemplo de evento (`audit-events`)
 
```json
{
  "eventId": "uuid-v4",
  "timestamp": "2026-05-04T10:00:00Z",
  "entityType": "FUNCIONARIO",
  "entityId": 42,
  "action": "SALARIO_ALTERADO",
  "performedBy": "usuario@empresa.com",
  "payload": {
    "salarioAnterior": 5000.00,
    "salarioNovo": 6000.00
  }
}
```
 
---
 
## ⚡ Redis — Estratégia de Cache
 
| Chave | TTL | Uso |
|-------|-----|-----|
| `blacklist:jwt:{jti}` | Igual ao tempo restante do token | Tokens invalidados no logout |
| `rate_limit:{ip}` | 60s | Contador de requisições por IP |
| `funcionarios:list:{hash}` | 5min | Cache de listagens com filtros |
| `departamentos:all` | 10min | Cache de departamentos (low churn) |
 
---
 
## 📊 Observabilidade
 
### Grafana — Dashboards planejados
 
| Dashboard | Fonte | Métricas monitoradas |
|-----------|-------|----------------------|
| JVM & Spring | Prometheus | Heap, GC, threads, uptime |
| HTTP API | Prometheus | Latência p95/p99, error rate, RPS |
| Kafka | Prometheus | Consumer lag, throughput, partitions |
| Redis | Prometheus | Hit rate, memória, conexões |
| PostgreSQL | Prometheus | Queries lentas, conexões, locks |
| Logs | Loki | Erros, warnings, stack traces |
 
### Tracing
 
Toda requisição HTTP gera um `traceId` propagado até o Kafka e consumers via OpenTelemetry. Consulte traces em: `http://localhost:16686` (Jaeger UI).
 
### Alertas configurados
 
- Kafka consumer lag > 1000 mensagens por mais de 5min
- Error rate HTTP > 5% em janela de 1min
- JVM Heap > 80% por mais de 2min
- PostgreSQL conexões > 80% do pool
---
 
## 🐳 Docker & Deploy
 
### Desenvolvimento
 
```bash
# Subir toda a infra
docker compose up -d
 
# Ver logs de um serviço específico
docker compose logs -f backend
 
# Parar tudo
docker compose down
 
# Parar e remover volumes (reset completo)
docker compose down -v
```
 
### Produção
 
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
 
Em produção o Nginx serve o frontend buildado e faz proxy reverso para a API. Kafka e Zookeeper rodam com retenção configurada.
 
### Serviços e portas
 
| Serviço | Porta dev |
|---------|-----------|
| Frontend (Next.js) | 3000 |
| Backend (Spring) | 8080 |
| Nginx | 80 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Kafka | 9092 |
| Kafka UI | 8090 |
| Prometheus | 9090 |
| Grafana | 3001 |
| Loki | 3100 |
| Jaeger/Tempo | 16686 |
 
---
 
## 📖 Documentação
 
| Tipo | Ferramenta | Localização |
|------|-----------|-------------|
| REST API | Swagger / OpenAPI 3 | `http://localhost:8080/swagger-ui.html` |
| Eventos Kafka | AsyncAPI | [`docs/asyncapi.yml`](./docs/asyncapi.yml) |
| Código interno | Javadoc | `mvn javadoc:javadoc` |
| Decisões arquiteturais | ADRs (Markdown) | [`docs/adr/`](./docs/adr/) |
 
---
 
## 🌿 Git Flow & Contribuição
 
```
main          ← produção estável
develop       ← integração contínua
feature/*     ← novas funcionalidades
bugfix/*      ← correções
hotfix/*      ← correções urgentes em produção
release/*     ← preparação de release
```
 
### Fluxo para nova feature
 
```bash
git checkout develop && git pull origin develop
git checkout -b feature/nome-da-feature
 
# ... desenvolve ...
 
git commit -m "feat(funcionarios): adiciona endpoint de desativação"
git push origin feature/nome-da-feature
# Abrir Pull Request → develop
```
 
### Padrão de commits (Conventional Commits)
 
| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `refactor:` | Refatoração |
| `docs:` | Documentação |
| `test:` | Testes |
| `chore:` | Build, CI, configs |
| `kafka:` | Novo tópico ou evento |
| `infra:` | Docker, Helm, configs de infra |
 
### Pull Request checklist
 
- [ ] Testes passando (`mvn test` / `npm run test`)
- [ ] Sem conflitos com `develop`
- [ ] Swagger atualizado (se alterou endpoints)
- [ ] AsyncAPI atualizado (se criou/alterou tópico Kafka)
- [ ] Migration Flyway criada (se alterou schema)
- [ ] ADR criado (se tomou decisão arquitetural relevante)
---
 
## 📝 ADRs
 
Decisões arquiteturais documentadas em [`docs/adr/`](./docs/adr/):
 
| ADR | Decisão |
|-----|---------|
| [ADR-001](./docs/adr/ADR-001-kafka-para-auditoria.md) | Usar Kafka para eventos de auditoria em vez de triggers de banco |
| [ADR-002](./docs/adr/ADR-002-redis-jwt-blacklist.md) | JWT blacklist via Redis em vez de sessões stateful |
| [ADR-003](./docs/adr/ADR-003-stack-observabilidade.md) | Prometheus + Loki + Tempo + Grafana como stack de observabilidade |
 
---
 
## 📄 Licença
 
Distribuído sob a licença **MIT**. Veja [`LICENSE`](./LICENSE) para mais detalhes.
 
---
 
<div align="center">
  Feito por <a href="https://github.com/DanielG2602">DanielG2602</a>
</div>
