require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.MAINTENANCE_SERVICE_PORT || 3003;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'maintenance-service' });
});

app.listen(PORT, () => {
  console.log(`Serviço de Manutenção rodando na porta ${PORT}`);
}); 