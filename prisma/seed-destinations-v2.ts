import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para criar slug a partir do nome
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedDestinations() {
  console.log('🏝️  Populando Destinos Turísticos de Angola...\n');
  console.log('='.repeat(70));

  // Buscar categorias existentes
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

  console.log(`\n📂 Categorias disponíveis: ${categories.length}\n`);
  categories.forEach(c => console.log(`   - ${c.name} (${c.slug})`));
  console.log();

  const destinationsData = [
    // LUANDA
    { name: 'Ilha do Mussulo', province: 'Luanda', location: 'Baía de Luanda', categorySlug: 'praia', lat: -9.0765, lng: 13.0987, rating: 4.5, description: 'Ilha paradisíaca com praias de areia branca e águas cristalinas na Baía de Luanda.' },
    { name: 'Fortaleza de São Miguel', province: 'Luanda', location: 'Luanda', categorySlug: 'historico', lat: -8.8137, lng: 13.2343, rating: 4.2, description: 'Fortaleza histórica de 1576, atualmente abriga o Museu das Forças Armadas.' },
    { name: 'Marginal de Luanda', province: 'Luanda', location: 'Luanda', categorySlug: 'lazer', lat: -8.8089, lng: 13.2351, rating: 4.3, description: 'Avenida costeira com 6 km repleta de restaurantes, bares e vistas do Atlântico.' },
    { name: 'Miradouro da Lua', province: 'Luanda', location: 'Belas', categorySlug: 'natural', lat: -9.1500, lng: 13.0833, rating: 4.7, description: 'Formação geológica única esculpida pela erosão com paisagens lunares.' },
    
    // HUÍLA
    { name: 'Fenda da Tundavala', province: 'Huíla', location: 'Lubango', categorySlug: 'natural', lat: -14.9167, lng: 13.3167, rating: 4.9, description: 'Miradouro espetacular a 2600m com vista para precipício de 1000 metros.' },
    { name: 'Serra da Leba', province: 'Huíla', location: 'Lubango', categorySlug: 'natural', lat: -14.9833, lng: 13.2833, rating: 4.8, description: 'Estrada sinuosa icónica que serpenteia pela montanha.' },
    { name: 'Cristo Rei do Lubango', province: 'Huíla', location: 'Lubango', categorySlug: 'religioso', lat: -14.9094, lng: 13.4922, rating: 4.6, description: 'Estátua monumental de Cristo com 30 metros e vistas panorâmicas 360°.' },
    
    // BENGUELA
    { name: 'Praias de Benguela', province: 'Benguela', location: 'Benguela', categorySlug: 'praia', lat: -12.5763, lng: 13.4055, rating: 4.4, description: 'Costa atlântica com praias extensas ideais para surf e pesca.' },
    { name: 'Baía Azul', province: 'Benguela', location: 'Benguela', categorySlug: 'praia', lat: -12.6167, lng: 13.3667, rating: 4.5, description: 'Complexo turístico com praias paradisíacas e infraestruturas modernas.' },
    { name: 'Lobito', province: 'Benguela', location: 'Lobito', categorySlug: 'cidade', lat: -12.3644, lng: 13.5466, rating: 4.2, description: 'Cidade portuária com praias urbanas e arquitetura colonial.' },
    
    // NAMIBE
    { name: 'Deserto do Namibe', province: 'Namibe', location: 'Namibe', categorySlug: 'natural', lat: -15.1972, lng: 12.1508, rating: 4.8, description: 'Deserto costeiro mais antigo do mundo com dunas que encontram o oceano.' },
    { name: 'Welwitschia Mirabilis', province: 'Namibe', location: 'Namibe', categorySlug: 'natural', lat: -15.0333, lng: 12.0833, rating: 4.6, description: 'Planta endémica com mais de 1500 anos, fóssil vivo símbolo de Angola.' },
    { name: 'Arco do Namibe', province: 'Namibe', location: 'Namibe', categorySlug: 'natural', lat: -15.1500, lng: 12.1000, rating: 4.4, description: 'Formação rochosa natural em arco esculpida pelo vento e mar.' },
    
    // MALANJE
    { name: 'Quedas de Kalandula', province: 'Malanje', location: 'Kalandula', categorySlug: 'natural', lat: -9.3167, lng: 15.8833, rating: 4.9, description: 'Segundas maiores quedas de África com 105m de altura e 400m de largura.' },
    { name: 'Pedras Negras de Pungo Andongo', province: 'Malanje', location: 'Pungo Andongo', categorySlug: 'natural', lat: -9.6833, lng: 15.4833, rating: 4.7, description: 'Formações de granito negro gigantes que se erguem na savana.' },
    
    // HUAMBO
    { name: 'Monte Moco', province: 'Huambo', location: 'Londuimbali', categorySlug: 'adventure', lat: -12.4833, lng: 15.1833, rating: 4.6, description: 'Ponto mais alto de Angola com 2620m, ideal para trekking.' },
    { name: 'Cidade do Huambo', province: 'Huambo', location: 'Huambo', categorySlug: 'cidade', lat: -12.7767, lng: 15.7389, rating: 4.1, description: 'Segunda maior cidade, "Cidade das Acácias", clima temperado.' },
    
    // CABINDA
    { name: 'Floresta do Maiombe', province: 'Cabinda', location: 'Cabinda', categorySlug: 'natural', lat: -4.8833, lng: 12.5667, rating: 4.5, description: 'Floresta tropical densa com gorilas, chimpanzés e espécies endémicas.' },
    { name: 'Praias de Cabinda', province: 'Cabinda', location: 'Cabinda', categorySlug: 'praia', lat: -5.5500, lng: 12.2000, rating: 4.3, description: 'Costa tropical com praias virgens, coqueiros e águas mornas.' },
    
    // BIÉ
    { name: 'Nascente do Rio Zambeze', province: 'Bié', location: 'Kalene Hill', categorySlug: 'natural', lat: -11.3500, lng: 17.5833, rating: 4.4, description: 'Local onde nasce o quarto maior rio de África.' },
    
    // MOXICO
    { name: 'Parque Nacional da Cameia', province: 'Moxico', location: 'Luena', categorySlug: 'safari', lat: -11.7500, lng: 20.8333, rating: 4.5, description: 'Parque com lagoas, vida selvagem e paisagens de savana.' },
    
    // ZAIRE
    { name: 'Quedas de Yélala', province: 'Zaire', location: 'Nzeto', categorySlug: 'natural', lat: -5.7833, lng: 12.8667, rating: 4.3, description: 'Quedas espetaculares no Rio Congo de valor histórico.' },
    
    // UÍGE
    { name: 'Plantações de Café do Uíge', province: 'Uíge', location: 'Uíge', categorySlug: 'rural', lat: -7.6089, lng: 15.0614, rating: 4.2, description: 'Vastas plantações de café arábica com turismo rural.' },
    
    // CUANDO CUBANGO
    { name: 'Parque Nacional do Mavinga', province: 'Cuando Cubango', location: 'Mavinga', categorySlug: 'safari', lat: -15.5333, lng: 19.5000, rating: 4.7, description: 'Um dos maiores parques de África com elefantes, leões e licaões.' },
    
    // CUNENE
    { name: 'Quedas de Ruacaná', province: 'Cunene', location: 'Ruacaná', categorySlug: 'natural', lat: -17.4167, lng: 14.2000, rating: 4.4, description: 'Quedas de 120m na fronteira com a Namíbia.' },
    
    // LUNDA NORTE
    { name: 'Minas de Diamantes', province: 'Lunda Norte', location: 'Lucapa', categorySlug: 'cultural', lat: -8.4167, lng: 20.7333, rating: 4.0, description: 'Visitas educacionais às zonas diamantíferas e Museu do Diamante.' },
  ];

  console.log(`📍 Preparando ${destinationsData.length} destinos...\n`);

  let created = 0;
  let errors = 0;

  for (const destData of destinationsData) {
    try {
      // Tentar obter categoryId, se não existir usar a primeira categoria disponível
      let categoryId = categoryMap.get(destData.categorySlug);
      
      if (!categoryId) {
        console.log(`   ⚠️  Categoria "${destData.categorySlug}" não encontrada para ${destData.name}, usando "natural"`);
        categoryId = categoryMap.get('natural') || categories[0]?.id;
      }

      if (!categoryId) {
        console.log(`   ❌ Nenhuma categoria disponível para ${destData.name}, pulando...`);
        errors++;
        continue;
      }

      const destination = await prisma.destination.create({
        data: {
          name: destData.name,
          slug: createSlug(destData.name),
          description: destData.description,
          location: destData.location,
          province: destData.province,
          address: destData.location,
          categoryId: categoryId,
          latitude: destData.lat,
          longitude: destData.lng,
          rating: destData.rating,
        },
      });

      created++;
      console.log(`   ✅ ${destData.name} (${destData.province})`);
    } catch (error: any) {
      errors++;
      console.log(`   ❌ Erro ao criar ${destData.name}: ${error.message}`);
    }
  }

  console.log(`\n✅ Criados: ${created} destinos`);
  if (errors > 0) {
    console.log(`❌ Erros: ${errors}`);
  }

  // Estatísticas
  console.log('\n📊 Estatísticas por Província:\n');

  const byProvince = await prisma.destination.groupBy({
    by: ['province'],
    _count: true,
  });

  byProvince.sort((a, b) => b._count - a._count);

  byProvince.forEach(prov => {
    console.log(`   ${prov.province}: ${prov._count} destinos`);
  });

  // Top destinos
  console.log('\n\n⭐ Top 10 Destinos por Avaliação:\n');

  const topDestinations = await prisma.destination.findMany({
    include: {
      category: true,
    },
    orderBy: {
      rating: 'desc',
    },
    take: 10,
  });

  topDestinations.forEach((dest, idx) => {
    console.log(`   ${idx + 1}. ${dest.name} (${dest.province})`);
    console.log(`      ⭐ ${dest.rating} | ${dest.category.name}\n`);
  });

  console.log('='.repeat(70));
  console.log('\n✅ Seed de destinos concluído!\n');
}

async function main() {
  try {
    await seedDestinations();
  } catch (error) {
    console.error('❌ Erro ao popular destinos:', error);
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
