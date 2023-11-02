const { createClient } = require('redis');
const port = process.env.REDIS_PORT
const host = process.env.REDIS_HOST
const password = process.env.REDIS_PASSWORD

const client = createClient({
    password: password,
    socket: {
        host: host,
        port: port
    }
});

//(async () => {
//    await client.connect();
//})();

client.on('connect', function () {
    console.log('redis connected!');
});
client.on('error', function (err) {
    console.error('Ошибка подключения к Redis:', err);
});

module.exports = client;