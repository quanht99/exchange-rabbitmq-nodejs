const connection = require("../connection");

(async () => {
    let conn, channel;
    try{
        conn = await connection();
        channel = await conn.createChannel();
        const exchange = "Headers-Exchange";
        await channel.assertExchange(exchange, "headers", {durable: true});

        let msg = {
            email: "zed.quan99@gmail.com",
            name: "QuanHT"
        }
        let opts = {
            headers: {
                "have_email": "true",
                "have_name": "true"
            }
        }
        await channel.publish(exchange, "", Buffer.from(JSON.stringify(msg), opts));
        console.log(`Publish with opts: ${JSON.stringify(opts)} and msg: ${JSON.stringify(msg)}`)
        msg = {
            name: "MaiPT"
        }
        opts = {
            headers: {
                "have_email": "true",
                "have_name": "true"
            }
        }
        await channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)), opts)
        console.log(`Publish with opts: ${JSON.stringify(opts)} and msg: ${JSON.stringify(msg)}`)
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