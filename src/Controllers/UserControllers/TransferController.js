const { Op } = require('sequelize')
const { Response } = require('../utils.js')
const db = require('../../Database/models/index.js')
const { SendMoneySchema } = require('./UserZodSchema.js')
const { addBeneficiary } = require('./BeneficiaryController.js')
const { createSenderUserTransaction, createReceiverUserTransaction } = require('./TransactionController.js')

const User = db.User
const NoAccountUser = db.NoAccountUser
const CashToRedeem = db.CashToRedeem




const sendMoney = async(req,res) => {
	let status = true
	const { senderId, receiverId, pin, amount } = SendMoneySchema.parse(req.body) 

	// If type == bank do some other things ..

	if (!senderId || !receiverId || !amount) return res.send(Response(false,"Missing Field"))

	try {
		// check if sender has sufficient balance
		const sender = await User.findOne({
			where: { id: senderId }
		})

		if (sender.balance < amount)
			return res.send(Response(false,"Insufficient Balance"))


		// send socket event to receiver to update balance
		res.send(Response(true,"Transfer Successful"))

		// remove from senders account
		await User.update(
			{ balance : db.sequelize.literal(`balance - ${amount}`) },
			{ where: { id: senderId } }
		)

		// Add to receivers account 
		await User.update(
			{ balance : db.sequelize.literal(`balance + ${amount}`) },
			{ where: { id: receiverId } }
		)

		// create transaction items for (sender)
		await createSenderUserTransaction(
			senderId,
			receiverId,
			status,
			amount
		)

		// create transaction item for (receiver)
		await createReceiverUserTransaction(
			senderId,
			receiverId,
			'USER',
			amount
		)

		// check if user is already a beneficiary 
		const isBeneficiary = await WalletBeneficiary.findOne({where:{
											beneficiaryId:receiverId,
											UserId:senderId
										}})
		// Add User as beneficiaries
		if (!isBeneficiary.id)
			addBeneficiary({beneficiaryId:receiverId}, type="WALLET", senderId)
	
		// Finish transaction
		return 'Finish'
	}

	catch(error) {
		console.log(error)
		return res.send(Response(false,"Error Sending Money"))
	}

}







const noAccountUserTransfer = async(req,res) => {
	// user = enum([name,phone])
	const { amount, pin, senderId, receiver, discription, secretKey } = req.body

	const sender = await User.findOne({
		where: { id: senderId }
	})

	if (sender.balance < amount)
		return res.send(Response(false,"Insufficient Balance"))

	// send socket event to receiver to update balance
	return res.send(Response(true,"Transfer Successful"))

	// Move on

	// remove from senders account
	await User.update(
		{ balance : db.sequelize.literal(`balance - ${amount}`) },
		{ where: { id: senderId } }
	)

	// check if no ac user exists
	const _foundNoAcUser = await NoAccountUser.findOne({
		where: {
			[Op.or]:{
				phone:receiver,
				email:receiver
			}
		}
	})

	// check if user exists 
	if (!_foundNoAcUser.id){
		const _createNAU = await NoAccountUser.create({
			totalBalance:amount,
			phone: typeof receiver == 'number' ? receiver : null,
			email: typeof receiver == 'number' ? null : receiver
		})
		console.log('New No Account User Created');
	}

	else {
		// Add to receivers NoAccount 
		await NoAccountUser.update(
			{ totalBalance : db.sequelize.literal(`balance + ${amount}`) },
			{ where: { id: receiverId } }
		)
	}


	//  create a gift cash (cash to redeem) for the no ac user
	const cashTRD = {	amount,discription,
						phone: typeof receiver == 'number' ? receiver : null,
						email: typeof receiver == 'number' ? null : receiver,
						'senderId':sender.id,'senderName':sender.name,secretKey
					}

	// Create cash to redeem
	await CashToRedeem.create(cashTRD)

	console.log('Transfer to NoAccountUser Successful');

}


module.exports = { sendMoney }