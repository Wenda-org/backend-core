# 📚 Wenda API - Índice da Documentação

Bem-vindo à documentação da **Wenda Tourism API**!

---

## 🎯 Para Você (Frontend Developer)

### 📱 **Desenvolvedor Mobile (React Native)**
**Comece aqui:** [Guia React Native Completo](REACT_NATIVE_GUIDE.md)

1. ✅ Copie os types: [`api.types.ts`](api.types.ts)
2. ✅ Configure axios e AsyncStorage
3. ✅ Implemente AuthContext
4. ✅ Use os hooks customizados

**Referência rápida:** [API Quick Reference](API_QUICK_REFERENCE.md)

---

### 🌐 **Desenvolvedor Web (Next.js)**
**Comece aqui:** [Guia Next.js Completo](NEXTJS_GUIDE.md)

1. ✅ Copie os types: [`api.types.ts`](api.types.ts)
2. ✅ Configure React Query
3. ✅ Configure Zustand Store
4. ✅ Use Server Components quando possível

**Referência rápida:** [API Quick Reference](API_QUICK_REFERENCE.md)

---

## 📖 Documentação Completa

### [📄 API Documentation](API_DOCUMENTATION.md)
**Documentação detalhada de TODOS os endpoints**

- ✅ Descrição completa de cada endpoint
- ✅ Exemplos de requisição e resposta
- ✅ Códigos de erro explicados
- ✅ Exemplos de uso com axios
- ✅ Exemplos de implementação

**Use quando:** Precisar entender como um endpoint funciona em detalhes

---

### [⚡ API Quick Reference](API_QUICK_REFERENCE.md)
**Cheatsheet para consulta rápida**

- ✅ Lista de todos os endpoints
- ✅ Exemplos de código direto
- ✅ Setup básico do axios
- ✅ Hooks customizados

**Use quando:** Só precisar de uma referência rápida

---

### [📝 TypeScript Types](api.types.ts)
**Tipos TypeScript completos da API**

```typescript
import type { 
  User, 
  Destination, 
  Review,
  // ... todos os tipos
} from './types/api.types';
```

**Copie para seu projeto:** `src/types/api.types.ts`

---

## 🚀 Quick Start

### 1. Base URL

```typescript
// Desenvolvimento
const API_BASE_URL = 'http://localhost:3000/api';

// Produção
const API_BASE_URL = 'https://api.wenda.ao/api';
```

### 2. Autenticação

```typescript
// Login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'senha123'
});

const token = response.data.data.accessToken;

// Usar token
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### 3. Buscar Dados

```typescript
// Destinos
const destinations = await api.get('/destinations', {
  params: {
    province: 'Luanda',
    sortBy: 'rating',
    page: 1,
    perPage: 20
  }
});

// Favoritos (autenticado)
const favorites = await api.get('/favorites');

// Reviews de um destino
const reviews = await api.get('/reviews/destination/uuid-aqui');
```

---

## 📱 Exemplo Mobile (React Native)

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const [user, setUser] = useState(null);
  
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken } = response.data.data;
    
    await AsyncStorage.setItem('token', accessToken);
    setUser(user);
  };
  
  return { user, login };
}
```

**[Ver implementação completa →](REACT_NATIVE_GUIDE.md)**

---

## 🌐 Exemplo Web (Next.js)

```typescript
// hooks/useDestinations.ts
import { useQuery } from '@tanstack/react-query';

export function useDestinations(filters) {
  return useQuery({
    queryKey: ['destinations', filters],
    queryFn: () => api.get('/destinations', { params: filters })
  });
}

// Componente
function DestinationsPage() {
  const { data, isLoading } = useDestinations({ province: 'Luanda' });
  
  return (
    <div>
      {data?.data.data.map(dest => (
        <DestinationCard key={dest.id} destination={dest} />
      ))}
    </div>
  );
}
```

**[Ver implementação completa →](NEXTJS_GUIDE.md)**

---

## 🎯 Principais Endpoints

### Autenticação
```
POST   /api/auth/register      # Criar conta
POST   /api/auth/login         # Login
GET    /api/auth/profile 🔒    # Meu perfil
PUT    /api/auth/profile 🔒    # Atualizar perfil
```

### Destinos
```
GET    /api/destinations                 # Listar
GET    /api/destinations/:id             # Ver um
GET    /api/destinations?province=...    # Filtrar
```

### Reviews
```
GET    /api/reviews                      # Listar todas
GET    /api/reviews/destination/:id      # De um destino
POST   /api/reviews 🔒                   # Criar
```

### Favoritos
```
GET    /api/favorites 🔒                 # Meus favoritos
POST   /api/favorites 🔒                 # Adicionar
DELETE /api/favorites/:id 🔒             # Remover
```

**🔒 = Requer autenticação (token)**

**[Ver todos os 37 endpoints →](API_DOCUMENTATION.md)**

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

## 🆘 Precisa de Ajuda?

### Por Plataforma

| Se você usa | Leia isto |
|-------------|-----------|
| React Native | [REACT_NATIVE_GUIDE.md](REACT_NATIVE_GUIDE.md) |
| Next.js | [NEXTJS_GUIDE.md](NEXTJS_GUIDE.md) |
| Outro framework | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) |

### Por Tarefa

| Quero | Veja |
|-------|------|
| Entender um endpoint específico | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) |
| Ver código de exemplo rápido | [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) |
| Copiar tipos TypeScript | [api.types.ts](api.types.ts) |
| Implementar autenticação | [REACT_NATIVE_GUIDE.md](REACT_NATIVE_GUIDE.md#3️⃣-context-de-autenticação) |
| Fazer paginação | [API_DOCUMENTATION.md](API_DOCUMENTATION.md#🏝️-destinations) |

---

## 📊 Status da API

✅ **37/37 endpoints implementados (100%)**  
✅ **Documentação completa**  
✅ **Tipos TypeScript**  
✅ **Exemplos de código**  
✅ **Guias por plataforma**  

---

## 📞 Contato

**Backend Team:**
- Slack: #backend-core
- Email: backend@wenda.ao

---

**Última atualização:** 12 de Novembro de 2025  
**Versão da API:** 1.0.0
