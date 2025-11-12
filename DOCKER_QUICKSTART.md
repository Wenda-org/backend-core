# 🐳 Docker - Guia Rápido

## Build da imagem

```bash
docker build -t wenda-backend .
```

## Rodar o container localmente

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="sua-connection-string" \
  -e JWT_SECRET="seu-jwt-secret" \
  -e NODE_ENV="production" \
  wenda-backend
```

## Ou usando arquivo .env

```bash
docker run -p 3000:3000 --env-file .env wenda-backend
```

## Deploy no Render

O Dockerfile está otimizado para Render com:
- ✅ Multi-stage build (imagem menor)
- ✅ Usuário não-root (segurança)
- ✅ Suporte a variável `PORT` do Render
- ✅ Health check configurado
- ✅ Dependências do Prisma (openssl)

### Variáveis de ambiente no Render:

Adicione estas variáveis no dashboard do Render:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=seu-secret-super-seguro-aqui
JWT_EXPIRES_IN=7d
NODE_ENV=production
API_PREFIX=api
```

### Comando de start no Render:

O Render detecta automaticamente o Dockerfile. Não precisa configurar nada extra.

## Verificar se está funcionando

```bash
curl http://localhost:3000/api/health
```

## Ver logs

```bash
docker logs -f $(docker ps -q --filter ancestor=wenda-backend)
```

## Comandos úteis

```bash
# Parar todos os containers
docker stop $(docker ps -q --filter ancestor=wenda-backend)

# Remover container
docker rm $(docker ps -aq --filter ancestor=wenda-backend)

# Remover imagem
docker rmi wenda-backend

# Build sem cache
docker build --no-cache -t wenda-backend .
```

## Troubleshooting

### Erro de conexão com BD
- Verifique se a `DATABASE_URL` está correta
- Certifique-se de incluir `?sslmode=require` para Neon DB

### Erro no Prisma
- O Dockerfile já instala openssl necessário para Prisma no Alpine

### Porta não disponível
- O Render define automaticamente a variável `PORT`
- Localmente use `-p 3000:3000` ou a porta que preferir
