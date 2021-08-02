const connection = require("../connection");

(async () => {
    let conn, channel;
    try{
        conn = await connection();
        channel = await conn.createChannel();
        const exchange = "user.login";
        await channel.assertExchange(exchange, "topic", {durable: true});

        let routingKey = "user.login.fail";
        let msg = {
            user_id: 2,
            name: "MaiPT"
        }
        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
        console.log(`Publish with routingKey: ${routingKey} and msg ${JSON.stringify(msg)}`)


        routingKey = "user.login.success";
        msg = {
            user_id: 1,
            name: "QuanHT"
        }
        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)))
        console.log(`Publish with routingKey: ${routingKey} and msg ${JSON.stringify(msg)}`)
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