require('dotenv').config({ path: '.env.test' });

// Configurações do ambiente de teste
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

// Configurações do banco de dados de teste
process.env.DB_NAME = 'sistenfrota_test';

// Aumenta o timeout dos testes
jest.setTimeout(10000);

// Limpa todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
}); 