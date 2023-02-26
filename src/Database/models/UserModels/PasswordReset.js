
module.exports = (sequelize,DataTypes) => {

	const PasswordReset = sequelize.define('PasswordReset', {


		resetString:{
			type:DataTypes.STRING(1234)},

		createdTime:{
			type:DataTypes.STRING(1234)
		},

		expiresAt:{
			type:DataTypes.STRING(1234)
		}

	})

	return PasswordReset

}