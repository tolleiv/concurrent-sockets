var http = require('http');
var request = require("request");

var server, app, started = false;

exports.req = {
    get: function (path, callback) {
        return request({url: "http://127.0.0.1:3001" + path, json:true}, callback);
    }
};

var startServer = function (env) {
    app = require("../lib/app.js").app;
    app.set('env', env);

    app.set('events', function() { });

    server = http.createServer(app);
    server.listen(3001)
        .on('listening', function () {
            setTimeout(function () {
                started = true;
            }, 100)
        })
        .on('close', function () {
            started = false;
        });
};

exports.start = startServer.bind(null, 'test')

exports.isStarted = function () {
    return started;
};

exports.stop = function (cb) {
    server.close(cb);
};
