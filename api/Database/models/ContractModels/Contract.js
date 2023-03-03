

module.exports = (sequelize,DataTypes,User) => {

	const contract = sequelize.define('Contract',{

		senderId:{ 
			type: DataTypes.INTEGER,
			refrences: {
				model:User,
				key:'id'
			}
		},

		receiverId:{ 
			type: DataTypes.INTEGER,
			refrences: {
				model:User,
				key:'id'
			}
		},

		amount:{ type: DataTypes.INTEGER },

		contractDateTime: { type: DataTypes.STRING },
		
		collectedUserId:{ 
			type: DataTypes.INTEGER,
			allowNull:true,
			refrences: {
				model:User,
				key:'id'
			}
		},
		collectedMerchantId:{ 
			type: DataTypes.INTEGER,
			allowNull:true,
			refrences: {
				model:User,
				key:'id'
			}
		},

	})
	return contract
}













