

// preform all sendinds to user

module.exports = (io) => {

	io.on('connection',(socket) => {
		
		socket.on('setup',(userId) => {
			socket.join(userId)
			socket.to(userId).emit('connected',"Success")
		})


		socket.on('sendMoney',({senderId,receiverId,amount}) => {
			console.log(senderId,receiverId,amount)
			socket.to(receiverId).emit('receivedMoney',({senderId,amount}))
		})
	
	})
	

}





