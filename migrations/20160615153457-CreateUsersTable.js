'use strict';
var variablesGlobales = require('../public/javascripts/variablesGlobales.js');

module.exports = {
  up: function (queryInterface, Sequelize) {
      var cargos = variablesGlobales.cargos;
      return queryInterface.createTable('Users', 
              { id: {
                      type: Sequelize.INTEGER,
                      allowNull: false,
                      primaryKey: true,
                      autoIncrement: true,
                      unique: true
                    },
                username: {
                            type: Sequelize.STRING(35),
                            unique: true,
                            validate: {
                              len: [1, 35],
                              notEmpty: {msg: "Falta username"}
                            }
                          },
                password: {
                            type: Sequelize.STRING,
                            validate: { notEmpty: {msg: "Falta password"}}
                          },
                salt: {
                        type: Sequelize.STRING
                      },
                isAdmin: {
                            type: Sequelize.BOOLEAN,
                            defaultValue: false
                         },
                cargo:  { 
                          type: Sequelize.ENUM(cargos),
                          validate: { 
                            notEmpty: {msg: "Falta cargo"}
                          }
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
      return queryInterface.dropTable('Users');
  }
};