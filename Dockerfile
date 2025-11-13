# Stage 1: Build
FROM node:20-alpine AS builder

# Instalar dependências do sistema necessárias para Prisma
RUN apk add --no-cache openssl libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte e prisma schema
COPY prisma ./prisma
COPY src ./src

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Instalar openssl para Prisma
RUN apk add --no-cache openssl

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar build e node_modules do stage anterior
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Mudar para usuário não-root
USER nodejs

# Expor porta (Render usa variável PORT)
EXPOSE 3000

# Comando para iniciar
CMD ["node", "dist/main.js"]
