const ampqp = require('amqplib');
const { logger } = require('../../../configs/config.logger');

const message = 'Hello, Xin chao babe';

const runProducer = async () => {

    try {
        const connection = await ampqp.connect('amqp://guest:abc1234@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        });

        // send message to consumer channel
        await channel.sendToQueue(queueName, Buffer.from(message));

        console.log(`message sent`, message);
    } catch (error) {
        logger.error("Error to connect the RabbitMQ::", error);
    }
};


runProducer().catch(logger.error);