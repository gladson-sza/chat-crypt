'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'publicKey', {
      type: Sequelize.STRING,
      allowNull: true // You can change this based on your requirements
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'publicKey');
  }
};