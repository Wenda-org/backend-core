# 🚀 Wenda API - Referência Rápida

> **Base URL**: `http://localhost:3000/api`

## 🔑 Autenticação

Todas as requisições com 🔒 requerem header:
```
Authorization: Bearer {seu_token_aqui}
```

---

## 📋 Endpoints Principais

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Criar conta |
| POST | `/auth/login` | Login |
| GET | `/auth/profile` 🔒 | Ver meu perfil |
| PUT | `/auth/profile` 🔒 | Atualizar perfil |

### 🏷️ Categorias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/categories` | Listar categorias |
| GET | `/categories/:id` | Ver categoria |

### 🏝️ Destinos

| Método | Endpoint | Descrição | Params |
|--------|----------|-----------|--------|
| GET | `/destinations` | Listar destinos | `?page=1&perPage=20&province=Luanda&categoryId=uuid&search=praia&sortBy=rating` |
| GET | `/destinations/:id` | Ver destino | - |

### ⭐ Avaliações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/reviews` | Listar todas |
| GET | `/reviews/destination/:id` | Ver reviews do destino |
| POST | `/reviews` 🔒 | Criar review |
| PUT | `/reviews/:id` 🔒 | Editar review |
| DELETE | `/reviews/:id` 🔒 | Deletar review |
| POST | `/reviews/:id/helpful` 🔒 | Marcar como útil |

### ❤️ Favoritos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/favorites` 🔒 | Meus favoritos |
| POST | `/favorites` 🔒 | Adicionar favorito |
| DELETE | `/favorites/:id` 🔒 | Remover favorito |
| GET | `/favorites/check/:destinationId` 🔒 | Verificar se é favorito |

### ✈️ Viagens

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/trips` 🔒 | Minhas viagens |
| GET | `/trips/:id` 🔒 | Ver viagem |
| POST | `/trips` 🔒 | Criar viagem |
| PUT | `/trips/:id` 🔒 | Editar viagem |
| DELETE | `/trips/:id` 🔒 | Deletar viagem |
| POST | `/trips/:id/destinations` 🔒 | Adicionar destino |
| DELETE | `/trips/:tripId/destinations/:destId` 🔒 | Remover destino |

---

## 💻 Código Exemplo

### Setup Inicial (React/React Native)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Auto-adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // AsyncStorage no RN
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Login

```typescript
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'senha123'
});

// Salvar token
localStorage.setItem('accessToken', response.data.data.accessToken);
```

### Buscar Destinos

```typescript
const response = await api.get('/destinations', {
  params: {
    page: 1,
    perPage: 20,
    province: 'Luanda',
    sortBy: 'rating'
  }
});

const destinations = response.data.data;
const pagination = response.data.meta;
```

### Adicionar aos Favoritos

```typescript
const response = await api.post('/favorites', {
  destinationId: 'uuid-do-destino'
});
```

### Criar Review

```typescript
const response = await api.post('/reviews', {
  destinationId: 'uuid-do-destino',
  rating: 5,
  comment: 'Lugar incrível!',
  visitDate: '2025-11-01'
});
```

### Criar Viagem

```typescript
const response = await api.post('/trips', {
  title: 'Férias em Luanda',
  description: 'Explorando a capital',
  startDate: '2025-12-01',
  endDate: '2025-12-10'
});

const tripId = response.data.data.id;

// Adicionar destino à viagem
await api.post(`/trips/${tripId}/destinations`, {
  destinationId: 'uuid-do-destino',
  visitDate: '2025-12-02',
  notes: 'Visitar de manhã'
});
```

---

## 📦 Formatos de Resposta

### Sucesso

```json
{
  "success": true,
  "data": {...},
  "meta": {...}  // apenas em listas paginadas
}
```

### Erro

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [...]
}
```

### Paginação

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "currentPage": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🎨 Status Codes

| Code | Significado |
|------|-------------|
| 200 | ✅ Sucesso |
| 201 | ✅ Criado |
| 400 | ❌ Dados inválidos |
| 401 | 🔒 Não autenticado |
| 403 | 🚫 Sem permissão |
| 404 | 🔍 Não encontrado |
| 409 | ⚠️ Conflito (ex: email já existe) |
| 500 | 💥 Erro no servidor |

---

## 🧪 Contas de Teste

```
Usuário Normal:
Email: test@wenda.ao
Senha: teste123

Admin:
Email: admin@wenda.ao
Senha: teste123
```

---

## 🔧 Dicas

1. **Sempre valide dados no frontend** antes de enviar
2. **Use debounce** em campos de busca (search)
3. **Implemente retry** para erros de rede
4. **Cache** dados estáticos (categories)
5. **Loading states** em todas as requisições

---

## 📱 React Native Específico

### AsyncStorage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Salvar token
await AsyncStorage.setItem('accessToken', token);

// Ler token
const token = await AsyncStorage.getItem('accessToken');

// Remover token
await AsyncStorage.removeItem('accessToken');
```

### Custom Hook useAuth

```typescript
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      const response = await api.get('/auth/profile');
      setUser(response.data.data);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
    setUser(response.data.data.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    setUser(null);
  };

  return { user, loading, login, logout };
}
```

---

## 🌐 Web Específico

### React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Buscar destinos
const { data, isLoading } = useQuery({
  queryKey: ['destinations', { province: 'Luanda' }],
  queryFn: () => api.get('/destinations', { params: { province: 'Luanda' } })
});

// Criar review
const createReview = useMutation({
  mutationFn: (data) => api.post('/reviews', data),
  onSuccess: () => {
    queryClient.invalidateQueries(['reviews']);
  }
});
```

### Context API para Auth

```typescript
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) loadProfile();
  }, []);

  const loadProfile = async () => {
    const response = await api.get('/auth/profile');
    setUser(response.data.data);
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', response.data.data.accessToken);
    setUser(response.data.data.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

**Última atualização:** 12 de Novembro de 2025
