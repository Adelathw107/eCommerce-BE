const ampqp = require('amqplib');

const message = 'Hello, Xin chao babe';

const runProducer = async () => {

    try {
        const connection = await ampqp.connect('amqp://guest:abc1234@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        // send message to consumer channel
        await channel.sendToQueue(queueName, Buffer.from(message))

        console.log(`message sent`, message);
    } catch (error) {
        console.error(error);
    }
}


runProducer().catch(console.error)