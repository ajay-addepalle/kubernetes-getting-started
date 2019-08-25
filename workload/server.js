'use strict';

const http = require('http');
const uuidv4 =  require('uuid/v4');

let counter = 0;
const uuid = uuidv4();
const handleRequest = function(request, response) {
    counter++;
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end(`\nHello World!\nCalled ${counter} times!\n${uuid}\nMY_NODE_NAME:${process.env.MY_NODE_NAME}\nMY_POD_NAME:${process.env.MY_POD_NAME}\nMY_POD_NAMESPACE:${process.env.MY_POD_NAMESPACE}\nMY_POD_IP:${process.env.MY_POD_IP}\nMY_POD_SERVICE_ACCOUNT:${process.env.MY_POD_SERVICE_ACCOUNT}\n`);
};
const www = http.createServer(handleRequest);
www.listen(4080);
console.log('listening on 4080');
