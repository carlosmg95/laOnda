var express = require('express');
var router = express.Router();

/* Añadir controllers */
var userController = require('../controllers/user_controller');

/* Autoload de parámetros */
router.param('userId', userController.load);	// Autoload :userId

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

/* Definición de rutas de usuarios */
router.get('/users',				userController.index);	// Listado de usuarios
router.get('/users/:userId(\\d+)',	userController.show);	// Ver un usuario

module.exports = router;
