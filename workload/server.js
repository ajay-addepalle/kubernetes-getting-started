'use strict';

const http = require('http');
const uuidv4 =  require('uuid/v4');

let counter = 0;
const uuid = uuidv4();
const handleRequest = function(request, response) {
    counter++;
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end(`<h1>Hello World!</h1><br><h2>Called ${counter} times!</h2><h3>${uuid}</h3>`);
};
const www = http.createServer(handleRequest);
www.listen(8080);
console.log('listening on 8080');
