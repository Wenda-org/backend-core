# 🐳 Docker - Guia Rápido

## Build da imagem

```bash
docker build -t wenda-backend .
```

## Rodar o container

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

## Verificar se está funcionando

```bash
curl http://localhost:3000/api/health
```

## Parar o container

```bash
docker stop $(docker ps -q --filter ancestor=wenda-backend)
```

## Ver logs

```bash
docker logs -f $(docker ps -q --filter ancestor=wenda-backend)
```

## Variáveis de ambiente necessárias

- `DATABASE_URL` - Connection string do Neon DB
- `JWT_SECRET` - Secret para tokens JWT
- `JWT_EXPIRES_IN` - Tempo de expiração (default: 7d)
- `NODE_ENV` - production
- `PORT` - Porta (default: 3000)
- `API_PREFIX` - Prefixo da API (default: api)
