
const { Response } = require('../utils.js')
const db = require('../../Database/models/index.js')

const User = db.User
const BankBeneficiary = db.BankBeneficiary
const WalletBeneficiary = db.WalletBeneficiary




const getUserBeneficiaries = async(req,res) => {
	const { userId } = req.params

	if (!userId) return res.send(Response(false,'Missing UserId'))

	try{
		const fetched_beneficiaries = await User.findOne({
					where: {
						UserId: userId
					}, include: ['WalletBeneficiary','BankBeneficiary']
				})
			
		return res.send(Response(true,fetched_beneficiaries))
	}

	catch(error) {
		console.log(error)
		return res.send(Response(false,'Error Fetching Beneficiaries'))
	}

}


const addBeneficiary = async(req,res) => {
	const { data, type, userId} = req.body

	if (!data || !type.trim() || !userId )
		return res.send(Response(false,"Missing Arguments"))

	try{
		if ( type == 'BANK' )
			await BankBeneficiary.create({...data, UserId:userId})

		else 
			await WalletBeneficiary.create({...data, UserId:userId})
		
		return res.send(Response(true,"Beneficiary Added Successfully"))
	}

	catch(error) {
		console.log(error)
		return res.send(Response(false,"Error Adding Beneficiary"))
	}
}



const updateBeneficiary = async(req,res) => {

	const { data, type, id, userId } = req.params

	if (!id || !userId || !data) return res.send(Response(false,"Missing Field"))

	try{

		if ( type == "BANK" ) {
			const beneficiary_to_upadte_b = await BankBeneficiary.update(data,{
				where:{
					id,
					UserId: userId
				}
			})
		}

		else {
			const beneficiary_to_upadte_w = await WalletBeneficiary.update(data,{
				where:{
					id,
					UserId: userId
				}
			})
		}


		return res.send(Response(true,"Beneficiary updated successfully"))
	}

	catch(error){
		console.log(error)
		return res.send(Response(false,"Error Updating Beneficiary"))
	}
}



const deleteBeneficiary = async(req,res) => {
	const { id, type, userId } = req.params

	if (!id || !type.trim() || !userId) return res.send(Response(false,"Missing Field"))

	try{

		if ( type == "BANK" ) {
			const beneficiary_to_delete_b = BankBeneficiary.destroy({
				where: {
					id,
					UserId:userId
				}
			})
		} 

		else {
			const beneficiary_to_delete_w = WalletBeneficiary.destroy({
				where:{
					id,
					UserId:userId
				}
			})
		}

		return res.send(Response(true,"Beneficiary deleted successfully"))
	}

	catch(error) {
		console.log(error);
		return res.send(Response(false,"Error Deleting Beneficiary"))
	}
}


module.exports = {
	getUserBeneficiaries,
	addBeneficiary,
	updateBeneficiary,
	deleteBeneficiary,
}















