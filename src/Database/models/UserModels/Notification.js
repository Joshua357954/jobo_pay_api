

module.exports = (sequelize,DataTypes) => {

	const Notification = sequelize.define('Notification',{
		
		title: { type: DataTypes.STRING(1234) },

		type: { type: DataTypes.STRING(1234) },

		link: { 
			type: DataTypes.STRING(1234),
			allowNull: true
		},

		read: { 
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},

		discription: { type: DataTypes.STRING(1234)},
		
		img: { 
			type: DataTypes.STRING(1234),
			allowNull:true
		}
	})

	return Notification
}