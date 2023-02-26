const { Response } = require('../utils.js')
const db = require('../../Database/models/index.js')
const BankAccount = db.BankAccount



const getUserBankAccounts = async(req,res) => {
	const { userId } = req.params

	if (!userId) return res.send(Response(false,'Missing UserId'))

	try{
		const found_bank_accounts = await BankAccount.findAll({where: {UserId: userId}})
			
		return res.send(Response(true,found_bank_accounts))
	}

	catch(error) {
		console.log(error)
		return res.send(Response(false,'Error Fetching BankAccounts'))
	}

}


const addBankAccount = async(req,res) => {
	const { accountName, bankName, accountNumber, userId } = req.body

	if (!accountName.trim() || !bankName.trim() || !accountNumber.trim())
		return res.send(Response(false,"Missing Arguments"))

	try{
		const bank_account_to_add = await BankAccount.create({accountName,bankName,accountNumber,UserId:userId})

		return res.send(Response(true,"Bank Account Linked Successfully"))
	}

	catch(error) {
		console.log(error)
		return res.send(Response(false,"Error Adding Bank Account"))
	}
}


//  update bank account
const updateBankAccount = async(req,res) => {

	const { id, userId, data } = req.params

	if (!id.trim() || !userId.trim() || !data) return res.send(Response(false,"Missing Field"))

	try{
		const bank_ac_to_upadte = await BankAccount.update(data,{
			where:{
				id,
				UserId: userId
			}
		})

		return res.send(Response(true,"Bank account updated successfully"))
	}

	catch(error){
		console.log(error)
		return res.send(Response(false,"Error Updating Bank Account"))
	}
}


//  delete bank account

const deleteBankAccount = async(req,res) => {
	const { id, userId } = req.params

	if (!id.trim() || !userId.trim()) return res.send(Response(false,"Missing Field"))

	try{

		const bank_ac_to_delete = BankAccount.destroy({
			where:{
				id,
				UserId:userId
			}
		})

		return res.send(Response(true,"Bank accound deleted successfully"))
	}

	catch(error) {
		console.log(error);
		return res.send(Response(false,"Error Deleting BankAccount"))
	}
}


module.exports = {
	getUserBankAccounts,
	addBankAccount,
	updateBankAccount,
	deleteBankAccount,
}















