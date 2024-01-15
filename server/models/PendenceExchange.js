'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PendenceExchange extends Model {
    static associate(models) {
      // define association here
    }
  }
  PendenceExchange.init({
    key: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    requesterId: DataTypes.INTEGER,
    chatId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'PendenceExchange',
  });
  return PendenceExchange;
};
