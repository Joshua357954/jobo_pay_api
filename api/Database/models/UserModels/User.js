
module.exports = (sequelize,DataTypes) => {

	const User = sequelize.define('user',{

		name: { type: DataTypes.STRING },

		username: { 
			type: DataTypes.STRING(1234),
			unique: true
		},

		password: { type: DataTypes.STRING },

		pin: { 
			type: DataTypes.INTEGER ,
			allowNull:true
		},

		email: { 
			type: DataTypes.STRING,
			allowNull:true,
			unique: true
		},

		phone: { 
			type: DataTypes.INTEGER,
			unique: true
		},

		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		
		contractKey:{
			type: DataTypes.STRING,
			unique: true,
			allowNull:true

		},
		allowMerchantTransactions:{
			type: DataTypes.BOOLEAN,
			defaultValue:false
		},
		merchantPin:{
			type: DataTypes.INTEGER,
			allowNull:false
		}

	})

	return User
}


