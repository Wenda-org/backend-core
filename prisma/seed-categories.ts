import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('🏷️  Populando Categorias...\n');
  console.log('='.repeat(70));

  const categories = [
    {
      name: 'Natureza',
      slug: 'natureza',
      description: 'Paisagens naturais, montanhas, desertos, florestas e formações geológicas',
      icon: '🏔️',
      color: '#10b981',
      displayOrder: 1,
    },
    {
      name: 'Praia',
      slug: 'praia',
      description: 'Praias, ilhas e destinos costeiros',
      icon: '🏖️',
      color: '#3b82f6',
      displayOrder: 2,
    },
    {
      name: 'Histórico',
      slug: 'historico',
      description: 'Monumentos históricos, fortalezas e locais com valor patrimonial',
      icon: '🏛️',
      color: '#8b5cf6',
      displayOrder: 3,
    },
    {
      name: 'Cidade',
      slug: 'cidade',
      description: 'Cidades, centros urbanos e atrações urbanas',
      icon: '🏙️',
      color: '#06b6d4',
      displayOrder: 4,
    },
    {
      name: 'Lazer',
      slug: 'lazer',
      description: 'Áreas de lazer, entretenimento e recreação',
      icon: '🎡',
      color: '#f59e0b',
      displayOrder: 5,
    },
    {
      name: 'Cultural',
      slug: 'cultural',
      description: 'Museus, galerias, centros culturais e eventos',
      icon: '🎭',
      color: '#ec4899',
      displayOrder: 6,
    },
    {
      name: 'Religioso',
      slug: 'religioso',
      description: 'Igrejas, templos e locais de peregrinação',
      icon: '⛪',
      color: '#6366f1',
      displayOrder: 7,
    },
    {
      name: 'Rural',
      slug: 'rural',
      description: 'Turismo rural, fazendas, plantações e agroturismo',
      icon: '🌾',
      color: '#84cc16',
      displayOrder: 8,
    },
    {
      name: 'Aventura',
      slug: 'aventura',
      description: 'Atividades de aventura, trekking, escalada e desportos radicais',
      icon: '🧗',
      color: '#f97316',
      displayOrder: 9,
    },
    {
      name: 'Safari',
      slug: 'safari',
      description: 'Parques nacionais, reservas e observação de vida selvagem',
      icon: '🦁',
      color: '#eab308',
      displayOrder: 10,
    },
  ];

  console.log(`\n🏷️  Criando ${categories.length} categorias...\n`);

  let created = 0;

  for (const catData of categories) {
    try {
      await prisma.category.create({
        data: catData,
      });
      created++;
      console.log(`   ✅ ${catData.name}`);
    } catch (error) {
      console.log(`   ⚠️  Categoria "${catData.name}" já existe, pulando...`);
    }
  }

  console.log(`\n✅ Total criado: ${created} categorias\n`);

  // Listar todas as categorias
  const allCategories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  console.log('📋 Categorias Disponíveis:\n');
  allCategories.forEach((cat, idx) => {
    console.log(`   ${idx + 1}. ${cat.icon} ${cat.name} (${cat.slug})`);
    console.log(`      ${cat.description}`);
    console.log(`      ID: ${cat.id}\n`);
  });

  console.log('='.repeat(70));
  console.log('\n✅ Categorias criadas com sucesso!\n');
}

async function main() {
  try {
    await seedCategories();
  } catch (error) {
    console.error('❌ Erro ao popular categorias:', error);
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
