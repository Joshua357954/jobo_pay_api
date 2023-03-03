
const db = require('../../Database/models/index.js')
const { CreateMerchantUserTransactionSchema } = require('./MerchantZodSchema.js')

const UserTransaction = db.Transaction
const MerchantTransaction = db.MerchantTransaction




// create transaction for user and merchant
function createMerchantUserTransaction (data) {
	const { userId, merchantId, transactionType, amount, status, discription } = CreateMerchantUserTransactionSchema.parse(data)

	const transactionData = {
		// withdaraw, deposit, transfer, received
		amount,
		status,
		discription,
		transactionType,	
	}

		
	// create transaction for user
	UserTransaction.create({...transactionData,fromType:'MERCHANT',fromId:merchantId,UserId:userId})

	// create transaction for merchant
	MerchantTransaction.create({...transactionData,userId,MerchantId:merchantId})

	// Send Users Alerts (SMS/EMAIL) | Merchant Push Notitfication
	return true
}




module.exports = { createMerchantUserTransaction }







