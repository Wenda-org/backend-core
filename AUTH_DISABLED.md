# 🔓 Autenticação Temporariamente Desativada

## Status: Autenticação desabilitada para testes

Todos os guards de autenticação foram **comentados** (não deletados) para facilitar testes durante o desenvolvimento.

## ⚠️ IMPORTANTE: Para PRODUÇÃO

Antes de ir para produção, **REATIVAR AUTENTICAÇÃO**:

### Como reativar:

1. **Buscar por TODOs:**
```bash
grep -r "TODO: Reativar autenticação" src/
```

2. **Descomentar guards:**
   - Remover `//` de `@UseGuards(...)`
   - Remover `//` de `@ApiBearerAuth('JWT-auth')`
   - Remover `//` de `@Roles(...)`

3. **Remover IDs temporários:**
   - Buscar por: `'00000000-0000-0000-0000-000000000001'`
   - Remover fallback: `user?.id || '00000000...'` → `user.id`
   - Tornar `@CurrentUser() user?: RequestUser` → `@CurrentUser() user: RequestUser`

## 📝 Arquivos modificados:

### Auth Module
- `src/modules/auth/auth.controller.ts`
  - GET `/auth/profile` - Guard comentado
  - PUT `/auth/profile` - Guard comentado

### Users Module
- `src/modules/users/users.controller.ts`
  - Guard global comentado
  - Todos os endpoints admin sem proteção

### Categories Module
- `src/modules/categories/categories.controller.ts`
  - POST, PUT, DELETE sem guards

### Destinations Module
- `src/modules/destinations/destinations.controller.ts`
  - POST, PUT, DELETE sem guards

### Reviews Module
- `src/modules/reviews/reviews.controller.ts`
  - Todos os endpoints sem autenticação
  - userId temporário: `'00000000-0000-0000-0000-000000000001'`

### Favorites Module
- `src/modules/favorites/favorites.controller.ts`
  - Todos os endpoints sem autenticação
  - userId temporário: `'00000000-0000-0000-0000-000000000001'`

### Trips Module
- `src/modules/trips/trips.controller.ts`
  - Todos os endpoints sem autenticação
  - userId temporário: `'00000000-0000-0000-0000-000000000001'`

## 🧪 Testando sem autenticação:

Agora todos os endpoints podem ser chamados sem header `Authorization`:

```bash
# Antes (com auth):
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/reviews

# Agora (sem auth):
curl http://localhost:3000/api/reviews
```

## 🔐 Script para reativar:

```bash
# Descomentar todos os guards
find src/modules -name "*.controller.ts" -exec sed -i 's/\/\/ @UseGuards/@UseGuards/g' {} \;
find src/modules -name "*.controller.ts" -exec sed -i 's/\/\/ @ApiBearerAuth/@ApiBearerAuth/g' {} \;
find src/modules -name "*.controller.ts" -exec sed -i 's/\/\/ @Roles/@Roles/g' {} \;

# Verificar manualmente os userId temporários e parâmetros opcionais
grep -r "00000000-0000-0000-0000-000000000001" src/
grep -r "user\?: RequestUser" src/
```

## 📊 Endpoints afetados:

- ✅ **37 endpoints** agora são públicos (temporariamente)
- ⚠️ **Cuidado:** Qualquer pessoa pode criar/editar/deletar dados
- 🔄 **Reversível:** Todas as mudanças são comentários, não deleções

## Quando reativar:

- [ ] Antes do deploy em produção
- [ ] Quando implementar sistema de login no frontend
- [ ] Quando testar autenticação end-to-end
