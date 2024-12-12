const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Verifica se o usuário já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      // Cria o usuário
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user'
      });

      // Remove a senha do retorno
      user.password = undefined;

      return res.status(201).json({
        user,
        token: this.generateToken(user)
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Busca o usuário
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      // Verifica se o usuário está ativo
      if (!user.active) {
        return res.status(401).json({ error: 'Usuário inativo' });
      }

      // Verifica a senha
      const isValidPassword = await user.checkPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      // Remove a senha do retorno
      user.password = undefined;

      return res.json({
        user,
        token: this.generateToken(user)
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Aqui você implementaria o envio de email com token de recuperação
      // Por enquanto vamos apenas retornar uma mensagem de sucesso
      return res.json({ message: 'Instruções de recuperação enviadas para seu email' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao recuperar senha' });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, token, password } = req.body;

      // Aqui você implementaria a validação do token de recuperação
      // Por enquanto vamos apenas atualizar a senha
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      user.password = password;
      await user.save();

      return res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao resetar senha' });
    }
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = new AuthController(); 