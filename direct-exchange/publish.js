const connection = require("../connection");

(async () => {
    let conn, channel;
    try{
        conn = await connection();
        channel = await conn.createChannel();
        const exchange = "product";
        await channel.assertExchange(exchange, "direct", {durable: true});

        let routingKey = "product.crawl_stock";
        let msg = {
            sku: "sku for crawl stock"
        }
        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
        console.log(`Publish with routingKey: ${routingKey} and msg ${JSON.stringify(msg)}`)


        routingKey = "product.crawl_price";
        msg = {
            sku: "Sku for crawl price"
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