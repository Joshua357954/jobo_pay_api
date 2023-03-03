

module.exports = (sequelize,DataTypes) => {

	const noAcUser = sequelize.define('NoAccountUser',{

		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},

		totalBalance: {
			type: DataTypes.FLOAT,
			defaultValue: 0
		},

		phone: {
			type: DataTypes.INTEGER,
			unique:true,
			allowNull:true
		},

		email: {
			type: DataTypes.STRING,
			unique:true,
			allowNull:true
		},

		otp: { 
			type: DataTypes.STRING ,
			allowNull:true
		}, 



	})

	return noAcUser

}