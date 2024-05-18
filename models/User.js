const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Prompt = require('./Prompt');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Prompt, { foreignKey: 'userId' });
Prompt.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
