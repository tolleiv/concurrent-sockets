var io;
var RedisStore = require('socket.io/lib/stores/redis')
    , redis = require('socket.io/node_modules/redis')
    , pub = redis.createClient()
    , sub = redis.createClient()
    , client = redis.createClient();


module.exports = function (server, app) {
    io = require('socket.io').listen(server);
    io.set('store', new RedisStore({
        redis: redis, redisPub: pub, redisSub: sub, redisClient: client
    }));
    io.set('log level', 5);

    app.set('events', pub.publish.bind(pub, "events"));
    io.on('connection', function (socket) {

        sub.subscribe("events");
        sub.on("message", function (channel, msg) {
            switch(channel) {
                case 'events':
                    var message = JSON.parse(msg)
                    socket.emit(message.event, message.data)
                    break;
            }
        });
    });
};

