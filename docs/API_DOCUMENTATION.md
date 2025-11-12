# 📚 Wenda Tourism API - Documentação Completa

> **Base URL**: `http://localhost:3000/api` (desenvolvimento)  
> **Base URL**: `https://api.wenda.ao/api` (produção)

## 📋 Índice

1. [Autenticação](#autenticação)
2. [Health Check](#health-check)
3. [Auth - Registro e Login](#auth)
4. [Users - Gestão de Usuários](#users)
5. [Categories - Categorias de Turismo](#categories)
6. [Destinations - Destinos Turísticos](#destinations)
7. [Reviews - Avaliações](#reviews)
8. [Favorites - Favoritos](#favorites)
9. [Trips - Viagens](#trips)
10. [Códigos de Erro](#códigos-de-erro)
11. [Exemplos de Uso](#exemplos-de-uso)

---

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação.

### Como funciona:

1. Usuário faz login e recebe um `accessToken`
2. Token deve ser incluído no header `Authorization: Bearer {token}` em requisições autenticadas
3. Token expira em **7 dias**

### Headers necessários:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🏥 Health Check

### GET `/health`

Verifica se a API está funcionando.

**Request:**
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-11-12T10:30:00.000Z",
    "uptime": 3600,
    "environment": "development",
    "database": {
      "status": "healthy",
      "responseTime": "15ms"
    },
    "version": "1.0.0"
  }
}
```

### GET `/health/database`

Verifica apenas a conexão com o banco de dados.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "responseTime": "12ms",
    "timestamp": "2025-11-12T10:30:00.000Z"
  }
}
```

---

## 🔐 Auth

### POST `/auth/register`

Registra um novo usuário.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "confirmPassword": "senha123",
  "phone": "+244 923 456 789",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "user",
      "avatarUrl": "https://example.com/avatar.jpg",
      "phone": "+244 923 456 789",
      "createdAt": "2025-11-12T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 604800
  }
}
```

### POST `/auth/login`

Autentica um usuário existente.

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "user",
      "avatarUrl": "https://example.com/avatar.jpg",
      "phone": "+244 923 456 789",
      "createdAt": "2025-11-12T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 604800
  }
}
```

### GET `/auth/profile` 🔒

Obtém o perfil do usuário autenticado.

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+244 923 456 789",
    "avatarUrl": "https://example.com/avatar.jpg",
    "role": "user",
    "preferences": {},
    "isActive": true,
    "emailVerifiedAt": null,
    "createdAt": "2025-11-12T10:30:00.000Z",
    "updatedAt": "2025-11-12T10:30:00.000Z",
    "_count": {
      "reviews": 5,
      "favorites": 10,
      "trips": 3
    }
  }
}
```

### PUT `/auth/profile` 🔒

Atualiza o perfil do usuário autenticado.

**Request:**
```json
{
  "name": "João Pedro Silva",
  "phone": "+244 923 999 888",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "preferences": {
    "language": "pt",
    "notifications": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "name": "João Pedro Silva",
    "email": "joao@example.com",
    "phone": "+244 923 999 888",
    "avatarUrl": "https://example.com/new-avatar.jpg",
    "role": "user",
    "preferences": {
      "language": "pt",
      "notifications": true
    },
    "updatedAt": "2025-11-12T11:00:00.000Z"
  }
}
```

---

## 👥 Users

### GET `/users` 🔒👑 (Admin only)

Lista todos os usuários (com paginação).

**Query Parameters:**
- `page` (opcional): Página atual (padrão: 1)
- `perPage` (opcional): Itens por página (padrão: 10)

**Request:**
```bash
GET /api/users?page=1&perPage=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "name": "João Silva",
        "email": "joao@example.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2025-11-12T10:30:00.000Z",
        "_count": {
          "reviews": 5,
          "favorites": 10,
          "trips": 3
        }
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "perPage": 20,
      "totalPages": 3
    }
  }
}
```

### GET `/users/:id` 🔒

Obtém detalhes de um usuário específico.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+244 923 456 789",
    "avatarUrl": "https://example.com/avatar.jpg",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-11-12T10:30:00.000Z",
    "_count": {
      "reviews": 5,
      "favorites": 10,
      "trips": 3
    }
  }
}
```

### PUT `/users/:id` 🔒👑 (Admin only)

Atualiza qualquer usuário.

**Request:**
```json
{
  "name": "Novo Nome",
  "role": "admin",
  "isActive": false
}
```

### DELETE `/users/:id` 🔒👑 (Admin only)

Deleta um usuário (soft delete).

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 🏷️ Categories

### GET `/categories`

Lista todas as categorias de turismo.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Praia",
      "slug": "praia",
      "description": "Praias paradisíacas de Angola",
      "icon": "🏖️",
      "color": "#00A8E8",
      "_count": {
        "destinations": 8
      }
    }
  ]
}
```

### GET `/categories/:id`

Obtém uma categoria específica (por ID ou slug).

**Request:**
```bash
GET /api/categories/praia
# ou
GET /api/categories/uuid
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Praia",
    "slug": "praia",
    "description": "Praias paradisíacas de Angola",
    "icon": "🏖️",
    "color": "#00A8E8",
    "destinations": [
      {
        "id": "uuid",
        "name": "Praia Morena",
        "slug": "praia-morena",
        "location": "Luanda"
      }
    ]
  }
}
```

### POST `/categories` 🔒👑 (Admin only)

Cria uma nova categoria.

**Request:**
```json
{
  "name": "Aventura",
  "slug": "aventura",
  "description": "Atividades de aventura",
  "icon": "🏔️",
  "color": "#FF6B35"
}
```

### PUT `/categories/:id` 🔒👑 (Admin only)

Atualiza uma categoria.

### DELETE `/categories/:id` 🔒👑 (Admin only)

Deleta uma categoria.

---

## 🏝️ Destinations

### GET `/destinations`

Lista destinos turísticos (com paginação e filtros).

**Query Parameters:**
- `page` (opcional): Página (padrão: 1)
- `perPage` (opcional): Itens por página (padrão: 10)
- `categoryId` (opcional): Filtrar por categoria
- `province` (opcional): Filtrar por província
- `search` (opcional): Buscar por nome/descrição
- `sortBy` (opcional): `rating`, `popular`, `recent` (padrão: `rating`)

**Request:**
```bash
GET /api/destinations?province=Luanda&sortBy=rating&page=1&perPage=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Fortaleza de São Miguel",
      "slug": "fortaleza-sao-miguel",
      "description": "Fortaleza histórica construída em 1576",
      "location": "Luanda",
      "province": "Luanda",
      "latitude": -8.8085,
      "longitude": 13.2355,
      "images": [
        {
          "id": "uuid",
          "url": "https://example.com/image.jpg",
          "caption": "Vista da fortaleza"
        }
      ],
      "rating": 4.8,
      "reviewCount": 145,
      "category": {
        "id": "uuid",
        "name": "Histórico",
        "slug": "historico"
      },
      "isFeatured": true,
      "createdAt": "2025-11-12T10:30:00.000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "perPage": 20,
    "total": 26,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET `/destinations/:id`

Obtém detalhes completos de um destino (por ID ou slug).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Fortaleza de São Miguel",
    "slug": "fortaleza-sao-miguel",
    "description": "Fortaleza histórica construída em 1576...",
    "location": "Luanda",
    "province": "Luanda",
    "latitude": -8.8085,
    "longitude": 13.2355,
    "images": [...],
    "rating": 4.8,
    "reviewCount": 145,
    "category": {...},
    "tags": ["história", "cultura", "arquitetura"],
    "facilities": ["estacionamento", "guia turístico"],
    "bestTimeToVisit": "Maio a Setembro",
    "entryFee": "500 Kz",
    "openingHours": "08:00 - 17:00",
    "isFeatured": true,
    "reviews": [...],
    "nearbyDestinations": [...]
  }
}
```

### POST `/destinations` 🔒👑 (Admin only)

Cria um novo destino.

**Request:**
```json
{
  "name": "Novo Destino",
  "slug": "novo-destino",
  "description": "Descrição completa do destino",
  "location": "Luanda",
  "province": "Luanda",
  "categoryId": "uuid",
  "latitude": -8.8085,
  "longitude": 13.2355,
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "caption": "Vista principal"
    }
  ],
  "tags": ["cultura", "história"],
  "facilities": ["estacionamento"],
  "bestTimeToVisit": "Todo o ano",
  "entryFee": "Grátis",
  "openingHours": "24h"
}
```

### PUT `/destinations/:id` 🔒👑 (Admin only)

Atualiza um destino.

### DELETE `/destinations/:id` 🔒👑 (Admin only)

Deleta um destino.

---

## ⭐ Reviews

### GET `/reviews`

Lista todas as avaliações (paginado e filtrado).

**Query Parameters:**
- `page`, `perPage`: Paginação
- `destinationId` (opcional): Filtrar por destino
- `userId` (opcional): Filtrar por usuário
- `minRating` (opcional): Rating mínimo (1-5)
- `sortBy` (opcional): `rating`, `helpful`, `recent`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Lugar incrível! Muito bem preservado.",
      "user": {
        "id": "uuid",
        "name": "João Silva",
        "avatarUrl": "https://example.com/avatar.jpg"
      },
      "destination": {
        "id": "uuid",
        "name": "Fortaleza de São Miguel",
        "slug": "fortaleza-sao-miguel"
      },
      "images": [
        {
          "id": "uuid",
          "url": "https://example.com/review-photo.jpg"
        }
      ],
      "helpfulCount": 23,
      "createdAt": "2025-11-12T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 145,
    "totalPages": 15
  }
}
```

### GET `/reviews/destination/:destinationId`

Lista avaliações de um destino específico.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "currentPage": 1,
    "perPage": 20,
    "total": 145,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### POST `/reviews` 🔒

Cria uma nova avaliação.

**Request:**
```json
{
  "destinationId": "uuid",
  "rating": 5,
  "comment": "Experiência fantástica! Recomendo muito.",
  "visitDate": "2025-11-01",
  "images": [
    {
      "url": "https://example.com/my-photo.jpg"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Experiência fantástica!",
    "createdAt": "2025-11-12T10:30:00.000Z"
  }
}
```

### PUT `/reviews/:id` 🔒

Atualiza sua própria avaliação.

### DELETE `/reviews/:id` 🔒

Deleta sua própria avaliação.

### POST `/reviews/:id/helpful` 🔒

Marca uma avaliação como útil.

**Response:**
```json
{
  "success": true,
  "message": "Review marked as helpful"
}
```

---

## ❤️ Favorites

### GET `/favorites` 🔒

Lista os favoritos do usuário autenticado.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "destination": {
        "id": "uuid",
        "name": "Fortaleza de São Miguel",
        "slug": "fortaleza-sao-miguel",
        "location": "Luanda",
        "province": "Luanda",
        "rating": 4.8,
        "images": [...]
      },
      "createdAt": "2025-11-12T10:30:00.000Z"
    }
  ]
}
```

### POST `/favorites` 🔒

Adiciona um destino aos favoritos.

**Request:**
```json
{
  "destinationId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Destination added to favorites",
  "data": {
    "id": "uuid",
    "destinationId": "uuid",
    "createdAt": "2025-11-12T10:30:00.000Z"
  }
}
```

### DELETE `/favorites/:id` 🔒

Remove um favorito.

**Response:**
```json
{
  "success": true,
  "message": "Favorite removed successfully"
}
```

### GET `/favorites/check/:destinationId` 🔒

Verifica se um destino está nos favoritos.

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorite": true
  }
}
```

---

## ✈️ Trips

### GET `/trips` 🔒

Lista as viagens do usuário.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Férias em Luanda",
      "description": "Explorando a capital",
      "startDate": "2025-12-01",
      "endDate": "2025-12-10",
      "status": "planned",
      "destinations": [
        {
          "id": "uuid",
          "destination": {
            "id": "uuid",
            "name": "Fortaleza de São Miguel",
            "images": [...]
          },
          "visitDate": "2025-12-02",
          "notes": "Visitar de manhã"
        }
      ],
      "createdAt": "2025-11-12T10:30:00.000Z"
    }
  ]
}
```

### GET `/trips/:id` 🔒

Obtém detalhes de uma viagem.

### POST `/trips` 🔒

Cria uma nova viagem.

**Request:**
```json
{
  "title": "Férias em Luanda",
  "description": "Explorando a capital de Angola",
  "startDate": "2025-12-01",
  "endDate": "2025-12-10",
  "status": "planned"
}
```

### PUT `/trips/:id` 🔒

Atualiza uma viagem.

### DELETE `/trips/:id` 🔒

Deleta uma viagem.

### POST `/trips/:id/destinations` 🔒

Adiciona um destino à viagem.

**Request:**
```json
{
  "destinationId": "uuid",
  "visitDate": "2025-12-02",
  "notes": "Visitar de manhã cedo"
}
```

### DELETE `/trips/:tripId/destinations/:destinationId` 🔒

Remove um destino da viagem.

---

## ❌ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 200 | ✅ Sucesso |
| 201 | ✅ Criado com sucesso |
| 400 | ❌ Requisição inválida (validação falhou) |
| 401 | 🔒 Não autenticado (token ausente/inválido) |
| 403 | 🚫 Sem permissão (role insuficiente) |
| 404 | 🔍 Recurso não encontrado |
| 409 | ⚠️ Conflito (ex: email já existe) |
| 500 | 💥 Erro interno do servidor |

### Formato de Erro:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

---

## 📱 Exemplos de Uso

### JavaScript/TypeScript (React, React Native, Next.js)

```typescript
// api.ts - Configuração do cliente API
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Criar instância do axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // ou AsyncStorage no React Native
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH SERVICE ==========
export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }) {
    const response = await api.post('/auth/register', data);
    if (response.data.success) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: { name?: string; phone?: string; avatarUrl?: string }) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },
};

// ========== DESTINATIONS SERVICE ==========
export const destinationsService = {
  async getAll(params?: {
    page?: number;
    perPage?: number;
    categoryId?: string;
    province?: string;
    search?: string;
    sortBy?: 'rating' | 'popular' | 'recent';
  }) {
    const response = await api.get('/destinations', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },

  async getBySlug(slug: string) {
    const response = await api.get(`/destinations/${slug}`);
    return response.data;
  },
};

// ========== CATEGORIES SERVICE ==========
export const categoriesService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

// ========== REVIEWS SERVICE ==========
export const reviewsService = {
  async getByDestination(destinationId: string, params?: {
    page?: number;
    perPage?: number;
    sortBy?: 'rating' | 'helpful' | 'recent';
  }) {
    const response = await api.get(`/reviews/destination/${destinationId}`, { params });
    return response.data;
  },

  async create(data: {
    destinationId: string;
    rating: number;
    comment: string;
    visitDate?: string;
  }) {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  async update(id: string, data: { rating?: number; comment?: string }) {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  async markHelpful(id: string) {
    const response = await api.post(`/reviews/${id}/helpful`);
    return response.data;
  },
};

// ========== FAVORITES SERVICE ==========
export const favoritesService = {
  async getAll() {
    const response = await api.get('/favorites');
    return response.data;
  },

  async add(destinationId: string) {
    const response = await api.post('/favorites', { destinationId });
    return response.data;
  },

  async remove(id: string) {
    const response = await api.delete(`/favorites/${id}`);
    return response.data;
  },

  async check(destinationId: string) {
    const response = await api.get(`/favorites/check/${destinationId}`);
    return response.data;
  },
};

// ========== TRIPS SERVICE ==========
export const tripsService = {
  async getAll() {
    const response = await api.get('/trips');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  async create(data: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
  }) {
    const response = await api.post('/trips', data);
    return response.data;
  },

  async update(id: string, data: Partial<{
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
  }>) {
    const response = await api.put(`/trips/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },

  async addDestination(tripId: string, data: {
    destinationId: string;
    visitDate?: string;
    notes?: string;
  }) {
    const response = await api.post(`/trips/${tripId}/destinations`, data);
    return response.data;
  },

  async removeDestination(tripId: string, destinationId: string) {
    const response = await api.delete(`/trips/${tripId}/destinations/${destinationId}`);
    return response.data;
  },
};
```

### Exemplo de uso em componente React:

```typescript
// LoginScreen.tsx
import { useState } from 'react';
import { authService } from './api';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await authService.login(email, password);
      console.log('Login bem-sucedido:', result.data.user);
      // Navegar para tela principal
    } catch (error) {
      console.error('Erro no login:', error.response?.data?.message);
      alert('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </div>
  );
}
```

### Exemplo React Native (Expo):

```typescript
// useAuth.ts - Custom Hook
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const profile = await authService.getProfile();
        setUser(profile.data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setUser(result.data.user);
    return result;
  };

  const logout = async () => {
    authService.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
}
```

---

## 🎯 Boas Práticas

### 1. **Sempre armazene o token de forma segura**
   - Web: `localStorage` ou `sessionStorage`
   - Mobile: `AsyncStorage` ou `SecureStore` (Expo)

### 2. **Trate erros globalmente**
   - Use interceptors do axios
   - Mostre mensagens de erro amigáveis ao usuário

### 3. **Implemente retry logic**
   - Para requisições que falharam por problemas de rede

### 4. **Use cache quando possível**
   - Categories, Destinations podem ser cacheados
   - Use React Query ou SWR para gerenciar cache

### 5. **Implementem loading states**
   - Mostre indicadores de carregamento
   - Desabilite botões durante requisições

### 6. **Validem dados antes de enviar**
   - Validação no frontend reduz erros 400

---

## 📞 Suporte

**Backend Team:**
- Email: backend@wenda.ao
- Slack: #backend-core

**Endpoints de teste disponíveis:**
- Usuário teste: `test@wenda.ao` / senha: `teste123`
- Admin teste: `admin@wenda.ao` / senha: `teste123`

---

**Última atualização:** 12 de Novembro de 2025  
**Versão da API:** 1.0.0
