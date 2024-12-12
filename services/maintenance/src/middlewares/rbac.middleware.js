const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const hasRole = roles.includes(req.user.role);
      if (!hasRole) {
        return res.status(403).json({ 
          error: 'Acesso negado',
          message: 'Você não tem permissão para acessar este recurso'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
};

module.exports = {
  isAdmin: checkRole(['admin']),
  isManager: checkRole(['admin', 'manager']),
  isUser: checkRole(['admin', 'manager', 'user'])
}; 