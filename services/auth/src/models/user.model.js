const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // define associations here
      User.hasMany(models.LoginHistory, {
        foreignKey: 'userId',
        as: 'loginHistory'
      });
    }

    async checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }

    // Método para validar força da senha
    static validatePassword(password) {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const errors = [];
      
      if (password.length < minLength) {
        errors.push(`A senha deve ter no mínimo ${minLength} caracteres`);
      }
      if (!hasUpperCase) {
        errors.push('A senha deve conter pelo menos uma letra maiúscula');
      }
      if (!hasLowerCase) {
        errors.push('A senha deve conter pelo menos uma letra minúscula');
      }
      if (!hasNumbers) {
        errors.push('A senha deve conter pelo menos um número');
      }
      if (!hasSpecialChar) {
        errors.push('A senha deve conter pelo menos um caractere especial');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        validatePassword(value) {
          const validation = User.validatePassword(value);
          if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
          }
        }
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  return User;
}; 