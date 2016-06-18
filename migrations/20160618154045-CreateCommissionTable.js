'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Commissions', 
              { id: {
                      type: Sequelize.INTEGER,
                      allowNull: false,
                      primaryKey: true,
                      autoIncrement: true,
                      unique: true
                    },
                name: {
                        type: Sequelize.STRING(15),
                        unique: true,
                        validate: {
                          len: [1, 15],
                          notEmpty: {msg: "Falta nombre"}
                        }
                      },
                explanation: {
                                type: Sequelize.STRING
                             },                
                createdAt: {
                              type: Sequelize.DATE,
                              allowNull: false
                           },
                updatedAt: { 
                              type: Sequelize.DATE,
                              allowNull: false
                           }
              },
              { sync: {
                        force:true
                      }
              }
      );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Commissions');
  }
};
