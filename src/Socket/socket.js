const db = require('../Database/models/index.js')

const User = db.User


const getUserBalance = (io) => {
	io.on('userBalance',async(userId) => {
		const _foundUser = awaitUser.findByPk(userId)
		socket.to(userId).emit('refreshBalance',_foundUser.balance)
	})
}



