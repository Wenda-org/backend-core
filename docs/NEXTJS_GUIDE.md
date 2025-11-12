# 🌐 Wenda API - Guia Next.js (Web)

## 📦 Instalação de Dependências

```bash
npm install axios @tanstack/react-query zustand
# ou
yarn add axios @tanstack/react-query zustand

# Opcional:
npm install zod react-hook-form @hookform/resolvers
```

---

## 🏗️ Estrutura do Projeto (App Router)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── destinations/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   └── services/
│   │       ├── auth.ts
│   │       ├── destinations.ts
│   │       ├── reviews.ts
│   │       └── favorites.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useDestinations.ts
│   └── stores/
│       └── authStore.ts
├── components/
│   ├── DestinationCard.tsx
│   ├── FavoriteButton.tsx
│   └── ReviewForm.tsx
└── types/
    └── api.types.ts
```

---

## 1️⃣ Configuração do Cliente API

### `src/lib/api/client.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // No client-side, pegar token do localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
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

## 2️⃣ Zustand Store (State Management)

### `src/lib/stores/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/api.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
      },
      
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateUser: (user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

## 3️⃣ Serviços da API

### `src/lib/api/services/auth.ts`

```typescript
import api from '../client';
import type { RegisterDto, LoginDto, AuthResponse, User, UpdateProfileDto } from '@/types/api.types';

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data.data;
  },
};
```

### `src/lib/api/services/destinations.ts`

```typescript
import api from '../client';
import type { Destination, DestinationSummary, DestinationFilters, PaginatedResponse } from '@/types/api.types';

export const destinationsService = {
  async getAll(filters?: DestinationFilters): Promise<PaginatedResponse<DestinationSummary>> {
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
};
```

---

## 4️⃣ React Query Setup

### `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### `src/app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 5️⃣ Custom Hooks com React Query

### `src/lib/hooks/useDestinations.ts`

```typescript
'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { destinationsService } from '../api/services/destinations';
import type { DestinationFilters } from '@/types/api.types';

export function useDestinations(filters?: DestinationFilters) {
  return useQuery({
    queryKey: ['destinations', filters],
    queryFn: () => destinationsService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useDestination(id: string) {
  return useQuery({
    queryKey: ['destination', id],
    queryFn: () => destinationsService.getById(id),
    enabled: !!id,
  });
}

// Infinite scroll
export function useInfiniteDestinations(filters?: Omit<DestinationFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['destinations-infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      destinationsService.getAll({ ...filters, page: pageParam, perPage: 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
  });
}
```

### `src/lib/hooks/useAuth.ts`

```typescript
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../api/services/auth';
import type { LoginDto, RegisterDto } from '@/types/api.types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);
      router.push('/destinations');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);
      router.push('/destinations');
    },
  });

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
```

### `src/lib/hooks/useFavorites.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '../api/services/favorites';

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesService.getAll(),
  });

  const toggleMutation = useMutation({
    mutationFn: (destinationId: string) => favoritesService.toggle(destinationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const isFavorite = (destinationId: string) =>
    favorites.some((f) => f.destination.id === destinationId);

  return {
    favorites,
    isLoading,
    toggleFavorite: toggleMutation.mutate,
    isFavorite,
  };
}
```

---

## 6️⃣ Componentes

### `src/components/DestinationCard.tsx`

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FavoriteButton } from './FavoriteButton';
import type { DestinationSummary } from '@/types/api.types';

interface Props {
  destination: DestinationSummary;
}

export function DestinationCard({ destination }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/destinations/${destination.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={destination.images[0]?.url || '/placeholder.jpg'}
            alt={destination.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/destinations/${destination.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {destination.name}
            </h3>
          </Link>
          <FavoriteButton destinationId={destination.id} />
        </div>

        <p className="text-sm text-gray-600 mb-1">
          📍 {destination.location}, {destination.province}
        </p>

        <p className="text-xs text-gray-500 mb-3">
          🏷️ {destination.category.name}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold">{destination.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">
              ({destination.reviewCount} avaliações)
            </span>
          </div>

          {destination.isFeatured && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              ✨ Destaque
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

### `src/components/FavoriteButton.tsx`

```typescript
'use client';

import { useFavorites } from '@/lib/hooks/useFavorites';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';

interface Props {
  destinationId: string;
}

export function FavoriteButton({ destinationId }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorite = isFavorite(destinationId);

  function handleClick() {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    toggleFavorite(destinationId);
  }

  return (
    <button
      onClick={handleClick}
      className="text-2xl hover:scale-110 transition-transform"
      aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      {favorite ? '❤️' : '🤍'}
    </button>
  );
}
```

---

## 7️⃣ Páginas (App Router)

### `src/app/(auth)/login/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    login(
      { email, password },
      {
        onError: (err: any) => {
          setError(err.message);
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Wenda Tourism
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoggingIn}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoggingIn}
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoggingIn ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Não tem conta?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### `src/app/destinations/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useDestinations } from '@/lib/hooks/useDestinations';
import { DestinationCard } from '@/components/DestinationCard';

export default function DestinationsPage() {
  const [province, setProvince] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useDestinations({
    province: province || undefined,
    search: search || undefined,
    sortBy: 'rating',
    perPage: 20,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Destinos Turísticos
        </h1>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Buscar destinos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as Províncias</option>
            <option value="Luanda">Luanda</option>
            <option value="Benguela">Benguela</option>
            <option value="Huíla">Huíla</option>
            {/* ... */}
          </select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            ❌ {error.message}
          </div>
        )}

        {/* Destinations Grid */}
        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>

            {/* Pagination Info */}
            <div className="mt-8 text-center text-gray-600">
              Mostrando {data.data.length} de {data.meta.total} destinos
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 8️⃣ Middleware de Autenticação

### `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/favorites') ||
                          request.nextUrl.pathname.startsWith('/trips') ||
                          request.nextUrl.pathname.startsWith('/profile');

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/destinations', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/favorites/:path*', '/trips/:path*', '/profile/:path*', '/login', '/register'],
};
```

---

## 9️⃣ Environment Variables

### `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🎯 Próximos Passos

1. ✅ Configure TypeScript types
2. ✅ Implemente React Query
3. ✅ Configure Zustand para auth
4. ✅ Crie componentes reutilizáveis
5. 🔄 Adicione Server-Side Rendering (SSR)
6. 🔄 Implemente SEO com metadata
7. 🔄 Adicione Tailwind CSS animations

---

**Documentação completa:** `docs/API_DOCUMENTATION.md`
