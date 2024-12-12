const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/rbac.middleware');

const router = Router();

// Rotas públicas
router.post('/register', AuthController.register.bind(AuthController));
router.post('/login', AuthController.login.bind(AuthController));
router.post('/forgot-password', AuthController.forgotPassword.bind(AuthController));
router.post('/reset-password', AuthController.resetPassword.bind(AuthController));

// Rotas protegidas
router.use(authMiddleware);

// Rotas que requerem autenticação e autorização
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