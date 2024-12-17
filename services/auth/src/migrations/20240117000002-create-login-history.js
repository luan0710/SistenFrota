'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LoginHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Unknown'
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'Unknown'
      },
      browser: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Unknown'
      },
      os: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Unknown'
      },
      device: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'desktop'
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Unknown'
      },
      status: {
        type: Sequelize.ENUM('success', 'failed'),
        allowNull: false
      },
      failureReason: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LoginHistories');
  }
}; 