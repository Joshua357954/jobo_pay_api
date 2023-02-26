const { z } = require('zod')

//  Auth Schema
const MerchantLoginSchema = z.object({
	username:z.string().min(3),
	password:z.string().min(5)
})


const RegisterMerchantSchema = z.object({
	name:z.string().min(3),
	username:z.string().min(5),
	email:z.string().email().min(5),
	password:z.string().min(5),
	phone:z.number().min(10).max(10)
})


//  Merchant Transactions

const MerchantWithdrawSchema = z.object({
	merchantId: z.number(),
	merchantPin: z.number(),
	amount: z.number(),
	userId: z.number(),
	userPin: z.number() 
})

const MerchantUserDepositSchema = z.object({
	merchantId: z.number(),
	merchantPin: z.number(),
	amount:z.number(),
	userId:z.number()
})




// Merchant Settings
const UpdateMerchantProfileSchema = z.object({
	merchantId: z.number(),
	data: z.object({
		name:z.string(),
		email:z.string().email()
	})
})


const UpdateMerchantPinSchema = z.object({
	merchantId: z.number().int(), 
	oldPin: z.number(), 
	newPin: z.number(),
})


//  Transaction 
const CreateMerchantUserTransactionSchema = z.object({
	userId: z.number().int(),
	merchantId: z.number(), 
	transactionType: z.string(), 
	amount: z.number(), 
	status: z.string(), 
	discription: z.string()
})




//  Transfer Schema
const MerchantToBankTransferSchema = z.object({
	merchantId:z.number().int(),
	merchantPin:z.number().int(),
	userId:z.number().int(),
	amount:z.number().int(),
	accountNumber:z.number(),
	bankName:z.string().min(3),
	accountName: z.string().min(6)
})

const MerchantWalletTransferSchema = z.object({
	merchantId:z.number().int(),
	amount:z.number().int(),
	merchantPin:z.number(),
	userId: z.number().int()
})


const MerchantFromUserToUserTransferSchema = z.object({
	merchantId:z.number().int(),
	amount:z.number().int(),
	fromUserId:z.number().int(),
	receiverId:z.number().int(),
	fromUserPin:z.number()
})




module.exports = {
	MerchantLoginSchema,
	RegisterMerchantSchema,
	MerchantWithdrawSchema,
	MerchantUserDepositSchema,
	UpdateMerchantPinSchema,
	UpdateMerchantProfileSchema,
	CreateMerchantUserTransactionSchema,
	MerchantToBankTransferSchema,
	MerchantWalletTransferSchema,
	MerchantFromUserToUserTransferSchema
}