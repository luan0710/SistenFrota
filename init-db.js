require('dotenv').config();
const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function setupDatabase() {
  try {
    console.log('Iniciando configuração do banco de dados...');

    // Criar conexão com MySQL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });

    console.log('Conectado ao MySQL');

    // Criar banco de dados
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Banco de dados ${process.env.DB_NAME} criado/verificado`);

    // Fechar conexão
    await connection.end();

    // Executar migrations para cada serviço
    console.log('\nExecutando migrations...');

    const services = ['auth', 'vehicles', 'maintenance'];
    
    for (const service of services) {
      console.log(`\nExecutando migrations do serviço ${service}...`);
      try {
        const { stdout, stderr } = await execPromise(`cd services/${service} && npx sequelize-cli db:migrate`);
        console.log('Saída:', stdout);
        if (stderr) console.error('Erros:', stderr);
      } catch (error) {
        console.error(`Erro ao executar migrations do serviço ${service}:`, error);
      }
    }

    console.log('\nConfiguração do banco de dados concluída!');

  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
    process.exit(1);
  }
}

setupDatabase(); 