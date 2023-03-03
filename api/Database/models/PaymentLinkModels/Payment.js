
module.exports = (sequelize,DataTypes) => {
  
  const Payment = sequelize.define('Payment', {
    
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      email: {
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

      status: {
        type: DataTypes.ENUM('created', 'paid', 'failed'),
        defaultValue: 'created'
      }
  })
  
  return Payment
}