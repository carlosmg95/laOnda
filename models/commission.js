// Definición del modelo Commission

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Commission',
	{
		name: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				notEmpty: { msg: "Falta nombre" }
			}
		},
		explanation: {
			type: DataTypes.STRING,
		}
	}
	);
}