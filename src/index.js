require('dotenv').config();

const options = {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
};
const io = require('socket.io')(options);

io.on('connection', socket => {
	console.log("connected", socket)

	socket.on('disconnect', () => {
		console.log("A user disconnected");
	});
});

const consumer = require("./consumer")(io);

const PORT = process.env.PORT;
io.listen(PORT);

require('./proxy');