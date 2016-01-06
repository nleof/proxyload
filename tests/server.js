var server = require('http-server');

var website = server.createServer({
    'cors': true,
    'root': __dirname + '/website'
});

var proxy = server.createServer({
    'cors': true,
    'root': __dirname + '/assets'
});

website.listen(8080);
console.log('Website server listening on 8080...');

proxy.listen(3000);
console.log('Proxy server listening on 3000...');
