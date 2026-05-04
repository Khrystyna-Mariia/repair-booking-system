const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sensor = sequelize.define('Sensor', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chipId: {
      type: DataTypes.STRING,
      unique: true, // Кожен ESP32 має свій унікальний код
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: 'Новий датчик',
    },
    type: {
      type: DataTypes.ENUM('water_leak', 'smoke', 'temp'),
      defaultValue: 'temp',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    lastValue: {
      type: DataTypes.FLOAT,
      allowNull: true, 
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Sensor;
};