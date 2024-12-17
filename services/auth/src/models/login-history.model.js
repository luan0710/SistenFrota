const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LoginHistory extends Model {
    static associate(models) {
      LoginHistory.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  LoginHistory.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unknown'
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Unknown'
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unknown'
    },
    os: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unknown'
    },
    device: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'desktop'
    },
    status: {
      type: DataTypes.ENUM('success', 'failed'),
      allowNull: false
    },
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unknown'
    }
  }, {
    sequelize,
    modelName: 'LoginHistory',
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['status']
      }
    ]
  });

  return LoginHistory;
}; 