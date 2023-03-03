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
	const DotIcon = '⚫'
	const NairaIcon = '₦'
	// merchant id
	// const { user, transactionType, amount,merchantId, receiverId } = req.body

	const _receiver = await User.findByPk(receiverId)

	// discription msgs for different scenerios
	let _transfer = `TRANSFER ${NairaIcon}${amount} To ${_receiver.username} , Via MERCHANT - ${merchantId}`
	let _withdraw =  `WITHDRAW ${NairaIcon}${amount} Form account , Via MERCHANT  - ${merchantId}`
	let _fund =  `Funded your account with ${NairaIcon}${amount} , Via MERCHANT  - ${merchantId}`


	// update balance 
	await NoAccountUser.update({
		totalBalance: db.sequelize.literal(`totalBalance ${transactionType == 'TRANSFER' || 'WITHDRAW' ? `${MINUS}` : `${PLUS}` } ${amount}`),
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
			discription: transactionType == 'TRANSFER' ? 
			_transfer : transactionType == 'WITHDRAW' ? _withdraw : _fund
		}
	)

}


module.exports = {
	noUserBalanceUpdate,
}
