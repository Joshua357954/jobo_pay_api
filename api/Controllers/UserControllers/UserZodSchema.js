const { z } = require('zod')


const UserLoginSchema = z.object({
	username:z.string(),
	password:z.string(),
})


const UserRegisterSchema = z.object({
	name: z.string(),
	username: z.string(),
	email: z.string(),
	password: z.string(),
	phone: z.any()
})


const ForgotPasswordSchema = z.object({
	email:z.string().email(),
	owner:z.enum(['USER','MERCHANT'])
})


const ResetPasswordSchema = z.object({
	userId: z.number(), 
	resetString: z.string().min(5), 
	newPassword:z.string(), 
	owner:z.enum(['USER','MERCHANT'])
})



//  Transfer Controller


const SendMoneySchema = z.object({
	senderId: z.any(), 
	receiverId: z.any(), 
	pin: z.any(), 
	amount:z.any()
})




// User
const GetUserSchema = z.object({
	userId: z.any()
})


const UpdateUserProfileSchema = z.object({
	data: z.array(), 
	userId: z.number().int()
})

const FundWalletSchema = z.object({
	userId: z.any(), 
	amount: z.any()
})


const UpdateTransactionPinSchema = z.object({
	userId: z.number().int(), 
	pin: z.number()
})


const CreatePaymentLinkSchema = z.object({
	userId: z.number().int(),
	url:z.string().url(),
	amount:z.number(),
	description:z.string()
})


const MakeLinkPaymentSchema = z.object({
	paymentLinkId: z.number().int(),
	name: z.string(),
	email: z.string().email(),
	amount: z.number()
})

module.exports = {
	UserLoginSchema,
	UserRegisterSchema,
	ForgotPasswordSchema,
	ResetPasswordSchema,
	SendMoneySchema,
	GetUserSchema,
	FundWalletSchema,
	UpdateUserProfileSchema,
	UpdateTransactionPinSchema,
	MakeLinkPaymentSchema,

}

