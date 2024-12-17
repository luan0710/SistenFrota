const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function generateTestCredentials() {
  try {
    // Criar uma conta de teste
    const testAccount = await nodemailer.createTestAccount();

    // Atualizar o arquivo .env com as credenciais
    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Substituir as credenciais SMTP
    envContent = envContent.replace(/SMTP_USER=.*/, `SMTP_USER=${testAccount.user}`);
    envContent = envContent.replace(/SMTP_PASS=.*/, `SMTP_PASS=${testAccount.pass}`);
    envContent = envContent.replace(/SMTP_HOST=.*/, `SMTP_HOST=${testAccount.smtp.host}`);
    envContent = envContent.replace(/SMTP_PORT=.*/, `SMTP_PORT=${testAccount.smtp.port}`);
    envContent = envContent.replace(/SMTP_SECURE=.*/, `SMTP_SECURE=${testAccount.smtp.secure}`);

    fs.writeFileSync(envPath, envContent);

    console.log('Credenciais SMTP geradas com sucesso:');
    console.log('SMTP_USER:', testAccount.user);
    console.log('SMTP_PASS:', testAccount.pass);
    console.log('SMTP_HOST:', testAccount.smtp.host);
    console.log('SMTP_PORT:', testAccount.smtp.port);
    console.log('SMTP_SECURE:', testAccount.smtp.secure);
    console.log('\nAs credenciais foram salvas no arquivo .env');
  } catch (error) {
    console.error('Erro ao gerar credenciais:', error);
    process.exit(1);
  }
}

generateTestCredentials(); 