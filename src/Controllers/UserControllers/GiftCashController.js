const { Op } = require('sequelize')
const { confirmOtp } = require('../otp.js')
const db = require('../../Database/models/index.js')

const { createSenderUserTransaction, createReceiverUserTransaction, createFundUserTransaction } = require('./TransactionController.js')

const User = db.User
const GiftCash = db.CashToRedeem

const NoAccountUser = db.NoAccountUser
const OtherTransaction = db.OtherTransaction

const Transaction = db.Transaction
const WalletBeneficiary = db.WalletBeneficiary

// get no ac user
// remove cash from noUserAc to real user ac
// transfer transactions history from otherTransactions to user's transaction
// add all users that send you money as beneficiary

// gift cash -> received
// other transaction -> (transfer,withdraw,fund)

// params userId,phone,email
const giftUserSetup = async(UserId,otp,phone,email) => {

	const _noAcUser = await NoAccountUser.findAll({where:{
			[Op.or]:{
				phone,
				email
			},include:['CashToRedeem','OtherTransactions']
	}})

	//  Check if user's 'no acct' exists
	if (!_noAcUser.id) return console.log("Pls this User does not exists")


	// create a transaction for the noAcUser (cash to redeem) 
	for (let i = 0;i < _noAcUser.CashToRedeem.length; i++ ){

		const currentGiftCash = allGiftCash[i]


		// Add unUsed money to App Balance
		// set All gift cash to collected
		await GiftCash.update({collected:true},{
				where:{
					id:currentGiftCash.id
				}}
			)

		// Create Transactions
		await createTopUpTransaction({
			amount,
			fromType:'USER',
			from:currentGiftCash.senderId,
			UserId
		})

		// create receiver transaction 
		createReceiverUserTransaction(currentGiftCash.senderId,UserId,'USER',true)
		
		// Add the sender as a beneficiary ( Make all senders beneficiaries )
		await WalletBeneficiary.create({
				beneficiaryId:currentGiftCash.senderId,
				UserId
			})
	}


	// create other transaction details for the noAcUser (otherTransactionsS) 
	for (let i = 0;i < _noAcUser.CashToRedeem.length; i++ ){

		const currentT = _noAcUser.OtherTransactions[i]

		switch(currentT.transactionType){
			case 'transfer' :
				createSenderUserTransaction(UserId,currentT.receiverId,null,currentT.amount)
			case 'withdraw' :
				createUserWithdrawTransaction(UserId,amount,merchantId,transactionType='withdraw')
			case 'fund' :
				createFundUserTransaction(UserId,amount,'MERCHANT',true,merchantId)

		}
	}

	// we need to do otp confirmation to login to this account
	// Make person no come take free money
	const isOtpValid = await confirmOtp(phone||email,otp)


	// or transfer all the money from noUserAc to its real account
	if ( _noAcUser.totalBalance && isOtpValid.status){
		await db.User.update({balance: _noAcUser.totalBalance},{
			where:{
				id: UserId
			}
		})
	}  

	if (isOtpValid.status)
		return true
	
	// if otp is not valid return false
	else 
		return false


}



module.exports = { giftUserSetup }