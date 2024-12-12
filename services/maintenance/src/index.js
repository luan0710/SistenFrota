require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const maintenanceRoutes = require('./routes/maintenance.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/maintenance', maintenanceRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'maintenance-service' });
});

const PORT = process.env.PORT || 3003;

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
    app.listen(PORT, () => {
      console.log(`Serviço de Manutenção rodando na porta ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Erro ao sincronizar banco de dados:', error);
  }); 