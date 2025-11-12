# 📱 Wenda API - Guia React Native (Expo)

## 📦 Instalação de Dependências

```bash
npm install axios @react-native-async-storage/async-storage
# ou
yarn add axios @react-native-async-storage/async-storage

# Opcional (recomendado):
npm install @tanstack/react-query react-native-toast-message
```

---

## 🏗️ Estrutura do Projeto

```
src/
├── api/
│   ├── client.ts          # Configuração do axios
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── destinations.service.ts
│   │   ├── reviews.service.ts
│   │   ├── favorites.service.ts
│   │   └── trips.service.ts
│   └── types.ts           # TypeScript types
├── hooks/
│   ├── useAuth.ts
│   ├── useDestinations.ts
│   └── useFavorites.ts
├── context/
│   └── AuthContext.tsx
└── screens/
    ├── LoginScreen.tsx
    ├── DestinationsScreen.tsx
    └── DestinationDetailScreen.tsx
```

---

## 1️⃣ Configuração do Cliente API

### `src/api/client.ts`

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api' // Android Emulator
  : 'https://api.wenda.ao/api';

// Criar instância do axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao buscar token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      // Navegar para login (implementar navegação)
    }
    
    // Formatear erro para exibição
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Erro desconhecido';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
```

---

## 2️⃣ Serviços da API

### `src/api/services/auth.service.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../client';
import type { 
  RegisterDto, 
  LoginDto, 
  AuthResponse, 
  User,
  UpdateProfileDto 
} from '../types';

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    
    if (response.data.success) {
      const { accessToken, user } = response.data.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    
    if (response.data.success) {
      const { accessToken, user } = response.data.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    
    if (response.data.success) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await api.put('/auth/profile', data);
    
    if (response.data.success) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data.data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  },
};
```

### `src/api/services/destinations.service.ts`

```typescript
import api from '../client';
import type { 
  Destination, 
  DestinationSummary,
  DestinationFilters,
  PaginatedResponse 
} from '../types';

export const destinationsService = {
  async getAll(
    filters?: DestinationFilters
  ): Promise<PaginatedResponse<DestinationSummary>> {
    const response = await api.get('/destinations', { params: filters });
    return response.data;
  },

  async getById(id: string): Promise<Destination> {
    const response = await api.get(`/destinations/${id}`);
    return response.data.data;
  },

  async search(query: string): Promise<DestinationSummary[]> {
    const response = await api.get('/destinations', {
      params: { search: query, perPage: 20 },
    });
    return response.data.data;
  },

  async getByProvince(province: string): Promise<DestinationSummary[]> {
    const response = await api.get('/destinations', {
      params: { province, perPage: 50 },
    });
    return response.data.data;
  },

  async getByCategory(categoryId: string): Promise<DestinationSummary[]> {
    const response = await api.get('/destinations', {
      params: { categoryId, perPage: 50 },
    });
    return response.data.data;
  },

  async getFeatured(): Promise<DestinationSummary[]> {
    const response = await api.get('/destinations', {
      params: { sortBy: 'rating', perPage: 10 },
    });
    // Filtrar featured no cliente ou adicionar endpoint específico no backend
    return response.data.data.filter((d: any) => d.isFeatured);
  },
};
```

### `src/api/services/favorites.service.ts`

```typescript
import api from '../client';
import type { Favorite, FavoriteCheckResponse } from '../types';

export const favoritesService = {
  async getAll(): Promise<Favorite[]> {
    const response = await api.get('/favorites');
    return response.data.data;
  },

  async add(destinationId: string): Promise<Favorite> {
    const response = await api.post('/favorites', { destinationId });
    return response.data.data;
  },

  async remove(favoriteId: string): Promise<void> {
    await api.delete(`/favorites/${favoriteId}`);
  },

  async check(destinationId: string): Promise<boolean> {
    const response = await api.get(`/favorites/check/${destinationId}`);
    return response.data.data.isFavorite;
  },

  async toggle(destinationId: string): Promise<{ isFavorite: boolean }> {
    const isFavorite = await this.check(destinationId);
    
    if (isFavorite) {
      // Buscar ID do favorito para remover
      const favorites = await this.getAll();
      const favorite = favorites.find(
        (f) => f.destination.id === destinationId
      );
      if (favorite) {
        await this.remove(favorite.id);
      }
      return { isFavorite: false };
    } else {
      await this.add(destinationId);
      return { isFavorite: true };
    }
  },
};
```

---

## 3️⃣ Context de Autenticação

### `src/context/AuthContext.tsx`

```typescript
import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { authService } from '../api/services/auth.service';
import type { User, LoginDto, RegisterDto } from '../api/types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        // Validar token buscando perfil
        const profile = await authService.getProfile();
        setUser(profile);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      await authService.logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(data: LoginDto) {
    const response = await authService.login(data);
    setUser(response.user);
  }

  async function register(data: RegisterDto) {
    const response = await authService.register(data);
    setUser(response.user);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  function updateUser(updatedUser: User) {
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
```

---

## 4️⃣ Custom Hooks

### `src/hooks/useDestinations.ts`

```typescript
import { useState, useEffect } from 'react';
import { destinationsService } from '../api/services/destinations.service';
import type { DestinationSummary, DestinationFilters } from '../api/types';

export function useDestinations(filters?: DestinationFilters) {
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  async function loadDestinations(page = 1) {
    try {
      setLoading(true);
      setError(null);
      
      const response = await destinationsService.getAll({
        ...filters,
        page,
        perPage: 20,
      });

      if (page === 1) {
        setDestinations(response.data);
      } else {
        setDestinations((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.meta.hasNext);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDestinations(1);
  }, [JSON.stringify(filters)]);

  function loadMore() {
    if (!loading && hasMore) {
      loadDestinations(currentPage + 1);
    }
  }

  function refresh() {
    loadDestinations(1);
  }

  return {
    destinations,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
```

### `src/hooks/useFavorites.ts`

```typescript
import { useState, useEffect } from 'react';
import { favoritesService } from '../api/services/favorites.service';
import type { Favorite } from '../api/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadFavorites() {
    try {
      setLoading(true);
      const data = await favoritesService.getAll();
      setFavorites(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function toggleFavorite(destinationId: string) {
    try {
      const result = await favoritesService.toggle(destinationId);
      await loadFavorites(); // Recarregar lista
      return result.isFavorite;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  function isFavorite(destinationId: string): boolean {
    return favorites.some((f) => f.destination.id === destinationId);
  }

  return {
    favorites,
    loading,
    error,
    toggleFavorite,
    isFavorite,
    refresh: loadFavorites,
  };
}
```

---

## 5️⃣ Exemplos de Telas

### `src/screens/LoginScreen.tsx`

```typescript
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      // Navegação será feita automaticamente pelo AuthContext
    } catch (error: any) {
      Alert.alert('Erro no login', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wenda Tourism</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        disabled={loading}
      >
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: '#007AFF',
    marginTop: 20,
    fontSize: 14,
  },
});
```

### `src/screens/DestinationsScreen.tsx`

```typescript
import React from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDestinations } from '../hooks/useDestinations';
import { useFavorites } from '../hooks/useFavorites';
import type { DestinationSummary } from '../api/types';

export function DestinationsScreen({ navigation }: any) {
  const { destinations, loading, error, hasMore, loadMore, refresh } = 
    useDestinations({ sortBy: 'rating' });
  const { toggleFavorite, isFavorite } = useFavorites();

  function renderDestination({ item }: { item: DestinationSummary }) {
    const favorite = isFavorite(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('DestinationDetail', { id: item.id })}
      >
        <Image
          source={{ uri: item.images[0]?.url }}
          style={styles.image}
        />
        
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>
            📍 {item.location}, {item.province}
          </Text>
          <Text style={styles.category}>🏷️ {item.category.name}</Text>
          
          <View style={styles.footer}>
            <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({item.reviewCount} avaliações)</Text>
            
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={async () => {
                try {
                  await toggleFavorite(item.id);
                } catch (err: any) {
                  console.error(err);
                }
              }}
            >
              <Text style={styles.favoriteIcon}>
                {favorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (loading && destinations.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={destinations}
      keyExtractor={(item) => item.id}
      renderItem={renderDestination}
      contentContainerStyle={styles.list}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
      ListFooterComponent={
        hasMore ? (
          <ActivityIndicator style={styles.loader} />
        ) : destinations.length > 0 ? (
          <Text style={styles.endText}>Fim da lista</Text>
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhum destino encontrado</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  info: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  category: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    flex: 1,
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  endText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
```

---

## 6️⃣ Configuração do App.tsx

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { DestinationsScreen } from './screens/DestinationsScreen';
// ... outras screens

const Stack = createNativeStackNavigator();

function Navigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // ou splash screen
  }

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Destinations" component={DestinationsScreen} />
          <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} />
          {/* ... outras screens */}
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
```

---

## 🎯 Próximos Passos

1. ✅ Copie os types de `docs/api.types.ts`
2. ✅ Implemente os serviços necessários
3. ✅ Configure o AuthContext
4. ✅ Crie suas screens
5. 🔄 Adicione tratamento de erros com Toast
6. 🔄 Implemente cache com React Query (opcional)
7. 🔄 Adicione animações e transições

---

**Documentação completa:** `docs/API_DOCUMENTATION.md`
