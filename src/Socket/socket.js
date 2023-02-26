

const User;


const getUserBalance = (io) => {
	io.on('userBalance',async(userId) => {
		const _foundUser = awaitUser.findByPk(userId)
		socket.to(userId).emit('refreshBalance',_foundUser.balance)
	})
}



