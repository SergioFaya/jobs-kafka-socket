const createSocket = async (server, consumer) => {
	const io = require('socket.io')(server);

	// Listen for Kafka
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			io.emit(topic, message)
			console.log({ topic, partition, message, messageContent: message.value.toString() });
		},
	});

}

module.exports = createSocket;