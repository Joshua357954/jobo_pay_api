
module.exports = (sequelize,DataTypes,User) => {

	const CashToRedeem = sequelize.define('CashToRedeem', {

		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},

		
		amount:{ type: DataTypes.FLOAT },

		phone: { 
			type: DataTypes.INTEGER,
			allowNull:true
		},

		email: { 
			type: DataTypes.STRING,			
			allowNull:true
		},

		discription: { 
			type: DataTypes.STRING,
			allowNull:true,
		},

		secretKey: { 
			type: DataTypes.STRING,
			allowNull:true
		},

		collected: { 
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},

		senderId: { 
			type: DataTypes.INTEGER,
			allowNull:true,
			refrences:{
				model:User,
				key:'id'
			}
		},

		senderName: {  
			type: DataTypes.STRING,
			defaultValue: 'annonymous'
		}

	})


	return CashToRedeem


}