const express = require('express')
const router = express.Router()

const { createPaymentLink, getUserPaymentLinks } = require('../../Controllers/UserControllers/PaymentLinkController.js')


router.get('/getPLinks/:userId', getUserPaymentLinks)

 
router.post('/create', createPaymentLink)




module.exports = router