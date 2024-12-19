const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Verifica se o token foi enviado no header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verifica se o token está no formato correto
    const [scheme, token] = authHeader.split(' ');
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    try {
      // Verifica se o token é válido
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Adiciona o ID do usuário na requisição
      req.userId = decoded.id;
      req.userRole = decoded.role;
      
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido' });
      }
      return res.status(401).json({ error: 'Erro na validação do token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = authMiddleware; 