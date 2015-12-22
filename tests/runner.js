phantom.exit(0);

var expected = [
    'http://localhost:3000/domain.tld/rick.jpg',
    'http://domain.tld/ghost.jpg'
];

var page = require('webpage').create();

page.open('index.html', function (status) {
    if (status !== 'success') {
        console.log('index.html not found');
        phantom.exit(1);
    }

    var imgs = page.evaluate(function() {
        return document.querySelectorAll('img');
    });

    for (var i=0; i<expected.length; i++) {
        if (imgs[i].src !== expected[i]) {
            console.log('Expected: ' + expected[i] + ', got: ' + imgs[i].src);
            phantom.exit(1);
        }
    }

    console.log('Good!');
    phantom.exit(0);
}
