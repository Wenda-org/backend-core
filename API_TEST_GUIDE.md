# 🧪 Guia de Testes das APIs - Wenda Backend

## Pré-requisitos

1. Servidor rodando: `npm run start:dev`
2. Documentação Swagger: http://localhost:3000/api/docs
3. Ferramenta de testes: Thunder Client, Postman, ou curl

## 📋 Ordem de Testes Recomendada

### 1. **Health Check** ✅
```bash
GET http://localhost:3000/api/health
```

Resposta esperada:
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "...",
  "uptime": "...",
  "environment": "development"
}
```

---

### 2. **Auth - Registro** 👤
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

Salve o `access_token` retornado! Será usado nas próximas requisições.

---

### 3. **Auth - Login** 🔑
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

---

### 4. **Categories - Listar** 📁
```bash
GET http://localhost:3000/api/categories
```

Resposta:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Natural",
      "slug": "natural",
      "icon": "🏞️"
    }
  ]
}
```

**Salve um `categoryId` para usar ao criar destinos!**

---

### 5. **Destinations - Criar** (Admin) 🏝️
```bash
POST http://localhost:3000/api/destinations
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Quedas de Kalandula",
  "slug": "quedas-kalandula",
  "description": "Uma das maiores e mais belas quedas de água de África",
  "location": "Kalandula",
  "province": "Malanje",
  "categoryId": "UUID_DA_CATEGORIA",
  "latitude": -9.3167,
  "longitude": 15.8833,
  "openingHours": "08:00 - 18:00",
  "ticketPrice": "500 AOA",
  "amenities": ["parking", "guide", "restaurant"],
  "isFeatured": true
}
```

**Salve o `destinationId` retornado!**

---

### 6. **Destinations - Listar com Filtros** 🔍
```bash
# Listar todos
GET http://localhost:3000/api/destinations

# Com filtros
GET http://localhost:3000/api/destinations?province=Malanje&page=1&perPage=10

# Busca
GET http://localhost:3000/api/destinations?search=kalandula

# Por categoria
GET http://localhost:3000/api/destinations?categoryId=UUID_DA_CATEGORIA

# Featured
GET http://localhost:3000/api/destinations/featured

# Nearby (geolocalização)
GET http://localhost:3000/api/destinations?lat=-9.3167&lon=15.8833&maxDistance=50

# Recomendados (autenticado)
GET http://localhost:3000/api/destinations/recommended
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 7. **Destinations - Ver Detalhes** 👁️
```bash
GET http://localhost:3000/api/destinations/UUID_DO_DESTINO
```

Incrementa o `viewCount` automaticamente!

---

### 8. **Reviews - Criar** ⭐
```bash
POST http://localhost:3000/api/reviews
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "destinationId": "UUID_DO_DESTINO",
  "rating": 5,
  "comment": "Lugar incrível! As quedas são espetaculares e vale muito a pena visitar."
}
```

**Salve o `reviewId` retornado!**

---

### 9. **Reviews - Listar por Destino** 📝
```bash
# Lista reviews do destino
GET http://localhost:3000/api/reviews/destination/UUID_DO_DESTINO

# Com ordenação
GET http://localhost:3000/api/reviews/destination/UUID_DO_DESTINO?sortBy=rating
GET http://localhost:3000/api/reviews/destination/UUID_DO_DESTINO?sortBy=helpful
GET http://localhost:3000/api/reviews/destination/UUID_DO_DESTINO?sortBy=recent

# Com paginação
GET http://localhost:3000/api/reviews/destination/UUID_DO_DESTINO?page=1&perPage=10
```

---

### 10. **Reviews - Marcar como Útil** 👍
```bash
POST http://localhost:3000/api/reviews/UUID_DA_REVIEW/helpful
Authorization: Bearer SEU_ACCESS_TOKEN
```

Chamar novamente remove a marcação (toggle)!

---

### 11. **Reviews - Atualizar** ✏️
```bash
PUT http://localhost:3000/api/reviews/UUID_DA_REVIEW
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "rating": 4,
  "comment": "Comentário atualizado..."
}
```

Só pode atualizar suas próprias reviews!

---

### 12. **Reviews - Deletar** 🗑️
```bash
DELETE http://localhost:3000/api/reviews/UUID_DA_REVIEW
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 13. **Favorites - Adicionar** ❤️
```bash
POST http://localhost:3000/api/favorites
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "destinationId": "UUID_DO_DESTINO"
}
```

---

### 14. **Favorites - Listar** 📌
```bash
GET http://localhost:3000/api/favorites
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 15. **Favorites - Remover** 💔
```bash
DELETE http://localhost:3000/api/favorites/UUID_DO_DESTINO
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 16. **Trips - Criar Roteiro** 🗺️
```bash
POST http://localhost:3000/api/trips
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Viagem ao Norte de Angola",
  "description": "Explorando as maravilhas naturais do norte",
  "startDate": "2024-07-01",
  "endDate": "2024-07-15"
}
```

**Salve o `tripId` retornado!**

---

### 17. **Trips - Adicionar Destino ao Roteiro** ➕
```bash
POST http://localhost:3000/api/trips/UUID_DA_TRIP/destinations
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "destinationId": "UUID_DO_DESTINO",
  "dayNumber": 1,
  "notes": "Visitar pela manhã, levar protetor solar"
}
```

---

### 18. **Trips - Listar Roteiros** 📋
```bash
GET http://localhost:3000/api/trips
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 19. **Trips - Ver Detalhes** 🔎
```bash
GET http://localhost:3000/api/trips/UUID_DA_TRIP
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 20. **Trips - Atualizar** ✏️
```bash
PUT http://localhost:3000/api/trips/UUID_DA_TRIP
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Viagem Atualizada",
  "status": "ongoing"
}
```

Status possíveis: `upcoming`, `ongoing`, `completed`, `cancelled`

---

### 21. **Trips - Atualizar Destino no Roteiro** 🔧
```bash
PUT http://localhost:3000/api/trips/UUID_DA_TRIP/destinations/UUID_DO_DESTINO
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "dayNumber": 2,
  "notes": "Mudou para o segundo dia"
}
```

---

### 22. **Trips - Remover Destino do Roteiro** ➖
```bash
DELETE http://localhost:3000/api/trips/UUID_DA_TRIP/destinations/UUID_DO_DESTINO
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 23. **Trips - Deletar Roteiro** 🗑️
```bash
DELETE http://localhost:3000/api/trips/UUID_DA_TRIP
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 24. **Users - Ver Perfil** 👤
```bash
GET http://localhost:3000/api/users/profile
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 25. **Users - Atualizar Perfil** ✏️
```bash
PUT http://localhost:3000/api/users/profile
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "bio": "Amante de viagens e aventuras"
}
```

---

## 🎯 Cenário de Teste Completo

Execute na ordem:

1. ✅ Health check
2. 👤 Registrar usuário
3. 🔑 Fazer login
4. 📁 Listar categorias
5. 🏝️ Criar 3 destinos (use categoryIds diferentes)
6. 🔍 Testar filtros de destinos
7. ⭐ Criar reviews para 2 destinos
8. 👍 Marcar uma review como útil
9. ❤️ Adicionar 2 destinos aos favoritos
10. 📌 Listar favoritos
11. 🗺️ Criar um roteiro de viagem
12. ➕ Adicionar 3 destinos ao roteiro
13. 🔎 Ver detalhes do roteiro
14. 🔧 Atualizar ordem/notas de um destino no roteiro
15. ✏️ Atualizar status do roteiro para "ongoing"
16. 👤 Ver e atualizar perfil

---

## 📊 Validações Importantes

### Regras de Negócio Testadas:

1. **Reviews:**
   - ❌ Não pode criar 2 reviews para o mesmo destino
   - ❌ Rating deve ser 1-5
   - ❌ Comentário mínimo 10 caracteres
   - ✅ Rating do destino atualiza automaticamente

2. **Favorites:**
   - ❌ Não pode favoritar 2 vezes o mesmo destino
   - ✅ Remove corretamente

3. **Trips:**
   - ❌ Não pode adicionar o mesmo destino 2 vezes no roteiro
   - ✅ Só pode editar seus próprios roteiros
   - ✅ Ordenação por `displayOrder`

4. **Auth:**
   - ❌ Email deve ser único
   - ❌ Senha mínima 6 caracteres
   - ✅ JWT expira em 7 dias

---

## 🐛 Testes de Erro

Teste também cenários de erro:

```bash
# 401 Unauthorized - sem token
GET http://localhost:3000/api/users/profile

# 404 Not Found - ID inválido
GET http://localhost:3000/api/destinations/uuid-invalido

# 409 Conflict - review duplicada
POST http://localhost:3000/api/reviews
# (mesmo destinationId 2x)

# 400 Bad Request - dados inválidos
POST http://localhost:3000/api/reviews
{
  "rating": 10,  # máximo é 5
  "comment": "abc"  # mínimo 10 chars
}
```

---

## 📚 Documentação Swagger

Acesse **http://localhost:3000/api/docs** para ver:
- ✅ Todos os endpoints disponíveis
- ✅ Esquemas de request/response
- ✅ Testar direto no navegador
- ✅ Autenticar com JWT

---

## ✨ Features Implementadas

- ✅ Autenticação JWT com Passport
- ✅ CRUD completo de Categories
- ✅ CRUD completo de Destinations com filtros avançados
- ✅ Busca por texto (search)
- ✅ Filtros por província, categoria, rating
- ✅ Geolocalização (nearby destinations)
- ✅ Featured e Recommended destinations
- ✅ Sistema de Reviews com rating automático
- ✅ Reviews marcadas como úteis (helpful)
- ✅ Sistema de Favoritos
- ✅ Roteiros de viagem (Trips) com múltiplos destinos
- ✅ Gerenciamento de perfil de usuário
- ✅ Soft delete em reviews
- ✅ Paginação em todas as listagens
- ✅ Validação de DTOs
- ✅ Documentação Swagger/OpenAPI

---

## 🚀 Próximas Features

- 📸 Upload de imagens (destinos e reviews)
- 🔐 Sistema de permissões (admin/user)
- 📧 Recuperação de senha
- 🔔 Notificações
- 🌐 OAuth com Google
- ⚡ Cache com Redis
- 🛡️ Rate limiting

---

**Bons testes! 🎉**
