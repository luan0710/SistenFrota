const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/models');
const { sequelize } = require('../../src/models');
const mailService = require('../../src/services/mail.service');

jest.mock('../../src/services/mail.service', () => ({
  sendPasswordRecoveryEmail: jest.fn().mockResolvedValue(true),
  sendPasswordChangedEmail: jest.fn().mockResolvedValue(true)
}));

describe('Rotas de Autenticação', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Recria as tabelas
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ where: {} }); // Limpa a tabela de usuários
  });

  describe('POST /api/auth/register', () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    it('deve registrar um novo usuário', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('email', validUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('deve retornar erro para email duplicado', async () => {
      await User.create(validUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Usuário já existe');
    });

    it('deve validar campos obrigatórios', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('deve rejeitar credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong_password'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('deve bloquear após múltiplas tentativas', async () => {
      const attemptLogin = () => 
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrong_password'
          });

      // Faz 3 tentativas falhas
      for (let i = 0; i < 3; i++) {
        await attemptLogin();
      }

      // A quarta tentativa deve ser bloqueada
      const response = await attemptLogin();

      expect(response.status).toBe(429);
      expect(response.body.error).toContain('Muitas tentativas de login');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('deve enviar email de recuperação', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(mailService.sendPasswordRecoveryEmail).toHaveBeenCalled();
    });

    it('deve retornar mensagem genérica para email não existente', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(mailService.sendPasswordRecoveryEmail).not.toHaveBeenCalled();
    });
  });

  describe('Rotas protegidas', () => {
    let token;
    let user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      token = loginResponse.body.token;
    });

    it('deve acessar rota protegida com token válido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', user.email);
    });

    it('deve rejeitar acesso sem token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('deve rejeitar token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 