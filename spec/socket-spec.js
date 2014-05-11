var helper = require('./spec-helper');


describe("a running webserver", function () {

    beforeEach(helper.start);
    afterEach(helper.stop);

    describe("passing data through the socket", function () {
        var request = helper.req;

        beforeEach(helper.connectSocket);
        afterEach(helper.disconnect);

        describe("using the main route", function () {

            it("responds ok and sends data back through socket", function (done) {
                helper.socket().on("request", function (data) {
                    expect(data).toEqual('demodemo');
                    done();
                });

                request.get("/demodemo", function (err, res, body) {
                    expect(err).toBeNull();
                    expect(res.statusCode).toEqual(200);
                });
            });
        });

        describe("with a Redis publisher", function () {
            var redis = require('redis');
            var pub = redis.createClient();

            it("passes Strings through as JSON", function (done) {

                helper.socket().on("notify", function (data) {
                    expect(data).toEqual(jasmine.any(Object));
                    expect(data.my).toEqual('demodata');
                    pub.quit();
                    done();
                });

                pub.publish("events", '{"event":"notify","data":{"my":"demodata"}}');

            });
        });
    });
});
