var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

//	Usar BBDD SQLite:
//		DATABASE_URL: sqlite:///
//		DATABASE_STORAGE: onda.sqlite
//	Usar BBDD Postgres:
//		DATABASE_URL: postgres://user:passwd@host:port/database

var url, storage;

if(!process.env.DATABASE_URL) {
	url = "sqlite:///"
	storage = "onda.sqlite";
} else {
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || '';
}

var sequelize = new Sequelize(url, {storage: storage, omitNull: true});

// Importar la definicion de la tabla Quiz de user.js
var User = sequelize.import(path.join(__dirname,'user'));

// Exportar definición de tablas
exports.User = User;