!(function (global) {
    'use strict';

    if (global.ProxyLoad) {
        return;
    }

    var fileRe = /^file:\/\//i,
        protocolRe = /^(?:https?:)?\/\//i,
        hostRe = /[\w.:]+\//i;

    // ping checks if resource exists at given url
    function ping(url, success, error) {
        var request = new XMLHttpRequest();

        request.open(
            'HEAD', // we don't need the response body
            url,
            true // async request
        );

        request.onreadystatechange = function () {
            if (request.readyState === 4) { // XMLHttpRequest.DONE
                if (request.status === 200) {
                    success();
                } else {
                    error();
                }
            }
        };

        request.send(null);
    }

    function ProxyLoad(options) {
        options = options || {};

        // select every nodes we want to rewrite
        var elements = document.querySelectorAll(
            options.selector || '[data-proxyload]'
        );

        Array.prototype.forEach.call(elements, function (element) {
            // first we get the element src if it exists...
            var attr = '';
            if (element.src) {
                attr = 'src';
            } else if (element.href) {
                attr = 'href';
            } else {
                return;
            }
            var src = element[attr].trim();

            // if src is local is not of our concern
            if (src.match(fileRe)) {
                return;
            }

            var domain = src.replace(protocolRe, ''), // remove protocol from src url
                url = options.url + '/' + domain;

            ping(
                url, // we first try on proxy/domain.tld/path
                function () {
                    element.setAttribute(attr, url);
                },
                function () { // if not ...
                    var url = options.url + '/' + domain.replace(hostRe, '');

                    ping(
                        url, // retry on proxy/path
                        function () {
                            element.setAttribute(attr, url);
                        },
                        function () {
                            // proxy does not serve ressource
                            // don't touch original src
                        }
                    );
                }
            );
        });
    }

    global.ProxyLoad = ProxyLoad;
})(this);
