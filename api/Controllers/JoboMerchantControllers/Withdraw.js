const { Op } = require('sequelize')
const { Response } = require('../utils.js')
const { confirmOTP } = require('../otp.js')
const db = require('../../Database/models/index.js')
const { createNoUserTransaction } = require('./Transaction.js')
const { Charges } = require('../MerchantControllers/constants.js')

const { createSenderUserTransaction, createReceiverUserTransaction } = require('../UserControllers/TransactionController.js')


const DotIcon = '⚫'
const NairaIcon = '₦'
const User = db.User
const Merchant = db.Merchant
const NoAcUser = db.NoUserAccount
const OtherTransaction = db.OtherTransaction


// merchant
const userMerchantBankTransfer = async(req,res) => {
	const data = req.body
	const type = data.type
	const charge = Charges['bankTransfer']
	
	// cosnt { userMerchantId,userMerchantPin,amount,phone, otp, } = data

	// check if merchant has sufficient balance
	switch(type){
		
		case type == 'USER':
			
			const userMerchant = await User.findByPk(data.userMerchantId)
			
			if (userMerchant.balance < amount)
				return Response(false,'Insufficient Funds , Fund your account and try again')

			if (userMerchant.merchantPin != data.userMerchantPin) 
				return Response(false,'Incorrect Pin')


		case type == 'NoUser':
			
			const noAcUser = await NoAcUser.findOne({ where: {phone}})
			
			if (noAcUser.balance < data.amount)
				return Response(false,'Insufficient Funds , Fund your account and try again')

			// check otp
			if (noAcUser.otp != data.otp)
				return Response(false,'Incorrect Otp , Please Inputing wrong OTP for more than 5 time can get you barred .')
	}
	
  
	// Do the opay stuffs to transfer money from my merchant account


	switch(type){
		
		case type == "USER":		
			await User.update({amount: db.sequelize.literal(`balance - ${amount + Charges['bankTransfer']}`)},{where:{id:merchantId}})
			break 

		case type == "NoUser":
			await noAcUser.update({amount: db.sequelize.literal(`totalBalance - ${amount + Charges['bankTransfer']}`)},{where:{id:merchantId}})
			break
	}
	
	
	
	// create transaction for User / NoAcUser
	switch(type){
		
		case type == 'USER':
			// receiver transaction
			const receiver = `${bankName} -- ${accountName} -- ${accountNumber} `
			createSenderUserTransaction(senderId,receiver,true,amount,'USER','bankTransfer')
			break
		
		case type == 'NoUser'
			const discription = `${DotIcon} You Transfered ${NairaIcon}${amount}, to  ${accountName} - ${bankName} - ${accountNumber} `
			OtherTransaction.create({transactionType:'bankTransfer',amount,discription})
			break
	}

	return res.send(Response(true,"Bank Transfer Successful")) 
}






// merchantid,to,transferType,from or Fund User Account
const NoUserWalletTransfer = async(req,res) => {
	
	const { userMerchantId,receiver,amount,phone, otp } = req.body

	const _noAcUser = await NoAcUser.findOne({where: {phone},attributes:['totalBalance']})
	const receiver = await User.findOne({where:[Op.or]:{
		id:receiver,
		phone:receiver,
		email:receiver
	}})

	if (_noAcUser.totalBalance < amount)
		return res.send(Response(false,'Insufficient Funds , Fund your account and try again'))

	// check otp
	const isOtpValid = confirmOTP(phone,otp)
	if (!isOtpValid.status) 
		return res.send(Response(false,'The Authourization OTP is incorrect, please to that if you try more than five times you might be barred .'))
	
	// Debit merchant account
	await NoAcUser.update({totalBalance: db.sequelize.literal(`totalBalance - ${amount + Charges['walletTransfer']}`)},{where:{phone}})

	// Topup user/customer wallet
	await User.update({amount: db.sequelize.literal(`balance + ${amount}`)},{where:{id:receiver.id}})

	// create noAcUser transaction
	createNoUserTransaction( phone, 'transfer', amount, userMerchantId, receiver.id )

	// receiver transaction
	createReceiverUserTransaction(senderId,receiver.id,'USER',amount)

	return res.send(Response(true,'Transfer Successful'))
}




module.exports = {
	userMerchantBankTransfer,
	NoUserWalletTransfer
}
