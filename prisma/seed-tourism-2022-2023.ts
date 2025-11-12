import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTourismStatistics2022_2023() {
  console.log('🌱 Seeding Tourism Statistics 2022-2023...\n');

  // Províncias de Angola
  const provinces = [
    'Luanda',
    'Benguela',
    'Huíla',
    'Namibe',
    'Malanje',
    'Huambo',
    'Cabinda',
    'Cunene',
    'Bié',
    'Moxico',
    'Zaire',
    'Uíge',
    'Lunda Norte',
    'Lunda Sul',
    'Cuando Cubango',
    'Bengo',
    'Cuanza Norte',
    'Cuanza Sul',
  ];

  const statistics = [];

  // Dados para 2022 e 2023
  for (const province of provinces) {
    for (const year of [2022, 2023]) {
      for (let month = 1; month <= 12; month++) {
        // Fatores sazonais (época alta: dez-mar, época baixa: abr-nov)
        const isHighSeason = month >= 12 || month <= 3;
        const seasonFactor = isHighSeason ? 1.4 : 1.0;

        // Fatores por província (capitais têm mais turismo)
        let provinceFactor = 1.0;
        switch (province) {
          case 'Luanda':
            provinceFactor = 3.5; // Capital, maior turismo de negócios
            break;
          case 'Benguela':
          case 'Huíla':
          case 'Namibe':
            provinceFactor = 2.0; // Destinos turísticos populares
            break;
          case 'Cabinda':
            provinceFactor = 1.5;
            break;
          case 'Malanje':
          case 'Huambo':
            provinceFactor = 1.3;
            break;
          default:
            provinceFactor = 0.8;
        }

        // Crescimento de 2022 para 2023 (recuperação pós-COVID)
        const yearFactor = year === 2023 ? 1.15 : 1.0;

        // Cálculo de visitantes
        const baseDomestic = Math.floor(
          (Math.random() * 2000 + 3000) * provinceFactor * seasonFactor * yearFactor
        );
        const baseForeign = Math.floor(
          (Math.random() * 800 + 500) * provinceFactor * seasonFactor * yearFactor
        );

        // Taxa de ocupação hoteleira (%)
        const baseOccupancy = isHighSeason ? 0.65 : 0.45;
        const occupancyRate = parseFloat(
          (baseOccupancy + Math.random() * 0.15).toFixed(3)
        );

        // Média de dias de estadia
        const baseStayDays = isHighSeason ? 4.5 : 3.5;
        const avgStayDays = parseFloat(
          (baseStayDays + Math.random() * 1.5).toFixed(2)
        );

        statistics.push({
          province,
          month,
          year,
          domesticVisitors: baseDomestic,
          foreignVisitors: baseForeign,
          occupancyRate,
          avgStayDays,
        });
      }
    }
  }

  console.log(`📊 Creating ${statistics.length} statistics records...`);
  console.log(`   Years: 2022-2023`);
  console.log(`   Provinces: ${provinces.length}`);
  console.log(`   Months per year: 12`);
  console.log(`   Total: ${provinces.length} × 2 years × 12 months = ${statistics.length}\n`);

  // Inserir em lotes para melhor performance
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < statistics.length; i += batchSize) {
    const batch = statistics.slice(i, i + batchSize);
    await prisma.tourismStatistics.createMany({
      data: batch,
      skipDuplicates: true,
    });
    inserted += batch.length;
    console.log(`   ✓ Inserted ${inserted}/${statistics.length} records`);
  }

  console.log(`\n✅ Successfully seeded ${statistics.length} tourism statistics!\n`);

  // Mostrar alguns exemplos
  console.log('📈 Sample Statistics:\n');

  // Luanda - Dezembro 2023 (época alta)
  const luandaDec2023 = await prisma.tourismStatistics.findFirst({
    where: { province: 'Luanda', month: 12, year: 2023 },
  });

  if (luandaDec2023) {
    console.log('   Luanda - Dezembro 2023:');
    console.log(`   - Visitantes Nacionais: ${luandaDec2023.domesticVisitors?.toLocaleString()}`);
    console.log(`   - Visitantes Estrangeiros: ${luandaDec2023.foreignVisitors?.toLocaleString()}`);
    console.log(`   - Taxa de Ocupação: ${(luandaDec2023.occupancyRate! * 100).toFixed(1)}%`);
    console.log(`   - Média de Estadia: ${luandaDec2023.avgStayDays} dias\n`);
  }

  // Namibe - Julho 2022 (época baixa)
  const namibeJul2022 = await prisma.tourismStatistics.findFirst({
    where: { province: 'Namibe', month: 7, year: 2022 },
  });

  if (namibeJul2022) {
    console.log('   Namibe - Julho 2022:');
    console.log(`   - Visitantes Nacionais: ${namibeJul2022.domesticVisitors?.toLocaleString()}`);
    console.log(`   - Visitantes Estrangeiros: ${namibeJul2022.foreignVisitors?.toLocaleString()}`);
    console.log(`   - Taxa de Ocupação: ${(namibeJul2022.occupancyRate! * 100).toFixed(1)}%`);
    console.log(`   - Média de Estadia: ${namibeJul2022.avgStayDays} dias\n`);
  }

  // Estatísticas por ano
  const stats2022 = await prisma.tourismStatistics.aggregate({
    where: { year: 2022 },
    _sum: {
      domesticVisitors: true,
      foreignVisitors: true,
    },
    _avg: {
      occupancyRate: true,
      avgStayDays: true,
    },
  });

  const stats2023 = await prisma.tourismStatistics.aggregate({
    where: { year: 2023 },
    _sum: {
      domesticVisitors: true,
      foreignVisitors: true,
    },
    _avg: {
      occupancyRate: true,
      avgStayDays: true,
    },
  });

  console.log('📊 Annual Summary:\n');
  console.log('   2022:');
  console.log(`   - Total Visitantes Nacionais: ${stats2022._sum.domesticVisitors?.toLocaleString()}`);
  console.log(`   - Total Visitantes Estrangeiros: ${stats2022._sum.foreignVisitors?.toLocaleString()}`);
  console.log(`   - Taxa Ocupação Média: ${(stats2022._avg.occupancyRate! * 100).toFixed(1)}%`);
  console.log(`   - Dias Estadia Média: ${stats2023._avg.avgStayDays?.toFixed(2)} dias\n`);

  console.log('   2023:');
  console.log(`   - Total Visitantes Nacionais: ${stats2023._sum.domesticVisitors?.toLocaleString()}`);
  console.log(`   - Total Visitantes Estrangeiros: ${stats2023._sum.foreignVisitors?.toLocaleString()}`);
  console.log(`   - Taxa Ocupação Média: ${(stats2023._avg.occupancyRate! * 100).toFixed(1)}%`);
  console.log(`   - Dias Estadia Média: ${stats2023._avg.avgStayDays?.toFixed(2)} dias\n`);

  const growth = (
    ((stats2023._sum.domesticVisitors! - stats2022._sum.domesticVisitors!) /
      stats2022._sum.domesticVisitors!) *
    100
  ).toFixed(1);

  console.log(`   📈 Crescimento 2022→2023: ${growth}%\n`);
}

async function main() {
  try {
    await seedTourismStatistics2022_2023();
    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
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
