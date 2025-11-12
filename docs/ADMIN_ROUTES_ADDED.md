# ✅ Rotas Admin CRUD Adicionadas

**Data:** 12 de Novembro de 2025  
**Atualização:** Rotas de gestão completas

---

## 🎯 Rotas Adicionadas

### Total: **+10 novas rotas Admin**
Antes: 40 rotas → **Agora: 50 rotas**

---

## 📍 CRUD de Destinos (Admin)

### 1. **POST /admin/destinations** ✨
**Descrição:** Criar novo destino turístico  
**Auth:** Admin ou Editor  
**Body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "long_description": "string (optional)",
  "location": "string (required)",
  "province": "string (required)",
  "address": "string (optional)",
  "category_id": "uuid (required)",
  "latitude": "float (required)",
  "longitude": "float (required)",
  "opening_hours": "string (optional)",
  "ticket_price": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "website": "string (optional)"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Destination created successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "slug": "auto-generated",
    "category": "string",
    "created_at": "timestamp"
  }
}
```

---

### 2. **PUT /admin/destinations/{destination_id}** ✏️
**Descrição:** Atualizar destino existente  
**Auth:** Admin ou Editor  
**Body:** Todos os campos são opcionais
```json
{
  "name": "string",
  "description": "string",
  "is_active": "boolean",
  "is_featured": "boolean",
  ...
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Destination updated successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "updated_at": "timestamp"
  }
}
```

---

### 3. **DELETE /admin/destinations/{destination_id}** 🗑️
**Descrição:** Deletar destino (soft delete)  
**Auth:** Admin ou Editor  

**Resposta:**
```json
{
  "success": true,
  "message": "Destination deleted successfully"
}
```

**Nota:** Soft delete - apenas marca `deleted_at`, dados não são perdidos.

---

### 4. **POST /admin/destinations/{destination_id}/images** 📸
**Descrição:** Adicionar imagem a um destino  
**Auth:** Admin ou Editor  
**Body:**
```json
{
  "url": "string (required)",
  "caption": "string (optional)",
  "is_main": "boolean (default: false)",
  "display_order": "integer (default: 0)"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Image added successfully",
  "data": {
    "id": "uuid",
    "url": "string",
    "is_main": "boolean"
  }
}
```

**TODO:** Integrar com S3/Cloudinary para upload real de imagens.

---

### 5. **DELETE /admin/destinations/{destination_id}/images/{image_id}** 🖼️
**Descrição:** Remover imagem de um destino  
**Auth:** Admin ou Editor  

**Resposta:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## 🏷️ CRUD de Categorias (Admin)

### 6. **POST /admin/categories** ✨
**Descrição:** Criar nova categoria  
**Auth:** Admin ou Editor  
**Body:**
```json
{
  "name": "string (required)",
  "icon": "string (optional)",
  "color": "string (optional, hex)",
  "description": "string (optional)",
  "display_order": "integer (default: 0)"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "slug": "auto-generated",
    "created_at": "timestamp"
  }
}
```

**Validação:** Slug deve ser único. Se já existir, retorna erro 409 Conflict.

---

### 7. **PUT /admin/categories/{category_id}** ✏️
**Descrição:** Atualizar categoria existente  
**Auth:** Admin ou Editor  
**Body:** Todos os campos opcionais
```json
{
  "name": "string",
  "icon": "string",
  "color": "string",
  "description": "string",
  "display_order": "integer"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "updated_at": "timestamp"
  }
}
```

---

### 8. **DELETE /admin/categories/{category_id}** 🗑️
**Descrição:** Deletar categoria  
**Auth:** Admin ou Editor  

**Resposta:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Validação:** Não permite deletar se houver destinos associados. Retorna erro 409 Conflict com a mensagem:
```json
{
  "detail": "Cannot delete category with X associated destinations"
}
```

---

## 🔐 Autenticação e Permissões

Todas as rotas Admin requerem:
- **Header:** `Authorization: Bearer {token}`
- **Role:** `admin` ou `editor` (verificado pelo middleware `require_admin`)

**Se usuário não for admin/editor:**
```json
{
  "detail": "Admin or Editor access required"
}
```

**Se token inválido/ausente:**
```json
{
  "detail": "Not authenticated"
}
```

---

## 📊 Resumo de Rotas Admin

| Rota | Método | Descrição |
|------|--------|-----------|
| `/admin/stats/overview` | GET | Dashboard stats |
| `/admin/destinations` | GET | Listar destinos (admin view) |
| **`/admin/destinations`** | **POST** | **Criar destino ✨** |
| **`/admin/destinations/{id}`** | **PUT** | **Editar destino ✨** |
| **`/admin/destinations/{id}`** | **DELETE** | **Deletar destino ✨** |
| **`/admin/destinations/{id}/images`** | **POST** | **Add imagem ✨** |
| **`/admin/destinations/{id}/images/{img_id}`** | **DELETE** | **Remover imagem ✨** |
| `/admin/destinations/{id}/stats` | GET | Stats do destino |
| `/admin/users` | GET | Listar usuários |
| `/admin/users/{id}` | PATCH | Atualizar usuário |
| `/admin/reviews/pending` | GET | Reviews pendentes |
| `/admin/reviews/{id}/moderate` | PATCH | Moderar review |
| **`/admin/categories`** | **POST** | **Criar categoria ✨** |
| **`/admin/categories/{id}`** | **PUT** | **Editar categoria ✨** |
| **`/admin/categories/{id}`** | **DELETE** | **Deletar categoria ✨** |

**Total:** 15 rotas Admin (10 novas + 5 anteriores)

---

## 🧪 Testando as Rotas

### Exemplo: Criar Destino

```bash
curl -X POST http://localhost:8000/admin/destinations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Miradouro da Lua",
    "description": "Formações rochosas únicas",
    "location": "Luanda",
    "province": "Luanda",
    "category_id": "CATEGORY_UUID",
    "latitude": -9.2833,
    "longitude": 13.2167
  }'
```

### Exemplo: Atualizar Destino

```bash
curl -X PUT http://localhost:8000/admin/destinations/DEST_UUID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_featured": true,
    "ticket_price": "1000 Kz"
  }'
```

### Exemplo: Criar Categoria

```bash
curl -X POST http://localhost:8000/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Praias",
    "icon": "beach",
    "color": "#00BFFF",
    "display_order": 1
  }'
```

---

## ✅ Funcionalidades Implementadas

- [x] **Auto-geração de slugs** (name → slug)
- [x] **Validação de UUIDs**
- [x] **Soft delete** para destinos
- [x] **Hard delete** para categorias (com validação)
- [x] **Proteção contra duplicatas** (slug único)
- [x] **Atualização de timestamps** (updated_at)
- [x] **Gestão de imagem principal** (is_main)
- [x] **Middleware de permissões** (admin/editor)

---

## 🚀 Próximos Passos

### Para Web Dashboard:

1. **Criar interface de gestão** usando essas rotas
2. **Upload de imagens** - implementar S3/Cloudinary
3. **Bulk operations** - deletar/atualizar múltiplos
4. **Versioning** - histórico de mudanças
5. **Preview mode** - visualizar antes de publicar

### Melhorias Futuras:

- [ ] Filtros avançados no GET /admin/destinations
- [ ] Ordenação customizada de categorias
- [ ] Validação de coordenadas (bounds de Angola)
- [ ] Resize automático de imagens
- [ ] CDN para imagens
- [ ] Logs de auditoria (quem criou/editou)

---

**✨ Todas as rotas CRUD essenciais estão implementadas!**

---

*Desenvolvido com ❤️ para Wenda - Turismo em Angola*
