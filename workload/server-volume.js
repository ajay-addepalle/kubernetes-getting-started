'use strict';

const http = require('http');
const uuidv4 =  require('uuid/v4');
const fs = require('fs');
const path = require('path');

const VOLUME_PATH = process.env.VOLUME_PATH;
    
let counter = 0;
const uuid = uuidv4();
const handleRequest = function(request, response) {
    counter++;
  console.log('Received request for URL: ' + request.url);    
  response.writeHead(200);
  if(VOLUME_PATH == undefined || VOLUME_PATH == 'undefined') {
    fs.readFile(path.join(VOLUME_PATH, 'data.txt'), {encoding: 'utf-8'} , function(err, data){
        if(!err){
            response.write(data);
        } else {
            response.write(`Error reading file: ${err}`);
        }
    });
    response.write('');
  } else {
    response.write('\nCannot read file, path not provided!');
  }
  response.end(`\nHello WorldV1!\nCalled ${counter} times!\n${uuid}\nMY_NODE_NAME:${process.env.MY_NODE_NAME}\nMY_POD_NAME:${process.env.MY_POD_NAME}\nMY_POD_NAMESPACE:${process.env.MY_POD_NAMESPACE}\nMY_POD_IP:${process.env.MY_POD_IP}\nMY_POD_SERVICE_ACCOUNT:${process.env.MY_POD_SERVICE_ACCOUNT}\n`);
};
const www = http.createServer(handleRequest);
www.listen(4080);
console.log('listening on 4080');
