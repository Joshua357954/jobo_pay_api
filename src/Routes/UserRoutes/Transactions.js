
const express = require('express')
const router = express.Router()

const { getUserTransactions } = require('../../Controllers/UserControllers/TransactionController.js')


// Get Users Transaction

router.get('/getUserTransaction/:userId',getUserTransactions)




module.exports = router