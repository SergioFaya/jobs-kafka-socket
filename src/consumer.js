const { Kafka } = require('kafkajs')

const clientId = process.env.KAFKA_CLIENT_ID;
const brokers = [process.env.KAFKA_BROKER];

const kafka = new Kafka({
	clientId,
	brokers
});

const consumerGroupId = process.env.KAFKA_CONSUMER_GROUP_ID
const topic = process.env.CONSUMER_TOPIC;

module.exports = async (io) => {
	const consumer = kafka.consumer({ groupId: consumerGroupId });

	await consumer.connect();
	await consumer.subscribe({ topic, fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			await io.emit(topic, message.value.toString())
			console.log({ topic, partition, message, messageContent: message.value.toString() });
		},
	});
};