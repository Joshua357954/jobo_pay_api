const { z } = require('zod')
const { Charges } = require('./constants.js')
const { Response, _Error } = require('../utils.js')
const { MerchantToBankTransferSchema, MerchantWalletTransferSchema, MerchantFromUserToUserTransferSchema } = require('./MerchantZodSchema.js')
const { merchantBankTransfer, merchantToWalletTransfer, merchantUserToUserTransfer } = require('./ImportantFunctions.js')



// transfer from user account to other account
async function merchantToBankTransfer (req,res) {
	
	const { merchantId,merchantPin,userId,amount,accountNumber,bankName,accountName } = MerchantToBankTransferSchema.parse(req.body) 

	const RTNData = { merchantId,merchantPin,userId,amount,accountNumber,bankName,accountName }

	const _transfer = await merchantBankTransfer(RTNData)

	if (!_transfer.status)
		return res.send(Response(false,_transfer.message))

	// if transfer is ok
	return res.status(200).send(_transfer)

}




async function merchantTransfer (req,res)  {

	const { merchantId,amount,merchantPin,userId } = MerchantWalletTransferSchema.parse(req.body) 

	const TFData = { merchantId,amount,merchantPin,userId }

	const _wTransfer = walletTransfer(TFData)

	if (!_wTransfer.status)
		return res.status(500).send(_wTransfer)

	// if transaction successful
	return res.status(200).send(_wTransfer)

}


async function merchantFromUserToUserTransfer  (req,res)  {
	// params from zod
	const { merchantId,amount,fromUserId,receiverId,fromUserPin} = MerchantFromUserToUserTransferSchema.parse(req.body) 

	const UTUTransfer = { merchantId,amount,fromUserId,receiverId,fromUserPin}

	const _merchantUTU = merchantUserToUserTransfer(UTUTransfer)

	if (!_merchantUTU.status)
		res.status(401).send(_merchantUTU)

	// if everything is ok
	return res.status(200).send(_merchantUTU)
}


module.exports = {
	merchantTransfer,
	merchantToBankTransfer,
	merchantFromUserToUserTransfer
}