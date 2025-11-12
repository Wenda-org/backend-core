# 🔐 Sistema de Roles e Permissões

## 📊 Roles Disponíveis

O sistema possui 2 tipos de usuários:

- **`user`** - Usuário comum (padrão)
- **`admin`** - Administrador com permissões especiais

## 🎯 Diferenças entre Roles

### User (Usuário Comum)
✅ **Pode:**
- Registrar-se e fazer login
- Ver destinos, categorias
- Criar, editar e deletar suas próprias reviews
- Adicionar/remover favoritos
- Criar e gerenciar suas viagens (trips)
- Atualizar seu próprio perfil

❌ **Não pode:**
- Criar, editar ou deletar destinos
- Criar, editar ou deletar categorias
- Editar reviews de outros usuários

### Admin (Administrador)
✅ **Pode fazer tudo que o User pode, MAIS:**
- Criar, editar e deletar destinos
- Criar, editar e deletar categorias
- Gerenciar todos os recursos do sistema

## 🔧 Como Criar um Usuário Admin

### Opção 1: Via Banco de Dados (Recomendado para primeiro admin)

Após registrar um usuário normal, atualize seu role no banco:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'seu-admin@example.com';
```

### Opção 2: Via Prisma Studio

```bash
npx prisma studio
```

1. Abra a tabela `users`
2. Encontre o usuário
3. Altere o campo `role` de `user` para `admin`
4. Salve

### Opção 3: Via Seed (Desenvolvimento)

Adicione no arquivo `prisma/seed.ts`:

```typescript
// Create admin user
const adminUser = await prisma.user.create({
  data: {
    name: 'Admin User',
    email: 'admin@wenda.ao',
    passwordHash: await bcrypt.hash('Admin123!', 12),
    role: 'admin',
  },
});
```

Execute: `npx prisma db seed`

## 🛡️ Rotas Protegidas por Role

### Rotas Públicas (sem autenticação)
- `GET /api/destinations` - Listar destinos
- `GET /api/destinations/:id` - Ver destino
- `GET /api/destinations/featured` - Destinos em destaque
- `GET /api/categories` - Listar categorias
- `GET /api/categories/:id` - Ver categoria
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/health` - Health check

### Rotas Autenticadas (User ou Admin)
- `GET /api/users/profile` - Ver perfil
- `PUT /api/users/profile` - Atualizar perfil
- `POST /api/reviews` - Criar review
- `PUT /api/reviews/:id` - Atualizar própria review
- `DELETE /api/reviews/:id` - Deletar própria review
- `POST /api/reviews/:id/helpful` - Marcar como útil
- `GET /api/favorites` - Listar favoritos
- `POST /api/favorites` - Adicionar favorito
- `DELETE /api/favorites/:id` - Remover favorito
- `GET /api/trips` - Listar viagens
- `POST /api/trips` - Criar viagem
- `PUT /api/trips/:id` - Atualizar viagem
- `DELETE /api/trips/:id` - Deletar viagem
- `POST /api/trips/:id/destinations` - Adicionar destino à viagem

### Rotas Admin Only
- `POST /api/destinations` - Criar destino
- `PUT /api/destinations/:id` - Atualizar destino
- `DELETE /api/destinations/:id` - Deletar destino
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

## 💡 Exemplos de Uso

### 1. Registrar Usuário Comum
```bash
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "Senha123!",
  "confirmPassword": "Senha123!",
  "phone": "+244 923 456 789"
}
```

Resposta inclui `"role": "user"`

### 2. Login e Verificar Role
```bash
POST /api/auth/login
{
  "email": "admin@wenda.ao",
  "password": "Admin123!"
}
```

Resposta:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@wenda.ao",
      "role": "admin"  // <-- Aqui está o role
    },
    "accessToken": "eyJhbGc..."
  }
}
```

### 3. Tentar Criar Destino como User
```bash
POST /api/destinations
Authorization: Bearer TOKEN_DE_USER_COMUM

Resposta: 403 Forbidden
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

### 4. Criar Destino como Admin
```bash
POST /api/destinations
Authorization: Bearer TOKEN_DE_ADMIN

Resposta: 201 Created
{
  "success": true,
  "message": "Destination created successfully",
  "data": { ... }
}
```

## 🔒 Implementação Técnica

### Guards Aplicados

**JwtAuthGuard** - Valida token JWT  
**RolesGuard** - Valida se usuário tem o role necessário

### Decorator @Roles

```typescript
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')  // Apenas admins
async create() { ... }
```

### JWT Payload

O token JWT inclui o role:

```typescript
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "admin"  // ou "user"
}
```

## 🚀 Testando Permissões

1. **Registre 2 usuários:**
   - user@test.com (role: user)
   - admin@test.com (role: user → altere para admin no DB)

2. **Faça login com cada um e salve os tokens**

3. **Teste rotas admin:**
   - Com token do user → deve retornar 403
   - Com token do admin → deve funcionar

4. **Teste rotas normais:**
   - Ambos devem conseguir acessar

## 📝 Campos Adicionados

### RegisterDto
- `phone` (opcional) - Telefone do usuário
- `avatarUrl` (opcional) - URL da foto de perfil
- `confirmPassword` (obrigatório) - Confirmação de senha

### User Model
- `role` (enum: user | admin) - Tipo de usuário
- Índice adicionado em `role` para queries

## ⚠️ Segurança

- Senhas criptografadas com bcrypt (cost 12)
- Tokens JWT expiram em 7 dias
- Role incluído no JWT e validado em cada request
- Não é possível alterar próprio role via API
- Apenas via banco de dados por segurança
