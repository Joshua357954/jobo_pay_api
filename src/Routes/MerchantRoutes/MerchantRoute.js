
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const { merchantWithdraw, merchantUserDeposit } = require('../../Controllers/MerchantControllers/MerchantController.js')
const { updateMerchantPin, updateMerchantProfile } = require('../../Controllers/MerchantControllers/MerchantSettings.js')




router.post('fundMerchantWallet',asyncHandler(merchantWithdraw))

router.post('merchantDeposit',asyncHandler(merchantUserDeposit))

router.put('updateMerchantPin/:merchantId/:oldPin/:newPin',asyncHandler(updateMerchantPin))

router.put('updateMerchantProfile/:merchantId/:data',asyncHandler(updateMerchantProfile))





module.exports = router 

