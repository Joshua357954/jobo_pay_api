const { Response, getUser } = require('../utils.js')
const db = require('../../Database/models/index.js')
const { CreatePaymentLinkSchema, MakeLinkPaymentSchema } = require('./UserZodSchema.js')
const { createSendUserTransaction,createReceiverUserTransaction } = require('./TransferController.js')


const PaymentLink = db.PaymentLink
const Payment = db.Payment
const User = db.User


// POST: create
const createPaymentLink = (req,res) => {
	const _paymentLink = await PaymentLink.create(req.body)
	return res.send(Response(true,'Payment Link Created'))
}


// GET: getlinks
const getUserPaymentLinks = async(req,res) => {
	const _userPLinks = await PaymentLink.findMany({
		where:{
			UserId:userId
		},include:['Payment']
	})

	return res.send(Response(true,_userPLinks))
}



// POST: payment (paymentLinkId,name,email,amount,status)

const makePayment = async(req,res) => {

	const { paymentLinkId,name,email,amount } = req.body

	const payment = await Payment.create({status:'paid',...req,body})
	
	res.send(Response(true,'Payment Made Successful'))

	// get payment link owner
	const getOwner = await PaymentLink.findOne({where: {id: paymentLinkId}})

	// Update users balance 

	await User.update({
		balance: db.sequelize.literal(`balance + ${amount}`)},
		where: { id: getOwner.UserId}
	)

	createReceiverUserTransaction(`${name} -- ${getOwner.discription} \n`,getOwner.UserId,'PaymentLink',amount)

	return 'Done'
}


module.exports = {
	createPaymentLink,
	getUserPaymentLinks,
	makePayment
}



