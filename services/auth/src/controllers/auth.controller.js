const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, LoginHistory } = require('../models');
const mailService = require('../services/mail.service');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');

// Sistema de rate limiting
const loginAttempts = new Map();
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos em milissegundos

class AuthController {
  checkLoginAttempts(email) {
    const attempts = loginAttempts.get(email) || { count: 0, timestamp: Date.now() };
    
    // Verifica se o tempo de bloqueio já passou
    if (attempts.count >= MAX_ATTEMPTS) {
      const timeElapsed = Date.now() - attempts.timestamp;
      if (timeElapsed < BLOCK_DURATION) {
        const remainingTime = Math.ceil((BLOCK_DURATION - timeElapsed) / 60000);
        throw new Error(`Muitas tentativas de login. Tente novamente em ${remainingTime} minutos`);
      }
      // Reseta as tentativas após o período de bloqueio
      loginAttempts.delete(email);
      return;
    }
  }

  updateLoginAttempts(email, success) {
    if (success) {
      // Remove as tentativas em caso de sucesso
      loginAttempts.delete(email);
      return;
    }

    const attempts = loginAttempts.get(email) || { count: 0, timestamp: Date.now() };
    attempts.count += 1;
    attempts.timestamp = Date.now();
    loginAttempts.set(email, attempts);
  }

  async register(req, res) {
    try {
      const { name, email, password, confirmPassword, role } = req.body;

      // Validações básicas
      if (!email || !password || !name || !confirmPassword) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'As senhas não coincidem' });
      }

      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: 'Email inválido' });
      }

      // Validação de força da senha
      const passwordValidation = User.validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          error: 'A senha não atende aos requisitos mínimos de segurança',
          details: passwordValidation.errors
        });
      }

      // Verifica se o usuário já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Este email já está cadastrado' });
      }

      // Gera token de verificação de email
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      // Cria o usuário
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user',
        emailVerificationToken,
        emailVerificationExpires
      });

      // Envia email de verificação
      await mailService.sendVerificationEmail(user, emailVerificationToken);

      // Remove dados sensíveis
      user.password = undefined;
      user.emailVerificationToken = undefined;

      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return res.status(201).json({
        user,
        token,
        refreshToken
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Erro de validação',
          details: error.errors.map(err => err.message)
        });
      }
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  async login(req, res) {
    try {
      const { email, password, rememberMe } = req.body;
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.ip || req.connection.remoteAddress || '';

      // Parse user agent
      const ua = new UAParser(userAgent);
      const browser = ua.getBrowser();
      const os = ua.getOS();
      const device = ua.getDevice();

      // Get location from IP
      const geo = geoip.lookup(ip);
      const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown';

      // Validações básicas
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Busca o usuário
      const user = await User.findOne({ where: { email } });
      
      // Prepara os dados do histórico de login
      const loginAttempt = {
        userId: user ? user.id : null,
        ip: ip || 'Unknown',
        userAgent: userAgent || 'Unknown',
        browser: browser.name || 'Unknown',
        os: os.name || 'Unknown',
        device: device.type || 'desktop',
        location: location,
        status: 'failed'
      };

      if (!user) {
        loginAttempt.failureReason = 'Usuário não encontrado';
        await LoginHistory.create(loginAttempt);
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verifica se a conta está bloqueada
      if (user.lockUntil && user.lockUntil > new Date()) {
        const remainingTime = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
        loginAttempt.failureReason = 'Conta bloqueada';
        await LoginHistory.create(loginAttempt);
        return res.status(429).json({ 
          error: `Conta bloqueada. Tente novamente em ${remainingTime} minutos`
        });
      }

      // Verifica se o usuário está ativo
      if (!user.active) {
        loginAttempt.failureReason = 'Usuário inativo';
        await LoginHistory.create(loginAttempt);
        return res.status(401).json({ error: 'Usuário inativo' });
      }

      // Verifica a senha
      const isValidPassword = await user.checkPassword(password);
      if (!isValidPassword) {
        // Incrementa tentativas falhas
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        
        // Bloqueia a conta após 3 tentativas
        if (user.failedLoginAttempts >= 3) {
          user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        }
        
        await user.save();
        
        loginAttempt.failureReason = 'Senha inválida';
        await LoginHistory.create(loginAttempt);

        if (user.lockUntil) {
          return res.status(429).json({ 
            error: 'Muitas tentativas falhas. Conta bloqueada por 15 minutos'
          });
        }

        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Login bem sucedido
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      user.lastLogin = new Date();
      await user.save();

      // Registra login bem sucedido
      loginAttempt.status = 'success';
      loginAttempt.userId = user.id; // Garante que o userId está definido
      delete loginAttempt.failureReason;
      await LoginHistory.create(loginAttempt);

      // Verifica se é um novo dispositivo
      const lastLogin = await LoginHistory.findOne({
        where: {
          userId: user.id,
          browser: browser.name || 'Unknown',
          os: os.name || 'Unknown',
          device: device.type || 'desktop',
          status: 'success'
        },
        order: [['createdAt', 'DESC']],
        offset: 1
      });

      if (!lastLogin) {
        // Envia notificação de novo dispositivo
        try {
          await mailService.sendNewDeviceLoginEmail(user, {
            browser: browser.name || 'Unknown',
            os: os.name || 'Unknown',
            device: device.type || 'desktop',
            location: location,
            time: new Date()
          });
        } catch (error) {
          console.error('Erro ao enviar email de novo dispositivo:', error);
          // Não impede o login se o email falhar
        }
      }

      // Remove dados sensíveis
      user.password = undefined;

      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Define o tempo de expiração do refresh token
      const refreshTokenExpiration = rememberMe ? '30d' : '7d';

      return res.json({
        user,
        token,
        refreshToken,
        expiresIn: '1h',
        refreshTokenExpiresIn: refreshTokenExpiration
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Retornamos a mesma mensagem mesmo se o usuário não existir
        // para evitar enumeração de usuários
        return res.json({ 
          message: 'Se um usuário com este email existir, você receberá as instruções de recuperação'
        });
      }

      // Gera um token único para recuperação de senha
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

      // Salva o token no banco
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;
      await user.save();

      // Envia o email
      const emailSent = await mailService.sendPasswordRecoveryEmail(user, resetToken);

      if (!emailSent) {
        return res.status(500).json({ error: 'Erro ao enviar email de recuperação' });
      }

      return res.json({ 
        message: 'Se um usuário com este email existir, você receberá as instruções de recuperação'
      });
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return res.status(500).json({ error: 'Erro ao processar recuperação de senha' });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, token, password } = req.body;

      if (!email || !token || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
      }

      const user = await User.findOne({
        where: {
          email,
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Token inválido ou expirado' });
      }

      // Atualiza a senha
      user.password = password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      // Invalida todos os tokens existentes
      user.tokenVersion = (user.tokenVersion || 0) + 1;
      await user.save();

      // Envia email de confirmação
      await mailService.sendPasswordChangedEmail(user);

      return res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return res.status(500).json({ error: 'Erro ao resetar senha' });
    }
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, version: user.tokenVersion || 0 },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' } // Refresh token expira em 7 dias
    );
  }
}

module.exports = new AuthController(); 