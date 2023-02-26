
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const { sendMoney } = require('../../Controllers/UserControllers/TransferController.js')


// send money
router.post('/sendMoney',asyncHandler(sendMoney))



module.exports = router

