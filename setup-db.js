require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
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

    // Usar o banco de dados
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Fechar conexão
    await connection.end();
    console.log('Configuração do banco de dados concluída');

  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
    process.exit(1);
  }
}

setupDatabase(); 