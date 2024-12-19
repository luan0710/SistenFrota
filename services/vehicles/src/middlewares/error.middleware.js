const { ValidationError } = require('sequelize');

module.exports = (err, req, res, next) => {
  console.error(err);

  // Erro de validação do Sequelize
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.errors.map(e => e.message)
    });
  }

  // Erro de upload de arquivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'Arquivo muito grande',
      details: ['O tamanho máximo permitido é 5MB']
    });
  }

  // Erro de tipo de arquivo
  if (err.message === 'Apenas imagens são permitidas!') {
    return res.status(400).json({
      error: 'Tipo de arquivo inválido',
      details: ['Apenas imagens são permitidas']
    });
  }

  // Erro de autenticação
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Não autorizado',
      details: ['Token inválido ou expirado']
    });
  }

  // Erro genérico
  return res.status(500).json({
    error: 'Erro interno do servidor',
    details: [err.message]
  });
}; 