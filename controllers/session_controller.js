var models = require('../models');
var Sequelize = require('sequelize');
var url = require('url');

// /GET /session
exports.new = function (req, res, next) {
	var redir = req.query.redir || url.parse(req.headers.referer || '/').pathname;
	if(redir === '/session' || redir === '/users/new') {
		redir = '/';
	}
	res.render('session/new', { redir: redir });
};

// POST /session
exports.create = function(req, res, next) {

	var redir = req.body.redir || '/';

	var login = req.body.login;
	var password = req.body.password;

	authenticate(login, password).then(function(user) {
		if(user) {
			req.session.user = { id: user.id, username: user.username, inicio: new Date().getTime(), isAdmin: user.isAdmin };
			res.redirect(redir);
		} else {
			//req.flash('error', 'La autenticación ha fallado. Reinténtelo otra vez.');
			res.redirect('/session?redir=' + redir);
		}
	}).catch(function(error) {
		//req.flash('error', 'Se ha producido un error: ' + error);
		next(error);
	});
};

// DELETE /session
exports.destroy = function(req, res, next) {
	delete req.session.user;
	res.redirect('/session');
};

var authenticate = function(login, password) {
	return models.User.findOne({ where: { username: login }}).then(function(user) {
		if(user && user.verifyPassword(password)) {
			return user;
		} else {
			return null;
		}
	});
};

// Comprueba si hay un miembro logueado
exports.isLogin = function(req, res, next) {
	if(req.session.user) {
		next();
	} else {
		console.log('Ruta prohibida: No es miembro.');
		res.send(403);
	}
};

// Comprueba que no haya un miembro logueado
exports.isNotLogin = function(req, res, next) {
	if(!req.session.user) {
		next();
	} else {
		console.log('Ruta prohibida: Ya hay alguien logueado.');
		res.send(403);
	}
};

// Comprueba si el usuario logueado es admin
exports.isAdmin = function(req, res, next) {
	if(req.session.user.isAdmin) {
		next();
	} else {
		console.log('Ruta prohibida: No es admin.');
		res.send(403);
	}
};

// Comprueba que el usuario logueado sea admin o el dueño del perfil
exports.isAdminOrMySelf = function(req, res, next) {
	var isAdmin = req.session.user.isAdmin;
	var userId = req.user.id;
	var loggedUserId = req.session.user.id;

	if(isAdmin || (userId === loggedUserId)) {
		next();
	} else {
		console.log('Ruta prohibida: No es el usuario logueado, ni un administrador.');
		res.send(403);
	}
};

exports.isAdminAndNotMyself = function(req, res, next) {
	var isAdmin = req.session.user.isAdmin;
	var userId = req.user.id;
	var loggedUserId = req.session.user.id;

	if(isAdmin && (userId !== loggedUserId)) {
		next();
	} else {
		console.log('Ruta prohibida: No es el usuario logueado, ni un administrador.');
		res.send(403);
	}
};