                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
module.exports = (sequelize,DataTypes,User) => {

	const Transaction = sequelize.define('transaction',{

		discription: { type: DataTypes.STRING, allowNull:true },

		status: { type: DataTypes.STRING, allowNull:true },

		transactionType: {
			type: DataTypes.ENUM('withdraw', 'transfer ', 'fund', 'received')
		},

		fromType: {
			type: DataTypes.ENUM,
			values: ['USER','MERCHANT'],
			allowNull: false
		},

		fromId: {
			type: DataTypes.INTEGER,
			allowNull:true,
		},

		amount: {type: DataTypes.INTEGER }

	})
	return Transaction

}