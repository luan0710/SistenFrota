require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const vehicleRoutes = require('./routes/vehicle.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/vehicles', vehicleRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'vehicles-service' });
});

const PORT = process.env.PORT || 3002;

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
    app.listen(PORT, () => {
      console.log(`Serviço de Veículos rodando na porta ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Erro ao sincronizar banco de dados:', error);
  }); 