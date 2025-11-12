# ⚡ Quick Start Guide

## 🎯 Get the Backend Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```
*This will install all NestJS, Fastify, Prisma, and other dependencies.*

---

### Step 2: Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your database URL
nano .env  # or use your preferred editor
```

**Minimum required variables:**
```env
DATABASE_URL="postgresql://user:password@host:5432/wenda_db"
JWT_SECRET="your-secret-key-change-this-in-production"
```

**Quick NeonDB setup** (recommended):
1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string
5. Paste into `.env`

---

### Step 3: Setup Database
```bash
# Generate Prisma Client (creates types from schema)
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed categories (optional but recommended)
npm run prisma:seed
```

---

### Step 4: Start Development Server
```bash
npm run start:dev
```

You should see:
```
🚀 Application is running!

📝 API Docs: http://localhost:3000/api/docs
🔌 API URL: http://localhost:3000/v1
🌍 Environment: development

✨ Ready to serve requests!
```

---

### Step 5: Test the API

**Open Swagger UI:**
```
http://localhost:3000/api/docs
```

**Test health endpoint:**
```bash
curl http://localhost:3000/v1/health
```

**Register a user:**
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

Copy the `accessToken` from the response!

**Get your profile (protected route):**
```bash
curl http://localhost:3000/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎨 Explore the Code

### Key Files to Check Out:

1. **`src/main.ts`** - Application entry point with Fastify setup
2. **`src/app.module.ts`** - Root module importing all features
3. **`prisma/schema.prisma`** - Database schema (12 models)
4. **`src/modules/auth/`** - Complete JWT authentication example
5. **`src/modules/categories/`** - Complete CRUD example
6. **`src/modules/users/`** - User profile management

---

## 📦 Available Commands

```bash
# Development
npm run start:dev          # Start with hot-reload ⚡
npm run start:debug        # Start in debug mode 🐛

# Database
npm run prisma:studio      # Open visual database editor 🖼️
npm run prisma:migrate     # Run migrations 🔄
npm run prisma:generate    # Regenerate Prisma Client 🔧

# Production
npm run build              # Build for production 📦
npm run start:prod         # Run production build 🚀

# Code Quality
npm run lint               # Lint code ✅
npm run format             # Format code with Prettier 💅
```

---

## 🔥 Common Issues & Solutions

### Issue: "Cannot find module '@nestjs/common'"
**Solution:** Run `npm install`

### Issue: "Prisma Client not found"
**Solution:** Run `npm run prisma:generate`

### Issue: "Database connection error"
**Solution:** Check your `DATABASE_URL` in `.env`

### Issue: Port 3000 already in use
**Solution:** Change `PORT=3001` in `.env` or kill the process using port 3000

---

## 🎯 Next Steps

1. ✅ **Read the README.md** - Full documentation
2. ✅ **Check REBUILD_SUMMARY.md** - What was built
3. ✅ **Explore `/docs` folder** - Original API specifications
4. ✅ **Implement remaining modules** - Destinations, Reviews, Trips, Favorites

---

## 🚀 Ready to Build!

Your backend is now running with:
- ✅ NestJS framework
- ✅ Fastify HTTP server
- ✅ Prisma ORM
- ✅ JWT authentication
- ✅ Swagger documentation
- ✅ Complete database schema
- ✅ Example CRUD module

**Happy coding!** 🎉
