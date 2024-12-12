const axios = require('axios');

const authMiddleware = async (req, res, next) => {
  try {
    // Verifica se o token foi enviado no header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
      // Verifica o token com o serviço de autenticação
      const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/me`, {
        headers: { Authorization: authHeader }
      });

      // Adiciona o usuário na requisição
      req.user = response.data.user;
      
      return next();
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json({ error: 'Erro ao validar token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = authMiddleware; 