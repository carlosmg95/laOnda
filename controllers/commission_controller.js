var models = require('../models');
var Sequelize = require('sequelize');

// Autoload el commission asociado a :commissionId
exports.load = function(req, res, next, commissionId) {
	models.Commission.findById(commissionId/*, { include: [models.User] }*/).then(function(commission) {
		if(commission) {
			req.commission = commission;
			next();
		} else {
			//req.flash('error', 'No existe el usuario con id=' + id + '.');
			throw new Error('No existe commissionId=' + commissionId);
		}
	}).catch(function(error) {
		next(error);
	});
};

// GET /comisiones
exports.index = function(req, res, next) {
	models.Commission.findAll({ order: ['name'] }).then(function(commissions) {
		res.render('comisiones/index', { commissions: commissions });
	}).catch(function(error) {
		next(error);
	});
};

// GET /comisiones/:id
exports.show = function(req, res, next) {
	res.render('comisiones/show', { commission: req.commission });	
};

// GET /comisiones/new
exports.new = function(req, res, next) {
	var commission = models.Commission.build({ name: '', explanation: '' });
	res.render('comisiones/new', { commission: commission });
};

// POST /comisiones
exports.create = function(req, res, next) {
	var commission = models.Commission.build({ name: req.body.name, explanation: req.body.explanation });

	// El nombre debe ser único:
	models.Commission.find({ where: { name: req.body.name }}).then(function(existing_commission) {
		if(existing_commission) {
			var emsg = 'La comisión \"' + req.body.name + '\" ya exite.';
			//req.flash('error', emsg);
			res.render('comisiones/new', { commission: commission });
		} else {
			// Guardar en la BBDD
			return commission.save({ fields: [ 'name', 'explanation' ]}).then(function(commission) {	// Renderiza página de usuarios
				//req.flash('succes', 'Usuario creado con éxito');
				res.redirect('/');
			}).catch(Sequelize.ValidationError, function(error) {
				//req.flash('error', 'Errores en el formulario:');
				for(var i in error.errors) {
					//req.flash('error', error.errors[i].value);
				};
				res.render('comisiones/new', { commission: commission });
			});
		}
	}).catch(function(error) {
		next(error);
	});
};

// GET /comisiones/:id/edit
exports.edit = function(req, res, next) {
	res.render('comisiones/edit', { commission: req.commission });
};

// PUT /comisiones/:id
exports.update = function(req, res, next) {
	//req.commission.name = req.body.name;	// NO EDITAR
	req.commission.explanation = req.body.explanation || req.commission.explanation;
	
	req.commission.save({ fields: [ 'explanation' ]}).then(function(commission) {
		//req.flash('succes', 'Usuario editado con éxito.');
		res.redirect('/comisiones');
	}).catch(Sequelize.ValidationError, function(error) {
		//req.flash('error', 'Errores en el formulario:');
		for(var i in error.errors) {
			//req.flash('error', error.errors[i].value);
		};
		res.render('comisiones/edit', { commission: commission });
	}).catch(function(error) {
		next(error);
	});
};

// DELETE /comisiones/:id
exports.destroy = function(req, res, next)  {
	req.commission.destroy().then(function() {		
		//req.flash('succes', 'Usuario eliminado con éxito.');
		res.redirect('/');
	}).catch(function(error) {
		next(error);
	});
};