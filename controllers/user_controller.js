var models = require('../models');
var Sequelize = require('sequelize');

// Autoload el user asociado a :userId
exports.load = function(req, res, next, userId) {
	models.User.findById(userId, { include: [models.Commission] }).then(function(user) {
		if(user) {
			req.user = user;
			next();
		} else {
			//req.flash('error', 'No existe el usuario con id=' + id + '.');
			throw new Error('No existe userId=' + userId);
		}
	}).catch(function(error) {
		next(error);
	});
};

// GET /users
exports.index = function(req, res, next) {
	models.User.findAll({ order: ['username'] }).then(function(users) {
		res.render('users/index', { users: users });
	}).catch(function(error) {
		next(error);
	});
};

// GET /users/:id
exports.show = function(req, res, next) {
	res.render('users/show', { user: req.user });
};

// GET /users/new
exports.new = function(req, res, next) {
	var user = models.User.build({ username: '', password: '' });
	res.render('users/new', { user: user });
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

// GET /users/:id/edit
exports.edit = function(req, res, next) {
	res.render('users/edit', { user: req.user });
};

// PUT /users/:id
exports.update = function(req, res, next) {
	//req.user.username = req.body.username;	// NO EDITAR
	req.user.password = req.body.password;
	req.user.cargo = req.body.cargo;

	// El password no puede estar vacío
	if(!req.body.password) {
		//req.flash('error', 'El Password debe rellenarse.');
		return res.render('users/edit', { user: req.user });
	}
	req.user.save({ fields: [ 'password', 'salt', 'cargo' ]}).then(function(user) {
		//req.flash('succes', 'Usuario editado con éxito.');
		res.redirect('/users');
	}).catch(Sequelize.ValidationError, function(error) {
		//req.flash('error', 'Errores en el formulario:');
		for(var i in error.errors) {
			//req.flash('error', error.errors[i].value);
		};
		res.render('users/edit', { user: user });
	}).catch(function(error) {
		next(error);
	});
};

// DELETE /users/:id
exports.destroy = function(req, res, next)  {
	req.user.destroy().then(function() {
		
		// Borrando usuario logueado
		if(req.session.user && (req.session.user.id === req.user.id)) {
			delete req.session.user;
		}

		req.user.getCommissions().then(function(commissions) {
			for(var i in commissions) {
				commissions[i].removeUser(req.user);
			}
		});

		//req.flash('succes', 'Usuario eliminado con éxito.');
		res.redirect('/');
	}).catch(function(error) {
		next(error);
	});
};