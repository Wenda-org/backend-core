import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMLTables() {
  console.log('🔍 Checking ML Tables...\n');

  try {
    // 1. Tourism Statistics
    const statsCount = await prisma.tourismStatistics.count();
    console.log(`✅ tourism_statistics: ${statsCount} records`);
    
    if (statsCount > 0) {
      const latestStat = await prisma.tourismStatistics.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      console.log(`   Latest: ${latestStat?.province} - ${latestStat?.year}/${latestStat?.month}`);
    }

    // 2. ML Models Registry
    const modelsCount = await prisma.mLModelsRegistry.count();
    console.log(`\n✅ ml_models_registry: ${modelsCount} models`);
    
    if (modelsCount > 0) {
      const models = await prisma.mLModelsRegistry.findMany({
        where: { status: 'active' },
        select: { modelName: true, version: true, algorithm: true },
      });
      models.forEach((model) => {
        console.log(`   - ${model.modelName} v${model.version} (${model.algorithm})`);
      });
    }

    // 3. ML Predictions
    const predictionsCount = await prisma.mLPredictions.count();
    console.log(`\n✅ ml_predictions: ${predictionsCount} predictions`);
    
    if (predictionsCount > 0) {
      const latestPrediction = await prisma.mLPredictions.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      console.log(`   Latest: ${latestPrediction?.province} - ${latestPrediction?.year}/${latestPrediction?.month}`);
      console.log(`   Predicted Visitors: ${latestPrediction?.predictedVisitors}`);
    }

    // 4. Recommendations Log
    const recsCount = await prisma.recommendationsLog.count();
    console.log(`\n✅ recommendations_log: ${recsCount} recommendations`);
    
    if (recsCount > 0) {
      const latestRec = await prisma.recommendationsLog.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true } },
          destination: { select: { name: true } },
        },
      });
      console.log(`   Latest: ${latestRec?.user?.name || 'Unknown'} → ${latestRec?.destination?.name || 'Unknown'}`);
      console.log(`   Score: ${latestRec?.score?.toFixed(2)}`);
    }

    // 5. Base Tables (verificar se existem)
    const usersCount = await prisma.user.count();
    const destinationsCount = await prisma.destination.count();
    
    console.log(`\n📊 Base Tables:`);
    console.log(`   users: ${usersCount}`);
    console.log(`   destinations: ${destinationsCount}`);

    // Summary
    console.log(`\n📈 Summary:`);
    console.log(`   Total ML Records: ${statsCount + modelsCount + predictionsCount + recsCount}`);
    console.log(`   All ML tables exist: ✅`);
    
    if (statsCount === 0 || modelsCount === 0 || predictionsCount === 0) {
      console.log(`\n⚠️  Some tables are empty. Run seed script:`);
      console.log(`   npx tsx prisma/seed-ml.ts`);
    }

  } catch (error) {
    console.error('❌ Error checking tables:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkMLTables()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
