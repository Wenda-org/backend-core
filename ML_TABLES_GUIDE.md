# 🤖 Tabelas ML - Implementação Completa

## ✅ Status da Implementação

**TODAS as tabelas ML foram criadas com sucesso!**

### Tabelas Criadas:

1. ✅ **tourism_statistics** - 216 registros
   - Estatísticas de turismo por província/mês/ano
   - Províncias: Luanda, Benguela, Huíla, Namibe, Malanje, Huambo
   - Dados de 2023-2025

2. ✅ **ml_models_registry** - 3 modelos
   - `visitor_forecast` v1.0.0 (ARIMA)
   - `destination_recommender` v1.0.0 (Collaborative Filtering)
   - `sentiment_analyzer` v1.0.0 (BERT)

3. ✅ **ml_predictions** - 72 previsões
   - Previsões de visitantes para 2026
   - Por província e mês

4. ✅ **recommendations_log** - 0 registros inicialmente
   - Será populado quando houver usuários e destinos
   - Relacionamentos com User e Destination configurados

### Relacionamentos Adicionados:

- ✅ `User.recommendations` → `RecommendationsLog[]`
- ✅ `Destination.recommendations` → `RecommendationsLog[]`

---

## 📊 Estrutura das Tabelas

### 1. TourismStatistics

Armazena dados históricos de turismo.

```typescript
{
  id: number;
  province: string;        // Nome da província
  month: number;           // 1-12
  year: number;            // Ano
  domesticVisitors: number | null;
  foreignVisitors: number | null;
  occupancyRate: number | null;    // Taxa de ocupação (0-1)
  avgStayDays: number | null;       // Média de dias de estadia
  createdAt: Date;
}
```

**Exemplo de Query:**
```typescript
// Buscar estatísticas de Luanda em 2024
const stats = await prisma.tourismStatistics.findMany({
  where: {
    province: 'Luanda',
    year: 2024,
  },
  orderBy: { month: 'asc' },
});
```

### 2. MLModelsRegistry

Registro de modelos de Machine Learning.

```typescript
{
  id: number;
  modelName: string;       // Nome do modelo
  version: string;         // Versão (ex: "1.0.0")
  algorithm: string | null;
  metrics: Json | null;    // Métricas de performance
  status: string;          // "active", "deprecated", "testing"
  trainedOn: Date | null;
  lastUpdated: Date;
}
```

**Exemplo de Query:**
```typescript
// Buscar modelo ativo mais recente
const model = await prisma.mLModelsRegistry.findFirst({
  where: {
    modelName: 'visitor_forecast',
    status: 'active',
  },
  orderBy: { lastUpdated: 'desc' },
});

console.log(model.metrics); // { mae: 245.3, rmse: 312.5, mape: 8.2 }
```

### 3. MLPredictions

Previsões geradas pelos modelos.

```typescript
{
  id: number;
  modelName: string;
  modelVersion: string | null;
  province: string;
  month: number;
  year: number;
  predictedVisitors: number | null;
  confidenceInterval: Json | null;  // { lower, upper, confidence }
  createdAt: Date;
}
```

**Exemplo de Query:**
```typescript
// Buscar previsões para Luanda em 2026
const predictions = await prisma.mLPredictions.findMany({
  where: {
    province: 'Luanda',
    year: 2026,
    modelName: 'visitor_forecast',
  },
  orderBy: { month: 'asc' },
});

predictions.forEach(p => {
  console.log(`${p.month}/2026: ${p.predictedVisitors} visitantes`);
  console.log(`Intervalo: ${p.confidenceInterval.lower} - ${p.confidenceInterval.upper}`);
});
```

### 4. RecommendationsLog

Log de recomendações geradas para usuários.

```typescript
{
  id: number;
  userId: string | null;
  destinationId: string | null;
  score: number | null;         // Score de recomendação (0-1)
  modelVersion: string | null;
  createdAt: Date;
  
  // Relacionamentos
  user: User | null;
  destination: Destination | null;
}
```

**Exemplo de Query:**
```typescript
// Buscar recomendações de um usuário
const recommendations = await prisma.recommendationsLog.findMany({
  where: { userId: 'user-uuid' },
  include: {
    destination: {
      select: {
        id: true,
        name: true,
        province: true,
        rating: true,
      },
    },
  },
  orderBy: { score: 'desc' },
  take: 10,
});
```

---

## 🚀 Scripts Disponíveis

### Verificar Tabelas
```bash
npx tsx scripts/check-ml-tables.ts
```

Mostra:
- Quantidade de registros em cada tabela
- Últimos registros criados
- Status das tabelas base (users, destinations)

### Popular Tabelas
```bash
npx tsx prisma/seed-ml.ts
```

Cria:
- 216 registros de estatísticas (6 províncias × 3 anos × 12 meses)
- 3 modelos ML (forecast, recommender, sentiment)
- 72 previsões (6 províncias × 12 meses para 2026)
- Recommendations (se houver users e destinations)

### Limpar e Recriar
```bash
npx prisma db push --force-reset
npx tsx prisma/seed-ml.ts
```

---

## 📡 Endpoints API Sugeridos

### 1. Tourism Statistics

```typescript
// GET /api/ml/statistics
@Get('statistics')
async getStatistics(
  @Query('province') province?: string,
  @Query('year') year?: number,
) {
  return await this.prisma.tourismStatistics.findMany({
    where: {
      ...(province && { province }),
      ...(year && { year }),
    },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });
}
```

### 2. ML Predictions

```typescript
// GET /api/ml/predictions
@Get('predictions')
async getPredictions(
  @Query('province') province?: string,
  @Query('year') year?: number,
) {
  return await this.prisma.mLPredictions.findMany({
    where: {
      ...(province && { province }),
      ...(year && { year }),
    },
    orderBy: [{ year: 'asc' }, { month: 'asc' }],
  });
}
```

### 3. Recommendations

```typescript
// GET /api/ml/recommendations/:userId
@Get('recommendations/:userId')
async getRecommendations(@Param('userId') userId: string) {
  return await this.prisma.recommendationsLog.findMany({
    where: { userId },
    include: {
      destination: {
        include: {
          category: true,
          images: { where: { isMain: true }, take: 1 },
        },
      },
    },
    orderBy: { score: 'desc' },
    take: 20,
  });
}

// POST /api/ml/recommendations
@Post('recommendations')
async createRecommendation(@Body() data: CreateRecommendationDto) {
  return await this.prisma.recommendationsLog.create({
    data: {
      userId: data.userId,
      destinationId: data.destinationId,
      score: data.score,
      modelVersion: data.modelVersion,
    },
  });
}
```

### 4. ML Models

```typescript
// GET /api/ml/models
@Get('models')
async getModels() {
  return await this.prisma.mLModelsRegistry.findMany({
    where: { status: 'active' },
    orderBy: { lastUpdated: 'desc' },
  });
}
```

---

## 🔗 Integração com Backend ML

O backend ML (Python/FastAPI) pode acessar estas tabelas da seguinte forma:

### SQLAlchemy Models (Python)

```python
from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from database import Base

class TourismStatistics(Base):
    __tablename__ = "tourism_statistics"
    
    id = Column(Integer, primary_key=True)
    province = Column(String(100))
    month = Column(Integer)
    year = Column(Integer)
    domestic_visitors = Column(Integer, nullable=True)
    foreign_visitors = Column(Integer, nullable=True)
    occupancy_rate = Column(Float, nullable=True)
    avg_stay_days = Column(Float, nullable=True)
    created_at = Column(DateTime)

class MLPredictions(Base):
    __tablename__ = "ml_predictions"
    
    id = Column(Integer, primary_key=True)
    model_name = Column(String(100))
    model_version = Column(String(20), nullable=True)
    province = Column(String(100))
    month = Column(Integer)
    year = Column(Integer)
    predicted_visitors = Column(Integer, nullable=True)
    confidence_interval = Column(JSON, nullable=True)
    created_at = Column(DateTime)
```

### Exemplo de Uso (Python)

```python
from sqlalchemy.orm import Session
from models import TourismStatistics, MLPredictions

# Buscar dados históricos
def get_historical_data(db: Session, province: str):
    return db.query(TourismStatistics).filter(
        TourismStatistics.province == province
    ).order_by(
        TourismStatistics.year,
        TourismStatistics.month
    ).all()

# Salvar previsão
def save_prediction(db: Session, province: str, month: int, year: int, visitors: int):
    prediction = MLPredictions(
        model_name="visitor_forecast",
        model_version="1.0.0",
        province=province,
        month=month,
        year=year,
        predicted_visitors=visitors,
        confidence_interval={"lower": visitors - 500, "upper": visitors + 500}
    )
    db.add(prediction)
    db.commit()
```

---

## ✅ Checklist de Implementação

- ✅ Tabelas criadas no schema.prisma
- ✅ Relacionamentos configurados
- ✅ Migrations aplicadas (`npx prisma db push`)
- ✅ Prisma Client gerado
- ✅ Script de seed criado
- ✅ Script de verificação criado
- ✅ Dados de exemplo populados
- ✅ Documentação completa

---

## 🎯 Próximos Passos

1. **Criar Module ML no NestJS:**
   ```bash
   nest g module ml
   nest g service ml
   nest g controller ml
   ```

2. **Implementar Endpoints:**
   - GET /api/ml/statistics
   - GET /api/ml/predictions
   - GET /api/ml/recommendations/:userId
   - POST /api/ml/recommendations
   - GET /api/ml/models

3. **Configurar Backend ML (Python):**
   - Conectar ao mesmo banco de dados
   - Criar modelos SQLAlchemy
   - Implementar scripts de treinamento
   - Implementar API de previsões

4. **Integração:**
   - Backend ML treina modelos e salva previsões
   - Backend CRUD expõe dados via API
   - Frontend consome ambos

---

## 📞 Suporte

Se precisar de ajuda:
1. Verificar tabelas: `npx tsx scripts/check-ml-tables.ts`
2. Ver logs do Prisma: `npx prisma studio`
3. Resetar e recriar: `npx prisma db push --force-reset`

---

**Tudo pronto para o backend ML! 🎉**
