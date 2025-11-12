import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface EndpointTest {
  method: string;
  path: string;
  description: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  body?: any;
}

const endpoints: EndpointTest[] = [
  // ========== HEALTH ==========
  { method: 'GET', path: '/api/health', description: '🏥 Health Check' },
  { method: 'GET', path: '/api/health/database', description: '🏥 Database Health' },

  // ========== AUTH ==========
  { method: 'POST', path: '/api/auth/register', description: '🔐 Register User', body: { name: 'Test', email: 'test@test.com', password: 'test123', confirmPassword: 'test123' } },
  { method: 'POST', path: '/api/auth/login', description: '🔐 Login User', body: { email: 'test@test.com', password: 'test123' } },
  { method: 'GET', path: '/api/auth/profile', description: '🔐 Get Profile', requiresAuth: true },
  { method: 'PUT', path: '/api/auth/profile', description: '🔐 Update Profile', requiresAuth: true, body: { name: 'Updated' } },

  // ========== USERS ==========
  { method: 'GET', path: '/api/users', description: '👥 List Users (Admin)', requiresAuth: true, requiresAdmin: true },
  { method: 'GET', path: '/api/users/:id', description: '👥 Get User by ID', requiresAuth: true },
  { method: 'PUT', path: '/api/users/:id', description: '👥 Update User (Admin)', requiresAuth: true, requiresAdmin: true, body: { name: 'Updated' } },
  { method: 'DELETE', path: '/api/users/:id', description: '👥 Delete User (Admin)', requiresAuth: true, requiresAdmin: true },

  // ========== CATEGORIES ==========
  { method: 'GET', path: '/api/categories', description: '🏷️ List Categories' },
  { method: 'GET', path: '/api/categories/:id', description: '🏷️ Get Category by ID' },
  { method: 'POST', path: '/api/categories', description: '🏷️ Create Category (Admin)', requiresAuth: true, requiresAdmin: true, body: { name: 'Test', slug: 'test', description: 'Test' } },
  { method: 'PUT', path: '/api/categories/:id', description: '🏷️ Update Category (Admin)', requiresAuth: true, requiresAdmin: true, body: { name: 'Updated' } },
  { method: 'DELETE', path: '/api/categories/:id', description: '🏷️ Delete Category (Admin)', requiresAuth: true, requiresAdmin: true },

  // ========== DESTINATIONS ==========
  { method: 'GET', path: '/api/destinations', description: '🏝️ List Destinations' },
  { method: 'GET', path: '/api/destinations/:id', description: '🏝️ Get Destination by ID' },
  { method: 'POST', path: '/api/destinations', description: '🏝️ Create Destination (Admin)', requiresAuth: true, requiresAdmin: true, body: { name: 'Test', slug: 'test', description: 'Test', location: 'Test', province: 'Test', categoryId: 'uuid', latitude: 0, longitude: 0 } },
  { method: 'PUT', path: '/api/destinations/:id', description: '🏝️ Update Destination (Admin)', requiresAuth: true, requiresAdmin: true, body: { name: 'Updated' } },
  { method: 'DELETE', path: '/api/destinations/:id', description: '🏝️ Delete Destination (Admin)', requiresAuth: true, requiresAdmin: true },

  // ========== REVIEWS ==========
  { method: 'GET', path: '/api/reviews', description: '⭐ List All Reviews' },
  { method: 'GET', path: '/api/reviews/destination/:destinationId', description: '⭐ Get Reviews by Destination' },
  { method: 'POST', path: '/api/reviews', description: '⭐ Create Review', requiresAuth: true, body: { destinationId: 'uuid', rating: 5, comment: 'Test' } },
  { method: 'PUT', path: '/api/reviews/:id', description: '⭐ Update Review', requiresAuth: true, body: { rating: 4 } },
  { method: 'DELETE', path: '/api/reviews/:id', description: '⭐ Delete Review', requiresAuth: true },
  { method: 'POST', path: '/api/reviews/:id/helpful', description: '⭐ Mark Review as Helpful', requiresAuth: true },

  // ========== FAVORITES ==========
  { method: 'GET', path: '/api/favorites', description: '❤️ List User Favorites', requiresAuth: true },
  { method: 'POST', path: '/api/favorites', description: '❤️ Add to Favorites', requiresAuth: true, body: { destinationId: 'uuid' } },
  { method: 'DELETE', path: '/api/favorites/:id', description: '❤️ Remove from Favorites', requiresAuth: true },
  { method: 'GET', path: '/api/favorites/check/:destinationId', description: '❤️ Check if Favorited', requiresAuth: true },

  // ========== TRIPS ==========
  { method: 'GET', path: '/api/trips', description: '✈️ List User Trips', requiresAuth: true },
  { method: 'GET', path: '/api/trips/:id', description: '✈️ Get Trip by ID', requiresAuth: true },
  { method: 'POST', path: '/api/trips', description: '✈️ Create Trip', requiresAuth: true, body: { title: 'Test Trip', startDate: '2025-12-01', endDate: '2025-12-10' } },
  { method: 'PUT', path: '/api/trips/:id', description: '✈️ Update Trip', requiresAuth: true, body: { title: 'Updated' } },
  { method: 'DELETE', path: '/api/trips/:id', description: '✈️ Delete Trip', requiresAuth: true },
  { method: 'POST', path: '/api/trips/:id/destinations', description: '✈️ Add Destination to Trip', requiresAuth: true, body: { destinationId: 'uuid' } },
  { method: 'DELETE', path: '/api/trips/:tripId/destinations/:destinationId', description: '✈️ Remove Destination from Trip', requiresAuth: true },
];

async function checkEndpoint(endpoint: EndpointTest): Promise<boolean> {
  try {
    const config: any = {
      method: endpoint.method,
      url: `${BASE_URL}${endpoint.path}`,
      validateStatus: () => true, // Don't throw on any status
    };

    if (endpoint.body) {
      config.data = endpoint.body;
    }

    if (endpoint.requiresAuth) {
      config.headers = {
        Authorization: 'Bearer fake-token-for-testing',
      };
    }

    const response = await axios(config);

    // Considerar sucesso se não for 404 (endpoint existe)
    const exists = response.status !== 404;
    
    const statusSymbol = 
      response.status === 200 || response.status === 201 ? '✅' :
      response.status === 401 || response.status === 403 ? '🔒' :
      response.status === 400 ? '⚠️' :
      response.status === 404 ? '❌' :
      '⚡';

    console.log(`${statusSymbol} [${response.status}] ${endpoint.method.padEnd(6)} ${endpoint.path.padEnd(50)} - ${endpoint.description}`);
    
    return exists;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`❌ [---] ${endpoint.method.padEnd(6)} ${endpoint.path.padEnd(50)} - ${endpoint.description} (Server not running)`);
      return false;
    }
    console.log(`❌ [ERR] ${endpoint.method.padEnd(6)} ${endpoint.path.padEnd(50)} - ${endpoint.description}`);
    return false;
  }
}

async function checkAllEndpoints() {
  console.log('\n🔍 Verificando Endpoints da API...\n');
  console.log('='.repeat(120));
  console.log('\n📡 Base URL:', BASE_URL);
  console.log('\n✅ = Sucesso | 🔒 = Requer Autenticação | ⚠️ = Bad Request | ❌ = Não Encontrado | ⚡ = Outro Status\n');
  console.log('='.repeat(120));
  console.log();

  // Buscar IDs reais para substituir placeholders
  let categoryId = ':id';
  let destinationId = ':destinationId';
  
  try {
    const categoriesRes = await axios.get(`${BASE_URL}/api/categories`);
    if (categoriesRes.data?.data?.[0]?.id) {
      categoryId = categoriesRes.data.data[0].id;
    }
  } catch (e) {
    console.log('⚠️ Não foi possível buscar category ID real');
  }

  try {
    const destinationsRes = await axios.get(`${BASE_URL}/api/destinations`);
    if (destinationsRes.data?.data?.[0]?.id) {
      destinationId = destinationsRes.data.data[0].id;
    }
  } catch (e) {
    console.log('⚠️ Não foi possível buscar destination ID real');
  }

  let total = 0;
  let existing = 0;
  let notFound = 0;

  for (const endpoint of endpoints) {
    total++;
    
    // Substituir placeholders por IDs reais
    let testEndpoint = { ...endpoint };
    testEndpoint.path = testEndpoint.path
      .replace('/categories/:id', `/categories/${categoryId}`)
      .replace('/destinations/:id', `/destinations/${destinationId}`)
      .replace('/destination/:destinationId', `/destination/${destinationId}`)
      .replace(':destinationId', destinationId);
    
    const exists = await checkEndpoint(testEndpoint);
    if (exists) {
      existing++;
    } else {
      notFound++;
    }
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('\n' + '='.repeat(120));
  console.log('\n📊 Resumo:\n');
  console.log(`   Total de Endpoints: ${total}`);
  console.log(`   ✅ Existentes: ${existing}`);
  console.log(`   ❌ Não Encontrados: ${notFound}`);
  console.log(`   📈 Taxa de Sucesso: ${((existing / total) * 100).toFixed(1)}%`);
  console.log('\n' + '='.repeat(120));

  if (notFound > 0) {
    console.log('\n⚠️ ATENÇÃO: Alguns endpoints não foram encontrados!');
    console.log('   Verifique se o servidor está rodando e se as rotas estão registradas corretamente.\n');
  } else {
    console.log('\n✅ Todos os endpoints estão registrados!\n');
  }
}

checkAllEndpoints().catch(console.error);
