var http = require('http');
var request = require("request");
var io = require('socket.io-client');

var server, socket, app;

exports.req = {
    get: function (path, callback) {
        return request({url: "http://127.0.0.1:3001" + path, json: true}, callback);
    }
};

exports.start = function (cb) {
    app = require("../lib/app.js").app;
    app.set('env', 'test');
    app.set('events', function() { });

    server = http.createServer(app);
    require('../lib/socket')(server, app)
    server.listen(3001)
        .on('listening', function () {
            setTimeout(cb, 100)
        })
};

exports.stop = function (cb) {
    server.close(cb);
};

exports.connectSocket = function (cb) {
    socket = io.connect('http://localhost:3001', {
        'reconnection delay': 0, 'reopen delay': 0, 'force new connection': true
    });
    socket.on('connect', function () {
        setTimeout(cb, 100)
    });
};

exports.disconnect = function (cb) {
    socket.on('disconnect', function() { setTimeout(cb, 100) });
    socket.disconnect();
};


exports.socket = function () {
    return socket;
};
