const { z } = require('zod')
const { Response} = require('../utils.js')
const db = require('../../Database/models/index.js')
const { UpdateMerchantProfileSchema, UpdateMerchantPinSchema } = require('./MerchantZodSchema.js')

const Merchant = db.Merchants



// update profile
const updateMerchantProfile = async(req,res) => {
	
	const { merchantId, data } = UpdateMerchantProfileSchema.parse(req.params) 

	const profile_to_update = Merchant.update(data,{
		where:{ id: merchantId }
	})

	return res.send(Response(true,"Profile Update Successful"))

}



// update pin
const updateMerchantPin = async(req,res) => {
	
	const { merchantId, oldPin, newPin } = UpdateMerchantPinSchema.parse(req.params) 

	const _merchant = await Merchant.findByPk(merchantid)

	if (_merchant.pin != oldPin)
		return res.send(Response(false,'Incorrect Old Pin'))

	const create_update_pin = await Merchant.update({pin},{
		where: {
			id: userId
		}
	})

	return res.send(Response(true,"Success"))

}







module.exports = { 
	updateMerchantPin,
	updateMerchantProfile,
}











