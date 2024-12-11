require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.AUTH_SERVICE_PORT || 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service' });
});

app.listen(PORT, () => {
  console.log(`Serviço de Autenticação rodando na porta ${PORT}`);
}); 