const express = require('express')
const api = express.Router()
const mApi = express.Router()

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

const MerrchantTransferRoute = require('./Routes/MerchantRoutes/TransferRoute.js')

// app.use route
mApi.use('merchant',MerchantRoute)



// User Error Middleware  
//  Setup Socket to update users balance realtime 

module.exports = api