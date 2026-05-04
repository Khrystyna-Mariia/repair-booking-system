const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  const Service = sequelize.define('Service', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: false },
    masterId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return Service;
};