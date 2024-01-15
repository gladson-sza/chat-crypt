'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'publicKey', {
      type: Sequelize.STRING(1024),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
