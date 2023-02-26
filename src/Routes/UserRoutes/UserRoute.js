const express = require('express')
const router = express.Router()
const { getUser, fundUserWallet, updateTransactionPin, updateUserProfile } = require('../../Controllers/UserControllers/UserController.js')


router.get('/getUser/:userId', getUser)

//  update profile
router.put('/updateProfile/:data/:userId', updateUserProfile)

//  update pin   
router.put('/updateTransactionPin/:userId/:pin', updateTransactionPin)

//  fund wallet 
// confirm transaction with payment gatewat and fund with amount
router.put('/fundWallet/:userId/:amount', fundUserWallet)
 
  

module.exports = router