
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const { merchantLogin, registerMerchant } = require('../../Controllers/MerchantControllers/AuthController.js')





router.post('merchantLogin',asyncHandler(merchantLogin))


router.post('registerMerchant',asyncHandler(registerMerchant))






module.exports = router





