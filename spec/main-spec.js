var helper = require('./spec-helper');

describe("the main route", function () {
    var request = helper.req;

    beforeEach(function () {
        runs(helper.start);
        waitsFor(helper.isStarted);
    });
    afterEach(helper.stop);

    it("responds ok", function (done) {
        request.get("/", function(err, res, body) {
            expect(err).toBeNull();
            expect(res.statusCode).toEqual(200);
            done();
        });
    });
});