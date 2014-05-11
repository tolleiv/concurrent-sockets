var io;
var RedisStore = require('socket.io/lib/stores/redis')
    , redis = require('socket.io/node_modules/redis');


module.exports = function (server, app) {
    var pub = redis.createClient()
        , sub = redis.createClient()
        , client = redis.createClient();

    io = require('socket.io').listen(server);
    io.set('store', new RedisStore({
        redis: redis, redisPub: pub, redisSub: sub, redisClient: client
    }));
    io.set('log level', 3);

    app.set('events', pub.publish.bind(pub, "events"));
    io.on('connection', function (socket) {
        sub.subscribe("events");
        sub.on("message", function (channel, msg) {
            switch (channel) {
                case 'events':
                    var message = JSON.parse(msg)
                    socket.emit(message.event, message.data)
                    break;
            }
        });
    });
    server.on('close', function() {
        pub.quit();
        sub.quit();
        client.quit();
    })
};

