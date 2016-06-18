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

// Importar la definicion de las tablas
var User = sequelize.import(path.join(__dirname,'user'));
var Commission = sequelize.import(path.join(__dirname,'commission'));

// Relaciones entre modelos
/*User.belongsToMany(Commission);
Commission.belongsToMany(User);*/

// Exportar definición de tablas
exports.User = User;				// Exportar la tabla User
exports.Commission = Commission;	// Exportar la tabla Commission