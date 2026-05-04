const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('client', 'master', 'admin'),
      allowNull: false,
      defaultValue: 'client', 
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });

  return User;
};