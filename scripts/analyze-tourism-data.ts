import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeTourismData() {
  console.log('📊 Análise de Estatísticas de Turismo 2022-2023\n');
  console.log('='.repeat(70));
  console.log('\n');

  // 1. Total de registros por ano
  const total2022 = await prisma.tourismStatistics.count({ where: { year: 2022 } });
  const total2023 = await prisma.tourismStatistics.count({ where: { year: 2023 } });

  console.log('📅 Total de Registros:');
  console.log(`   2022: ${total2022} registros`);
  console.log(`   2023: ${total2023} registros`);
  console.log(`   Total: ${total2022 + total2023} registros\n`);

  // 2. Top 5 Províncias com Mais Turistas (2023)
  console.log('🏆 Top 5 Províncias - Total de Visitantes 2023:\n');

  const provinces = await prisma.$queryRaw<any[]>`
    SELECT 
      province,
      SUM(domestic_visitors) as total_domestic,
      SUM(foreign_visitors) as total_foreign,
      SUM(domestic_visitors + foreign_visitors) as total_visitors,
      AVG(occupancy_rate) as avg_occupancy,
      AVG(avg_stay_days) as avg_stay
    FROM tourism_statistics
    WHERE year = 2023
    GROUP BY province
    ORDER BY total_visitors DESC
    LIMIT 5
  `;

  provinces.forEach((p, idx) => {
    console.log(`   ${idx + 1}. ${p.province}`);
    console.log(`      Total: ${Number(p.total_visitors).toLocaleString()} visitantes`);
    console.log(`      Nacionais: ${Number(p.total_domestic).toLocaleString()}`);
    console.log(`      Estrangeiros: ${Number(p.total_foreign).toLocaleString()}`);
    console.log(`      Taxa Ocupação: ${(Number(p.avg_occupancy) * 100).toFixed(1)}%`);
    console.log(`      Estadia Média: ${Number(p.avg_stay).toFixed(1)} dias\n`);
  });

  // 3. Sazonalidade - Meses com Mais Turistas
  console.log('📅 Sazonalidade - Visitantes por Mês (Média 2022-2023):\n');

  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const seasonality = await prisma.$queryRaw<any[]>`
    SELECT 
      month,
      AVG(domestic_visitors + foreign_visitors) as avg_visitors,
      AVG(occupancy_rate) as avg_occupancy
    FROM tourism_statistics
    WHERE year IN (2022, 2023)
    GROUP BY month
    ORDER BY month
  `;

  seasonality.forEach((s) => {
    const monthName = months[s.month - 1];
    const visitors = Number(s.avg_visitors).toFixed(0);
    const occupancy = (Number(s.avg_occupancy) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(Number(s.avg_visitors) / 100));
    console.log(`   ${monthName}: ${visitors.padStart(6)} visitantes (${occupancy}%) ${bar}`);
  });

  // 4. Crescimento 2022 → 2023 por Província
  console.log('\n\n📈 Crescimento de Turismo 2022 → 2023:\n');

  const growth = await prisma.$queryRaw<any[]>`
    WITH stats_by_year AS (
      SELECT 
        province,
        year,
        SUM(domestic_visitors + foreign_visitors) as total_visitors
      FROM tourism_statistics
      GROUP BY province, year
    )
    SELECT 
      a.province,
      a.total_visitors as visitors_2022,
      b.total_visitors as visitors_2023,
      ((b.total_visitors - a.total_visitors) * 100.0 / a.total_visitors) as growth_pct
    FROM stats_by_year a
    JOIN stats_by_year b ON a.province = b.province
    WHERE a.year = 2022 AND b.year = 2023
    ORDER BY growth_pct DESC
    LIMIT 10
  `;

  growth.forEach((g, idx) => {
    const pct = Number(g.growth_pct).toFixed(1);
    const emoji = Number(g.growth_pct) > 0 ? '📈' : '📉';
    console.log(`   ${idx + 1}. ${emoji} ${g.province}: ${pct}%`);
    console.log(`      2022: ${Number(g.visitors_2022).toLocaleString()}`);
    console.log(`      2023: ${Number(g.visitors_2023).toLocaleString()}\n`);
  });

  // 5. Estatísticas Gerais
  console.log('📊 Estatísticas Gerais (2022-2023):\n');

  const overall = await prisma.$queryRaw<any[]>`
    SELECT 
      COUNT(*) as total_records,
      COUNT(DISTINCT province) as total_provinces,
      SUM(domestic_visitors) as total_domestic,
      SUM(foreign_visitors) as total_foreign,
      AVG(occupancy_rate) as avg_occupancy,
      AVG(avg_stay_days) as avg_stay,
      MAX(domestic_visitors + foreign_visitors) as max_visitors,
      MIN(domestic_visitors + foreign_visitors) as min_visitors
    FROM tourism_statistics
    WHERE year IN (2022, 2023)
  `;

  const stats = overall[0];
  console.log(`   Total de Registros: ${Number(stats.total_records).toLocaleString()}`);
  console.log(`   Províncias Cobertas: ${stats.total_provinces}`);
  console.log(`   Total Visitantes Nacionais: ${Number(stats.total_domestic).toLocaleString()}`);
  console.log(`   Total Visitantes Estrangeiros: ${Number(stats.total_foreign).toLocaleString()}`);
  console.log(`   Taxa Ocupação Média: ${(Number(stats.avg_occupancy) * 100).toFixed(1)}%`);
  console.log(`   Estadia Média: ${Number(stats.avg_stay).toFixed(1)} dias`);
  console.log(`   Máximo Visitantes/Mês: ${Number(stats.max_visitors).toLocaleString()}`);
  console.log(`   Mínimo Visitantes/Mês: ${Number(stats.min_visitors).toLocaleString()}\n`);

  console.log('='.repeat(70));
  console.log('\n✅ Análise concluída!\n');
}

async function main() {
  try {
    await analyzeTourismData();
  } catch (error) {
    console.error('❌ Error analyzing data:', error);
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
