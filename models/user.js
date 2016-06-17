var crypto = require('crypto');
var variablesGlobales = require('../public/javascripts/variablesGlobales.js');

// Definicion de la clase User:
module.exports = function(sequelize, DataTypes) {	
	var cargos = variablesGlobales.cargos;
	return sequelize.define('User',
		{	username: {
				type: DataTypes.STRING(35),
				unique: true,
				validate: {
					len: [1, 35],
					notEmpty: { msg: "Falta username" }
				}
			},
			password: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "Falta password"}},
				set: function (password) {
					// String aleatorio usado como salt.
					this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
					this.setDataValue('password', encryptPassword(password, this.salt));
				}
			},
			salt: {
				type: DataTypes.STRING
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			cargo: {
				type: DataTypes.ENUM(cargos),
				validate: {
					notEmpty: { msg: "Falta cargo" },
					isCorrect: function(cargo) {
						for(var i in cargos) {
							if(cargo === cargos[i]) {								
								return true;
							}
						}
						return next('El cargo no es correcto');
					}
				}
			}
		},
		{	instanceMethods: {
				verifyPassword: function (password) {
					return encryptPassword(password, this.salt) === this.password;
				}
			}    
		}
	);
};


/*
 * Encripta un password en claro.
 * Mezcla un password en claro con el salt proporcionado, ejecuta un SHA1 digest, 
 * y devuelve 40 caracteres hexadecimales.
 */
function encryptPassword(password, salt) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
};