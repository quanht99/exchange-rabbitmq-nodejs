const connection = require("../connection");

(async () => {
    let conn, channel;
    try{
        conn = await connection();
        channel = await conn.createChannel();
        const exchange = "Headers-Exchange";
        await channel.assertExchange(exchange, "headers")
        let promises = [];

        const queueA = "Queue A";
        let consumerA = new Consumer();
        let opts = {
            "x-match": "all",
            "have_email": "true",
            "have_name": "true"
        }
        promises.push(consumerA.listen({queue: queueA, routingKey: "", exchange, channel, opts}))

        const queueB = "Queue B";
        let consumerB = new Consumer();
        opts = {
            "x-match": "any",
            "have_email": "true",
            "have_name": "true"
        }
        promises.push(consumerB.listen({queue: queueB, routingKey: "", exchange, channel, opts}));
        await Promise.all(promises)
    }
    catch(e){
        console.error(e.message)
    }
})()


function Consumer(){

}

Consumer.prototype.listen = async ({queue, routingKey, exchange, channel, opts}) => {
    try{
        await channel.assertQueue(queue);
        await channel.bindQueue(queue, exchange, routingKey, opts);
        console.log(`Queue ${queue} bind to exchange: '${exchange}', opts: '${JSON.stringify(opts)}'`)
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