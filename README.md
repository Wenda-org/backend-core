# 🌍 Wenda Backend API# backend-core

> **Complete REST API for Wenda Tourism Platform** - Discover Angola's beautiful destinations

Built with **NestJS**, **Fastify**, **Prisma**, and **PostgreSQL/NeonDB**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [API Documentation](#-api-documentation)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Module Overview](#-module-overview)

---

## ✨ Features

### For Users (Mobile App)
- 🔐 **Authentication** - JWT-based auth with Google OAuth support
- 🏝️ **Destinations** - Browse tourist destinations with advanced filters
- ⭐ **Reviews & Ratings** - Rate and review destinations
- ❤️ **Favorites** - Save favorite destinations
- 🗺️ **Trip Planning** - Create and manage trip itineraries
- 🔍 **Search** - Global search with filters (location, category, rating)
- 📍 **Geolocation** - Distance-based sorting and nearby destinations

### For Admins (Web Dashboard)
- 📊 **Dashboard** - Statistics and analytics
- ✏️ **Content Management** - CRUD operations for destinations and categories
- 🖼️ **Media Management** - Upload and manage destination images
- 👥 **User Management** - View and manage user accounts
- 🛡️ **Moderation** - Review and approve user-generated content

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Progressive Node.js framework |
| **Fastify** | High-performance HTTP server |
| **Prisma** | Type-safe ORM for PostgreSQL |
| **PostgreSQL** | Relational database (NeonDB recommended) |
| **TypeScript** | Type-safe JavaScript |
| **JWT** | Stateless authentication |
| **class-validator** | DTO validation |
| **Swagger/OpenAPI** | API documentation |
| **Helmet** | Security headers |

---

## 📁 Project Structure

```
backend-core/
├── prisma/
│   ├── schema.prisma          # Database schema (12 models)
│   └── seed.ts                # Database seeding
├── src/
│   ├── common/                # Shared utilities
│   │   ├── decorators/        # Custom decorators (@CurrentUser, etc.)
│   │   ├── dto/               # Base DTOs (Pagination, etc.)
│   │   ├── interfaces/        # TypeScript interfaces
│   │   └── utils/             # Helper functions
│   ├── modules/
│   │   ├── auth/              # Authentication (JWT, OAuth)
│   │   ├── users/             # User profile management
│   │   ├── categories/        # Destination categories CRUD
│   │   ├── destinations/      # Main destinations feature
│   │   ├── reviews/           # Reviews and ratings
│   │   ├── favorites/         # User favorites
│   │   ├── trips/             # Trip planning
│   │   └── health/            # Health check endpoint
│   ├── prisma/                # Prisma service
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts          # Root application module
│   └── main.ts                # Application entry point
├── docs/                      # Technical documentation
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **PostgreSQL** database (local or cloud like NeonDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-core
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration (see [Environment Variables](#-environment-variables))

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database** (optional - adds categories)
   ```bash
   npm run prisma:seed
   ```

7. **Start development server**
   ```bash
   npm run start:dev
   ```

8. **Open API documentation**
   ```
   http://localhost:3000/api/docs
   ```

---

## 💾 Database Setup

### Option 1: NeonDB (Recommended - Cloud PostgreSQL)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string
4. Add to `.env`:
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
   ```

### Option 2: Local PostgreSQL

1. Install PostgreSQL
2. Create database:
   ```bash
   createdb wenda_db
   ```
3. Update `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/wenda_db"
   ```

### Database Schema

The schema includes **12 tables**:
- `users` - User accounts
- `user_preferences` - User settings
- `password_resets` - Password reset tokens
- `categories` - Destination categories
- `destinations` - Tourist destinations
- `destination_images` - Destination photos
- `reviews` - User reviews
- `review_images` - Review photos
- `review_helpful` - Helpful marks on reviews
- `favorites` - User favorites
- `trips` - Planned trips
- `trip_destinations` - Trip itinerary items

---

## 📚 API Documentation

### Swagger UI

Once running, visit:
```
http://localhost:3000/api/docs
```

### Main Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| **Health** | `GET /v1/health` | Health check |
| **Auth** | `POST /v1/auth/register` | Register new user |
| | `POST /v1/auth/login` | Login user |
| | `POST /v1/auth/logout` | Logout user |
| **Users** | `GET /v1/users/me` | Get current user profile |
| | `PUT /v1/users/me` | Update profile |
| **Categories** | `GET /v1/categories` | List all categories |
| | `GET /v1/categories/:id` | Get single category |
| | `POST /v1/categories` | Create category (Admin) |
| **Destinations** | `GET /v1/destinations` | List destinations (with filters) |
| | `GET /v1/destinations/:id` | Get destination details |
| | `POST /v1/destinations` | Create destination (Admin) |
| **Reviews** | `GET /v1/destinations/:id/reviews` | Get destination reviews |
| | `POST /v1/reviews` | Create review |
| **Favorites** | `GET /v1/favorites` | Get user favorites |
| | `POST /v1/favorites` | Add to favorites |
| **Trips** | `GET /v1/trips` | Get user trips |
| | `POST /v1/trips` | Create new trip |

---

## 📜 Available Scripts

```bash
# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build for production
npm run start:prod         # Run production build

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio (DB GUI)
npm run prisma:seed        # Seed database

# Code Quality
npm run lint               # Lint code
npm run format             # Format code with Prettier
npm test                   # Run tests
npm run test:cov           # Test coverage
```

---

## 🔐 Environment Variables

Create `.env` file from `.env.example`:

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/wenda_db"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"

# Application
NODE_ENV="development"
PORT=3000
API_PREFIX="v1"
CORS_ORIGIN="http://localhost:3000,http://localhost:19006"
```

### Optional Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS S3 (for image uploads)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""
AWS_REGION="us-east-1"

# Email (for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

---

## 🎯 Module Overview

### **Auth Module**
- JWT-based authentication
- Register, login, logout
- Password hashing with bcrypt
- JWT strategy with Passport
- Protected route guard

### **Categories Module** (Complete CRUD Example)
- List all categories
- Get category by ID/slug
- Create/update/delete (Admin)
- Includes destination count

### **Users Module**
- User profile management
- Update preferences
- Avatar upload (future)

### **Health Module**
- Simple health check
- Database connection status
- Uptime and environment info

### **Common Utilities**
- `@CurrentUser()` decorator - Extract user from request
- `PaginationDto` - Reusable pagination DTO
- `PaginationUtil` - Calculate pagination metadata
- Request/response interfaces

---

## 🎨 Code Examples

### Protected Route

```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
async getProfile(@CurrentUser() user: RequestUser) {
  return await this.usersService.getProfile(user.id);
}
```

### Pagination

```typescript
@Get()
async findAll(@Query() query: PaginationDto) {
  const { page, perPage } = query;
  const { skip, take } = PaginationUtil.getPaginationParams(page, perPage);
  
  const [data, total] = await Promise.all([
    this.prisma.destination.findMany({ skip, take }),
    this.prisma.destination.count(),
  ]);
  
  return {
    success: true,
    data,
    meta: PaginationUtil.getPaginationMeta(total, page, perPage),
  };
}
```

---

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📦 Deployment

### Docker (Coming Soon)

```bash
docker build -t wenda-backend .
docker run -p 3000:3000 wenda-backend
```

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables on server

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Start application:
   ```bash
   npm run start:prod
   ```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

---

## 📝 License

MIT License - see LICENSE file

---

## 🌟 Next Steps

Based on the documentation in `/docs`, you can expand:

1. **Destinations Module** - Complete CRUD with:
   - Advanced filtering (category, province, rating)
   - Geolocation-based search
   - Featured destinations
   - Recommended destinations
   - Image management

2. **Reviews Module** - Full review system with:
   - Create/update/delete reviews
   - Mark reviews as helpful
   - Image uploads
   - Pagination and sorting

3. **Favorites Module** - User favorites with:
   - Add/remove favorites
   - List user favorites

4. **Trips Module** - Trip planning with:
   - Create trips
   - Add destinations to itinerary
   - Manage trip status

5. **Admin Dashboard** - Web interface for:
   - Content moderation
   - User management
   - Analytics

---

**Built with ❤️ by the Wenda Team**

For questions or support, please refer to the `/docs` folder for detailed API specifications and implementation guides.
