
const { Response } = require('../utils.js')
const db = require('../../Database/models/index.js')


const DotIcon = '⚫'
const NairaIcon = '₦'
const User = db.User
const Merchant = db.Merchant
const Transaction = db.Transaction





const getUserTransactions = async(req,res) => {

	const { userId } = req.body

	if (!userId) return res.send(Response(false,"Pls Provide an Id"))

	try{
		const all_transactions = await Transaction.findAll({where: {UserId: userId}})

		return res.send(Response(true, all_transactions))
	}

	catch(error) {
		console.log(error)
		res.send(Response(false,"Error Fetching Transactions"))
	}

}

// withdraw 
// transfer 
// fund 
// received

const createSenderUserTransaction = async(senderId,receiverId,status,amount,fromType='USER',transactionType='transfer') => {

	const _receiver = await User.findByPk(receiverId)
	const isBankTransfer = () => transactionType == 'bankTransfer'

	const discription = `${DotIcon} You Transfered ${NairaIcon}${amount}, to 
								${isBankTransfer ? receiverId : `${_receiver.name} - @(${_receiver.username})`} `

	try{
		const senderTransaction = Transaction.create({
			discription ,
			status,  
			transactionType,
			amount,
			fromType,
			transactionType,
			fromId:senderId,
			UserId: transactionType == 'bankTransfer' ? senderId : 0

		})

	}catch(error){
		console.log(error)
		throw new Error('Error Creating Transaction')
	}
}





const createReceiverUserTransaction = async(senderId,receiverId,fromType='USER',amount,status=true,transactionType='received') => {
	
	let _sendr;

	if (fromType != 'PaymentLink')
		_sendr = await User.findByPk(senderId)
	else
		_sendr = senderId

	const _recevr = await User.findByPk(receiverId)

	const isPLink = () => fromType == 'PaymentLink' ? true : false

	// You Received 500 from Samuel - (@joshuabee)
	const discription = `${DotIcon} You Received ${NairaIcon}${amount}, From  ${isPLink ? senderId : _sendr.name} - (@${isPLink ? "PaymentLink" : _sendr.username})`

	try{
		if (!status) return console.log("Transaction Was Not Successful")

		const receiverTransaction = Transaction.create({
			discription ,
			status,
			transactionType,
			amount,
			fromType,
			fromId: fromType == 'PaymentLink' ? 0 : senderId,
			UserId:receiverId

		})
	}catch(error){
		console.log(error)
		throw new Error("Error Creating Receiver's Transaction")
	}
}




// sender -> Transfer
// Fund/Deposit
// receiver ->Withdraw
//receiver -> Cash Received


const createFundUserTransaction = async(UserId,amount,depositorType,status=true,merchantId=null,transactionType='fund') => {
	
	const _merchant = await Merchant.findByPk(merchantId)

	const discription = `${DotIcon} ${depositorType == 'MERCHANT' ? `Merchant-${_merchant.username}${_merchant.id}`: 'You' } Funded Your Account With ${NairaIcon}${amount}`
	
	try{
		await Transaction.create({
				discription, 
				status,
				transactionType:'fund',
				amount,
				fromType:depositorType,
				transactionType,
				fromId: depositorType == 'MERCHANT' ? merchantId: UserId,
				UserId
			})
		
	}catch(error){
		console.log(error)
		throw new Error('Error Creating Transaction')
	}
}



const createUserWithdrawTransaction = async(UserId,amount,merchantId,transactionType='withdraw',status=true) => {

	const _merchant = await Merchant.findByPk(merchantId)

	const discription = `${DotIcon} You Withdrew, ${NairaIcon}${amount}, From  Merchant-${_merchant.username}${_merchant.id}`
	
	try{
		await Transaction.create({
				discription ,
				status,
				transactionType,
				amount,
				fromType:'MERCHANT',
				fromId: merchantId,
				UserId
			})
		
	}catch(error){
		console.log(error)
		throw new Error('Error Creating Transaction')
	}
}



module.exports = { 
	createSenderUserTransaction,
	createReceiverUserTransaction,
	createFundUserTransaction,
	createUserWithdrawTransaction,
	getUserTransactions,
} 


