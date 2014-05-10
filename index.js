var cluster = require('cluster');
if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    cluster.on('exit', function(worker) {
        cluster.fork();
    });
} else {
    var http = require('http');
    var app = require("./lib/app").app;
    var server = http.createServer(app);
    require('./lib/socket')(server, app)
    server.listen(3000);
}