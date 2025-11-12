import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDestinations() {
  console.log('🏝️  Populando Destinos Turísticos de Angola...\n');
  console.log('='.repeat(70));

  // Buscar categorias existentes
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

  console.log(`\n📂 Categorias encontradas: ${categories.length}`);
  categories.forEach(c => console.log(`   - ${c.name} (${c.slug}): ${c.id}`));
  console.log();

  const destinations = [
    // ========== LUANDA ==========
    {
      name: 'Ilha do Mussulo',
      slug: 'ilha-do-mussulo',
      description: 'Uma ilha paradisíaca localizada na Baía de Luanda, conhecida pelas suas praias de areia branca e águas cristalinas. Perfeita para descanso, desportos aquáticos e gastronomia à beira-mar.',
      location: 'Luanda',
      province: 'Luanda',
      address: 'Baía de Luanda',
      latitude: -9.0765,
      longitude: 13.0987,
      categorySlug: 'praia',
      rating: 4.5,
    },
    {
      name: 'Fortaleza de São Miguel',
      description: 'Fortaleza histórica construída pelos portugueses em 1576, atualmente abriga o Museu das Forças Armadas. Oferece vistas panorâmicas da cidade e do porto de Luanda.',
      province: 'Luanda',
      city: 'Luanda',
      address: 'Rua do Direito, Luanda',
      latitude: -8.8137,
      longitude: 13.2343,
      category: 'Histórico',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      rating: 4.2,
      priceRange: 'low',
      bestTimeToVisit: 'Todo o ano',
      activities: ['Cultura', 'História', 'Fotografia', 'Museu'],
      isActive: true,
    },
    {
      name: 'Marginal de Luanda',
      description: 'Avenida costeira icónica com 6 km de extensão, repleta de restaurantes, bares, hotéis e vistas deslumbrantes do Oceano Atlântico. Centro da vida social de Luanda.',
      province: 'Luanda',
      city: 'Luanda',
      address: 'Avenida 4 de Fevereiro',
      latitude: -8.8089,
      longitude: 13.2351,
      category: 'Lazer',
      imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
      rating: 4.3,
      priceRange: 'medium',
      bestTimeToVisit: 'Todo o ano',
      activities: ['Caminhada', 'Gastronomia', 'Vida Noturna', 'Compras'],
      isActive: true,
    },
    {
      name: 'Miradouro da Lua',
      description: 'Formação geológica única esculpida pela erosão, com paisagens que lembram a superfície lunar. Um dos destinos mais fotografados de Angola.',
      province: 'Luanda',
      city: 'Belas',
      address: 'Município de Belas, 40 km de Luanda',
      latitude: -9.1500,
      longitude: 13.0833,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      rating: 4.7,
      priceRange: 'low',
      bestTimeToVisit: 'Maio a Setembro',
      activities: ['Fotografia', 'Caminhada', 'Piquenique', 'Observação de Paisagem'],
      isActive: true,
    },

    // ========== HUÍLA ==========
    {
      name: 'Fenda da Tundavala',
      description: 'Miradouro espetacular a 2600m de altitude com vista para um precipício de mais de 1000 metros. Uma das paisagens mais impressionantes de África.',
      province: 'Huíla',
      city: 'Lubango',
      address: 'Serra da Leba, 18 km de Lubango',
      latitude: -14.9167,
      longitude: 13.3167,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      rating: 4.9,
      priceRange: 'low',
      bestTimeToVisit: 'Maio a Setembro',
      activities: ['Fotografia', 'Caminhada', 'Observação de Paisagem', 'Trekking'],
      isActive: true,
    },
    {
      name: 'Serra da Leba',
      description: 'Famosa pela sua estrada sinuosa com curvas icónicas que serpenteia pela montanha. Obra-prima da engenharia rodoviária e ponto turístico obrigatório.',
      province: 'Huíla',
      city: 'Lubango',
      address: 'EN280, entre Lubango e Namibe',
      latitude: -14.9833,
      longitude: 13.2833,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      rating: 4.8,
      priceRange: 'low',
      bestTimeToVisit: 'Todo o ano',
      activities: ['Fotografia', 'Condução Cênica', 'Observação de Paisagem'],
      isActive: true,
    },
    {
      name: 'Cristo Rei do Lubango',
      description: 'Estátua monumental de Cristo com 30 metros de altura, situada no alto da Serra da Leba. Oferece vistas panorâmicas de 360° da cidade de Lubango.',
      province: 'Huíla',
      city: 'Lubango',
      address: 'Serra da Leba, Lubango',
      latitude: -14.9094,
      longitude: 13.4922,
      category: 'Religioso',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
      rating: 4.6,
      priceRange: 'low',
      bestTimeToVisit: 'Todo o ano',
      activities: ['Fotografia', 'Cultura', 'Religião', 'Observação de Paisagem'],
      isActive: true,
    },

    // ========== BENGUELA ==========
    {
      name: 'Praias de Benguela',
      description: 'Costa atlântica com praias extensas de areia branca, ideais para surf, pesca e relaxamento. Inclui Praia Morena, Caota e Baía Azul.',
      province: 'Benguela',
      city: 'Benguela',
      address: 'Costa de Benguela',
      latitude: -12.5763,
      longitude: 13.4055,
      category: 'Praia',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      rating: 4.4,
      priceRange: 'medium',
      bestTimeToVisit: 'Outubro a Março',
      activities: ['Praia', 'Surf', 'Pesca', 'Desportos Aquáticos'],
      isActive: true,
    },
    {
      name: 'Baía Azul',
      description: 'Complexo turístico com praias paradisíacas, restaurantes e infraestruturas modernas. Popular entre famílias e amantes de desportos aquáticos.',
      province: 'Benguela',
      city: 'Benguela',
      address: 'Baía Azul, Benguela',
      latitude: -12.6167,
      longitude: 13.3667,
      category: 'Praia',
      imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
      rating: 4.5,
      priceRange: 'medium',
      bestTimeToVisit: 'Novembro a Março',
      activities: ['Praia', 'Gastronomia', 'Desportos Aquáticos', 'Relaxamento'],
      isActive: true,
    },
    {
      name: 'Lobito',
      description: 'Cidade portuária com praias urbanas, arquitetura colonial e o famoso Restinga do Lobito - uma língua de areia que forma uma baía natural.',
      province: 'Benguela',
      city: 'Lobito',
      address: 'Lobito',
      latitude: -12.3644,
      longitude: 13.5466,
      category: 'Cidade',
      imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800',
      rating: 4.2,
      priceRange: 'medium',
      bestTimeToVisit: 'Todo o ano',
      activities: ['Praia', 'Cultura', 'Gastronomia', 'História'],
      isActive: true,
    },

    // ========== NAMIBE ==========
    {
      name: 'Deserto do Namibe',
      description: 'Deserto costeiro mais antigo do mundo, com dunas de areia alaranjada que encontram o Oceano Atlântico. Paisagens únicas e vida selvagem adaptada.',
      province: 'Namibe',
      city: 'Namibe',
      address: 'Sul de Angola',
      latitude: -15.1972,
      longitude: 12.1508,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
      rating: 4.8,
      priceRange: 'medium',
      bestTimeToVisit: 'Maio a Setembro',
      activities: ['Safari', 'Fotografia', 'Trekking', 'Acampamento'],
      isActive: true,
    },
    {
      name: 'Welwitschia Mirabilis',
      description: 'Planta endémica do deserto do Namibe que pode viver mais de 1500 anos. Considerada um "fóssil vivo" e símbolo nacional de Angola.',
      province: 'Namibe',
      city: 'Namibe',
      address: 'Deserto do Namibe',
      latitude: -15.0333,
      longitude: 12.0833,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      rating: 4.6,
      priceRange: 'low',
      bestTimeToVisit: 'Maio a Setembro',
      activities: ['Fotografia', 'Botânica', 'Educação', 'Caminhada'],
      isActive: true,
    },
    {
      name: 'Arco do Namibe',
      description: 'Formação rochosa natural em forma de arco, esculpida pelo vento e mar. Local icónico para fotografia e observação do pôr do sol.',
      province: 'Namibe',
      city: 'Namibe',
      address: 'Costa do Namibe',
      latitude: -15.1500,
      longitude: 12.1000,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      rating: 4.4,
      priceRange: 'low',
      bestTimeToVisit: 'Todo o ano',
      activities: ['Fotografia', 'Observação de Paisagem', 'Caminhada'],
      isActive: true,
    },

    // ========== MALANJE ==========
    {
      name: 'Quedas de Kalandula',
      description: 'Segundas maiores quedas de água de África com 105 metros de altura e 400 metros de largura. Espetáculo natural impressionante especialmente na época das chuvas.',
      province: 'Malanje',
      city: 'Kalandula',
      address: 'Rio Lucala, 80 km de Malanje',
      latitude: -9.3167,
      longitude: 15.8833,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800',
      rating: 4.9,
      priceRange: 'low',
      bestTimeToVisit: 'Novembro a Abril',
      activities: ['Fotografia', 'Caminhada', 'Piquenique', 'Observação de Natureza'],
      isActive: true,
    },
    {
      name: 'Pedras Negras de Pungo Andongo',
      description: 'Conjunto de formações rochosas gigantes de granito negro que se erguem majestosamente na savana. Paisagem mística com valor histórico e cultural.',
      province: 'Malanje',
      city: 'Pungo Andongo',
      address: 'Pungo Andongo, Malanje',
      latitude: -9.6833,
      longitude: 15.4833,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      rating: 4.7,
      priceRange: 'low',
      bestTimeToVisit: 'Maio a Outubro',
      activities: ['Fotografia', 'Escalada', 'Cultura', 'Caminhada'],
      isActive: true,
    },

    // ========== HUAMBO ==========
    {
      name: 'Monte Moco',
      description: 'Ponto mais alto de Angola com 2620 metros de altitude. Clima fresco, florestas de neblina e biodiversidade única. Ideal para trekking e observação de aves.',
      province: 'Huambo',
      city: 'Londuimbali',
      address: 'Serra do Moco, 40 km de Huambo',
      latitude: -12.4833,
      longitude: 15.1833,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
      rating: 4.6,
      priceRange: 'medium',
      bestTimeToVisit: 'Maio a Setembro',
      activities: ['Trekking', 'Observação de Aves', 'Fotografia', 'Acampamento'],
      isActive: true,
    },
    {
      name: 'Cidade do Huambo',
      description: 'Segunda maior cidade de Angola, conhecida como "Cidade das Acácias". Clima temperado, arquitetura colonial e rica história cultural.',
      province: 'Huambo',
      city: 'Huambo',
      address: 'Huambo',
      latitude: -12.7767,
      longitude: 15.7389,
      category: 'Cidade',
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
      rating: 4.1,
      priceRange: 'medium',
      bestTimeToVisit: 'Todo o ano',
      activities: ['Cultura', 'História', 'Gastronomia', 'Compras'],
      isActive: true,
    },

    // ========== CABINDA ==========
    {
      name: 'Floresta do Maiombe',
      description: 'Floresta tropical densa e biodiversa, parte da segunda maior floresta tropical de África. Habitat de gorilas, chimpanzés e espécies endémicas.',
      province: 'Cabinda',
      city: 'Cabinda',
      address: 'Norte de Cabinda',
      latitude: -4.8833,
      longitude: 12.5667,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
      rating: 4.5,
      priceRange: 'medium',
      bestTimeToVisit: 'Junho a Setembro',
      activities: ['Ecoturismo', 'Observação de Fauna', 'Trekking', 'Fotografia'],
      isActive: true,
    },
    {
      name: 'Praias de Cabinda',
      description: 'Costa atlântica tropical com praias virgens, coqueiros e águas mornas. Destaque para Praia de Lândana e Praia de Massabi.',
      province: 'Cabinda',
      city: 'Cabinda',
      address: 'Costa de Cabinda',
      latitude: -5.5500,
      longitude: 12.2000,
      category: 'Praia',
      imageUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
      rating: 4.3,
      priceRange: 'medium',
      bestTimeToVisit: 'Junho a Setembro',
      activities: ['Praia', 'Pesca', 'Relaxamento', 'Desportos Aquáticos'],
      isActive: true,
    },

    // ========== BIÉ ==========
    {
      name: 'Nascente do Rio Zambeze',
      description: 'Local onde nasce o quarto maior rio de África. Área de grande importância ecológica e histórica, com paisagens de savana e bosques.',
      province: 'Bié',
      city: 'Kalene Hill',
      address: 'Planalto do Bié',
      latitude: -11.3500,
      longitude: 17.5833,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      rating: 4.4,
      priceRange: 'low',
      bestTimeToVisit: 'Abril a Setembro',
      activities: ['Fotografia', 'Educação', 'Caminhada', 'Observação de Natureza'],
      isActive: true,
    },

    // ========== MOXICO ==========
    {
      name: 'Parque Nacional da Cameia',
      description: 'Parque nacional com lagoas interligadas, vida selvagem abundante e paisagens de savana. Habitat de antílopes, zebras e aves aquáticas.',
      province: 'Moxico',
      city: 'Luena',
      address: 'Cameia, Moxico',
      latitude: -11.7500,
      longitude: 20.8333,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      rating: 4.5,
      priceRange: 'medium',
      bestTimeToVisit: 'Maio a Outubro',
      activities: ['Safari', 'Observação de Fauna', 'Fotografia', 'Acampamento'],
      isActive: true,
    },

    // ========== ZAIRE ==========
    {
      name: 'Quedas de Yélala',
      description: 'Quedas de água espetaculares no Rio Congo. Local histórico onde os exploradores europeus terminavam suas navegações fluviais.',
      province: 'Zaire',
      city: 'Nzeto',
      address: 'Rio Congo, Zaire',
      latitude: -5.7833,
      longitude: 12.8667,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
      rating: 4.3,
      priceRange: 'low',
      bestTimeToVisit: 'Novembro a Abril',
      activities: ['Fotografia', 'História', 'Caminhada', 'Observação de Natureza'],
      isActive: true,
    },

    // ========== UÍGE ==========
    {
      name: 'Plantações de Café do Uíge',
      description: 'Vastas plantações de café arábica em região montanhosa. Turismo rural com visitas às fazendas, degustação e aprendizado sobre produção de café.',
      province: 'Uíge',
      city: 'Uíge',
      address: 'Planalto do Uíge',
      latitude: -7.6089,
      longitude: 15.0614,
      category: 'Rural',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
      rating: 4.2,
      priceRange: 'medium',
      bestTimeToVisit: 'Maio a Setembro',
      activities: ['Agroturismo', 'Degustação', 'Cultura', 'Fotografia'],
      isActive: true,
    },

    // ========== CUANDO CUBANGO ==========
    {
      name: 'Parque Nacional do Mavinga',
      description: 'Um dos maiores parques nacionais de África, parte do complexo KAZA. Vida selvagem espetacular incluindo elefantes, leões e licaões.',
      province: 'Cuando Cubango',
      city: 'Mavinga',
      address: 'Cuando Cubango',
      latitude: -15.5333,
      longitude: 19.5000,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
      rating: 4.7,
      priceRange: 'high',
      bestTimeToVisit: 'Maio a Outubro',
      activities: ['Safari', 'Observação de Fauna', 'Fotografia', 'Acampamento'],
      isActive: true,
    },

    // ========== CUNENE ==========
    {
      name: 'Quedas de Ruacaná',
      description: 'Quedas de água na fronteira com a Namíbia, com 120 metros de altura. Cenário dramático especialmente na época das cheias.',
      province: 'Cunene',
      city: 'Ruacaná',
      address: 'Rio Cunene, fronteira Angola-Namíbia',
      latitude: -17.4167,
      longitude: 14.2000,
      category: 'Natureza',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      rating: 4.4,
      priceRange: 'low',
      bestTimeToVisit: 'Fevereiro a Abril',
      activities: ['Fotografia', 'Observação de Paisagem', 'Caminhada'],
      isActive: true,
    },

    // ========== LUNDA NORTE ==========
    {
      name: 'Minas de Diamantes',
      description: 'Visitas educacionais às zonas diamantíferas de Angola. Museu do Diamante e história da mineração na região.',
      province: 'Lunda Norte',
      city: 'Lucapa',
      address: 'Lucapa',
      latitude: -8.4167,
      longitude: 20.7333,
      category: 'Cultural',
      imageUrl: 'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?w=800',
      rating: 4.0,
      priceRange: 'medium',
      bestTimeToVisit: 'Maio a Setembro',
      activities: ['Educação', 'História', 'Cultura', 'Museu'],
      isActive: true,
    },
  ];

  console.log(`\n📍 Criando ${destinations.length} destinos turísticos...\n`);

  let created = 0;
  const batchSize = 10;

  for (let i = 0; i < destinations.length; i += batchSize) {
    const batch = destinations.slice(i, i + batchSize);
    
    const createdDestinations = await Promise.all(
      batch.map(async (destData) => {
        try {
          const destination = await prisma.destination.create({
            data: destData,
          });
          created++;
          return destination;
        } catch (error) {
          console.log(`   ⚠️  Destino "${destData.name}" já existe ou erro, pulando...`);
          return null;
        }
      })
    );

    const successCount = createdDestinations.filter(d => d !== null).length;
    if (successCount > 0) {
      console.log(`   ✅ Batch ${Math.floor(i / batchSize) + 1}: ${successCount} destinos criados`);
    }
  }

  console.log(`\n✅ Total criado: ${created} destinos\n`);

  // Estatísticas por categoria
  console.log('📊 Estatísticas por Categoria:\n');

  const categories = await prisma.destination.groupBy({
    by: ['category'],
    _count: true,
  });

  categories.forEach(cat => {
    console.log(`   ${cat.category}: ${cat._count} destinos`);
  });

  console.log('\n📊 Estatísticas por Província:\n');

  const provinces = await prisma.destination.groupBy({
    by: ['province'],
    _count: true,
    orderBy: {
      _count: {
        province: 'desc',
      },
    },
  });

  provinces.forEach(prov => {
    console.log(`   ${prov.province}: ${prov._count} destinos`);
  });

  // Top 10 destinos por rating
  console.log('\n\n⭐ Top 10 Destinos por Avaliação:\n');

  const topDestinations = await prisma.destination.findMany({
    orderBy: {
      rating: 'desc',
    },
    take: 10,
    select: {
      name: true,
      province: true,
      rating: true,
      category: true,
    },
  });

  topDestinations.forEach((dest, idx) => {
    console.log(`   ${idx + 1}. ${dest.name} (${dest.province})`);
    console.log(`      ⭐ ${dest.rating} | ${dest.category}\n`);
  });

  console.log('='.repeat(70));
  console.log('\n💡 Próximos Passos:\n');
  console.log('   • Popular reviews (avaliações de usuários)');
  console.log('   • Popular favorites (destinos favoritos)');
  console.log('   • Popular recommendations_log (recomendações ML)');
  console.log('   • Criar trips (viagens planejadas)\n');
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
