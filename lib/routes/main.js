module.exports = function (app) {
    app.get("/:name", function (req, res) {
            // sending the event
        app.get('events')(JSON.stringify({event: 'request', data: req.params.name }));
        res.send(200)
    });
}