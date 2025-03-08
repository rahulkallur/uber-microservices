import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBIT_URL;

let connection, channel;

export const connect = async () => {
  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log("Connected to RabbitMQ");
};

export const subscribeToQueue = async (queue, callback) => {
  if (!channel) await connect();
  await channel.assertQueue(queue);
  channel.consume(queue, (message) => {
    callback(message.content.toString());
    channel.ack(message);
  });
};

export const publishToQueue = async (queue, message) => {
  if (!channel) await connect();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(message));
};
