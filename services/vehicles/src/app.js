const express = require('express');
const cors = require('cors');
const path = require('path');
const vehicleRoutes = require('./routes/vehicle.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rotas
app.use('/api/vehicles', vehicleRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app; 