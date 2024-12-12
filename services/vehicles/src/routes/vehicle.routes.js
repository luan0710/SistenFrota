const { Router } = require('express');
const VehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin, isManager, isUser } = require('../middlewares/rbac.middleware');

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de leitura - acessíveis a todos os usuários autenticados
router.get('/', isUser, VehicleController.list);
router.get('/:id', isUser, VehicleController.getById);

// Rotas de escrita - acessíveis apenas a administradores e gerentes
router.post('/', isManager, VehicleController.create);
router.put('/:id', isManager, VehicleController.update);
router.delete('/:id', isAdmin, VehicleController.delete);

// Rotas específicas
router.patch('/:id/status', isManager, VehicleController.updateStatus);
router.patch('/:id/mileage', isUser, VehicleController.updateMileage);

module.exports = router; 