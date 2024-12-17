const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const { authMiddleware, tokenBlacklist } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/rbac.middleware');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = Router();

// Rotas públicas
router.post('/register', AuthController.register.bind(AuthController));
router.post('/login', AuthController.login.bind(AuthController));
router.post('/forgot-password', AuthController.forgotPassword.bind(AuthController));
router.post('/reset-password', AuthController.resetPassword.bind(AuthController));
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token não fornecido' });
    }

    // Verifica se o refresh token é válido
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Busca o usuário
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verifica se a versão do token ainda é válida
    if (decoded.version !== user.tokenVersion) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    // Gera novos tokens
    const token = AuthController.generateToken(user);
    const newRefreshToken = AuthController.generateRefreshToken(user);

    return res.json({ token, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token inválido' });
  }
});

// Rotas protegidas
router.use(authMiddleware);

// Logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    tokenBlacklist.add(token);

    // Incrementa a versão do token do usuário para invalidar todos os refresh tokens
    req.user.tokenVersion = (req.user.tokenVersion || 0) + 1;
    await req.user.save();

    return res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao realizar logout' });
  }
});

// Logout de todos os dispositivos
router.post('/logout-all', async (req, res) => {
  try {
    // Incrementa a versão do token do usuário para invalidar todos os refresh tokens
    req.user.tokenVersion = (req.user.tokenVersion || 0) + 1;
    await req.user.save();

    return res.json({ message: 'Logout realizado em todos os dispositivos' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao realizar logout' });
  }
});

// Rotas que requerem autenticação
router.get('/me', (req, res) => {
  return res.json({ user: req.user });
});

// Rotas administrativas
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

module.exports = router; 