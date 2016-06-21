'use strict'

var bot = require('telegram-node-bot')('231582976:AAHdsVcD1LbRLnKOtXWNYfV1vXhHtYwtmlw')
var models = require('./models')

console.log('\n\n\t--->  BOT ACTIVADO  <---\n\n')

bot.router.
	when(['/crear'],	'comisionesController').
	when(['/borrar'],	'comisionesController').
	when(['/meter'],	'comisionesController').
	when(['/sacar'],	'comisionesController')

bot.controller('comisionesController', ($) => { 
	bot.for('/crear', ($) => {		
		$.sendMessage('¿Cómo quiere que se llame la comisión?')
		$.waitForRequest(($) => {
			var commission = models.Commission.build({ name: $.message.text, explanation: '' })

			// El nombre debe ser único:
			models.Commission.find({ where: { name: $.message.text }}).then(function(existing_commission) {
				if(existing_commission) {
					$.sendMessage('Esa comisión ya existe')
				} else {
					// Guardar en la BBDD
					return commission.save({ fields: [ 'name', 'explanation' ]}).then(function(commission) {
						$.sendMessage('La comisión se llamará: \"' + $.message.text + '\"')
					})
				}
			}).catch(function(error) {
				console.log('Ha ocurrido un error: ' + error)
			})
		}) 
	})

	bot.for('/borrar', ($) => {		
		models.Commission.findAll({ order: ['name'] }).then(function(commissions) {
			var options = {
				reply_markup: JSON.stringify({                
					one_time_keyboard: true,
					keyboard: createKeyboard(commissions, 3, 'name')
				})
			}
			$.sendMessage('¿Qué comisión quiere borrar?', options)
			$.waitForRequest(($) => {
				var k = 0;	
				for(var i in commissions) {
					if(commissions[i].name === $.message.text) {
						k = i
					}
				}
				commissions[k].destroy().then(
					commissions[k].getUsers().then(function(users) {
						for(var j in users) {
							users[j].removeCommission(commissions[k])
						}
					})
				)
			}) 
		})
	})

	bot.for('/meter', ($) => {		
		models.Commission.findAll({ order: ['name'] }).then(function(commissions) {
			var options = {
				reply_markup: JSON.stringify({
					one_time_keyboard: true,
					keyboard: createKeyboard(commissions, 3, 'name')
				})
			}
			$.sendMessage('¿En qué comisión quiere meter a alguien?', options)
			$.waitForRequest(($) => {
				var k = 0;
				for(var i in commissions) {
					if(commissions[i].name === $.message.text) {
						k = i
					}
				}
				models.User.findAll({ order: ['username'] }).then(function(users) {
					var options = {
						reply_markup: JSON.stringify({
							one_time_keyboard: true,
							keyboard: createKeyboard(users, 4, 'username')
						})
					}
					$.sendMessage('¿A quién?', options)
					$.waitForRequest(($) => {
						for(var j in users) {
							if(users[j].username === $.message.text) {
								commissions[k].addUser(users[j])
							}
						}
					})
				})
			})
		})
	})

	bot.for('/sacar', ($) => {		
		models.Commission.findAll({ order: ['name'] }).then(function(commissions) {
			var options = {
				reply_markup: JSON.stringify({                
					one_time_keyboard: true,
					keyboard: createKeyboard(commissions, 3, 'name')
				})
			}
			$.sendMessage('¿De qué comisión quiere sacar a alguien?', options)			
			$.waitForRequest(($) => {
				var k = 0;				
				for(var i in commissions) {
					if(commissions[i].name === $.message.text) {
						k = i
					}
				}
				commissions[k].getUsers().then(function(users) {
					var options = {
						reply_markup: JSON.stringify({                
							one_time_keyboard: true,
							keyboard: createKeyboard(users, 4, 'username')
						})
					}
					$.sendMessage('¿A quién?', options)
					$.waitForRequest(($) => {
						for(var j in users) {
							if(users[j].username === $.message.text) {
								commissions[k].removeUser(users[j])
							}
						}
					})
				})					
			})
		})
	})
})

/**
  * Crea el keyboard que se va a mostrar
  *
  * @method	createKeyboard
  *
  * @param	intems	Elementos a mostrar
  * @param	layout	Número de elementos por fila
  * @param	key		Texto del elemento
  *
  * @return	keyboard formado
  */

var createKeyboard = function(intems, layout, key) {
	var keyboard = []
	var lineIndex = 0;

	for(var i in intems) {	// Recorre todos los elementos
		var intem = intems[i][key]	// El texto a mostrar será la propiedad 'key' de cada elemento

		if(!keyboard[lineIndex])		// Si la fila 'lineIndex' no está creada
			keyboard[lineIndex] = []	// Se crea

		keyboard[lineIndex].push(intem)	// Se añade el elemento a la fila

		if (keyboard[lineIndex].length === layout)	// Si la fila está completa
			lineIndex++								// Suma una fila más
	}
	
	return keyboard
}