
module.exports = (sequelize,DataTypes) => {

	const BankAccount = sequelize.define('BankAccount', {

		accountName: { 
			type: DataTypes.STRING(1234),			
			allowNull:true
		},

		bankName: { 
			type: DataTypes.STRING(1234),			
			allowNull:true
		},

		accountNumber: { type: DataTypes.INTEGER }

	})


	return BankAccount


}