const express = require('express')
const app = express()
const cors = require('cors')
const apiRoute = require('./api/api.js')

require('./api/Database/seeders/index.js') 

const cors_options = {
	pingTimeout : 60000,
	cors : {
		origin:'*'
	}
}

const PORT = process.env.PORT || 7900


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))


const STYLE = 'style="color:rgb(58,55,55);text-align:center;font-family:comic sans ms;"'
const HTML = `<h1 ${STYLE}> Welcome Jobo Pay Api V1 💰 </h1>`


app.use('/api',apiRoute)


app.get('/',(req,res) => {
	res.send( HTML )
})
   

const server = app.listen(PORT, () => console.log(`Server Running On Port : ${PORT}`))

const io = require('socket.io')(server, cors_options )

// socket-io
require('./api/Socket/socket.js')(io)




