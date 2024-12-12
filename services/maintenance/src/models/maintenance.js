'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Maintenance extends Model {
    static associate(models) {
      // define associations here
    }
  }

  Maintenance.init({
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehicles',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('preventive', 'corrective', 'emergency'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString()
      }
    },
    completed_date: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    service_provider: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Maintenance',
    tableName: 'maintenances',
    underscored: true
  });

  return Maintenance;
}; 