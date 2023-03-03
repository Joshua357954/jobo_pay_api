

module.exports = (sequelize,DataTypes) => {

	const BankBeneficiary = sequelize.define('BankBeneficiary', {


		accountName: { type: DataTypes.STRING(1234) },

		accountNumber: { type: DataTypes.STRING(1234) },

		bankName: { type: DataTypes.STRING(1234) },
		
	})
	
	return BankBeneficiary

}