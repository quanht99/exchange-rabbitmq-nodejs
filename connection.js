const amqplib = require("amqplib");
const amqpUrl = process.env.AMQP_URL || "amqp://127.0.0.1:5673";


const connection = async () => await amqplib.connect(amqpUrl, 'heartbeat=60');

module.exports = connection