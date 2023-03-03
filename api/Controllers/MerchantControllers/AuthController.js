
const bcrypt = require('bcrypt')
const { Op } = require('Sequelize')
const { Response } = require('../utils.js')
const db = require('../../Database/models/index.js')
const {MerchantLoginSchema,RegisterMerchantSchema} = require('./MerchantZodSchema.js')

const SALT = 11
const User = db.User
const Merchant = db.Merchant



const merchantLogin = async(req,res) => {

	const { username, password } = MerchantLoginSchema.parse(req.body) 

	// Merchant login controller
	const foundMerchant = await Merchant.findOne({where: {
										[Op.or]: { 
													username: username,
													phone: parseInt(username)
												}
										}})
	
	// check if merchant already exists
	if (!foundMerchant) return res.send(Response(false,"This Merchant does not exists"))

	const isPasswordCorrect= await bcrypt.compare(password, foundMerchant.password)
	
	// check if password is correct
	if (!isPasswordCorrect) return res.send(Response(false,"Incorrect Password"))

	return res.send(Response(true,foundMerchant))

}




const registerMerchant = async(req,res) => {

	const {name,username,email,password,phone} = RegisterMerchantSchema.parse(req.body) 

	// register merchant controller
	const foundMerchant = await Merchant.findOne({where:{
			[Op.or]: {
				email :email.toLowerCase(),
				name : name.toLowerCase()
			}
		}})

	const findInUser = await User.findOne({where:{
			[Op.or]: {
				email :email.toLowerCase(),
				phone,
			}
		}})
	
	// check if merchant already exists
	if( foundMerchant ) return res.send(Response(false,"Merchant already exists"))

	// check if email or phone no is associated with any jobo pay customer
	if ( findInUser ) return res.send(Response(false,"This phone or email is associated with a user account"))
	
	const hashedPassword= await bcrypt.hash(password,SALT)

	const newMerchant = await Merchant.create({name,username,email,password:hashedPassword,phone})

	return res.status(200).send({status:true,response:newMerchant})	

}



module.exports = {
	merchantLogin,
	registerMerchant,
}