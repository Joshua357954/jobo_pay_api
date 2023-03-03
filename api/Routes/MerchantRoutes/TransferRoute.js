const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const { merchantToBankTransfer, merchantTransfer,
	merchantFromUserToUserTransfer } = require('../../Controllers/MerchantControllers/TransferController.js')




router.post('merchantTransfer',asyncHandler(merchantTransfer))

router.post('merchantToBankTransfer',asyncHandler(merchantToBankTransfer))

router.post('merchantFromUserToUserTransfer',asyncHandler(merchantFromUserToUserTransfer))







module,exports = router



















