const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    // Em desenvolvimento, apenas simula o envio
    if (process.env.NODE_ENV === 'development') {
      this.transporter = {
        sendMail: async (options) => {
          console.log('Email simulado:', {
            to: options.to,
            subject: options.subject,
            // Não loga o conteúdo HTML por segurança
          });
          return true;
        }
      };
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendVerificationEmail(user, token) {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${user.email}`;

    const mailOptions = {
      from: `"SistenFrota" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: 'Verifique seu Email - SistenFrota',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bem-vindo ao SistenFrota!</h2>
          <p>Olá ${user.name},</p>
          <p>Obrigado por se cadastrar. Para ativar sua conta, por favor verifique seu email clicando no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Verificar Email
            </a>
          </div>
          <p>Ou copie e cole o link abaixo no seu navegador:</p>
          <p style="word-break: break-all; color: #4F46E5;">${verificationLink}</p>
          <p>Este link expirará em 24 horas.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Se você não criou uma conta no SistenFrota, por favor ignore este email.
          </p>
        </div>
      `
    };

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Link de verificação (DEV):', verificationLink);
        return true;
      }
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email de verificação:', error);
      return false;
    }
  }

  async sendNewDeviceLoginEmail(user, loginInfo) {
    const mailOptions = {
      from: `"SistenFrota" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: 'Novo Acesso Detectado - SistenFrota',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Novo Acesso Detectado</h2>
          <p>Olá ${user.name},</p>
          <p>Detectamos um novo acesso à sua conta com os seguintes detalhes:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Data/Hora:</strong> ${loginInfo.time.toLocaleString()}</p>
            <p><strong>Dispositivo:</strong> ${loginInfo.device}</p>
            <p><strong>Navegador:</strong> ${loginInfo.browser}</p>
            <p><strong>Sistema Operacional:</strong> ${loginInfo.os}</p>
            ${loginInfo.location ? `<p><strong>Localização:</strong> ${loginInfo.location}</p>` : ''}
          </div>
          <p>Se foi você quem fez este acesso, você pode ignorar este email.</p>
          <p style="color: #dc2626;">Se você não reconhece este acesso, recomendamos que:</p>
          <ol>
            <li>Altere sua senha imediatamente</li>
            <li>Ative a autenticação em duas etapas</li>
            <li>Entre em contato com nosso suporte</li>
          </ol>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Este é um email automático de segurança. Por favor, não responda.
          </p>
        </div>
      `
    };

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Email de novo dispositivo (DEV):', {
          device: loginInfo.device,
          browser: loginInfo.browser,
          os: loginInfo.os,
          location: loginInfo.location
        });
        return true;
      }
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email de novo dispositivo:', error);
      return false;
    }
  }

  async sendPasswordRecoveryEmail(user, token) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${user.email}`;

    const mailOptions = {
      from: `"SistenFrota" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: 'Recuperação de Senha - SistenFrota',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperação de Senha</h2>
          <p>Olá ${user.name},</p>
          <p>Recebemos uma solicitação para redefinir sua senha. Se você não fez esta solicitação, ignore este email.</p>
          <p>Para redefinir sua senha, clique no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Redefinir Senha
            </a>
          </div>
          <p>Ou copie e cole o link abaixo no seu navegador:</p>
          <p style="word-break: break-all; color: #4F46E5;">${resetLink}</p>
          <p>Este link expirará em 1 hora por motivos de segurança.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Se você não solicitou a recuperação de senha, por favor ignore este email ou entre em contato com o suporte.
          </p>
        </div>
      `
    };

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Link de recuperação de senha (DEV):', resetLink);
        return true;
      }
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  async sendPasswordChangedEmail(user) {
    const mailOptions = {
      from: `"SistenFrota" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: 'Senha Alterada - SistenFrota',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Senha Alterada</h2>
          <p>Olá ${user.name},</p>
          <p>Sua senha foi alterada com sucesso.</p>
          <p>Se você não fez esta alteração, entre em contato com o suporte imediatamente.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Este é um email automático, por favor não responda.
          </p>
        </div>
      `
    };

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Email de senha alterada (DEV) enviado para:', user.email);
        return true;
      }
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }
}

module.exports = new MailService(); 