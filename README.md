[![Build Status](https://travis-ci.org/nleof/proxyload.svg)](https://travis-ci.org/nleof/proxyload)

# ProxyLoad

ProxyLoad rewrites DOM elements and point their src attribute to a given url.

Goal is to quickly load big assets from a local proxy without worrying about network speed.

# Installing

- npm: `npm install proxyload`
- github: https://cdn.rawgit.com/nleof/proxyload/master/proxyload.min.js

# Usage

Add the attribute data-proxy-load to your DOM elements.

```html
<video src="http://slowdomain.tld/assets/test.mp4" data-proxy-load />

<script type="application/javascript" src="proxyload.min.js"></script>
<script>
    ProxyLoad({
        url: 'http://localhost:3000',
        selector: '*', // any valid CSS selector
    });
</script>
```

Will rewrite the video element to:

```html
<video src="http://localhost:3000/slowdomain.tld/assets/test.mp4" data-proxy-load />
```

You can use [caddy](https://github.com/mholt/caddy) or [http-server](https://github.com/indexzero/http-server) to quickly serve your assets.

In any case, remember to **enable CORS** on your server.
