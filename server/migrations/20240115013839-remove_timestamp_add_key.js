'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PendenceExchanges', 'timestamp');
    await queryInterface.addColumn('PendenceExchanges', 'key', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PendenceExchanges', 'key');
    await queryInterface.addColumn('PendenceExchanges', 'timestamp', {
      type: Sequelize.DATE,
      allowNull: true, // Modify as needed
    });
  }
};
