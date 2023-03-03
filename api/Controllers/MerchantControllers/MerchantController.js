const { z } = require('zod')
const { Charges } = require('./constants.js')
const { Response, _Error } = require('../utils.js')
const db = require('../../Database/models/index.js')
const { createMerchantUserTransaction } = require('./Transaction.js')
const { MerchantWithdrawSchema,MerchantUserDepositSchema } = require('./MerchantZodSchema.js')

const User = db.User
const Merchant = db.Merchant



// withdraw from account  
async function merchantWithdraw (req,res,next) {
	
	let { merchantId,merchantPin,amount,userId, userPin } = MerchantWithdrawSchema.parse(req.body) 

	// initialize db objects
	const _user = await User.findByPk(userId)
	const _merchant = await Merchant.findByPk(merchantId)

	// check if pin is correct
	if (_user.pin != pin)
		return res.send(Response(false,"Incorrect Pin"))

	// remove from users account
	const chargeUser = await User.update({amount: db.sequelize.literal(`amount - ${amount}`)},{ where: { userId:userId}})

	// add to merchants account 
	const topupMerchant = await Merchant.update({amount: db.sequelize.literal(`amount + ${amount}`)},{ where: { id:merchantId }})

	// create transactions
	const _transactionData = { userId, merchantId, transactionType:'WITHDRAW',amount, status:true, discription:null }
	createMerchantUserTransaction(_transactionData)

	return res.send(Response(true,'Withdraw Successful'))
} 




// phone/gmail,merchantid,otp
// //  Redeem gift cash for people with out bank
// 	// send them transaction notification for successful transaction

// amount,merchantid,transaction-status
// // fund merchant account






// deposit to user account
async function merchantUserDeposit (req,res) {
	
	let { merchantId,merchantPin,amount,userId } = MerchantUserDepositSchema.parse(res.body) 
	
	// initialize db
	const _user = await User.findByPk(userId)
	const _merchant = await Merchant.findByPk(merchantId)

	// check merchant balance
	if (_merchant.balance < amount)
		return Response(false,'Insufficient Funds , Fund your account and try again')

	// check merchant pin
	if (_merchant.pin != merchantPin) 
		return Response(false,'Incorrect Pin')

	// Debit merchant account
	await Merchant.update({amount: db.sequelize.literal(`balance - ${amount + Charges['walletDeposit']}`)},{where:{id:merchantId}})

	// Topup user/customer wallet
	await User.update({amount: db.sequelize.literal(`balance - ${amount}`)},{where:{id:userId}})

	// create transaction
	const _transactionData = { userId, merchantId, transactionType:'DEPOSIT',amount, status:true, discription:null }
	createMerchantUserTransaction(_transactionData)

	res.send(Response(true,'Deposit Successful'))
}



module.exports = {
	merchantWithdraw,
	merchantUserDeposit,
}






