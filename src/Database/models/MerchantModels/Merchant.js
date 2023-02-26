

module.exports = (sequelize,Datatypes) => {
	const merchant = sequelize.define('Merchant',{

		name:{ 
			type: Datatypes.STRING ,
			unique: true
		},
		
		username:{
			type: Datatypes.STRING ,
			unique: true
		},

		phone:{ 
			type: Datatypes.INTEGER, 
			unique: true
		},

		email:{ 
			type: Datatypes.STRING,
			allowNull:true,
			unique: true
		},

		password: { type: Datatypes.STRING },

		merchantKey:{ type: Datatypes.STRING },

		balance:{ type: Datatypes.INTEGER },

	})

	return merchant

}

















