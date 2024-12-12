'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate(models) {
      // define associations here
    }
  }

  Vehicle.init({
    plate: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [7, 8]
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 1
      }
    },
    type: {
      type: DataTypes.ENUM('car', 'truck', 'van', 'motorcycle', 'other'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'maintenance', 'inactive'),
      defaultValue: 'active'
    },
    fuel_type: {
      type: DataTypes.ENUM('gasoline', 'diesel', 'ethanol', 'flex', 'electric'),
      allowNull: false
    },
    capacity: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0
      }
    },
    current_mileage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    last_maintenance: {
      type: DataTypes.DATE
    },
    next_maintenance: {
      type: DataTypes.DATE
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    underscored: true
  });

  return Vehicle;
}; 