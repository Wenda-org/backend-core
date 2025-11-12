# 📡 API Specification - Wenda Mobile App

**Versão:** 1.0  
**Data:** 11 de Novembro de 2025  
**Responsável Mobile:** Equipe Wenda Mobile  
**Base URL:** `https://api.wenda.ao/v1`

---

## 📋 Índice

1. [Autenticação](#autenticação)
2. [Destinos Turísticos](#destinos-turísticos)
3. [Categorias](#categorias)
4. [Avaliações](#avaliações)
5. [Favoritos](#favoritos)
6. [Viagens/Trips](#viagenstrips)
7. [Usuário/Perfil](#usuárioperfil)
8. [Busca](#busca)
9. [Mapa](#mapa)
10. [Modelos de Dados](#modelos-de-dados)

---

## 🔐 Autenticação

Todas as rotas (exceto login, registro e listagens públicas) requerem autenticação via **Bearer Token**.

### Header de Autenticação
```
Authorization: Bearer {access_token}
```

---

### 1.1 POST `/auth/register`

**Objetivo:** Criar uma nova conta de usuário no aplicativo.

**Método:** `POST`

**Autenticação:** ❌ Não requerida

**Body:**
```json
{
  "name": "string (required, min: 3, max: 100)",
  "email": "string (required, valid email)",
  "password": "string (required, min: 8)",
  "confirm_password": "string (required, must match password)"
}
```

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "created_at": "ISO8601 timestamp"
    },
    "access_token": "string (JWT token)",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

**Erros:**
- `400` - Validation error (email já existe, senha fraca, etc)
- `500` - Server error

---

### 1.2 POST `/auth/login`

**Objetivo:** Autenticar usuário e obter token de acesso.

**Método:** `POST`

**Autenticação:** ❌ Não requerida

**Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "avatar_url": "string|null",
      "created_at": "ISO8601 timestamp"
    },
    "access_token": "string (JWT token)",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

**Erros:**
- `401` - Invalid credentials
- `400` - Validation error

---

### 1.3 POST `/auth/logout`

**Objetivo:** Invalidar token do usuário.

**Método:** `POST`

**Autenticação:** ✅ Bearer Token

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.4 POST `/auth/google`

**Objetivo:** Autenticação via Google OAuth.

**Método:** `POST`

**Autenticação:** ❌ Não requerida

**Body:**
```json
{
  "id_token": "string (Google ID Token)"
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "avatar_url": "string|null"
    },
    "access_token": "string",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

---

## 🏝️ Destinos Turísticos

### 2.1 GET `/destinations`

**Objetivo:** Listar todos os destinos turísticos com filtros e paginação.

**Método:** `GET`

**Autenticação:** ❌ Não requerida (público)

**Query Parameters:**
```
page=1                    (int, default: 1)
per_page=20              (int, default: 20, max: 100)
category=string          (opcional: natural, cultural, historical, adventure)
search=string            (opcional: busca por nome, descrição, localização)
min_rating=float         (opcional: 0-5)
latitude=float           (opcional: para ordenar por distância)
longitude=float          (opcional: para ordenar por distância)
max_distance=int         (opcional: distância máxima em km, requer lat/lon)
sort_by=string           (opcional: distance, rating, popularity, name)
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Fortaleza de São Miguel",
      "slug": "fortaleza-sao-miguel",
      "description": "Historic fortress with city views",
      "location": "Luanda",
      "province": "Luanda",
      "category": "historical",
      "rating": 4.5,
      "review_count": 342,
      "images": [
        {
          "id": "uuid",
          "url": "https://...",
          "thumbnail_url": "https://...",
          "is_main": true
        }
      ],
      "coordinate": {
        "latitude": -8.8057,
        "longitude": 13.2343
      },
      "distance": 5.2,
      "opening_hours": "Mon-Sat: 9:00 AM - 5:00 PM",
      "ticket_price": "500 Kz",
      "is_favorite": false,
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### 2.2 GET `/destinations/{id}`

**Objetivo:** Obter detalhes completos de um destino específico.

**Método:** `GET`

**Autenticação:** ❌ Não requerida

**Path Parameters:**
- `id` - UUID ou slug do destino

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Fortaleza de São Miguel",
    "slug": "fortaleza-sao-miguel",
    "description": "Detailed description...",
    "long_description": "Extended description with history...",
    "location": "Luanda",
    "province": "Luanda",
    "address": "Rua...",
    "category": "historical",
    "rating": 4.5,
    "review_count": 342,
    "images": [
      {
        "id": "uuid",
        "url": "https://...",
        "thumbnail_url": "https://...",
        "caption": "Main entrance",
        "is_main": true,
        "order": 1
      }
    ],
    "coordinate": {
      "latitude": -8.8057,
      "longitude": 13.2343
    },
    "opening_hours": "Mon-Sat: 9:00 AM - 5:00 PM",
    "ticket_price": "500 Kz",
    "contact": {
      "phone": "+244...",
      "email": "info@...",
      "website": "https://..."
    },
    "amenities": ["parking", "wifi", "restaurant", "guide"],
    "accessibility": ["wheelchair", "elevator"],
    "is_favorite": false,
    "nearby_destinations": [
      {
        "id": "uuid",
        "name": "string",
        "distance": 2.3,
        "image_url": "string"
      }
    ],
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
}
```

**Erros:**
- `404` - Destination not found

---

### 2.3 GET `/destinations/{id}/reviews`

**Objetivo:** Listar avaliações de um destino específico.

**Método:** `GET`

**Autenticação:** ❌ Não requerida

**Query Parameters:**
```
page=1
per_page=20
sort_by=recent|rating|helpful
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "name": "Maria Silva",
        "avatar_url": "string|null"
      },
      "rating": 5,
      "comment": "Amazing historical site!",
      "images": ["url1", "url2"],
      "helpful_count": 12,
      "is_helpful": false,
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 342
  }
}
```

---

### 2.4 GET `/destinations/featured`

**Objetivo:** Obter destinos em destaque para a home screen.

**Método:** `GET`

**Autenticação:** ❌ Não requerida

**Query Parameters:**
```
limit=10 (int, default: 10)
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "location": "string",
      "category": "string",
      "rating": 4.5,
      "image_url": "string",
      "coordinate": {
        "latitude": -8.8057,
        "longitude": 13.2343
      }
    }
  ]
}
```

---

### 2.5 GET `/destinations/recommended`

**Objetivo:** Obter destinos recomendados baseado no perfil do usuário.

**Método:** `GET`

**Autenticação:** ✅ Bearer Token (opcional, melhor com autenticação)

**Query Parameters:**
```
limit=10
latitude=float (opcional)
longitude=float (opcional)
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "location": "string",
      "category": "string",
      "rating": 4.8,
      "image_url": "string",
      "distance": 25.5,
      "recommendation_reason": "Based on your interests"
    }
  ]
}
```

---

## 📂 Categorias

### 3.1 GET `/categories`

**Objetivo:** Listar todas as categorias de destinos disponíveis.

**Método:** `GET`

**Autenticação:** ❌ Não requerida

**Resposta (200 OK):**
```json
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
    },
    {
      "id": "uuid",
      "name": "Cultural",
      "slug": "cultural",
      "icon": "business",
      "color": "#8B5CF6",
      "destination_count": 32
    }
  ]
}
```

---

## ⭐ Avaliações

### 4.1 POST `/reviews`

**Objetivo:** Criar uma nova avaliação para um destino.

**Método:** `POST`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "destination_id": "uuid (required)",
  "rating": 5,
  "comment": "string (required, min: 10, max: 1000)",
  "images": ["base64_string_1", "base64_string_2"]
}
```

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "uuid",
    "destination_id": "uuid",
    "rating": 5,
    "comment": "string",
    "images": ["url1", "url2"],
    "created_at": "ISO8601"
  }
}
```

**Erros:**
- `400` - Validation error
- `409` - User already reviewed this destination
- `401` - Unauthorized

---

### 4.2 PUT `/reviews/{id}`

**Objetivo:** Atualizar uma avaliação existente.

**Método:** `PUT`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "rating": 4,
  "comment": "string"
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "id": "uuid",
    "rating": 4,
    "comment": "string",
    "updated_at": "ISO8601"
  }
}
```

---

### 4.3 DELETE `/reviews/{id}`

**Objetivo:** Deletar uma avaliação.

**Método:** `DELETE`

**Autenticação:** ✅ Bearer Token

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

### 4.4 POST `/reviews/{id}/helpful`

**Objetivo:** Marcar uma avaliação como útil.

**Método:** `POST`

**Autenticação:** ✅ Bearer Token

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Marked as helpful",
  "data": {
    "helpful_count": 13
  }
}
```

---

## ❤️ Favoritos

### 5.1 GET `/favorites`

**Objetivo:** Listar todos os destinos favoritados pelo usuário.

**Método:** `GET`

**Autenticação:** ✅ Bearer Token

**Query Parameters:**
```
page=1
per_page=20
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "destination": {
        "id": "uuid",
        "name": "string",
        "location": "string",
        "category": "string",
        "rating": 4.5,
        "image_url": "string",
        "coordinate": {
          "latitude": -8.8057,
          "longitude": 13.2343
        }
      },
      "created_at": "ISO8601"
    }
  ],
  "meta": {
    "total": 15
  }
}
```

---

### 5.2 POST `/favorites`

**Objetivo:** Adicionar um destino aos favoritos.

**Método:** `POST`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "destination_id": "uuid (required)"
}
```

**Resposta (201 Created):**
```json
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

---

### 5.3 DELETE `/favorites/{destination_id}`

**Objetivo:** Remover um destino dos favoritos.

**Método:** `DELETE`

**Autenticação:** ✅ Bearer Token

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Destination removed from favorites"
}
```

---

## 🗺️ Viagens/Trips

### 6.1 GET `/trips`

**Objetivo:** Listar todas as viagens do usuário.

**Método:** `GET`

**Autenticação:** ✅ Bearer Token

**Query Parameters:**
```
status=upcoming|ongoing|completed|all (default: all)
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Angola Adventure 2025",
      "start_date": "2025-12-01",
      "end_date": "2025-12-15",
      "notes": "string|null",
      "status": "upcoming",
      "destinations": [
        {
          "id": "uuid",
          "destination": {
            "id": "uuid",
            "name": "string",
            "location": "string",
            "image_url": "string"
          },
          "order": 1,
          "visit_date": "2025-12-02",
          "notes": "string|null"
        }
      ],
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ]
}
```

---

### 6.2 POST `/trips`

**Objetivo:** Criar uma nova viagem.

**Método:** `POST`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "name": "string (required, min: 3, max: 100)",
  "start_date": "YYYY-MM-DD (required)",
  "end_date": "YYYY-MM-DD (required, must be >= start_date)",
  "notes": "string (optional, max: 500)"
}
```

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "id": "uuid",
    "name": "Angola Adventure 2025",
    "start_date": "2025-12-01",
    "end_date": "2025-12-15",
    "notes": "string|null",
    "status": "upcoming",
    "destinations": [],
    "created_at": "ISO8601"
  }
}
```

---

### 6.3 GET `/trips/{id}`

**Objetivo:** Obter detalhes de uma viagem específica.

**Método:** `GET`

**Autenticação:** ✅ Bearer Token

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Angola Adventure 2025",
    "start_date": "2025-12-01",
    "end_date": "2025-12-15",
    "notes": "string|null",
    "status": "upcoming",
    "destinations": [
      {
        "id": "uuid",
        "destination": {
          "id": "uuid",
          "name": "Fortaleza de São Miguel",
          "location": "Luanda",
          "category": "historical",
          "rating": 4.5,
          "image_url": "string",
          "coordinate": {
            "latitude": -8.8057,
            "longitude": 13.2343
          }
        },
        "order": 1,
        "visit_date": "2025-12-02",
        "notes": "Visit in the morning"
      }
    ],
    "stats": {
      "total_destinations": 5,
      "total_days": 14,
      "estimated_cost": 50000
    },
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
}
```

---

### 6.4 PUT `/trips/{id}`

**Objetivo:** Atualizar informações de uma viagem.

**Método:** `PUT`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "name": "string (optional)",
  "start_date": "YYYY-MM-DD (optional)",
  "end_date": "YYYY-MM-DD (optional)",
  "notes": "string (optional)"
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Trip updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated name",
    "updated_at": "ISO8601"
  }
}
```

---

### 6.5 DELETE `/trips/{id}`

**Objetivo:** Deletar uma viagem.

**Método:** `DELETE`

**Autenticação:** ✅ Bearer Token

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

---

### 6.6 POST `/trips/{id}/destinations`

**Objetivo:** Adicionar um destino a uma viagem.

**Método:** `POST`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "destination_id": "uuid (required)",
  "visit_date": "YYYY-MM-DD (optional)",
  "notes": "string (optional, max: 200)"
}
```

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Destination added to trip",
  "data": {
    "id": "uuid",
    "trip_id": "uuid",
    "destination_id": "uuid",
    "order": 3,
    "visit_date": "2025-12-05",
    "notes": "string|null"
  }
}
```

---

### 6.7 DELETE `/trips/{trip_id}/destinations/{destination_id}`

**Objetivo:** Remover um destino de uma viagem.

**Método:** `DELETE`

**Autenticação:** ✅ Bearer Token

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Destination removed from trip"
}
```

---

### 6.8 PUT `/trips/{id}/destinations/reorder`

**Objetivo:** Reordenar destinos dentro de uma viagem.

**Método:** `PUT`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "destinations": [
    {
      "id": "uuid",
      "order": 1
    },
    {
      "id": "uuid",
      "order": 2
    }
  ]
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Destinations reordered successfully"
}
```

---

## 👤 Usuário/Perfil

### 7.1 GET `/user/profile`

**Objetivo:** Obter informações do perfil do usuário autenticado.

**Método:** `GET`

**Autenticação:** ✅ Bearer Token

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "avatar_url": "string|null",
    "phone": "string|null",
    "bio": "string|null",
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
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
}
```

---

### 7.2 PUT `/user/profile`

**Objetivo:** Atualizar perfil do usuário.

**Método:** `PUT`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "bio": "string (optional, max: 500)",
  "avatar": "base64_string (optional)"
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "avatar_url": "string|null",
    "updated_at": "ISO8601"
  }
}
```

---

### 7.3 PUT `/user/preferences`

**Objetivo:** Atualizar preferências do usuário.

**Método:** `PUT`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "language": "pt|en",
  "notifications_enabled": true,
  "favorite_categories": ["natural", "cultural"]
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Preferences updated successfully"
}
```

---

### 7.4 DELETE `/user/account`

**Objetivo:** Deletar conta do usuário.

**Método:** `DELETE`

**Autenticação:** ✅ Bearer Token

**Body:**
```json
{
  "password": "string (required)"
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🔍 Busca

### 8.1 GET `/search`

**Objetivo:** Busca global por destinos, localizações, etc.

**Método:** `GET`

**Autenticação:** ❌ Não requerida

**Query Parameters:**
```
q=string (required, min: 2)
type=all|destinations|locations (default: all)
limit=20
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "destinations": [
      {
        "id": "uuid",
        "name": "Fortaleza de São Miguel",
        "location": "Luanda",
        "category": "historical",
        "image_url": "string",
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

---

### 8.2 GET `/search/suggestions`

**Objetivo:** Obter sugestões de busca (autocomplete).

**Método:** `GET`

**Autenticação:** ❌ Não requerida

**Query Parameters:**
```
q=string (required, min: 2)
limit=10
```

**Resposta (200 OK):**
```json
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

## 🗺️ Mapa

### 9.1 GET `/map/destinations`

**Objetivo:** Obter destinos para exibir no mapa com filtros.

**Método:** `GET`

**Autenticação:** ❌ Não requerida

**Query Parameters:**
```
bounds=lat_min,lon_min,lat_max,lon_max (required)
category=string (optional)
min_rating=float (optional)
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Fortaleza de São Miguel",
      "location": "Luanda",
      "category": "historical",
      "rating": 4.5,
      "image_url": "string",
      "coordinate": {
        "latitude": -8.8057,
        "longitude": 13.2343
      }
    }
  ]
}
```

---

### 9.2 GET `/map/nearby`

**Objetivo:** Obter destinos próximos a uma coordenada.

**Método:** `GET`

**Autenticação:** ❌ Não requerida

**Query Parameters:**
```
latitude=float (required)
longitude=float (required)
radius=int (default: 50, max: 500, em km)
limit=20
category=string (optional)
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "location": "string",
      "category": "string",
      "rating": 4.5,
      "image_url": "string",
      "coordinate": {
        "latitude": -8.8057,
        "longitude": 13.2343
      },
      "distance": 5.2
    }
  ]
}
```

---

## 📊 Modelos de Dados

### Destination (Modelo Principal)
```typescript
{
  id: string (UUID)
  name: string
  slug: string
  description: string
  long_description: string
  location: string
  province: string
  address: string
  category: 'natural' | 'cultural' | 'historical' | 'adventure'
  rating: number (0-5)
  review_count: number
  images: Image[]
  coordinate: {
    latitude: number
    longitude: number
  }
  opening_hours: string
  ticket_price: string
  contact: {
    phone: string
    email: string
    website: string
  }
  amenities: string[]
  accessibility: string[]
  created_at: string (ISO8601)
  updated_at: string (ISO8601)
}
```

### User
```typescript
{
  id: string (UUID)
  name: string
  email: string
  avatar_url: string | null
  phone: string | null
  bio: string | null
  preferences: {
    language: 'pt' | 'en'
    notifications_enabled: boolean
    favorite_categories: string[]
  }
  created_at: string (ISO8601)
  updated_at: string (ISO8601)
}
```

### Trip
```typescript
{
  id: string (UUID)
  user_id: string (UUID)
  name: string
  start_date: string (YYYY-MM-DD)
  end_date: string (YYYY-MM-DD)
  notes: string | null
  status: 'upcoming' | 'ongoing' | 'completed'
  destinations: TripDestination[]
  created_at: string (ISO8601)
  updated_at: string (ISO8601)
}
```

### Review
```typescript
{
  id: string (UUID)
  user_id: string (UUID)
  destination_id: string (UUID)
  rating: number (1-5)
  comment: string
  images: string[]
  helpful_count: number
  created_at: string (ISO8601)
  updated_at: string (ISO8601)
}
```

---

## ⚠️ Tratamento de Erros

Todas as respostas de erro devem seguir o formato:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Opcional, para erros de validação
  }
}
```

### Códigos HTTP Comuns:
- `200` - OK
- `201` - Created
- `400` - Bad Request (validação)
- `401` - Unauthorized (token inválido/ausente)
- `403` - Forbidden (sem permissão)
- `404` - Not Found
- `409` - Conflict (duplicado)
- `422` - Unprocessable Entity
- `500` - Internal Server Error

---

## 📝 Notas Importantes

1. **Paginação**: Todas as rotas de listagem devem suportar paginação
2. **Imagens**: Aceitar upload em base64 e retornar URLs públicas
3. **Datas**: Usar formato ISO8601 para timestamps
4. **Coordenadas**: Sempre latitude e longitude em decimal
5. **Distâncias**: Sempre em quilômetros (km)
6. **Ratings**: Escala de 0 a 5 com uma casa decimal
7. **Tokens JWT**: Expiração recomendada de 1 hora, com refresh token
8. **Rate Limiting**: Implementar para prevenir abuso
9. **CORS**: Permitir requisições do app mobile

---

## 🚀 Prioridades de Implementação

### Fase 1 (MVP - Crítico):
1. Autenticação (login, registro, logout)
2. GET `/destinations` (listagem)
3. GET `/destinations/{id}` (detalhes)
4. GET `/destinations/featured`
5. Favoritos (GET, POST, DELETE)
6. User profile (GET, PUT)

### Fase 2 (Essencial):
1. Trips completo (CRUD + gestão de destinos)
2. Reviews (CRUD)
3. Busca (search e suggestions)
4. Mapa (destinations e nearby)

### Fase 3 (Melhorias):
1. Recomendações personalizadas
2. Estatísticas do usuário
3. Notificações
4. Upload de múltiplas imagens

---

**Qualquer dúvida sobre algum endpoint, entre em contato!** 🙌
