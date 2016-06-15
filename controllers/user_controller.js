var models = require('../models');
var Sequelize = require('sequelize');

// Autoload el user asociado a :userId
exports.load = function(req, res, next, userId) {
	models.User.findById(userId).then(function(user) {
		if(user) {
			req.user = user;
			next();
		} else {
			req.flash('error', 'No existe el usuario con id=' + id + '.');
			throw new Error('No existe userId=' + userId);
		}
	}).catch(function(error) {
		next(error);
	});
};

// GET /users
exports.index = function(req, res, nex) {
	models.User.findAll({order: ['username']}).then(function(users) {
		res.render('users/index', { users: users });
	}).catch(function(error) {
		next(error);
	});
};

// GET /user/:id
exports.show = function(req, res, next) {
	res.render('users/show', { user: req.user });	
};