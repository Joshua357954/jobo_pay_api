const { Op } = require('sequelize')
const db = require('../../Database/models/index.js')

const User = db.User
const Merchant  = db.Merchant

// 
const NoAccountUser = db.NoAccountUser 
const OtherTransaction = db.OtherTransaction





const merchantFromNoUserToBankTransfer = async(data) => {

	const charge = Charges['bankTransfer']
	 
	const { merchantId, merchantPin, noUserId, noUserOtp, amount, accountNumber,bankName,accountName } = data

	// check if merchant has sufficient balance
	const _merchant = await Merchant.findByPk(merchantId)
	if (_merchant.balance < amount)
		return Response(false,'Insufficient Funds , Fund your account and try again')

	if (_merchant.pin != merchantPin) 
		return Response(false,'Incorrect Pin')
  
	// Do the opay stuffs to transfer money from my merchant account

	// if payment is not successful 
		// return do stuffs

	await Merchant.update({amount: db.sequelize.literal(`balance - ${amount + Charges['bankTransfer']}`)},{where:{id:merchantId}})

	// create transaction
	

	return Response(true,"Bank Transfer Successful")
}



// merchantid,to,transferType,from or Fund User Account
const merchantWalletTransfer = async(data) => {
	const { merchantId,amount,merchantPin,userId } = data

	const _user = await User.findByPk(userId)
	const _merchant = await Merchant.findByPk(merchantId)

	if (_merchant.balance < amount)
		return Response(false,'Insufficient Funds , Fund your account and try again')

	if (_merchant.pin != merchantPin) 
		return Response(false,'Incorrect Pin')

	// Debit merchant account
	await Merchant.update({amount: db.sequelize.literal(`balance - ${amount + Charges['walletTransfer']}`)},{where:{id:merchantId}})

	// Topup user/customer wallet
	await User.update({amount: db.sequelize.literal(`balance - ${amount}`)},{where:{id:userId}})

	// create transaction
	const _transactionData = { userId, merchantId, transactionType:'TRANSFER',amount, status:true, discription:null }
	createMerchantUserTransaction(_transactionData)

	return Response(true,'Transfer Successful')
}

// no acct scenerio
const merchantNoUserToUserTransfer = async(data) => {
	
	const { merchantId,amount,fromUserId,receiverType,receiverId, fromUserOpt } = data

	const _fromUser = await NoAccountUser.findByPk(fromUserId)
	const _receiver = await User.findByPk(receiverId)
	const _noAcReceiver = await NoAccountUser.findByPk()
	const _merchant = await Merchant.findByPk(merchantId)

	// no ac 
	const _noAccount = await NoAccountUser.findByPk(fromUserId)
	// ots insted of pin

	if (_fromUser.balance < amount )
		return Response(false,`${_fromUser.name || _fromUser.username},`,'Insufficient Funds')

	if (_fromUser.otp != fromUserOpt) 
		return Response(false,'Otp is not correct')

	// Insentive for merchant
	// await Merchant.update({amount: db.sequelize.literal(`balance + 0`)},{where:{id:merchantId}})

	// Debit fromUser wallet or noUser
	await User.update({amount: db.sequelize.literal(`balance - ${amount - Charges['walletTransfer']}`)},{where:{id:userId}})
	
	// Topup receivers wallet
	
	switch(receiverType){
		
		case receiverType == 'USER':
			await User.update({balance: db.sequelize.literal(`balance + ${amount}`)},{where:{id:userId}})
		
		case receiverType == 'NOACCOUNTUSER'
			await NoAccountUser.update({totalBalance: db.sequelize.literal(`totalBalance + ${amount}`)},{where:{id:receiverId}})
	}
	
	// create transaction
	const _transactionData = { userId, merchantId, transactionType:'TRANSFER',amount, status:true, discription:null }
	createMerchantUserTransaction(_transactionData)

	return Response(true,'Successful')
}



module.exports = {
	merchantBankTransfer,
	merchantWalletTransfer,
	merchantUserToUserTransfer,
}








