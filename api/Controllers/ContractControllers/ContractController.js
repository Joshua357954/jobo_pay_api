const { z } = require('zod')
const { Response } = require('../utils.js')
const db = require('../../Database/models/index.js')
const { Charges } = require('../MerchantControllers/constants.js')
const { createSendUserTransaction, createReceiverUserTransaction } = require('../UserControllers/TransactionController.js')
const { createMerchantUserTransaction } = require('../MerchantControllers/Transaction.js')

const User = db.User
const Merchant = db.Merchant
const Contract = db.Contract

const contractLength = 5

// contract
	// contractHash -> an encrypted string that contains -
	// (contract owner, senderId , amount)

	// contractKey

// process contract -> [Array]
	
	// check if this contract is from a user
	
	// check if contract is correct
	
	// cash contract from senders account

	// after every successful contract process ,return a new contract key

	// check if contract has been cashed

	//  cash transaction function ( to settle the both parties )


// 

// contract: [{ name:joshua, time:3:10 },{ name:jane, time:2:45 }]

// processer -> (user,merchant), processerId, contract




//  offline payment zod schema

const contractSchema = z.object({ 
	senderId: z.number().int(),
	receiverId: z.number().int(),
	amount: z.number(),
	dateTime: z.date()
 })


const ProcesserSchema = z.enum('USER','MERCHANT')

const ProcesserId = z.number().int()



class OfflinePaymentContract {

	constructor(processer,processerId,contract) {
	 
	  this.blockTitle = Object.keys(block)[0] || null
	  this.processer = ProcesserSchema.parse(processer)
	  this.processerId = ProcesserId.parse(processerId)
	  this.contract = ContractSchema.parse(contract) 
	}



	async isContractValid (block) {
		// const blockTitle = Object.keys(block)[0] || null
		if (!this.blockTitle) return Response(false,"Invalid Contract")
		// Do the real checks
		if (!block[this.blockTitle]?.length == contractLength) 
			return Response(false,"Invalid Contract")
	}



	async isContractCashed (block) {
		
		const collectedUserId = blocked?.collectedUserId
		
		if (collectedUserId){
			const _collect = Contract.findOne({where:block})
			if (!_collect) 
				return Response(false,'Contracted Not Cashed') 

			return Response(true,'Contracted Cashed')
		} 
	}


	async cashContract (block) {

		const amt = block.amount,  sId = block.senderId, rId = block.receiverId,time = block.dateTime
		
		switch(this.processer){

			case this.processer == 'USER':
				
				// create contract
				const ccdetails = {senderId:sId, receiverId:rId, amount:amt, contractDateTime:time , collectedUserId:processerId }
				Contract.create(ccdetails)
				
				// create transaction for each party
				// (senderId,receiverId,status,amount,fromType='USER',transactionType='transfer'
				createSendUserTransaction(sId,rId,true,amt,'USER','transfer')
				createReceiverUser(sId,rId,true,amt,'USER','received')

				const _sender = User.findByPk(sId)
				const _receiver = User.findByPk(rId)

				// Update Users Account balance
				const _sAc = await User.update({balance: db.sequelize.literal(`balance - ${amt+Charges['walletTransfer']}`)},{
					where: {
						id:sId
					}
				})

				const _rAc = await User.update({balance: db.sequelize.literal(`balance + ${amt}`)},{
					where: {
						id:rId
					}
				})

			

			case this.processer == 'MERCHANT':
				// create contract
				const merchantCCDetails = {senderId:sId, receiverId:rId, amount:amt, contractDateTime:time , collectedMerchantId:this.processerId }
				Contract.create(merchantCCDetails)

				// create transaction
				const muDetails = {userId:sId, merchantId:this.processerId, transactionType:'TRANSFER', amount:amt, status:true, discription: 'Withdraw Money From User'}
				createMerchantUserTransaction(muDetails)

				// Settle User & Merchant
				const _suAc = await User.update({balance: db.sequelize.literal(`balance - ${amt+Charges['walletTransfer']}`)},{
					where: {
						id:sId
					}
				})

				const _rmAc = await Merchant.update({balance: db.sequelize.literal(`balance + ${amt}`)},{
					where: {
						id:this.processerId
					}
				})

		}
	}


	async  processContract ()  {
		
		try{

			for (let i = 0; i<this.contract[this.blockTitle]?.length; i++){

				const currentBlock = this.contract[this.blockTitle][i]

				if (!this.isContractValid(currentBlock)?.status){
					return Response(false,'Invalid Contract, Fraud')
					break
				}

				if (this.isContractCashed(currentBlock)?.status){
					continue
				}
				else 
					this.cashContract(currentBlock)
			}

			return Response(true,'Success')


		}catch(error){
			console.log(error)
			return Response(false,'An Error Occured While Processing Contract, Retry')
		}

	}


}





const processAllContracts = async(req,res) => {

	const { processer, processerId, contract } = req.body

	const paymentContract = new OfflinePaymentContract(processer,processerId,contract)

	// call process contract method
	const isPaymentSuccessful = paymentContract.processContract()

	if (!isPaymentSuccessful.status )
		return res.status(501).send(isPaymentSuccessful)

	else
		return res.status(200).send(isPaymentSuccessful)

}






module.exports = {
	processAllContracts,
}



