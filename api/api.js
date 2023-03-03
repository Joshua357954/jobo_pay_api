const express = require('express')
const api = express.Router()
const merchantApi = express.Router()
const { Response } = require('./Controllers/utils.js')




// All Api Routes
const UserRoute = require('./Routes/UserRoutes/UserRoute.js')
const AuthRoute = require('./Routes/UserRoutes/AuthRoute.js')
const ContractRoute = require('./Routes/UserRoutes/ContractRoute.js')
const TransferRoute = require('./Routes/UserRoutes/TransferRoute.js')
const BankAccountRoute = require('./Routes/UserRoutes/BankAccount.js')
const TransactionRoute = require('./Routes/UserRoutes/Transactions.js')
const BeneficiaryRoute = require('./Routes/UserRoutes/BeneficiaryRoute.js')

 
api.use('/user', UserRoute)
api.use('/auth', AuthRoute)
api.use('/contract',ContractRoute)
api.use('/transfer', TransferRoute)
api.use('/bankAccount', BankAccountRoute)
api.use('/transaction', TransactionRoute)
api.use('/beneficiary', BeneficiaryRoute)


//  Merchant Routes
const MerchantAuthRoute = require('./Routes/MerchantRoutes/AuthRoute.js')

const MerchantRoute = require('./Routes/MerchantRoutes/MerchantRoute.js')

const MerchantTransferRoute = require('./Routes/MerchantRoutes/TransferRoute.js')

// app.use route
merchantApi.use('/merchant',MerchantRoute)



// User Error Middleware
api.use((error,req,res,next) => {
	console.log(error)
	res.send(Response(false,error.toString()))
})

//  Setup Socket to update users balance realtime 

module.exports = api