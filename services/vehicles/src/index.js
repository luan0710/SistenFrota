require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.VEHICLES_SERVICE_PORT || 3002;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'vehicles-service' });
});

app.listen(PORT, () => {
  console.log(`Serviço de Veículos rodando na porta ${PORT}`);
}); 