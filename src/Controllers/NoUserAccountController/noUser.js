const { Op } = require('sequelize')
const db = require('../../Database/models/index.js')

const User = db.User
const NoAccountUser = db.NoAccountUser 
const OtherTransaction = db.OtherTransaction

//  transfer
//  withdraw
//  fund 


// update balance and create transactions (for merchant)
const noUserBalanceUpdate = (user, transactionType, amount,merchantId, receiverId) => {
	
	// merchant id
	// const { user, transactionType, amount,merchantId, receiverId } = req.body

	const _receiver = await User.findByPk(receiverId)

	// discription msgs for different scenerios
	let _transfer = `TRANSFER #${amount} To ${_receiver.username} , Via MERCHANT ID - MRECH${merchantId}`
	let _withdraw =  `WITHDRAW #${amount} Form account , Via MERCHANT ID - MRECH${merchantId}`
	let _fund =  `Funded your account with #${amount} , Via MERCHANT ID - MRECH${merchantId}`

	// update balance 
	await NoAccountUser.update({
		balance: db.sequelize.literal(`balance ${transactionType == 'TRANSFER' || 'WITHDRAW' ? `${MINUS}` : `${PLUS}` } ${amount}`),
		where: { [Op.or]:{
			phone:user,
			email:user
		}}
	})

	// create transaction
	const createTransaction = await OtherTransaction.create(
		{
			transactionType,
			amount,
			discription: transactionType == 'transfer' ? 
			_transfer : transactionType == 'withdraw' ? _withdraw : _fund
		}
	)

}


module.exports = {
	noUserBalanceUpdate,
}
