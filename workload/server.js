'use strict';

const http = require('http');
const uuidv4 =  require('uuid/v4');
const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(process.env.SECRET_PATH, 'password.txt');

let counter = 0;
const uuid = uuidv4();
const handleRequest = function(request, response) {
  counter++;
  console.log('Received request for URL: ' + request.url);
  if(process.env.SECRET_PATH!= undefined || process.env.SECRET_PATH != 'undefined'){
      fs.readFile(dataFilePath, function(err, data) {
        response.writeHead(200);
        response.write(`\nSecret value from template:${process.env.SECRET_USERNAME}\n`);
        if(!err){
            response.write(`\nSecret value from volume: ${data}\n`);
        } else {
            response.write(`\nError when reading from secret volume: ${err}`);
        }
        response.end(`\nHello WorldV1!\nCalled ${counter} times!\n${uuid}\n`);
      });

  } else{
      response.writeHead(200);
      response.write(`\nSecret value1 from template:${process.env.SECRET_USERNAME}\n`);
      response.write(`\nUnable to read from secret volume!`);
      response.end(`\nHello WorldV1!\nCalled ${counter} times!\n${uuid}\n`);
  }
};
const www = http.createServer(handleRequest);
www.listen(4080);
console.log('listening on 4080');
