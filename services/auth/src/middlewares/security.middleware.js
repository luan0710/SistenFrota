const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');

// Configuração do CORS
const corsOptions = {
  origin: '*', // Permite todas as origens em desenvolvimento
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Configuração do Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por windowMs
  message: {
    error: 'Muitas requisições deste IP, por favor tente novamente mais tarde'
  }
});

// Middleware de segurança personalizado
const customSecurityMiddleware = (req, res, next) => {
  // Remove cabeçalhos sensíveis
  res.removeHeader('X-Powered-By');
  
  // Adiciona cabeçalhos de segurança
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Previne cache em rotas de API
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }

  next();
};

// Exporta uma única função que aplica todos os middlewares
const securityMiddleware = (req, res, next) => {
  // Aplica os middlewares em sequência
  cors(corsOptions)(req, res, (err) => {
    if (err) return next(err);
    helmet()(req, res, (err) => {
      if (err) return next(err);
      helmet.crossOriginResourcePolicy({ policy: "cross-origin" })(req, res, (err) => {
        if (err) return next(err);
        limiter(req, res, (err) => {
          if (err) return next(err);
          xss()(req, res, (err) => {
            if (err) return next(err);
            hpp()(req, res, (err) => {
              if (err) return next(err);
              customSecurityMiddleware(req, res, next);
            });
          });
        });
      });
    });
  });
};

module.exports = securityMiddleware; 