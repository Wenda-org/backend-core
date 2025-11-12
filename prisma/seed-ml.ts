import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMLTables() {
  console.log('🌱 Seeding ML tables...');

  // 1. Tourism Statistics - Dados históricos de turismo
  console.log('📊 Seeding Tourism Statistics...');
  
  const provinces = ['Luanda', 'Benguela', 'Huíla', 'Namibe', 'Malanje', 'Huambo'];
  const currentYear = new Date().getFullYear();
  
  const tourismStats = [];
  for (const province of provinces) {
    for (let year = currentYear - 2; year <= currentYear; year++) {
      for (let month = 1; month <= 12; month++) {
        tourismStats.push({
          province,
          month,
          year,
          domesticVisitors: Math.floor(Math.random() * 5000) + 1000,
          foreignVisitors: Math.floor(Math.random() * 2000) + 500,
          occupancyRate: Math.random() * 0.5 + 0.4, // 40% - 90%
          avgStayDays: Math.random() * 5 + 2, // 2 - 7 dias
        });
      }
    }
  }

  await prisma.tourismStatistics.createMany({
    data: tourismStats,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${tourismStats.length} tourism statistics records`);

  // 2. ML Models Registry - Modelos de ML
  console.log('🤖 Seeding ML Models Registry...');

  const models = [
    {
      modelName: 'visitor_forecast',
      version: '1.0.0',
      algorithm: 'ARIMA',
      metrics: {
        mae: 245.3,
        rmse: 312.5,
        mape: 8.2,
      },
      status: 'active',
      trainedOn: new Date('2024-01-15'),
    },
    {
      modelName: 'destination_recommender',
      version: '1.0.0',
      algorithm: 'Collaborative Filtering',
      metrics: {
        precision: 0.78,
        recall: 0.72,
        f1_score: 0.75,
      },
      status: 'active',
      trainedOn: new Date('2024-02-01'),
    },
    {
      modelName: 'sentiment_analyzer',
      version: '1.0.0',
      algorithm: 'BERT',
      metrics: {
        accuracy: 0.89,
        precision: 0.87,
        recall: 0.88,
      },
      status: 'active',
      trainedOn: new Date('2024-01-20'),
    },
  ];

  await prisma.mLModelsRegistry.createMany({
    data: models,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${models.length} ML models`);

  // 3. ML Predictions - Previsões futuras
  console.log('🔮 Seeding ML Predictions...');

  const predictions = [];
  const nextYear = currentYear + 1;
  
  for (const province of provinces) {
    for (let month = 1; month <= 12; month++) {
      predictions.push({
        modelName: 'visitor_forecast',
        modelVersion: '1.0.0',
        province,
        month,
        year: nextYear,
        predictedVisitors: Math.floor(Math.random() * 6000) + 2000,
        confidenceInterval: {
          lower: Math.floor(Math.random() * 1000) + 1500,
          upper: Math.floor(Math.random() * 2000) + 7000,
          confidence: 0.95,
        },
      });
    }
  }

  await prisma.mLPredictions.createMany({
    data: predictions,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${predictions.length} predictions`);

  // 4. Recommendations Log - Alguns exemplos
  console.log('💡 Seeding Recommendations Log...');

  // Buscar alguns usuários e destinos existentes
  const users = await prisma.user.findMany({ take: 5 });
  const destinations = await prisma.destination.findMany({ take: 10 });

  if (users.length > 0 && destinations.length > 0) {
    const recommendations = [];
    
    for (const user of users) {
      // 3-5 recomendações por usuário
      const numRecommendations = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numRecommendations && i < destinations.length; i++) {
        recommendations.push({
          userId: user.id,
          destinationId: destinations[i].id,
          score: Math.random() * 0.5 + 0.5, // 0.5 - 1.0
          modelVersion: '1.0.0',
        });
      }
    }

    if (recommendations.length > 0) {
      await prisma.recommendationsLog.createMany({
        data: recommendations,
        skipDuplicates: true,
      });

      console.log(`✅ Created ${recommendations.length} recommendation logs`);
    } else {
      console.log('⚠️  No recommendations created (no users or destinations found)');
    }
  } else {
    console.log('⚠️  Skipping recommendations (no users or destinations found)');
  }

  console.log('🎉 ML tables seeding completed!');
}

async function main() {
  try {
    await seedMLTables();
  } catch (error) {
    console.error('❌ Error seeding ML tables:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
