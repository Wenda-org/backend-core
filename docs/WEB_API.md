## Proposta de API para Painel Administrativo (Wenda)

Este documento lista os serviços e endpoints recomendados que o painel web (`/src`) deverá consumir. Inclui métodos HTTP, descrições, parâmetros, formatos de resposta esperados e códigos de status.

Notas gerais
- Autenticação: Bearer JWT nos headers (Authorization: Bearer <token>) para endpoints privados.
- Paginação: usar `page` e `limit` (ou `limit` e `offset`) com meta em responses ({ total, page, limit }).
- Erros: resposta padronizada { error: { code, message, details? } } com status apropriado.
- Timeouts e rate-limits: 60 req/min por usuário por padrão (ajustável).

---

### Serviço: Auth

- POST /api/auth/login
  - Descrição: Autenticar usuário (email + senha) e retornar token JWT + informações do usuário.
  - Body: { email: string, password: string }
  - Response 200: { token: string, expiresIn: number, user: { id, name, email, roles: [] } }
  - Response 401: { error: { code: 'invalid_credentials', message: 'Credenciais inválidas' } }

- POST /api/auth/logout
  - Descrição: Invalida token (opcionalmente no servidor / blacklist) e termina sessão.
  - Auth: Bearer
  - Response 204: sem conteúdo

- GET /api/auth/me
  - Descrição: Retorna dados do usuário autenticado.
  - Auth: Bearer
  - Response 200: { id, name, email, roles, preferences }

- POST /api/auth/forgot-password
  - Descrição: Inicia fluxo de recuperação (envia email com token).
  - Body: { email }
  - Response 200: { ok: true }

- POST /api/auth/reset-password
  - Descrição: Reseta a senha usando token recebido por email.
  - Body: { token, newPassword }
  - Response 200: { ok: true }

---

### Serviço: Users

- GET /api/users
  - Descrição: Lista usuários (paginação, filtros: role, status, q).
  - Query: ?page=&limit=&q=&role=&status=
  - Auth: Bearer (admin)
  - Response 200: { data: [ { id, name, email, role, status, createdAt } ], meta: { total, page, limit } }

- GET /api/users/:id
  - Descrição: Recupera um usuário por id.
  - Auth: Bearer (admin or owner)
  - Response 200: { id, name, email, role, status, createdAt, updatedAt }

- POST /api/users
  - Descrição: Cria novo usuário.
  - Body: { name, email, password?, role }
  - Response 201: { id, name, email, role }

- PUT /api/users/:id
  - Descrição: Atualiza dados do usuário.
  - Body: { name?, email?, role?, status? }
  - Auth: Bearer (admin or owner)
  - Response 200: usuário atualizado

- PATCH /api/users/:id/password
  - Descrição: Atualiza senha do usuário (admin ou fluxo de troca de senha).
  - Body: { oldPassword?, newPassword }
  - Response 204

- DELETE /api/users/:id
  - Descrição: Remove (ou marca como inativo) usuário.
  - Response 204

---

### Serviço: Destinations (Destinos/Tourism)

- GET /api/destinations
  - Descrição: Lista destinos com filtros (categoria, q, bbox, bounds, featured, city).
  - Query: ?page=&limit=&q=&category=&lat=&lng=&radius=&sort=
  - Response 200: { data: [ { id, title, slug, lat, lng, category, summary, images:[...], rating } ], meta }

- GET /api/destinations/:id
  - Descrição: Recupera destino por id (detalhes completos).
  - Response 200: { id, title, description, lat, lng, category, images, openingHours, contact }

- POST /api/destinations
  - Descrição: Cria novo destino.
  - Body: { title, description, lat, lng, category, images[] (ids), tags[] }
  - Response 201: created resource

- PUT /api/destinations/:id
  - Descrição: Atualiza destino.
  - Body: campos editáveis
  - Response 200

- DELETE /api/destinations/:id
  - Descrição: Remove destino (soft-delete recomendado).
  - Response 204

- POST /api/destinations/:id/images
  - Descrição: Upload de imagem para destino (multipart/form-data).
  - Body: file
  - Response 201: { id, url, width, height }

---

### Serviço: Map / Markers

- GET /api/markers
  - Descrição: Lista marcadores (pontos de interesse) — pode espelhar destinos ou ser tabela separada.
  - Query: ?bbox=lngMin,latMin,lngMax,latMax & category & limit
  - Response 200: { data: [ { id, title, lat, lng, category, destinationId? } ] }

- POST /api/markers
  - Descrição: Cria marcador custom (usado pelo painel para anotações rápidas).
  - Body: { title, lat, lng, category, meta }
  - Response 201

- PUT /api/markers/:id
  - Descrição: Atualiza marcador.
  - Response 200

- DELETE /api/markers/:id
  - Descrição: Remove marcador.
  - Response 204

---

### Serviço: Notifications

- GET /api/notifications
  - Descrição: Lista notificações (paginação, lidas/não lidas)
  - Response 200: { data: [ { id, title, body, type, recipients, read, createdAt } ], meta }

- POST /api/notifications/send
  - Descrição: Envia notificação (push/email/in-app) para destinatários.
  - Body: { title, body, type: 'email'|'push'|'inapp', recipients: [userId|role|email], meta }
  - Response 202: { jobId }

- PATCH /api/notifications/:id/read
  - Descrição: Marca como lida.
  - Response 204

Realtime
- WS /ws/notifications (opcional)
  - Descrição: WebSocket para push em tempo real de notificações/alerts.

---

### Serviço: Machine Learning (Jobs)

- GET /api/ml/jobs
  - Descrição: Lista jobs de ML (status, tipo, created, finished)
  - Response 200: { data: [ { id, type, status, progress, resultUrl? } ], meta }

- POST /api/ml/jobs
  - Descrição: Submete novo job (por exemplo: re-treinar recomendação, gerar embeddings)
  - Body: { type, payload }
  - Response 202: { jobId }

- GET /api/ml/jobs/:id
  - Descrição: Status e logs do job.
  - Response 200: { id, type, status: 'pending'|'running'|'failed'|'finished', progress, logs[], result }

- POST /api/ml/jobs/:id/cancel
  - Descrição: Cancela job em execução.
  - Response 200

---

### Serviço: Monitoring / Metrics

- GET /api/monitoring/metrics
  - Descrição: Métricas agregadas (ultima hora, 24h, 30d) para dashboards.
  - Query: ?range=1h|24h|30d&metrics=users,requests,errors
  - Response 200: { metrics: { users: [...], requests: [...], errors: [...] } }

- GET /api/health
  - Descrição: Health check (DB, cache, dependencies).
  - Response 200: { status: 'ok', checks: { db: 'ok', redis: 'ok' } }

---

### Serviço: Dashboard / Stats

- GET /api/stats/overview
  - Descrição: KPIs principais usados na dashboard (users, activeUsers, destinationsCount, uptime)
  - Response 200: { users, activeUsers, destinations, uptime, recentActivity: [...] }

- GET /api/stats/activity
  - Descrição: Atividade recente (logs, audit) para preencher feeds/graphs
  - Query: ?limit=

---

### Serviço: Settings / Config

- GET /api/settings
  - Descrição: Recupera configurações da aplicação (theme, features flags, i18n default)
  - Response 200: { settings: { theme, defaultLang, features: { ... } } }

- PUT /api/settings
  - Descrição: Atualiza configurações globais (admin only)
  - Body: { settings }
  - Response 200

---

### Serviço: Files / Uploads

- POST /api/uploads
  - Descrição: Upload genérico (imagens, assets). Retorna URL pública ou rota protegida.
  - Body: multipart/form-data { file }
  - Response 201: { id, url, contentType, size }

- DELETE /api/uploads/:id
  - Descrição: Remove arquivo (soft/hard delete conforme política).
  - Response 204

---

### Serviço: Search

- GET /api/search
  - Descrição: Busca unificada (destinos, usuários, etc.)
  - Query: ?q=&type=users|destinations|all&page=&limit=
  - Response 200: { results: [ { type, id, title, snippet } ], meta }

---

### Padrões de resposta (exemplos)

- Sucesso com dados (200):
```json
{
  "data": [...],
  "meta": { "total": 123, "page": 1, "limit": 20 }
}
```

- Erro (4xx/5xx):
```json
{
  "error": { "code": "invalid_request", "message": "Campo X é obrigatório", "details": {...} }
}
```

---

Recomendações operacionais
- Documentar autenticação (refresh tokens, expiração). Preferir refresh tokens rotativos.
- Usar HATEOAS links simples nos recursos quando conveniente (links para editar/excluir).
- Versão da API: expor `/api/v1/...` para permitir evolução.
- Paginação consistente e indexação (search, filters) para performance.
- Monitorar endpoints críticos e configurar alertas (p.ex.: /api/auth/login falhas em > X%).
- Para envio de notificações em massa, usar jobs assíncronos (fila) e retornar jobId.

---

### Próximos passos opcionais
- Gerar um arquivo OpenAPI (YAML/JSON) baseado neste esboço;
- Criar exemplos de payloads TypeScript (interfaces) para consumir a API no frontend;
- Implementar clientes leves (fetch wrappers) em `src/lib/api.ts` ou hooks (React Query) para cada serviço.

Fim.