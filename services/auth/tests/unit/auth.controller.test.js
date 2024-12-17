const AuthController = require('../../src/controllers/auth.controller');
const { User } = require('../../src/models');
const mailService = require('../../src/services/mail.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock do modelo User
jest.mock('../../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  }
}));

// Mock do serviço de email
jest.mock('../../src/services/mail.service', () => ({
  sendPasswordRecoveryEmail: jest.fn(),
  sendPasswordChangedEmail: jest.fn()
}));

describe('AuthController', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock do objeto de resposta
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    beforeEach(() => {
      req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        }
      };
    });

    it('deve criar um novo usuário com sucesso', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      await AuthController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: mockUser,
          token: expect.any(String),
          refreshToken: expect.any(String)
        })
      );
    });

    it('deve retornar erro se o usuário já existir', async () => {
      User.findOne.mockResolvedValue({ id: 1 });

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Usuário já existe'
      });
    });

    it('deve validar campos obrigatórios', async () => {
      req.body = {};

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Todos os campos são obrigatórios'
      });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
    });

    it('deve fazer login com sucesso', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        active: true,
        checkPassword: function(password) {
          return bcrypt.compare(password, this.password);
        }
      };

      User.findOne.mockResolvedValue(mockUser);

      await AuthController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.any(Object),
          token: expect.any(String),
          refreshToken: expect.any(String)
        })
      );
    });

    it('deve bloquear após múltiplas tentativas falhas', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('different_password', 10),
        active: true,
        checkPassword: function(password) {
          return bcrypt.compare(password, this.password);
        }
      };

      User.findOne.mockResolvedValue(mockUser);

      // Simula 3 tentativas falhas
      for (let i = 0; i < 3; i++) {
        await AuthController.login(req, res);
      }

      // Quarta tentativa deve ser bloqueada
      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.stringContaining('Muitas tentativas de login')
      });
    });
  });

  describe('forgotPassword', () => {
    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com'
        }
      };
    });

    it('deve enviar email de recuperação com sucesso', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        save: jest.fn()
      };

      User.findOne.mockResolvedValue(mockUser);
      mailService.sendPasswordRecoveryEmail.mockResolvedValue(true);

      await AuthController.forgotPassword(req, res);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mailService.sendPasswordRecoveryEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining('instruções de recuperação')
      });
    });

    it('deve manter mensagem genérica quando email não existe', async () => {
      User.findOne.mockResolvedValue(null);

      await AuthController.forgotPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining('instruções de recuperação')
      });
      expect(mailService.sendPasswordRecoveryEmail).not.toHaveBeenCalled();
    });
  });
}); 