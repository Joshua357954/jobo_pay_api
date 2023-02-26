
module.exports = (sequelize,DataTypes,User) => {

	const WalletBeneficiary = sequelize.define('walletBeneficiary', {

		id:{
			type:DataTypes.INTEGER,
			primaryKey:true,
			autoIncrement:true,
		},
		

		beneficiaryId: {
			type:DataTypes.INTEGER,
			refrences:{
				model:User,
				key:'id'
			}
		}

	})
	return WalletBeneficiary

}