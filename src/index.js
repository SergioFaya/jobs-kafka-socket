// const app = require("express")()
// const http = require('http').Server(app);
// require('dotenv').config();


// const PORT = process.env.PORT;

// const init = async () => {
// 	const consumer = await require("./consumer")();
// 	// Create a socket.io instance
// 	const io = require('socket.io')(http);

// 	io.on('connection', (socket) => {
// 		console.log("A user connected", socket);
// 		socket.on('disconnect', () => {
// 			console.log("A user disconnected");
// 		});

// 		consumer.run({
// 			eachMessage: async ({ topic, partition, message }) => {
// 				console.log(io)
// 				io.emit(topic, message)
// 				console.log({ topic, partition, message, messageContent: message.value.toString() });
// 			},
// 		});

// 	});
// 	await app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
// }
// init()

// Without server config
// const io = require('socket.io')();
// io.on('connection', client => {
// 	console.log("connection")
// });
// io.listen(3000);


const options = {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
};
const io = require('socket.io')(options);

io.on('connection', socket => {
	console.log("connected", socket)
});

io.listen(3000);