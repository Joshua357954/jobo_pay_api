const express = require('express')
const router = express.Router()
const  { loginUser, registerUser, forgotPassword, resetPassword } = require('../../Controllers/UserControllers/AuthController.js')

// login

router.post('/login', loginUser)

//  Register
router.post('/register', registerUser)

//  PasswordReset
router.post('/resetPassword', resetPassword)

//  send password reset Link
router.get('/sendPasswordReset/:email', forgotPassword)


module.exports = router