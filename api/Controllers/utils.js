const db = require('../Database/models/index.js')

const User = db.User


const Response = (status,response) => {
	return {status,response}
}


const getUser = async(id) => {

	const found = await User.findOne({
		where:{
			id
		}
	})

	return found
}

// const _Error = (dest) => return throw new Error(msg)



module.exports = { Response, getUser }




