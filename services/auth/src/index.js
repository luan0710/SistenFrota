require('dotenv').config();
const express = require('express');
const securityMiddleware = require('./middlewares/security.middleware');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

// Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aplicando o middleware de segurança
app.use(securityMiddleware);

// Rotas
app.use('/api/auth', authRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Handler para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Handler para erros não tratados
process.on('uncaughtException', (error) => {
  logger.error('Erro não tratado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Promise rejeitada não tratada:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Serviço de autenticação rodando na porta ${PORT}`);
}); 