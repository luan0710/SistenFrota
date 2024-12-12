'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      plate: {
        type: Sequelize.STRING(8),
        allowNull: false,
        unique: true
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('car', 'truck', 'van', 'motorcycle', 'other'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'maintenance', 'inactive'),
        defaultValue: 'active'
      },
      fuel_type: {
        type: Sequelize.ENUM('gasoline', 'diesel', 'ethanol', 'flex', 'electric'),
        allowNull: false
      },
      capacity: {
        type: Sequelize.FLOAT,
        comment: 'Capacidade em litros para tanque de combustível'
      },
      current_mileage: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_maintenance: {
        type: Sequelize.DATE
      },
      next_maintenance: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vehicles');
  }
}; 