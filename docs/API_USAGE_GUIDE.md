# 📱 Guia de Uso das APIs - Wenda Platform

**Versão:** 1.0  
**Data:** 12 de Novembro de 2025  
**Base URL:** `https://api.wenda.ao` ou `http://localhost:8000`

---

## 📋 Índice

1. [Introdução](#introdução)
2. [APIs para Mobile App](#apis-para-mobile-app)
3. [APIs para Web Dashboard](#apis-para-web-dashboard)
4. [Autenticação](#autenticação)
5. [Exemplos de Código](#exemplos-de-código)
6. [Tratamento de Erros](#tratamento-de-erros)

---

## 🎯 Introdução

Esta API serve tanto o **App Mobile** (para turistas) quanto o **Web Dashboard** (para administradores). As rotas estão organizadas por funcionalidade e algumas são exclusivas para cada plataforma.

### Ambientes

- **Produção:** `https://api.wenda.ao`
- **Desenvolvimento:** `http://localhost:8000`
- **Documentação Interativa:** `/docs` (Swagger UI)

---

## 📱 APIs para Mobile App

### 1. Autenticação

#### 1.1 Registro de Usuário
```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senhaSegura123",
  "confirm_password": "senhaSegura123"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "created_at": "2025-11-12T10:30:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400
  }
}
```

**Uso no Mobile:**
- Salvar `access_token` no AsyncStorage/SecureStore
- Usar em todas as requisições autenticadas
- Mostrar mensagem de boas-vindas com `user.name`

---

#### 1.2 Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senhaSegura123"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "avatar_url": "https://...",
      "created_at": "2025-11-12T10:30:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400
  }
}
```

**Uso no Mobile:**
- Salvar token e dados do usuário
- Redirecionar para Home Screen
- Atualizar estado global (Context/Redux)

---

#### 1.3 Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Uso no Mobile:**
- Remover token do storage
- Limpar estado global
- Redirecionar para tela de login

---

### 2. Destinos Turísticos

#### 2.1 Listar Destinos (Home/Explore)
```http
GET /destinations?page=1&per_page=20&category=natural&sort_by=rating
```

**Parâmetros úteis:**
- `category`: filtrar por categoria (natural, cultural, historical, adventure)
- `search`: buscar por nome/localização
- `min_rating`: filtrar por avaliação mínima
- `latitude` & `longitude`: ordenar por distância
- `sort_by`: rating, distance, popularity, name

**Resposta (200):**
```json
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
      "is_favorite": false
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 150,
    "total_pages": 8,
    "has_next": true
  }
}
```

**Uso no Mobile:**
- **Home Screen:** `GET /destinations/featured?limit=10`
- **Explore Screen:** `GET /destinations?page=1` com filtros
- **Nearby:** Passar lat/lon do GPS do usuário
- **Pull to refresh:** Recarregar página 1

---

#### 2.2 Detalhes do Destino
```http
GET /destinations/{id}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Fortaleza de São Miguel",
    "description": "...",
    "long_description": "...",
    "location": "Luanda",
    "address": "Rua...",
    "category": "historical",
    "rating": 4.5,
    "review_count": 342,
    "images": [...],
    "coordinate": {...},
    "opening_hours": "Mon-Sat: 9AM-5PM",
    "ticket_price": "500 Kz",
    "contact": {
      "phone": "+244...",
      "email": "info@...",
      "website": "https://..."
    },
    "amenities": ["parking", "wifi", "restaurant"],
    "accessibility": ["wheelchair", "elevator"],
    "is_favorite": true,
    "nearby_destinations": [...]
  }
}
```

**Uso no Mobile:**
- Tela de detalhes do destino
- Galeria de imagens (swipeable)
- Botão de adicionar aos favoritos
- Botão "Get Directions" (abrir Maps)
- Seção de avaliações
- Lista de destinos próximos

---

#### 2.3 Destinos em Destaque
```http
GET /destinations/featured?limit=10
```

**Uso no Mobile:**
- Carousel/Slider na Home Screen
- Cards destacados com imagens atraentes

---

#### 2.4 Recomendações Personalizadas
```http
GET /destinations/recommended?limit=10&latitude=-8.8&longitude=13.2
Authorization: Bearer {token}
```

**Uso no Mobile:**
- Seção "Recomendado para você" na Home
- Baseado no perfil e localização do usuário

---

### 3. Categorias

#### 3.1 Listar Categorias
```http
GET /categories
```

**Resposta (200):**
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
      "description": "Praias, montanhas..."
    }
  ]
}
```

**Uso no Mobile:**
- Filtros na tela Explore
- Chips/Pills clicáveis
- Usar `color` para estilizar
- Usar `icon` para mostrar ícones

---

### 4. Avaliações

#### 4.1 Listar Avaliações de um Destino
```http
GET /destinations/{id}/reviews?page=1&sort_by=recent
```

**Parâmetros:**
- `sort_by`: recent, rating, helpful

**Uso no Mobile:**
- Tela de detalhes do destino
- Seção de reviews com scroll infinito
- Mostrar estrelas, comentário, fotos

---

#### 4.2 Criar Avaliação
```http
POST /reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "destination_id": "uuid",
  "rating": 5,
  "comment": "Lugar incrível! Muito bem preservado...",
  "images": ["base64_string_1", "base64_string_2"]
}
```

**Uso no Mobile:**
- Modal/Screen de "Deixar Avaliação"
- Star rating component (1-5 estrelas)
- Text input para comentário
- Upload de fotos (opcional)
- Validação: mínimo 10 caracteres

---

#### 4.3 Marcar Review como Útil
```http
POST /reviews/{id}/helpful
Authorization: Bearer {token}
```

**Uso no Mobile:**
- Botão "👍 Útil" em cada review
- Toggle: clicar novamente para desmarcar
- Atualizar contador

---

### 5. Favoritos

#### 5.1 Listar Favoritos
```http
GET /favorites?page=1
Authorization: Bearer {token}
```

**Uso no Mobile:**
- Tela "Meus Favoritos"
- Grid/List de destinos salvos

---

#### 5.2 Adicionar aos Favoritos
```http
POST /favorites
Authorization: Bearer {token}
Content-Type: application/json

{
  "destination_id": "uuid"
}
```

**Uso no Mobile:**
- Botão de coração na tela de detalhes
- Ícone de coração em cards de destinos
- Mostrar feedback visual (animação)

---

#### 5.3 Remover dos Favoritos
```http
DELETE /favorites/{destination_id}
Authorization: Bearer {token}
```

**Uso no Mobile:**
- Toggle do botão de coração
- Swipe para deletar na lista de favoritos

---

### 6. Viagens (Trips)

#### 6.1 Listar Minhas Viagens
```http
GET /trips?status=upcoming
Authorization: Bearer {token}
```

**Parâmetros:**
- `status`: upcoming, ongoing, completed, all

**Uso no Mobile:**
- Tela "Minhas Viagens"
- Tabs para filtrar por status
- Cards com nome, datas, preview dos destinos

---

#### 6.2 Criar Viagem
```http
POST /trips
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Férias em Angola 2025",
  "start_date": "2025-12-01",
  "end_date": "2025-12-15",
  "notes": "Viagem em família"
}
```

**Uso no Mobile:**
- Modal/Screen "Nova Viagem"
- Date pickers para datas
- Input de nome e notas

---

#### 6.3 Adicionar Destino à Viagem
```http
POST /trips/{trip_id}/destinations
Authorization: Bearer {token}
Content-Type: application/json

{
  "destination_id": "uuid",
  "visit_date": "2025-12-05",
  "notes": "Visitar pela manhã"
}
```

**Uso no Mobile:**
- Botão "Adicionar à Viagem" na tela de destino
- Selecionar qual viagem
- Definir data de visita (opcional)

---

#### 6.4 Reordenar Destinos na Viagem
```http
PUT /trips/{trip_id}/destinations/reorder
Authorization: Bearer {token}
Content-Type: application/json

{
  "destinations": [
    {"id": "uuid1", "order": 1},
    {"id": "uuid2", "order": 2}
  ]
}
```

**Uso no Mobile:**
- Drag & drop para reordenar
- Após soltar, enviar nova ordem

---

### 7. Perfil do Usuário

#### 7.1 Ver Perfil
```http
GET /user/profile
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "avatar_url": "https://...",
    "phone": "+244...",
    "bio": "Amante de viagens...",
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
    }
  }
}
```

**Uso no Mobile:**
- Tela de perfil
- Mostrar avatar, nome, stats
- Botão "Editar Perfil"

---

#### 7.2 Atualizar Perfil
```http
PUT /user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Pedro Silva",
  "phone": "+244912345678",
  "bio": "Explorando Angola",
  "avatar": "base64_string"
}
```

**Uso no Mobile:**
- Screen "Editar Perfil"
- Upload de avatar (camera/galeria)
- Validação de campos

---

#### 7.3 Atualizar Preferências
```http
PUT /user/preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "language": "pt",
  "notifications_enabled": true,
  "favorite_categories": ["natural", "adventure"]
}
```

**Uso no Mobile:**
- Tela de configurações
- Switches para notificações
- Seleção de categorias favoritas

---

### 8. Busca

#### 8.1 Busca Global
```http
GET /search?q=luanda&type=all&limit=20
```

**Parâmetros:**
- `q`: termo de busca (min 2 caracteres)
- `type`: all, destinations, locations
- `limit`: quantidade de resultados

**Uso no Mobile:**
- Barra de busca no topo
- Resultados agrupados por tipo
- Destacar termo buscado

---

#### 8.2 Autocomplete/Sugestões
```http
GET /search/suggestions?q=lua&limit=10
```

**Uso no Mobile:**
- Dropdown enquanto digita
- Sugestões em tempo real
- Click para buscar

---

### 9. Mapa

#### 9.1 Destinos no Mapa
```http
GET /map/destinations?bounds=-9,-14,-8,13&category=natural
```

**Parâmetros:**
- `bounds`: lat_min,lon_min,lat_max,lon_max (viewport do mapa)
- `category`: filtro opcional
- `min_rating`: filtro opcional

**Uso no Mobile:**
- Tela de Mapa
- Markers/Pins para cada destino
- Atualizar ao mover o mapa
- Cluster de markers quando zoomed out

---

#### 9.2 Destinos Próximos
```http
GET /map/nearby?latitude=-8.8&longitude=13.2&radius=50&limit=20
```

**Uso no Mobile:**
- Botão "Perto de mim"
- Usar GPS do dispositivo
- Listar com distância ordenada

---

## 🖥️ APIs para Web Dashboard

### 1. Gestão de Destinos (Admin)

#### 1.1 Criar Destino
```http
POST /admin/destinations
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Catedral de Luanda",
  "slug": "catedral-luanda",
  "description": "...",
  "long_description": "...",
  "location": "Luanda",
  "province": "Luanda",
  "category_id": "uuid",
  "latitude": -8.8117,
  "longitude": 13.2302,
  "opening_hours": "Mon-Sat: 8AM-6PM",
  "ticket_price": "Grátis",
  "amenities": ["parking", "wifi"],
  "is_featured": true
}
```

**Uso no Web:**
- Formulário completo de criação
- Upload múltiplo de imagens
- Preview antes de salvar
- Validação de campos obrigatórios

**Nota:** Esta rota precisa ser criada com prefixo `/admin` e verificação de role.

---

#### 1.2 Atualizar Destino
```http
PUT /admin/destinations/{id}
Authorization: Bearer {admin_token}
```

**Uso no Web:**
- Editar destinos existentes
- Gerenciar galeria de fotos
- Toggle is_featured

---

#### 1.3 Deletar Destino (Soft Delete)
```http
DELETE /admin/destinations/{id}
Authorization: Bearer {admin_token}
```

**Uso no Web:**
- Botão "Arquivar" com confirmação
- Soft delete (não remove do BD)

---

### 2. Gestão de Categorias

#### 2.1 Criar Categoria
```http
POST /admin/categories
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Gastronomia",
  "slug": "gastronomia",
  "description": "Restaurantes típicos",
  "icon": "restaurant",
  "color": "#FF6B6B",
  "display_order": 5
}
```

---

#### 2.2 Atualizar/Deletar Categoria
```http
PUT /admin/categories/{id}
DELETE /admin/categories/{id}
```

---

### 3. Gestão de Usuários

#### 3.1 Listar Usuários
```http
GET /admin/users?page=1&per_page=50&role=viewer
Authorization: Bearer {admin_token}
```

**Uso no Web:**
- Tabela de usuários
- Filtros por role, status
- Paginação

---

#### 3.2 Atualizar Role/Status
```http
PATCH /admin/users/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "editor",
  "is_active": true
}
```

**Uso no Web:**
- Promover usuários
- Desativar contas

---

### 4. Estatísticas e Analytics

#### 4.1 Dashboard Overview
```http
GET /admin/stats/overview
Authorization: Bearer {admin_token}
```

**Resposta:**
```json
{
  "total_destinations": 150,
  "total_users": 5420,
  "total_reviews": 1234,
  "total_trips": 890,
  "avg_rating": 4.3,
  "popular_categories": [...]
}
```

**Uso no Web:**
- Cards de métricas principais
- Gráficos de crescimento
- Top destinos

---

#### 4.2 Estatísticas de Destino
```http
GET /admin/destinations/{id}/stats
Authorization: Bearer {admin_token}
```

**Uso no Web:**
- Detalhes de performance
- Views, favorites, reviews ao longo do tempo

---

### 5. Moderação de Conteúdo

#### 5.1 Reviews Pendentes
```http
GET /admin/reviews/pending?page=1
Authorization: Bearer {admin_token}
```

**Uso no Web:**
- Fila de moderação
- Aprovar/Rejeitar reviews
- Flag de conteúdo impróprio

---

#### 5.2 Aprovar/Rejeitar Review
```http
PATCH /admin/reviews/{id}/moderate
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "action": "approve",
  "is_verified": true
}
```

---

## 🔐 Autenticação

### Headers Obrigatórios (Rotas Protegidas)

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Fluxo de Autenticação

1. **Login:** `POST /auth/login` → Recebe `access_token`
2. **Usar Token:** Adicionar em todas as requisições protegidas
3. **Token Expira:** Após 24h (86400 segundos)
4. **Refresh:** Fazer login novamente (ou implementar refresh token)

### Verificação de Role (Web)

Rotas `/admin/*` requerem:
- Token válido
- `user.role = "admin"` ou `"editor"`

---

## 💻 Exemplos de Código

### Mobile (React Native / Expo)

```javascript
// api.js - Configuração base
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://api.wenda.ao',
  timeout: 10000,
});

// Interceptor para adicionar token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@wenda:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Exemplo de uso - Listar destinos
import api from './api';

export const getDestinations = async (params = {}) => {
  try {
    const response = await api.get('/destinations', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

// Exemplo de uso - Adicionar favorito
export const addFavorite = async (destinationId) => {
  try {
    const response = await api.post('/favorites', {
      destination_id: destinationId
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      Alert.alert('Atenção', 'Destino já está nos favoritos');
    }
    throw error;
  }
};

// Componente de Login
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      const { access_token, user } = response.data.data;
      
      // Salvar token
      await AsyncStorage.setItem('@wenda:token', access_token);
      await AsyncStorage.setItem('@wenda:user', JSON.stringify(user));
      
      // Navegar para Home
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  return (
    <View>
      <TextInput 
        value={email} 
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput 
        value={password} 
        onChangeText={setPassword}
        placeholder="Senha"
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};
```

---

### Web (React / Next.js)

```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Hook personalizado para destinos
import { useState, useEffect } from 'react';
import api from './api';

export const useDestinations = (filters = {}) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/destinations', {
          params: filters
        });
        setDestinations(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [JSON.stringify(filters)]);

  return { destinations, loading, error };
};

// Componente de Dashboard
const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const response = await api.get('/admin/stats/overview');
      setStats(response.data);
    };
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard 
        title="Total Destinos" 
        value={stats?.total_destinations} 
        icon="🏛️"
      />
      <StatCard 
        title="Usuários" 
        value={stats?.total_users} 
        icon="👥"
      />
      <StatCard 
        title="Avaliações" 
        value={stats?.total_reviews} 
        icon="⭐"
      />
      <StatCard 
        title="Nota Média" 
        value={stats?.avg_rating?.toFixed(1)} 
        icon="📊"
      />
    </div>
  );
};
```

---

## ⚠️ Tratamento de Erros

### Códigos HTTP e Significados

| Código | Significado | Ação Mobile/Web |
|--------|-------------|-----------------|
| **200** | OK | Processar resposta normalmente |
| **201** | Created | Mostrar sucesso, atualizar lista |
| **400** | Bad Request | Mostrar erros de validação ao usuário |
| **401** | Unauthorized | Redirecionar para login, limpar token |
| **403** | Forbidden | Mostrar "Sem permissão" |
| **404** | Not Found | Mostrar "Não encontrado" |
| **409** | Conflict | Já existe (ex: favorito duplicado) |
| **500** | Server Error | Mostrar erro genérico, tentar novamente |

### Exemplo de Tratamento

```javascript
try {
  const response = await api.post('/favorites', { destination_id });
  Alert.alert('Sucesso', 'Adicionado aos favoritos!');
} catch (error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // Token expirado
        await AsyncStorage.clear();
        navigation.navigate('Login');
        break;
      case 409:
        Alert.alert('Atenção', 'Já está nos favoritos');
        break;
      case 404:
        Alert.alert('Erro', 'Destino não encontrado');
        break;
      default:
        Alert.alert('Erro', 'Algo deu errado. Tente novamente.');
    }
  } else if (error.request) {
    Alert.alert('Erro de Conexão', 'Verifique sua internet');
  }
}
```

---

## 📋 Checklist de Implementação

### Mobile App

- [ ] Configurar axios/fetch com base URL
- [ ] Implementar interceptor para token
- [ ] Gerenciar estado de autenticação (Context/Redux)
- [ ] Telas principais:
  - [ ] Login/Registro
  - [ ] Home (Featured + Recommended)
  - [ ] Explore (Lista com filtros)
  - [ ] Detalhes do Destino
  - [ ] Mapa
  - [ ] Favoritos
  - [ ] Minhas Viagens
  - [ ] Perfil
  - [ ] Busca
- [ ] Implementar paginação (scroll infinito)
- [ ] Cache de imagens (react-native-fast-image)
- [ ] Offline-first (opcional, com Redux Persist)
- [ ] Push notifications (integrar com preferences)

### Web Dashboard

- [ ] Configurar axios com base URL
- [ ] Implementar autenticação (JWT em localStorage)
- [ ] Protected routes (verificar role)
- [ ] Páginas principais:
  - [ ] Login Admin
  - [ ] Dashboard (Overview)
  - [ ] Gestão de Destinos (CRUD)
  - [ ] Gestão de Categorias
  - [ ] Gestão de Usuários
  - [ ] Moderação de Reviews
  - [ ] Estatísticas/Analytics
- [ ] Formulários com validação
- [ ] Upload de imagens (múltiplas)
- [ ] Tabelas com paginação/filtros
- [ ] Gráficos (Chart.js, Recharts)

---

## 🚀 Próximos Passos

### Funcionalidades Futuras (Fase 2)

1. **Upload Real de Imagens**
   - Integrar S3/Cloudinary
   - Resize automático
   - CDN para performance

2. **Notificações Push**
   - Firebase Cloud Messaging
   - Notificar sobre destinos próximos
   - Lembrete de viagens

3. **Sistema de Badges/Achievements**
   - "Visitou 10 destinos"
   - "Primeira avaliação"

4. **Chat/Comentários em Viagens**
   - Viagens compartilhadas
   - Comentários em destinos

5. **Integração com Redes Sociais**
   - Compartilhar destinos
   - Login social (Google, Facebook)

6. **Machine Learning**
   - Recomendações mais precisas
   - Análise de sentimento em reviews

---

## 📞 Suporte

Para dúvidas sobre a API:
- **Email:** dev@wenda.ao
- **Docs Interativas:** `https://api.wenda.ao/docs`
- **GitHub:** github.com/wenda-org/backend-core

---

**Última atualização:** 12 de Novembro de 2025
