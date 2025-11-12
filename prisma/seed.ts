import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Categories
  const categories = [
    {
      name: 'Natural',
      slug: 'natural',
      description: 'Praias, montanhas, parques e natureza',
      icon: 'leaf',
      color: '#10B981',
      displayOrder: 1,
    },
    {
      name: 'Cultural',
      slug: 'cultural',
      description: 'Museus, galerias, centros culturais',
      icon: 'business',
      color: '#8B5CF6',
      displayOrder: 2,
    },
    {
      name: 'Histórico',
      slug: 'historical',
      description: 'Monumentos, fortalezas, sítios históricos',
      icon: 'library',
      color: '#F59E0B',
      displayOrder: 3,
    },
    {
      name: 'Aventura',
      slug: 'adventure',
      description: 'Esportes radicais, trilhas, atividades',
      icon: 'bicycle',
      color: '#EF4444',
      displayOrder: 4,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categories seeded successfully');

  // You can add more seed data here (sample destinations, test users, etc.)
  
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
