var express = require('express');
var router = express.Router();

/* Añadir controllers */
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');
var commissionController = require('../controllers/commission_controller')

/* Autoload de parámetros */
router.param('userId',			userController.load);	// Autoload :userId
router.param('commissionId',	commissionController.load);	// Autoload :commissionId

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

/* Definición de rutas de usuarios */
router.get('/users',					sessionController.isLogin,
										userController.index);					// Listado de usuarios
router.get('/users/:userId(\\d+)',		sessionController.isLogin,
										userController.show);					// Ver un usuario
router.get('/users/new',				sessionController.isLogin,
										sessionController.isAdmin,
										userController.new);					// Formulario sign-up
router.post('/users',					userController.create);					// Registrar usuario
router.get('/users/:userId(\\d+)/edit',	sessionController.isLogin,
										sessionController.isAdminOrMySelf,
										userController.edit);					// Editar cuenta
router.put('/users/:userId(\\d+)',		userController.update);					// Actualizar cuenta
router.delete('/users/:userId(\\d+)',	sessionController.isLogin,
										sessionController.isAdminAndNotMyself,
										userController.destroy);				// Borrar cuenta

/* Definición de rutas de sesiones */
router.get('/session',		sessionController.isNotLogin,
							sessionController.new);			// Formulario login
router.post('/session',		sessionController.create);		// Crear sesión
router.delete('/session',	sessionController.destroy);		// Destruir sesión

/* Definición de rutas de comisiones */
router.get('/comisiones',							sessionController.isLogin,
													commissionController.index);	// Listado de comisiones
router.get('/comisiones/:commissionId(\\d+)',		sessionController.isLogin,
													commissionController.show);		// Ver comisión
router.get('/comisiones/new',						sessionController.isAdmin
													,commissionController.new);		// Nueva comisión
router.post('/comisiones',							commissionController.create);	// Crear comisión
router.get('/comisiones/:commissionId(\\d+)/edit',	sessionController.isAdmin,
													commissionController.edit);		// Editar comisión 
router.put('/comisiones/:commissionId(\\d+)',		commissionController.update);	// Actualizar comisión
router.delete('/comisiones/:commissionId(\\d+)',	sessionController.isAdmin,
													commissionController.destroy);	// Borrar comisión

module.exports = router;