var express = require('express');
var router = express.Router();

/* Añadir controllers */
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');

/* Autoload de parámetros */
router.param('userId', userController.load);	// Autoload :userId

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

/* Definición de rutas de usuarios */
router.get('/users',					userController.index);		// Listado de usuarios
router.get('/users/:userId(\\d+)',		userController.show);		// Ver un usuario
router.get('/users/new',				userController.new);		// Formulario sign-up
router.post('/users',					userController.create);		// Registrar usuario
router.get('/users/:userId(\\d+)/edit',	userController.edit);		// Editar cuenta
router.put('/users/:userId(\\d+)',		userController.update);		// Actualizar cuenta
router.delete('/users/:userId(\\d+)',	userController.destroy);	// Borrar cuenta

/* Definición de rutas de sesiones */
router.get('/session',		sessionController.new);		// Formulario login
router.post('/session',		sessionController.create);	// Crear sesión
router.delete('/session',	sessionController.destroy);	// Destruir sesión

module.exports = router;