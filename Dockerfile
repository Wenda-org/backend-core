# Usar Node.js LTS
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start:prod"]
