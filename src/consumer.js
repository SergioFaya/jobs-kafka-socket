const { Kafka } = require('kafkajs')

const clientId = 'socket-app';
const brokers = ['localhost:9092']

const kafka = new Kafka({
	clientId,
	brokers
});

const consumerGroupId = 'groupId';
const topic = "topic1";

module.exports = async () => {
	const consumer = kafka.consumer({ groupId: consumerGroupId });

	await consumer.connect();
	await consumer.subscribe({ topic, fromBeginning: true });
	return consumer
};