'use strict';

const http = require('http');
const uuidv4 =  require('uuid/v4');
const fs = require('fs');
const path = require('path');

const VOLUME_PATH = process.env.VOLUME_PATH;

let counter = 0;
const uuid = uuidv4();
const dataFilePath = path.join(VOLUME_PATH, 'data.txt');

const handleRequest = function(request, response) {
    counter++;
  console.log('Received request for URL: ' + request.url);    
  response.writeHead(200);
  if(VOLUME_PATH != undefined && VOLUME_PATH != 'undefined') {
    fs.readFile(dataFilePath, function(err, data){
        if(!err){
            response.write(data);
            response.write(`\nFilePath:${dataFilePath}`);
            response.end(`\nHello WorldV1!\nCalled ${counter} times!\n${uuid}\n`);
        } else {
            response.write(`Error reading file: ${err}`);
            response.end(`\nHello WorldV1!\nCalled ${counter} times!\n${uuid}\n`);
        }
    });
  } else {
    response.write('\nCannot read file, path not provided!');
    response.end(`\nHello WorldV1!\nCalled ${counter} times!\n${uuid}\n`);
  }
};
const www = http.createServer(handleRequest);
www.listen(4080);
console.log('listening on 4080');
