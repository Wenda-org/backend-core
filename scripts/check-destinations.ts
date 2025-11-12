import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDestinations() {
  console.log('🏝️  Verificando Destinos no Banco de Dados...\n');
  console.log('='.repeat(70));

  const totalDestinations = await prisma.destination.count();

  console.log(`\n📊 Total de Destinos: ${totalDestinations}\n`);

  if (totalDestinations > 0) {
    // Listar todos os destinos
    const destinations = await prisma.destination.findMany({
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    });

    console.log('📋 Lista de Destinos:\n');

    destinations.forEach((dest, idx) => {
      console.log(`   ${idx + 1}. ${dest.name}`);
      console.log(`      Província: ${dest.province}`);
      console.log(`      Categoria: ${dest.category.name}`);
      console.log(`      Rating: ⭐ ${dest.rating}`);
      console.log(`      ID: ${dest.id}\n`);
    });

    // Estatísticas por província
    console.log('\n📊 Destinos por Província:\n');

    const byProvince = await prisma.destination.groupBy({
      by: ['province'],
      _count: true,
    });

    byProvince.forEach(prov => {
      console.log(`   ${prov.province}: ${prov._count} destinos`);
    });

    // Estatísticas por categoria
    console.log('\n\n📊 Destinos por Categoria:\n');

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { destinations: true },
        },
      },
      orderBy: {
        destinations: {
          _count: 'desc',
        },
      },
    });

    categories.forEach(cat => {
      if (cat._count.destinations > 0) {
        console.log(`   ${cat.name}: ${cat._count.destinations} destinos`);
      }
    });
  } else {
    console.log('   ⚠️  Nenhum destino encontrado no banco de dados.\n');
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Verificação concluída!\n');
}

async function main() {
  try {
    await checkDestinations();
  } catch (error) {
    console.error('❌ Erro ao verificar destinos:', error);
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
