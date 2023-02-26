const express = require('express')
const router = express.Router()
const { getUserBankAccounts, addBankAccount, updateBankAccount, deleteBankAccount } = require('../../Controllers/UserControllers/BankAccountController.js')


//  get user bankAccount
router.get('/getUserBankAccounts/:userId', getUserBankAccounts)

//  Add banks Account 
router.post('/addBankAccount', addBankAccount)

//  update bank Acount
router.put('/updateBankAccount/:id/:userId/:data', updateBankAccount )

//  delete bank Account
router.delete('/deleteBankAccount/:id/:userId', deleteBankAccount)









module.exports = router