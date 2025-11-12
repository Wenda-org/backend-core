# 🚀 Guia Completo de Implementação - Wenda Backend API

**Projeto:** Wenda Tourism Platform - Backend REST API  
**Stack:** FastAPI + PostgreSQL + SQLAlchemy  
**Versão:** 1.0.0  
**Data:** 12 de Novembro de 2025

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Banco de Dados](#banco-de-dados)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelos (SQLAlchemy)](#modelos-sqlalchemy)
6. [Schemas (Pydantic)](#schemas-pydantic)
7. [Rotas da API](#rotas-da-api)
8. [Autenticação e Segurança](#autenticação-e-segurança)
9. [Funcionalidades Principais](#funcionalidades-principais)
10. [Configuração e Deploy](#configuração-e-deploy)
11. [Testes](#testes)
12. [Melhorias Futuras](#melhorias-futuras)

---

## 1. Visão Geral do Projeto

### 🎯 Objetivo

Desenvolver uma API REST completa para uma plataforma de turismo em Angola que:

- **Mobile App:** Permite usuários descobrir destinos turísticos, criar viagens, avaliar locais
- **Web Dashboard:** Permite administradores gerenciar destinos, categorias, usuários e moderação

### 🌟 Principais Funcionalidades

#### Para Usuários (Mobile):
- Explorar destinos turísticos com filtros avançados
- Ver destinos em destaque e recomendações personalizadas
- Sistema de favoritos
- Avaliar destinos com fotos
- Planejar viagens com múltiplos destinos
- Busca global e por localização
- Visualização em mapa

#### Para Administradores (Web):
- Dashboard com estatísticas
- CRUD completo de destinos e categorias
- Gestão de imagens
- Moderação de reviews
- Gestão de usuários

---

## 2. Arquitetura do Sistema

### Stack Tecnológico

```
┌─────────────────────────────────────────┐
│         Frontend (Mobile/Web)           │
│    React Native / Next.js / React       │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST
                  │ JSON
┌─────────────────▼───────────────────────┐
│         FastAPI Backend API             │
│  - Routes (10 módulos)                  │
│  - JWT Authentication                   │
│  - Pydantic Validation                  │
│  - SQLAlchemy ORM                       │
└─────────────────┬───────────────────────┘
                  │ SQL
┌─────────────────▼───────────────────────┐
│      PostgreSQL Database (Neon)         │
│  - 17 tabelas                           │
│  - UUID primary keys                    │
│  - JSONB fields                         │
│  - Soft deletes                         │
└─────────────────────────────────────────┘
```

### Princípios de Design

1. **RESTful API** - Endpoints seguem convenções REST
2. **Stateless JWT** - Autenticação sem sessão no servidor
3. **Soft Delete** - Dados nunca são perdidos permanentemente
4. **Paginação** - Todas listas retornam metadados de paginação
5. **Validação** - Pydantic v2 valida todos inputs
6. **Documentação Automática** - OpenAPI/Swagger gerado automaticamente

---

## 3. Banco de Dados

### 📊 Estrutura (17 Tabelas)

#### **Tabelas Principais:**

1. **users** - Usuários do sistema
2. **categories** - Categorias de destinos (praias, museus, etc)
3. **destinations** - Destinos turísticos
4. **destination_images** - Galeria de imagens dos destinos
5. **reviews** - Avaliações dos usuários
6. **review_images** - Imagens das avaliações
7. **review_helpful** - Marcações de "útil" em reviews
8. **favorites** - Destinos favoritos dos usuários
9. **trips** - Viagens planejadas
10. **trip_destinations** - Destinos em cada viagem
11. **user_preferences** - Preferências dos usuários
12. **password_resets** - Tokens de reset de senha

#### **Tabelas Auxiliares (ML/Stats):**

13. **ml_models_registry** - Registro de modelos de ML
14. **ml_predictions** - Previsões de visitantes
15. **recommendations_log** - Log de recomendações
16. **tourism_statistics** - Estatísticas de turismo

#### **Schema JSON:**

O schema completo está em `docs/bd.json`. Principais características:

```json
// Exemplo da tabela users
{
  "table_name": "users",
  "columns": {
    "id": "uuid PRIMARY KEY",
    "name": "character varying",
    "email": "character varying UNIQUE",
    "password_hash": "character varying",
    "avatar_url": "character varying",
    "phone": "character varying",
    "bio": "text",
    "country": "character varying",
    "email_verified_at": "timestamp",
    "google_id": "character varying UNIQUE",
    "apple_id": "character varying UNIQUE",
    "role": "character varying",  // viewer, editor, admin
    "is_active": "boolean",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "deleted_at": "timestamp"  // soft delete
  }
}
```

### 🔑 Principais Constraints

- **UUID** para todas primary keys
- **UNIQUE** em emails, slugs
- **Foreign Keys** com CASCADE ou RESTRICT
- **CHECK** constraints (ex: rating entre 1-5)
- **Unique constraints** compostos (ex: user_id + destination_id em reviews)

---

## 4. Estrutura de Pastas

```
backend-core/
├── main.py                      # Entry point da aplicação
├── requirements.txt             # Dependências Python
├── .env                         # Variáveis de ambiente
├── alembic.ini                  # Configuração do Alembic
│
├── app/
│   ├── core/
│   │   ├── config.py           # Configurações (JWT, DB URL)
│   │   ├── security.py         # Hash de senha, JWT
│   │   └── dependencies.py     # Auth middleware
│   │
│   ├── database/
│   │   ├── connection.py       # PostgreSQL connection
│   │   └── redis_connection.py # Redis (opcional)
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── destination.py
│   │   ├── review.py
│   │   ├── favorite.py
│   │   ├── trip.py
│   │   └── user_preferences.py
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── user_schema.py
│   │   ├── category_schema.py
│   │   ├── destination_schema.py
│   │   ├── review_schema.py
│   │   ├── favorite_schema.py
│   │   └── trip_schema.py
│   │
│   └── routes/                 # API endpoints
│       ├── auth.py             # 4 rotas
│       ├── categories.py       # 1 rota
│       ├── destinations.py     # 5 rotas
│       ├── reviews.py          # 4 rotas
│       ├── favorites.py        # 3 rotas
│       ├── trips.py            # 8 rotas
│       ├── user_routes.py      # 4 rotas
│       ├── search.py           # 2 rotas
│       ├── map.py              # 2 rotas
│       └── admin.py            # 15 rotas
│
├── docs/
│   ├── bd.json                 # Schema real do banco
│   ├── database-schema.md      # Documentação do schema
│   ├── api-specification.md    # Especificação da API
│   ├── API_USAGE_GUIDE.md      # Guia de uso com exemplos
│   ├── ADMIN_ROUTES_ADDED.md   # Docs das rotas admin
│   ├── ROUTES_REPORT.md        # Relatório completo
│   └── IMPLEMENTATION_GUIDE.md # Este arquivo
│
├── migrations/                 # Alembic migrations
│   └── versions/
│
├── kubernetes/                 # K8s configs
│   ├── backend-core/
│   └── redis/
│
└── Docker-compose.yml
```

---

## 5. Modelos (SQLAlchemy)

### 🏗️ Como Criar um Modelo

**Arquivo:** `app/models/user.py`

```python
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.database.connection import Base


class UserAdmin(Base):
    __tablename__ = "users"

    # Sempre use UUID para IDs
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Campos básicos
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    
    # Campos opcionais
    avatar_url = Column(String(500))
    phone = Column(String(20))
    bio = Column(Text)
    country = Column(String(100))
    
    # OAuth
    email_verified_at = Column(DateTime, nullable=True)
    google_id = Column(String(255), unique=True, nullable=True, index=True)
    apple_id = Column(String(255), unique=True, nullable=True)
    
    # Role-based access
    role = Column(String(50), default="viewer")  # viewer, editor, admin
    is_active = Column(Boolean, default=True)
    
    # Timestamps padrão
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)  # Soft delete
```

### 📐 Tipos de Dados Importantes

| PostgreSQL | SQLAlchemy |
|------------|------------|
| `uuid` | `UUID(as_uuid=True)` |
| `character varying` | `String(length)` |
| `text` | `Text` |
| `integer` | `Integer` |
| `boolean` | `Boolean` |
| `timestamp` | `DateTime` |
| `double precision` | `Float` |
| `jsonb` | `JSONB` (import from postgresql) |
| `date` | `Date` |

### 🔗 Relacionamentos

**Exemplo:** Destination ↔ Images

```python
# Em destination.py
class Destination(Base):
    __tablename__ = "destinations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # ... outros campos
    
    # Relationships
    images = relationship(
        "DestinationImage", 
        back_populates="destination", 
        cascade="all, delete-orphan"  # Delete images se destination deletado
    )

# Em destination.py (mesma arquivo ou separado)
class DestinationImage(Base):
    __tablename__ = "destination_images"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("destinations.id", ondelete="CASCADE"), 
        nullable=False
    )
    
    # Relationship reverso
    destination = relationship("Destination", back_populates="images")
```

### ⚠️ Campos Críticos por Modelo

#### **Destination**
```python
# Coordenadas - IMPORTANTE: Float, não Numeric
latitude = Column(Float, nullable=False, index=True)
longitude = Column(Float, nullable=False, index=True)

# JSONB fields
amenities = Column(JSONB)  # ["parking", "wifi"]
accessibility = Column(JSONB)  # ["wheelchair"]

# Stats
rating = Column(Float, default=0.0)
rating_avg = Column(Float, default=0.0)
review_count = Column(Integer, default=0)
```

#### **Review**
```python
# Constraint de rating
rating = Column(Integer, nullable=False)

__table_args__ = (
    CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    UniqueConstraint('user_id', 'destination_id', name='unique_user_destination'),
)
```

#### **Trip**
```python
# Enum para status
from enum import Enum as PyEnum

class TripStatus(str, PyEnum):
    upcoming = "upcoming"
    ongoing = "ongoing"
    completed = "completed"
    cancelled = "cancelled"

status = Column(String(50), default=TripStatus.upcoming.value)
```

---

## 6. Schemas (Pydantic)

### 📝 Tipos de Schemas

1. **Create** - Para criação (POST)
2. **Update** - Para atualização (PUT/PATCH)
3. **Public/Response** - Para retorno da API
4. **List** - Para listagens com paginação

### Exemplo Completo

**Arquivo:** `app/schemas/destination_schema.py`

```python
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
import uuid


# Schema para coordenadas
class CoordinateSchema(BaseModel):
    latitude: float
    longitude: float


# Schema para criação
class DestinationCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    location: str
    province: str
    category_id: uuid.UUID
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    opening_hours: Optional[str] = None
    ticket_price: Optional[str] = None


# Schema para retorno em listas
class DestinationListItem(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    location: str
    province: str
    category: str
    rating: float
    review_count: int
    image_url: Optional[str]
    coordinate: CoordinateSchema
    is_favorite: bool = False
    distance: Optional[float] = None  # Em km, se calculado
    
    model_config = ConfigDict(from_attributes=True)


# Schema para detalhes completos
class DestinationDetail(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    description: str
    long_description: Optional[str]
    location: str
    province: str
    address: Optional[str]
    category: str
    rating: float
    review_count: int
    images: List[dict]  # Lista de imagens
    coordinate: CoordinateSchema
    opening_hours: Optional[str]
    ticket_price: Optional[str]
    amenities: Optional[List[str]]
    accessibility: Optional[List[str]]
    is_favorite: bool = False
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Response wrapper para listas
class DestinationListResponse(BaseModel):
    success: bool = True
    data: List[DestinationListItem]
    meta: dict  # Paginação


# Response wrapper para item único
class DestinationResponse(BaseModel):
    success: bool = True
    data: DestinationDetail
```

### 🎯 Validações Importantes

```python
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr  # Valida formato de email
    password: str = Field(..., min_length=8)
    confirm_password: str
    
    @field_validator('confirm_password')
    def passwords_match(cls, v, info):
        if 'password' in info.data and v != info.data['password']:
            raise ValueError('Passwords do not match')
        return v
```

---

## 7. Rotas da API

### 🛣️ Estrutura de Uma Rota

**Arquivo:** `app/routes/destinations.py`

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database.connection import get_db
from app.core.dependencies import get_current_user_optional
from app.models.destination import Destination
from app.schemas.destination_schema import DestinationListResponse

router = APIRouter(prefix="/destinations", tags=["Destinations"])


@router.get("", response_model=DestinationListResponse)
def get_destinations(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """
    Listar destinos com filtros e paginação.
    
    Query Parameters:
    - page: Número da página (default: 1)
    - per_page: Items por página (default: 20, max: 100)
    - category: Filtrar por slug da categoria
    - search: Busca em nome/descrição/localização
    - min_rating: Rating mínimo (0-5)
    """
    # Query base
    query = db.query(Destination).filter(
        Destination.is_active == True,
        Destination.deleted_at == None
    )
    
    # Aplicar filtros
    if category:
        query = query.filter(Destination.category == category)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Destination.name.ilike(search_term) |
            Destination.description.ilike(search_term)
        )
    
    if min_rating is not None:
        query = query.filter(Destination.rating >= min_rating)
    
    # Paginação
    total = query.count()
    offset = (page - 1) * per_page
    destinations = query.offset(offset).limit(per_page).all()
    
    # Calcular total de páginas
    total_pages = (total + per_page - 1) // per_page
    
    # Montar resposta
    return {
        "success": True,
        "data": destinations,
        "meta": {
            "current_page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }
```

### 📊 Todas as Rotas (50 total)

#### **1. Auth (4 rotas)**
```
POST   /auth/register       - Criar conta
POST   /auth/login          - Login
POST   /auth/logout         - Logout
POST   /auth/google         - OAuth Google
```

#### **2. Categories (1 rota)**
```
GET    /categories          - Listar categorias
```

#### **3. Destinations (5 rotas)**
```
GET    /destinations                    - Listar com filtros
GET    /destinations/featured           - Em destaque
GET    /destinations/recommended        - Recomendações
GET    /destinations/{id}               - Detalhes
GET    /destinations/{id}/reviews       - Reviews do destino
```

#### **4. Reviews (4 rotas)**
```
POST   /reviews             - Criar review
PATCH  /reviews/{id}        - Editar review
DELETE /reviews/{id}        - Deletar review
POST   /reviews/{id}/helpful - Marcar como útil
```

#### **5. Favorites (3 rotas)**
```
GET    /favorites           - Listar favoritos
POST   /favorites           - Adicionar favorito
DELETE /favorites/{dest_id} - Remover favorito
```

#### **6. Trips (8 rotas)**
```
GET    /trips                           - Listar viagens
POST   /trips                           - Criar viagem
GET    /trips/{id}                      - Detalhes
PUT    /trips/{id}                      - Atualizar
DELETE /trips/{id}                      - Deletar
POST   /trips/{id}/destinations         - Adicionar destino
DELETE /trips/{id}/destinations/{dest}  - Remover destino
PATCH  /trips/{id}/status               - Atualizar status
```

#### **7. User Profile (4 rotas)**
```
GET    /user/profile        - Ver perfil + stats
PUT    /user/profile        - Atualizar perfil
PUT    /user/preferences    - Atualizar preferências
DELETE /user/account        - Deletar conta
```

#### **8. Search (2 rotas)**
```
GET    /search              - Busca global
GET    /search/suggestions  - Autocomplete
```

#### **9. Map (2 rotas)**
```
GET    /map/destinations    - Destinos em bounds
GET    /map/nearby          - Destinos próximos
```

#### **10. Admin (15 rotas)**
```
# Dashboard
GET    /admin/stats/overview
GET    /admin/destinations/{id}/stats

# Destinos
GET    /admin/destinations
POST   /admin/destinations
PUT    /admin/destinations/{id}
DELETE /admin/destinations/{id}
POST   /admin/destinations/{id}/images
DELETE /admin/destinations/{id}/images/{img_id}

# Categorias
POST   /admin/categories
PUT    /admin/categories/{id}
DELETE /admin/categories/{id}

# Usuários
GET    /admin/users
PATCH  /admin/users/{id}

# Moderação
GET    /admin/reviews/pending
PATCH  /admin/reviews/{id}/moderate
```

---

## 8. Autenticação e Segurança

### 🔐 JWT Authentication

**Arquivo:** `app/core/security.py`

```python
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password com bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar senha"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """Criar JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode, 
        settings.JWT_SECRET_KEY, 
        algorithm=settings.JWT_ALGORITHM
    )

def decode_access_token(token: str) -> dict:
    """Decodificar JWT token"""
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except:
        return None
```

### 🛡️ Middleware de Autenticação

**Arquivo:** `app/core/dependencies.py`

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import UserAdmin
from app.core.security import decode_access_token
from typing import Optional

# auto_error=False permite rotas opcionais
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login", 
    auto_error=False
)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> UserAdmin:
    """Obter usuário autenticado"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = payload.get("sub")
    user = db.query(UserAdmin).filter(UserAdmin.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user

def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[UserAdmin]:
    """Usuário opcional (para rotas públicas)"""
    if not token:
        return None
    
    try:
        return get_current_user(token, db)
    except:
        return None
```

### 👑 Role-Based Access Control

```python
def require_admin(
    current_user: UserAdmin = Depends(get_current_user)
):
    """Apenas admin ou editor"""
    if current_user.role not in ["admin", "editor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or Editor access required"
        )
    return current_user

# Uso em rotas
@router.post("/admin/destinations")
def create_destination(
    data: DestinationCreate,
    db: Session = Depends(get_db),
    current_user: UserAdmin = Depends(require_admin)
):
    # Apenas admins chegam aqui
    pass
```

---

## 9. Funcionalidades Principais

### 🌍 Geolocalização e Distâncias

**Cálculo de Distância (Haversine)**

```python
import math

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calcular distância entre duas coordenadas em km.
    Fórmula de Haversine.
    """
    R = 6371  # Raio da Terra em km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat/2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * 
         math.sin(delta_lon/2) ** 2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c  # Distância em km

# Uso
@router.get("/map/nearby")
def get_nearby_destinations(
    latitude: float,
    longitude: float,
    radius: int = 50,  # km
    db: Session = Depends(get_db)
):
    destinations = db.query(Destination).filter(
        Destination.is_active == True
    ).all()
    
    # Filtrar por distância
    nearby = []
    for dest in destinations:
        distance = calculate_distance(
            latitude, longitude,
            float(dest.latitude), float(dest.longitude)
        )
        if distance <= radius:
            dest.distance = round(distance, 1)
            nearby.append(dest)
    
    # Ordenar por distância
    nearby.sort(key=lambda x: x.distance)
    
    return {"success": True, "data": nearby}
```

### 📄 Paginação Padrão

```python
def paginate_query(query, page: int, per_page: int):
    """Helper para paginação"""
    total = query.count()
    offset = (page - 1) * per_page
    items = query.offset(offset).limit(per_page).all()
    
    total_pages = (total + per_page - 1) // per_page
    
    return {
        "items": items,
        "meta": {
            "current_page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }

# Uso
@router.get("/destinations")
def list_destinations(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Destination).filter(Destination.is_active == True)
    result = paginate_query(query, page, per_page)
    
    return {
        "success": True,
        "data": result["items"],
        "meta": result["meta"]
    }
```

### 🔍 Busca Full-Text

```python
@router.get("/search")
def global_search(
    q: str = Query(..., min_length=2),
    db: Session = Depends(get_db)
):
    """Busca em destinos e localizações"""
    search_term = f"%{q}%"
    
    # Buscar destinos
    destinations = db.query(Destination).filter(
        (Destination.name.ilike(search_term)) |
        (Destination.description.ilike(search_term)) |
        (Destination.location.ilike(search_term))
    ).limit(10).all()
    
    # Buscar localizações únicas
    locations = db.query(
        Destination.location,
        Destination.province
    ).filter(
        (Destination.location.ilike(search_term)) |
        (Destination.province.ilike(search_term))
    ).distinct().limit(5).all()
    
    return {
        "success": True,
        "data": {
            "destinations": destinations,
            "locations": [
                {"name": loc[0], "province": loc[1]} 
                for loc in locations
            ]
        }
    }
```

### ⭐ Sistema de Favoritos

```python
@router.post("/favorites")
def add_favorite(
    destination_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserAdmin = Depends(get_current_user)
):
    """Adicionar aos favoritos"""
    # Verificar se destino existe
    destination = db.query(Destination).filter(
        Destination.id == destination_id
    ).first()
    
    if not destination:
        raise HTTPException(404, "Destination not found")
    
    # Verificar se já é favorito
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.destination_id == destination_id
    ).first()
    
    if existing:
        raise HTTPException(409, "Already in favorites")
    
    # Criar favorito
    favorite = Favorite(
        user_id=current_user.id,
        destination_id=destination_id
    )
    db.add(favorite)
    db.commit()
    
    return {
        "success": True,
        "message": "Added to favorites"
    }
```

### 🗺️ Sistema de Viagens

```python
@router.post("/trips")
def create_trip(
    name: str,
    start_date: date,
    end_date: date,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: UserAdmin = Depends(get_current_user)
):
    """Criar nova viagem"""
    # Validar datas
    if end_date < start_date:
        raise HTTPException(400, "End date must be after start date")
    
    # Determinar status automaticamente
    today = date.today()
    if start_date > today:
        status = "upcoming"
    elif start_date <= today <= end_date:
        status = "ongoing"
    else:
        status = "completed"
    
    trip = Trip(
        user_id=current_user.id,
        name=name,
        start_date=start_date,
        end_date=end_date,
        notes=notes,
        status=status
    )
    
    db.add(trip)
    db.commit()
    db.refresh(trip)
    
    return {
        "success": True,
        "data": trip
    }

@router.post("/trips/{trip_id}/destinations")
def add_destination_to_trip(
    trip_id: uuid.UUID,
    destination_id: uuid.UUID,
    visit_date: Optional[date] = None,
    notes: Optional[str] = None,
    display_order: int = 0,
    db: Session = Depends(get_db),
    current_user: UserAdmin = Depends(get_current_user)
):
    """Adicionar destino à viagem"""
    # Verificar se trip pertence ao usuário
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id
    ).first()
    
    if not trip:
        raise HTTPException(404, "Trip not found")
    
    # Criar associação
    trip_dest = TripDestination(
        trip_id=trip_id,
        destination_id=destination_id,
        visit_date=visit_date,
        notes=notes,
        display_order=display_order
    )
    
    db.add(trip_dest)
    db.commit()
    
    return {
        "success": True,
        "message": "Destination added to trip"
    }
```

---

## 10. Configuração e Deploy

### ⚙️ Variáveis de Ambiente

**Arquivo:** `.env`

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET_KEY=seu_secret_key_aqui_minimo_32_caracteres
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 horas

# CORS (URLs permitidas)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://wenda.ao

# Redis (opcional)
REDIS_URL=redis://localhost:6379/0

# Upload (S3/Cloudinary)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=

# Email (opcional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
```

### 📦 Dependências

**Arquivo:** `requirements.txt`

```txt
# Core
fastapi==0.120.0
uvicorn[standard]==0.34.0
python-dotenv==1.0.1

# Database
sqlalchemy==2.0.44
psycopg2-binary==2.9.10
alembic==1.14.0

# Authentication
python-jose[cryptography]==3.5.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20

# Validation
pydantic==2.12.3
pydantic-settings==2.7.0
email-validator==2.2.0

# Utils
requests==2.32.3
```

### 🚀 Inicialização

**Arquivo:** `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Importar todos os routers
from app.routes import (
    auth, categories, destinations, reviews,
    favorites, trips, user_routes, search,
    map, admin
)

# Criar app
app = FastAPI(
    title="Wenda API - Tourism Platform",
    description="API para plataforma de turismo em Angola",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://wenda.ao",
        "https://admin.wenda.ao"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(destinations.router)
app.include_router(reviews.router)
app.include_router(favorites.router)
app.include_router(trips.router)
app.include_router(user_routes.router)
app.include_router(search.router)
app.include_router(map.router)
app.include_router(admin.router)

# Health check
@app.get("/")
def root():
    return {"message": "Wenda API is running"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "wenda-api",
        "version": "1.0.0"
    }
```

### 🐳 Docker

**Arquivo:** `Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Expose port
EXPOSE 8000

# Run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Arquivo:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      - db
    volumes:
      - ./app:/app/app

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: wenda
      POSTGRES_PASSWORD: wenda123
      POSTGRES_DB: wenda_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### ▶️ Executar

```bash
# Desenvolvimento
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Produção
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Docker
docker-compose up -d
```

---

## 11. Testes

### 🧪 Estrutura de Testes

```python
# test_auth.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register_user():
    response = client.post("/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "confirm_password": "password123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["success"] == True
    assert "access_token" in data["data"]

def test_login():
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data["data"]

def test_get_profile():
    # Login primeiro
    login_response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    token = login_response.json()["data"]["access_token"]
    
    # Obter perfil
    response = client.get(
        "/user/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
```

### 📊 Validação Completa

**Arquivo:** `test_implementation.py` (já criado)

```bash
python3 test_implementation.py
```

---

## 12. Melhorias Futuras

### 🎯 TODOs Críticos

1. **Upload de Imagens Real**
   - Integrar S3/Cloudinary
   - Gerar thumbnails automaticamente
   - Validação de formato/tamanho

2. **Google OAuth Completo**
   - Implementar fluxo OAuth real
   - Verificar token do Google
   - Criar/atualizar usuário

3. **Refresh Tokens**
   - JWT refresh token
   - Blacklist de tokens revogados

4. **Notificações**
   - Email notifications
   - Push notifications (Firebase)

5. **Cache com Redis**
   - Cache de destinos populares
   - Cache de buscas frequentes
   - Session storage

6. **Rate Limiting**
   - Limitar requests por IP
   - Prevenir abuse

### 🚀 Features Avançadas

1. **Machine Learning**
   - Recomendações personalizadas (já tem tabelas)
   - Previsão de visitantes
   - Análise de sentimento em reviews

2. **Analytics**
   - Track de visualizações
   - Métricas de engagement
   - Dashboard de analytics

3. **Internacionalização**
   - Suporte multi-idioma
   - Traduções automáticas

4. **Social Features**
   - Seguir outros usuários
   - Feed de atividades
   - Compartilhamento social

5. **Gamificação**
   - Sistema de badges
   - Pontos por ações
   - Leaderboard

---

## 📚 Recursos Úteis

### Documentação

- **FastAPI:** https://fastapi.tiangolo.com/
- **SQLAlchemy:** https://docs.sqlalchemy.org/
- **Pydantic:** https://docs.pydantic.dev/
- **PostgreSQL:** https://www.postgresql.org/docs/

### Ferramentas

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Postman:** Para testar APIs
- **pgAdmin:** Para gerenciar PostgreSQL

### Comandos Úteis

```bash
# Criar migration
alembic revision --autogenerate -m "description"

# Aplicar migrations
alembic upgrade head

# Rollback
alembic downgrade -1

# Ver logs
tail -f logs/app.log

# Verificar erros
python -m pylint app/

# Formatar código
black app/
```

---

## ✅ Checklist de Implementação

### Fase 1: Setup Básico
- [ ] Criar projeto FastAPI
- [ ] Configurar PostgreSQL
- [ ] Setup .env com credenciais
- [ ] Criar estrutura de pastas
- [ ] Configurar CORS

### Fase 2: Database
- [ ] Criar todos os 11 modelos SQLAlchemy
- [ ] Verificar campos com bd.json
- [ ] Configurar relationships
- [ ] Testar conexão com DB

### Fase 3: Authentication
- [ ] Implementar hash de senha
- [ ] Criar JWT token system
- [ ] Middleware de autenticação
- [ ] Rotas de auth (register, login)

### Fase 4: Schemas
- [ ] Criar Pydantic schemas
- [ ] Validações customizadas
- [ ] Response wrappers

### Fase 5: Rotas Principais (Mobile)
- [ ] Destinations (5 rotas)
- [ ] Categories (1 rota)
- [ ] Reviews (4 rotas)
- [ ] Favorites (3 rotas)
- [ ] Trips (8 rotas)
- [ ] User Profile (4 rotas)
- [ ] Search (2 rotas)
- [ ] Map (2 rotas)

### Fase 6: Admin
- [ ] Dashboard stats
- [ ] CRUD Destinations
- [ ] CRUD Categories
- [ ] User management
- [ ] Review moderation

### Fase 7: Features Avançadas
- [ ] Geolocalização
- [ ] Paginação
- [ ] Soft delete
- [ ] Upload de imagens

### Fase 8: Testing & Deploy
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Documentação API
- [ ] Deploy (Docker/K8s)

---

## 🎓 Conclusão

Este guia cobre TUDO que você precisa saber para implementar o backend Wenda do zero:

✅ **Arquitetura** - Como estruturar o projeto  
✅ **Database** - Todos os 17 modelos e relacionamentos  
✅ **API** - 50 rotas documentadas  
✅ **Auth** - JWT e RBAC completo  
✅ **Features** - Geolocalização, busca, favoritos, trips  
✅ **Deploy** - Docker, configs, variáveis  

### 🚀 Próximos Passos

1. **Clone este repositório** ou crie do zero seguindo a estrutura
2. **Configure o ambiente** (.env, PostgreSQL)
3. **Implemente módulo por módulo** (auth → models → routes)
4. **Teste cada feature** conforme implementa
5. **Deploy** quando tudo estiver funcionando

### 📞 Suporte

- **Documentação Interativa:** http://localhost:8000/docs
- **Especificação:** `docs/api-specification.md`
- **Schema DB:** `docs/bd.json`
- **Exemplos de Uso:** `docs/API_USAGE_GUIDE.md`

---

**Desenvolvido com ❤️ para Wenda - Turismo em Angola**

*Última atualização: 12 de Novembro de 2025*
