const ampqp = require('amqplib');
const { logger } = require('../../../configs/config.logger');

const message = 'Hello, RabbitMQ for everone';

const runConsumer = async () => {

    try {
        const connection = await ampqp.connect('amqp://guest:abc1234@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        });

        // send message to consumer channel
        await channel.consume(queueName, (message) => {
            console.log(`Message received:::`, message.content.toString());
        }, {
            noAck: true
        });
    } catch (error) {
        logger.error('Error to connect rabbitMQ::', error);
    }
};


runConsumer().catch(logger.error);