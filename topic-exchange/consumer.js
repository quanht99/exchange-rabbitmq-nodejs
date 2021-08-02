const connection = require("../connection");

(async () => {
    let conn, channel;
    try{
        conn = await connection();
        channel = await conn.createChannel();
        const exchange = "user.login";
        await channel.assertExchange(exchange, "topic")
        let promises = [];

        const queueA = "Queue A";
        const routingKeyA = "user.login.*";
        let consumerA = new Consumer();
        promises.push(consumerA.listen({queue: queueA, routingKey: routingKeyA, exchange, channel}))

        const queueB = "Queue B";
        const routingKeyB = "user.login.success";
        let consumerB = new Consumer();
        promises.push(consumerB.listen({queue: queueB, routingKey: routingKeyB, exchange, channel}));
        await Promise.all(promises)
    }
    catch(e){
        console.error(e.message)
    }
})()


function Consumer(){

}

Consumer.prototype.listen = async ({queue, routingKey, exchange, channel}) => {
    try{
        await channel.assertQueue(queue);
        await channel.bindQueue(queue, exchange, routingKey);
        console.log(`Queue ${queue} bind to exchange: '${exchange}', routingKey: '${routingKey}'`)
        await channel.consume(queue, async (msg) => {
            console.log(`Queue ${queue} Receive msg: `, msg.content.toString());
            await channel.ack(msg)
        }, {
            noAck: false
        }) 
    }
    catch(e){
        console.log(e.message)
    }
}