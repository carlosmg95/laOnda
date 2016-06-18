// Definición del modelo Commission

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Commission',
	{
		name: {
			type: DataTypes.STRING(15),
			unique: true,
			validate: {
				len: [1, 15],
				notEmpty: { msg: "Falta nombre" }
			}
		},
		explanation: {
			type: DataTypes.STRING,
		}
	}
	);
}