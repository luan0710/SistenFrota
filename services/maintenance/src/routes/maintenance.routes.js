const { Router } = require('express');
const MaintenanceController = require('../controllers/maintenance.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin, isManager, isUser } = require('../middlewares/rbac.middleware');

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de leitura - acessíveis a todos os usuários autenticados
router.get('/', isUser, MaintenanceController.list);
router.get('/:id', isUser, MaintenanceController.getById);
router.get('/vehicle/:vehicle_id', isUser, MaintenanceController.getByVehicle);

// Rotas de escrita - acessíveis apenas a administradores e gerentes
router.post('/', isManager, MaintenanceController.create);
router.put('/:id', isManager, MaintenanceController.update);
router.delete('/:id', isAdmin, MaintenanceController.delete);

// Rotas específicas
router.patch('/:id/status', isManager, MaintenanceController.updateStatus);

module.exports = router; 