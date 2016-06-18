'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Commissions', [ 
         {
            name: 'Comisión de mujeres',
            explanation: 'Comisión permanente a la que pertenecen todas las mujeres de la asociación.',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Commissions', null, {});
  }
};
