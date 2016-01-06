var Browser = require('zombie');
var assert = require('assert');

Browser.localhost('localhost', 8080);

describe('User visits home page', function () {
    var browser = new Browser();

    before(function () {
        return browser.visit('/');
    });

    describe('loading page', function () {
        it('should be successful', function () {
            browser.assert.success();
        });
    });

    describe('foreach elements having data-proxyload attribute', function () {
        it('should have expected src', function () {
            var tests = browser.queryAll('[data-proxyload]');

            for (var i=0; i<tests.length; i++) {
                var test = tests[i];

                assert.equal(
                    test.getAttribute('src'),
                    test.getAttribute('data-proxyload-expected')
                );
            }
        });
    });
});
