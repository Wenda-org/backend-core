# ✅ Checklist Completa de Rotas - Wenda Backend API

**Projeto:** Wenda Tourism Platform  
**Versão:** 1.0.0  
**Data:** 12 de Novembro de 2025  
**Banco de Dados:** 17 tabelas (ref: `docs/bd.json`)

---

## 📊 Resumo Executivo

| Grupo de Rotas | Total | Mobile | Web Admin | Autenticação |
|----------------|-------|--------|-----------|--------------|
| **Autenticação** | 4 | ✅ | ✅ | ❌ |
| **Categorias** | 1 | ✅ | ❌ | ❌ |
| **Destinos** | 5 | ✅ | ❌ | ❌/✅ |
| **Avaliações** | 4 | ✅ | ❌ | ✅ |
| **Favoritos** | 3 | ✅ | ❌ | ✅ |
| **Viagens/Trips** | 8 | ✅ | ❌ | ✅ |
| **Perfil do Usuário** | 4 | ✅ | ❌ | ✅ |
| **Busca** | 2 | ✅ | ❌ | ❌ |
| **Mapa** | 2 | ✅ | ❌ | ❌ |
| **Admin Web** | 15 | ❌ | ✅ | ✅ |
| **TOTAL** | **48** | **35** | **15** | **33** |

---

## 🔐 1. AUTENTICAÇÃO (4 rotas)

**Objetivo:** Gerenciar registro, login, logout e OAuth  
**Arquivo:** `app/routes/auth.py`  
**Tabelas:** `users`, `password_resets`

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 1.1 | `POST` | `/auth/register` | Criar nova conta de usuário | ❌ | ✅ | ✅ |
| 1.2 | `POST` | `/auth/login` | Login com email/senha | ❌ | ✅ | ✅ |
| 1.3 | `POST` | `/auth/logout` | Invalidar token JWT | ✅ | ✅ | ✅ |
| 1.4 | `POST` | `/auth/google` | Login com Google OAuth | ❌ | ✅ | ✅ |

### 🔹 Detalhes das Rotas

#### 1.1 POST `/auth/register`
```python
# Request
{
  "name": "string (min: 3, max: 100)",
  "email": "string (valid email)",
  "password": "string (min: 8)",
  "confirm_password": "string"
}

# Response 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {...},
    "access_token": "jwt_token",
    "token_type": "Bearer"
  }
}
```

#### 1.2 POST `/auth/login`
```python
# Request
{
  "email": "string",
  "password": "string"
}

# Response 200
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "jwt_token",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

#### 1.3 POST `/auth/logout`
```python
# Headers: Authorization: Bearer {token}
# Response 200
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 1.4 POST `/auth/google`
```python
# Request
{
  "id_token": "google_id_token"
}

# Response 200
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "jwt_token"
  }
}
```

---

## 📂 2. CATEGORIAS (1 rota)

**Objetivo:** Listar categorias de destinos  
**Arquivo:** `app/routes/categories.py`  
**Tabelas:** `categories`

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 2.1 | `GET` | `/categories` | Listar todas categorias ativas | ❌ | ✅ | ❌ |

### 🔹 Detalhes das Rotas

#### 2.1 GET `/categories`
```python
# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Natural",
      "slug": "natural",
      "icon": "leaf",
      "color": "#10B981",
      "destination_count": 45,
      "description": "Praias, montanhas, parques..."
    }
  ]
}
```

---

## 🏝️ 3. DESTINOS (5 rotas)

**Objetivo:** Explorar destinos turísticos  
**Arquivo:** `app/routes/destinations.py`  
**Tabelas:** `destinations`, `destination_images`, `categories`

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 3.1 | `GET` | `/destinations` | Listar destinos com filtros/paginação | ❌ | ✅ | ❌ |
| 3.2 | `GET` | `/destinations/{id}` | Detalhes completos de um destino | ❌ | ✅ | ❌ |
| 3.3 | `GET` | `/destinations/{id}/reviews` | Reviews de um destino | ❌ | ✅ | ❌ |
| 3.4 | `GET` | `/destinations/featured` | Destinos em destaque (home) | ❌ | ✅ | ❌ |
| 3.5 | `GET` | `/destinations/recommended` | Recomendações personalizadas | ❌/✅ | ✅ | ❌ |

### 🔹 Detalhes das Rotas

#### 3.1 GET `/destinations`
```python
# Query Params
?page=1
&per_page=20
&category=natural
&search=fortaleza
&min_rating=4.0
&latitude=-8.8
&longitude=13.2
&max_distance=50
&sort_by=distance|rating|popularity|name

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Fortaleza de São Miguel",
      "slug": "fortaleza-sao-miguel",
      "description": "Historic fortress...",
      "location": "Luanda",
      "province": "Luanda",
      "category": "historical",
      "rating": 4.5,
      "review_count": 342,
      "images": [...],
      "coordinate": {
        "latitude": -8.8057,
        "longitude": 13.2343
      },
      "distance": 5.2,
      "is_favorite": false
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

#### 3.2 GET `/destinations/{id}`
```python
# Path: id (UUID ou slug)
# Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Fortaleza de São Miguel",
    "slug": "fortaleza-sao-miguel",
    "description": "Short description",
    "long_description": "Detailed history...",
    "location": "Luanda",
    "province": "Luanda",
    "address": "Rua...",
    "category": "historical",
    "rating": 4.5,
    "review_count": 342,
    "images": [...],
    "coordinate": {...},
    "opening_hours": "Mon-Sat: 9:00-17:00",
    "ticket_price": "500 Kz",
    "contact": {
      "phone": "+244...",
      "email": "info@...",
      "website": "https://..."
    },
    "amenities": ["parking", "wifi", "restaurant"],
    "accessibility": ["wheelchair", "elevator"],
    "nearby_destinations": [...],
    "is_favorite": false
  }
}
```

#### 3.3 GET `/destinations/{id}/reviews`
```python
# Query Params
?page=1
&per_page=20
&sort_by=recent|rating|helpful

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "name": "Maria Silva",
        "avatar_url": "..."
      },
      "rating": 5,
      "comment": "Amazing!",
      "images": ["url1", "url2"],
      "helpful_count": 12,
      "is_helpful": false,
      "created_at": "ISO8601"
    }
  ],
  "meta": {...}
}
```

#### 3.4 GET `/destinations/featured`
```python
# Query Params
?limit=10

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "...",
      "location": "...",
      "category": "...",
      "rating": 4.5,
      "image_url": "...",
      "coordinate": {...}
    }
  ]
}
```

#### 3.5 GET `/destinations/recommended`
```python
# Query Params (opcional)
?limit=10
&latitude=-8.8
&longitude=13.2

# Headers (opcional): Authorization: Bearer {token}

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "...",
      "category": "...",
      "rating": 4.8,
      "image_url": "...",
      "distance": 25.5,
      "recommendation_reason": "Based on your interests"
    }
  ]
}
```

---

## ⭐ 4. AVALIAÇÕES (4 rotas)

**Objetivo:** Gerenciar reviews de destinos  
**Arquivo:** `app/routes/reviews.py`  
**Tabelas:** `reviews`, `review_images`, `review_helpful`

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 4.1 | `POST` | `/reviews` | Criar nova avaliação | ✅ | ✅ | ❌ |
| 4.2 | `PUT` | `/reviews/{id}` | Atualizar própria avaliação | ✅ | ✅ | ❌ |
| 4.3 | `DELETE` | `/reviews/{id}` | Deletar própria avaliação | ✅ | ✅ | ❌ |
| 4.4 | `POST` | `/reviews/{id}/helpful` | Marcar review como útil | ✅ | ✅ | ❌ |

### 🔹 Detalhes das Rotas

#### 4.1 POST `/reviews`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "destination_id": "uuid",
  "rating": 5,
  "comment": "string (min: 10, max: 1000)",
  "images": ["base64_1", "base64_2"]  // opcional
}

# Response 201
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "uuid",
    "destination_id": "uuid",
    "rating": 5,
    "comment": "...",
    "images": ["url1", "url2"],
    "created_at": "ISO8601"
  }
}

# Errors
# 409 - User already reviewed this destination
```

#### 4.2 PUT `/reviews/{id}`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "rating": 4,
  "comment": "Updated comment"
}

# Response 200
{
  "success": true,
  "message": "Review updated successfully",
  "data": {...}
}
```

#### 4.3 DELETE `/reviews/{id}`
```python
# Headers: Authorization: Bearer {token}
# Response 200
{
  "success": true,
  "message": "Review deleted successfully"
}
```

#### 4.4 POST `/reviews/{id}/helpful`
```python
# Headers: Authorization: Bearer {token}
# Response 200
{
  "success": true,
  "message": "Marked as helpful",
  "data": {
    "helpful_count": 13
  }
}
```

---

## ❤️ 5. FAVORITOS (3 rotas)

**Objetivo:** Gerenciar destinos favoritos  
**Arquivo:** `app/routes/favorites.py`  
**Tabelas:** `favorites`

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 5.1 | `GET` | `/favorites` | Listar favoritos do usuário | ✅ | ✅ | ❌ |
| 5.2 | `POST` | `/favorites` | Adicionar aos favoritos | ✅ | ✅ | ❌ |
| 5.3 | `DELETE` | `/favorites/{destination_id}` | Remover dos favoritos | ✅ | ✅ | ❌ |

### 🔹 Detalhes das Rotas

#### 5.1 GET `/favorites`
```python
# Headers: Authorization: Bearer {token}
# Query Params
?page=1
&per_page=20

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "destination": {
        "id": "uuid",
        "name": "...",
        "location": "...",
        "category": "...",
        "rating": 4.5,
        "image_url": "...",
        "coordinate": {...}
      },
      "created_at": "ISO8601"
    }
  ],
  "meta": {
    "total": 15
  }
}
```

#### 5.2 POST `/favorites`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "destination_id": "uuid"
}

# Response 201
{
  "success": true,
  "message": "Destination added to favorites",
  "data": {
    "id": "uuid",
    "destination_id": "uuid",
    "created_at": "ISO8601"
  }
}
```

#### 5.3 DELETE `/favorites/{destination_id}`
```python
# Headers: Authorization: Bearer {token}
# Path: destination_id (UUID)

# Response 200
{
  "success": true,
  "message": "Destination removed from favorites"
}
```

---

## 🗺️ 6. VIAGENS/TRIPS (8 rotas)

**Objetivo:** Planejar viagens com múltiplos destinos  
**Arquivo:** `app/routes/trips.py`  
**Tabelas:** `trips`, `trip_destinations`

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 6.1 | `GET` | `/trips` | Listar viagens do usuário | ✅ | ✅ | ❌ |
| 6.2 | `POST` | `/trips` | Criar nova viagem | ✅ | ✅ | ❌ |
| 6.3 | `GET` | `/trips/{id}` | Detalhes de uma viagem | ✅ | ✅ | ❌ |
| 6.4 | `PUT` | `/trips/{id}` | Atualizar viagem | ✅ | ✅ | ❌ |
| 6.5 | `DELETE` | `/trips/{id}` | Deletar viagem | ✅ | ✅ | ❌ |
| 6.6 | `POST` | `/trips/{id}/destinations` | Adicionar destino à viagem | ✅ | ✅ | ❌ |
| 6.7 | `DELETE` | `/trips/{trip_id}/destinations/{dest_id}` | Remover destino da viagem | ✅ | ✅ | ❌ |
| 6.8 | `PUT` | `/trips/{id}/destinations/reorder` | Reordenar destinos | ✅ | ✅ | ❌ |

### 🔹 Detalhes das Rotas

#### 6.1 GET `/trips`
```python
# Headers: Authorization: Bearer {token}
# Query Params
?status=upcoming|ongoing|completed|all  // default: all

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Angola Adventure 2025",
      "start_date": "2025-12-01",
      "end_date": "2025-12-15",
      "notes": "...",
      "status": "upcoming",
      "destinations": [
        {
          "id": "uuid",
          "destination": {...},
          "order": 1,
          "visit_date": "2025-12-02",
          "notes": "..."
        }
      ],
      "created_at": "ISO8601"
    }
  ]
}
```

#### 6.2 POST `/trips`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "name": "string (min: 3, max: 100)",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "notes": "string (max: 500)"  // opcional
}

# Response 201
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "id": "uuid",
    "name": "Angola Adventure 2025",
    "start_date": "2025-12-01",
    "end_date": "2025-12-15",
    "status": "upcoming",
    "destinations": []
  }
}
```

#### 6.3 GET `/trips/{id}`
```python
# Headers: Authorization: Bearer {token}
# Path: id (UUID)

# Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "...",
    "start_date": "...",
    "end_date": "...",
    "notes": "...",
    "status": "upcoming",
    "destinations": [...],
    "stats": {
      "total_destinations": 5,
      "total_days": 14,
      "estimated_cost": 50000
    }
  }
}
```

#### 6.4 PUT `/trips/{id}`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "name": "string",  // opcional
  "start_date": "YYYY-MM-DD",  // opcional
  "end_date": "YYYY-MM-DD",  // opcional
  "notes": "string"  // opcional
}

# Response 200
{
  "success": true,
  "message": "Trip updated successfully",
  "data": {...}
}
```

#### 6.5 DELETE `/trips/{id}`
```python
# Headers: Authorization: Bearer {token}
# Response 200
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

#### 6.6 POST `/trips/{id}/destinations`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "destination_id": "uuid",
  "visit_date": "YYYY-MM-DD",  // opcional
  "notes": "string (max: 200)"  // opcional
}

# Response 201
{
  "success": true,
  "message": "Destination added to trip",
  "data": {
    "id": "uuid",
    "trip_id": "uuid",
    "destination_id": "uuid",
    "order": 3,
    "visit_date": "2025-12-05"
  }
}
```

#### 6.7 DELETE `/trips/{trip_id}/destinations/{destination_id}`
```python
# Headers: Authorization: Bearer {token}
# Response 200
{
  "success": true,
  "message": "Destination removed from trip"
}
```

#### 6.8 PUT `/trips/{id}/destinations/reorder`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "destinations": [
    {"id": "uuid", "order": 1},
    {"id": "uuid", "order": 2},
    {"id": "uuid", "order": 3}
  ]
}

# Response 200
{
  "success": true,
  "message": "Destinations reordered successfully"
}
```

---

## 👤 7. PERFIL DO USUÁRIO (4 rotas)

**Objetivo:** Gerenciar perfil e preferências  
**Arquivo:** `app/routes/user_routes.py`  
**Tabelas:** `users`, `user_preferences`

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 7.1 | `GET` | `/user/profile` | Obter perfil do usuário | ✅ | ✅ | ❌ |
| 7.2 | `PUT` | `/user/profile` | Atualizar perfil | ✅ | ✅ | ❌ |
| 7.3 | `PUT` | `/user/preferences` | Atualizar preferências | ✅ | ✅ | ❌ |
| 7.4 | `DELETE` | `/user/account` | Deletar conta | ✅ | ✅ | ❌ |

### 🔹 Detalhes das Rotas

#### 7.1 GET `/user/profile`
```python
# Headers: Authorization: Bearer {token}
# Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "avatar_url": "...",
    "phone": "...",
    "bio": "...",
    "preferences": {
      "language": "pt",
      "notifications_enabled": true,
      "favorite_categories": ["natural", "historical"]
    },
    "stats": {
      "visited_destinations": 12,
      "reviews_count": 5,
      "trips_count": 3,
      "favorites_count": 15
    },
    "created_at": "ISO8601"
  }
}
```

#### 7.2 PUT `/user/profile`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "name": "string",  // opcional
  "phone": "string",  // opcional
  "bio": "string (max: 500)",  // opcional
  "avatar": "base64_string"  // opcional
}

# Response 200
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "name": "...",
    "avatar_url": "...",
    "updated_at": "ISO8601"
  }
}
```

#### 7.3 PUT `/user/preferences`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "language": "pt|en",
  "notifications_enabled": true,
  "favorite_categories": ["natural", "cultural"]
}

# Response 200
{
  "success": true,
  "message": "Preferences updated successfully"
}
```

#### 7.4 DELETE `/user/account`
```python
# Headers: Authorization: Bearer {token}
# Request
{
  "password": "string"  // confirmação
}

# Response 200
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🔍 8. BUSCA (2 rotas)

**Objetivo:** Busca global e autocomplete  
**Arquivo:** `app/routes/search.py`  
**Tabelas:** `destinations`

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 8.1 | `GET` | `/search` | Busca global por destinos | ❌ | ✅ | ❌ |
| 8.2 | `GET` | `/search/suggestions` | Sugestões (autocomplete) | ❌ | ✅ | ❌ |

### 🔹 Detalhes das Rotas

#### 8.1 GET `/search`
```python
# Query Params
?q=fortaleza  // (min: 2 chars)
&type=all|destinations|locations  // default: all
&limit=20

# Response 200
{
  "success": true,
  "data": {
    "destinations": [
      {
        "id": "uuid",
        "name": "Fortaleza de São Miguel",
        "location": "Luanda",
        "category": "historical",
        "image_url": "...",
        "rating": 4.5
      }
    ],
    "locations": [
      {
        "name": "Luanda",
        "province": "Luanda",
        "destination_count": 45
      }
    ]
  }
}
```

#### 8.2 GET `/search/suggestions`
```python
# Query Params
?q=fort  // (min: 2 chars)
&limit=10

# Response 200
{
  "success": true,
  "data": [
    {
      "text": "Fortaleza de São Miguel",
      "type": "destination",
      "id": "uuid"
    },
    {
      "text": "Luanda",
      "type": "location"
    }
  ]
}
```

---

## 🗺️ 9. MAPA (2 rotas)

**Objetivo:** Exibir destinos no mapa  
**Arquivo:** `app/routes/map.py`  
**Tabelas:** `destinations`

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 9.1 | `GET` | `/map/destinations` | Destinos dentro de bounds | ❌ | ✅ | ❌ |
| 9.2 | `GET` | `/map/nearby` | Destinos próximos | ❌ | ✅ | ❌ |

### 🔹 Detalhes das Rotas

#### 9.1 GET `/map/destinations`
```python
# Query Params
?bounds=-9.0,13.0,-8.0,14.0  // lat_min,lon_min,lat_max,lon_max
&category=natural  // opcional
&min_rating=4.0  // opcional

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "...",
      "location": "...",
      "category": "...",
      "rating": 4.5,
      "image_url": "...",
      "coordinate": {
        "latitude": -8.8057,
        "longitude": 13.2343
      }
    }
  ]
}
```

#### 9.2 GET `/map/nearby`
```python
# Query Params
?latitude=-8.8
&longitude=13.2
&radius=50  // km (default: 50, max: 500)
&limit=20
&category=natural  // opcional

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "...",
      "location": "...",
      "category": "...",
      "rating": 4.5,
      "image_url": "...",
      "coordinate": {...},
      "distance": 5.2  // km
    }
  ]
}
```

---

## 🛡️ 10. ADMIN WEB (15 rotas)

**Objetivo:** Dashboard de gestão para administradores  
**Arquivo:** `app/routes/admin.py`  
**Tabelas:** Todas (principalmente `destinations`, `categories`, `reviews`, `users`)  
**Acesso:** Apenas usuários com `role` = "admin" ou "editor"

| # | Método | Endpoint | Descrição | Auth | Mobile | Web |
|---|--------|----------|-----------|------|--------|-----|
| 10.1 | `GET` | `/admin/dashboard` | Estatísticas gerais | ✅ Admin | ❌ | ✅ |
| 10.2 | `GET` | `/admin/users` | Listar usuários | ✅ Admin | ❌ | ✅ |
| 10.3 | `PUT` | `/admin/users/{id}` | Atualizar usuário | ✅ Admin | ❌ | ✅ |
| 10.4 | `DELETE` | `/admin/users/{id}` | Deletar usuário | ✅ Admin | ❌ | ✅ |
| 10.5 | `GET` | `/admin/destinations` | Listar destinos (admin) | ✅ Admin | ❌ | ✅ |
| 10.6 | `POST` | `/admin/destinations` | Criar destino | ✅ Admin | ❌ | ✅ |
| 10.7 | `PUT` | `/admin/destinations/{id}` | Atualizar destino | ✅ Admin | ❌ | ✅ |
| 10.8 | `DELETE` | `/admin/destinations/{id}` | Deletar destino | ✅ Admin | ❌ | ✅ |
| 10.9 | `PUT` | `/admin/destinations/{id}/toggle-featured` | Toggle destaque | ✅ Admin | ❌ | ✅ |
| 10.10 | `GET` | `/admin/categories` | Listar categorias (admin) | ✅ Admin | ❌ | ✅ |
| 10.11 | `POST` | `/admin/categories` | Criar categoria | ✅ Admin | ❌ | ✅ |
| 10.12 | `PUT` | `/admin/categories/{id}` | Atualizar categoria | ✅ Admin | ❌ | ✅ |
| 10.13 | `POST` | `/admin/destinations/{id}/images` | Adicionar imagem | ✅ Admin | ❌ | ✅ |
| 10.14 | `DELETE` | `/admin/images/{id}` | Deletar imagem | ✅ Admin | ❌ | ✅ |
| 10.15 | `GET` | `/admin/reviews/pending` | Reviews pendentes | ✅ Admin | ❌ | ✅ |

### 🔹 Detalhes das Rotas

#### 10.1 GET `/admin/dashboard`
```python
# Headers: Authorization: Bearer {admin_token}
# Response 200
{
  "success": true,
  "data": {
    "stats": {
      "total_users": 1542,
      "total_destinations": 156,
      "total_reviews": 3421,
      "total_trips": 823,
      "active_users_month": 421
    },
    "recent_reviews": [...],
    "popular_destinations": [...]
  }
}
```

#### 10.2 GET `/admin/users`
```python
# Headers: Authorization: Bearer {admin_token}
# Query Params
?page=1
&per_page=50
&search=name|email
&role=viewer|editor|admin
&is_active=true|false

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "...",
      "email": "...",
      "role": "viewer",
      "is_active": true,
      "created_at": "...",
      "stats": {
        "reviews_count": 5,
        "trips_count": 2
      }
    }
  ],
  "meta": {...}
}
```

#### 10.3 PUT `/admin/users/{id}`
```python
# Headers: Authorization: Bearer {admin_token}
# Request
{
  "role": "viewer|editor|admin",
  "is_active": true
}

# Response 200
{
  "success": true,
  "message": "User updated successfully"
}
```

#### 10.4 DELETE `/admin/users/{id}`
```python
# Headers: Authorization: Bearer {admin_token}
# Response 200
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### 10.5 GET `/admin/destinations`
```python
# Headers: Authorization: Bearer {admin_token}
# Query Params
?page=1
&per_page=50
&category=uuid
&is_active=true|false
&is_featured=true|false
&search=name|location

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "...",
      "category": "...",
      "location": "...",
      "rating": 4.5,
      "review_count": 342,
      "view_count": 1234,
      "is_active": true,
      "is_featured": false,
      "created_at": "..."
    }
  ],
  "meta": {...}
}
```

#### 10.6 POST `/admin/destinations`
```python
# Headers: Authorization: Bearer {admin_token}
# Request
{
  "name": "string (required)",
  "category_id": "uuid (required)",
  "description": "string",
  "long_description": "string",
  "location": "string",
  "province": "string",
  "address": "string",
  "latitude": -8.8057,
  "longitude": 13.2343,
  "opening_hours": "Mon-Sat: 9:00-17:00",
  "ticket_price": "500 Kz",
  "phone": "+244...",
  "email": "info@...",
  "website": "https://...",
  "amenities": ["parking", "wifi"],
  "accessibility": ["wheelchair"],
  "is_featured": false
}

# Response 201
{
  "success": true,
  "message": "Destination created successfully",
  "data": {...}
}
```

#### 10.7 PUT `/admin/destinations/{id}`
```python
# Headers: Authorization: Bearer {admin_token}
# Request: same as POST (all fields optional)

# Response 200
{
  "success": true,
  "message": "Destination updated successfully"
}
```

#### 10.8 DELETE `/admin/destinations/{id}`
```python
# Headers: Authorization: Bearer {admin_token}
# Response 200
{
  "success": true,
  "message": "Destination deleted successfully"
}
```

#### 10.9 PUT `/admin/destinations/{id}/toggle-featured`
```python
# Headers: Authorization: Bearer {admin_token}
# Response 200
{
  "success": true,
  "message": "Featured status toggled",
  "data": {
    "is_featured": true
  }
}
```

#### 10.10 GET `/admin/categories`
```python
# Headers: Authorization: Bearer {admin_token}
# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Natural",
      "slug": "natural",
      "icon": "leaf",
      "color": "#10B981",
      "is_active": true,
      "destination_count": 45,
      "created_at": "..."
    }
  ]
}
```

#### 10.11 POST `/admin/categories`
```python
# Headers: Authorization: Bearer {admin_token}
# Request
{
  "name": "string (required)",
  "description": "string",
  "icon": "string",
  "color": "#hex",
  "display_order": 1
}

# Response 201
{
  "success": true,
  "message": "Category created successfully",
  "data": {...}
}
```

#### 10.12 PUT `/admin/categories/{id}`
```python
# Headers: Authorization: Bearer {admin_token}
# Request: same as POST (all fields optional)

# Response 200
{
  "success": true,
  "message": "Category updated successfully"
}
```

#### 10.13 POST `/admin/destinations/{id}/images`
```python
# Headers: Authorization: Bearer {admin_token}
# Request
{
  "image": "base64_string",
  "caption": "string",
  "is_main": false
}

# Response 201
{
  "success": true,
  "message": "Image added successfully",
  "data": {
    "id": "uuid",
    "url": "...",
    "thumbnail_url": "...",
    "is_main": false
  }
}
```

#### 10.14 DELETE `/admin/images/{id}`
```python
# Headers: Authorization: Bearer {admin_token}
# Response 200
{
  "success": true,
  "message": "Image deleted successfully"
}
```

#### 10.15 GET `/admin/reviews/pending`
```python
# Headers: Authorization: Bearer {admin_token}
# Query Params
?page=1
&per_page=50

# Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {...},
      "destination": {...},
      "rating": 5,
      "comment": "...",
      "created_at": "...",
      "is_verified": false
    }
  ],
  "meta": {...}
}
```

---

## 📋 Checklist de Implementação

### ✅ Prioridade 1 - MVP Essencial (Mobile)

- [ ] **Autenticação (4 rotas)**
  - [ ] 1.1 POST `/auth/register`
  - [ ] 1.2 POST `/auth/login`
  - [ ] 1.3 POST `/auth/logout`
  - [ ] 1.4 POST `/auth/google`

- [ ] **Destinos (5 rotas)**
  - [ ] 3.1 GET `/destinations` (listagem com filtros)
  - [ ] 3.2 GET `/destinations/{id}` (detalhes)
  - [ ] 3.3 GET `/destinations/{id}/reviews`
  - [ ] 3.4 GET `/destinations/featured`
  - [ ] 3.5 GET `/destinations/recommended`

- [ ] **Categorias (1 rota)**
  - [ ] 2.1 GET `/categories`

- [ ] **Favoritos (3 rotas)**
  - [ ] 5.1 GET `/favorites`
  - [ ] 5.2 POST `/favorites`
  - [ ] 5.3 DELETE `/favorites/{destination_id}`

- [ ] **Perfil (2 rotas)**
  - [ ] 7.1 GET `/user/profile`
  - [ ] 7.2 PUT `/user/profile`

**Total Prioridade 1: 15 rotas**

---

### ✅ Prioridade 2 - Funcionalidades Importantes

- [ ] **Viagens (8 rotas)**
  - [ ] 6.1 GET `/trips`
  - [ ] 6.2 POST `/trips`
  - [ ] 6.3 GET `/trips/{id}`
  - [ ] 6.4 PUT `/trips/{id}`
  - [ ] 6.5 DELETE `/trips/{id}`
  - [ ] 6.6 POST `/trips/{id}/destinations`
  - [ ] 6.7 DELETE `/trips/{trip_id}/destinations/{dest_id}`
  - [ ] 6.8 PUT `/trips/{id}/destinations/reorder`

- [ ] **Avaliações (4 rotas)**
  - [ ] 4.1 POST `/reviews`
  - [ ] 4.2 PUT `/reviews/{id}`
  - [ ] 4.3 DELETE `/reviews/{id}`
  - [ ] 4.4 POST `/reviews/{id}/helpful`

- [ ] **Busca (2 rotas)**
  - [ ] 8.1 GET `/search`
  - [ ] 8.2 GET `/search/suggestions`

- [ ] **Mapa (2 rotas)**
  - [ ] 9.1 GET `/map/destinations`
  - [ ] 9.2 GET `/map/nearby`

**Total Prioridade 2: 16 rotas**

---

### ✅ Prioridade 3 - Admin Web Dashboard

- [ ] **Admin (15 rotas)**
  - [ ] 10.1 GET `/admin/dashboard`
  - [ ] 10.2 GET `/admin/users`
  - [ ] 10.3 PUT `/admin/users/{id}`
  - [ ] 10.4 DELETE `/admin/users/{id}`
  - [ ] 10.5 GET `/admin/destinations`
  - [ ] 10.6 POST `/admin/destinations`
  - [ ] 10.7 PUT `/admin/destinations/{id}`
  - [ ] 10.8 DELETE `/admin/destinations/{id}`
  - [ ] 10.9 PUT `/admin/destinations/{id}/toggle-featured`
  - [ ] 10.10 GET `/admin/categories`
  - [ ] 10.11 POST `/admin/categories`
  - [ ] 10.12 PUT `/admin/categories/{id}`
  - [ ] 10.13 POST `/admin/destinations/{id}/images`
  - [ ] 10.14 DELETE `/admin/images/{id}`
  - [ ] 10.15 GET `/admin/reviews/pending`

- [ ] **Usuário Extra (2 rotas)**
  - [ ] 7.3 PUT `/user/preferences`
  - [ ] 7.4 DELETE `/user/account`

**Total Prioridade 3: 17 rotas**

---

## 📊 Distribuição Final

| Prioridade | Quantidade | Descrição |
|------------|-----------|-----------|
| **P1 - MVP** | 15 rotas | Autenticação + Destinos + Favoritos + Perfil |
| **P2 - Importante** | 16 rotas | Trips + Reviews + Busca + Mapa |
| **P3 - Admin** | 17 rotas | Dashboard Web + Gestão Completa |
| **TOTAL** | **48 rotas** | API Completa |

---

## 🔑 Referências Técnicas

### Banco de Dados
- **Arquivo:** `docs/bd.json`
- **Tabelas:** 17 (users, destinations, categories, reviews, favorites, trips, etc)
- **Primary Keys:** UUID
- **Soft Delete:** Coluna `deleted_at` (timestamp)

### Documentação
- **API Spec:** `docs/api-specification.md`
- **Implementation Guide:** `docs/IMPLEMENTATION_GUIDE.md`
- **Database Schema:** `docs/database-schema.md`

### Autenticação
- **Tipo:** JWT Bearer Token
- **Expiração:** 3600 segundos (1 hora)
- **Roles:** "viewer", "editor", "admin" (string, não enum)

### Geolocalização
- **Fórmula:** Haversine
- **Unidade:** Quilômetros (km)
- **Tipos:** Float (não Numeric)

---

## ✅ Status de Implementação

**Situação Atual:** Projeto apagado - implementar do zero  
**Próximos Passos:**
1. Criar estrutura de pastas (`app/models`, `app/routes`, `app/schemas`, etc)
2. Configurar banco de dados e JWT (`app/core/config.py`, `app/core/security.py`)
3. Implementar modelos SQLAlchemy baseados em `docs/bd.json`
4. Criar schemas Pydantic
5. Implementar rotas seguindo esta checklist

**Ordem de Implementação Sugerida:**
1. ✅ P1 - MVP (15 rotas) - Testar mobile básico
2. ✅ P2 - Importante (16 rotas) - Features completas mobile
3. ✅ P3 - Admin (17 rotas) - Dashboard web

---

**Documento criado em:** 12 de Novembro de 2025  
**Última atualização:** 12 de Novembro de 2025  
**Versão:** 1.0.0
