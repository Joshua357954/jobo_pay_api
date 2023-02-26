
const { Op } = require('sequelize')

const db = require('../Database/models/index.js')

const NoAccountUser = db.NoAccountUser 



function createOtp () {	
	const otp = Math.floor(1000 + Math.random() * 9000);
	return JSON.stringify({ otp: otp, expTime: Date.now() + 60000 * 5 })
}


async function addOtpToDatabase (user,otp) {

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
	const otp = createOtp()

	// send otp via sms using twilio

	// check if any otp exists
	const _checkSentOtp = await NoAccountUser.findOne({
									where:{
										[Op.or]: {
											phone:user,
											email:user
										},
										otp:otp
									}
								})

	// check if op is expired
	if ( Date.now() > parseOtp(_check.otp) ){
		addOtpToDatabase(user,otp)
		return Response(true,`An New Otp was sent to ${user} Just now , Otp expires in 10minutes `);
	}


	if (_checkSentOtp.otp)
		return Response(true,`An Otp has already been sent to ${user}, Otp expires in 10minutes `)

	// add otp to db
	addOtpToDatabase(user,otp)
	

	console.log(otp)
	return Response(true,"Otp Sent !");

}





const parseOtp = (otpData) => JSON.parse(otpData)


// confirm otp sent
const confirmOtp = async(user,otp) => {
	
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
		return Response(false,'Inalid Valid Otp ')
	
	// check if otp is expired
	if ( Date.now() > parseOtp(_check.otp) )
		return Response(false,'Otp Expired , Apply for a new one')

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
	return Response(true,'Otp is Correct')

}





module.exports = {
	sendOtp,
	confirmOtp,
}
