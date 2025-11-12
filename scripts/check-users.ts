import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  console.log('👥 Verificando Usuários no Banco de Dados...\n');
  console.log('='.repeat(70));

  const totalUsers = await prisma.user.count();
  const adminUsers = await prisma.user.count({ where: { role: 'admin' } });
  const regularUsers = await prisma.user.count({ where: { role: 'user' } });

  console.log('\n📊 Estatísticas Gerais:\n');
  console.log(`   Total de Usuários: ${totalUsers}`);
  console.log(`   👔 Administradores: ${adminUsers}`);
  console.log(`   👥 Usuários Regulares: ${regularUsers}\n`);

  // Listar todos os usuários
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log('📋 Lista de Usuários:\n');
  
  // Agrupar por role
  const admins = allUsers.filter(u => u.role === 'admin');
  const users = allUsers.filter(u => u.role === 'user');

  if (admins.length > 0) {
    console.log('   👔 ADMINISTRADORES:\n');
    admins.forEach((u, idx) => {
      console.log(`      ${idx + 1}. ${u.name}`);
      console.log(`         Email: ${u.email}`);
      console.log(`         Phone: ${u.phone || 'N/A'}`);
      console.log(`         ID: ${u.id}`);
      console.log();
    });
  }

  if (users.length > 0) {
    console.log('   👥 USUÁRIOS:\n');
    users.forEach((u, idx) => {
      console.log(`      ${idx + 1}. ${u.name}`);
      console.log(`         Email: ${u.email}`);
      console.log(`         Phone: ${u.phone || 'N/A'}`);
      console.log(`         ID: ${u.id}`);
      console.log();
    });
  }

  console.log('='.repeat(70));
  console.log('\n✅ Verificação concluída!\n');
}

async function main() {
  try {
    await checkUsers();
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
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
