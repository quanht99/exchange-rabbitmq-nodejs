const connection = require("../connection");

(async () => {
    let conn, channel;
    try{
        conn = await connection();
        channel = await conn.createChannel();
        const exchange = "new_message";
        await channel.assertExchange(exchange, "fanout", {durable: true});

        let routingKey = "will-ignore";
        let msg = {
            user_id: 2,
            name: "MaiPT"
        }
        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
        console.log(`Publish with routingKey: ${routingKey} and msg ${JSON.stringify(msg)}`)


        msg = {
            user_id: 1,
            name: "QuanHT"
        }
        await channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)))
        console.log(`Publish with routingKey: ${""} and msg ${JSON.stringify(msg)}`)
    }
    catch(e){
        console.error(e.message)
    }
    finally{
        await channel.close();
        await conn.close()
    }
    process.exit(0)
})()