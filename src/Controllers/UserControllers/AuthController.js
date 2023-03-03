const bcrypt = require('bcrypt')
const { Op } = require('Sequelize')
const { Response } = require('../utils.js')
const { sendEmail } = require('./SendMail.js')
const db = require('../../Database/models/index.js')
const { giftUserSetup } = require('./GiftCashController.js')
const { UserLoginSchema, UserRegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } = require('./UserZodSchema.js')

const SALT = 12
const User = db.User
const PasswordReset = db.PasswordReset
const Merchant = db.Merchant




//  Register Merchant
//  Merchant Login

const loginUser = async(req,res) => {

	const { username, password } = UserLoginSchema.parse(req.body) 

	if ( !username.trim() || !password ) return res.send(Response(false,"Pls Fill The Form Correctly"))

	try{
		const foundUser = await User.findOne({where: {
											[Op.or]: { 
														username: username,
														email: username
													}
											}})

		if (!foundUser) return res.send(Response(false,"This user does not exists"))


		const isPasswordCorrect= await bcrypt.compare(password, foundUser.password)

		if (!isPasswordCorrect) return res.send(Response(false,"Incorrect Password"))

		return res.send(Response(true,foundUser))
	}

	catch(error){
		console.log(error)
		res.send(Response(false, "Login Error"))
	}


}




const registerUser = async(req,res) => {

	const {name,username,email,password,phone} = UserRegisterSchema.parse(req.body) 

	if (!name.trim() ||!username.trim() || !email.trim() || !password || !phone) 
			return res.send(Response(false,"Pls Fill The Form Correctly"))

	try{
		const foundUser = await User.findOne({where:{
				[Op.or]: {
					email :email.toLowerCase(),
					username : username.toLowerCase()
				}
			}})
		
		
		if( foundUser ) return res.send(Response(false,"User already exists"))

		const hashedPassword= await bcrypt.hash(password,SALT)

		const newUser= await User.create({name,username,email,password:hashedPassword,phone})

		res.status(200).send({status:true,response:newUser})
	
		// check if user used a gift cash
		
		// return giftUserSetup(newUser.id,phone,email)

		

	}

	catch(err){
		console.log(err)
		return res.send(Response(false,"An Error Occured"))
	}

}







const forgotPassword = async(req,res) => {
	
	const { email, owner } = ForgotPasswordSchema.parse(req.body) 

	const RANDOM_MULTIPLIER = 4000000

	let userData;
	let merchantData;

	try{

		// check if forgot password is for user or merchant
		switch(owner){
			case owner.toUpperCase() == 'USER':
				userData = await User.findOne({ where: {email} })
				if (!userData.id)
					return res.send(Response(false,`${email} email was not found :)`))
				break
			case owner.toUpperCase() == 'MERCHANT':
				merchantData = await Merchant.findOne({ where: {email} })
				if (!merchantData.id)
					return res.send(Response(false,`${email} email was not found :)`))
				break
		}
	
		  
		const RANDOM_NUM = Math.floor(Math.random()* RANDOM_MULTIPLIER)

		const hashString = await bcrypt.hash(RANDOM_NUM.toString(),15)

		const resetString = RANDOM_NUM.toString()


		//  start time & expiration time
		const begining_time = Date.now()
		const expiration_time = Date.now() + extra_minute


		//  Check the is an already made request before making a new one
		switch(owner){
			case owner.toUpperCase() == 'USER':
				isUserRequestAlreadyMade = await PasswordReset.findOne({ where:{ UserId:userData?.id } })
				// Delete Already made requests
				if (isUserRequestAlreadyMade)
					await PasswordReset.destroy({where:{ UserId: userData?.id}})
				break
			
			case owner.toUpperCase() == 'MERCHANT':
				isMerchantRequestAlreadyMade = await PasswordReset.findOne({ where:{ MerchantId:merchantData?.id } })
					// Delete Already made requests
					if (isMerchantRequestAlreadyMade)
						await PasswordReset.destroy({where:{ MerchantId: userData?.id}})
				break
		}
	
		const create_reset_block = await PasswordReset.create({
			resetString,
			createdTime: begining_time ,
			expiresAt: expiration_time ,
			UserId : userData ? userData.id : null,
			MerchantId: merchantData ? merchantData.id : null
		})

		console.log(create_reset_block)


		// Reset Link to Send
		const link = `localhost:3000/ForgottenPassword/${resetString}`
		const text_to_send =  `<h1>CODE :  ${resetString} </h1> <br> <br> \
							<a href=${link}>Click On this link to reset password</a>`
		
		console.log(resetString)

		// Sending De Mail
		await sendEmail(email,text_to_send)

		return res.send(Response(true,`A password reset email was sent to ${email} :),\nThe reset Link expires in 5 minutes`))


	}catch(error){
		console.log(error);
		res.send(Response(false,error))
	}
}




const resetPassword  = async(req,res) => {
	const { userId, resetString, newPassword, owner} = ResetPasswordSchema.parse(req.body) 

	let UserResetBlock;
	let MerchantResetBlock;

	try{
		
		UserResetBlock = await PasswordReset.findOne({ where:{ resetString, UserId:userId } })
		MerchantResetBlock = await PasswordReset.findOne({ where:{ resetString, MerchantId:userId } })

		if (!ResetBlock)
			return res.send(Response(false,'Invalid Reset Link, Check Email For Link'))


		const tokenEndTime = owner == "USER" ? UserResetBlock.expiresAt : MerchantResetBlock.expiresAt

		console.log("Logging",tokenEndTime, Date.now(), "Compare : ",tokenEndTime < Date.now())
		
		// check if expired
		if ( Date.now() > tokenEndTime ) {
			return res.send({status:false,response:'Reset Link Expired, Generate a new reset link'})
		
		}
		// hash password to update
		const hashed_password_to_update_with = await bcrypt.hash(newPassword,SALT)
		
		// update password
		switch(owner){
			case owner == "USER" :
				User.update({password:hashed_password_to_update_with},{
						where:{ id: userId } })
				break

			case owner == "MERCHANT":
				Merchant.update({password:hashed_password_to_update_with},{
						where:{ id: userId } })
				break
		}
		
		res.status(200).send(Response(true,"You have Successfully Reset You Password"))
	
		// Delete Password Reset Model 
		return  PasswordResetModel.destroy({ where:{ UserId:userId } })	


	}catch(error) {
		console.log(error)
		res.send(Response(false,error))
	}	
}





module.exports = {
	loginUser,
	registerUser,
	forgotPassword,
	resetPassword
}