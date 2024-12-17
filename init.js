const mysql = require('mysql2/promise');
const { execSync } = require('child_process');

async function init() {
  try {
    // 1. Criar banco de dados
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '@0503@'
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS sistenfrota');
    console.log('Banco de dados criado com sucesso');
    await connection.end();

    // 2. Instalar dependências dos serviços
    console.log('\nInstalando dependências...');
    execSync('cd services/auth && npm install');
    execSync('cd services/vehicles && npm install');
    execSync('cd services/maintenance && npm install');
    console.log('Dependências instaladas');

    // 3. Executar migrations
    console.log('\nExecutando migrations...');
    execSync('cd services/auth && npx sequelize-cli db:migrate');
    execSync('cd services/vehicles && npx sequelize-cli db:migrate');
    execSync('cd services/maintenance && npx sequelize-cli db:migrate');
    console.log('Migrations executadas');

    console.log('\nSistema inicializado com sucesso!');
    console.log('\nPara iniciar os serviços, execute:');
    console.log('1. cd services/auth && npm run dev');
    console.log('2. cd services/vehicles && npm run dev');
    console.log('3. cd services/maintenance && npm run dev');

  } catch (error) {
    console.error('Erro durante a inicialização:', error);
  }
}

init(); 