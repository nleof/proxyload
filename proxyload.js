;(function (global) {
    'use strict';

    if (global.ProxyLoad) {
        return;
    }

    var fileRe = /^file:\/\//i,
        protocolsRe = /^(?:https?:)?\/\//i;

    // ping check if resource exists at given url
    function ping(url, callback) {
        var request = new XMLHttpRequest();

        request.open(
            'HEAD', // we don't need the response body
            url,
            true // async request
        );

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }
        };

        request.send(null);
    }

    function ProxyLoad(options) {
        options = options || {};

        var elements = document.querySelectorAll(
            (options.selector || '*') + '[data-proxy-js]'
        );

        for (var i=0; i<elements.length; i++) {
            var element = elements[i];

            // first we get the element src if it exists...
            if (!element.src) {
                continue;
            }
            var src = element.src.trim();

            // if src is local is not of our concern
            if (src.match(fileRe)) {
                continue;
            }

            (function (element) {
                var proxyUrl = options.url + '/' + src.replace(protocolsRe, '');
                ping(proxyUrl, function () {
                    element.setAttribute('src', proxyUrl);
                });
            })(element);
        }
    }

    global.ProxyLoad = ProxyLoad;
})(this);
