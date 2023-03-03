const db = {};

const { Sequelize, DataTypes } = require('sequelize');

const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.json')[env];

const sequelize = new Sequelize(config);

db.sequelize = sequelize
db.Sequelize = Sequelize
db.DataTypes = DataTypes


db.User = require('./UserModels/User.js')(sequelize,DataTypes)
db.Contract = require('./ContractModels/Contract.js')(sequelize,DataTypes,db.User)
db.Merchant = require('./MerchantModels/Merchant.js')(sequelize,DataTypes)
db.Transaction = require('./UserModels/Transaction.js')(sequelize,DataTypes,db.User)
db.MerchantTransaction = require('./MerchantModels/MerchantTransaction.js')(sequelize,DataTypes,db.User)
db.Notification = require('./UserModels/Notification.js')(sequelize,DataTypes)
db.BankBeneficiary = require('./BeneficiaryModel/BankBeneficiary.js')(sequelize,DataTypes)
db.WalletBeneficiary = require('./BeneficiaryModel/WalletBeneficiary.js')(sequelize,DataTypes,db.User)

//  No Account User
db.NoAccountUser = require('./GiftCashModel/noAccountUser.js')(sequelize,DataTypes)
db.CashToRedeem = require('./GiftCashModel/CashToRedeem.js')(sequelize,DataTypes,db.User)
db.OtherTransaction = require('./GiftCashModel/otherTransactions.js')(sequelize,DataTypes)

db.BankAccount = require('./UserModels/BankAccount.js')(sequelize,DataTypes)
db.PasswordReset = require('./UserModels/PasswordReset.js')(sequelize,DataTypes)

//  Payment Link
db.PaymentLink = require('./PaymentLinkModels/PaymentLink.js')(sequelize,DataTypes)
db.Payment = require('./PaymentLinkModels/Payment.js')(sequelize,DataTypes)




// Relationships

//  User |x| Transaction
db.User.hasMany(db.Transaction ,{as:'Transaction'})
db.Transaction.belongsTo(db.User)

//  User |x| Notification
db.User.hasMany(db.Notification ,{as:'Notification'})
db.Notification.belongsTo(db.User)

//  User |x| WalletBeneficiary
db.User.hasMany(db.WalletBeneficiary ,{as:'WalletBeneficiary'})
db.WalletBeneficiary.belongsTo(db.User)

//  User |x| BankBeneficiary
db.User.hasMany(db.BankBeneficiary ,{as:'BankBeneficiary'})
db.BankBeneficiary.belongsTo(db.User)

// //  User |x| BankAccount
db.User.hasMany(db.BankAccount,{as:'BankAccount'})
db.BankAccount.belongsTo(db.User)

db.User.hasOne(db.PasswordReset,{as:'PasswordReset'})
db.PasswordReset.belongsTo(db.User,{foreignKey: {allowNull:true}})

//  No Account User
db.NoAccountUser.hasMany(db.CashToRedeem, {as:'NoAccountUser'})
db.OtherTransaction.belongsTo(db.NoAccountUser)
db.CashToRedeem.belongsTo(db.NoAccountUser)

//  -----  Merchant   -------
db.Merchant.hasOne(db.PasswordReset,{as:'MerchantPasswordReset'})
db.PasswordReset.belongsTo(db.Merchant,{foreignKey: {allowNull:true}})

db.Merchant.hasMany(db.MerchantTransaction,{as:'MerchantTransaction'})
db.MerchantTransaction.belongsTo(db.Merchant)

//  ---------- Payment ----- 
db.PaymentLink.hasMany(db.Payment,{as:'PaymentLink'})
db.Payment.belongsTo(db.PaymentLink)


module.exports = db;

require('../seeders/index.js')
