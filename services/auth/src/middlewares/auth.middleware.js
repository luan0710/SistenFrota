const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Blacklist de tokens
const tokenBlacklist = new Set();

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

    // Verifica se o token está na blacklist
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ error: 'Token invalidado' });
    }

    try {
      // Verifica se o token é válido
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Busca o usuário no banco
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      if (!user.active) {
        return res.status(401).json({ error: 'Usuário inativo' });
      }

      // Adiciona o usuário na requisição
      req.user = user;
      
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

module.exports = { authMiddleware, tokenBlacklist }; 