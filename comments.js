// Create web server
// 1. Load the http module
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var comments = require('./comments.json');

// 2. Create an http server
http.createServer(function (req, res) {
    // 3. Configure the server to send a response for the home page
    if (req.url === '/' && req.method === 'GET') {
        // Read the file
        fs.readFile('index.html', function(err, data) {
            // Write the response
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else if (req.url === '/comments' && req.method === 'GET') {
        // 4. Configure the server to send a response for a request for comments
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(comments));
        res.end();
    } else if (req.url === '/comments' && req.method === 'POST') {
        // 5. Configure the server to accept a POST request for comments
        var body = '';
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            var comment = qs.parse(body);
            comments.push(comment);
            fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
                console.log(err);
            });
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(comment));
            res.end();
        });
    } else {
        // 6. Configure the server to send a 404 Not Found status code for all other requests
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Not Found');
        res.end();
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');