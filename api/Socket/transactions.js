import io  from 'socket.io-client'

const HOST = "http://localhost:7900"
//how to prod url

const socket = io(HOST)
	

const db = require('../Database/models/index.js')

const User = db.User


// send realtime message to receiver
const sendMoneySocket = (senderId,receiverId,amount) => {
	
	const _receiver = awaitUser.findByPk(receiverId)
	
	socket.emit('sendMoney',({senderId,receiverId:_receiver.id,amount}))
		
}
