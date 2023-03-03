const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const { getUser, fundUserWallet, updateTransactionPin, updateUserProfile,toggleAllowMerchantTransaction } = require('../../Controllers/UserControllers/UserController.js')


router.get('/getUser/:userId', asyncHandler(getUser))

//  update profile
router.put('/updateProfile/:data/:userId', asyncHandler(updateUserProfile))

//  update pin   
router.put('/updateTransactionPin/:userId/:pin', asyncHandler(updateTransactionPin))

//  fund wallet 
// confirm transaction with payment gateway and fund with amount
router.put('/fundWallet/:userId/:amount', asyncHandler(fundUserWallet))
 

router.put('/toggleAllowMerchantTransaction/:userId', asyncHandler(toggleAllowMerchantTransaction))



module.exports = router