const app = require("express")()
require('dotenv').config();


const PORT = 8080;
const init = async () => {
	const server = await app.listen(PORT, () => console.log('Listening on http://localhost:3000'))
	const consumer = await require("./consumer")();
	// Create a socket.io instance
	await require('./sockets')(server, consumer)
}
init()
