

module.exports = (sequelize,DataTypes) => {

  const PaymentLink = sequelize.define('PaymentLink', {
    
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    currency: {
      type: DataTypes.STRING,
      defaultValue:'NGN'
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM('created', 'paid', 'failed'),
      defaultValue: 'created'
    }

  })

  return PaymentLink
}



