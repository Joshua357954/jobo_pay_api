// withdraw, transfer-from ,deposit-into

module.exports = (sequelize,Datatypes) => {

	const otherTransactions = sequelize.define('OtherTransactions',{

		id:{
			type: Datatypes.INTEGER,
			primaryKey:true,
			autoIncrement:true
		},

		transactionType: {
			type: Datatypes.ENUM('withdraw','transfer','bankTransfer','fund'),
			allowNull:false
		},

		amount: {
			type: Datatypes.FLOAT,
			allowNull: false
		},

		discription: {
			type: Datatypes.STRING,
			allowNull:false
		},

		merchantId: {
			type: Datatypes.INTEGER,
			allowNull:false
		},
		receiverId: {
			type: Datatypes.INTEGER,
			allowNull:true
		}



	})

	return otherTransactions

}