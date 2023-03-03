const { Op } = require('sequelize')
const { Response } = require('../utils.js')
const db = require('../../Database/models/index.js')
const { GetUserSchema, FundWalletSchema, UpdateUserProfileSchema, UpdateTransactionPinSchema } = require('./UserZodSchema.js')
const { createFundUserTransaction } = require('./TransactionController.js')

const User = db.User
const NoAccountUser = db.NoAccountUser




const getUser = async(req,res) => {

	const { userId } = GetUserSchema.parse(req.params) 

	// res.send("User 1 Joshua")

	const _user = await User.findByPk(userId)
	//delete _user.pin

	return res.send(Response(true,{..._user,pin:'****'}))
}


const updateUserProfile = (req,res) => {
	const { data, userId } = UpdateUserProfileSchema.parse(req.params) 

	if (!data || !userId) return res.send(Response(false,"Missing Fields"))

	try{
		const profile_to_update = User.update(data,{
			where:{ id: userId }
		})

		return res.send(Response(true,"Profile Update Successful"))
	}

	catch(error){
		console.log(error)
		return res.send(Response(false,"Error Updating Profile"))
	}

}



const fundUserWallet = async(req,res) => {
	const { userId, amount } = FundWalletSchema.parse(req.params)  

	if ( !userId || !amount) return res.send(Response(false,"Missing Field"))

	try{
		const wallet_to_fund = await User.update(
			{ balance: db.sequelize.literal(`balance + ${amount}`)} ,{
			where: {
				id: userId
			}
		})
		
		// Create transaction
		await createFundUserTransaction(userId,amount,'USER')

		return res.send(Response(true,"Wallet Funding Successful"))

		
		
	}

	catch(error){
		console.log(error)
		return res.send(Response(false, 'Error Funding Walllet'))
	}


}


const updateTransactionPin = async(req,res) => {

	const { userId, pin } = UpdateTransactionPinSchema.parse(req.params) 

	if (!userId || !pin) return res.send(Response(true,"Missing Fields"))

	try{

		const create_update_pin = await User.update({pin},{
			where: {
				id: userId
			}
		})

		return res.send(Response(true,"Success"))
	}

	catch(error) {
		console.log(error)
		return res.send(Response(false,"Error Creating Pin"))
	}

}

//  get no ac users cash -> total balance


//  user inquiry ( name, balance ) wallet or no account 
const userInquiry = async(req,res) => {
	// inquiryType = (user-details,balance)
	const { user, inquiryType } = req.body

	const _acUser = await User.findOne({ 
		where: {
			[Op.or]:{
				username:user,
				phone:user
			}} 
		})

	if (_acUser.id)
		return res.send(Response(true,_acUser))

	// check if user in no account catigory
	const _noAcUser =  await NoAccountUser.findOne({
		where: {
			[Op.or]: {
				phone:user,
				email:user
			}
		}
	})
	
	if (_noAcUser.id) 
		return res.send(Response(true,{type:'NoAccountUser',..._noAcUser}))

	else 
		return res.send(Response(false,'Pls this user does not exist'))
}


// auth required
const toggleAllowMerchantTransaction = async(req,res) => {
	const { userId } = req.params


	const _user = await User.update(
		{allowMerchantTransactions:db.sequelize.literal(`!allowMerchantTransactions`)},
		{ where: {
			id:userId
		}}
	)

	return _user && res.send(Response(true,'Success'))
}




module.exports = {
	getUser,
	fundUserWallet,
	updateTransactionPin,
	updateUserProfile,
	userInquiry,
	toggleAllowMerchantTransaction
}