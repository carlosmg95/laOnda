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

// GET /users/new
exports.new = function(req, res, next) {
	var user = models.User.build({ username: '', password: '' });
	res.render('users/new', {user: user});
};

// POST /users
exports.create = function(req, res, next) {
	var user = models.User.build({ username: req.body.username, password: req.body.password, cargo: req.body.cargo });

	// El login debe ser único:
	models.User.find({ where: { username: req.body.username }}).then(function(existing_user) {
		if(existing_user) {
			var emsg = 'El usuario \"' + req.body.username + '\" ya exite.';
			//req.flash('error', emsg);
			res.render('users/new', { user: user });
		} else {
			// Guardar en la BBDD
			return user.save({ fields: [ 'username', 'password', 'salt', 'cargo' ]}).then(function(user) {	// Renderiza página de usuarios
				//req.flash('succes', 'Usuario creado con éxito');
				res.redirect('/');
			}).catch(Sequelize.ValidationError, function(error) {
				//req.flash('error', 'Errores en el formulario:');
				for(var i in error.errors) {
					//req.flash('error', error.errors[i].value);
				};
				res.render('users/new', { user: user });
			});
		}
	}).catch(function(error) {
		next(error);
	});
};