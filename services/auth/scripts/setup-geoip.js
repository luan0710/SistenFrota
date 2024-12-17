const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const GEOIP_DIR = path.join(__dirname, '..', 'geoip');
const DB_PATH = path.join(GEOIP_DIR, 'GeoLite2-City.mmdb');

async function setupGeoIP() {
  try {
    // Cria o diretório se não existir
    if (!fs.existsSync(GEOIP_DIR)) {
      fs.mkdirSync(GEOIP_DIR, { recursive: true });
    }

    // Verifica se o arquivo já existe
    if (fs.existsSync(DB_PATH)) {
      console.log('Banco de dados GeoIP já existe.');
      return;
    }

    console.log('Configurando GeoIP...');
    
    // Instala o pacote geoip-lite globalmente
    console.log('Instalando geoip-lite...');
    execSync('npm install -g geoip-lite');

    // Atualiza o banco de dados
    console.log('Atualizando banco de dados GeoIP...');
    execSync('npm run -g geoip-lite-update');

    console.log('GeoIP configurado com sucesso!');
    console.log(`Banco de dados localizado em: ${DB_PATH}`);
    
  } catch (error) {
    console.error('Erro ao configurar GeoIP:', error);
    process.exit(1);
  }
}

setupGeoIP(); 