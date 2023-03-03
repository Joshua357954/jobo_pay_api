const { Op } = require('sequelize')
const { sendOtp } = require('../otp.js')
const db = require('../../Database/models/index.js')


const DotIcon = '⚫'
const NairaIcon = '₦'
const User = db.User
const NoAccountUser = db.NoAccountUser 
const OtherTransaction = db.OtherTransaction

// // withdraw to bank account ( user, noUser )
// user -> withdraw
// noUser -> transfer

// // withdraw to wallet -> to UserWallet or to NoUserWallet
// user -> withdraw from other user ( scan )
// noUser -> deposit ( from NoUserWallet to User Wallet )


// Auth -> User = JoboMerchantPin 
// Auth -> NoUser = OTP 


// update balance and create transactions (for merchant)

async function createNoUserTransaction (user, transactionType, amount,merchantId, receiverId)  {
	

	const isBankTransfer = () => transactionType == 'bankTransfer'
	// merchant id
	// const { user, transactionType, amount,merchantId, receiverId } = req.body

	const _receiver = '' 
	if (receiverId) _receiver =  await User.findByPk(receiverId)

	// discription msgs for different scenerios
	let _transfer = `TRANSFER ${NairaIcon}${amount} To ${isBankTransfer ? receiverId : _receiver.username} , Via MERCHANT - ${merchantId}`
	let _withdraw =  `WITHDRAW ${NairaIcon}${amount} Form account , Via MERCHANT  - ${merchantId}`
	let _fund =  `Funded your account with ${NairaIcon}${amount} , Via MERCHANT  - ${merchantId}`


	// create transaction
	const createTransaction = await OtherTransaction.create(
		{
			transactionType,
			amount,
			discription: transactionType == 'transfer' || 'bankTransfer' ? 
			_transfer : transactionType == 'withdraw' ? _withdraw : _fund
		}
	)

}


const apiUrl = 'https://jdn9zk.api.infobip.com'
const secret = '9255362c6180b1b6f46807252bf90987-bded65fe-e189-4931-bdbd-83f056a5cde1'

// authType  -> transfer, withdraw
// 
async function sendAuthenticationOtp (req,res) {

	const {user,merchantId,authType,time,amount,receiver} = req.body

	const isTransfer = () => authType == 'transfer' || 'bankTransfer'

	// const message = `Merchant - ${merchantId} ,\nWant's to ${authType} money \nAmt: ${amount} ${isTransfer ? `\nReceiver:${receiver}`} ,\nTime: ${time}`

	// send otp
	// sendOtp(user)

	// send otp via sms using twilio
	//sendMessage(message,otp)
	

}







module.exports = {
	createNoUserTransaction,
	sendAuthenticationOtp
}








