
const { Op } = require('sequelize')

const db = require('../Database/models/index.js')

const NoAccountUser = db.NoAccountUser 



function createOTP () {	
	const otp = Math.floor(1000 + Math.random() * 9000);
	return JSON.stringify({ otp: otp, expTime: Date.now() + 60000 * 5 })
}


async function addOTPToDatabase (user,otp) {

	await NoAccountUser.update({otp},{
					where:{
						[Op.or]: {
							phone:user,
							email:user
						}
					}
				})

}






// send otp to no account users
const sendOtp = async(user) => {

	// Generate a random four-digit OTP
	const otp = createOTP()


	// check if any otp exists
	const _checkSentOTP = await NoAccountUser.findOne({
									where:{
										[Op.or]: {
											phone:user,
											email:user
										},
										otp:otp
									}
								})

	// check if op is expired
	if ( Date.now() > parseOTP(_check.otp) ){
		addOTPToDatabase(user,otp)
		return Response(true,`An New OTP was sent to ${user} Just now , OTP expires in 10minutes `);
	}


	if (_checkSentOTP.otp)
		return Response(true,`An OTP has already been sent to ${user}, OTP expires in 10minutes `)

	// add otp to db
	addOTPToDatabase(user,otp)
	

	console.log(otp)
	return Response(true,otp.otp);

}





const parseOTP = (otpData) => JSON.parse(otpData)


// confirm otp sent
const confirmOTP = async(user,otp) => {
	
	const _check = await NoAccountUser.findOne({
								where:{
									[Op.or]: {
										phone:user,
										email:user
									}
								}
							})
	
	// check if both opt match
	if (_check.otp != otp)
		return Response(false,'Inalid Valid OTP ')
	
	// check if otp is expired
	if ( Date.now() > parseOTP(_check.otp) )
		return Response(false,'OTP Expired , Apply for a new one')

	// delete otp after use
	await NoAccountUser.update({otp:null},{
						where:{
							[Op.or]: {
								phone:user,
								email:user
							}
						}
					})

	// Then its correct
	return Response(true,'OTP is Correct')

}





module.exports = {
	sendOtp,
	confirmOTP,
}
