import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('👥 Populando Usuários para Treinamento de ML...\n');
  console.log('='.repeat(70));

  // Senha padrão para todos
  const password = 'teste123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const users = [
    // ========== ADMINISTRADORES ==========
    {
      name: 'Admin Principal',
      email: 'admin@wenda.ao',
      role: UserRole.admin,
      phone: '+244 923 456 789',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Gestor de Turismo',
      email: 'gestor@wenda.ao',
      role: UserRole.admin,
      phone: '+244 923 456 790',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
    },

    // ========== TURISTAS ESTRANGEIROS - Alta Renda ==========
    {
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      role: UserRole.user,
      phone: '+1 555 123 4567',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
    },
    {
      name: 'Maria Silva',
      email: 'maria.silva@hotmail.com',
      role: UserRole.user,
      phone: '+351 912 345 678',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    {
      name: 'Pierre Dubois',
      email: 'pierre.dubois@gmail.com',
      role: UserRole.user,
      phone: '+33 6 12 34 56 78',
      avatarUrl: 'https://i.pravatar.cc/150?img=13',
    },
    {
      name: 'Hans Mueller',
      email: 'hans.mueller@gmail.com',
      role: UserRole.user,
      phone: '+49 151 23456789',
      avatarUrl: 'https://i.pravatar.cc/150?img=14',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@yahoo.com',
      role: UserRole.user,
      phone: '+44 7700 900123',
      avatarUrl: 'https://i.pravatar.cc/150?img=15',
    },

    // ========== TURISTAS NACIONAIS - Classe Média Alta ==========
    {
      name: 'António Manuel',
      email: 'antonio.manuel@gmail.com',
      role: UserRole.user,
      phone: '+244 923 111 222',
      avatarUrl: 'https://i.pravatar.cc/150?img=21',
    },
    {
      name: 'Luísa Fernandes',
      email: 'luisa.fernandes@hotmail.com',
      role: UserRole.user,
      phone: '+244 923 222 333',
      avatarUrl: 'https://i.pravatar.cc/150?img=22',
    },
    {
      name: 'Carlos Eduardo',
      email: 'carlos.eduardo@gmail.com',
      role: UserRole.user,
      phone: '+244 923 333 444',
      avatarUrl: 'https://i.pravatar.cc/150?img=23',
    },
    {
      name: 'Ana Paula',
      email: 'ana.paula@outlook.com',
      role: UserRole.user,
      phone: '+244 923 444 555',
      avatarUrl: 'https://i.pravatar.cc/150?img=24',
    },

    // ========== TURISTAS NACIONAIS - Classe Média ==========
    {
      name: 'José Pedro',
      email: 'jose.pedro@gmail.com',
      role: UserRole.user,
      phone: '+244 923 555 666',
      avatarUrl: 'https://i.pravatar.cc/150?img=31',
    },
    {
      name: 'Isabel Costa',
      email: 'isabel.costa@hotmail.com',
      role: UserRole.user,
      phone: '+244 923 666 777',
      avatarUrl: 'https://i.pravatar.cc/150?img=32',
    },
    {
      name: 'Miguel Santos',
      email: 'miguel.santos@gmail.com',
      role: UserRole.user,
      phone: '+244 923 777 888',
      avatarUrl: 'https://i.pravatar.cc/150?img=33',
    },
    {
      name: 'Teresa Alves',
      email: 'teresa.alves@outlook.com',
      role: UserRole.user,
      phone: '+244 923 888 999',
      avatarUrl: 'https://i.pravatar.cc/150?img=34',
    },

    // ========== TURISTAS JOVENS (18-25) - Aventureiros ==========
    {
      name: 'Rafael Cardoso',
      email: 'rafael.cardoso@gmail.com',
      role: UserRole.user,
      phone: '+244 924 111 222',
      avatarUrl: 'https://i.pravatar.cc/150?img=41',
    },
    {
      name: 'Beatriz Mendes',
      email: 'beatriz.mendes@hotmail.com',
      role: UserRole.user,
      phone: '+244 924 222 333',
      avatarUrl: 'https://i.pravatar.cc/150?img=42',
    },
    {
      name: 'David Johnson',
      email: 'david.j@gmail.com',
      role: UserRole.user,
      phone: '+1 555 987 6543',
      avatarUrl: 'https://i.pravatar.cc/150?img=43',
    },
    {
      name: 'Emma Brown',
      email: 'emma.brown@yahoo.com',
      role: UserRole.user,
      phone: '+44 7700 900456',
      avatarUrl: 'https://i.pravatar.cc/150?img=44',
    },

    // ========== TURISTAS SENIORES (55+) - Cultura e Natureza ==========
    {
      name: 'Manuel Rodrigues',
      email: 'manuel.rodrigues@gmail.com',
      role: UserRole.user,
      phone: '+244 925 111 222',
      avatarUrl: 'https://i.pravatar.cc/150?img=51',
    },
    {
      name: 'Rosa Maria',
      email: 'rosa.maria@hotmail.com',
      role: UserRole.user,
      phone: '+244 925 222 333',
      avatarUrl: 'https://i.pravatar.cc/150?img=52',
    },
    {
      name: 'Robert Williams',
      email: 'robert.w@gmail.com',
      role: UserRole.user,
      phone: '+1 555 456 7890',
      avatarUrl: 'https://i.pravatar.cc/150?img=53',
    },
    {
      name: 'Elizabeth Taylor',
      email: 'elizabeth.t@yahoo.com',
      role: UserRole.user,
      phone: '+44 7700 900789',
      avatarUrl: 'https://i.pravatar.cc/150?img=54',
    },

    // ========== TURISTAS FAMÍLIAS ==========
    {
      name: 'Paulo e Família',
      email: 'paulo.familia@gmail.com',
      role: UserRole.user,
      phone: '+244 926 111 222',
      avatarUrl: 'https://i.pravatar.cc/150?img=61',
    },
    {
      name: 'Marta Família',
      email: 'marta.familia@hotmail.com',
      role: UserRole.user,
      phone: '+244 926 222 333',
      avatarUrl: 'https://i.pravatar.cc/150?img=62',
    },
    {
      name: 'Thomas Family',
      email: 'thomas.family@gmail.com',
      role: UserRole.user,
      phone: '+1 555 321 6547',
      avatarUrl: 'https://i.pravatar.cc/150?img=63',
    },

    // ========== TURISTAS NEGÓCIOS ==========
    {
      name: 'Fernando Costa',
      email: 'fernando.costa@empresa.ao',
      role: UserRole.user,
      phone: '+244 927 111 222',
      avatarUrl: 'https://i.pravatar.cc/150?img=71',
    },
    {
      name: 'Patricia Gomes',
      email: 'patricia.gomes@corp.ao',
      role: UserRole.user,
      phone: '+244 927 222 333',
      avatarUrl: 'https://i.pravatar.cc/150?img=72',
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@business.com',
      role: UserRole.user,
      phone: '+86 138 1234 5678',
      avatarUrl: 'https://i.pravatar.cc/150?img=73',
    },
    {
      name: 'James Anderson',
      email: 'james.anderson@corp.com',
      role: UserRole.user,
      phone: '+1 555 789 4561',
      avatarUrl: 'https://i.pravatar.cc/150?img=74',
    },

    // ========== TURISTAS AFRICANOS - PALOP ==========
    {
      name: 'João Cabral',
      email: 'joao.cabral@gmail.com',
      role: UserRole.user,
      phone: '+238 991 234 567',
      avatarUrl: 'https://i.pravatar.cc/150?img=81',
    },
    {
      name: 'Amara Diallo',
      email: 'amara.diallo@gmail.com',
      role: UserRole.user,
      phone: '+245 955 123 456',
      avatarUrl: 'https://i.pravatar.cc/150?img=82',
    },
    {
      name: 'Kwame Mensah',
      email: 'kwame.mensah@gmail.com',
      role: UserRole.user,
      phone: '+233 244 567 890',
      avatarUrl: 'https://i.pravatar.cc/150?img=83',
    },

    // ========== TURISTAS MOCHILEIROS - Budget ==========
    {
      name: 'Lucas Vieira',
      email: 'lucas.vieira@gmail.com',
      role: UserRole.user,
      phone: '+244 928 111 222',
      avatarUrl: 'https://i.pravatar.cc/150?img=91',
    },
    {
      name: 'Sofia Martins',
      email: 'sofia.martins@gmail.com',
      role: UserRole.user,
      phone: '+244 928 222 333',
      avatarUrl: 'https://i.pravatar.cc/150?img=92',
    },
    {
      name: 'Alex Turner',
      email: 'alex.turner@gmail.com',
      role: UserRole.user,
      phone: '+61 412 345 678',
      avatarUrl: 'https://i.pravatar.cc/150?img=93',
    },
    {
      name: 'Nina Larsson',
      email: 'nina.larsson@gmail.com',
      role: UserRole.user,
      phone: '+46 70 123 4567',
      avatarUrl: 'https://i.pravatar.cc/150?img=94',
    },

    // ========== TURISTAS LUXO - Premium ==========
    {
      name: 'Ricardo Sousa',
      email: 'ricardo.sousa@vip.ao',
      role: UserRole.user,
      phone: '+244 929 111 222',
      avatarUrl: 'https://i.pravatar.cc/150?img=101',
    },
    {
      name: 'Gabriela Santos',
      email: 'gabriela.santos@premium.ao',
      role: UserRole.user,
      phone: '+244 929 222 333',
      avatarUrl: 'https://i.pravatar.cc/150?img=102',
    },
    {
      name: 'William Peterson',
      email: 'william.p@luxury.com',
      role: UserRole.user,
      phone: '+1 555 999 8888',
      avatarUrl: 'https://i.pravatar.cc/150?img=103',
    },
    {
      name: 'Victoria Laurent',
      email: 'victoria.l@deluxe.fr',
      role: UserRole.user,
      phone: '+33 6 99 88 77 66',
      avatarUrl: 'https://i.pravatar.cc/150?img=104',
    },
  ];

  console.log(`\n🔐 Senha padrão para todos: ${password}\n`);
  console.log('📊 Criando usuários por segmento:\n');

  let created = 0;
  const batchSize = 10;

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    
    const createdUsers = await Promise.all(
      batch.map(async (userData) => {
        try {
          const user = await prisma.user.create({
            data: {
              ...userData,
              passwordHash: hashedPassword,
            },
          });
          created++;
          return user;
        } catch (error) {
          console.log(`   ⚠️  Usuário ${userData.email} já existe, pulando...`);
          return null;
        }
      })
    );

    const successCount = createdUsers.filter(u => u !== null).length;
    if (successCount > 0) {
      console.log(`   ✅ Batch ${Math.floor(i / batchSize) + 1}: ${successCount} usuários criados`);
    }
  }

  console.log(`\n✅ Total criado: ${created} usuários\n`);

  // Estatísticas por tipo
  console.log('📊 Estatísticas por Segmento:\n');

  const adminCount = await prisma.user.count({ where: { role: UserRole.admin } });
  const userCount = await prisma.user.count({ where: { role: UserRole.user } });

  console.log(`   👔 Administradores: ${adminCount}`);
  console.log(`   👥 Usuários: ${userCount}`);
  console.log(`   📧 Total: ${adminCount + userCount}\n`);

  // Exemplos de usuários criados por categoria
  console.log('📋 Exemplos de Usuários por Categoria:\n');

  const categories = [
    { name: '🌍 Turistas Estrangeiros', emails: ['john.smith@gmail.com', 'maria.silva@hotmail.com', 'pierre.dubois@gmail.com'] },
    { name: '🇦🇴 Turistas Nacionais', emails: ['antonio.manuel@gmail.com', 'jose.pedro@gmail.com', 'miguel.santos@gmail.com'] },
    { name: '🎒 Jovens Aventureiros', emails: ['rafael.cardoso@gmail.com', 'david.j@gmail.com'] },
    { name: '👴 Seniores', emails: ['manuel.rodrigues@gmail.com', 'robert.w@gmail.com'] },
    { name: '👨‍👩‍👧‍👦 Famílias', emails: ['paulo.familia@gmail.com', 'thomas.family@gmail.com'] },
    { name: '💼 Negócios', emails: ['fernando.costa@empresa.ao', 'michael.chen@business.com'] },
    { name: '🌍 Africanos PALOP', emails: ['joao.cabral@gmail.com', 'amara.diallo@gmail.com'] },
    { name: '🎒 Mochileiros', emails: ['lucas.vieira@gmail.com', 'alex.turner@gmail.com'] },
    { name: '💎 Turistas Luxo', emails: ['ricardo.sousa@vip.ao', 'william.p@luxury.com'] },
  ];

  for (const category of categories) {
    console.log(`   ${category.name}:`);
    const users = await prisma.user.findMany({
      where: { email: { in: category.emails } },
      select: { name: true, email: true, phone: true },
    });
    users.forEach(u => {
      console.log(`      - ${u.name} (${u.email})`);
    });
    console.log();
  }

  console.log('='.repeat(70));
  console.log('\n💡 Uso para ML:\n');
  console.log('   • Segmentação de usuários por comportamento');
  console.log('   • Recomendações personalizadas por perfil');
  console.log('   • Análise de preferências por grupo demográfico');
  console.log('   • Predição de destinos favoritos por segmento');
  console.log('   • Otimização de campanhas por público-alvo\n');
  
  console.log('🔑 Credenciais de Acesso:\n');
  console.log('   Admin: admin@wenda.ao / teste123');
  console.log('   Gestor: gestor@wenda.ao / teste123');
  console.log('   Usuário exemplo: john.smith@gmail.com / teste123\n');
}

async function main() {
  try {
    await seedUsers();
  } catch (error) {
    console.error('❌ Erro ao popular usuários:', error);
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
