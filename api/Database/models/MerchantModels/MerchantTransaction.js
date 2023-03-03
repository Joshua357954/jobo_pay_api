
module.exports = (sequelize,DataTypes,User) => {

	const _merchantTransaction = sequelize.define('MerchantTransaction',{

		title: { type: DataTypes.STRING, allowNull:true },

		discription: { type: DataTypes.STRING, allowNull:true },

		status: { type: DataTypes.STRING },

		transactionType: {
			type: DataTypes.ENUM,
			values:['INCOMING','OUTGOING']
		},

		userId: {
			type: DataTypes.INTEGER,
			allowNull:true,
			refrences:{
				model:User,
				key:'id'
			}
		},

		amount: {type: DataTypes.INTEGER }

	})
	return _merchantTransaction

}
