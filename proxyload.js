;(function (global) {
    'use strict';

    if (global.ProxyLoad) {
        return;
    }

    var fileRe = /^file:\/\//i,
        protocolRe = /^(?:https?:)?\/\//i,
        hostRe = /[\w.:]+\//i;

    // call executes a callback if it is a function
    function call(func) {
        if (typeof func === 'function') {
            func();
        }
    }

    // ping checks if resource exists at given url
    function ping(url, success, error) {
        var request = new XMLHttpRequest();

        request.open(
            'HEAD', // we don't need the response body
            url,
            true // async request
        );

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    call(success);
                } else {
                    call(error);
                }
            }
        };

        request.send(null);
    }

    // redirect rewrites a dom element src to a given url
    function redirect(element, attr, url) {
        return function () {
            element.setAttribute(attr, url);
        };
    }

    function ProxyLoad(options) {
        options = options || {};

        // select every nodes we want to rewrite
        var elements = document.querySelectorAll(
            options.selector || '[data-proxyload]'
        );

        for (var i=0; i<elements.length; i++) {
            var element = elements[i];

            // first we get the element src if it exists...
            var attr = '';
            if (element.src) {
                attr = 'src';
            } else if (element.href) {
                attr = 'href';
            } else {
                continue;
            }
            var src = element[attr].trim();

            // if src is local is not of our concern
            if (src.match(fileRe)) {
                continue;
            }

            var domain = src.replace(protocolRe, ''),
                proxyUrl = options.url + '/' + domain;

            ping(
                proxyUrl, // we first try on proxy/domain.tld/path
                redirect(element, attr, proxyUrl), // if found redirect
                function () { // if not ...
                    var path = domain.replace(hostRe, ''),
                        proxyUrl = options.url + '/' + path;

                    ping(
                        proxyUrl, // retry on proxy/path
                        redirect(element, attr, proxyUrl)
                    );
                }
            );
        }
    }

    global.ProxyLoad = ProxyLoad;
})(this);
