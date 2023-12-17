'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PendenceExchange extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PendenceExchange.init({
    timestamp: DataTypes.DATE,
    senderId: DataTypes.INTEGER,
    requesterId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PendenceExchange',
  });
  return PendenceExchange;
};