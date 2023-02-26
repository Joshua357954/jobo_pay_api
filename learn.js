// const { z } = require('zod')

// const TransferSchema = z.object({name:z.string().min(3)}) 

// const NameSchema = z.string().max(20)

// const AgeSchema = z.number().min(1)

// const DOBSchema = z.date()


// module.exports = { DOBSchema, TransferSchema, AgeSchema, NameSchema,  }


// const Contract = {

// 	blockTitle :Object.keys(block)[0] || null,

// 	isContractValid : async(block) => {
// 		// const blockTitle = Object.keys(block)[0] || null
// 		if (!blockTitle) return Response(false,"Invalid Contract")
// 		// Do the real checks
// 		if (!block[blockTitle]?.length == contractLength) 
// 			return Response(false,"Invalid Contract")
// 	},

// 	isContractCashed : async(block,processer,processerId) => {
		
// 		const collectedUserId = blocked?.collectedUserId
		
// 		if (collectedUserId)
// 			const _collect = Contract.findOne({where:block})
// 			if (!_collect) 
// 				return Response(false,'Contracted Not Cashed') 

// 			return Response(true,'Contracted Cashed') 
// 	},

// 	cashContract:  async(block,processer,processerId) => {

// 		const amt = block.amount,  sId = block.senderId, rId = block.receiverId,time = block.dateTime
		
// 		switch(processer){

// 			case processer == 'USER':
// 				const ccdetails = {senderId:sId, receiverId:rId, amount:amt, contractDateTime:time , collectedUserId:processerId }
// 				Contract.create(ccdetails)
// 				// create transaction for each party
// 				const ucDetails = {senderId:sId,receiverId:rId,status:true,amount:amt,type: 'TRANSFER'}
// 				createUserTransaction()

// 				const _sender = User.findByPk(sId)
// 				const _receiver = User.findByPk(rId)

// 				// Update Users Account balance
// 				const _sAc = await User.update({balance: db.sequelize.literal(`balance - ${amt+Charges['walletTransfer']}`)},{
// 					where: {
// 						id:sId
// 					}
// 				})

// 				const _rAc = await User.update({balance: db.sequelize.literal(`balance + ${amt}`)},{
// 					where: {
// 						id:sId
// 					}
// 				})

// 			case processer == 'MERCHANT':
// 				const ccdetails = {senderId:sId, receiverId:rId, amount:amt, contractDateTime:time , collectedMerchantId:processerId }
// 				Contract.create(ccdetails)

// 				// create transaction
// 				const muDetails = {userId:sId, merchantId:processerId, transactionType:'TRANSFER', amount:amt, status:true, discription: 'Withdraw Money From User'}
// 				createMerchantUserTransaction(muDetails)

// 				// Settle User & Merchant
// 				const _suAc = await User.update({balance: db.sequelize.literal(`balance - ${amt+Charges['walletTransfer']}`)},{
// 					where: {
// 						id:sId
// 					}
// 				})

// 				const _rmAc = await Merchant.update({balance: db.sequelize.literal(`balance + ${amt}`)},{
// 					where: {
// 						id:processerId
// 					}
// 				})

// 		}
// 	},

// 	processContract: (block) => {
		
// 		try{

// 			for (let i = 0; i<block[blockTitle]?.length; i++){

// 				const currentBlock = block[blockTitle][i]

// 				if (!isContractValid(currentBlock)?.status){
// 					return Response(false,'Invalid Contract, Fraud')
// 					break
// 				}

// 				if (isContractCashed(currentBlock)?.status){
// 					continue
// 				}
// 				else:
// 					cashContract(currentBlock)
// 			}

// 			return Response(true,'Success')


// 		}catch(error){
// 			console.log(error)
// 			return Response(false,'An Error Occured While Processing Contract, Retry')
// 		}

// 	}

// }

// // Gift cash setup duplicate

// const { Op } = require('sequelize')
// const db = require('../../Database/models/index.js')
// const { createOutgoingTransaction } = require('./TransactionController.js')

// const User = db.User
// const GiftCash = db.CashToRedeem
// const NoAccountUser = db.NoAccountUser
// const OtherTransaction = db.OtherTransaction

// const Transaction = db.Transaction
// const WalletBeneficiary = db.WalletBeneficiary


// // params userId,phone,email
// const giftUserSetup = async(UserId,phone,email) => {

// 	//  check if user has a gift cash used or unUsed
// 	let totalBalance = 0

// 	const allGiftCash = await GiftCash.findAll({where:{
// 			[Op.or]:{
// 				phone,
// 				email
// 			}
// 	}})

// 	//  Check if user has any gift cash 
// 	if (!allGiftCash) return console.log("Pls this User does'nt have any gift cash")

// 	// create a transaction for the user 
// 	for (let i = 0;i < allGiftCash.length; i++ ){

// 		const currentGiftCash = allGiftCash[i]

// 		// Add unUsed money to App Balance
// 		if (!currentGiftCash.collected){
// 			totalBalance+= currentGiftCash.amount
// 		}

// 		// set All gift cash to collected
// 		await GiftCash.update({collected:true},{
// 				where:{
// 					id:currentGiftCash.id
// 				}}
// 			)

// 		// Create Transactions
// 		await Transaction.create({
// 			amount,
// 			from:currentGiftCash.senderId,
// 			UserId
// 		})

// 	}

// 	// or transfer the money from gift cash to main wallet balance
// 	if ( totalBalance ){
// 		await db.User.update({amount:totalBalance},{
// 			where:{
// 				id: UserId
// 			}
// 		})


// 	}  

// 	// Add the sender as a beneficiary
// 	await WalletBeneficiary.create({
// 					beneficiaryId:currentGiftCash.senderId,
// 					UserId
// 				})

// 	// we need to do otp confirmation to login to this account
// 	// Make person no come take free money


// }



